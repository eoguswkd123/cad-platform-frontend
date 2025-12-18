/**
 * CAD Viewer - DXF Parser Web Worker
 * 대용량 DXF 파일을 메인 스레드 블로킹 없이 파싱
 * @version 3 - 성능 최적화 및 에러 핸들링 개선
 */

import DxfParser from 'dxf-parser';

import type {
    BoundingBox,
    DXFLibEntity,
    DXFLibHatchBoundary,
    DXFLibLayer,
    DXFLibPoint,
    HatchBoundaryPath,
    LayerInfo,
    ParsedArc,
    ParsedCircle,
    ParsedHatch,
    ParsedLine,
    ParsedPolyline,
    Point3D,
} from '@/types/dxf';

import { DEFAULT_BOUNDS, DEFAULT_LAYER_COLOR } from './constants';
import { aciToHex, getArcBounds } from './utils';

import type { WorkerErrorCode, WorkerRequest, WorkerResponse } from './types';

/** 레이어 카운트 증가 */
function countLayer(
    layers: Map<string, LayerInfo>,
    layerName: string | undefined
): void {
    const name = layerName ?? '0';
    if (!layers.has(name)) {
        layers.set(name, {
            name,
            color: DEFAULT_LAYER_COLOR,
            visible: true,
            entityCount: 0,
        });
    }
    const layer = layers.get(name)!;
    layer.entityCount++;
}

// ============================================================
// 엔티티 파싱 함수들
// ============================================================

/** LINE 엔티티 파싱 */
function parseLine(entity: DXFLibEntity): ParsedLine | null {
    const hasVertices = entity.vertices && entity.vertices.length >= 2;
    const hasStartEnd = entity.start && entity.end;

    if (!hasVertices && !hasStartEnd) {
        if (import.meta.env.DEV) {
            console.warn(`Invalid LINE entity: missing coordinates`, entity);
        }
        return null;
    }

    const start: Point3D = {
        x: entity.vertices?.[0]?.x ?? entity.start?.x ?? 0,
        y: entity.vertices?.[0]?.y ?? entity.start?.y ?? 0,
        z: entity.vertices?.[0]?.z ?? entity.start?.z ?? 0,
    };
    const end: Point3D = {
        x: entity.vertices?.[1]?.x ?? entity.end?.x ?? 0,
        y: entity.vertices?.[1]?.y ?? entity.end?.y ?? 0,
        z: entity.vertices?.[1]?.z ?? entity.end?.z ?? 0,
    };

    return { start, end, layer: entity.layer };
}

/** CIRCLE 엔티티 파싱 */
function parseCircle(entity: DXFLibEntity): ParsedCircle {
    return {
        center: {
            x: entity.center?.x ?? 0,
            y: entity.center?.y ?? 0,
            z: entity.center?.z ?? 0,
        },
        radius: entity.radius ?? 1,
        layer: entity.layer,
    };
}

/** ARC 엔티티 파싱 */
function parseArc(entity: DXFLibEntity): ParsedArc {
    return {
        center: {
            x: entity.center?.x ?? 0,
            y: entity.center?.y ?? 0,
            z: entity.center?.z ?? 0,
        },
        radius: entity.radius ?? 1,
        startAngle: entity.startAngle ?? 0,
        endAngle: entity.endAngle ?? 360,
        layer: entity.layer,
    };
}

/** POLYLINE 엔티티 파싱 */
function parsePolyline(entity: DXFLibEntity): ParsedPolyline | null {
    const vertices: Point3D[] = (entity.vertices ?? []).map(
        (v: DXFLibPoint) => ({
            x: v.x ?? 0,
            y: v.y ?? 0,
            z: v.z ?? 0,
        })
    );

    if (vertices.length < 2) {
        return null;
    }

    return {
        vertices,
        closed: entity.shape ?? false,
        layer: entity.layer,
    };
}

