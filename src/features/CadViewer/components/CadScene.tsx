/**
 * Cad Viewer - Main Scene Container
 *
 * 3D 캔버스, 파일 업로드, 컨트롤, 레이어 패널을 오케스트레이션하는 메인 컨테이너
 *
 * @see {@link CadMeshViewer} - 3D 렌더링 오케스트레이터
 * @see {@link SceneCanvas} - 공통 3D 캔버스
 */

import { useCallback, lazy, Suspense } from 'react';

import { FileText, Layers } from 'lucide-react';

import { CadMeshViewer } from '@/components/CadMeshViewer';
import { LoadingSpinner, PanelErrorBoundary } from '@/components/Common';
import { ControlPanelViewer } from '@/components/ControlPanelViewer';
import { formatFileSize } from '@/components/FilePanel';
import { FilePanelViewer } from '@/components/FilePanelViewer';
import { useSceneControls } from '@/hooks/useSceneControls';
import type { ParsedCADData, CadRenderMode } from '@/types/cad';

// React.lazy - SceneCanvas만 적용 (Three.js 무거운 의존성)
const SceneCanvas = lazy(() =>
    import('@/components/SceneCanvasViewer').then((m) => ({
        default: m.SceneCanvas,
    }))
);

import {
    DEFAULT_CAD_CONFIG,
    CAMERA_CONFIG,
    ORBIT_CONTROLS_CONFIG,
    GRID_CONFIG,
    RENDER_MODE_OPTIONS,
    DXF_UPLOAD_CONFIG,
    DXF_UPLOAD_MESSAGES,
} from '../constants';
import { useDxfLoader } from '../hooks/useDxfLoader';
import { DXF_SAMPLES } from '../utils/dxfSamples';

import { LayerPanel } from './LayerPanel';

import type { CadViewerConfig } from '../types';

