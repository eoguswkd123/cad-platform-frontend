/**
 * Button - 범용 버튼 컴포넌트
 *
 * 다양한 스타일과 크기를 지원하는 재사용 가능한 버튼
 */

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { memo, forwardRef } from 'react';

/** 버튼 변형 스타일 */
const BUTTON_VARIANTS = {
    // 라이트 테마 variant
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    // 다크 테마 variant
    'ghost-dark':
        'bg-gray-700 text-gray-200 hover:bg-gray-600 focus:ring-gray-500',
    'danger-dark':
        'bg-red-900/50 text-red-200 hover:bg-red-900 focus:ring-red-500',
} as const;

/** 버튼 크기 스타일 */
const BUTTON_SIZES = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
} as const;

/** 버튼 변형 타입 */
export type ButtonVariant = keyof typeof BUTTON_VARIANTS;

/** 버튼 크기 타입 */
export type ButtonSize = keyof typeof BUTTON_SIZES;

/** Button Props */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /** 버튼 변형 */
    variant?: ButtonVariant;
    /** 버튼 크기 */
    size?: ButtonSize;
    /** 아이콘 (좌측) */
    icon?: ReactNode;
    /** 아이콘 (우측) */
    iconRight?: ReactNode;
    /** 로딩 상태 */
    loading?: boolean;
    /** 전체 너비 */
    fullWidth?: boolean;
}

const ButtonComponent = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = 'primary',
            size = 'md',
            icon,
            iconRight,
            loading = false,
            fullWidth = false,
            disabled,
            children,
            className = '',
            ...props
        },
        ref
    ): JSX.Element => {
        const baseStyles =
            'inline-flex items-center justify-center gap-1 rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

        const combinedClassName = [
            baseStyles,
            BUTTON_VARIANTS[variant],
            BUTTON_SIZES[size],
            fullWidth ? 'w-full' : '',
            className,
        ]
            .filter(Boolean)
            .join(' ');

        return (
            <button
                ref={ref}
                type="button"
                disabled={disabled || loading}
                className={combinedClassName}
                {...props}
            >
                {loading ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : icon ? (
                    <span className="flex-shrink-0">{icon}</span>
                ) : null}
                {children}
                {iconRight && (
                    <span className="flex-shrink-0">{iconRight}</span>
                )}
            </button>
        );
    }
);

ButtonComponent.displayName = 'Button';

export const Button = memo(ButtonComponent);
