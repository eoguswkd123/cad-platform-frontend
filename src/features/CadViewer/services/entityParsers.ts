/**
 * CAD Viewer - Shared Entity Parsers
 * DXF 엔티티를 파싱하는 공유 함수들
 *
 * useDXFParser.ts와 dxfParser.worker.ts에서 공통으로 사용
 * DRY 원칙 준수를 위해 분리됨
 */

import type {
    DimensionType,
    HatchBoundaryPath,
    MTextAttachment,
    ParsedArc,
    ParsedCircle,
    ParsedDimension,
    ParsedEllipse,
    ParsedHatch,
    ParsedLine,
    ParsedMText,
    ParsedPolyline,
    ParsedSpline,
    ParsedText,
    Point3D,
    TextHorizontalAlignment,
} from '@/types/cad';

import type { DXFLibEntity } from '../types';
import type {
    DXFLibHatchBoundary,
    DXFLibPoint,
} from '../types/dxfEntity/library';

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
// Phase 2.1.4: 추가 엔티티 파싱 함수
// ============================================================

/**
 * TEXT 수평 정렬 매핑
 * DXF 그룹 코드 72: 0=left, 1=center, 2=right
 */
function mapTextAlignment(code: number | undefined): TextHorizontalAlignment {
    switch (code) {
        case 1:
            return 'center';
        case 2:
            return 'right';
        default:
            return 'left';
    }
}

/**
 * TEXT 엔티티 파싱
 * @param entity DXF 라이브러리 엔티티
 * @returns 파싱된 TEXT 또는 유효하지 않으면 null
 */
export function parseText(entity: DXFLibEntity): ParsedText | null {
    const content = entity.text;

    // 빈 텍스트 검증
    if (!content || content.trim() === '') {
        if (import.meta.env?.DEV) {
            console.warn('Invalid TEXT entity: empty content', entity);
        }
        return null;
    }

    const height = entity.textHeight ?? 1;

    // 유효하지 않은 height 검증 (음수, 0, NaN, Infinity)
    if (height <= 0 || !isFinite(height)) {
        if (import.meta.env?.DEV) {
            console.warn('Invalid TEXT entity: invalid height', {
                height,
                entity,
            });
        }
        return null;
    }

    return {
        content,
        position: toPoint3D(entity.center ?? entity.start),
        height,
        rotation: entity.textRotation ?? 0,
        alignment: mapTextAlignment(entity.horizontalJustification),
        styleName: entity.textStyleName,
        layer: entity.layer,
    };
}

/**
 * MTEXT Attachment Point 매핑
 * DXF 그룹 코드 71: 1-9 (3x3 grid)
 */
function mapMTextAttachment(code: number | undefined): MTextAttachment {
    switch (code) {
        case 1:
            return 'top-left';
        case 2:
            return 'top-center';
        case 3:
            return 'top-right';
        case 4:
            return 'middle-left';
        case 5:
            return 'middle-center';
        case 6:
            return 'middle-right';
        case 7:
            return 'bottom-left';
        case 8:
            return 'bottom-center';
        case 9:
            return 'bottom-right';
        default:
            return 'top-left';
    }
}

/**
 * MTEXT 서식 코드 파싱
 * DXF 특수 문자 및 서식 코드를 일반 텍스트로 변환
 */
export function parseMTextFormatting(rawContent: string): string {
    let content = rawContent;

    // DXF 특수 문자 변환
    content = content.replace(/%%c/gi, 'Ø'); // 지름 기호
    content = content.replace(/%%d/gi, '°'); // 도 기호
    content = content.replace(/%%p/gi, '±'); // 플러스마이너스 기호
    content = content.replace(/%%u/gi, ''); // 밑줄 시작 (제거)
    content = content.replace(/%%o/gi, ''); // 윗줄 시작 (제거)
    content = content.replace(/%%%/g, '%'); // 퍼센트 기호

    // MTEXT 서식 코드 제거/변환
    content = content.replace(/\\P/g, '\n'); // 줄바꿈
    content = content.replace(/\\~/g, ' '); // 비분리 공백
    content = content.replace(/\\\\/g, '\\'); // 백슬래시
    content = content.replace(/\\{/g, '{'); // 중괄호
    content = content.replace(/\\}/g, '}'); // 중괄호

    // 서식 코드 제거 (폰트, 색상, 높이 등)
    content = content.replace(/\\[fFcCHhWwQqAaTtLlOo][^;]*;/g, '');

    // 스택/분수 표현 단순화: \S1/2; → 1/2
    content = content.replace(/\\S([^;]*);/g, '$1');

    // 중괄호 그룹 제거 (서식 그룹)
    content = content.replace(/[{}]/g, '');

    return content.trim();
}

