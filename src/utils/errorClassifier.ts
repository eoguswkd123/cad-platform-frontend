/**
 * errorClassifier - 에러 분류 통합 유틸리티
 *
 * 에러 객체를 분석하여 일관된 에러 타입으로 분류
 * WorkerViewer, CadViewer 등 여러 모듈에서 공통으로 사용
 */

import { MESSAGES } from '@/locales';

/**
 * 공통 에러 코드 타입
 * 모든 모듈에서 사용하는 에러 코드 정의
 */
export type CommonErrorCode =
    | 'FETCH_ERROR'
    | 'PARSE_ERROR'
    | 'NOT_FOUND'
    | 'NETWORK_ERROR'
    | 'INVALID_URL'
    | 'INVALID_EXTENSION'
    | 'TIMEOUT'
    | 'WORKER_ERROR';

/**
 * 분류된 에러 인터페이스
 * 각 모듈의 에러 타입(LoadError, UploadError)과 호환
 */
export interface ClassifiedError {
    code: CommonErrorCode;
    message: string;
}

/**
 * 에러 분류 컨텍스트
 * 컨텍스트에 따라 기본 에러 타입이 달라짐
 */
export type ErrorContext = 'network' | 'parser' | 'worker';

/**
 * 에러 분류 함수
 *
 * 에러 객체를 분석하여 적절한 에러 코드와 메시지 반환
 * - TypeError + fetch: NETWORK_ERROR
 * - Response 객체: 상태 코드에 따른 분류
 * - Error 메시지 분석: 패턴 매칭으로 분류
 * - 기본값: 컨텍스트에 따른 기본 에러
 *
 * @param error - 분류할 에러 객체 (unknown)
 * @param context - 에러 발생 컨텍스트 (기본: 'network')
 * @returns 분류된 에러 객체
 *
 * @example
 * ```tsx
 * catch (err) {
 *     const classified = classifyError(err, 'network');
 *     setError({ code: classified.code, message: classified.message });
 * }
 * ```
 */
export function classifyError(
    error: unknown,
    context: ErrorContext = 'network'
): ClassifiedError {
    // 1. 네트워크 에러 감지 (TypeError + fetch 키워드)
    if (error instanceof TypeError && error.message.includes('fetch')) {
        return {
            code: 'NETWORK_ERROR',
            message: MESSAGES.workerViewer.errors.networkError,
        };
    }

    // 2. Response 객체 에러 (fetch 응답)
    if (error instanceof Response) {
        if (error.status === 404) {
            return {
                code: 'NOT_FOUND',
                message: MESSAGES.workerViewer.errors.notFound,
            };
        }
        return {
            code: 'FETCH_ERROR',
            message: MESSAGES.workerViewer.errors.fetchError,
        };
    }

    // 3. Error 객체 메시지 분석
    if (error instanceof Error) {
        const msg = error.message.toLowerCase();

        // 네트워크 관련 에러
        if (
            msg.includes('network') ||
            msg.includes('failed to fetch') ||
            msg.includes('net::err')
        ) {
            return {
                code: 'NETWORK_ERROR',
                message: MESSAGES.workerViewer.errors.networkError,
            };
        }

        // 파싱 에러 (glTF/glb, JSON, DXF 관련)
        if (
            msg.includes('parse') ||
            msg.includes('json') ||
            msg.includes('gltf') ||
            msg.includes('dxf') ||
            msg.includes('invalid') ||
            msg.includes('unexpected token')
        ) {
            return {
                code: 'PARSE_ERROR',
                message:
                    context === 'parser'
                        ? MESSAGES.cadViewer.errors.parseError
                        : MESSAGES.workerViewer.errors.parseError,
            };
        }

        // 404 관련 에러
        if (msg.includes('404') || msg.includes('not found')) {
            return {
                code: 'NOT_FOUND',
                message: MESSAGES.workerViewer.errors.notFound,
            };
        }

        // 타임아웃 에러
        if (msg.includes('timeout') || msg.includes('timed out')) {
            return {
                code: 'TIMEOUT',
                message: MESSAGES.errors.loadFailed,
            };
        }
    }

    // 4. 컨텍스트별 기본 에러
    const defaults: Record<ErrorContext, ClassifiedError> = {
        network: {
            code: 'FETCH_ERROR',
            message: MESSAGES.workerViewer.errors.fetchError,
        },
        parser: {
            code: 'PARSE_ERROR',
            message: MESSAGES.cadViewer.errors.parseError,
        },
        worker: {
            code: 'WORKER_ERROR',
            message: MESSAGES.errors.viewerError,
        },
    };

    return defaults[context];
}
