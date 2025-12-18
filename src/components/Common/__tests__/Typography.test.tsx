/**
 * Typography.test.tsx
 * Typography 컴포넌트 테스트 (Heading, Text, Label)
 *
 * 주요 테스트:
 * - Heading: 레벨별 렌더링, 컬러, className
 * - Text: 크기, 굵기, 태그, 컬러
 * - Label: 필수 표시, 컬러
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Heading, Text, Label } from '../Typography';

describe('Heading', () => {
    describe('렌더링', () => {
        it('기본 h1 태그로 렌더링', () => {
            render(<Heading>제목</Heading>);
            expect(
                screen.getByRole('heading', { level: 1 })
            ).toBeInTheDocument();
        });

        it('children 텍스트 렌더링', () => {
            render(<Heading>테스트 제목</Heading>);
            expect(screen.getByText('테스트 제목')).toBeInTheDocument();
        });

        it('커스텀 className 추가', () => {
            render(<Heading className="custom-class">제목</Heading>);
            expect(screen.getByRole('heading')).toHaveClass('custom-class');
        });
    });

    describe('레벨', () => {
        it.each([1, 2, 3, 4, 5, 6] as const)(
            'level=%i로 h%i 태그 렌더링',
            (level) => {
                render(<Heading level={level}>제목</Heading>);
                expect(
                    screen.getByRole('heading', { level })
                ).toBeInTheDocument();
            }
        );

        it('level=1은 text-3xl 스타일 적용', () => {
            render(<Heading level={1}>제목</Heading>);
            expect(screen.getByRole('heading')).toHaveClass(
                'text-3xl',
                'font-bold'
            );
        });

        it('level=2는 text-2xl 스타일 적용', () => {
            render(<Heading level={2}>제목</Heading>);
            expect(screen.getByRole('heading')).toHaveClass(
                'text-2xl',
                'font-bold'
            );
        });

        it('level=3은 text-xl 스타일 적용', () => {
            render(<Heading level={3}>제목</Heading>);
            expect(screen.getByRole('heading')).toHaveClass(
                'text-xl',
                'font-semibold'
            );
        });
    });

    describe('컬러', () => {
        it('기본 컬러는 default (text-gray-900)', () => {
            render(<Heading>제목</Heading>);
            expect(screen.getByRole('heading')).toHaveClass('text-gray-900');
        });

        it('muted 컬러 적용', () => {
            render(<Heading color="muted">제목</Heading>);
            expect(screen.getByRole('heading')).toHaveClass('text-gray-500');
        });

        it('primary 컬러 적용', () => {
            render(<Heading color="primary">제목</Heading>);
            expect(screen.getByRole('heading')).toHaveClass('text-blue-600');
        });

        it('danger 컬러 적용', () => {
            render(<Heading color="danger">제목</Heading>);
            expect(screen.getByRole('heading')).toHaveClass('text-red-600');
        });
    });
});

describe('Text', () => {
    describe('렌더링', () => {
        it('기본 p 태그로 렌더링', () => {
            render(<Text>텍스트</Text>);
            expect(screen.getByText('텍스트').tagName).toBe('P');
        });

        it('children 텍스트 렌더링', () => {
            render(<Text>테스트 텍스트</Text>);
            expect(screen.getByText('테스트 텍스트')).toBeInTheDocument();
        });

        it('커스텀 className 추가', () => {
            render(<Text className="custom-class">텍스트</Text>);
            expect(screen.getByText('텍스트')).toHaveClass('custom-class');
        });
    });

    describe('태그 (as prop)', () => {
        it('as="span"으로 span 태그 렌더링', () => {
            render(<Text as="span">텍스트</Text>);
            expect(screen.getByText('텍스트').tagName).toBe('SPAN');
        });

        it('as="div"로 div 태그 렌더링', () => {
            render(<Text as="div">텍스트</Text>);
            expect(screen.getByText('텍스트').tagName).toBe('DIV');
        });
    });

    describe('크기', () => {
        it('기본 크기는 base (text-base)', () => {
            render(<Text>텍스트</Text>);
            expect(screen.getByText('텍스트')).toHaveClass('text-base');
        });

        it('xs 크기 적용', () => {
            render(<Text size="xs">텍스트</Text>);
            expect(screen.getByText('텍스트')).toHaveClass('text-xs');
        });

        it('sm 크기 적용', () => {
            render(<Text size="sm">텍스트</Text>);
            expect(screen.getByText('텍스트')).toHaveClass('text-sm');
        });

        it('lg 크기 적용', () => {
            render(<Text size="lg">텍스트</Text>);
            expect(screen.getByText('텍스트')).toHaveClass('text-lg');
        });
    });

    describe('굵기', () => {
        it('기본 굵기는 normal (font-normal)', () => {
            render(<Text>텍스트</Text>);
            expect(screen.getByText('텍스트')).toHaveClass('font-normal');
        });

        it('medium 굵기 적용', () => {
            render(<Text weight="medium">텍스트</Text>);
            expect(screen.getByText('텍스트')).toHaveClass('font-medium');
        });

        it('semibold 굵기 적용', () => {
            render(<Text weight="semibold">텍스트</Text>);
            expect(screen.getByText('텍스트')).toHaveClass('font-semibold');
        });

        it('bold 굵기 적용', () => {
            render(<Text weight="bold">텍스트</Text>);
            expect(screen.getByText('텍스트')).toHaveClass('font-bold');
        });
    });

    describe('컬러', () => {
        it('기본 컬러는 default (text-gray-900)', () => {
            render(<Text>텍스트</Text>);
            expect(screen.getByText('텍스트')).toHaveClass('text-gray-900');
        });

        it('light 컬러 적용', () => {
            render(<Text color="light">텍스트</Text>);
            expect(screen.getByText('텍스트')).toHaveClass('text-gray-200');
        });

        it('success 컬러 적용', () => {
            render(<Text color="success">텍스트</Text>);
            expect(screen.getByText('텍스트')).toHaveClass('text-green-600');
        });

        it('warning 컬러 적용', () => {
            render(<Text color="warning">텍스트</Text>);
            expect(screen.getByText('텍스트')).toHaveClass('text-yellow-600');
        });
    });
});

describe('Label', () => {
    describe('렌더링', () => {
        it('label 태그로 렌더링', () => {
            render(<Label>라벨</Label>);
            expect(screen.getByText('라벨').tagName).toBe('LABEL');
        });

        it('children 텍스트 렌더링', () => {
            render(<Label>테스트 라벨</Label>);
            expect(screen.getByText('테스트 라벨')).toBeInTheDocument();
        });

        it('커스텀 className 추가', () => {
            render(<Label className="custom-class">라벨</Label>);
            expect(screen.getByText('라벨')).toHaveClass('custom-class');
        });

        it('기본 스타일 적용 (text-sm font-medium)', () => {
            render(<Label>라벨</Label>);
            const label = screen.getByText('라벨');
            expect(label).toHaveClass('text-sm', 'font-medium');
        });
    });

    describe('필수 표시', () => {
        it('required=false일 때 * 표시 없음', () => {
            render(<Label>라벨</Label>);
            expect(screen.queryByText('*')).not.toBeInTheDocument();
        });

        it('required=true일 때 * 표시', () => {
            render(<Label required>라벨</Label>);
            expect(screen.getByText('*')).toBeInTheDocument();
        });

        it('required * 표시는 빨간색', () => {
            render(<Label required>라벨</Label>);
            expect(screen.getByText('*')).toHaveClass('text-red-500');
        });
    });

    describe('컬러', () => {
        it('기본 컬러는 default (text-gray-900)', () => {
            render(<Label>라벨</Label>);
            expect(screen.getByText('라벨')).toHaveClass('text-gray-900');
        });

        it('muted 컬러 적용', () => {
            render(<Label color="muted">라벨</Label>);
            expect(screen.getByText('라벨')).toHaveClass('text-gray-500');
        });
    });
});
