/**
 * cn - Tailwind CSS 클래스 병합 유틸리티
 *
 * clsx와 tailwind-merge를 조합하여 조건부 클래스와
 * Tailwind 클래스 충돌을 자동으로 처리합니다.
 *
 * @example
 * cn("px-2 py-1", isActive && "bg-blue-500", "px-4")
 * // 결과: "py-1 bg-blue-500 px-4" (px-4가 px-2를 덮어씀)
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}
