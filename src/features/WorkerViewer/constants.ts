/**
 * WorkerViewer - Constants
 * glTF/glb 뷰어 상수 정의
 */

import type { WorkerViewerConfig } from './types';

/** 기본 뷰어 설정 */
export const DEFAULT_WORKER_CONFIG: WorkerViewerConfig = {
    showGrid: true,
    autoRotate: true,
    rotateSpeed: 1,
    shadingMode: 'smooth',
    backgroundColor: '#1a1a2e',
    autoFitCamera: true,
};

/** 카메라 설정 */
export const WORKER_CAMERA_CONFIG = {
    fov: 45,
    defaultPosition: [0, 2, 5] as const,
    near: 0.1,
    far: 1000,
} as const;

/** OrbitControls 설정 */
export const WORKER_ORBIT_CONTROLS_CONFIG = {
    enableDamping: true,
    dampingFactor: 0.05,
    minDistance: 0.5,
    maxDistance: 100,
} as const;

/** 그리드 설정 */
export const WORKER_GRID_CONFIG = {
    size: 10,
    divisions: 10,
    colorCenterLine: 0x444444,
    colorGrid: 0x222222,
} as const;

/** 에러 메시지 */
export const WORKER_ERROR_MESSAGES = {
    FETCH_ERROR: '모델 파일을 가져오는데 실패했습니다.',
    PARSE_ERROR: 'glTF/glb 파일을 파싱하는데 실패했습니다.',
    NOT_FOUND: '모델을 찾을 수 없습니다.',
    NETWORK_ERROR: '네트워크 오류가 발생했습니다.',
} as const;