/**
 * MTEXT 엔티티 파싱
 * @param entity DXF 라이브러리 엔티티
 * @returns 파싱된 MTEXT 또는 유효하지 않으면 null
 */
export function parseMText(entity: DXFLibEntity): ParsedMText | null {
    const rawContent = entity.text;

    // 빈 텍스트 검증
    if (!rawContent || rawContent.trim() === '') {
        if (import.meta.env?.DEV) {
            console.warn('Invalid MTEXT entity: empty content', entity);
        }
        return null;
    }

    const height = entity.textHeight ?? 1;

    // 유효하지 않은 height 검증
    if (height <= 0 || !isFinite(height)) {
        if (import.meta.env?.DEV) {
            console.warn('Invalid MTEXT entity: invalid height', {
                height,
                entity,
            });
        }
        return null;
    }

    return {
        content: parseMTextFormatting(rawContent),
        rawContent,
        position: toPoint3D(entity.center ?? entity.start),
        height,
        width: entity.referenceRectangleWidth ?? 0,
        rotation: entity.textRotation ?? 0,
        attachment: mapMTextAttachment(entity.attachmentPoint),
        layer: entity.layer,
    };
}

/**
 * ELLIPSE 엔티티 파싱
 * @param entity DXF 라이브러리 엔티티
 * @returns 파싱된 ELLIPSE 또는 유효하지 않으면 null
 */
export function parseEllipse(entity: DXFLibEntity): ParsedEllipse | null {
    const majorAxisEnd = entity.majorAxisEndPoint;

    // 장축 끝점 필수
    if (!majorAxisEnd) {
        if (import.meta.env?.DEV) {
            console.warn(
                'Invalid ELLIPSE entity: missing majorAxisEndPoint',
                entity
            );
        }
        return null;
    }

    const axisRatio = entity.axisRatio ?? 1;

    // 유효하지 않은 축 비율 검증 (0 < ratio <= 1)
    if (axisRatio <= 0 || axisRatio > 1 || !isFinite(axisRatio)) {
        if (import.meta.env?.DEV) {
            console.warn('Invalid ELLIPSE entity: invalid axisRatio', {
                axisRatio,
                entity,
            });
        }
        return null;
    }

    return {
        center: toPoint3D(entity.center),
        majorAxisEnd: toPoint3D(majorAxisEnd),
        minorAxisRatio: axisRatio,
        startParam: entity.startParameter ?? 0,
        endParam: entity.endParameter ?? Math.PI * 2,
        layer: entity.layer,
    };
}

/**
 * SPLINE 엔티티 파싱
 * @param entity DXF 라이브러리 엔티티
 * @returns 파싱된 SPLINE 또는 유효하지 않으면 null
 */
export function parseSpline(entity: DXFLibEntity): ParsedSpline | null {
    const controlPoints = toPoint3DArray(entity.controlPoints);

    // 최소 2개의 제어점 필요
    if (controlPoints.length < 2) {
        if (import.meta.env?.DEV) {
            console.warn('Invalid SPLINE entity: insufficient control points', {
                count: controlPoints.length,
                entity,
            });
        }
        return null;
    }

    const degree = entity.degreeOfSplineCurve ?? 3;

    // 유효하지 않은 차수 검증
    if (degree < 1 || !Number.isInteger(degree)) {
        if (import.meta.env?.DEV) {
            console.warn('Invalid SPLINE entity: invalid degree', {
                degree,
                entity,
            });
        }
        return null;
    }

    // 플래그에서 닫힘 여부 확인 (bit 0)
    const closed = ((entity.flag ?? 0) & 1) === 1;

    return {
        controlPoints,
        degree,
        knots: entity.knotValues,
        weights: entity.weights,
        closed,
        layer: entity.layer,
    };
}

