/**
 * ControlPanel - 공통 상수 정의
 */

// Common에서 공용 상수 re-export
export { CHECKBOX_STYLES } from '@/components/Common';

/** 회전 속도 슬라이더 설정 */
export const SPEED_SLIDER_CONFIG = {
    min: 0.1,
    max: 3,
    step: 0.1,
    default: 1,
} as const;

/** 기본 라벨 */
export const DEFAULT_LABELS = {
    grid: 'Grid',
    autoRotate: 'Auto Rotate',
    rotateSpeed: 'Rotate Speed',
    reset: 'Reset',
    clear: 'Clear',
} as const;
