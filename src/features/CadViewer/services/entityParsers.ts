/**
 * CAD Viewer - Shared Entity Parsers
 * DXF 엔티티를 파싱하는 공유 함수들
 *
 * useDXFParser.ts와 dxfParser.worker.ts에서 공통으로 사용
 * DRY 원칙 준수를 위해 분리됨
 */

import type {
    DXFLibEntity,
    DXFLibHatchBoundary,
    DXFLibPoint,
    HatchBoundaryPath,
    ParsedArc,
    ParsedCircle,
    ParsedHatch,
    ParsedLine,
    ParsedPolyline,
    Point3D,
} from '../types';

// ============================================================
// 유틸리티 함수
// ============================================================

/**
 * DXFLibPoint를 Point3D로 변환
 * 누락된 좌표는 0으로 기본값 설정
 */
export function toPoint3D(point: DXFLibPoint | undefined): Point3D {
    return {
        x: point?.x ?? 0,
        y: point?.y ?? 0,
        z: point?.z ?? 0,
    };
}

/**
 * DXFLibPoint 배열을 Point3D 배열로 변환
 */
export function toPoint3DArray(points: DXFLibPoint[] | undefined): Point3D[] {
    return (points ?? []).map(toPoint3D);
}

// ============================================================
// 엔티티 파싱 함수
// ============================================================

/**
 * LINE 엔티티 파싱
 * @param entity DXF 라이브러리 엔티티
 * @returns 파싱된 LINE 또는 유효하지 않으면 null
 */
