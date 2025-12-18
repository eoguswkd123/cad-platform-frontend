/**
 * Button.test.tsx
 * 범용 버튼 컴포넌트 테스트
 *
 * 주요 테스트:
 * - 렌더링 및 기본값
 * - variants (primary, secondary, danger 등)
 * - sizes (sm, md, lg)
 * - 상호작용 (클릭, disabled, loading)
 * - 아이콘 (좌측, 우측)
 * - 접근성
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { Button } from '../Button';

describe('Button', () => {
    describe('렌더링', () => {
        it('children 텍스트 렌더링', () => {
            render(<Button>클릭</Button>);
            expect(
                screen.getByRole('button', { name: '클릭' })
            ).toBeInTheDocument();
        });

        it('기본 type="button"으로 렌더링', () => {
            render(<Button>테스트</Button>);
            expect(screen.getByRole('button')).toHaveAttribute(
                'type',
                'button'
            );
        });

        it('커스텀 className 추가', () => {
            render(<Button className="custom-class">버튼</Button>);
            expect(screen.getByRole('button')).toHaveClass('custom-class');
        });
    });

    describe('variants', () => {
        it('기본 variant는 primary', () => {
            render(<Button>Primary</Button>);
            expect(screen.getByRole('button')).toHaveClass('bg-blue-600');
        });

        it('secondary variant 적용', () => {
            render(<Button variant="secondary">Secondary</Button>);
            expect(screen.getByRole('button')).toHaveClass('bg-gray-600');
        });

        it('success variant 적용', () => {
            render(<Button variant="success">Success</Button>);
            expect(screen.getByRole('button')).toHaveClass('bg-green-600');
        });

        it('danger variant 적용', () => {
            render(<Button variant="danger">Danger</Button>);
            expect(screen.getByRole('button')).toHaveClass('bg-red-600');
        });

        it('ghost variant 적용', () => {
            render(<Button variant="ghost">Ghost</Button>);
            expect(screen.getByRole('button')).toHaveClass('bg-transparent');
        });

        it('ghost-dark variant 적용', () => {
            render(<Button variant="ghost-dark">Ghost Dark</Button>);
            expect(screen.getByRole('button')).toHaveClass('bg-gray-700');
        });

        it('danger-dark variant 적용', () => {
            render(<Button variant="danger-dark">Danger Dark</Button>);
            expect(screen.getByRole('button')).toHaveClass('bg-red-900/50');
        });
    });

    describe('sizes', () => {
        it('기본 size는 md', () => {
            render(<Button>Medium</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('px-4', 'py-2', 'text-sm');
        });

        it('sm 크기 적용', () => {
            render(<Button size="sm">Small</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('px-2', 'py-1', 'text-xs');
        });

        it('lg 크기 적용', () => {
            render(<Button size="lg">Large</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('px-6', 'py-3', 'text-base');
        });
    });

    describe('상호작용', () => {
        it('클릭 시 onClick 호출', () => {
            const onClick = vi.fn();
            render(<Button onClick={onClick}>클릭</Button>);

            fireEvent.click(screen.getByRole('button'));
            expect(onClick).toHaveBeenCalledTimes(1);
        });

        it('disabled 시 클릭 불가', () => {
            const onClick = vi.fn();
            render(
                <Button onClick={onClick} disabled>
                    비활성
                </Button>
            );

            fireEvent.click(screen.getByRole('button'));
            expect(onClick).not.toHaveBeenCalled();
        });

        it('disabled 시 버튼에 disabled 속성 적용', () => {
            render(<Button disabled>비활성</Button>);
            expect(screen.getByRole('button')).toBeDisabled();
        });

        it('loading 시 버튼 disabled 상태', () => {
            render(<Button loading>로딩중</Button>);
            expect(screen.getByRole('button')).toBeDisabled();
        });

        it('loading 시 스피너 표시', () => {
            render(<Button loading>로딩중</Button>);
            const button = screen.getByRole('button');
            expect(button.querySelector('.animate-spin')).toBeInTheDocument();
        });
    });

    describe('아이콘', () => {
        it('좌측 아이콘 렌더링', () => {
            render(
                <Button icon={<span data-testid="left-icon">🔍</span>}>
                    검색
                </Button>
            );
            expect(screen.getByTestId('left-icon')).toBeInTheDocument();
        });

        it('우측 아이콘 렌더링', () => {
            render(
                <Button iconRight={<span data-testid="right-icon">→</span>}>
                    다음
                </Button>
            );
            expect(screen.getByTestId('right-icon')).toBeInTheDocument();
        });

        it('좌측, 우측 아이콘 동시 렌더링', () => {
            render(
                <Button
                    icon={<span data-testid="left-icon">←</span>}
                    iconRight={<span data-testid="right-icon">→</span>}
                >
                    양방향
                </Button>
            );
            expect(screen.getByTestId('left-icon')).toBeInTheDocument();
            expect(screen.getByTestId('right-icon')).toBeInTheDocument();
        });

        it('loading 시 좌측 아이콘 대신 스피너 표시', () => {
            render(
                <Button icon={<span data-testid="left-icon">🔍</span>} loading>
                    로딩
                </Button>
            );
            expect(screen.queryByTestId('left-icon')).not.toBeInTheDocument();
            expect(
                screen.getByRole('button').querySelector('.animate-spin')
            ).toBeInTheDocument();
        });
    });

    describe('fullWidth', () => {
        it('fullWidth 적용 시 w-full 클래스 추가', () => {
            render(<Button fullWidth>전체 너비</Button>);
            expect(screen.getByRole('button')).toHaveClass('w-full');
        });

        it('fullWidth 미적용 시 w-full 클래스 없음', () => {
            render(<Button>일반 너비</Button>);
            expect(screen.getByRole('button')).not.toHaveClass('w-full');
        });
    });

    describe('접근성', () => {
        it('포커스 링 스타일 적용', () => {
            render(<Button>포커스</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('focus:ring-2', 'focus:outline-none');
        });

        it('disabled 시 커서 스타일 적용', () => {
            render(<Button disabled>비활성</Button>);
            expect(screen.getByRole('button')).toHaveClass(
                'disabled:cursor-not-allowed'
            );
        });

        it('disabled 시 opacity 스타일 적용', () => {
            render(<Button disabled>비활성</Button>);
            expect(screen.getByRole('button')).toHaveClass(
                'disabled:opacity-50'
            );
        });
    });

    describe('forwardRef', () => {
        it('ref가 버튼 요소에 연결됨', () => {
            const ref = vi.fn();
            render(<Button ref={ref}>Ref 테스트</Button>);
            expect(ref).toHaveBeenCalled();
            expect(ref.mock.calls[0]?.[0]).toBeInstanceOf(HTMLButtonElement);
        });
    });
});
