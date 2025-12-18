/**
 * Typography - 텍스트 스타일 컴포넌트
 *
 * 일관된 타이포그래피를 위한 텍스트 컴포넌트 모음
 */

import type { HTMLAttributes, ReactNode } from 'react';
import { memo } from 'react';

/** 텍스트 컬러 */
const TEXT_COLORS = {
    default: 'text-gray-900',
    muted: 'text-gray-500',
    light: 'text-gray-200',
    primary: 'text-blue-600',
    success: 'text-green-600',
    danger: 'text-red-600',
    warning: 'text-yellow-600',
} as const;

/** Heading 크기 스타일 (컴포넌트 외부에서 한 번만 생성) */
const HEADING_SIZE_STYLES = {
    1: 'text-3xl font-bold',
    2: 'text-2xl font-bold',
    3: 'text-xl font-semibold',
    4: 'text-lg font-semibold',
    5: 'text-base font-medium',
    6: 'text-sm font-medium',
} as const;

/** Text 크기 스타일 */
const TEXT_SIZE_STYLES = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
} as const;

/** Text 굵기 스타일 */
const TEXT_WEIGHT_STYLES = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
} as const;

/** 텍스트 컬러 타입 */
export type TextColor = keyof typeof TEXT_COLORS;

/** 공통 Typography Props */
interface TypographyBaseProps extends HTMLAttributes<HTMLElement> {
    /** 텍스트 컬러 */
    color?: TextColor;
    /** 자식 요소 */
    children: ReactNode;
}

/** Heading Props */
interface HeadingProps extends TypographyBaseProps {
    /** 헤딩 레벨 */
    level?: 1 | 2 | 3 | 4 | 5 | 6;
}

/** Heading 태그 타입 */
type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

/** Heading 컴포넌트 */
const HeadingComponent = ({
    level = 1,
    color = 'default',
    children,
    className = '',
    ...props
}: HeadingProps): JSX.Element => {
    const Tag = `h${level}` as HeadingTag;

    const combinedClassName = [
        HEADING_SIZE_STYLES[level],
        TEXT_COLORS[color],
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <Tag className={combinedClassName} {...props}>
            {children}
        </Tag>
    );
};

/** Text Props */
interface TextProps extends TypographyBaseProps {
    /** 텍스트 크기 */
    size?: 'xs' | 'sm' | 'base' | 'lg';
    /** 굵기 */
    weight?: 'normal' | 'medium' | 'semibold' | 'bold';
    /** 태그 */
    as?: 'p' | 'span' | 'div';
}

/** Text 컴포넌트 */
const TextComponent = ({
    size = 'base',
    weight = 'normal',
    color = 'default',
    as: Tag = 'p',
    children,
    className = '',
    ...props
}: TextProps): JSX.Element => {
    const combinedClassName = [
        TEXT_SIZE_STYLES[size],
        TEXT_WEIGHT_STYLES[weight],
        TEXT_COLORS[color],
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <Tag className={combinedClassName} {...props}>
            {children}
        </Tag>
    );
};

/** Label Props */
interface LabelProps extends TypographyBaseProps {
    /** 필수 표시 */
    required?: boolean;
}

/** Label 컴포넌트 */
const LabelComponent = ({
    color = 'default',
    required = false,
    children,
    className = '',
    ...props
}: LabelProps): JSX.Element => {
    const combinedClassName = [
        'text-sm font-medium',
        TEXT_COLORS[color],
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <label className={combinedClassName} {...props}>
            {children}
            {required && <span className="ml-1 text-red-500">*</span>}
        </label>
    );
};

export const Heading = memo(HeadingComponent);
export const Text = memo(TextComponent);
export const Label = memo(LabelComponent);
