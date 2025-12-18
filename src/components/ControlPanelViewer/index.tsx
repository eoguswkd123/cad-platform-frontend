/**
 * ControlPanelViewer - 통합 Viewer 컨트롤 패널
 *
 * CadViewer, WorkerViewer 등에서 공유하는 컨트롤 UI
 * render props 패턴으로 메타데이터 표시 커스터마이징 가능
 */

import { memo, useCallback } from 'react';

import {
    GridToggle,
    RotateToggle,
    SpeedSlider,
    ViewerActionButtons,
    ShadingSelect,
    type ShadingMode,
} from '@/components/ControlPanel';

import { VIEWER_PANEL_STYLES } from './constants';

import type { ControlPanelViewerProps } from './types';

function ControlPanelViewerComponent<T>({
    config,
    onConfigChange,
    onResetView,
    onClear,
    metadata,
    renderMetadata,
    showShadingSelect = false,
    accentColor = 'green',
    resetLabel = 'Home',
    clearLabel = 'Close',
    helpText,
}: ControlPanelViewerProps<T>) {
    const handleShadingChange = useCallback(
        (value: ShadingMode) => onConfigChange({ shadingMode: value }),
        [onConfigChange]
    );

    const handleGridChange = useCallback(
        (checked: boolean) => onConfigChange({ showGrid: checked }),
        [onConfigChange]
    );

    const handleRotateChange = useCallback(
        (checked: boolean) => onConfigChange({ autoRotate: checked }),
        [onConfigChange]
    );

    const handleSpeedChange = useCallback(
        (value: number) => onConfigChange({ rotateSpeed: value }),
        [onConfigChange]
    );

    return (
        <div className={VIEWER_PANEL_STYLES.container}>
            {/* 메타데이터 표시 (render prop) */}
            {metadata && renderMetadata && (
                <div className={VIEWER_PANEL_STYLES.card}>
                    {renderMetadata(metadata)}
                </div>
            )}

            {/* 컨트롤 패널 */}
            <div className={VIEWER_PANEL_STYLES.card}>
                <p className={VIEWER_PANEL_STYLES.title}>Controls</p>

                {/* Shading Mode 선택 */}
                {showShadingSelect && config.shadingMode && (
                    <ShadingSelect
                        value={config.shadingMode}
                        onChange={handleShadingChange}
                    />
                )}

                <GridToggle
                    checked={config.showGrid}
                    onChange={handleGridChange}
                    accentColor={accentColor}
                />

                <RotateToggle
                    checked={config.autoRotate}
                    onChange={handleRotateChange}
                    accentColor={accentColor}
                />

                {config.autoRotate && (
                    <SpeedSlider
                        value={config.rotateSpeed}
                        onChange={handleSpeedChange}
                    />
                )}

                <ViewerActionButtons
                    onReset={onResetView}
                    onClear={metadata ? onClear : undefined}
                    resetLabel={resetLabel}
                    clearLabel={clearLabel}
                    resetIcon="home"
                />
            </div>

            {/* 도움말 (메타데이터 없을 때만 표시) */}
            {helpText && !metadata && (
                <div className={VIEWER_PANEL_STYLES.card}>
                    <p className={VIEWER_PANEL_STYLES.helpText}>{helpText}</p>
                </div>
            )}
        </div>
    );
}

export const ControlPanelViewer = memo(
    ControlPanelViewerComponent
) as typeof ControlPanelViewerComponent;
