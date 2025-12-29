/**
 * Hooks - 전역 훅 모듈
 *
 * @module hooks
 *
 * @description
 * 여러 Feature에서 공통으로 사용하는 React 훅 모음
 *
 * - useSceneControls: 3D 씬 공통 컨트롤
 * - useUrlInput: URL 입력 상태 관리
 */

// 3D Scene Controls
export { useSceneControls } from './useSceneControls';
export type { BaseViewerConfig } from './useSceneControls';

// URL Input
export { useUrlInput } from './useUrlInput';
export type { UseUrlInputOptions, UseUrlInputReturn } from './useUrlInput';

// Mobile Drawer
export { useMobileDrawer } from './useMobileDrawer';
