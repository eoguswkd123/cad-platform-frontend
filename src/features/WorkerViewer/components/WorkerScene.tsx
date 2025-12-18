/**
 * WorkerViewer - WorkerScene Component
 * 메인 컨테이너: Canvas, 컨트롤, 모델 선택기 오케스트레이션
 */

import { useState, useCallback, useRef, Suspense } from 'react';

import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Box } from 'lucide-react';

import { formatFileSize } from '@/components/Common/FileUpload';
import { ControlPanelViewer } from '@/components/ControlPanelViewer';

import {
    DEFAULT_WORKER_CONFIG,
    WORKER_CAMERA_CONFIG,
    WORKER_ORBIT_CONTROLS_CONFIG,
    WORKER_GRID_CONFIG,
} from '../constants';
import { useWorkerModel } from '../hooks';

import { ModelSelector } from './ModelSelector';
import { WorkerMesh } from './WorkerMesh';

import type { WorkerViewerConfig } from '../types';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

/** 로딩 폴백 컴포넌트 */
function LoadingFallback() {
    return (
        <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#404040" wireframe />
        </mesh>
    );
}

export function WorkerScene() {
    const [config, setConfig] = useState<WorkerViewerConfig>(
        DEFAULT_WORKER_CONFIG
    );
    const controlsRef = useRef<OrbitControlsImpl>(null);

    const {
        models,
        selectedModel,
        status,
        error,
        fetchModels,
        selectModel,
        loadModelFromUrl,
        clearModel,
        clearError,
    } = useWorkerModel();

    // 설정 변경 핸들러
    const handleConfigChange = useCallback(
        (newConfig: Partial<WorkerViewerConfig>) => {
            setConfig((prev) => ({ ...prev, ...newConfig }));
        },
        []
    );

    // 뷰 리셋 핸들러
    const handleResetView = useCallback(() => {
        if (controlsRef.current) {
            controlsRef.current.reset();
        }
    }, []);

    // 샘플 모델 로드 핸들러
    const handleLoadSample = useCallback(() => {
        loadModelFromUrl('/samples/sample-model.glb');
    }, [loadModelFromUrl]);

    // 모델 초기화 핸들러
    const handleClearModel = useCallback(() => {
        clearModel();
        if (controlsRef.current) {
            controlsRef.current.reset();
        }
    }, [clearModel]);

    return (
        <div className="relative h-full w-full">
            {/* 3D Canvas */}
            <Canvas
                className="bg-gradient-to-b from-gray-900 to-gray-800"
                gl={{ antialias: true }}
            >
                <PerspectiveCamera
                    makeDefault
                    position={[...WORKER_CAMERA_CONFIG.defaultPosition]}
                    fov={WORKER_CAMERA_CONFIG.fov}
                    near={WORKER_CAMERA_CONFIG.near}
                    far={WORKER_CAMERA_CONFIG.far}
                />
                <OrbitControls
                    ref={controlsRef}
                    enableDamping={WORKER_ORBIT_CONTROLS_CONFIG.enableDamping}
                    dampingFactor={WORKER_ORBIT_CONTROLS_CONFIG.dampingFactor}
                    minDistance={WORKER_ORBIT_CONTROLS_CONFIG.minDistance}
                    maxDistance={WORKER_ORBIT_CONTROLS_CONFIG.maxDistance}
                />

                {/* 조명 */}
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <directionalLight position={[-10, -10, -5]} intensity={0.3} />

                {/* glTF 모델 */}
                {selectedModel && (
                    <Suspense fallback={<LoadingFallback />}>
                        <WorkerMesh
                            url={selectedModel.url}
                            center={true}
                            autoRotate={config.autoRotate}
                            rotateSpeed={config.rotateSpeed}
                        />
                    </Suspense>
                )}

                {/* 바닥 그리드 */}
                {config.showGrid && (
                    <gridHelper
                        args={[
                            WORKER_GRID_CONFIG.size,
                            WORKER_GRID_CONFIG.divisions,
                            WORKER_GRID_CONFIG.colorCenterLine,
                            WORKER_GRID_CONFIG.colorGrid,
                        ]}
                    />
                )}
            </Canvas>

            {/* HTML Overlay - 모델 선택기 */}
            <ModelSelector
                models={models}
                status={status}
                error={error}
                hasModel={!!selectedModel}
                onFetchModels={fetchModels}
                onSelectModel={selectModel}
                onLoadSample={handleLoadSample}
                onClearError={clearError}
            />

            {/* HTML Overlay - 컨트롤 패널 */}
            <ControlPanelViewer
                config={config}
                onConfigChange={handleConfigChange}
                onResetView={handleResetView}
                onClear={handleClearModel}
                showShadingSelect={true}
                metadata={selectedModel}
                renderMetadata={(data) => (
                    <>
                        {/* 헤더: 이름 + 포맷 뱃지 */}
                        <div className="mb-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Box className="h-4 w-4 text-blue-400" />
                                <span
                                    className="max-w-[120px] truncate text-sm font-medium text-gray-200"
                                    title={data.name}
                                >
                                    {data.name}
                                </span>
                            </div>
                            {data.format && (
                                <span className="rounded bg-blue-900/50 px-1.5 py-0.5 text-[10px] text-blue-400">
                                    {data.format.toUpperCase()}
                                </span>
                            )}
                        </div>

                        {/* P0: 핵심 정보 */}
                        {data.fileSize && (
                            <p className="mb-2 text-xs text-gray-400">
                                {formatFileSize(data.fileSize)}
                            </p>
                        )}

                        {/* P2: 설명 (작게) */}
                        {data.description && (
                            <p className="line-clamp-2 text-[10px] text-gray-500">
                                {data.description}
                            </p>
                        )}
                    </>
                )}
                accentColor="blue"
            />
        </div>
    );
}
