/**
 * useMobileMenuStore.test.ts
 * 모바일 메뉴 상태 관리 스토어 테스트
 *
 * 주요 테스트:
 * - 초기 상태 (isOpen = false)
 * - open() 액션
 * - close() 액션
 * - toggle() 액션
 * - 상태 격리 (테스트 간 독립성)
 */

import { act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';

import { useMobileMenuStore } from '../useMobileMenuStore';

// 각 테스트 전에 스토어 상태를 초기화
beforeEach(() => {
    // Zustand 스토어 상태 리셋
    useMobileMenuStore.setState({ isOpen: false });
});

describe('useMobileMenuStore', () => {
    describe('초기 상태', () => {
        it('isOpen이 false로 초기화된다', () => {
            const state = useMobileMenuStore.getState();

            expect(state.isOpen).toBe(false);
        });

        it('모든 액션 함수가 존재한다', () => {
            const state = useMobileMenuStore.getState();

            expect(typeof state.open).toBe('function');
            expect(typeof state.close).toBe('function');
            expect(typeof state.toggle).toBe('function');
        });
    });

    describe('open()', () => {
        it('isOpen을 true로 변경한다', () => {
            const { open } = useMobileMenuStore.getState();

            act(() => {
                open();
            });

            expect(useMobileMenuStore.getState().isOpen).toBe(true);
        });

        it('이미 열려 있어도 true를 유지한다', () => {
            useMobileMenuStore.setState({ isOpen: true });
            const { open } = useMobileMenuStore.getState();

            act(() => {
                open();
            });

            expect(useMobileMenuStore.getState().isOpen).toBe(true);
        });
    });

    describe('close()', () => {
        it('isOpen을 false로 변경한다', () => {
            useMobileMenuStore.setState({ isOpen: true });
            const { close } = useMobileMenuStore.getState();

            act(() => {
                close();
            });

            expect(useMobileMenuStore.getState().isOpen).toBe(false);
        });

        it('이미 닫혀 있어도 false를 유지한다', () => {
            const { close } = useMobileMenuStore.getState();

            act(() => {
                close();
            });

            expect(useMobileMenuStore.getState().isOpen).toBe(false);
        });
    });

    describe('toggle()', () => {
        it('false → true로 토글한다', () => {
            const { toggle } = useMobileMenuStore.getState();

            act(() => {
                toggle();
            });

            expect(useMobileMenuStore.getState().isOpen).toBe(true);
        });

        it('true → false로 토글한다', () => {
            useMobileMenuStore.setState({ isOpen: true });
            const { toggle } = useMobileMenuStore.getState();

            act(() => {
                toggle();
            });

            expect(useMobileMenuStore.getState().isOpen).toBe(false);
        });

        it('연속 토글이 정상 동작한다', () => {
            const { toggle } = useMobileMenuStore.getState();

            // 초기: false
            expect(useMobileMenuStore.getState().isOpen).toBe(false);

            // 1차 토글: true
            act(() => {
                toggle();
            });
            expect(useMobileMenuStore.getState().isOpen).toBe(true);

            // 2차 토글: false
            act(() => {
                toggle();
            });
            expect(useMobileMenuStore.getState().isOpen).toBe(false);

            // 3차 토글: true
            act(() => {
                toggle();
            });
            expect(useMobileMenuStore.getState().isOpen).toBe(true);
        });
    });

    describe('액션 조합', () => {
        it('open → close 시퀀스가 동작한다', () => {
            const { open, close } = useMobileMenuStore.getState();

            act(() => {
                open();
            });
            expect(useMobileMenuStore.getState().isOpen).toBe(true);

            act(() => {
                close();
            });
            expect(useMobileMenuStore.getState().isOpen).toBe(false);
        });

        it('toggle → close 시퀀스가 동작한다', () => {
            const { toggle, close } = useMobileMenuStore.getState();

            act(() => {
                toggle();
            });
            expect(useMobileMenuStore.getState().isOpen).toBe(true);

            act(() => {
                close();
            });
            expect(useMobileMenuStore.getState().isOpen).toBe(false);
        });

        it('open → toggle 시퀀스가 동작한다', () => {
            const { open, toggle } = useMobileMenuStore.getState();

            act(() => {
                open();
            });
            expect(useMobileMenuStore.getState().isOpen).toBe(true);

            act(() => {
                toggle();
            });
            expect(useMobileMenuStore.getState().isOpen).toBe(false);
        });
    });

    describe('셀렉터 패턴', () => {
        it('getState()로 개별 상태를 조회할 수 있다', () => {
            // getState()를 통한 상태 조회 (React 컨텍스트 외부에서도 동작)
            const isOpen = useMobileMenuStore.getState().isOpen;
            expect(isOpen).toBe(false);

            act(() => {
                useMobileMenuStore.getState().open();
            });

            const isOpenAfter = useMobileMenuStore.getState().isOpen;
            expect(isOpenAfter).toBe(true);
        });

        it('getState()로 액션을 직접 호출할 수 있다', () => {
            const { toggle } = useMobileMenuStore.getState();
            expect(typeof toggle).toBe('function');

            act(() => {
                toggle();
            });

            expect(useMobileMenuStore.getState().isOpen).toBe(true);
        });

        it('subscribe로 상태 변경을 감지할 수 있다', () => {
            const changes: boolean[] = [];
            const unsubscribe = useMobileMenuStore.subscribe((state) => {
                changes.push(state.isOpen);
            });

            act(() => {
                useMobileMenuStore.getState().open();
            });

            act(() => {
                useMobileMenuStore.getState().close();
            });

            expect(changes).toEqual([true, false]);
            unsubscribe();
        });
    });
});
