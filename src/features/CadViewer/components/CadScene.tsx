/**
 * Cad Viewer - Main Scene Container
 *
 * 3D 캔버스, 파일 업로드, 컨트롤, 레이어 패널을 오케스트레이션하는 메인 컨테이너
 *
 * @see {@link CadMesh} - 3D 렌더링
 * @see {@link FileUpload} - 파일 입력
 */

import { useState, useCallback, useRef } from 'react';

import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { FileText, Layers } from 'lucide-react';

import { FileUpload, formatFileSize } from '@/components/Common/FileUpload';
import { ControlPanelViewer } from '@/components/ControlPanelViewer';

import {
    DEFAULT_CAD_CONFIG,
    CAMERA_CONFIG,
    ORBIT_CONTROLS_CONFIG,
    GRID_CONFIG,
    RENDER_MODE_OPTIONS,
    DXF_UPLOAD_CONFIG,
    DXF_UPLOAD_MESSAGES,
} from '../constants';
import { useDXFWorker } from '../hooks/useDXFWorker';
import { calculateCameraDistance } from '../utils/dxfToGeometry';

import { CadMesh } from './CadMesh';
import { LayerPanel } from './LayerPanel';

import type {
    ParsedCADData,
    CadViewerConfig,
    LayerInfo,
    CadRenderMode,
} from '../types';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

