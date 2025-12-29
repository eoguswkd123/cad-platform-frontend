/**
 * errorFormatter.test.ts
 * 에러 메시지 포맷팅 유틸리티 테스트
 *
 * 주요 테스트:
 * - formatErrorForUser: 사용자 친화적 메시지 변환
 * - logError: 개발 환경 로깅
 * - 민감정보 필터링
 * - 알려진 에러 패턴 매칭
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { formatErrorForUser, logError } from '../errorFormatter';

describe('formatErrorForUser', () => {
    describe('null/undefined 처리', () => {
        it('null 에러에 대해 기본 메시지를 반환한다', () => {
            expect(formatErrorForUser(null)).toBe(
                '오류가 발생했습니다. 다시 시도해주세요.'
            );
        });
    });

    describe('알려진 에러 패턴 매칭', () => {
        it('네트워크 에러를 친화적 메시지로 변환한다', () => {
            const error = new Error('Network Error occurred');
            expect(formatErrorForUser(error)).toBe(
                '네트워크 연결을 확인해주세요.'
            );
        });

        it('timeout 에러를 친화적 메시지로 변환한다', () => {
            const error = new Error('Request timeout');
            expect(formatErrorForUser(error)).toBe(
                '요청 시간이 초과되었습니다. 다시 시도해주세요.'
            );
        });

        it('failed to fetch 에러를 친화적 메시지로 변환한다', () => {
            const error = new Error('Failed to fetch resource');
            expect(formatErrorForUser(error)).toBe(
                '서버에 연결할 수 없습니다.'
            );
        });

        it('WebGL 에러를 친화적 메시지로 변환한다', () => {
            const error = new Error('WebGL context creation failed');
            expect(formatErrorForUser(error)).toBe(
                'WebGL 초기화에 실패했습니다. 브라우저 설정을 확인해주세요.'
            );
        });

        it('canvas 에러를 친화적 메시지로 변환한다', () => {
            const error = new Error('Canvas rendering error');
            expect(formatErrorForUser(error)).toBe(
                '캔버스 렌더링 오류가 발생했습니다.'
            );
        });

        it('context lost 에러를 친화적 메시지로 변환한다', () => {
            // 'webgl'이 포함되지 않은 context lost 메시지
            const error = new Error('GPU context lost event fired');
            expect(formatErrorForUser(error)).toBe(
                'GPU 컨텍스트가 손실되었습니다. 페이지를 새로고침해주세요.'
            );
        });

        it('parse 에러를 친화적 메시지로 변환한다', () => {
            const error = new Error('Failed to parse JSON');
            expect(formatErrorForUser(error)).toBe(
                '파일 파싱 중 오류가 발생했습니다.'
            );
        });

        it('invalid file 에러를 친화적 메시지로 변환한다', () => {
            const error = new Error('Invalid file format');
            expect(formatErrorForUser(error)).toBe(
                '유효하지 않은 파일 형식입니다.'
            );
        });

        it('file too large 에러를 친화적 메시지로 변환한다', () => {
            const error = new Error('File too large to process');
            expect(formatErrorForUser(error)).toBe('파일 크기가 너무 큽니다.');
        });

        it('Three.js 에러를 친화적 메시지로 변환한다', () => {
            const error = new Error('Three.js rendering failed');
            expect(formatErrorForUser(error)).toBe(
                '3D 렌더링 오류가 발생했습니다.'
            );
        });

        it('geometry 에러를 친화적 메시지로 변환한다', () => {
            const error = new Error('Geometry creation failed');
            expect(formatErrorForUser(error)).toBe(
                '지오메트리 생성 중 오류가 발생했습니다.'
            );
        });

        it('material 에러를 친화적 메시지로 변환한다', () => {
            const error = new Error('Material loading failed');
            expect(formatErrorForUser(error)).toBe(
                '재질 처리 중 오류가 발생했습니다.'
            );
        });
    });

    describe('민감정보 필터링', () => {
        it('Windows 경로가 포함된 에러는 기본 메시지를 반환한다', () => {
            const error = new Error(
                'Error at C:\\Users\\admin\\project\\file.ts'
            );
            expect(formatErrorForUser(error)).toBe(
                '오류가 발생했습니다. 다시 시도해주세요.'
            );
        });

        it('Unix 경로가 포함된 에러는 기본 메시지를 반환한다', () => {
            const error = new Error('Error at /home/user/project/file.ts');
            expect(formatErrorForUser(error)).toBe(
                '오류가 발생했습니다. 다시 시도해주세요.'
            );
        });

        it('macOS 경로가 포함된 에러는 기본 메시지를 반환한다', () => {
            const error = new Error('Error at /Users/admin/project/file.ts');
            expect(formatErrorForUser(error)).toBe(
                '오류가 발생했습니다. 다시 시도해주세요.'
            );
        });

        it('WSL 경로가 포함된 에러는 기본 메시지를 반환한다', () => {
            const error = new Error('Error at /mnt/c/project/file.ts');
            expect(formatErrorForUser(error)).toBe(
                '오류가 발생했습니다. 다시 시도해주세요.'
            );
        });

        it('스택 트레이스가 포함된 에러는 기본 메시지를 반환한다', () => {
            const error = new Error('Error at functionName (file.js:10:5)');
            expect(formatErrorForUser(error)).toBe(
                '오류가 발생했습니다. 다시 시도해주세요.'
            );
        });

        it('node_modules 경로가 포함된 에러는 기본 메시지를 반환한다', () => {
            const error = new Error('Error in node_modules/some-package');
            expect(formatErrorForUser(error)).toBe(
                '오류가 발생했습니다. 다시 시도해주세요.'
            );
        });

        it('webpack 정보가 포함된 에러는 기본 메시지를 반환한다', () => {
            const error = new Error('webpack compilation error');
            expect(formatErrorForUser(error)).toBe(
                '오류가 발생했습니다. 다시 시도해주세요.'
            );
        });

        it('소스 위치가 포함된 에러는 기본 메시지를 반환한다', () => {
            const error = new Error('Error in component.tsx:42:10');
            expect(formatErrorForUser(error)).toBe(
                '오류가 발생했습니다. 다시 시도해주세요.'
            );
        });

        it('localhost 정보가 포함된 에러는 기본 메시지를 반환한다', () => {
            const error = new Error('Failed to connect to localhost:3000');
            expect(formatErrorForUser(error)).toBe(
                '오류가 발생했습니다. 다시 시도해주세요.'
            );
        });

        it('로컬 IP가 포함된 에러는 기본 메시지를 반환한다', () => {
            const error = new Error('Connection refused 127.0.0.1');
            expect(formatErrorForUser(error)).toBe(
                '오류가 발생했습니다. 다시 시도해주세요.'
            );
        });

        it('vite 정보가 포함된 에러는 기본 메시지를 반환한다', () => {
            const error = new Error('vite build error');
            expect(formatErrorForUser(error)).toBe(
                '오류가 발생했습니다. 다시 시도해주세요.'
            );
        });
    });

    describe('짧은 메시지 통과', () => {
        it('80자 이하의 안전한 메시지는 그대로 반환한다', () => {
            const error = new Error('Something went wrong');
            expect(formatErrorForUser(error)).toBe('Something went wrong');
        });

        it('80자 초과 메시지는 기본 메시지를 반환한다', () => {
            const longMessage = 'A'.repeat(81);
            const error = new Error(longMessage);
            expect(formatErrorForUser(error)).toBe(
                '오류가 발생했습니다. 다시 시도해주세요.'
            );
        });

        it('정확히 80자 메시지는 그대로 반환한다', () => {
            const exactMessage = 'A'.repeat(80);
            const error = new Error(exactMessage);
            expect(formatErrorForUser(error)).toBe(exactMessage);
        });
    });
});

describe('logError', () => {
    let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        consoleErrorSpy = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {});
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    it('개발 환경에서 에러를 로깅한다', () => {
        const error = new Error('Test error');
        logError('TestContext', error);

        // DEV 환경에서만 로깅됨
        if (import.meta.env.DEV) {
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                '[TestContext] Error:',
                error
            );
        }
    });

    it('errorInfo가 있으면 컴포넌트 스택도 로깅한다', () => {
        const error = new Error('Test error');
        const errorInfo = {
            componentStack: '\n    at Component\n    at App',
        } as import('react').ErrorInfo;

        logError('TestContext', error, errorInfo);

        // DEV 환경에서만 로깅됨
        if (import.meta.env.DEV) {
            expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
        }
    });
});
