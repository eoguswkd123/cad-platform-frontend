/**
 * SceneCanvas - 공통 3D 캔버스 컴포넌트
 *
 * CadScene과 WorkerScene에서 공유하는 3D 캔버스 래퍼
 * Canvas, Camera, OrbitControls, Grid를 포함
 * Suspense를 통한 3D 콘텐츠 로딩 UX 제공
 *
 * @see {@link useSceneControls} - 이 컴포넌트와 함께 사용되는 공통 훅
 */

import React, { Suspense } from 'react';

import { OrbitControls, PerspectiveCamera, Html } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

import type { SceneCanvasProps } from './types';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

/**
 * 3D 콘텐츠 로딩 중 표시되는 폴백 컴포넌트
 * Canvas 내부에서 Html 컴포넌트로 DOM 요소 렌더링
 */
function LoadingFallback() {
    return (
        <Html center>
            <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-400 border-t-white" />
                <span className="text-sm text-gray-300">Loading 3D...</span>
            </div>
        </Html>
    );
}

/**
 * 공통 3D 캔버스 컴포넌트
 *
 * @example
 * ```tsx
 * <SceneCanvas
 *   cameraPosition={[0, 0, 100]}
 *   controlsRef={controlsRef}
 *   showGrid={config.showGrid}
 * >
 *   <MyMesh />
 * </SceneCanvas>
 * ```
 */
export function SceneCanvas({
    children,
    cameraPosition,
    cameraFov = 50,
    cameraNear = 0.1,
    cameraFar = 10000,
    controlsRef,
    enableDamping = true,
    dampingFactor = 0.05,
    minDistance = 1,
    maxDistance = 1000,
    autoRotate = false,
    rotateSpeed = 1,
    ambientIntensity = 0.8,
    showGrid = true,
    gridSize = 100,
    gridDivisions = 50,
    gridColorCenterLine = 0x444444,
    gridColorGrid = 0x222222,
    gridRotation,
}: SceneCanvasProps) {
    return (
        <Canvas
            className="h-full w-full bg-gradient-to-b from-gray-900 to-gray-800"
            gl={{
                antialias: true,
                powerPreference: 'high-performance',
            }}
            dpr={[1, 2]}
        >
            <PerspectiveCamera
                makeDefault
                position={cameraPosition}
                fov={cameraFov}
                near={cameraNear}
                far={cameraFar}
            />

            <OrbitControls
                ref={controlsRef as React.RefObject<OrbitControlsImpl>}
                enableDamping={enableDamping}
                dampingFactor={dampingFactor}
                minDistance={minDistance}
                maxDistance={maxDistance}
                autoRotate={autoRotate}
                autoRotateSpeed={rotateSpeed}
            />

            <ambientLight intensity={ambientIntensity} />

            {/* Suspense로 3D 콘텐츠 래핑 - 비동기 로딩 시 폴백 표시 */}
            <Suspense fallback={<LoadingFallback />}>{children}</Suspense>

            {showGrid && (
                <gridHelper
                    args={[
                        gridSize,
                        gridDivisions,
                        gridColorCenterLine,
                        gridColorGrid,
                    ]}
                    {...(gridRotation && { rotation: gridRotation })}
                />
            )}
        </Canvas>
    );
}
