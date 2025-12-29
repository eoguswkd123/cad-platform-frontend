/**
 * useSceneControls.test.ts
 * 3D Scene 공통 컨트롤 훅 테스트
 *
 * 주요 테스트:
 * - 초기 설정 상태
 * - handleConfigChange를 통한 설정 업데이트
 * - handleResetView를 통한 뷰 리셋
 * - controlsRef 참조 관리
 * - 제네릭 타입 지원
 */

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useSceneControls, type BaseViewerConfig } from '../useSceneControls';

// 테스트용 확장 설정 타입
interface TestConfig extends BaseViewerConfig {
    customField: string;
    nestedValue: number;
}

const DEFAULT_TEST_CONFIG: TestConfig = {
    showGrid: true,
    autoRotate: false,
    rotateSpeed: 1.0,
    customField: 'test',
    nestedValue: 100,
};

const DEFAULT_BASE_CONFIG: BaseViewerConfig = {
    showGrid: true,
    autoRotate: false,
    rotateSpeed: 1.0,
};

// OrbitControls mock
const mockReset = vi.fn();
const mockOrbitControls = {
    reset: mockReset,
};

beforeEach(() => {
    vi.clearAllMocks();
});

describe('useSceneControls', () => {
    describe('초기화', () => {
        it('기본 설정으로 초기화된다', () => {
            const { result } = renderHook(() =>
                useSceneControls(DEFAULT_BASE_CONFIG)
            );

            expect(result.current.config).toEqual(DEFAULT_BASE_CONFIG);
        });

        it('확장된 설정 타입도 지원한다', () => {
            const { result } = renderHook(() =>
                useSceneControls<TestConfig>(DEFAULT_TEST_CONFIG)
            );

            expect(result.current.config).toEqual(DEFAULT_TEST_CONFIG);
            expect(result.current.config.customField).toBe('test');
            expect(result.current.config.nestedValue).toBe(100);
        });

        it('controlsRef가 null로 초기화된다', () => {
            const { result } = renderHook(() =>
                useSceneControls(DEFAULT_BASE_CONFIG)
            );

            expect(result.current.controlsRef.current).toBeNull();
        });
    });

    describe('handleConfigChange', () => {
        it('부분 설정 업데이트가 동작한다', () => {
            const { result } = renderHook(() =>
                useSceneControls(DEFAULT_BASE_CONFIG)
            );

            act(() => {
                result.current.handleConfigChange({ showGrid: false });
            });

            expect(result.current.config.showGrid).toBe(false);
            expect(result.current.config.autoRotate).toBe(false); // 기존 값 유지
            expect(result.current.config.rotateSpeed).toBe(1.0); // 기존 값 유지
        });

        it('여러 필드 동시 업데이트가 동작한다', () => {
            const { result } = renderHook(() =>
                useSceneControls(DEFAULT_BASE_CONFIG)
            );

            act(() => {
                result.current.handleConfigChange({
                    showGrid: false,
                    autoRotate: true,
                    rotateSpeed: 2.5,
                });
            });

            expect(result.current.config).toEqual({
                showGrid: false,
                autoRotate: true,
                rotateSpeed: 2.5,
            });
        });

        it('확장 타입의 커스텀 필드도 업데이트 가능하다', () => {
            const { result } = renderHook(() =>
                useSceneControls<TestConfig>(DEFAULT_TEST_CONFIG)
            );

            act(() => {
                result.current.handleConfigChange({
                    customField: 'updated',
                    nestedValue: 200,
                });
            });

            expect(result.current.config.customField).toBe('updated');
            expect(result.current.config.nestedValue).toBe(200);
        });

        it('빈 객체로 호출해도 에러가 발생하지 않는다', () => {
            const { result } = renderHook(() =>
                useSceneControls(DEFAULT_BASE_CONFIG)
            );

            act(() => {
                result.current.handleConfigChange({});
            });

            expect(result.current.config).toEqual(DEFAULT_BASE_CONFIG);
        });
    });

    describe('setConfig', () => {
        it('전체 설정을 교체할 수 있다', () => {
            const { result } = renderHook(() =>
                useSceneControls(DEFAULT_BASE_CONFIG)
            );

            const newConfig: BaseViewerConfig = {
                showGrid: false,
                autoRotate: true,
                rotateSpeed: 5.0,
            };

            act(() => {
                result.current.setConfig(newConfig);
            });

            expect(result.current.config).toEqual(newConfig);
        });
    });

    describe('handleResetView', () => {
        it('controlsRef가 없으면 에러 없이 동작한다', () => {
            const { result } = renderHook(() =>
                useSceneControls(DEFAULT_BASE_CONFIG)
            );

            // controlsRef.current가 null인 상태에서 호출
            expect(() => {
                act(() => {
                    result.current.handleResetView();
                });
            }).not.toThrow();
        });

        it('controlsRef가 있으면 reset()을 호출한다', () => {
            const { result } = renderHook(() =>
                useSceneControls(DEFAULT_BASE_CONFIG)
            );

            // controlsRef에 mock 할당
            // @ts-expect-error - 테스트를 위한 mock 할당
            result.current.controlsRef.current = mockOrbitControls;

            act(() => {
                result.current.handleResetView();
            });

            expect(mockReset).toHaveBeenCalledTimes(1);
        });
    });

    describe('메모이제이션', () => {
        it('handleConfigChange는 안정적인 참조를 유지한다', () => {
            const { result, rerender } = renderHook(() =>
                useSceneControls(DEFAULT_BASE_CONFIG)
            );

            const firstHandler = result.current.handleConfigChange;

            rerender();

            expect(result.current.handleConfigChange).toBe(firstHandler);
        });

        it('handleResetView는 안정적인 참조를 유지한다', () => {
            const { result, rerender } = renderHook(() =>
                useSceneControls(DEFAULT_BASE_CONFIG)
            );

            const firstHandler = result.current.handleResetView;

            rerender();

            expect(result.current.handleResetView).toBe(firstHandler);
        });

        it('controlsRef는 리렌더링에도 동일 참조를 유지한다', () => {
            const { result, rerender } = renderHook(() =>
                useSceneControls(DEFAULT_BASE_CONFIG)
            );

            const firstRef = result.current.controlsRef;

            rerender();

            expect(result.current.controlsRef).toBe(firstRef);
        });
    });

    describe('반환값 구조', () => {
        it('필요한 모든 속성을 반환한다', () => {
            const { result } = renderHook(() =>
                useSceneControls(DEFAULT_BASE_CONFIG)
            );

            expect(result.current).toHaveProperty('config');
            expect(result.current).toHaveProperty('setConfig');
            expect(result.current).toHaveProperty('controlsRef');
            expect(result.current).toHaveProperty('handleConfigChange');
            expect(result.current).toHaveProperty('handleResetView');
        });

        it('함수 타입이 올바르다', () => {
            const { result } = renderHook(() =>
                useSceneControls(DEFAULT_BASE_CONFIG)
            );

            expect(typeof result.current.setConfig).toBe('function');
            expect(typeof result.current.handleConfigChange).toBe('function');
            expect(typeof result.current.handleResetView).toBe('function');
        });
    });
});
