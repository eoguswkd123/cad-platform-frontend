/**
 * Cad Viewer - Type Definitions
 * DXF Viewer 전용 타입 정의
 */

// DXF 엔티티 타입 re-export
export type {
    BoundingBox,
    CADMetadata,
    DXFLibEntity,
    DXFLibHatchBoundary,
    DXFLibLayer,
    DXFLibPoint,
    HatchBoundaryPath,
    HatchBoundaryType,
    LayerInfo,
    ParsedArc,
    ParsedCADData,
    ParsedCircle,
    ParsedHatch,
    ParsedLine,
    ParsedPolyline,
    Point3D,
} from './dxfEntity';

// DXF Worker 메시지 타입 re-export
export type {
    WorkerErrorCode,
    WorkerErrorPayload,
    WorkerProgressPayload,
    WorkerRequest,
    WorkerResponse,
    WorkerSuccessPayload,
} from './dxfWorkerMsg';

/** CAD 렌더링 모드 */
export type CadRenderMode = 'wireframe' | 'solid' | 'pattern';

/** Cad Viewer 설정 */
export interface CadViewerConfig {
    /** 그리드 표시 여부 */
    showGrid: boolean;
    /** 자동 회전 여부 */
    autoRotate: boolean;
    /** 회전 속도 */
    rotateSpeed: number;
    /** 배경색 */
    backgroundColor: string;
    /** 자동 카메라 조정 */
    autoFitCamera: boolean;
    /** 렌더링 모드 (wireframe/solid/pattern) */
    renderMode: CadRenderMode;
}

/** 파일 업로드 상태 */
export type UploadStatus = 'idle' | 'loading' | 'success' | 'error';

/** 파일 업로드 에러 */
export interface UploadError {
    code:
        | 'INVALID_TYPE'
        | 'FILE_TOO_LARGE'
        | 'PARSE_ERROR'
        | 'EMPTY_FILE'
        | 'WORKER_ERROR'
        | 'TIMEOUT'
        | 'INVALID_DXF_FORMAT'
        | 'FILE_READ_ERROR';
    message: string;
}

/** 파일 유효성 검사 결과 */
export interface ValidationResult {
    valid: boolean;
    error?: UploadError;
}