export function CadScene() {
    const [cadData, setCadData] = useState<ParsedCADData | null>(null);
    const [config, setConfig] = useState<CadViewerConfig>(DEFAULT_CAD_CONFIG);
    const [layers, setLayers] = useState<Map<string, LayerInfo>>(new Map());
    const { parse, isLoading, progress, progressStage, error, clearError } =
        useDXFWorker();
    const controlsRef = useRef<OrbitControlsImpl>(null);
    const [cameraPosition, setCameraPosition] = useState<
        [number, number, number]
    >([...CAMERA_CONFIG.defaultPosition]);

    // 설정 변경 핸들러
    const handleConfigChange = useCallback(
        (newConfig: Partial<CadViewerConfig>) => {
            setConfig((prev) => ({ ...prev, ...newConfig }));
        },
        []
    );

    // 레이어 토글 핸들러
    const handleToggleLayer = useCallback((layerName: string) => {
        setLayers((prev) => {
            const newLayers = new Map(prev);
            const layer = newLayers.get(layerName);
            if (layer) {
                newLayers.set(layerName, { ...layer, visible: !layer.visible });
            }
            return newLayers;
        });
    }, []);

    // 전체 레이어 토글 핸들러
    const handleToggleAllLayers = useCallback((visible: boolean) => {
        setLayers((prev) => {
            const newLayers = new Map(prev);
            for (const [name, layer] of newLayers) {
                newLayers.set(name, { ...layer, visible });
            }
            return newLayers;
        });
    }, []);

    // 파일 선택 핸들러
    const handleFileSelect = useCallback(
        async (file: File) => {
            clearError();
            try {
                const data = await parse(file);
                setCadData(data);

                // 레이어 정보 설정
                setLayers(new Map(data.layers));

                // 카메라 위치 자동 조정
                if (config.autoFitCamera && data.bounds) {
                    const distance = calculateCameraDistance(
                        data.bounds,
                        CAMERA_CONFIG.fov
                    );
                    setCameraPosition([0, 0, distance]);
                }
            } catch (err) {
                // 에러는 useDXFParser에서 처리됨
                console.error('Failed to parse DXF:', err);
            }
        },
        [parse, clearError, config.autoFitCamera]
    );

    // 뷰 리셋 핸들러
    const handleResetView = useCallback(() => {
        if (controlsRef.current) {
            controlsRef.current.reset();
        }
        if (cadData && config.autoFitCamera) {
            const distance = calculateCameraDistance(
                cadData.bounds,
                CAMERA_CONFIG.fov
            );
            setCameraPosition([0, 0, distance]);
        } else {
            setCameraPosition([...CAMERA_CONFIG.defaultPosition]);
        }
    }, [cadData, config.autoFitCamera]);

    // 샘플 파일 로드 핸들러
    const handleLoadSample = useCallback(async () => {
        try {
            // const response = await fetch('/samples/simple-room.dxf');
            const response = await fetch('/samples/iso_pattern.dxf');
            if (!response.ok) {
                throw new Error('샘플 파일을 불러올 수 없습니다.');
            }
            const text = await response.text();
            const file = new File([text], 'iso_pattern.dxf', {
                type: 'application/dxf',
            });
            await handleFileSelect(file);
        } catch (err) {
            console.error('Failed to load sample:', err);
        }
    }, [handleFileSelect]);

    // 파일 리셋 핸들러 (초기 상태로)
    const handleResetFile = useCallback(() => {
        setCadData(null);
        setLayers(new Map());
        setCameraPosition([...CAMERA_CONFIG.defaultPosition]);
        clearError();
        if (controlsRef.current) {
            controlsRef.current.reset();
        }
    }, [clearError]);

    return (
        <div className="relative h-full w-full">
            {/* 3D Canvas */}
            <Canvas
                className="bg-gradient-to-b from-gray-900 to-gray-800"
                gl={{ antialias: true }}
            >
                <PerspectiveCamera
                    makeDefault
                    position={cameraPosition}
                    fov={CAMERA_CONFIG.fov}
                    near={CAMERA_CONFIG.near}
                    far={CAMERA_CONFIG.far}
                />
                <OrbitControls
                    ref={controlsRef}
                    enableDamping={ORBIT_CONTROLS_CONFIG.enableDamping}
                    dampingFactor={ORBIT_CONTROLS_CONFIG.dampingFactor}
                    minDistance={ORBIT_CONTROLS_CONFIG.minDistance}
                    maxDistance={ORBIT_CONTROLS_CONFIG.maxDistance}
                    autoRotate={config.autoRotate}
                    autoRotateSpeed={config.rotateSpeed}
                />

                {/* 조명 */}
                <ambientLight intensity={0.8} />

                {/* Cad 모델 */}
                {cadData && (
                    <CadMesh
                        data={cadData}
                        center={true}
                        layers={layers}
                        renderMode={config.renderMode}
                    />
                )}

                {/* 바닥 그리드 */}
                {config.showGrid && (
                    <gridHelper
                        args={[
                            GRID_CONFIG.size,
                            GRID_CONFIG.divisions,
                            GRID_CONFIG.colorCenterLine,
                            GRID_CONFIG.colorGrid,
                        ]}
                        rotation={[Math.PI / 2, 0, 0]}
                    />
                )}
            </Canvas>

            {/* HTML Overlay - 파일 업로드 */}
            <FileUpload
                config={DXF_UPLOAD_CONFIG}
                messages={DXF_UPLOAD_MESSAGES}
                onFileSelect={handleFileSelect}
                onLoadSample={handleLoadSample}
                isLoading={isLoading}
                progress={progress}
                progressStage={progressStage}
                error={error}
                hasData={!!cadData}
                accentColor="green"
            />

            {/* HTML Overlay - 컨트롤 패널 */}
            <ControlPanelViewer
                config={config}
                onConfigChange={handleConfigChange}
                onResetView={handleResetView}
                onClear={handleResetFile}
                metadata={cadData}
                renderMetadata={(data) => (
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

            {/* HTML Overlay - 렌더링 모드 선택 (HATCH 엔티티가 있을 때만) */}
            {cadData && cadData.hatches && cadData.hatches.length > 0 && (
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
                                            config.renderMode === option.value
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
            )}

            {/* HTML Overlay - 레이어 패널 */}
            {cadData && layers.size > 0 && (
                <LayerPanel
                    layers={layers}
                    onToggleLayer={handleToggleLayer}
                    onToggleAll={handleToggleAllLayers}
                />
            )}
        </div>
    );
}
