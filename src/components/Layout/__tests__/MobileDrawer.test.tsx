/**
 * MobileDrawer.test.tsx
 * 모바일 네비게이션 드로어 컴포넌트 테스트
 *
 * 주요 테스트:
 * - 렌더링 (오버레이, 드로어 패널, 헤더, 메뉴)
 * - 열림/닫힘 상태
 * - 상호작용 (닫기 버튼, 오버레이 클릭, ESC 키)
 * - 스크롤 잠금
 * - 접근성
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { APP_CONFIG } from '@/constants';
import { useMobileMenuStore } from '@/stores/useMobileMenuStore';

import { MobileDrawer } from '../MobileDrawer';

// Store 모킹
vi.mock('@/stores/useMobileMenuStore', () => ({
    useMobileMenuStore: vi.fn(),
}));

const mockClose = vi.fn();

const renderWithRouter = (ui: React.ReactElement) => {
    return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe('MobileDrawer', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        document.body.style.overflow = '';
    });

    afterEach(() => {
        document.body.style.overflow = '';
    });

    describe('닫힌 상태', () => {
        beforeEach(() => {
            vi.mocked(useMobileMenuStore).mockReturnValue({
                isOpen: false,
                close: mockClose,
            });
        });

        it('오버레이가 투명하고 클릭 불가', () => {
            renderWithRouter(<MobileDrawer />);
            const overlay = document.querySelector('[aria-hidden="true"]');
            expect(overlay).toHaveClass('opacity-0', 'pointer-events-none');
        });

        it('드로어 패널이 화면 밖으로 이동', () => {
            renderWithRouter(<MobileDrawer />);
            const drawer = screen.getByRole('dialog');
            expect(drawer).toHaveClass('-translate-x-full');
        });

        it('스크롤이 잠기지 않음', () => {
            renderWithRouter(<MobileDrawer />);
            expect(document.body.style.overflow).toBe('');
        });
    });

    describe('열린 상태', () => {
        beforeEach(() => {
            vi.mocked(useMobileMenuStore).mockReturnValue({
                isOpen: true,
                close: mockClose,
            });
        });

        it('오버레이가 반투명하게 표시', () => {
            renderWithRouter(<MobileDrawer />);
            const overlay = document.querySelector('[aria-hidden="true"]');
            expect(overlay).toHaveClass('opacity-50');
            expect(overlay).not.toHaveClass('pointer-events-none');
        });

        it('드로어 패널이 화면에 표시', () => {
            renderWithRouter(<MobileDrawer />);
            const drawer = screen.getByRole('dialog');
            expect(drawer).toHaveClass('translate-x-0');
        });

        it('스크롤이 잠김', () => {
            renderWithRouter(<MobileDrawer />);
            expect(document.body.style.overflow).toBe('hidden');
        });
    });

    describe('렌더링', () => {
        beforeEach(() => {
            vi.mocked(useMobileMenuStore).mockReturnValue({
                isOpen: true,
                close: mockClose,
            });
        });

        it('앱 이름 렌더링', () => {
            renderWithRouter(<MobileDrawer />);
            expect(screen.getByText(APP_CONFIG.NAME)).toBeInTheDocument();
        });

        it('닫기 버튼 렌더링', () => {
            renderWithRouter(<MobileDrawer />);
            expect(
                screen.getByRole('button', { name: '메뉴 닫기' })
            ).toBeInTheDocument();
        });

        it('네비게이션 메뉴 렌더링', () => {
            renderWithRouter(<MobileDrawer />);
            expect(
                screen.getByRole('navigation', { name: '모바일 네비게이션' })
            ).toBeInTheDocument();
        });

        it('메뉴 목록 렌더링', () => {
            renderWithRouter(<MobileDrawer />);
            expect(screen.getByRole('list')).toBeInTheDocument();
        });
    });

    describe('상호작용', () => {
        beforeEach(() => {
            vi.mocked(useMobileMenuStore).mockReturnValue({
                isOpen: true,
                close: mockClose,
            });
        });

        it('닫기 버튼 클릭 시 close 호출', () => {
            renderWithRouter(<MobileDrawer />);
            const callCountBefore = mockClose.mock.calls.length;
            fireEvent.click(screen.getByRole('button', { name: '메뉴 닫기' }));
            expect(mockClose.mock.calls.length).toBe(callCountBefore + 1);
        });

        it('오버레이 클릭 시 close 호출', () => {
            renderWithRouter(<MobileDrawer />);
            const callCountBefore = mockClose.mock.calls.length;
            const overlay = document.querySelector('[aria-hidden="true"]');
            fireEvent.click(overlay!);
            expect(mockClose.mock.calls.length).toBe(callCountBefore + 1);
        });

        it('ESC 키 누르면 close 호출', () => {
            renderWithRouter(<MobileDrawer />);
            const callCountBefore = mockClose.mock.calls.length;
            fireEvent.keyDown(document, { key: 'Escape' });
            expect(mockClose.mock.calls.length).toBe(callCountBefore + 1);
        });
    });

    describe('ESC 키 동작', () => {
        it('닫힌 상태에서 ESC 키 누르면 close 호출 안 함', () => {
            vi.mocked(useMobileMenuStore).mockReturnValue({
                isOpen: false,
                close: mockClose,
            });
            renderWithRouter(<MobileDrawer />);
            const callCountBefore = mockClose.mock.calls.length;
            fireEvent.keyDown(document, { key: 'Escape' });
            expect(mockClose.mock.calls.length).toBe(callCountBefore);
        });

        it('열린 상태에서 ESC 키 누르면 close 호출', () => {
            vi.mocked(useMobileMenuStore).mockReturnValue({
                isOpen: true,
                close: mockClose,
            });
            renderWithRouter(<MobileDrawer />);
            const callCountBefore = mockClose.mock.calls.length;
            fireEvent.keyDown(document, { key: 'Escape' });
            expect(mockClose.mock.calls.length).toBe(callCountBefore + 1);
        });
    });

    describe('접근성', () => {
        beforeEach(() => {
            vi.mocked(useMobileMenuStore).mockReturnValue({
                isOpen: true,
                close: mockClose,
            });
        });

        it('드로어에 role="dialog" 적용', () => {
            renderWithRouter(<MobileDrawer />);
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        it('드로어에 aria-modal="true" 적용', () => {
            renderWithRouter(<MobileDrawer />);
            expect(screen.getByRole('dialog')).toHaveAttribute(
                'aria-modal',
                'true'
            );
        });

        it('드로어에 aria-label 적용', () => {
            renderWithRouter(<MobileDrawer />);
            expect(screen.getByRole('dialog')).toHaveAttribute(
                'aria-label',
                '모바일 메뉴'
            );
        });

        it('홈 링크에 aria-label 적용', () => {
            renderWithRouter(<MobileDrawer />);
            expect(
                screen.getByRole('link', {
                    name: new RegExp(`${APP_CONFIG.NAME}.*홈으로 이동`, 'i'),
                })
            ).toBeInTheDocument();
        });

        it('닫기 버튼에 aria-label 적용', () => {
            renderWithRouter(<MobileDrawer />);
            expect(
                screen.getByRole('button', { name: '메뉴 닫기' })
            ).toBeInTheDocument();
        });
    });

    describe('스크롤 잠금 정리', () => {
        it('컴포넌트 언마운트 시 스크롤 잠금 해제', () => {
            vi.mocked(useMobileMenuStore).mockReturnValue({
                isOpen: true,
                close: mockClose,
            });

            const { unmount } = renderWithRouter(<MobileDrawer />);
            expect(document.body.style.overflow).toBe('hidden');

            unmount();
            expect(document.body.style.overflow).toBe('');
        });
    });
});
