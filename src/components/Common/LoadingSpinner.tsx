/**
 * LoadingSpinner - 로딩 스피너 컴포넌트
 *
 * React.lazy Suspense의 fallback으로 사용
 *
 * @example
 * ```tsx
 * <Suspense fallback={<LoadingSpinner />}>
 *   <LazyComponent />
 * </Suspense>
 * ```
 */

import { memo } from 'react';

import { Loader2 } from 'lucide-react';

import { MESSAGES } from '@/locales/ko';

/** LoadingSpinner Props */
interface LoadingSpinnerProps {
    /** 스피너 크기 (기본: 'md') */
    size?: 'sm' | 'md' | 'lg';
    /** 추가 CSS 클래스 */
    className?: string;
}

/** 크기별 스타일 */
const SPINNER_SIZES = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
} as const;

/**
 * LoadingSpinner 컴포넌트
 *
 * @param props - 컴포넌트 속성
 * @param props.size - 스피너 크기 ('sm' | 'md' | 'lg')
 * @param props.className - 추가 CSS 클래스
 */
function LoadingSpinnerComponent({
    size = 'md',
    className = '',
}: LoadingSpinnerProps) {
    return (
        <div
            className={`flex h-full items-center justify-center ${className}`}
            role="status"
            aria-label={MESSAGES.aria.loading}
        >
            <Loader2
                className={`${SPINNER_SIZES[size]} animate-spin text-gray-400`}
            />
        </div>
    );
}

export const LoadingSpinner = memo(LoadingSpinnerComponent);
