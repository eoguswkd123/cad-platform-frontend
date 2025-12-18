/**
 * ShadingSelect - Shading Mode 선택 컴포넌트
 *
 * 3D 뷰어의 쉐이딩 모드를 제어하는 셀렉트 박스
 */

import { memo, useCallback } from 'react';

import { Palette } from 'lucide-react';

import type { ShadingMode } from './types';

/** Shading Mode 옵션 */
const SHADING_OPTIONS: readonly { value: ShadingMode; label: string }[] = [
    { value: 'wireframe', label: 'Wireframe' },
    { value: 'flat', label: 'Flat' },
    { value: 'smooth', label: 'Smooth' },
    { value: 'glossy', label: 'Glossy' },
];

/** ShadingSelect Props */
interface ShadingSelectProps {
    /** 현재 선택된 값 */
    value: ShadingMode;
    /** 변경 핸들러 */
    onChange: (value: ShadingMode) => void;
    /** 라벨 텍스트 */
    label?: string;
}

function ShadingSelectComponent({
    value,
    onChange,
    label = 'Shading',
}: ShadingSelectProps): JSX.Element {
    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLSelectElement>) => {
            onChange(e.target.value as ShadingMode);
        },
        [onChange]
    );

    return (
        <div className="mb-3">
            <div className="mb-1 flex items-center gap-2">
                <Palette className="h-4 w-4 text-gray-400" />
                <span className="text-xs text-gray-400">{label}</span>
            </div>
            <select
                value={value}
                onChange={handleChange}
                aria-label={label}
                className="w-full rounded border border-gray-600 bg-gray-700 px-2 py-1.5 text-sm text-gray-200 focus:border-transparent focus:ring-2 focus:ring-green-500 focus:outline-none"
            >
                {SHADING_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

export const ShadingSelect = memo(ShadingSelectComponent);