/**
 * DIMENSION 타입 매핑
 * DXF 그룹 코드 70: 0-6 (하위 비트만 사용)
 */
function mapDimensionType(code: number | undefined): DimensionType {
    const dimType = (code ?? 0) & 0x0f; // 하위 4비트만 사용
    switch (dimType) {
        case 0:
            return 'linear';
        case 1:
            return 'aligned';
        case 2:
            return 'angular';
        case 3:
            return 'diameter';
        case 4:
            return 'radius';
        case 5:
            return 'angular3';
        case 6:
            return 'ordinate';
        default:
            return 'linear';
    }
}

/**
 * DIMENSION 엔티티 파싱
 * @param entity DXF 라이브러리 엔티티
 * @returns 파싱된 DIMENSION 또는 유효하지 않으면 null
 */
export function parseDimension(entity: DXFLibEntity): ParsedDimension | null {
    // 정의점 1은 center 또는 start에서 가져옴
    const defPoint1 = entity.center ?? entity.start;
    const defPoint2 = entity.defPoint2;

    // 최소 2개의 정의점 필요
    if (!defPoint1 || !defPoint2) {
        if (import.meta.env?.DEV) {
            console.warn(
                'Invalid DIMENSION entity: missing definition points',
                entity
            );
        }
        return null;
    }

    return {
        dimensionType: mapDimensionType(entity.dimensionType),
        defPoint1: toPoint3D(defPoint1),
        defPoint2: toPoint3D(defPoint2),
        defPoint3: entity.defPoint3 ? toPoint3D(entity.defPoint3) : undefined,
        defPoint4: entity.defPoint4 ? toPoint3D(entity.defPoint4) : undefined,
        textMidPoint: toPoint3D(entity.textMidPoint),
        text: entity.dimensionText ?? '',
        rotation: entity.textRotation ?? 0,
        styleName: entity.dimensionStyleName,
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
    // Phase 2.1.4: 추가 엔티티
    texts: ParsedText[];
    mtexts: ParsedMText[];
    ellipses: ParsedEllipse[];
    splines: ParsedSpline[];
    dimensions: ParsedDimension[];
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
    // Phase 2.1.4: 추가 엔티티 배열
    const texts: ParsedText[] = [];
    const mtexts: ParsedMText[] = [];
    const ellipses: ParsedEllipse[] = [];
    const splines: ParsedSpline[] = [];
    const dimensions: ParsedDimension[] = [];

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
            // Phase 2.1.4: 추가 엔티티 타입
            case 'TEXT': {
                const text = parseText(entity);
                if (text) texts.push(text);
                break;
            }
            case 'MTEXT': {
                const mtext = parseMText(entity);
                if (mtext) mtexts.push(mtext);
                break;
            }
            case 'ELLIPSE': {
                const ellipse = parseEllipse(entity);
                if (ellipse) ellipses.push(ellipse);
                break;
            }
            case 'SPLINE': {
                const spline = parseSpline(entity);
                if (spline) splines.push(spline);
                break;
            }
            case 'DIMENSION': {
                const dimension = parseDimension(entity);
                if (dimension) dimensions.push(dimension);
                break;
            }
            // 지원하지 않는 엔티티 타입은 무시
        }
    }

    return {
        lines,
        circles,
        arcs,
        polylines,
        hatches,
        texts,
        mtexts,
        ellipses,
        splines,
        dimensions,
    };
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
        entities.hatches.length +
        // Phase 2.1.4: 추가 엔티티
        entities.texts.length +
        entities.mtexts.length +
        entities.ellipses.length +
        entities.splines.length +
        entities.dimensions.length
    );
}
