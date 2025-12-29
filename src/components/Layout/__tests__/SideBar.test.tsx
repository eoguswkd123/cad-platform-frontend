/**
 * SideBar.test.tsx
 * 사이드바 컴포넌트 테스트
 *
 * 주요 테스트:
 * - 렌더링 (로고, 앱 이름, 설명, 메뉴)
 * - 네비게이션 링크
 * - 접근성
 */

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import { APP_CONFIG, MENU_ITEMS, ROUTES } from '@/constants';

import { SideBar } from '../SideBar';

const renderWithRouter = (ui: React.ReactElement, initialRoute = '/') => {
    return render(
        <MemoryRouter initialEntries={[initialRoute]}>{ui}</MemoryRouter>
    );
};

describe('SideBar', () => {
    describe('렌더링', () => {
        it('앱 이름 렌더링', () => {
            renderWithRouter(<SideBar />);
            expect(screen.getByText(APP_CONFIG.NAME)).toBeInTheDocument();
        });

        it('앱 설명 렌더링', () => {
            renderWithRouter(<SideBar />);
            expect(
                screen.getByText(APP_CONFIG.DESCRIPTION)
            ).toBeInTheDocument();
        });

        it('홈 링크 렌더링', () => {
            renderWithRouter(<SideBar />);
            const homeLink = screen.getByRole('link', {
                name: new RegExp(`${APP_CONFIG.NAME}.*홈으로 이동`, 'i'),
            });
            expect(homeLink).toBeInTheDocument();
            expect(homeLink).toHaveAttribute('href', ROUTES.HOME);
        });

        it('네비게이션 메뉴 렌더링', () => {
            renderWithRouter(<SideBar />);
            expect(
                screen.getByRole('navigation', { name: '메인 네비게이션' })
            ).toBeInTheDocument();
        });

        it('메뉴 목록 렌더링', () => {
            renderWithRouter(<SideBar />);
            expect(screen.getByRole('list')).toBeInTheDocument();
        });

        it('모든 메뉴 아이템 렌더링', () => {
            renderWithRouter(<SideBar />);
            MENU_ITEMS.forEach((item) => {
                expect(screen.getByText(item.label)).toBeInTheDocument();
            });
        });

        it('메뉴 아이템 설명 렌더링', () => {
            renderWithRouter(<SideBar />);
            MENU_ITEMS.forEach((item) => {
                expect(
                    screen.getAllByText(item.description).length
                ).toBeGreaterThanOrEqual(1);
            });
        });
    });

    describe('접근성', () => {
        it('aside 요소에 role="complementary" 적용', () => {
            renderWithRouter(<SideBar />);
            expect(screen.getByRole('complementary')).toBeInTheDocument();
        });

        it('aside 요소에 aria-label 적용', () => {
            renderWithRouter(<SideBar />);
            expect(screen.getByRole('complementary')).toHaveAttribute(
                'aria-label',
                '사이드바'
            );
        });

        it('네비게이션에 aria-label 적용', () => {
            renderWithRouter(<SideBar />);
            expect(
                screen.getByRole('navigation', { name: '메인 네비게이션' })
            ).toBeInTheDocument();
        });

        it('홈 링크에 aria-label 적용', () => {
            renderWithRouter(<SideBar />);
            expect(
                screen.getByRole('link', {
                    name: new RegExp(`${APP_CONFIG.NAME}.*홈으로 이동`, 'i'),
                })
            ).toBeInTheDocument();
        });
    });

    describe('반응형', () => {
        it('md 미만에서 숨김 클래스 적용', () => {
            renderWithRouter(<SideBar />);
            const aside = screen.getByRole('complementary');
            expect(aside).toHaveClass('hidden', 'md:block');
        });
    });

    describe('스타일', () => {
        it('고정 너비 적용', () => {
            renderWithRouter(<SideBar />);
            const aside = screen.getByRole('complementary');
            expect(aside).toHaveClass('w-64');
        });

        it('테두리 및 배경 스타일 적용', () => {
            renderWithRouter(<SideBar />);
            const aside = screen.getByRole('complementary');
            expect(aside).toHaveClass('border-r', 'bg-white');
        });
    });
});
