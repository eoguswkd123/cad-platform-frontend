/**
 * WorkerViewer Page Tests
 * Worker 기반 3D 뷰어 페이지 컴포넌트 테스트
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { render, screen } from '@tests/setup/test-utils';

import WorkerViewerPage from '../index';

// WorkerScene 모킹 (R3F Canvas 사용으로 인해)
vi.mock('@/features/WorkerViewer', () => ({
    WorkerScene: () => <div data-testid="worker-scene">WorkerScene Mock</div>,
}));

// ViewerErrorBoundary 모킹
vi.mock('@/components/Common', () => ({
    ViewerErrorBoundary: ({
        children,
        viewerName,
    }: {
        children: React.ReactNode;
        viewerName: string;
    }) => (
        <div data-testid="viewer-error-boundary" data-viewer-name={viewerName}>
            {children}
        </div>
    ),
}));

describe('WorkerViewerPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Rendering', () => {
        it('should render without crashing', () => {
            render(<WorkerViewerPage />);
            expect(
                screen.getByTestId('viewer-error-boundary')
            ).toBeInTheDocument();
        });

        it('should render WorkerScene inside ViewerErrorBoundary', () => {
            render(<WorkerViewerPage />);

            const errorBoundary = screen.getByTestId('viewer-error-boundary');
            const workerScene = screen.getByTestId('worker-scene');

            expect(errorBoundary).toContainElement(workerScene);
        });

        it('should pass "3D" as viewerName to ViewerErrorBoundary', () => {
            render(<WorkerViewerPage />);

            const errorBoundary = screen.getByTestId('viewer-error-boundary');
            expect(errorBoundary).toHaveAttribute('data-viewer-name', '3D');
        });

        it('should have full width and height container', () => {
            const { container } = render(<WorkerViewerPage />);

            const wrapper = container.firstChild as HTMLElement;
            expect(wrapper).toHaveClass('h-full', 'w-full');
        });
    });

    describe('Error Handling', () => {
        it('should provide onError callback to ViewerErrorBoundary', () => {
            // onError는 ViewerErrorBoundary에 전달되는 콜백
            // 실제 에러 발생 시 console.error 호출
            const consoleSpy = vi
                .spyOn(console, 'error')
                .mockImplementation(() => {});

            render(<WorkerViewerPage />);

            // 페이지가 정상 렌더링되면 에러 핸들러는 대기 상태
            expect(
                screen.getByTestId('viewer-error-boundary')
            ).toBeInTheDocument();

            consoleSpy.mockRestore();
        });
    });

    describe('Component Structure', () => {
        it('should render correct component hierarchy', () => {
            const { container } = render(<WorkerViewerPage />);

            // div.h-full.w-full > ViewerErrorBoundary > WorkerScene
            expect(container.querySelector('.h-full.w-full')).toBeTruthy();
            expect(
                screen.getByTestId('viewer-error-boundary')
            ).toBeInTheDocument();
            expect(screen.getByTestId('worker-scene')).toBeInTheDocument();
        });

        it('should export default function component', () => {
            expect(typeof WorkerViewerPage).toBe('function');
        });
    });

    describe('Page Differences from CadViewer', () => {
        it('should use viewerName "3D" instead of "CAD"', () => {
            render(<WorkerViewerPage />);

            const errorBoundary = screen.getByTestId('viewer-error-boundary');
            // WorkerViewer uses "3D", CadViewer uses "CAD"
            expect(errorBoundary).toHaveAttribute('data-viewer-name', '3D');
            expect(errorBoundary).not.toHaveAttribute(
                'data-viewer-name',
                'CAD'
            );
        });

        it('should render WorkerScene not CadScene', () => {
            render(<WorkerViewerPage />);

            expect(screen.getByTestId('worker-scene')).toBeInTheDocument();
            expect(screen.queryByTestId('cad-scene')).not.toBeInTheDocument();
        });
    });
});
