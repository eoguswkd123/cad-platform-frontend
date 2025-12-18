/**
 * SpeedSlider - 회전 속도 슬라이더 컴포넌트
 *
 * 3D 뷰어의 자동 회전 속도를 제어하는 슬라이더
 */

import { memo, useCallback } from 'react';

import { DEFAULT_LABELS, SPEED_SLIDER_CONFIG } from './constants';

/** SpeedSlider Props */
interface SpeedSliderProps {
    /** 현재 값 */
    value: number;
    /** 변경 핸들러 */
    onChange: (value: number) => void;
    /** 최소값 */
    min?: number;
    /** 최대값 */
    max?: number;
    /** 스텝 */
    step?: number;
    /** 라벨 텍스트 */
    label?: string;
    /** 값 표시 포맷 함수 */
    formatValue?: (value: number) => string;
    /** 접근성 라벨 */
    ariaLabel?: string;
}

/** 기본 값 포맷 함수 */
const defaultFormatValue = (value: number): string => `${value.toFixed(1)}x`;

function SpeedSliderComponent({
    value,
    onChange,
    min = SPEED_SLIDER_CONFIG.min,
    max = SPEED_SLIDER_CONFIG.max,
    step = SPEED_SLIDER_CONFIG.step,
    label = DEFAULT_LABELS.rotateSpeed,
    formatValue = defaultFormatValue,
    ariaLabel,
}: SpeedSliderProps) {
    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onChange(parseFloat(e.target.value));
        },
        [onChange]
    );

    return (
        <div className="mb-3">
            <label className="mb-1 flex items-center justify-between text-xs text-gray-400">
                <span>{label}</span>
                <span>{formatValue(value)}</span>
            </label>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={handleChange}
                aria-label={ariaLabel ?? label}
                className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-gray-700"
            />
        </div>
    );
}

export const SpeedSlider = memo(SpeedSliderComponent);
