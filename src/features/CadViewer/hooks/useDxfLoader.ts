/**
 * CAD Viewer - useDxfLoader Hook
 * DXF 파일 로딩, 레이어 관리, 카메라 제어를 담당하는 훅
 */

import { useState, useCallback } from 'react';

import type { SampleInfo } from '@/components/FilePanel';
import type { ParsedCADData, LayerInfo } from '@/types/cad';
import { validateSecureUrl, validateExtension } from '@/utils';
import { calculateCameraDistance } from '@/utils/cad';

import { CAMERA_CONFIG, URL_SECURITY_CONFIG } from '../constants';

import { useDxfWorker } from './useDxfWorker';

/** Hook 반환 타입 */
export interface UseDxfLoaderReturn {
    /** 파싱된 CAD 데이터 */
    cadData: ParsedCADData | null;
    /** 레이어 정보 */
    layers: Map<string, LayerInfo>;
    /** 카메라 위치 */
    cameraPosition: [number, number, number];
    /** 로딩 상태 */
    isLoading: boolean;
    /** 진행률 (0-100) */
    progress: number;
    /** 진행 단계 */
    progressStage: string;
    /** 에러 정보 */
    error: { code: string; message: string } | null;
    /** 파일 선택 핸들러 */
    handleFileSelect: (file: File) => Promise<void>;
    /** 샘플 파일 선택 핸들러 */
    handleSelectSample: (sample: SampleInfo) => Promise<void>;
    /** URL 로드 핸들러 */
    handleUrlSubmit: (url: string) => Promise<void>;
    /** 파일 리셋 핸들러 */
    handleResetFile: () => void;
    /** 레이어 토글 핸들러 */
    handleToggleLayer: (layerName: string) => void;
    /** 전체 레이어 토글 핸들러 */
    handleToggleAllLayers: (visible: boolean) => void;
    /** 카메라 위치 리셋 */
    resetCameraPosition: (autoFit?: boolean) => void;
    /** 에러 초기화 */
    clearError: () => void;
}

/** useDxfLoader 옵션 */
export interface UseDxfLoaderOptions {
    /** 카메라 자동 맞춤 여부 */
    autoFitCamera?: boolean;
}

/**
 * DXF 파일 로딩 및 관리 훅
 * @param options 훅 옵션
 * @returns 파일 상태 및 제어 함수
 */
