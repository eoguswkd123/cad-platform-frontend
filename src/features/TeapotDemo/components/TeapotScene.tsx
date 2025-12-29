/**
 * TeapotScene Component
 * Teapot 데모 최상위 Scene 래퍼
 *
 * @see {@link useSceneControls} - 공통 Scene 컨트롤 훅 사용
 */
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

import { useSceneControls } from '@/hooks/useSceneControls';

import {
    DEFAULT_TEAPOT_CONFIG,
    TEAPOT_CAMERA_CONFIG,
    TEAPOT_ORBIT_CONTROLS_CONFIG,
    TEAPOT_GRID_CONFIG,
} from '../constants';

import { TeapotControls } from './TeapotControls';
import { TeapotMesh } from './TeapotMesh';

import type { TeapotConfig } from '../types';

export function TeapotScene() {
    // 공통 훅 사용 (CadScene, WorkerScene과 동일한 패턴)
    const { config, controlsRef, handleConfigChange } =
        useSceneControls<TeapotConfig>(DEFAULT_TEAPOT_CONFIG);

    return (
        <div className="relative h-full w-full overflow-hidden">
            {/* 3D Canvas */}
            <Canvas
                shadows
                className="h-full w-full bg-gradient-to-b from-gray-900 to-gray-800"
            >
                <PerspectiveCamera
                    makeDefault
                    position={[...TEAPOT_CAMERA_CONFIG.position]}
                    fov={TEAPOT_CAMERA_CONFIG.fov}
                />
                <OrbitControls
                    ref={controlsRef}
                    enableDamping={TEAPOT_ORBIT_CONTROLS_CONFIG.enableDamping}
                    dampingFactor={TEAPOT_ORBIT_CONTROLS_CONFIG.dampingFactor}
                    minDistance={TEAPOT_ORBIT_CONTROLS_CONFIG.minDistance}
                    maxDistance={TEAPOT_ORBIT_CONTROLS_CONFIG.maxDistance}
                />

                {/* 조명 */}
                <ambientLight intensity={0.4} />
                <directionalLight
                    position={[100, 100, 50]}
                    intensity={1}
                    castShadow
                    shadow-mapSize={[1024, 1024]}
                />
                <directionalLight
                    position={[-100, -100, -50]}
                    intensity={0.3}
                />

                {/* Teapot */}
                <TeapotMesh
                    tessellation={config.tessellation}
                    shadingMode={config.shadingMode}
                    showLid={config.showLid}
                    showBody={config.showBody}
                    showBottom={config.showBottom}
                    autoRotate={config.autoRotate}
                />

                {/* 바닥 그리드 (config.showGrid로 토글 가능) */}
                {config.showGrid && (
                    <gridHelper
                        args={[
                            TEAPOT_GRID_CONFIG.size,
                            TEAPOT_GRID_CONFIG.divisions,
                            TEAPOT_GRID_CONFIG.colorCenterLine,
                            TEAPOT_GRID_CONFIG.colorGrid,
                        ]}
                        rotation={[0, 0, 0]}
                    />
                )}
            </Canvas>

            {/* HTML Overlay 컨트롤 */}
            <TeapotControls
                config={config}
                onConfigChange={handleConfigChange}
            />
        </div>
    );
}
