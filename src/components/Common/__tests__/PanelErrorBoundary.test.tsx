/**
 * PanelErrorBoundary.test.tsx
 * 패널 에러 바운더리 컴포넌트 테스트
 *
 * 주요 테스트:
 * - 정상 children 렌더링
 * - 에러 발생 시 폴백 UI
 * - onError 콜백 호출
 * - 재시도 버튼 동작
 * - panelName 표시
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { PanelErrorBoundary } from '../PanelErrorBoundary';

// 에러 발생 컴포넌트
function ThrowError({ shouldThrow }: { shouldThrow: boolean }) {
    if (shouldThrow) {
        throw new Error('Test error message');
    }
    return <div>정상 컨텐츠</div>;
}

// 콘솔 에러 억제 (테스트 중 예상된 에러)
const originalConsoleError = console.error;

describe('PanelErrorBoundary', () => {
    beforeEach(() => {
        console.error = vi.fn();
    });

    afterEach(() => {
        console.error = originalConsoleError;
    });

    describe('정상 렌더링', () => {
        it('children 정상 렌더링', () => {
            render(
                <PanelErrorBoundary>
                    <div>테스트 콘텐츠</div>
                </PanelErrorBoundary>
            );
            expect(screen.getByText('테스트 콘텐츠')).toBeInTheDocument();
        });

        it('에러 없이 children 표시', () => {
            render(
                <PanelErrorBoundary>
                    <ThrowError shouldThrow={false} />
                </PanelErrorBoundary>
            );
            expect(screen.getByText('정상 컨텐츠')).toBeInTheDocument();
        });
    });

    describe('에러 발생 시', () => {
        it('폴백 UI 렌더링', () => {
            render(
                <PanelErrorBoundary>
                    <ThrowError shouldThrow={true} />
                </PanelErrorBoundary>
            );

            expect(screen.getByRole('alert')).toBeInTheDocument();
        });

        it('에러 메시지 표시', () => {
            render(
                <PanelErrorBoundary>
                    <ThrowError shouldThrow={true} />
                </PanelErrorBoundary>
            );

            expect(screen.getByText('Test error message')).toBeInTheDocument();
        });

        it('기본 panelName "패널" 표시', () => {
            render(
                <PanelErrorBoundary>
                    <ThrowError shouldThrow={true} />
                </PanelErrorBoundary>
            );

            expect(screen.getByText('패널 오류')).toBeInTheDocument();
        });

        it('커스텀 panelName 표시', () => {
            render(
                <PanelErrorBoundary panelName="파일">
                    <ThrowError shouldThrow={true} />
                </PanelErrorBoundary>
            );

            expect(screen.getByText('파일 오류')).toBeInTheDocument();
        });

        it('다시 시도 버튼 표시', () => {
            render(
                <PanelErrorBoundary>
                    <ThrowError shouldThrow={true} />
                </PanelErrorBoundary>
            );

            expect(
                screen.getByRole('button', { name: /다시 시도/i })
            ).toBeInTheDocument();
        });
    });

    describe('onError 콜백', () => {
        it('에러 발생 시 onError 호출', () => {
            const onError = vi.fn();

            render(
                <PanelErrorBoundary onError={onError}>
                    <ThrowError shouldThrow={true} />
                </PanelErrorBoundary>
            );

            expect(onError).toHaveBeenCalledTimes(1);
        });

        it('onError에 에러 객체 전달', () => {
            const onError = vi.fn();

            render(
                <PanelErrorBoundary onError={onError}>
                    <ThrowError shouldThrow={true} />
                </PanelErrorBoundary>
            );

            expect(onError).toHaveBeenCalledWith(
                expect.any(Error),
                expect.objectContaining({
                    componentStack: expect.any(String),
                })
            );
        });
    });

    describe('재시도 기능', () => {
        it('다시 시도 버튼 클릭 시 에러 상태 초기화', () => {
            // 에러 발생 후 다시 시도할 수 있는 컴포넌트
            let shouldThrow = true;

            function ToggleError() {
                if (shouldThrow) {
                    throw new Error('Test error');
                }
                return <div>복구됨</div>;
            }

            const { rerender } = render(
                <PanelErrorBoundary>
                    <ToggleError />
                </PanelErrorBoundary>
            );

            // 에러 UI 확인
            expect(screen.getByRole('alert')).toBeInTheDocument();

            // 다시 시도 전에 에러 조건 해제
            shouldThrow = false;

            // 다시 시도 버튼 클릭
            fireEvent.click(screen.getByRole('button', { name: /다시 시도/i }));

            // 리렌더링
            rerender(
                <PanelErrorBoundary>
                    <ToggleError />
                </PanelErrorBoundary>
            );

            // 정상 콘텐츠 표시 확인
            expect(screen.getByText('복구됨')).toBeInTheDocument();
        });
    });

    describe('접근성', () => {
        it('에러 시 role="alert" 적용', () => {
            render(
                <PanelErrorBoundary>
                    <ThrowError shouldThrow={true} />
                </PanelErrorBoundary>
            );

            expect(screen.getByRole('alert')).toBeInTheDocument();
        });
    });
});
