/**
 * CAD Viewer - Constants
 * DXF 파일 파싱 및 3D 렌더링 상수
 */

import type {
    FileUploadConfig,
    FileUploadMessages,
} from '@/components/FilePanel';
import { createUrlSecurityConfig } from '@/config/urlSecurity';

import type { CadViewerConfig } from './types';

/** 파일 제한 설정 */
export const FILE_LIMITS = {
    /** 최대 파일 크기 (20MB) */
    MAX_SIZE_BYTES: 20 * 1024 * 1024,
    /** 경고 표시 파일 크기 (5MB) */
    WARNING_SIZE_BYTES: 5 * 1024 * 1024,
    /** 허용 확장자 */
    ACCEPTED_EXTENSIONS: ['.dxf'] as const,
    /** 허용 MIME 타입 (빈 MIME 타입 제거 - 보안 강화) */
    ACCEPTED_MIME_TYPES: [
        'application/dxf',
        'application/x-dxf',
        'image/vnd.dxf',
        'image/x-dxf',
        'application/octet-stream', // 일부 서버에서 DXF를 바이너리로 전송
    ] as const,
} as const;

/**
 * DXF 파일용 URL 보안 설정
 * 공통 설정은 @/config/urlSecurity에서 관리
 */
export const URL_SECURITY_CONFIG = createUrlSecurityConfig({
    maxResponseSize: FILE_LIMITS.MAX_SIZE_BYTES, // 20MB
});

/** CAD Viewer 기본 설정 */
export const DEFAULT_CAD_CONFIG: CadViewerConfig = {
    showGrid: true,
    autoRotate: true,
    rotateSpeed: 1,
    backgroundColor: '#1a1a2e',
    autoFitCamera: true,
    renderMode: 'wireframe',
};

/** 렌더링 모드 옵션 */
export const RENDER_MODE_OPTIONS = [
    { value: 'wireframe', label: 'Wireframe' },
    { value: 'solid', label: 'Solid Fill' },
    { value: 'pattern', label: 'Pattern Fill' },
] as const;

/** HATCH 렌더링 설정 */
export const HATCH_CONFIG = {
    /** 솔리드 채우기 투명도 */
    solidOpacity: 0.7,
    /** Z축 오프셋 (와이어프레임 뒤에 렌더링) */
    zOffset: -0.01,
    /** 기본 HATCH 색상 */
    defaultColor: '#00ff00',
    /** 패턴 텍스처 크기 */
    patternTextureSize: 128,
    /** 기본 패턴 라인 간격 */
    defaultPatternSpacing: 16,
} as const;

/** 카메라 설정 */
export const CAMERA_CONFIG = {
    /** 기본 FOV */
    fov: 45,
    /** 기본 위치 (Z 방향에서 바라봄 - 평면도 뷰) */
    defaultPosition: [0, 0, 200] as const,
    /** 근거리 클리핑 */
    near: 0.1,
    /** 원거리 클리핑 */
    far: 10000,
} as const;

/** OrbitControls 설정 */
export const ORBIT_CONTROLS_CONFIG = {
    enableDamping: true,
    dampingFactor: 0.05,
    minDistance: 10,
    maxDistance: 5000,
} as const;

/** 그리드 설정 */
export const GRID_CONFIG = {
    size: 1000,
    divisions: 50,
    colorCenterLine: 0x444444,
    colorGrid: 0x222222,
} as const;

/** WebWorker 사용 임계값 (2MB 이상 파일에서 Worker 사용) */
export const WORKER_THRESHOLD_BYTES = 2 * 1024 * 1024;

/**
 * LOD (Level of Detail) 설정
 * 엔티티 수에 따른 세그먼트 수 조절
 */
export const LOD_CONFIG = {
    /** 고품질 세그먼트 수 (엔티티 < 1000) */
    HIGH_QUALITY_SEGMENTS: 64,
    /** 중간 품질 세그먼트 수 (엔티티 1000-5000) */
    MEDIUM_QUALITY_SEGMENTS: 32,
    /** 저품질 세그먼트 수 (엔티티 > 5000) */
    LOW_QUALITY_SEGMENTS: 16,
    /** 고품질 임계값 */
    HIGH_QUALITY_THRESHOLD: 1000,
    /** 중간 품질 임계값 */
    MEDIUM_QUALITY_THRESHOLD: 5000,
} as const;

/**
 * 엔티티 수에 따른 LOD 세그먼트 수 계산
 * @param entityCount 전체 엔티티 수
 * @returns 원/호에 사용할 세그먼트 수
 */
