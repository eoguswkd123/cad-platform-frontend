/**
 * ViewerActionButtons.test.tsx
 * 뷰어 액션 버튼 컴포넌트 테스트
 *
 * 주요 테스트:
 * - Reset/Clear 버튼 렌더링
 * - 클릭 핸들러 호출
 * - onClear 미전달 시 Clear 버튼 숨김
 * - 커스텀 라벨 적용
 * - 아이콘 타입 변경
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { ViewerActionButtons } from '../ViewerActionButtons';

describe('ViewerActionButtons', () => {
    describe('렌더링', () => {
        it('Reset 버튼 렌더링', () => {
            render(<ViewerActionButtons onReset={vi.fn()} />);

            expect(
                screen.getByRole('button', { name: 'Reset' })
            ).toBeInTheDocument();
        });

        it('onClear 전달 시 Clear 버튼 렌더링', () => {
            render(<ViewerActionButtons onReset={vi.fn()} onClear={vi.fn()} />);

            expect(
                screen.getByRole('button', { name: 'Clear' })
            ).toBeInTheDocument();
        });

        it('onClear 미전달 시 Clear 버튼 숨김', () => {
            render(<ViewerActionButtons onReset={vi.fn()} />);

            expect(
                screen.queryByRole('button', { name: 'Clear' })
            ).not.toBeInTheDocument();
        });

        it('커스텀 Reset 라벨 적용', () => {
            render(
                <ViewerActionButtons onReset={vi.fn()} resetLabel="뷰 초기화" />
            );

            expect(
                screen.getByRole('button', { name: '뷰 초기화' })
            ).toBeInTheDocument();
            expect(screen.getByText('뷰 초기화')).toBeInTheDocument();
        });

        it('커스텀 Clear 라벨 적용', () => {
            render(
                <ViewerActionButtons
                    onReset={vi.fn()}
                    onClear={vi.fn()}
                    clearLabel="파일 삭제"
                />
            );

            expect(
                screen.getByRole('button', { name: '파일 삭제' })
            ).toBeInTheDocument();
            expect(screen.getByText('파일 삭제')).toBeInTheDocument();
        });
    });

    describe('상호작용', () => {
        it('Reset 버튼 클릭 시 onReset 호출', () => {
            const onReset = vi.fn();
            render(<ViewerActionButtons onReset={onReset} />);

            fireEvent.click(screen.getByRole('button', { name: 'Reset' }));

            expect(onReset).toHaveBeenCalledTimes(1);
        });

        it('Clear 버튼 클릭 시 onClear 호출', () => {
            const onClear = vi.fn();
            render(<ViewerActionButtons onReset={vi.fn()} onClear={onClear} />);

            fireEvent.click(screen.getByRole('button', { name: 'Clear' }));

            expect(onClear).toHaveBeenCalledTimes(1);
        });

        it('Reset 클릭이 Clear에 영향을 주지 않음', () => {
            const onReset = vi.fn();
            const onClear = vi.fn();
            render(<ViewerActionButtons onReset={onReset} onClear={onClear} />);

            fireEvent.click(screen.getByRole('button', { name: 'Reset' }));

            expect(onReset).toHaveBeenCalledTimes(1);
            expect(onClear).not.toHaveBeenCalled();
        });

        it('Clear 클릭이 Reset에 영향을 주지 않음', () => {
            const onReset = vi.fn();
            const onClear = vi.fn();
            render(<ViewerActionButtons onReset={onReset} onClear={onClear} />);

            fireEvent.click(screen.getByRole('button', { name: 'Clear' }));

            expect(onClear).toHaveBeenCalledTimes(1);
            expect(onReset).not.toHaveBeenCalled();
        });
    });

    describe('아이콘 타입', () => {
        it('기본 아이콘 타입은 rotate', () => {
            render(<ViewerActionButtons onReset={vi.fn()} />);

            // RotateCcw 아이콘이 렌더링됨 (기본값)
            const resetButton = screen.getByRole('button', { name: 'Reset' });
            expect(resetButton).toBeInTheDocument();
        });

        it('resetIcon="home" 적용', () => {
            render(<ViewerActionButtons onReset={vi.fn()} resetIcon="home" />);

            // Home 아이콘이 렌더링됨
            const resetButton = screen.getByRole('button', { name: 'Reset' });
            expect(resetButton).toBeInTheDocument();
        });
    });

    describe('접근성', () => {
        it('Reset 버튼에 aria-label 적용', () => {
            render(
                <ViewerActionButtons onReset={vi.fn()} resetLabel="초기화" />
            );

            expect(
                screen.getByRole('button', { name: '초기화' })
            ).toHaveAttribute('aria-label', '초기화');
        });

        it('Clear 버튼에 aria-label 적용', () => {
            render(
                <ViewerActionButtons
                    onReset={vi.fn()}
                    onClear={vi.fn()}
                    clearLabel="삭제"
                />
            );

            expect(
                screen.getByRole('button', { name: '삭제' })
            ).toHaveAttribute('aria-label', '삭제');
        });

        it('버튼들이 type="button"으로 설정됨', () => {
            render(<ViewerActionButtons onReset={vi.fn()} onClear={vi.fn()} />);

            const buttons = screen.getAllByRole('button');
            buttons.forEach((button) => {
                expect(button).toHaveAttribute('type', 'button');
            });
        });
    });
});
