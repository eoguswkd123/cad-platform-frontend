/**
 * ViewerActionButtons - 뷰어 액션 버튼 컴포넌트
 *
 * Reset(뷰 리셋)과 Clear(파일/모델 삭제) 버튼을 제공
 */

import { memo } from 'react';

import { Home, RotateCcw, Trash2 } from 'lucide-react';

import { Button } from '@/components/Common';

import { DEFAULT_LABELS } from './constants';

/** ViewerActionButtons Props */
interface ViewerActionButtonsProps {
    /** 리셋 핸들러 */
    onReset: () => void;
    /** 클리어 핸들러 (없으면 클리어 버튼 숨김) */
    onClear?: (() => void) | undefined;
    /** 리셋 버튼 라벨 */
    resetLabel?: string;
    /** 클리어 버튼 라벨 */
    clearLabel?: string;
    /** 리셋 아이콘 타입 */
    resetIcon?: 'rotate' | 'home';
}

/** 리셋 아이콘 매핑 */
const RESET_ICONS = {
    rotate: RotateCcw,
    home: Home,
} as const;

function ViewerActionButtonsComponent({
    onReset,
    onClear,
    resetLabel = DEFAULT_LABELS.reset,
    clearLabel = DEFAULT_LABELS.clear,
    resetIcon = 'rotate',
}: ViewerActionButtonsProps) {
    const ResetIcon = RESET_ICONS[resetIcon];

    return (
        <div className="flex gap-2">
            <Button
                variant="ghost-dark"
                size="sm"
                onClick={onReset}
                aria-label={resetLabel}
                icon={<ResetIcon className="h-3 w-3" />}
                className="flex-1"
            >
                {resetLabel}
            </Button>

            {onClear && (
                <Button
                    variant="danger-dark"
                    size="sm"
                    onClick={onClear}
                    aria-label={clearLabel}
                    icon={<Trash2 className="h-3 w-3" />}
                    className="flex-1"
                >
                    {clearLabel}
                </Button>
            )}
        </div>
    );
}

export const ViewerActionButtons = memo(ViewerActionButtonsComponent);
