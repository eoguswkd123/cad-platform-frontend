/**
 * DXF Types - Base Definitions
 * 기본 타입 정의 (앱 전체에서 사용)
 */

/** 3D 좌표 */
export interface Point3D {
    x: number;
    y: number;
    z: number;
}

/** 바운딩 박스 */
export interface BoundingBox {
    min: Point3D;
    max: Point3D;
}

/** 레이어 정보 */
export interface LayerInfo {
    /** 레이어 이름 */
    name: string;
    /** 레이어 색상 (hex) */
    color: string;
    /** 가시성 여부 */
    visible: boolean;
    /** 해당 레이어의 엔티티 수 */
    entityCount: number;
}

/** CAD 파일 메타데이터 */
export interface CADMetadata {
    /** 파일명 */
    fileName: string;
    /** 파일 크기 (bytes) */
    fileSize: number;
    /** 엔티티 수 */
    entityCount: number;
    /** 파싱 시간 (ms) */
    parseTime: number;
}
