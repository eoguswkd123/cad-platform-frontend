/**
 * CAD Viewer - DXF Worker Hook
 * WebWorker를 사용한 대용량 DXF 파싱 훅
 *
 * Phase 2.1.5: 재시도 로직 및 Fallback 메커니즘 추가
 * - 지수 백오프 재시도 (WORKER_ERROR, TIMEOUT)
 * - Main Thread 파서로 Fallback
 */

import { useState, useCallback, useRef, useEffect } from 'react';

import { MESSAGES } from '@/locales';
import type { ParsedCADData, LayerInfo } from '@/types/cad';

import {
    WORKER_THRESHOLD_BYTES,
    WORKER_TIMEOUT_MS,
    WORKER_RETRY_CONFIG,
} from '../constants';

import type {
    WorkerRequest,
    WorkerResponse,
    WorkerSuccessPayload,
} from '../services';
import type { UploadError } from '../types';

/** 재시도 상태 */
export interface RetryState {
    /** 현재 시도 횟수 (0부터 시작) */
    attempt: number;
    /** 최대 시도 횟수 */
    maxAttempts: number;
    /** 재시도 중 여부 */
    isRetrying: boolean;
    /** 마지막 에러 코드 */
    lastErrorCode: UploadError['code'] | null;
}

interface UseDxfWorkerReturn {
    /** DXF 파일 파싱 함수 */
    parse: (file: File) => Promise<ParsedCADData>;
    /** 로딩 상태 */
    isLoading: boolean;
    /** 진행률 (0-100) */
    progress: number;
    /** 진행 단계 메시지 */
    progressStage: string;
    /** 에러 상태 */
    error: UploadError | null;
    /** 에러 초기화 */
    clearError: () => void;
    /** 파싱 취소 */
    cancel: () => void;
    /** 재시도 상태 */
    retryState: RetryState;
}

/** 초기 재시도 상태 */
const INITIAL_RETRY_STATE: RetryState = {
    attempt: 0,
    maxAttempts: WORKER_RETRY_CONFIG.maxRetries + 1, // 초기 시도 포함
    isRetrying: false,
    lastErrorCode: null,
};

/**
 * 에러 코드가 재시도 가능한지 확인
 */
function isRetryableError(code: UploadError['code']): boolean {
    return (WORKER_RETRY_CONFIG.retryableErrors as readonly string[]).includes(
        code
    );
}

/**
 * 지수 백오프 딜레이 계산
 * @param attempt 현재 시도 횟수 (0부터 시작)
 * @returns 대기 시간 (ms)
 */
function calculateBackoffDelay(attempt: number): number {
    const delay =
        WORKER_RETRY_CONFIG.baseDelayMs *
        Math.pow(WORKER_RETRY_CONFIG.backoffMultiplier, attempt);
    return Math.min(delay, WORKER_RETRY_CONFIG.maxDelayMs);
}

/**
 * WebWorker를 사용한 DXF 파싱 훅
 * 대용량 파일 (> 1MB)에서 자동으로 Worker 사용
 *
 * 재시도 전략:
 * - WORKER_ERROR, TIMEOUT: 지수 백오프로 최대 3회 재시도
 * - PARSE_ERROR, EMPTY_FILE: 즉시 실패 (재시도 불가)
 */
