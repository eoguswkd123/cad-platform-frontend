/**
 * Teapot Demo - Type Definitions
 * Three.js TeapotGeometry 렌더링 예제 타입 정의
 */

import type { BaseViewerConfig } from '@/hooks/useSceneControls';

/** 쉐이딩 모드 */
export type ShadingMode =
    | 'wireframe'
    | 'flat'
    | 'smooth'
    | 'glossy'
    | 'textured'
    | 'reflective';

/** Teapot 설정 (BaseViewerConfig 확장) */
export interface TeapotConfig extends BaseViewerConfig {
    /** 테셀레이션 레벨 (2-50) */
    tessellation: number;
    /** 쉐이딩 모드 */
    shadingMode: ShadingMode;
    /** 뚜껑 표시 여부 */
    showLid: boolean;
    /** 몸체 표시 여부 */
    showBody: boolean;
    /** 밑바닥 표시 여부 */
    showBottom: boolean;
    // autoRotate, showGrid, rotateSpeed는 BaseViewerConfig에서 상속
}