/** HATCH 엔티티 파싱 */
function parseHatch(entity: DXFLibEntity): ParsedHatch | null {
    const boundaries: HatchBoundaryPath[] = [];

    if (entity.boundary && Array.isArray(entity.boundary)) {
        for (const b of entity.boundary as DXFLibHatchBoundary[]) {
            // 폴리라인 경계
            if (b.vertices && b.vertices.length >= 3) {
                boundaries.push({
                    type: 'polyline',
                    vertices: b.vertices.map((v: DXFLibPoint) => ({
                        x: v.x ?? 0,
                        y: v.y ?? 0,
                        z: v.z ?? 0,
                    })),
                    closed: true,
                });
            }
            // 원형 경계
            else if (
                b.center &&
                b.radius !== undefined &&
                b.startAngle === undefined
            ) {
                boundaries.push({
                    type: 'circle',
                    center: {
                        x: b.center.x ?? 0,
                        y: b.center.y ?? 0,
                        z: b.center.z ?? 0,
                    },
                    radius: b.radius,
                });
            }
            // 호형 경계
            else if (
                b.center &&
                b.radius !== undefined &&
                b.startAngle !== undefined
            ) {
                boundaries.push({
                    type: 'arc',
                    center: {
                        x: b.center.x ?? 0,
                        y: b.center.y ?? 0,
                        z: b.center.z ?? 0,
                    },
                    radius: b.radius,
                    startAngle: b.startAngle,
                    endAngle: b.endAngle ?? 360,
                });
            }
        }
    }

    if (boundaries.length === 0) {
        return null;
    }

    const patternName = entity.patternName ?? 'SOLID';

    return {
        boundaries,
        patternName,
        isSolid:
            entity.solidFill === 1 || patternName.toUpperCase() === 'SOLID',
        patternScale: entity.patternScale ?? 1,
        patternAngle: entity.patternAngle ?? 0,
        color: entity.colorIndex,
        layer: entity.layer,
    };
}

// ============================================================
// 바운딩 박스 계산
// ============================================================

