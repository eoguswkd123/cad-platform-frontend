/**
 * ViewerErrorBoundary.test.tsx
 * 3D 뷰어용 에러 바운더리 컴포넌트 테스트
 *
 * 주요 테스트:
 * - 정상 렌더링 (에러 없을 때)
 * - 에러 발생 시 폴백 UI 표시
 * - viewerName prop에 따른 텍스트 변경
 * - onError 콜백 호출
 * - 다시 시도 / 새로고침 버튼 동작
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { ViewerErrorBoundary } from '../ViewerErrorBoundary';

// 에러를 발생시키는 테스트 컴포넌트
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
    if (shouldThrow) {
        throw new Error('Test error');
    }
    return <div data-testid="child-content">Child Content</div>;
};

describe('ViewerErrorBoundary', () => {
    // console.error 억제
    const originalError = console.error;
    beforeEach(() => {
        console.error = vi.fn();
    });
    afterEach(() => {
        console.error = originalError;
    });

    describe('정상 렌더링', () => {
        it('에러 없을 때 children 렌더링', () => {
            render(
                <ViewerErrorBoundary>
                    <ThrowError shouldThrow={false} />
                </ViewerErrorBoundary>
            );

            expect(screen.getByTestId('child-content')).toBeInTheDocument();
        });

        it('에러 없을 때 폴백 UI 미표시', () => {
            render(
                <ViewerErrorBoundary>
                    <ThrowError shouldThrow={false} />
                </ViewerErrorBoundary>
            );

            expect(screen.queryByText(/뷰어 오류/)).not.toBeInTheDocument();
        });
    });

    describe('에러 발생 시', () => {
        it('폴백 UI 표시', () => {
            render(
                <ViewerErrorBoundary>
                    <ThrowError shouldThrow={true} />
                </ViewerErrorBoundary>
            );

            expect(screen.getByText('3D 뷰어 오류')).toBeInTheDocument();
        });

        it('에러 메시지 표시', () => {
            render(
                <ViewerErrorBoundary>
                    <ThrowError shouldThrow={true} />
                </ViewerErrorBoundary>
            );

            expect(screen.getByText('Test error')).toBeInTheDocument();
        });

        it('children 미표시', () => {
            render(
                <ViewerErrorBoundary>
                    <ThrowError shouldThrow={true} />
                </ViewerErrorBoundary>
            );

            expect(
                screen.queryByTestId('child-content')
            ).not.toBeInTheDocument();
        });

        it('다시 시도 버튼 표시', () => {
            render(
                <ViewerErrorBoundary>
                    <ThrowError shouldThrow={true} />
                </ViewerErrorBoundary>
            );

            expect(
                screen.getByRole('button', { name: /다시 시도/ })
            ).toBeInTheDocument();
        });

        it('페이지 새로고침 버튼 표시', () => {
            render(
                <ViewerErrorBoundary>
                    <ThrowError shouldThrow={true} />
                </ViewerErrorBoundary>
            );

            expect(
                screen.getByRole('button', { name: /페이지 새로고침/ })
            ).toBeInTheDocument();
        });
    });

    describe('viewerName prop', () => {
        it('기본값은 "3D"', () => {
            render(
                <ViewerErrorBoundary>
                    <ThrowError shouldThrow={true} />
                </ViewerErrorBoundary>
            );

            expect(screen.getByText('3D 뷰어 오류')).toBeInTheDocument();
            expect(
                screen.getByText(/3D 렌더링 중 오류가 발생했습니다/)
            ).toBeInTheDocument();
        });

        it('viewerName="CAD" 적용', () => {
            render(
                <ViewerErrorBoundary viewerName="CAD">
                    <ThrowError shouldThrow={true} />
                </ViewerErrorBoundary>
            );

            expect(screen.getByText('CAD 뷰어 오류')).toBeInTheDocument();
            expect(
                screen.getByText(/CAD 렌더링 중 오류가 발생했습니다/)
            ).toBeInTheDocument();
        });

        it('커스텀 viewerName 적용', () => {
            render(
                <ViewerErrorBoundary viewerName="Custom">
                    <ThrowError shouldThrow={true} />
                </ViewerErrorBoundary>
            );

            expect(screen.getByText('Custom 뷰어 오류')).toBeInTheDocument();
        });
    });

    describe('onError 콜백', () => {
        it('에러 발생 시 onError 호출', () => {
            const onError = vi.fn();

            render(
                <ViewerErrorBoundary onError={onError}>
                    <ThrowError shouldThrow={true} />
                </ViewerErrorBoundary>
            );

            expect(onError).toHaveBeenCalledTimes(1);
        });

        it('onError에 error 객체 전달', () => {
            const onError = vi.fn();

            render(
                <ViewerErrorBoundary onError={onError}>
                    <ThrowError shouldThrow={true} />
                </ViewerErrorBoundary>
            );

            expect(onError.mock.calls[0]?.[0]).toBeInstanceOf(Error);
            expect((onError.mock.calls[0]?.[0] as Error)?.message).toBe(
                'Test error'
            );
        });

        it('onError에 errorInfo 전달', () => {
            const onError = vi.fn();

            render(
                <ViewerErrorBoundary onError={onError}>
                    <ThrowError shouldThrow={true} />
                </ViewerErrorBoundary>
            );

            expect(onError.mock.calls[0]?.[1]).toHaveProperty('componentStack');
        });
    });

    describe('버튼 동작', () => {
        it('다시 시도 버튼 클릭 시 에러 상태 초기화', () => {
            const { rerender } = render(
                <ViewerErrorBoundary>
                    <ThrowError shouldThrow={true} />
                </ViewerErrorBoundary>
            );

            // 에러 상태 확인
            expect(screen.getByText('3D 뷰어 오류')).toBeInTheDocument();

            // 에러 발생하지 않도록 변경 후 다시 시도
            rerender(
                <ViewerErrorBoundary>
                    <ThrowError shouldThrow={false} />
                </ViewerErrorBoundary>
            );

            fireEvent.click(screen.getByRole('button', { name: /다시 시도/ }));

            // children 다시 렌더링
            expect(screen.getByTestId('child-content')).toBeInTheDocument();
        });

        it('페이지 새로고침 버튼 클릭 시 location.reload 호출', () => {
            const reloadMock = vi.fn();
            const originalLocation = window.location;

            // location.reload 모킹
            Object.defineProperty(window, 'location', {
                value: { ...originalLocation, reload: reloadMock },
                writable: true,
            });

            render(
                <ViewerErrorBoundary>
                    <ThrowError shouldThrow={true} />
                </ViewerErrorBoundary>
            );

            fireEvent.click(
                screen.getByRole('button', { name: /페이지 새로고침/ })
            );

            expect(reloadMock).toHaveBeenCalledTimes(1);

            // 원래 location 복원
            Object.defineProperty(window, 'location', {
                value: originalLocation,
                writable: true,
            });
        });
    });

    describe('콘솔 로깅', () => {
        it('에러 발생 시 console.error 호출', () => {
            render(
                <ViewerErrorBoundary viewerName="CAD">
                    <ThrowError shouldThrow={true} />
                </ViewerErrorBoundary>
            );

            expect(console.error).toHaveBeenCalled();
        });
    });
});
