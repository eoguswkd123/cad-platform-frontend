/**
 * Cad Viewer - Feature Module
 * DXF 파일 업로드 및 3D 와이어프레임 렌더링
 *
 * FileUpload는 @/components/Common/FileUpload에서 import
 */

// Components
export { CadScene, CadMesh, CadErrorBoundary, LayerPanel } from './components';

// Hooks
export { useDXFParser, useDXFWorker, shouldUseWorker } from './hooks';

// Utils
export {
    linesToGeometry,
    cadDataToGeometry,
    calculateBounds,
    getBoundsCenter,
    getBoundsSize,
    calculateCameraDistance,
    centerGeometry,
} from './utils';

// Types
export type {
    Point3D,
    ParsedLine,
    BoundingBox,
    ParsedCADData,
    CADMetadata,
    CadViewerConfig,
    UploadStatus,
} from './types';

// Constants
export {
    FILE_LIMITS,
    DEFAULT_CAD_CONFIG,
    DEFAULT_BOUNDS,
    CAMERA_CONFIG,
    ORBIT_CONTROLS_CONFIG,
    GRID_CONFIG,
    CAD_ERROR_MESSAGES,
    DXF_UPLOAD_CONFIG,
    DXF_UPLOAD_MESSAGES,
} from './constants';