export function CadScene() {
    // 공통 훅 사용
    const { config, controlsRef, handleConfigChange } =
        useSceneControls<CadViewerConfig>(DEFAULT_CAD_CONFIG);

    // DXF 파일 관리 훅 (상태 + 핸들러 위임)
    const {
        cadData,
        layers,
        cameraPosition,
        isLoading,
        progress,
        progressStage,
        error,
        handleFileSelect,
        handleSelectSample,
        handleUrlSubmit,
        handleResetFile,
        handleToggleLayer,
        handleToggleAllLayers,
        resetCameraPosition,
    } = useDxfLoader({ autoFitCamera: config.autoFitCamera });

    // 뷰 리셋 핸들러 (CadScene 전용 - OrbitControls 리셋 포함)
    const handleResetView = useCallback(() => {
        controlsRef.current?.reset();
        resetCameraPosition();
    }, [controlsRef, resetCameraPosition]);

    // 파일 초기화 + 컨트롤 리셋
    const handleClear = useCallback(() => {
        handleResetFile();
        controlsRef.current?.reset();
    }, [handleResetFile, controlsRef]);

    return (
        <div className="relative h-full w-full overflow-hidden">
            {/* 3D Canvas - 공통 컴포넌트 사용 */}
            <Suspense fallback={<LoadingSpinner size="lg" />}>
                <SceneCanvas
                    cameraPosition={cameraPosition}
                    cameraFov={CAMERA_CONFIG.fov}
                    cameraNear={CAMERA_CONFIG.near}
                    cameraFar={CAMERA_CONFIG.far}
                    controlsRef={controlsRef}
                    enableDamping={ORBIT_CONTROLS_CONFIG.enableDamping}
                    dampingFactor={ORBIT_CONTROLS_CONFIG.dampingFactor}
                    minDistance={ORBIT_CONTROLS_CONFIG.minDistance}
                    maxDistance={ORBIT_CONTROLS_CONFIG.maxDistance}
                    autoRotate={config.autoRotate}
                    rotateSpeed={config.rotateSpeed}
                    showGrid={config.showGrid}
                    gridSize={GRID_CONFIG.size}
                    gridDivisions={GRID_CONFIG.divisions}
                    gridColorCenterLine={GRID_CONFIG.colorCenterLine}
                    gridColorGrid={GRID_CONFIG.colorGrid}
                    gridRotation={[Math.PI / 2, 0, 0]}
                >
                    {/* Cad 모델 */}
                    {cadData && (
                        <CadMeshViewer
                            data={cadData}
                            center={true}
                            layers={layers}
                            renderMode={config.renderMode}
                        />
                    )}
                </SceneCanvas>
            </Suspense>

            {/* HTML Overlay - 파일 패널 */}
            <PanelErrorBoundary panelName="파일">
                <FilePanelViewer
                    uploadConfig={DXF_UPLOAD_CONFIG}
                    uploadMessages={DXF_UPLOAD_MESSAGES}
                    onFileSelect={handleFileSelect}
                    samples={DXF_SAMPLES}
                    onSelectSample={handleSelectSample}
                    isLoading={isLoading}
                    progress={progress}
                    progressStage={progressStage}
                    error={error}
                    hasData={!!cadData}
                    accentColor="green"
                    onUrlSubmit={handleUrlSubmit}
                    urlPlaceholder="https://example.com/drawing.dxf"
                />
            </PanelErrorBoundary>

            {/* HTML Overlay - 컨트롤 패널 */}
            <PanelErrorBoundary panelName="컨트롤">
                <ControlPanelViewer
                    config={config}
                    onConfigChange={handleConfigChange}
                    onResetView={handleResetView}
                    onClear={handleClear}
                    metadata={cadData}
                    renderMetadata={(data: ParsedCADData) => (
                        <>
                            {/* 헤더: 이름 + 포맷 뱃지 */}
                            <div className="mb-2 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-green-400" />
                                    <span
                                        className="max-w-[120px] truncate text-sm font-medium text-gray-200"
                                        title={data.metadata.fileName}
                                    >
                                        {data.metadata.fileName}
                                    </span>
                                </div>
                                <span className="rounded bg-green-900/50 px-1.5 py-0.5 text-[10px] text-green-400">
                                    DXF
                                </span>
                            </div>

                            {/* P0: 핵심 정보 */}
                            <div className="mb-2 space-y-1 text-xs text-gray-400">
                                <p>{formatFileSize(data.metadata.fileSize)}</p>
                                <p>
                                    {data.metadata.entityCount.toLocaleString()}{' '}
                                    entities
                                </p>
                            </div>

                            {/* P2: 성능 (작게) */}
                            <p className="text-[10px] text-gray-500">
                                Parsed in {data.metadata.parseTime}ms
                            </p>
                        </>
                    )}
                    accentColor="green"
                    helpText="DXF 파일을 업로드하면 3D 와이어프레임으로 표시됩니다."
                />
            </PanelErrorBoundary>

            {/* HTML Overlay - 렌더링 모드 선택 (HATCH 엔티티가 있을 때만) */}
            {cadData && cadData.hatches && cadData.hatches.length > 0 && (
                <PanelErrorBoundary panelName="렌더 모드">
                    <div className="absolute top-[320px] right-4 min-w-[180px]">
                        <div className="rounded-lg bg-gray-800/90 p-3 shadow-lg backdrop-blur-sm">
                            <div className="mb-2 flex items-center gap-2">
                                <Layers className="h-4 w-4 text-green-400" />
                                <span className="text-xs font-medium text-gray-400">
                                    Render Mode
                                </span>
                            </div>
                            <div className="space-y-1">
                                {RENDER_MODE_OPTIONS.map((option) => (
                                    <label
                                        key={option.value}
                                        className="flex cursor-pointer items-center gap-2"
                                    >
                                        <input
                                            type="radio"
                                            name="renderMode"
                                            value={option.value}
                                            checked={
                                                config.renderMode ===
                                                option.value
                                            }
                                            onChange={() =>
                                                handleConfigChange({
                                                    renderMode:
                                                        option.value as CadRenderMode,
                                                })
                                            }
                                            className="h-3 w-3 border-gray-600 bg-gray-700 text-green-500"
                                        />
                                        <span className="text-sm text-gray-200">
                                            {option.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                            <p className="mt-2 text-[10px] text-gray-500">
                                HATCH: {cadData.hatches.length}개
                            </p>
                        </div>
                    </div>
                </PanelErrorBoundary>
            )}

            {/* HTML Overlay - 레이어 패널 */}
            {cadData && layers.size > 0 && (
                <PanelErrorBoundary panelName="레이어">
                    <LayerPanel
                        layers={layers}
                        onToggleLayer={handleToggleLayer}
                        onToggleAll={handleToggleAllLayers}
                    />
                </PanelErrorBoundary>
            )}
        </div>
    );
}
