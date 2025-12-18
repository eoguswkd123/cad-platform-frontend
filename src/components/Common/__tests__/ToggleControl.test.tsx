/**
 * ToggleControl.test.tsx
 * 범용 토글 체크박스 컴포넌트 테스트
 *
 * 주요 테스트:
 * - 렌더링 (아이콘, 라벨)
 * - 체크 상태 (checked/unchecked)
 * - 상호작용 (onChange 콜백)
 * - 액센트 컬러
 * - 접근성 (aria-label)
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { ToggleControl } from '../ToggleControl';

const defaultProps = {
    checked: false,
    onChange: vi.fn(),
    label: '테스트 토글',
    icon: <span data-testid="test-icon">🔧</span>,
};

describe('ToggleControl', () => {
    describe('렌더링', () => {
        it('라벨 텍스트 렌더링', () => {
            render(<ToggleControl {...defaultProps} />);
            expect(screen.getByText('테스트 토글')).toBeInTheDocument();
        });

        it('아이콘 렌더링', () => {
            render(<ToggleControl {...defaultProps} />);
            expect(screen.getByTestId('test-icon')).toBeInTheDocument();
        });

        it('체크박스 렌더링', () => {
            render(<ToggleControl {...defaultProps} />);
            expect(screen.getByRole('checkbox')).toBeInTheDocument();
        });

        it('label 요소로 감싸져 있음', () => {
            render(<ToggleControl {...defaultProps} />);
            const label = screen.getByText('테스트 토글').closest('label');
            expect(label).toBeInTheDocument();
        });
    });

    describe('체크 상태', () => {
        it('checked=false일 때 체크박스 미체크', () => {
            render(<ToggleControl {...defaultProps} checked={false} />);
            expect(screen.getByRole('checkbox')).not.toBeChecked();
        });

        it('checked=true일 때 체크박스 체크됨', () => {
            render(<ToggleControl {...defaultProps} checked={true} />);
            expect(screen.getByRole('checkbox')).toBeChecked();
        });
    });

    describe('상호작용', () => {
        it('체크박스 클릭 시 onChange 호출', () => {
            const onChange = vi.fn();
            render(<ToggleControl {...defaultProps} onChange={onChange} />);

            fireEvent.click(screen.getByRole('checkbox'));
            expect(onChange).toHaveBeenCalledTimes(1);
        });

        it('미체크 상태에서 클릭 시 onChange(true) 호출', () => {
            const onChange = vi.fn();
            render(
                <ToggleControl
                    {...defaultProps}
                    checked={false}
                    onChange={onChange}
                />
            );

            fireEvent.click(screen.getByRole('checkbox'));
            expect(onChange).toHaveBeenCalledWith(true);
        });

        it('체크 상태에서 클릭 시 onChange(false) 호출', () => {
            const onChange = vi.fn();
            render(
                <ToggleControl
                    {...defaultProps}
                    checked={true}
                    onChange={onChange}
                />
            );

            fireEvent.click(screen.getByRole('checkbox'));
            expect(onChange).toHaveBeenCalledWith(false);
        });

        it('라벨 클릭 시에도 onChange 호출', () => {
            const onChange = vi.fn();
            render(<ToggleControl {...defaultProps} onChange={onChange} />);

            fireEvent.click(screen.getByText('테스트 토글'));
            expect(onChange).toHaveBeenCalledTimes(1);
        });
    });

    describe('액센트 컬러', () => {
        it('기본 액센트 컬러는 green', () => {
            render(<ToggleControl {...defaultProps} />);
            expect(screen.getByRole('checkbox')).toHaveClass('text-green-500');
        });

        it('blue 액센트 컬러 적용', () => {
            render(<ToggleControl {...defaultProps} accentColor="blue" />);
            expect(screen.getByRole('checkbox')).toHaveClass('text-blue-500');
        });
    });

    describe('마진 클래스', () => {
        it('기본 마진 클래스는 mb-2', () => {
            render(<ToggleControl {...defaultProps} />);
            const label = screen.getByText('테스트 토글').closest('label');
            expect(label).toHaveClass('mb-2');
        });

        it('커스텀 마진 클래스 적용', () => {
            render(<ToggleControl {...defaultProps} marginClass="mb-4" />);
            const label = screen.getByText('테스트 토글').closest('label');
            expect(label).toHaveClass('mb-4');
        });
    });

    describe('접근성', () => {
        it('aria-label 기본값은 label prop', () => {
            render(<ToggleControl {...defaultProps} label="그리드 표시" />);
            expect(screen.getByRole('checkbox')).toHaveAttribute(
                'aria-label',
                '그리드 표시'
            );
        });

        it('커스텀 ariaLabel 적용', () => {
            render(
                <ToggleControl {...defaultProps} ariaLabel="그리드 표시 토글" />
            );
            expect(screen.getByRole('checkbox')).toHaveAttribute(
                'aria-label',
                '그리드 표시 토글'
            );
        });

        it('체크박스는 클릭 가능한 커서 스타일', () => {
            render(<ToggleControl {...defaultProps} />);
            const label = screen.getByText('테스트 토글').closest('label');
            expect(label).toHaveClass('cursor-pointer');
        });
    });
});
