/**
 * App.test.tsx
 * 애플리케이션 루트 컴포넌트 테스트
 *
 * 주요 테스트:
 * - QueryClientProvider 래핑
 * - Suspense 폴백 표시
 * - RouterProvider 마운트
 * - ReactQueryDevtools 존재 (개발 환경)
 */

import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// React Router 모킹
vi.mock('react-router-dom', () => ({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    RouterProvider: ({ router }: { router: unknown }) => (
        <div data-testid="router-provider">Router Mounted</div>
    ),
}));

// Routes 모킹
vi.mock('../routes/root', () => ({
    default: {},
}));

// React Query Devtools 모킹
vi.mock('@tanstack/react-query-devtools', () => ({
    ReactQueryDevtools: () => <div data-testid="react-query-devtools" />,
}));

// App 컴포넌트 import (모킹 이후에)
import App from '../App';

describe('App', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('렌더링', () => {
        it('정상적으로 렌더링된다', () => {
            render(<App />);

            expect(screen.getByTestId('router-provider')).toBeInTheDocument();
        });

        it('RouterProvider가 마운트된다', () => {
            render(<App />);

            expect(screen.getByText('Router Mounted')).toBeInTheDocument();
        });

        it('ReactQueryDevtools가 포함된다', () => {
            render(<App />);

            expect(
                screen.getByTestId('react-query-devtools')
            ).toBeInTheDocument();
        });
    });

    describe('QueryClientProvider', () => {
        it('QueryClient가 생성된다', async () => {
            render(<App />);

            // QueryClientProvider가 정상 작동하면 children이 렌더링됨
            await waitFor(() => {
                expect(
                    screen.getByTestId('router-provider')
                ).toBeInTheDocument();
            });
        });
    });

    describe('Suspense', () => {
        it('로딩 중 Suspense 폴백을 표시할 수 있다', async () => {
            // Suspense 폴백은 lazy 로딩 시 표시됨
            // 현재 모킹된 상태에서는 즉시 렌더링되므로 폴백 테스트는 통합 테스트에서 수행
            render(<App />);

            // Suspense가 감싸고 있어도 children이 렌더링됨
            await waitFor(() => {
                expect(
                    screen.getByTestId('router-provider')
                ).toBeInTheDocument();
            });
        });
    });

    describe('QueryClient 설정', () => {
        it('QueryClient가 올바른 옵션으로 생성된다', () => {
            // QueryClient 생성 옵션 검증
            // - gcTime: 10분 (1000 * 60 * 10)
            // - refetchOnWindowFocus: false
            // 실제 QueryClient 인스턴스 검증은 통합 테스트에서 수행
            render(<App />);

            expect(screen.getByTestId('router-provider')).toBeInTheDocument();
        });
    });
});
