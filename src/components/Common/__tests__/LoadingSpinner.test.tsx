/**
 * LoadingSpinner.test.tsx
 * 로딩 스피너 컴포넌트 테스트
 *
 * 주요 테스트:
 * - 렌더링 및 기본값
 * - sizes (sm, md, lg)
 * - 접근성 (role, aria-label)
 * - className 전달
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { LoadingSpinner } from '../LoadingSpinner';

describe('LoadingSpinner', () => {
    describe('렌더링', () => {
        it('기본 렌더링', () => {
            render(<LoadingSpinner />);
            expect(screen.getByRole('status')).toBeInTheDocument();
        });

        it('스피너 아이콘 렌더링', () => {
            render(<LoadingSpinner />);
            const spinner = screen.getByRole('status');
            // SVG 아이콘이 렌더링되었는지 확인
            expect(spinner.querySelector('svg')).toBeInTheDocument();
        });
    });

    describe('sizes', () => {
        it('기본 size는 md', () => {
            render(<LoadingSpinner />);
            const spinner = screen.getByRole('status');
            const icon = spinner.querySelector('svg');
            expect(icon).toHaveClass('h-8', 'w-8');
        });

        it('sm 크기 적용', () => {
            render(<LoadingSpinner size="sm" />);
            const spinner = screen.getByRole('status');
            const icon = spinner.querySelector('svg');
            expect(icon).toHaveClass('h-4', 'w-4');
        });

        it('lg 크기 적용', () => {
            render(<LoadingSpinner size="lg" />);
            const spinner = screen.getByRole('status');
            const icon = spinner.querySelector('svg');
            expect(icon).toHaveClass('h-12', 'w-12');
        });
    });

    describe('접근성', () => {
        it('role="status" 적용', () => {
            render(<LoadingSpinner />);
            expect(screen.getByRole('status')).toBeInTheDocument();
        });

        it('aria-label 적용', () => {
            render(<LoadingSpinner />);
            expect(screen.getByRole('status')).toHaveAttribute(
                'aria-label',
                '로딩 중'
            );
        });
    });

    describe('스타일링', () => {
        it('className prop 전달', () => {
            render(<LoadingSpinner className="custom-class" />);
            expect(screen.getByRole('status')).toHaveClass('custom-class');
        });

        it('기본 flex 레이아웃 클래스 적용', () => {
            render(<LoadingSpinner />);
            const spinner = screen.getByRole('status');
            expect(spinner).toHaveClass(
                'flex',
                'items-center',
                'justify-center'
            );
        });

        it('animate-spin 클래스 적용 (회전 애니메이션)', () => {
            render(<LoadingSpinner />);
            const spinner = screen.getByRole('status');
            const icon = spinner.querySelector('svg');
            expect(icon).toHaveClass('animate-spin');
        });
    });
});
