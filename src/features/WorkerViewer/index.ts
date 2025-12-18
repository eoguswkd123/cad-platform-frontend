/**
 * WorkerViewer - Feature Barrel Export
 * Phase 3B.2: glTF/glb 프론트엔드 렌더링
 */

// Components
export {
    WorkerScene,
    WorkerMesh,
    ModelSelector,
    WorkerErrorBoundary,
} from './components';

// Hooks
export { useWorkerModel } from './hooks';

// Services
export { workerService } from './services';
export type { WorkerServiceInterface } from './services';

// Types
export type {
    ModelInfo,
    WorkerViewerConfig,
    LoadingStatus,
    LoadError,
    ModelMetadata,
} from './types';

// Constants
export {
    DEFAULT_WORKER_CONFIG,
    WORKER_CAMERA_CONFIG,
    WORKER_ORBIT_CONTROLS_CONFIG,
    WORKER_GRID_CONFIG,
    WORKER_ERROR_MESSAGES,
} from './constants';
