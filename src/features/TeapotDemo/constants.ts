/**
 * Teapot Demo - Constants
 * Three.js TeapotGeometry 렌더링 예제 상수
 */

import type { ShadingMode, TeapotConfig } from './types';

/** Teapot 설정 기본값 */
export const DEFAULT_TEAPOT_CONFIG: TeapotConfig = {
    tessellation: 15,
    shadingMode: 'smooth',
    showLid: true,
    showBody: true,
    showBottom: true,
    autoRotate: true,
};

/** 쉐이딩 모드 옵션 */
export const SHADING_MODE_OPTIONS: { value: ShadingMode; label: string }[] = [
    { value: 'wireframe', label: 'Wireframe' },
    { value: 'flat', label: 'Flat' },
    { value: 'smooth', label: 'Smooth' },
    { value: 'glossy', label: 'Glossy' },
    { value: 'textured', label: 'Textured' },
    { value: 'reflective', label: 'Reflective' },
];

/** 테셀레이션 범위 */
export const TESSELLATION_RANGE = {
    min: 2,
    max: 50,
    step: 1,
} as const;
