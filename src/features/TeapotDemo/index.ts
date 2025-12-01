/**
 * TeapotDemo Feature Module
 * Three.js Teapot 와이어프레임 예제
 */

// Components
export { TeapotScene } from './components/TeapotScene';
export { TeapotMesh } from './components/TeapotMesh';
export { TeapotControls } from './components/TeapotControls';

// Hooks
export { useTeapotMaterial } from './hooks/useTeapotMaterial';

// Types
export type { ShadingMode, TeapotConfig } from './types';

// Constants
export { DEFAULT_TEAPOT_CONFIG, SHADING_MODE_OPTIONS, TESSELLATION_RANGE } from './constants';