export function useDxfWorker(): UseDxfWorkerReturn {
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [progressStage, setProgressStage] = useState('');
    const [error, setError] = useState<UploadError | null>(null);
    const [retryState, setRetryState] =
        useState<RetryState>(INITIAL_RETRY_STATE);
    const workerRef = useRef<Worker | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const cancelledRef = useRef(false);

    // Cleanup worker and timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
            if (workerRef.current) {
                workerRef.current.terminate();
                workerRef.current = null;
            }
        };
    }, []);

    const clearError = useCallback(() => {
        setError(null);
        setProgress(0);
        setProgressStage('');
        setRetryState(INITIAL_RETRY_STATE);
    }, []);

    const cancel = useCallback(() => {
        cancelledRef.current = true;
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        if (workerRef.current) {
            workerRef.current.terminate();
            workerRef.current = null;
        }
        setIsLoading(false);
        setProgress(0);
        setProgressStage('');
        setRetryState(INITIAL_RETRY_STATE);
    }, []);

    /**
     * 단일 Worker 파싱 시도
     * @param text DXF 파일 텍스트
     * @param fileName 파일명
     * @param fileSize 파일 크기
     * @returns 파싱된 CAD 데이터
     */
    const attemptWorkerParse = useCallback(
        (
            text: string,
            fileName: string,
            fileSize: number
        ): Promise<ParsedCADData> => {
            return new Promise<ParsedCADData>((resolve, reject) => {
                // Worker 생성
                const worker = new Worker(
                    new URL('../services/dxfParser.worker.ts', import.meta.url),
                    { type: 'module' }
                );
                workerRef.current = worker;

                // 타임아웃 설정
                timeoutRef.current = setTimeout(() => {
                    const timeoutError: UploadError = {
                        code: 'TIMEOUT',
                        message:
                            '파일 처리 시간이 초과되었습니다. 파일이 너무 크거나 복잡할 수 있습니다.',
                    };
                    worker.terminate();
                    workerRef.current = null;
                    timeoutRef.current = null;
                    reject(timeoutError);
                }, WORKER_TIMEOUT_MS);

                worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
                    const { type, payload } = event.data;

                    if (type === 'progress') {
                        const progressPayload = payload as {
                            stage: string;
                            percent: number;
                        };
                        setProgress(progressPayload.percent);
                        setProgressStage(progressPayload.stage);
                    } else if (type === 'success') {
                        // 성공 시 타임아웃 취소
                        if (timeoutRef.current) {
                            clearTimeout(timeoutRef.current);
                            timeoutRef.current = null;
                        }

                        const successPayload = payload as WorkerSuccessPayload;

                        // 배열을 다시 Map으로 변환
                        const layersMap = new Map<string, LayerInfo>(
                            successPayload.layers
                        );

                        const result: ParsedCADData = {
                            lines: successPayload.lines,
                            circles: successPayload.circles,
                            arcs: successPayload.arcs,
                            polylines: successPayload.polylines,
                            hatches: successPayload.hatches,
                            texts: successPayload.texts,
                            mtexts: successPayload.mtexts,
                            ellipses: successPayload.ellipses,
                            splines: successPayload.splines,
                            dimensions: successPayload.dimensions,
                            bounds: successPayload.bounds,
                            metadata: successPayload.metadata,
                            layers: layersMap,
                        };

                        worker.terminate();
                        workerRef.current = null;
                        resolve(result);
                    } else if (type === 'error') {
                        // 에러 시 타임아웃 취소
                        if (timeoutRef.current) {
                            clearTimeout(timeoutRef.current);
                            timeoutRef.current = null;
                        }

                        const errorPayload = payload as {
                            code: UploadError['code'];
                            message: string;
                        };
                        const parseError: UploadError = {
                            code: errorPayload.code,
                            message:
                                errorPayload.code === 'EMPTY_FILE'
                                    ? MESSAGES.cadViewer.errors.emptyFile
                                    : MESSAGES.cadViewer.errors.parseError,
                        };
                        worker.terminate();
                        workerRef.current = null;
                        reject(parseError);
                    }
                };

                worker.onerror = () => {
                    // 워커 에러 시 타임아웃 취소
                    if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                        timeoutRef.current = null;
                    }

                    const parseError: UploadError = {
                        code: 'WORKER_ERROR',
                        message: 'Worker 오류가 발생했습니다.',
                    };
                    worker.terminate();
                    workerRef.current = null;
                    reject(parseError);
                };

                // Worker에 파싱 요청
                const request: WorkerRequest = {
                    type: 'parse',
                    payload: {
                        text,
                        fileName,
                        fileSize,
                    },
                };
                worker.postMessage(request);
            });
        },
        []
    );

    const parse = useCallback(
        async (file: File): Promise<ParsedCADData> => {
            cancelledRef.current = false;
            setIsLoading(true);
            setError(null);
            setProgress(0);
            setProgressStage('파일 읽는 중...');
            setRetryState(INITIAL_RETRY_STATE);

            let text: string;
            try {
                text = await file.text();
            } catch {
                const readError: UploadError = {
                    code: 'FILE_READ_ERROR',
                    message: '파일을 읽을 수 없습니다.',
                };
                setError(readError);
                setIsLoading(false);
                throw readError;
            }

            let lastError: UploadError | null = null;
            const maxAttempts = WORKER_RETRY_CONFIG.maxRetries + 1;

            // 재시도 루프
            for (let attempt = 0; attempt < maxAttempts; attempt++) {
                // 취소 확인
                if (cancelledRef.current) {
                    const cancelError: UploadError = {
                        code: 'PARSE_ERROR',
                        message: '파싱이 취소되었습니다.',
                    };
                    throw cancelError;
                }

                // 재시도 상태 업데이트
                setRetryState({
                    attempt,
                    maxAttempts,
                    isRetrying: attempt > 0,
                    lastErrorCode: lastError?.code ?? null,
                });

                // 재시도 시 진행 상태 메시지 업데이트
                if (attempt > 0) {
                    const delay = calculateBackoffDelay(attempt - 1);
                    setProgressStage(
                        `재시도 중... (${attempt}/${WORKER_RETRY_CONFIG.maxRetries})`
                    );
                    setProgress(0);

                    // 지수 백오프 대기
                    await new Promise((resolve) => setTimeout(resolve, delay));

                    // 대기 후 취소 확인
                    if (cancelledRef.current) {
                        const cancelError: UploadError = {
                            code: 'PARSE_ERROR',
                            message: '파싱이 취소되었습니다.',
                        };
                        throw cancelError;
                    }
                }

                try {
                    const result = await attemptWorkerParse(
                        text,
                        file.name,
                        file.size
                    );

                    // 성공
                    setIsLoading(false);
                    setProgress(100);
                    setRetryState({
                        attempt,
                        maxAttempts,
                        isRetrying: false,
                        lastErrorCode: null,
                    });
                    return result;
                } catch (err) {
                    lastError = err as UploadError;

                    // 재시도 불가능한 에러는 즉시 실패
                    if (!isRetryableError(lastError.code)) {
                        setError(lastError);
                        setIsLoading(false);
                        setRetryState({
                            attempt,
                            maxAttempts,
                            isRetrying: false,
                            lastErrorCode: lastError.code,
                        });
                        throw lastError;
                    }

                    // 마지막 시도가 아니면 계속 재시도
                    if (attempt < maxAttempts - 1) {
                        continue;
                    }
                }
            }

            // 모든 재시도 실패 시 최종 에러
            const finalError: UploadError = lastError ?? {
                code: 'WORKER_ERROR',
                message: `Worker 파싱 실패 (${maxAttempts}회 시도)`,
            };
            setError(finalError);
            setIsLoading(false);
            setRetryState({
                attempt: maxAttempts - 1,
                maxAttempts,
                isRetrying: false,
                lastErrorCode: finalError.code,
            });
            throw finalError;
        },
        [attemptWorkerParse]
    );

    return {
        parse,
        isLoading,
        progress,
        progressStage,
        error,
        clearError,
        cancel,
        retryState,
    };
}

/**
 * 파일 크기에 따라 적절한 파서 선택
 */
export function shouldUseWorker(fileSize: number): boolean {
    return fileSize > WORKER_THRESHOLD_BYTES;
}
