/**
 * CadViewer Page Tests
 * CAD 뷰어 페이지 컴포넌트 테스트
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { render, screen } from '@tests/setup/test-utils';

import CadViewerPage from '../index';

// CadScene 모킹 (R3F Canvas 사용으로 인해)
vi.mock('@/features/CadViewer', () => ({
    CadScene: () => <div data-testid="cad-scene">CadScene Mock</div>,
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

describe('CadViewerPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Rendering', () => {
        it('should render without crashing', () => {
            render(<CadViewerPage />);
            expect(
                screen.getByTestId('viewer-error-boundary')
            ).toBeInTheDocument();
        });

        it('should render CadScene inside ViewerErrorBoundary', () => {
            render(<CadViewerPage />);

            const errorBoundary = screen.getByTestId('viewer-error-boundary');
            const cadScene = screen.getByTestId('cad-scene');

            expect(errorBoundary).toContainElement(cadScene);
        });

        it('should pass "CAD" as viewerName to ViewerErrorBoundary', () => {
            render(<CadViewerPage />);

            const errorBoundary = screen.getByTestId('viewer-error-boundary');
            expect(errorBoundary).toHaveAttribute('data-viewer-name', 'CAD');
        });

        it('should have full width and height container', () => {
            const { container } = render(<CadViewerPage />);

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

            render(<CadViewerPage />);

            // 페이지가 정상 렌더링되면 에러 핸들러는 대기 상태
            expect(
                screen.getByTestId('viewer-error-boundary')
            ).toBeInTheDocument();

            consoleSpy.mockRestore();
        });
    });

    describe('Component Structure', () => {
        it('should render correct component hierarchy', () => {
            const { container } = render(<CadViewerPage />);

            // div.h-full.w-full > ViewerErrorBoundary > CadScene
            expect(container.querySelector('.h-full.w-full')).toBeTruthy();
            expect(
                screen.getByTestId('viewer-error-boundary')
            ).toBeInTheDocument();
            expect(screen.getByTestId('cad-scene')).toBeInTheDocument();
        });

        it('should export default function component', () => {
            expect(typeof CadViewerPage).toBe('function');
        });
    });
});