/** 바운딩 박스 계산 (모든 엔티티 타입 포함) */
function calculateBounds(
    lines: ParsedLine[],
    circles: ParsedCircle[],
    arcs: ParsedArc[],
    polylines: ParsedPolyline[],
    hatches: ParsedHatch[]
): BoundingBox {
    let minX = Infinity,
        minY = Infinity,
        minZ = Infinity;
    let maxX = -Infinity,
        maxY = -Infinity,
        maxZ = -Infinity;

    // LINE 엔티티
    for (const line of lines) {
        minX = Math.min(minX, line.start.x, line.end.x);
        minY = Math.min(minY, line.start.y, line.end.y);
        minZ = Math.min(minZ, line.start.z, line.end.z);
        maxX = Math.max(maxX, line.start.x, line.end.x);
        maxY = Math.max(maxY, line.start.y, line.end.y);
        maxZ = Math.max(maxZ, line.start.z, line.end.z);
    }

    // CIRCLE 엔티티
    for (const circle of circles) {
        minX = Math.min(minX, circle.center.x - circle.radius);
        minY = Math.min(minY, circle.center.y - circle.radius);
        minZ = Math.min(minZ, circle.center.z);
        maxX = Math.max(maxX, circle.center.x + circle.radius);
        maxY = Math.max(maxY, circle.center.y + circle.radius);
        maxZ = Math.max(maxZ, circle.center.z);
    }

    // ARC 엔티티 (정확한 바운딩박스 계산)
    for (const arc of arcs) {
        const arcBounds = getArcBounds(arc);
        minX = Math.min(minX, arcBounds.min.x);
        minY = Math.min(minY, arcBounds.min.y);
        minZ = Math.min(minZ, arcBounds.min.z);
        maxX = Math.max(maxX, arcBounds.max.x);
        maxY = Math.max(maxY, arcBounds.max.y);
        maxZ = Math.max(maxZ, arcBounds.max.z);
    }

    // POLYLINE 엔티티
    for (const polyline of polylines) {
        for (const vertex of polyline.vertices) {
            minX = Math.min(minX, vertex.x);
            minY = Math.min(minY, vertex.y);
            minZ = Math.min(minZ, vertex.z);
            maxX = Math.max(maxX, vertex.x);
            maxY = Math.max(maxY, vertex.y);
            maxZ = Math.max(maxZ, vertex.z);
        }
    }

    // HATCH 엔티티
    for (const hatch of hatches) {
        for (const boundary of hatch.boundaries) {
            if (boundary.type === 'polyline') {
                for (const vertex of boundary.vertices) {
                    minX = Math.min(minX, vertex.x);
                    minY = Math.min(minY, vertex.y);
                    minZ = Math.min(minZ, vertex.z);
                    maxX = Math.max(maxX, vertex.x);
                    maxY = Math.max(maxY, vertex.y);
                    maxZ = Math.max(maxZ, vertex.z);
                }
            } else if (boundary.type === 'arc') {
                const arcBounds = getArcBounds({
                    center: boundary.center,
                    radius: boundary.radius,
                    startAngle: boundary.startAngle,
                    endAngle: boundary.endAngle,
                    layer: hatch.layer,
                });
                minX = Math.min(minX, arcBounds.min.x);
                minY = Math.min(minY, arcBounds.min.y);
                minZ = Math.min(minZ, arcBounds.min.z);
                maxX = Math.max(maxX, arcBounds.max.x);
                maxY = Math.max(maxY, arcBounds.max.y);
                maxZ = Math.max(maxZ, arcBounds.max.z);
            } else if (boundary.type === 'circle') {
                minX = Math.min(minX, boundary.center.x - boundary.radius);
                minY = Math.min(minY, boundary.center.y - boundary.radius);
                minZ = Math.min(minZ, boundary.center.z);
                maxX = Math.max(maxX, boundary.center.x + boundary.radius);
                maxY = Math.max(maxY, boundary.center.y + boundary.radius);
                maxZ = Math.max(maxZ, boundary.center.z);
            } else if (boundary.type === 'ellipse') {
                const majorLength = Math.sqrt(
                    boundary.majorAxisEndPoint.x ** 2 +
                        boundary.majorAxisEndPoint.y ** 2
                );
                minX = Math.min(minX, boundary.center.x - majorLength);
                minY = Math.min(minY, boundary.center.y - majorLength);
                minZ = Math.min(minZ, boundary.center.z);
                maxX = Math.max(maxX, boundary.center.x + majorLength);
                maxY = Math.max(maxY, boundary.center.y + majorLength);
                maxZ = Math.max(maxZ, boundary.center.z);
            }
        }
    }

    // 엔티티가 없으면 기본 바운딩 박스 반환
    if (minX === Infinity) {
        return DEFAULT_BOUNDS;
    }

    return {
        min: { x: minX, y: minY, z: minZ },
        max: { x: maxX, y: maxY, z: maxZ },
    };
}

// ============================================================
// 진행률 및 에러 처리
// ============================================================

/** 진행률 전송 */
function sendProgress(stage: string, percent: number): void {
    self.postMessage({
        type: 'progress',
        payload: { stage, percent },
    } as WorkerResponse);
}

/** 에러 코드 판별 */
function getErrorCode(err: unknown): WorkerErrorCode {
    if (err instanceof Error) {
        const msg = err.message.toLowerCase();
        if (msg === 'empty_file') return 'EMPTY_FILE';
        if (msg.includes('invalid') || msg.includes('unexpected'))
            return 'INVALID_FORMAT';
        if (msg.includes('parse') || msg.includes('syntax'))
            return 'PARSE_ERROR';
    }
    return 'UNKNOWN_ERROR';
}

// ============================================================
// 메인 파싱 함수
// ============================================================

