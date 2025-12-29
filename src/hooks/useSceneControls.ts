/**
 * useSceneControls - 3D Scene 공통 컨트롤 훅
 *
 * CadScene과 WorkerScene에서 공통으로 사용하는 상태와 핸들러 제공
 *
 * @see {@link SceneCanvas} - 이 훅과 함께 사용되는 공통 캔버스 컴포넌트
 */

import { useState, useCallback, useRef } from 'react';

import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

/** 기본 뷰어 설정 인터페이스 */
export interface BaseViewerConfig {
    showGrid: boolean;
    autoRotate: boolean;
    rotateSpeed: number;
}

/**
 * 3D Scene 공통 컨트롤 훅
 *
 * @param defaultConfig - 기본 설정값
 * @returns config, controlsRef, handleConfigChange, handleResetView
 *
 * @example
 * ```tsx
 * const { config, controlsRef, handleConfigChange, handleResetView } =
 *     useSceneControls(DEFAULT_CAD_CONFIG);
 *
 * // 설정 변경
 * handleConfigChange({ showGrid: false });
 *
 * // 뷰 리셋
 * handleResetView();
 * ```
 */
export function useSceneControls<TConfig extends BaseViewerConfig>(
    defaultConfig: TConfig
) {
    const [config, setConfig] = useState<TConfig>(defaultConfig);
    const controlsRef = useRef<OrbitControlsImpl>(null);

    /** 설정 변경 핸들러 */
    const handleConfigChange = useCallback((newConfig: Partial<TConfig>) => {
        setConfig((prev) => ({ ...prev, ...newConfig }));
    }, []);

    /** 뷰 리셋 핸들러 (OrbitControls만 리셋) */
    const handleResetView = useCallback(() => {
        controlsRef.current?.reset();
    }, []);

    return {
        config,
        setConfig,
        controlsRef,
        handleConfigChange,
        handleResetView,
    };
}