export function useDxfLoader(
    options: UseDxfLoaderOptions = {}
): UseDxfLoaderReturn {
    const { autoFitCamera = true } = options;

    // DXF 파서 훅
    const { parse, isLoading, progress, progressStage, error, clearError } =
        useDxfWorker();

    // 상태
    const [cadData, setCadData] = useState<ParsedCADData | null>(null);
    const [layers, setLayers] = useState<Map<string, LayerInfo>>(new Map());
    const [cameraPosition, setCameraPosition] = useState<
        [number, number, number]
    >([...CAMERA_CONFIG.defaultPosition]);

    /** 레이어 토글 핸들러 */
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

    /** 전체 레이어 토글 핸들러 */
    const handleToggleAllLayers = useCallback((visible: boolean) => {
        setLayers((prev) => {
            const newLayers = new Map(prev);
            for (const [name, layer] of newLayers) {
                newLayers.set(name, { ...layer, visible });
            }
            return newLayers;
        });
    }, []);

    /** 파일 선택 핸들러 */
    const handleFileSelect = useCallback(
        async (file: File) => {
            clearError();
            try {
                const data = await parse(file);
                setCadData(data);

                // 레이어 정보 설정
                setLayers(new Map(data.layers));

                // 카메라 위치 자동 조정
                if (autoFitCamera && data.bounds) {
                    const distance = calculateCameraDistance(
                        data.bounds,
                        CAMERA_CONFIG.fov
                    );
                    setCameraPosition([0, 0, distance]);
                }
            } catch (err) {
                // 에러는 useDXFWorker에서 처리됨
                if (import.meta.env.DEV) {
                    console.error('Failed to parse DXF:', err);
                }
            }
        },
        [parse, clearError, autoFitCamera]
    );

    /** 샘플 파일 선택 핸들러 */
    const handleSelectSample = useCallback(
        async (sample: SampleInfo) => {
            try {
                const response = await fetch(sample.path);
                if (!response.ok) {
                    throw new Error('샘플 파일을 불러올 수 없습니다.');
                }
                const text = await response.text();
                const file = new File([text], sample.name + '.dxf', {
                    type: 'application/dxf',
                });
                await handleFileSelect(file);
            } catch (err) {
                if (import.meta.env.DEV) {
                    console.error('Failed to load sample:', err);
                }
            }
        },
        [handleFileSelect]
    );

    /** URL 로드 핸들러 (보안 강화) */
    const handleUrlSubmit = useCallback(
        async (url: string) => {
            clearError();

            // 1. URL 보안 검증
            const urlValidation = validateSecureUrl(url, {
                allowedProtocols: URL_SECURITY_CONFIG.allowedProtocols,
                allowedHosts: URL_SECURITY_CONFIG.allowedHosts,
            });
            if (!urlValidation.valid) {
                if (import.meta.env.DEV) {
                    console.error(
                        'URL validation failed:',
                        urlValidation.error?.message
                    );
                }
                return;
            }

            // 2. 확장자 검증
            const pathname = new URL(url).pathname;
            const extValidation = validateExtension(pathname, ['.dxf']);
            if (!extValidation.valid) {
                if (import.meta.env.DEV) {
                    console.error(
                        'Extension validation failed:',
                        extValidation.error?.message
                    );
                }
                return;
            }

            try {
                // 3. AbortController로 타임아웃 설정
                const controller = new AbortController();
                const timeoutId = setTimeout(
                    () => controller.abort(),
                    URL_SECURITY_CONFIG.fetchTimeout
                );

                const response = await fetch(url, {
                    signal: controller.signal,
                    headers: {
                        Accept: 'application/dxf, text/plain, */*',
                    },
                });
                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error('URL에서 파일을 불러올 수 없습니다.');
                }

                // 4. 응답 크기 검증
                const contentLength = response.headers.get('content-length');
                if (
                    contentLength &&
                    parseInt(contentLength) >
                        URL_SECURITY_CONFIG.maxResponseSize
                ) {
                    throw new Error('파일 크기가 너무 큽니다.');
                }

                const text = await response.text();

                // 5. 응답 크기 재검증 (Content-Length 헤더가 없는 경우)
                if (text.length > URL_SECURITY_CONFIG.maxResponseSize) {
                    throw new Error('파일 크기가 너무 큽니다.');
                }

                // URL에서 파일명 추출 (경로 탐색 방지)
                const pathParts = new URL(url).pathname.split('/');
                const rawFileName =
                    pathParts[pathParts.length - 1] || 'remote.dxf';
                // 파일명 정제 (경로 구분자 제거)
                const fileName = rawFileName.replace(/[/\\]/g, '_');

                const file = new File([text], fileName, {
                    type: 'application/dxf',
                });
                await handleFileSelect(file);
            } catch (err) {
                if (import.meta.env.DEV) {
                    if (err instanceof Error && err.name === 'AbortError') {
                        console.error('URL fetch timeout');
                    } else {
                        console.error('Failed to load from URL:', err);
                    }
                }
            }
        },
        [handleFileSelect, clearError]
    );

    /** 파일 리셋 핸들러 */
    const handleResetFile = useCallback(() => {
        setCadData(null);
        setLayers(new Map());
        setCameraPosition([...CAMERA_CONFIG.defaultPosition]);
        clearError();
    }, [clearError]);

    /** 카메라 위치 리셋 */
    const resetCameraPosition = useCallback(
        (autoFit?: boolean) => {
            const shouldAutoFit = autoFit ?? autoFitCamera;
            if (cadData && shouldAutoFit && cadData.bounds) {
                const distance = calculateCameraDistance(
                    cadData.bounds,
                    CAMERA_CONFIG.fov
                );
                setCameraPosition([0, 0, distance]);
            } else {
                setCameraPosition([...CAMERA_CONFIG.defaultPosition]);
            }
        },
        [cadData, autoFitCamera]
    );

    return {
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
        clearError,
    };
}