/** DXF 파싱 메인 함수 */
function parseDXF(text: string, fileName: string, fileSize: number): void {
    const startTime = performance.now();

    try {
        sendProgress('DXF 파싱 중...', 10);

        const parser = new DxfParser();
        const dxf = parser.parseSync(text);

        if (!dxf || !dxf.entities) {
            throw new Error('INVALID_FORMAT');
        }

        sendProgress('엔티티 추출 중...', 30);

        // 레이어 정보 먼저 구축
        const layers = new Map<string, LayerInfo>();
        const dxfLayers = dxf.tables?.layer?.layers ?? {};

        for (const [layerName, layerData] of Object.entries(dxfLayers)) {
            const layer = layerData as DXFLibLayer;
            let hexColor: string;

            if (typeof layer.color === 'number') {
                // color 범위 검증
                if (layer.color < 0 || layer.color > 0xffffff) {
                    hexColor = DEFAULT_LAYER_COLOR;
                } else {
                    hexColor = '#' + layer.color.toString(16).padStart(6, '0');
                }
            } else {
                hexColor = aciToHex(layer.colorIndex);
            }

            layers.set(layerName, {
                name: layerName,
                color: hexColor,
                visible: true,
                entityCount: 0,
            });
        }

        // 단일 순회로 모든 엔티티 분류 및 레이어 카운트
        const lines: ParsedLine[] = [];
        const circles: ParsedCircle[] = [];
        const arcs: ParsedArc[] = [];
        const polylines: ParsedPolyline[] = [];
        const hatches: ParsedHatch[] = [];

        const entities = dxf.entities as DXFLibEntity[];
        const totalEntities = entities.length;

        for (let i = 0; i < totalEntities; i++) {
            const entity = entities[i];
            if (!entity) continue;

            // 진행률 업데이트 (10% 단위)
            if (i % Math.max(1, Math.floor(totalEntities / 10)) === 0) {
                const progress = 30 + Math.floor((i / totalEntities) * 50);
                sendProgress('엔티티 추출 중...', progress);
            }

            switch (entity.type) {
                case 'LINE': {
                    const line = parseLine(entity);
                    if (line) {
                        lines.push(line);
                        countLayer(layers, entity.layer);
                    }
                    break;
                }
                case 'CIRCLE': {
                    circles.push(parseCircle(entity));
                    countLayer(layers, entity.layer);
                    break;
                }
                case 'ARC': {
                    arcs.push(parseArc(entity));
                    countLayer(layers, entity.layer);
                    break;
                }
                case 'LWPOLYLINE':
                case 'POLYLINE': {
                    const polyline = parsePolyline(entity);
                    if (polyline) {
                        polylines.push(polyline);
                        countLayer(layers, entity.layer);
                    }
                    break;
                }
                case 'HATCH': {
                    const hatch = parseHatch(entity);
                    if (hatch) {
                        hatches.push(hatch);
                        countLayer(layers, entity.layer);
                    }
                    break;
                }
                // 지원하지 않는 엔티티 타입은 무시
            }
        }

        const totalEntityCount =
            lines.length +
            circles.length +
            arcs.length +
            polylines.length +
            hatches.length;

        if (totalEntityCount === 0) {
            throw new Error('EMPTY_FILE');
        }

        sendProgress('완료!', 100);

        const endTime = performance.now();

        // Map을 배열로 변환 (직렬화 가능)
        const layersArray: [string, LayerInfo][] = Array.from(layers.entries());

        self.postMessage({
            type: 'success',
            payload: {
                lines,
                circles,
                arcs,
                polylines,
                hatches,
                bounds: calculateBounds(
                    lines,
                    circles,
                    arcs,
                    polylines,
                    hatches
                ),
                layers: layersArray,
                metadata: {
                    fileName,
                    fileSize,
                    entityCount: totalEntityCount,
                    parseTime: Math.round(endTime - startTime),
                },
            },
        } as WorkerResponse);
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        const code = getErrorCode(err);

        self.postMessage({
            type: 'error',
            payload: { code, message },
        } as WorkerResponse);
    }
}

// ============================================================
// 메시지 핸들러
// ============================================================

self.onmessage = (event: MessageEvent<WorkerRequest>) => {
    const { type, payload } = event.data;

    if (type === 'parse') {
        parseDXF(payload.text, payload.fileName, payload.fileSize);
    }
};

export {};
