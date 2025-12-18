/**
 * DXF Types - Library Output Definitions
 * dxf-parser npm 패키지가 반환하는 타입 정의
 *
 * 모든 필드가 옵셔널인 이유: 라이브러리 출력이 불안정할 수 있음
 * 파싱 후 정제된 타입은 ./parsed.ts 참조
 */

/** DXF 지원 엔티티 타입 */
export type DXFEntityType =
    | 'LINE'
    | 'CIRCLE'
    | 'ARC'
    | 'LWPOLYLINE'
    | 'POLYLINE'
    | 'HATCH'
    | 'POINT'
    | 'TEXT'
    | 'MTEXT'
    | 'SPLINE'
    | 'ELLIPSE'
    | 'INSERT'
    | 'DIMENSION'
    | 'SOLID'
    | '3DFACE'
    | (string & {}); // 알 수 없는 타입 허용 (확장성)

/** dxf-parser 라이브러리 포인트 */
export interface DXFLibPoint {
    x?: number;
    y?: number;
    z?: number;
}

/** dxf-parser 라이브러리 HATCH 경계 정보 */
export interface DXFLibHatchBoundary {
    type?: number;
    vertices?: DXFLibPoint[];
    center?: DXFLibPoint;
    radius?: number;
    startAngle?: number;
    endAngle?: number;
}

/** dxf-parser 라이브러리 엔티티 */
export interface DXFLibEntity {
    type: DXFEntityType;
    layer?: string;
    vertices?: DXFLibPoint[];
    start?: DXFLibPoint;
    end?: DXFLibPoint;
    center?: DXFLibPoint;
    radius?: number;
    startAngle?: number;
    endAngle?: number;
    shape?: boolean;
    /** HATCH 엔티티용 필드 */
    boundary?: DXFLibHatchBoundary[];
    patternName?: string;
    solidFill?: number;
    patternScale?: number;
    patternAngle?: number;
    colorIndex?: number;
}

/** dxf-parser 라이브러리 레이어 */
export interface DXFLibLayer {
    name?: string;
    color?: number;
    colorIndex?: number;
}
