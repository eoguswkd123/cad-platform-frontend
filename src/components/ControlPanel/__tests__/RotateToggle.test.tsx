/**
 * RotateToggle.test.tsx
 * 자동 회전 토글 컴포넌트 테스트
 *
 * 주요 테스트:
 * - 체크 상태 렌더링
 * - onChange 콜백 호출
 * - 라벨 표시
 * - 기본값 적용
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { RotateToggle } from '../RotateToggle';

describe('RotateToggle', () => {
    describe('렌더링', () => {
        it('checked=true일 때 체크박스가 체크 상태', () => {
            render(<RotateToggle checked={true} onChange={vi.fn()} />);

            expect(screen.getByRole('checkbox')).toBeChecked();
        });

        it('checked=false일 때 체크박스가 체크 해제 상태', () => {
            render(<RotateToggle checked={false} onChange={vi.fn()} />);

            expect(screen.getByRole('checkbox')).not.toBeChecked();
        });

        it('기본 라벨 "Auto Rotate" 표시', () => {
            render(<RotateToggle checked={false} onChange={vi.fn()} />);

            expect(screen.getByText('Auto Rotate')).toBeInTheDocument();
        });

        it('커스텀 라벨 표시', () => {
            render(
                <RotateToggle
                    checked={false}
                    onChange={vi.fn()}
                    label="자동 회전"
                />
            );

            expect(screen.getByText('자동 회전')).toBeInTheDocument();
        });

        // Note: 커스텀 아이콘은 ToggleControl에서 지원, RotateToggle은 RefreshCw 고정
    });

    describe('상호작용', () => {
        it('체크박스 클릭 시 onChange가 true로 호출됨 (unchecked → checked)', () => {
            const onChange = vi.fn();
            render(<RotateToggle checked={false} onChange={onChange} />);

            fireEvent.click(screen.getByRole('checkbox'));

            expect(onChange).toHaveBeenCalledTimes(1);
            expect(onChange).toHaveBeenCalledWith(true);
        });

        it('체크박스 클릭 시 onChange가 false로 호출됨 (checked → unchecked)', () => {
            const onChange = vi.fn();
            render(<RotateToggle checked={true} onChange={onChange} />);

            fireEvent.click(screen.getByRole('checkbox'));

            expect(onChange).toHaveBeenCalledTimes(1);
            expect(onChange).toHaveBeenCalledWith(false);
        });

        it('라벨 클릭 시에도 onChange 호출됨', () => {
            const onChange = vi.fn();
            render(<RotateToggle checked={false} onChange={onChange} />);

            fireEvent.click(screen.getByText('Auto Rotate'));

            expect(onChange).toHaveBeenCalledTimes(1);
        });
    });

    describe('접근성', () => {
        it('기본 aria-label은 label과 동일', () => {
            render(<RotateToggle checked={false} onChange={vi.fn()} />);

            expect(screen.getByRole('checkbox')).toHaveAttribute(
                'aria-label',
                'Auto Rotate'
            );
        });

        it('커스텀 ariaLabel 적용', () => {
            render(
                <RotateToggle
                    checked={false}
                    onChange={vi.fn()}
                    ariaLabel="자동 회전 토글"
                />
            );

            expect(screen.getByRole('checkbox')).toHaveAttribute(
                'aria-label',
                '자동 회전 토글'
            );
        });
    });
});
