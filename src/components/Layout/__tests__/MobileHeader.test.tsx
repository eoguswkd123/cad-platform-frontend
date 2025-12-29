/**
 * MobileHeader.test.tsx
 * 모바일 헤더 컴포넌트 테스트
 *
 * 주요 테스트:
 * - 렌더링 (햄버거 버튼, 앱 로고)
 * - 상호작용 (메뉴 토글)
 * - 접근성
 * - 반응형
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { APP_CONFIG, ROUTES } from '@/constants';
import { useMobileMenuStore } from '@/stores/useMobileMenuStore';

import { MobileHeader } from '../MobileHeader';

// Store 모킹
vi.mock('@/stores/useMobileMenuStore', () => ({
    useMobileMenuStore: vi.fn(),
}));

const mockToggle = vi.fn();

const renderWithRouter = (ui: React.ReactElement) => {
    return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe('MobileHeader', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useMobileMenuStore).mockReturnValue(mockToggle);
    });

    describe('렌더링', () => {
        it('앱 이름 렌더링', () => {
            renderWithRouter(<MobileHeader />);
            expect(screen.getByText(APP_CONFIG.NAME)).toBeInTheDocument();
        });

        it('햄버거 메뉴 버튼 렌더링', () => {
            renderWithRouter(<MobileHeader />);
            expect(
                screen.getByRole('button', { name: '메뉴 열기' })
            ).toBeInTheDocument();
        });

        it('홈 링크 렌더링', () => {
            renderWithRouter(<MobileHeader />);
            const homeLink = screen.getByRole('link', {
                name: new RegExp(`${APP_CONFIG.NAME}.*홈으로 이동`, 'i'),
            });
            expect(homeLink).toBeInTheDocument();
            expect(homeLink).toHaveAttribute('href', ROUTES.HOME);
        });
    });

    describe('상호작용', () => {
        it('햄버거 버튼 클릭 시 toggle 호출', () => {
            renderWithRouter(<MobileHeader />);
            fireEvent.click(screen.getByRole('button', { name: '메뉴 열기' }));
            expect(mockToggle).toHaveBeenCalledTimes(1);
        });
    });

    describe('접근성', () => {
        it('header 요소에 role="banner" 적용', () => {
            renderWithRouter(<MobileHeader />);
            expect(screen.getByRole('banner')).toBeInTheDocument();
        });

        it('햄버거 버튼에 aria-label 적용', () => {
            renderWithRouter(<MobileHeader />);
            expect(
                screen.getByRole('button', { name: '메뉴 열기' })
            ).toBeInTheDocument();
        });

        it('햄버거 버튼에 aria-expanded 적용', () => {
            renderWithRouter(<MobileHeader />);
            const button = screen.getByRole('button', { name: '메뉴 열기' });
            expect(button).toHaveAttribute('aria-expanded', 'false');
        });

        it('햄버거 버튼에 aria-controls 적용', () => {
            renderWithRouter(<MobileHeader />);
            const button = screen.getByRole('button', { name: '메뉴 열기' });
            expect(button).toHaveAttribute('aria-controls', 'mobile-drawer');
        });

        it('홈 링크에 aria-label 적용', () => {
            renderWithRouter(<MobileHeader />);
            expect(
                screen.getByRole('link', {
                    name: new RegExp(`${APP_CONFIG.NAME}.*홈으로 이동`, 'i'),
                })
            ).toBeInTheDocument();
        });

        it('균형용 공간에 aria-hidden 적용', () => {
            renderWithRouter(<MobileHeader />);
            const spacer = document.querySelector('[aria-hidden="true"]');
            expect(spacer).toBeInTheDocument();
        });
    });

    describe('반응형', () => {
        it('md 이상에서 숨김 클래스 적용', () => {
            renderWithRouter(<MobileHeader />);
            const header = screen.getByRole('banner');
            expect(header).toHaveClass('md:hidden');
        });
    });

    describe('스타일', () => {
        it('flexbox 레이아웃 적용', () => {
            renderWithRouter(<MobileHeader />);
            const header = screen.getByRole('banner');
            expect(header).toHaveClass(
                'flex',
                'items-center',
                'justify-between'
            );
        });

        it('테두리 및 그림자 적용', () => {
            renderWithRouter(<MobileHeader />);
            const header = screen.getByRole('banner');
            expect(header).toHaveClass('border-b', 'shadow-sm');
        });

        it('배경색 적용', () => {
            renderWithRouter(<MobileHeader />);
            const header = screen.getByRole('banner');
            expect(header).toHaveClass('bg-white');
        });
    });
});
