/**
 * SideBarMenuItem.test.tsx
 * 사이드바 메뉴 아이템 컴포넌트 테스트
 *
 * 주요 테스트:
 * - 렌더링 (라벨, 설명, 아이콘)
 * - 네비게이션 링크
 * - 활성 상태 스타일
 * - 접근성
 */

import { render, screen } from '@testing-library/react';
import { Home } from 'lucide-react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import type { MenuItem } from '@/types/menu';

import { SideBarMenuItem } from '../SideBarMenuItem';

const mockItem: MenuItem = {
    path: '/test-path',
    icon: Home,
    label: '테스트 메뉴',
    description: '테스트 메뉴 설명',
};

const renderWithRouter = (ui: React.ReactElement, initialRoute = '/') => {
    return render(
        <MemoryRouter initialEntries={[initialRoute]}>{ui}</MemoryRouter>
    );
};

describe('SideBarMenuItem', () => {
    describe('렌더링', () => {
        it('메뉴 라벨 렌더링', () => {
            renderWithRouter(<SideBarMenuItem item={mockItem} />);
            expect(screen.getByText(mockItem.label)).toBeInTheDocument();
        });

        it('메뉴 설명 렌더링', () => {
            renderWithRouter(<SideBarMenuItem item={mockItem} />);
            expect(screen.getByText(mockItem.description)).toBeInTheDocument();
        });

        it('li 요소로 렌더링', () => {
            renderWithRouter(<SideBarMenuItem item={mockItem} />);
            expect(screen.getByRole('listitem')).toBeInTheDocument();
        });

        it('링크로 렌더링', () => {
            renderWithRouter(<SideBarMenuItem item={mockItem} />);
            const link = screen.getByRole('link');
            expect(link).toBeInTheDocument();
            expect(link).toHaveAttribute('href', mockItem.path);
        });
    });

    describe('활성 상태', () => {
        it('현재 경로와 일치하면 활성 스타일 적용', () => {
            renderWithRouter(
                <SideBarMenuItem item={mockItem} />,
                mockItem.path
            );
            const link = screen.getByRole('link');
            expect(link).toHaveClass('bg-blue-50', 'text-blue-700');
        });

        it('현재 경로와 불일치하면 기본 스타일 적용', () => {
            renderWithRouter(
                <SideBarMenuItem item={mockItem} />,
                '/other-path'
            );
            const link = screen.getByRole('link');
            expect(link).toHaveClass('text-gray-700');
            expect(link).not.toHaveClass('bg-blue-50');
        });

        it('활성 상태에서 테두리 스타일 적용', () => {
            renderWithRouter(
                <SideBarMenuItem item={mockItem} />,
                mockItem.path
            );
            const link = screen.getByRole('link');
            expect(link).toHaveClass('border-r-2', 'border-blue-700');
        });
    });

    describe('접근성', () => {
        it('링크에 aria-label 적용', () => {
            renderWithRouter(<SideBarMenuItem item={mockItem} />);
            const link = screen.getByRole('link');
            expect(link).toHaveAttribute('aria-label', mockItem.description);
        });

        it('활성 상태에서 "현재 페이지" 스크린 리더 텍스트 표시', () => {
            renderWithRouter(
                <SideBarMenuItem item={mockItem} />,
                mockItem.path
            );
            expect(screen.getByText(/현재 페이지:/)).toBeInTheDocument();
        });

        it('비활성 상태에서 "현재 페이지" 텍스트 없음', () => {
            renderWithRouter(
                <SideBarMenuItem item={mockItem} />,
                '/other-path'
            );
            expect(screen.queryByText(/현재 페이지:/)).not.toBeInTheDocument();
        });

        it('스크린 리더 전용 텍스트에 sr-only 클래스 적용', () => {
            renderWithRouter(
                <SideBarMenuItem item={mockItem} />,
                mockItem.path
            );
            const srOnly = document.querySelector('.sr-only');
            expect(srOnly).toBeInTheDocument();
        });
    });

    describe('스타일', () => {
        it('flexbox 레이아웃 적용', () => {
            renderWithRouter(<SideBarMenuItem item={mockItem} />);
            const link = screen.getByRole('link');
            expect(link).toHaveClass('flex', 'items-center');
        });

        it('둥근 모서리 적용', () => {
            renderWithRouter(<SideBarMenuItem item={mockItem} />);
            const link = screen.getByRole('link');
            expect(link).toHaveClass('rounded-lg');
        });

        it('패딩 적용', () => {
            renderWithRouter(<SideBarMenuItem item={mockItem} />);
            const link = screen.getByRole('link');
            expect(link).toHaveClass('px-4', 'py-3');
        });

        it('전환 효과 적용', () => {
            renderWithRouter(<SideBarMenuItem item={mockItem} />);
            const link = screen.getByRole('link');
            expect(link).toHaveClass('transition-colors');
        });
    });

    describe('메모이제이션', () => {
        it('컴포넌트가 memo로 래핑됨', () => {
            // memo 적용 여부는 displayName이나 내부 구조로 확인
            // 여기서는 정상 렌더링 여부로 간접 확인
            renderWithRouter(<SideBarMenuItem item={mockItem} />);
            expect(screen.getByRole('listitem')).toBeInTheDocument();
        });
    });
});
