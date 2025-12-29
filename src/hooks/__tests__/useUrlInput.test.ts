/**
 * useUrlInput.test.ts
 * URL 입력 상태 관리 훅 테스트
 *
 * 주요 테스트:
 * - 초기 상태 (빈 URL, null 에러)
 * - handleChange를 통한 URL 업데이트
 * - handleSubmit을 통한 URL 제출 및 검증
 * - handleKeyDown을 통한 Enter 키 제출
 * - isLoading 상태에 따른 canSubmit 동작
 * - clearError/reset 유틸리티 함수
 */

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useUrlInput, type UseUrlInputOptions } from '../useUrlInput';

// 기본 옵션
const createMockOptions = (
    overrides: Partial<UseUrlInputOptions> = {}
): UseUrlInputOptions => ({
    onSubmit: vi.fn(),
    ...overrides,
});

// 이벤트 헬퍼
const createChangeEvent = (value: string) =>
    ({
        target: { value },
    }) as React.ChangeEvent<HTMLInputElement>;

const createKeyDownEvent = (key: string) =>
    ({
        key,
    }) as React.KeyboardEvent<HTMLInputElement>;

beforeEach(() => {
    vi.clearAllMocks();
});

describe('useUrlInput', () => {
    describe('초기화', () => {
        it('빈 URL로 초기화된다', () => {
            const { result } = renderHook(() =>
                useUrlInput(createMockOptions())
            );

            expect(result.current.url).toBe('');
        });

        it('null 에러로 초기화된다', () => {
            const { result } = renderHook(() =>
                useUrlInput(createMockOptions())
            );

            expect(result.current.error).toBeNull();
        });

        it('isValid가 false로 시작한다', () => {
            const { result } = renderHook(() =>
                useUrlInput(createMockOptions())
            );

            expect(result.current.isValid).toBe(false);
        });

        it('canSubmit이 false로 시작한다', () => {
            const { result } = renderHook(() =>
                useUrlInput(createMockOptions())
            );

            expect(result.current.canSubmit).toBe(false);
        });
    });

    describe('handleChange', () => {
        it('URL 입력이 상태를 업데이트한다', () => {
            const { result } = renderHook(() =>
                useUrlInput(createMockOptions())
            );

            act(() => {
                result.current.handleChange(
                    createChangeEvent('https://example.com')
                );
            });

            expect(result.current.url).toBe('https://example.com');
        });

        it('URL 입력 후 isValid가 true가 된다', () => {
            const { result } = renderHook(() =>
                useUrlInput(createMockOptions())
            );

            act(() => {
                result.current.handleChange(
                    createChangeEvent('https://example.com')
                );
            });

            expect(result.current.isValid).toBe(true);
        });

        it('공백만 있는 URL은 isValid가 false다', () => {
            const { result } = renderHook(() =>
                useUrlInput(createMockOptions())
            );

            act(() => {
                result.current.handleChange(createChangeEvent('   '));
            });

            expect(result.current.isValid).toBe(false);
        });

        it('입력 시 에러가 자동 초기화된다', () => {
            const { result } = renderHook(() =>
                useUrlInput(createMockOptions())
            );

            // 먼저 에러 상태 만들기 (빈 URL로 제출)
            act(() => {
                result.current.handleChange(createChangeEvent('invalid'));
            });
            act(() => {
                result.current.handleSubmit();
            });

            expect(result.current.error).not.toBeNull();

            // 다시 입력하면 에러가 초기화
            act(() => {
                result.current.handleChange(
                    createChangeEvent('https://example.com')
                );
            });

            expect(result.current.error).toBeNull();
        });
    });

    describe('handleSubmit', () => {
        it('유효한 URL로 onSubmit 콜백이 호출된다', () => {
            const onSubmit = vi.fn();
            const { result } = renderHook(() =>
                useUrlInput(createMockOptions({ onSubmit }))
            );

            act(() => {
                result.current.handleChange(
                    createChangeEvent('https://example.com/model.glb')
                );
            });
            act(() => {
                result.current.handleSubmit();
            });

            expect(onSubmit).toHaveBeenCalledWith(
                'https://example.com/model.glb'
            );
        });

        it('제출 후 URL이 초기화된다', () => {
            const { result } = renderHook(() =>
                useUrlInput(createMockOptions())
            );

            act(() => {
                result.current.handleChange(
                    createChangeEvent('https://example.com/model.glb')
                );
            });
            act(() => {
                result.current.handleSubmit();
            });

            expect(result.current.url).toBe('');
        });

        it('빈 URL은 에러를 설정한다', () => {
            const onSubmit = vi.fn();
            const { result } = renderHook(() =>
                useUrlInput(createMockOptions({ onSubmit }))
            );

            act(() => {
                result.current.handleSubmit();
            });

            expect(result.current.error).not.toBeNull();
            expect(onSubmit).not.toHaveBeenCalled();
        });

        it('잘못된 프로토콜은 에러를 설정한다', () => {
            const onSubmit = vi.fn();
            const { result } = renderHook(() =>
                useUrlInput(createMockOptions({ onSubmit }))
            );

            act(() => {
                result.current.handleChange(
                    createChangeEvent('ftp://example.com')
                );
            });
            act(() => {
                result.current.handleSubmit();
            });

            expect(result.current.error).not.toBeNull();
            expect(onSubmit).not.toHaveBeenCalled();
        });

        it('잘못된 URL 형식은 에러를 설정한다', () => {
            const onSubmit = vi.fn();
            const { result } = renderHook(() =>
                useUrlInput(createMockOptions({ onSubmit }))
            );

            act(() => {
                result.current.handleChange(
                    createChangeEvent('https://invalid url with spaces')
                );
            });
            act(() => {
                result.current.handleSubmit();
            });

            expect(result.current.error).not.toBeNull();
            expect(onSubmit).not.toHaveBeenCalled();
        });

        it('validationConfig로 확장자 제한이 동작한다', () => {
            const onSubmit = vi.fn();
            const { result } = renderHook(() =>
                useUrlInput(
                    createMockOptions({
                        onSubmit,
                        validationConfig: {
                            acceptExtensions: ['.glb', '.gltf'],
                        },
                    })
                )
            );

            // 잘못된 확장자
            act(() => {
                result.current.handleChange(
                    createChangeEvent('https://example.com/model.obj')
                );
            });
            act(() => {
                result.current.handleSubmit();
            });

            expect(result.current.error).not.toBeNull();
            expect(onSubmit).not.toHaveBeenCalled();
        });

        it('validationConfig에 맞는 확장자는 성공한다', () => {
            const onSubmit = vi.fn();
            const { result } = renderHook(() =>
                useUrlInput(
                    createMockOptions({
                        onSubmit,
                        validationConfig: {
                            acceptExtensions: ['.glb', '.gltf'],
                        },
                    })
                )
            );

            act(() => {
                result.current.handleChange(
                    createChangeEvent('https://example.com/model.glb')
                );
            });
            act(() => {
                result.current.handleSubmit();
            });

            expect(result.current.error).toBeNull();
            expect(onSubmit).toHaveBeenCalledWith(
                'https://example.com/model.glb'
            );
        });

        it('URL 앞뒤 공백이 trim된다', () => {
            const onSubmit = vi.fn();
            const { result } = renderHook(() =>
                useUrlInput(createMockOptions({ onSubmit }))
            );

            act(() => {
                result.current.handleChange(
                    createChangeEvent('  https://example.com/model.glb  ')
                );
            });
            act(() => {
                result.current.handleSubmit();
            });

            expect(onSubmit).toHaveBeenCalledWith(
                'https://example.com/model.glb'
            );
        });
    });

    describe('handleKeyDown', () => {
        it('Enter 키로 제출된다', () => {
            const onSubmit = vi.fn();
            const { result } = renderHook(() =>
                useUrlInput(createMockOptions({ onSubmit }))
            );

            act(() => {
                result.current.handleChange(
                    createChangeEvent('https://example.com/model.glb')
                );
            });
            act(() => {
                result.current.handleKeyDown(createKeyDownEvent('Enter'));
            });

            expect(onSubmit).toHaveBeenCalled();
        });

        it('canSubmit이 false면 Enter가 무시된다', () => {
            const onSubmit = vi.fn();
            const { result } = renderHook(() =>
                useUrlInput(createMockOptions({ onSubmit }))
            );

            // 빈 URL 상태 (canSubmit = false)
            act(() => {
                result.current.handleKeyDown(createKeyDownEvent('Enter'));
            });

            expect(onSubmit).not.toHaveBeenCalled();
        });

        it('isLoading=true면 Enter가 무시된다', () => {
            const onSubmit = vi.fn();
            const { result } = renderHook(() =>
                useUrlInput(createMockOptions({ onSubmit, isLoading: true }))
            );

            act(() => {
                result.current.handleChange(
                    createChangeEvent('https://example.com/model.glb')
                );
            });
            act(() => {
                result.current.handleKeyDown(createKeyDownEvent('Enter'));
            });

            expect(onSubmit).not.toHaveBeenCalled();
        });

        it('다른 키는 무시된다', () => {
            const onSubmit = vi.fn();
            const { result } = renderHook(() =>
                useUrlInput(createMockOptions({ onSubmit }))
            );

            act(() => {
                result.current.handleChange(
                    createChangeEvent('https://example.com/model.glb')
                );
            });
            act(() => {
                result.current.handleKeyDown(createKeyDownEvent('Escape'));
            });
            act(() => {
                result.current.handleKeyDown(createKeyDownEvent('Tab'));
            });
            act(() => {
                result.current.handleKeyDown(createKeyDownEvent('a'));
            });

            expect(onSubmit).not.toHaveBeenCalled();
        });
    });

    describe('isLoading 상태', () => {
        it('isLoading=false면 유효한 URL로 canSubmit이 true다', () => {
            const { result } = renderHook(() =>
                useUrlInput(createMockOptions({ isLoading: false }))
            );

            act(() => {
                result.current.handleChange(
                    createChangeEvent('https://example.com')
                );
            });

            expect(result.current.canSubmit).toBe(true);
        });

        it('isLoading=true면 canSubmit이 false다', () => {
            const { result } = renderHook(() =>
                useUrlInput(createMockOptions({ isLoading: true }))
            );

            act(() => {
                result.current.handleChange(
                    createChangeEvent('https://example.com')
                );
            });

            expect(result.current.canSubmit).toBe(false);
        });
    });

    describe('유틸리티 함수', () => {
        it('clearError가 에러를 초기화한다', () => {
            const { result } = renderHook(() =>
                useUrlInput(createMockOptions())
            );

            // 에러 상태 만들기
            act(() => {
                result.current.handleChange(createChangeEvent('invalid'));
            });
            act(() => {
                result.current.handleSubmit();
            });

            expect(result.current.error).not.toBeNull();

            // clearError 호출
            act(() => {
                result.current.clearError();
            });

            expect(result.current.error).toBeNull();
        });

        it('reset이 URL과 에러를 모두 초기화한다', () => {
            const { result } = renderHook(() =>
                useUrlInput(createMockOptions())
            );

            // URL 입력 및 에러 상태 만들기
            act(() => {
                result.current.handleChange(createChangeEvent('invalid'));
            });
            act(() => {
                result.current.handleSubmit();
            });

            expect(result.current.url).toBe('invalid');
            expect(result.current.error).not.toBeNull();

            // reset 호출
            act(() => {
                result.current.reset();
            });

            expect(result.current.url).toBe('');
            expect(result.current.error).toBeNull();
        });
    });

    describe('콜백 메모이제이션', () => {
        it('handleChange가 stable reference를 유지한다', () => {
            const { result, rerender } = renderHook(() =>
                useUrlInput(createMockOptions())
            );

            const firstRef = result.current.handleChange;
            rerender();
            const secondRef = result.current.handleChange;

            expect(firstRef).toBe(secondRef);
        });

        it('clearError가 stable reference를 유지한다', () => {
            const { result, rerender } = renderHook(() =>
                useUrlInput(createMockOptions())
            );

            const firstRef = result.current.clearError;
            rerender();
            const secondRef = result.current.clearError;

            expect(firstRef).toBe(secondRef);
        });

        it('reset이 stable reference를 유지한다', () => {
            const { result, rerender } = renderHook(() =>
                useUrlInput(createMockOptions())
            );

            const firstRef = result.current.reset;
            rerender();
            const secondRef = result.current.reset;

            expect(firstRef).toBe(secondRef);
        });
    });
});
