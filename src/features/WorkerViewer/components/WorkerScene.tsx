/**
 * WorkerViewer - WorkerScene Component
 *
 * 3D 캔버스, 파일 업로드, 컨트롤을 오케스트레이션하는 메인 컨테이너
 *
 * @see {@link WorkerMesh} - 3D 렌더링
 * @see {@link SceneCanvas} - 공통 3D 캔버스
 */

import { Suspense, useCallback, useRef, useEffect, lazy } from 'react';

import { Box } from 'lucide-react';

import { LoadingSpinner, PanelErrorBoundary } from '@/components/Common';
import { ControlPanelViewer } from '@/components/ControlPanelViewer';
import { formatFileSize, type SampleInfo } from '@/components/FilePanel';
import { FilePanelViewer } from '@/components/FilePanelViewer';
import { useSceneControls } from '@/hooks/useSceneControls';

// React.lazy - SceneCanvas만 적용 (Three.js 무거운 의존성)
const SceneCanvas = lazy(() =>
    import('@/components/SceneCanvasViewer').then((m) => ({
        default: m.SceneCanvas,
    }))
);

import {
    DEFAULT_WORKER_CONFIG,
    WORKER_CAMERA_CONFIG,
    WORKER_ORBIT_CONTROLS_CONFIG,
    WORKER_GRID_CONFIG,
    GLTF_UPLOAD_CONFIG,
    GLTF_UPLOAD_MESSAGES,
} from '../constants';
import { useGltfLoader } from '../hooks';
import { GLTF_SAMPLES } from '../utils/gltfSamples';

import { WorkerMesh } from './WorkerMesh';

import type { WorkerViewerConfig, ModelInfo } from '../types';

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
    // 공통 훅 사용
    const { config, controlsRef, handleConfigChange, handleResetView } =
        useSceneControls<WorkerViewerConfig>(DEFAULT_WORKER_CONFIG);

    const { selectedModel, status, error, loadModelFromUrl, clearModel } =
        useGltfLoader();

    // Object URL 추적을 위한 ref (메모리 누수 방지)
    const objectUrlRef = useRef<string | null>(null);

    // 컴포넌트 언마운트 시 Object URL 정리
    useEffect(() => {
        return () => {
            if (objectUrlRef.current) {
                URL.revokeObjectURL(objectUrlRef.current);
                objectUrlRef.current = null;
            }
        };
    }, []);

    // 샘플 파일 선택 핸들러
    const handleSelectSample = useCallback(
        (sample: SampleInfo) => {
            loadModelFromUrl(sample.path);
        },
        [loadModelFromUrl]
    );

    // 파일 업로드 핸들러 (로컬 파일)
    const handleFileSelect = useCallback(
        async (file: File) => {
            // 이전 Object URL 정리 (메모리 누수 방지)
            if (objectUrlRef.current) {
                URL.revokeObjectURL(objectUrlRef.current);
            }

            // 로컬 파일을 Object URL로 변환하여 로드
            const url = URL.createObjectURL(file);
            objectUrlRef.current = url;
            loadModelFromUrl(url);
        },
        [loadModelFromUrl]
    );

    // 모델 초기화 핸들러
    const handleClearModel = useCallback(() => {
        // Object URL 정리 (메모리 누수 방지)
        if (objectUrlRef.current) {
            URL.revokeObjectURL(objectUrlRef.current);
            objectUrlRef.current = null;
        }

        clearModel();
        if (controlsRef.current) {
            controlsRef.current.reset();
        }
    }, [clearModel, controlsRef]);

    return (
        <div className="relative h-full w-full overflow-hidden">
            {/* 3D Canvas - 공통 컴포넌트 사용 */}
            <Suspense fallback={<LoadingSpinner size="lg" />}>
                <SceneCanvas
                    cameraPosition={[...WORKER_CAMERA_CONFIG.defaultPosition]}
                    cameraFov={WORKER_CAMERA_CONFIG.fov}
                    cameraNear={WORKER_CAMERA_CONFIG.near}
                    cameraFar={WORKER_CAMERA_CONFIG.far}
                    controlsRef={controlsRef}
                    enableDamping={WORKER_ORBIT_CONTROLS_CONFIG.enableDamping}
                    dampingFactor={WORKER_ORBIT_CONTROLS_CONFIG.dampingFactor}
                    minDistance={WORKER_ORBIT_CONTROLS_CONFIG.minDistance}
                    maxDistance={WORKER_ORBIT_CONTROLS_CONFIG.maxDistance}
                    autoRotate={config.autoRotate}
                    rotateSpeed={config.rotateSpeed}
                    ambientIntensity={0.5}
                    showGrid={config.showGrid}
                    gridSize={WORKER_GRID_CONFIG.size}
                    gridDivisions={WORKER_GRID_CONFIG.divisions}
                    gridColorCenterLine={WORKER_GRID_CONFIG.colorCenterLine}
                    gridColorGrid={WORKER_GRID_CONFIG.colorGrid}
                >
                    {/* WorkerScene 전용 조명 */}
                    <directionalLight position={[10, 10, 5]} intensity={1} />
                    <directionalLight
                        position={[-10, -10, -5]}
                        intensity={0.3}
                    />

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
                </SceneCanvas>
            </Suspense>

            {/* HTML Overlay - 파일 패널 */}
            <PanelErrorBoundary panelName="파일">
                <FilePanelViewer
                    uploadConfig={GLTF_UPLOAD_CONFIG}
                    uploadMessages={GLTF_UPLOAD_MESSAGES}
                    onFileSelect={handleFileSelect}
                    samples={GLTF_SAMPLES}
                    samplesLoading={status === 'loading'}
                    onSelectSample={handleSelectSample}
                    isLoading={status === 'loading'}
                    error={
                        error
                            ? { code: 'LOAD_ERROR', message: error.message }
                            : null
                    }
                    hasData={!!selectedModel}
                    accentColor="blue"
                    onUrlSubmit={loadModelFromUrl}
                    urlPlaceholder="https://example.com/model.glb"
                />
            </PanelErrorBoundary>

            {/* HTML Overlay - 컨트롤 패널 */}
            <PanelErrorBoundary panelName="컨트롤">
                <ControlPanelViewer
                    config={config}
                    onConfigChange={handleConfigChange}
                    onResetView={handleResetView}
                    onClear={handleClearModel}
                    showShadingSelect={true}
                    metadata={selectedModel}
                    renderMetadata={(data: ModelInfo) => (
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
            </PanelErrorBoundary>
        </div>
    );
}
