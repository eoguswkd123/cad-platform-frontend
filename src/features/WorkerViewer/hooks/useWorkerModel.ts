/**
 * WorkerViewer - useWorkerModel Hook
 * glTF/glb 모델 로딩 및 상태 관리
 */

import { useState, useCallback } from 'react';

import { WORKER_ERROR_MESSAGES } from '../constants';
import { workerService } from '../services';

import type { ModelInfo, LoadingStatus, LoadError } from '../types';

/**
 * 에러 타입 분류 유틸리티
 * 에러 객체를 분석하여 적절한 LoadError 반환
 */
function classifyError(error: unknown): LoadError {
    // 네트워크 에러 감지
    if (error instanceof TypeError && error.message.includes('fetch')) {
        return {
            code: 'NETWORK_ERROR',
            message: WORKER_ERROR_MESSAGES.NETWORK_ERROR,
        };
    }

    // Response 에러 (fetch 응답)
    if (error instanceof Response) {
        if (error.status === 404) {
            return {
                code: 'NOT_FOUND',
                message: WORKER_ERROR_MESSAGES.NOT_FOUND,
            };
        }
        return {
            code: 'FETCH_ERROR',
            message: WORKER_ERROR_MESSAGES.FETCH_ERROR,
        };
    }

    // Error 객체 분석
    if (error instanceof Error) {
        const message = error.message.toLowerCase();

        // 네트워크 관련 에러
        if (
            message.includes('network') ||
            message.includes('failed to fetch') ||
            message.includes('net::err')
        ) {
            return {
                code: 'NETWORK_ERROR',
                message: WORKER_ERROR_MESSAGES.NETWORK_ERROR,
            };
        }

        // 파싱 에러 (glTF/glb 관련)
        if (
            message.includes('parse') ||
            message.includes('json') ||
            message.includes('gltf') ||
            message.includes('invalid') ||
            message.includes('unexpected token')
        ) {
            return {
                code: 'PARSE_ERROR',
                message: WORKER_ERROR_MESSAGES.PARSE_ERROR,
            };
        }

        // 404 관련 에러
        if (message.includes('404') || message.includes('not found')) {
            return {
                code: 'NOT_FOUND',
                message: WORKER_ERROR_MESSAGES.NOT_FOUND,
            };
        }
    }

    // 기본값: FETCH_ERROR
    return { code: 'FETCH_ERROR', message: WORKER_ERROR_MESSAGES.FETCH_ERROR };
}

/** Hook 반환 타입 */
interface UseWorkerModelReturn {
    /** 사용 가능한 모델 목록 */
    models: ModelInfo[];
    /** 선택된 모델 */
    selectedModel: ModelInfo | null;
    /** 로딩 상태 */
    status: LoadingStatus;
    /** 에러 정보 */
    error: LoadError | null;
    /** 모델 목록 가져오기 */
    fetchModels: () => Promise<void>;
    /** ID로 모델 선택 */
    selectModel: (id: string) => Promise<void>;
    /** URL로 모델 로드 */
    loadModelFromUrl: (url: string) => void;
    /** 모델 초기화 */
    clearModel: () => void;
    /** 에러 초기화 */
    clearError: () => void;
}

/**
 * glTF/glb 모델 로딩 훅
 * @returns 모델 상태 및 제어 함수
 */
export function useWorkerModel(): UseWorkerModelReturn {
    const [models, setModels] = useState<ModelInfo[]>([]);
    const [selectedModel, setSelectedModel] = useState<ModelInfo | null>(null);
    const [status, setStatus] = useState<LoadingStatus>('idle');
    const [error, setError] = useState<LoadError | null>(null);

    /** 모델 목록 가져오기 */
    const fetchModels = useCallback(async () => {
        setStatus('loading');
        setError(null);

        try {
            const result = await workerService.getAvailableModels();
            setModels(result);
            setStatus('success');
        } catch (e) {
            setError(classifyError(e));
            setStatus('error');
        }
    }, []);

    /** ID로 모델 선택 */
    const selectModel = useCallback(async (id: string) => {
        setStatus('loading');
        setError(null);

        try {
            const model = await workerService.fetchModelById(id);
            if (!model) {
                setError({
                    code: 'NOT_FOUND',
                    message: WORKER_ERROR_MESSAGES.NOT_FOUND,
                });
                setStatus('error');
                return;
            }
            setSelectedModel(model);
            setStatus('success');
        } catch (e) {
            setError(classifyError(e));
            setStatus('error');
        }
    }, []);

    /** URL로 모델 로드 */
    const loadModelFromUrl = useCallback((url: string) => {
        setStatus('loading');
        setError(null);

        try {
            const model = workerService.createModelFromUrl(url);
            setSelectedModel(model);
            setStatus('success');
        } catch (e) {
            setError(classifyError(e));
            setStatus('error');
        }
    }, []);

    /** 모델 초기화 */
    const clearModel = useCallback(() => {
        setSelectedModel(null);
        setStatus('idle');
    }, []);

    /** 에러 초기화 */
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        models,
        selectedModel,
        status,
        error,
        fetchModels,
        selectModel,
        loadModelFromUrl,
        clearModel,
        clearError,
    };
}
