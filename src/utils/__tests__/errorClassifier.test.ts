/**
 * errorClassifier.test.ts
 * 에러 분류 통합 유틸리티 테스트
 *
 * 주요 테스트:
 * - 네트워크 에러 분류
 * - Response 객체 에러 분류
 * - Error 메시지 기반 분류
 * - 컨텍스트별 기본값
 */

import { describe, it, expect } from 'vitest';

import { classifyError, type ErrorContext } from '../errorClassifier';

describe('errorClassifier', () => {
    describe('classifyError', () => {
        describe('네트워크 에러 감지', () => {
            it('TypeError + fetch 키워드 → NETWORK_ERROR', () => {
                const error = new TypeError('Failed to fetch');
                const result = classifyError(error);

                expect(result.code).toBe('NETWORK_ERROR');
                expect(result.message).toContain('네트워크');
            });

            it('TypeError + fetch 없으면 기본값', () => {
                const error = new TypeError('Something else');
                const result = classifyError(error);

                expect(result.code).not.toBe('NETWORK_ERROR');
            });
        });

        describe('Response 객체 에러', () => {
            it('Response 404 → NOT_FOUND', () => {
                const mockResponse = new Response(null, { status: 404 });
                const result = classifyError(mockResponse);

                expect(result.code).toBe('NOT_FOUND');
            });

            it('Response 500 → FETCH_ERROR', () => {
                const mockResponse = new Response(null, { status: 500 });
                const result = classifyError(mockResponse);

                expect(result.code).toBe('FETCH_ERROR');
            });
        });

        describe('Error 메시지 분석', () => {
            it('network 키워드 → NETWORK_ERROR', () => {
                const error = new Error('network error occurred');
                const result = classifyError(error);

                expect(result.code).toBe('NETWORK_ERROR');
            });

            it('failed to fetch 키워드 → NETWORK_ERROR', () => {
                const error = new Error('Failed to fetch resource');
                const result = classifyError(error);

                expect(result.code).toBe('NETWORK_ERROR');
            });

            it('net::err 키워드 → NETWORK_ERROR', () => {
                const error = new Error('net::err_connection_refused');
                const result = classifyError(error);

                expect(result.code).toBe('NETWORK_ERROR');
            });

            it('parse 키워드 → PARSE_ERROR', () => {
                const error = new Error('Failed to parse file');
                const result = classifyError(error);

                expect(result.code).toBe('PARSE_ERROR');
            });

            it('json 키워드 → PARSE_ERROR', () => {
                const error = new Error('Unexpected token in JSON');
                const result = classifyError(error);

                expect(result.code).toBe('PARSE_ERROR');
            });

            it('gltf 키워드 → PARSE_ERROR', () => {
                const error = new Error('Invalid gltf format');
                const result = classifyError(error);

                expect(result.code).toBe('PARSE_ERROR');
            });

            it('dxf 키워드 → PARSE_ERROR', () => {
                const error = new Error('Invalid dxf file');
                const result = classifyError(error);

                expect(result.code).toBe('PARSE_ERROR');
            });

            it('invalid 키워드 → PARSE_ERROR', () => {
                const error = new Error('Invalid data format');
                const result = classifyError(error);

                expect(result.code).toBe('PARSE_ERROR');
            });

            it('404 키워드 → NOT_FOUND', () => {
                const error = new Error('Error 404: resource not available');
                const result = classifyError(error);

                expect(result.code).toBe('NOT_FOUND');
            });

            it('not found 키워드 → NOT_FOUND', () => {
                const error = new Error('File not found on server');
                const result = classifyError(error);

                expect(result.code).toBe('NOT_FOUND');
            });

            it('timeout 키워드 → TIMEOUT', () => {
                const error = new Error('Request timeout');
                const result = classifyError(error);

                expect(result.code).toBe('TIMEOUT');
            });

            it('timed out 키워드 → TIMEOUT', () => {
                const error = new Error('Connection timed out');
                const result = classifyError(error);

                expect(result.code).toBe('TIMEOUT');
            });
        });

        describe('컨텍스트별 기본값', () => {
            it('network 컨텍스트 기본값 → FETCH_ERROR', () => {
                const error = { unknown: 'error' };
                const result = classifyError(error, 'network');

                expect(result.code).toBe('FETCH_ERROR');
            });

            it('parser 컨텍스트 기본값 → PARSE_ERROR', () => {
                const error = { unknown: 'error' };
                const result = classifyError(error, 'parser');

                expect(result.code).toBe('PARSE_ERROR');
            });

            it('worker 컨텍스트 기본값 → WORKER_ERROR', () => {
                const error = { unknown: 'error' };
                const result = classifyError(error, 'worker');

                expect(result.code).toBe('WORKER_ERROR');
            });

            it('컨텍스트 미지정 시 network 사용', () => {
                const error = { unknown: 'error' };
                const result = classifyError(error);

                expect(result.code).toBe('FETCH_ERROR');
            });
        });

        describe('parse 컨텍스트 메시지', () => {
            it('parser 컨텍스트에서 파싱 에러 메시지 사용', () => {
                const error = new Error('parse error');
                const result = classifyError(error, 'parser');

                expect(result.code).toBe('PARSE_ERROR');
                expect(result.message).toContain('DXF');
            });
        });
    });

    describe('타입 안전성', () => {
        it('반환 타입이 ClassifiedError', () => {
            const error = new Error('test');
            const result = classifyError(error);

            // TypeScript 컴파일 타임에 확인됨
            const code: string = result.code;
            const message: string = result.message;

            expect(typeof code).toBe('string');
            expect(typeof message).toBe('string');
        });

        it('컨텍스트 타입이 ErrorContext', () => {
            const contexts: ErrorContext[] = ['network', 'parser', 'worker'];

            contexts.forEach((context) => {
                const result = classifyError({}, context);
                expect(result.code).toBeDefined();
            });
        });
    });
});
