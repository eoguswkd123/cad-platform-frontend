/**
 * WorkerViewer - Constants
 * glTF/glb 뷰어 상수 정의
 */

import type {
    FileUploadConfig,
    FileUploadMessages,
    UrlValidationConfig,
} from '@/components/FilePanel';
import { createUrlSecurityConfig } from '@/config/urlSecurity';

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

/** GLTF URL 검증 설정 (기본 확장자 검증용) */
export const GLTF_URL_VALIDATION_CONFIG: UrlValidationConfig = {
    acceptExtensions: ['.glb', '.gltf'],
};

/**
 * GLTF 파일용 URL 보안 설정
 * 공통 설정은 @/config/urlSecurity에서 관리
 */
export const URL_SECURITY_CONFIG = createUrlSecurityConfig({
    additionalHosts: [
        'khronos.org', // glTF 샘플
        'model-viewer.glitch.me', // 예제 모델
    ],
    maxResponseSize: 50 * 1024 * 1024, // 50MB
});

/** GLTF 파일 업로드 설정 */
export const GLTF_UPLOAD_CONFIG: FileUploadConfig = {
    accept: {
        extensions: ['.glb', '.gltf'],
        mimeTypes: [
            'model/gltf-binary',
            'model/gltf+json',
            'application/octet-stream',
        ],
    },
    limits: {
        maxSize: 50 * 1024 * 1024, // 50MB
        warnSize: 10 * 1024 * 1024, // 10MB
    },
};

/** GLTF 파일 업로드 메시지 */
export const GLTF_UPLOAD_MESSAGES: FileUploadMessages = {
    dragPrompt: 'GLB/GLTF 파일을 드래그하거나 클릭',
    maxSizeText: '최대 50MB',
    loadingText: '모델 로딩 중...',
};

// ============================================================
// Sample Files - utils/gltfSamples.ts로 이동
// ============================================================
// GLTF_SAMPLES는 동적으로 생성되는 데이터이므로
// constants.ts가 아닌 utils/gltfSamples.ts에서 export
// import { GLTF_SAMPLES } from './utils/gltfSamples';