export function parseLine(entity: DXFLibEntity): ParsedLine | null {
    const hasVertices = entity.vertices && entity.vertices.length >= 2;
    const hasStartEnd = entity.start && entity.end;

    if (!hasVertices && !hasStartEnd) {
        if (import.meta.env?.DEV) {
            console.warn('Invalid LINE entity: missing coordinates', entity);
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

/**
 * CIRCLE 엔티티 파싱
 * @param entity DXF 라이브러리 엔티티
 * @returns 파싱된 CIRCLE 또는 유효하지 않으면 null
 */
export function parseCircle(entity: DXFLibEntity): ParsedCircle | null {
    const radius = entity.radius ?? 1;

    // 유효하지 않은 radius 검증 (음수, 0, NaN, Infinity)
    if (radius <= 0 || !isFinite(radius)) {
        if (import.meta.env?.DEV) {
            console.warn('Invalid CIRCLE entity: invalid radius', {
                radius,
                entity,
            });
        }
        return null;
    }

    return {
        center: toPoint3D(entity.center),
        radius,
        layer: entity.layer,
    };
}

/**
 * ARC 엔티티 파싱
 * @param entity DXF 라이브러리 엔티티
 * @returns 파싱된 ARC 또는 유효하지 않으면 null
 */
export function parseArc(entity: DXFLibEntity): ParsedArc | null {
    const radius = entity.radius ?? 1;

    // 유효하지 않은 radius 검증 (음수, 0, NaN, Infinity)
    if (radius <= 0 || !isFinite(radius)) {
        if (import.meta.env?.DEV) {
            console.warn('Invalid ARC entity: invalid radius', {
                radius,
                entity,
            });
        }
        return null;
    }

    return {
        center: toPoint3D(entity.center),
        radius,
        startAngle: entity.startAngle ?? 0,
        endAngle: entity.endAngle ?? 360,
        layer: entity.layer,
    };
}

/**
 * POLYLINE/LWPOLYLINE 엔티티 파싱
 * @param entity DXF 라이브러리 엔티티
 * @returns 파싱된 POLYLINE 또는 유효하지 않으면 null
 */
export function parsePolyline(entity: DXFLibEntity): ParsedPolyline | null {
    const vertices = toPoint3DArray(entity.vertices);

    if (vertices.length < 2) {
        return null;
    }

    return {
        vertices,
        closed: entity.shape ?? false,
        layer: entity.layer,
    };
}

/**
 * HATCH 경계 경로 파싱
 * @param boundary DXF 라이브러리 HATCH 경계
 * @returns 파싱된 경계 경로 또는 유효하지 않으면 null
 */
export function parseHatchBoundary(
    boundary: DXFLibHatchBoundary
): HatchBoundaryPath | null {
    // 폴리라인 경계
    if (boundary.vertices && boundary.vertices.length >= 3) {
        return {
            type: 'polyline',
            vertices: toPoint3DArray(boundary.vertices),
            closed: true,
        };
    }

    // 원형 경계 (startAngle이 없으면 완전한 원)
    if (
        boundary.center &&
        boundary.radius !== undefined &&
        boundary.startAngle === undefined
    ) {
        return {
            type: 'circle',
            center: toPoint3D(boundary.center),
            radius: boundary.radius,
        };
    }

    // 호형 경계
    if (
        boundary.center &&
        boundary.radius !== undefined &&
        boundary.startAngle !== undefined
    ) {
        return {
            type: 'arc',
            center: toPoint3D(boundary.center),
            radius: boundary.radius,
            startAngle: boundary.startAngle,
            endAngle: boundary.endAngle ?? 360,
        };
    }

    return null;
}

/**
 * HATCH 엔티티 파싱
 * @param entity DXF 라이브러리 엔티티
 * @returns 파싱된 HATCH 또는 유효하지 않으면 null
 */
export function parseHatch(entity: DXFLibEntity): ParsedHatch | null {
    const boundaries: HatchBoundaryPath[] = [];

    if (entity.boundary && Array.isArray(entity.boundary)) {
        for (const b of entity.boundary as DXFLibHatchBoundary[]) {
            const parsed = parseHatchBoundary(b);
            if (parsed) {
                boundaries.push(parsed);
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
// 배치 파싱 함수 (전체 엔티티 배열 처리)
// ============================================================

/**
 * 엔티티 배열에서 특정 타입 추출 및 파싱
 */
export interface ParsedEntities {
    lines: ParsedLine[];
    circles: ParsedCircle[];
    arcs: ParsedArc[];
    polylines: ParsedPolyline[];
    hatches: ParsedHatch[];
}

/**
 * 모든 엔티티를 한 번의 순회로 파싱
 * 성능 최적화: O(n) 단일 순회
 *
 * @param entities DXF 라이브러리 엔티티 배열
 * @param onEntity 각 엔티티 처리 후 콜백 (옵션, 진행률 표시용)
 * @returns 파싱된 엔티티 객체
 */
export function parseAllEntities(
    entities: DXFLibEntity[],
    onEntity?: (index: number, total: number) => void
): ParsedEntities {
    const lines: ParsedLine[] = [];
    const circles: ParsedCircle[] = [];
    const arcs: ParsedArc[] = [];
    const polylines: ParsedPolyline[] = [];
    const hatches: ParsedHatch[] = [];

    const total = entities.length;

    for (let i = 0; i < total; i++) {
        const entity = entities[i];
        if (!entity) continue;

        // 진행률 콜백
        if (onEntity) {
            onEntity(i, total);
        }

        switch (entity.type) {
            case 'LINE': {
                const line = parseLine(entity);
                if (line) lines.push(line);
                break;
            }
            case 'CIRCLE': {
                const circle = parseCircle(entity);
                if (circle) circles.push(circle);
                break;
            }
            case 'ARC': {
                const arc = parseArc(entity);
                if (arc) arcs.push(arc);
                break;
            }
            case 'LWPOLYLINE':
            case 'POLYLINE': {
                const polyline = parsePolyline(entity);
                if (polyline) polylines.push(polyline);
                break;
            }
            case 'HATCH': {
                const hatch = parseHatch(entity);
                if (hatch) hatches.push(hatch);
                break;
            }
            // 지원하지 않는 엔티티 타입은 무시
        }
    }

    return { lines, circles, arcs, polylines, hatches };
}

/**
 * 파싱된 엔티티의 총 개수 계산
 */
export function getTotalEntityCount(entities: ParsedEntities): number {
    return (
        entities.lines.length +
        entities.circles.length +
        entities.arcs.length +
        entities.polylines.length +
        entities.hatches.length
    );
}
