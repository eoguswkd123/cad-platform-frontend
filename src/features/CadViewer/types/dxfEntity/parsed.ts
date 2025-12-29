/**
 * DXF Types - Parsed Entity Definitions
 * 파싱된 앱 데이터 타입 정의
 *
 * dxf-parser 라이브러리 출력을 정제한 안전한 타입
 * 라이브러리 원본 타입은 ./library.ts 참조
 */

import type { BoundingBox, CADMetadata, LayerInfo, Point3D } from './base';

/** 파싱된 LINE 엔티티 */
export interface ParsedLine {
    /** 시작점 */
    start: Point3D;
    /** 끝점 */
    end: Point3D;
    /** 레이어 이름 */
    layer: string | undefined;
}

/** 파싱된 CIRCLE 엔티티 */
export interface ParsedCircle {
    /** 중심점 */
    center: Point3D;
    /** 반지름 */
    radius: number;
    /** 레이어 이름 */
    layer: string | undefined;
}

/** 파싱된 ARC 엔티티 */
export interface ParsedArc {
    /** 중심점 */
    center: Point3D;
    /** 반지름 */
    radius: number;
    /** 시작 각도 (degree) */
    startAngle: number;
    /** 끝 각도 (degree) */
    endAngle: number;
    /** 레이어 이름 */
    layer: string | undefined;
}

/** 파싱된 POLYLINE 엔티티 */
export interface ParsedPolyline {
    /** 정점 배열 */
    vertices: Point3D[];
    /** 닫힌 폴리라인 여부 */
    closed: boolean;
    /** 레이어 이름 */
    layer: string | undefined;
}

/** HATCH 경계 경로 타입 */
export type HatchBoundaryType = 'polyline' | 'circle' | 'arc' | 'ellipse';

/** HATCH Polyline 경계 경로 */
export interface HatchBoundaryPolyline {
    /** 경계 타입 */
    type: 'polyline';
    /** 정점 배열 */
    vertices: Point3D[];
    /** 닫힘 여부 */
    closed: boolean;
}

/** HATCH Circle 경계 경로 */
export interface HatchBoundaryCircle {
    /** 경계 타입 */
    type: 'circle';
    /** 중심점 */
    center: Point3D;
    /** 반지름 */
    radius: number;
}

/** HATCH Arc 경계 경로 */
export interface HatchBoundaryArc {
    /** 경계 타입 */
    type: 'arc';
    /** 중심점 */
    center: Point3D;
    /** 반지름 */
    radius: number;
    /** 시작 각도 (degree) */
    startAngle: number;
    /** 끝 각도 (degree) */
    endAngle: number;
}

/** HATCH Ellipse 경계 경로 */
export interface HatchBoundaryEllipse {
    /** 경계 타입 */
    type: 'ellipse';
    /** 중심점 */
    center: Point3D;
    /** 장축 끝점 (중심 기준 상대 좌표) */
    majorAxisEndPoint: Point3D;
    /** 단축/장축 비율 */
    axisRatio: number;
    /** 시작 각도 (radian) */
    startAngle: number;
    /** 끝 각도 (radian) */
    endAngle: number;
}

/** HATCH 경계 경로 (Discriminated Union) */
export type HatchBoundaryPath =
    | HatchBoundaryPolyline
    | HatchBoundaryCircle
    | HatchBoundaryArc
    | HatchBoundaryEllipse;

/** 파싱된 HATCH 엔티티 */
export interface ParsedHatch {
    /** 경계 경로 배열 (첫 번째는 외곽, 나머지는 홀) */
    boundaries: HatchBoundaryPath[];
    /** 패턴 이름 (SOLID, ANSI31, ACAD_ISO02W100 등) */
    patternName: string;
    /** 솔리드 채우기 여부 */
    isSolid: boolean;
    /** 패턴 스케일 */
    patternScale: number;
    /** 패턴 각도 (degree) */
    patternAngle: number;
    /** 색상 인덱스 (ACI) */
    color: number | undefined;
    /** 레이어 이름 */
    layer: string | undefined;
}

/** 파싱된 CAD 데이터 */
export interface ParsedCADData {
    /** LINE 엔티티 배열 */
    lines: ParsedLine[];
    /** CIRCLE 엔티티 배열 */
    circles: ParsedCircle[];
    /** ARC 엔티티 배열 */
    arcs: ParsedArc[];
    /** POLYLINE 엔티티 배열 */
    polylines: ParsedPolyline[];
    /** HATCH 엔티티 배열 */
    hatches: ParsedHatch[];
    /** 전체 도면의 바운딩 박스 */
    bounds: BoundingBox;
    /** 파일 메타데이터 */
    metadata: CADMetadata;
    /** 레이어 정보 맵 */
    layers: Map<string, LayerInfo>;
}
