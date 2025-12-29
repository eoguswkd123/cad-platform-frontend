/**
 * ControlPanel - 공통 상수 정의
 */

import { Home, RotateCcw } from 'lucide-react';

import type { ResetIconType } from './types';

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

/** 리셋 아이콘 매핑 */
export const RESET_ICONS: Record<ResetIconType, typeof RotateCcw> = {
    rotate: RotateCcw,
    home: Home,
};
