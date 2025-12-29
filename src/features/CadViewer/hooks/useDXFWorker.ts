/**
 * CAD Viewer - DXF Worker Hook
 * WebWorker를 사용한 대용량 DXF 파싱 훅
 */

import { useState, useCallback, useRef, useEffect } from 'react';

import { MESSAGES } from '@/locales';

import { WORKER_THRESHOLD_BYTES } from '../constants';

/** 워커 타임아웃 (60초) - 대용량 파일 파싱 시간 고려 */
const WORKER_TIMEOUT_MS = 60_000;

import type {
    WorkerRequest,
    WorkerResponse,
    WorkerSuccessPayload,
} from '../services';
import type { ParsedCADData, LayerInfo, UploadError } from '../types';

interface UseDXFWorkerReturn {
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
}

/**
 * WebWorker를 사용한 DXF 파싱 훅
 * 대용량 파일 (> 1MB)에서 자동으로 Worker 사용
 */
export function useDXFWorker(): UseDXFWorkerReturn {
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [progressStage, setProgressStage] = useState('');
    const [error, setError] = useState<UploadError | null>(null);
    const workerRef = useRef<Worker | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    }, []);

    const cancel = useCallback(() => {
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
    }, []);

    const parse = useCallback(async (file: File): Promise<ParsedCADData> => {
        setIsLoading(true);
        setError(null);
        setProgress(0);
        setProgressStage('파일 읽는 중...');

        try {
            const text = await file.text();

            // Worker 생성
            const worker = new Worker(
                new URL('../services/dxfParser.worker.ts', import.meta.url),
                { type: 'module' }
            );
            workerRef.current = worker;

            return new Promise<ParsedCADData>((resolve, reject) => {
                // 타임아웃 설정 - 60초 후 자동 취소
                timeoutRef.current = setTimeout(() => {
                    const timeoutError: UploadError = {
                        code: 'TIMEOUT',
                        message:
                            '파일 처리 시간이 초과되었습니다. 파일이 너무 크거나 복잡할 수 있습니다.',
                    };
                    setError(timeoutError);
                    setIsLoading(false);
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
                            bounds: successPayload.bounds,
                            metadata: successPayload.metadata,
                            layers: layersMap,
                        };

                        setIsLoading(false);
                        setProgress(100);
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
                        setError(parseError);
                        setIsLoading(false);
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
                    setError(parseError);
                    setIsLoading(false);
                    worker.terminate();
                    workerRef.current = null;
                    reject(parseError);
                };

                // Worker에 파싱 요청
                const request: WorkerRequest = {
                    type: 'parse',
                    payload: {
                        text,
                        fileName: file.name,
                        fileSize: file.size,
                    },
                };
                worker.postMessage(request);
            });
        } catch (err) {
            setIsLoading(false);

            if (err && typeof err === 'object' && 'code' in err) {
                throw err;
            }

            const parseError: UploadError = {
                code: 'PARSE_ERROR',
                message: MESSAGES.cadViewer.errors.parseError,
            };
            setError(parseError);
            throw parseError;
        }
    }, []);

    return {
        parse,
        isLoading,
        progress,
        progressStage,
        error,
        clearError,
        cancel,
    };
}

/**
 * 파일 크기에 따라 적절한 파서 선택
 */
export function shouldUseWorker(fileSize: number): boolean {
    return fileSize > WORKER_THRESHOLD_BYTES;
}
