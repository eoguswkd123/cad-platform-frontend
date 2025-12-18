/**
 * ControlPanelViewer - Type Definitions
 */

import type { ReactNode } from 'react';

import type { ShadingMode } from '@/components/ControlPanel';

/** Viewer 설정 */
export interface ViewerConfig {
    /** 그리드 표시 여부 */
    showGrid: boolean;
    /** 자동 회전 여부 */
    autoRotate: boolean;
    /** 회전 속도 */
    rotateSpeed: number;
    /** 쉐이딩 모드 */
    shadingMode?: ShadingMode;
    /** 배경색 */
    backgroundColor?: string;
    /** 카메라 자동 맞춤 */
    autoFitCamera?: boolean;
}

/** ControlPanelViewer Props */
export interface ControlPanelViewerProps<T = unknown> {
    /** 뷰어 설정 */
    config: ViewerConfig;
    /** 설정 변경 콜백 */
    onConfigChange: (config: Partial<ViewerConfig>) => void;
    /** 뷰 리셋 콜백 */
    onResetView: () => void;
    /** 클리어 콜백 (파일 닫기/모델 제거) */
    onClear?: () => void;

    /** 메타데이터 (선택) */
    metadata?: T | null;
    /** 메타데이터 렌더러 (render prop) */
    renderMetadata?: (data: T) => ReactNode;

    /** Shading Select 표시 여부 */
    showShadingSelect?: boolean;

    /** 테마 색상 */
    accentColor?: 'green' | 'blue';
    /** 리셋 버튼 라벨 */
    resetLabel?: string;
    /** 클리어 버튼 라벨 */
    clearLabel?: string;
    /** 도움말 텍스트 */
    helpText?: string;
}