export function getLODSegments(entityCount: number): number {
    if (entityCount < LOD_CONFIG.HIGH_QUALITY_THRESHOLD) {
        return LOD_CONFIG.HIGH_QUALITY_SEGMENTS;
    }
    if (entityCount < LOD_CONFIG.MEDIUM_QUALITY_THRESHOLD) {
        return LOD_CONFIG.MEDIUM_QUALITY_SEGMENTS;
    }
    return LOD_CONFIG.LOW_QUALITY_SEGMENTS;
}

// ============================================================
// DXF 색상 상수
// ============================================================

/** DXF ACI(AutoCAD Color Index) to HEX 매핑 */
export const DXF_COLOR_MAP: Record<number, string> = {
    // 기본 색상 (0-9)
    0: '#ffffff', // ByBlock
    1: '#ff0000', // Red
    2: '#ffff00', // Yellow
    3: '#00ff00', // Green
    4: '#00ffff', // Cyan
    5: '#0000ff', // Blue
    6: '#ff00ff', // Magenta
    7: '#ffffff', // White/Black
    8: '#808080', // Dark Gray
    9: '#c0c0c0', // Light Gray
    // 확장 색상 (10-249 중 주요 색상)
    10: '#ff0000', // Red
    11: '#ff7f7f', // Light Red
    12: '#cc0000', // Dark Red
    20: '#ff7f00', // Orange
    30: '#ff7f00', // Orange
    40: '#ffff00', // Yellow
    50: '#7fff00', // Yellow-Green
    60: '#00ff00', // Green
    70: '#00ff7f', // Green-Cyan
    80: '#00ffff', // Cyan
    90: '#007fff', // Cyan-Blue
    100: '#0000ff', // Blue
    110: '#7f00ff', // Blue-Violet
    120: '#ff00ff', // Magenta
    130: '#ff007f', // Magenta-Red
    140: '#ff7f7f', // Light Pink
    150: '#ff7f00', // Orange
    160: '#7f7f00', // Olive
    170: '#007f00', // Dark Green
    180: '#007f7f', // Teal
    190: '#00007f', // Dark Blue
    200: '#7f007f', // Purple
    210: '#7f3f00', // Brown
    // 회색조 (250-255)
    250: '#333333', // Very Dark Gray
    251: '#505050', // Dark Gray
    252: '#696969', // Dim Gray
    253: '#808080', // Gray
    254: '#c0c0c0', // Silver
    255: '#ffffff', // White
    // ByLayer
    256: '#ffffff',
} as const;

/** 레이어 기본 색상 */
export const DEFAULT_LAYER_COLOR = '#00ff00';

/** 빈 도면 기본 바운딩 박스 */
export const DEFAULT_BOUNDS = {
    min: { x: 0, y: 0, z: 0 },
    max: { x: 100, y: 100, z: 0 },
} as const;

// aciToHex는 entityMath.ts에서 정의 (순수 함수)
export { aciToHex } from './services/entityMath';

// ============================================================
// FileUpload Config (공유 컴포넌트에 주입)
// ============================================================

/**
 * DXF 파일 업로드 설정
 * FileUpload 공유 컴포넌트에 주입
 */
export const DXF_UPLOAD_CONFIG: FileUploadConfig = {
    accept: {
        extensions: FILE_LIMITS.ACCEPTED_EXTENSIONS,
        mimeTypes: FILE_LIMITS.ACCEPTED_MIME_TYPES,
    },
    limits: {
        maxSize: FILE_LIMITS.MAX_SIZE_BYTES,
        warnSize: FILE_LIMITS.WARNING_SIZE_BYTES,
    },
};

/**
 * DXF 파일 업로드 UI 메시지
 * FileUploadBox 컴포넌트에 주입
 */
export const DXF_UPLOAD_MESSAGES: FileUploadMessages = {
    dragPrompt: 'DXF 파일을 드래그하거나 클릭',
    maxSizeText: `최대 ${FILE_LIMITS.MAX_SIZE_BYTES / 1024 / 1024}MB`,
    loadingText: '파싱 중...',
};

// ============================================================
// Sample Files - utils/dxfSamples.ts로 이동
// ============================================================
// DXF_SAMPLES는 동적으로 생성되는 데이터이므로
// constants.ts가 아닌 utils/dxfSamples.ts에서 export
// import { DXF_SAMPLES } from './utils/dxfSamples';
