/**
 * Footer.test.tsx
 * 푸터 컴포넌트 테스트
 *
 * 주요 테스트:
 * - 렌더링 (앱 이름, 버전, 저작권)
 * - 스타일
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { APP_CONFIG } from '@/constants';

import { Footer } from '../Footer';

describe('Footer', () => {
    describe('렌더링', () => {
        it('앱 이름과 버전 렌더링', () => {
            render(<Footer />);
            expect(
                screen.getByText(`${APP_CONFIG.NAME} v${APP_CONFIG.VERSION}`)
            ).toBeInTheDocument();
        });

        it('저작권 정보 렌더링', () => {
            render(<Footer />);
            expect(screen.getByText(APP_CONFIG.COPYRIGHT)).toBeInTheDocument();
        });
    });

    describe('시맨틱 HTML', () => {
        it('footer 요소로 렌더링', () => {
            render(<Footer />);
            const footer = document.querySelector('footer');
            expect(footer).toBeInTheDocument();
        });
    });

    describe('스타일', () => {
        it('상단 테두리 적용', () => {
            render(<Footer />);
            const footer = document.querySelector('footer');
            expect(footer).toHaveClass('border-t');
        });

        it('배경색 적용', () => {
            render(<Footer />);
            const footer = document.querySelector('footer');
            expect(footer).toHaveClass('bg-gray-50');
        });

        it('패딩 적용', () => {
            render(<Footer />);
            const footer = document.querySelector('footer');
            expect(footer).toHaveClass('p-4');
        });
    });

    describe('텍스트 스타일', () => {
        it('텍스트 크기 적용', () => {
            render(<Footer />);
            const textContainer = document.querySelector('.text-sm');
            expect(textContainer).toBeInTheDocument();
        });

        it('텍스트 색상 적용', () => {
            render(<Footer />);
            const textContainer = document.querySelector('.text-gray-600');
            expect(textContainer).toBeInTheDocument();
        });
    });
});
