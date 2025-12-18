/**
 * SpeedSlider.test.tsx
 * 회전 속도 슬라이더 컴포넌트 테스트
 *
 * 주요 테스트:
 * - 초기값 렌더링
 * - onChange 콜백 호출
 * - min/max/step 설정
 * - 라벨 및 값 표시
 * - 커스텀 formatValue 함수
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { SPEED_SLIDER_CONFIG } from '../constants';
import { SpeedSlider } from '../SpeedSlider';

describe('SpeedSlider', () => {
    describe('렌더링', () => {
        it('초기값 렌더링', () => {
            render(<SpeedSlider value={1.5} onChange={vi.fn()} />);

            expect(screen.getByRole('slider')).toHaveValue('1.5');
        });

        it('기본 라벨 "Rotate Speed" 표시', () => {
            render(<SpeedSlider value={1} onChange={vi.fn()} />);

            expect(screen.getByText('Rotate Speed')).toBeInTheDocument();
        });

        it('커스텀 라벨 표시', () => {
            render(
                <SpeedSlider value={1} onChange={vi.fn()} label="회전 속도" />
            );

            expect(screen.getByText('회전 속도')).toBeInTheDocument();
        });

        it('기본 formatValue로 값 표시 (예: "1.5x")', () => {
            render(<SpeedSlider value={1.5} onChange={vi.fn()} />);

            expect(screen.getByText('1.5x')).toBeInTheDocument();
        });

        it('커스텀 formatValue로 값 표시', () => {
            const formatValue = (value: number) => `속도: ${value}`;
            render(
                <SpeedSlider
                    value={2}
                    onChange={vi.fn()}
                    formatValue={formatValue}
                />
            );

            expect(screen.getByText('속도: 2')).toBeInTheDocument();
        });
    });

    describe('기본값 적용', () => {
        it('기본 min 값 적용', () => {
            render(<SpeedSlider value={1} onChange={vi.fn()} />);

            expect(screen.getByRole('slider')).toHaveAttribute(
                'min',
                String(SPEED_SLIDER_CONFIG.min)
            );
        });

        it('기본 max 값 적용', () => {
            render(<SpeedSlider value={1} onChange={vi.fn()} />);

            expect(screen.getByRole('slider')).toHaveAttribute(
                'max',
                String(SPEED_SLIDER_CONFIG.max)
            );
        });

        it('기본 step 값 적용', () => {
            render(<SpeedSlider value={1} onChange={vi.fn()} />);

            expect(screen.getByRole('slider')).toHaveAttribute(
                'step',
                String(SPEED_SLIDER_CONFIG.step)
            );
        });

        it('커스텀 min/max/step 적용', () => {
            render(
                <SpeedSlider
                    value={5}
                    onChange={vi.fn()}
                    min={0}
                    max={10}
                    step={0.5}
                />
            );

            const slider = screen.getByRole('slider');
            expect(slider).toHaveAttribute('min', '0');
            expect(slider).toHaveAttribute('max', '10');
            expect(slider).toHaveAttribute('step', '0.5');
        });
    });

    describe('상호작용', () => {
        it('슬라이더 변경 시 onChange가 파싱된 숫자로 호출됨', () => {
            const onChange = vi.fn();
            render(<SpeedSlider value={1} onChange={onChange} />);

            fireEvent.change(screen.getByRole('slider'), {
                target: { value: '2.5' },
            });

            expect(onChange).toHaveBeenCalledTimes(1);
            expect(onChange).toHaveBeenCalledWith(2.5);
        });

        it('정수값 변경 시에도 숫자로 호출됨', () => {
            const onChange = vi.fn();
            render(<SpeedSlider value={1} onChange={onChange} />);

            fireEvent.change(screen.getByRole('slider'), {
                target: { value: '3' },
            });

            expect(onChange).toHaveBeenCalledWith(3);
        });
    });

    describe('접근성', () => {
        it('기본 aria-label은 label과 동일', () => {
            render(<SpeedSlider value={1} onChange={vi.fn()} />);

            expect(screen.getByRole('slider')).toHaveAttribute(
                'aria-label',
                'Rotate Speed'
            );
        });

        it('커스텀 ariaLabel 적용', () => {
            render(
                <SpeedSlider
                    value={1}
                    onChange={vi.fn()}
                    ariaLabel="회전 속도 조절"
                />
            );

            expect(screen.getByRole('slider')).toHaveAttribute(
                'aria-label',
                '회전 속도 조절'
            );
        });
    });
});
