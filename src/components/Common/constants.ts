/**
 * Common Components - 공통 상수 정의
 *
 * 프로젝트 전반에서 사용되는 스타일 및 설정 상수
 */

/** 체크박스/토글 액센트 컬러 스타일 (Tailwind 클래스) */
export const CHECKBOX_STYLES = {
    green: 'text-green-500 focus:ring-green-500',
    blue: 'text-blue-500 focus:ring-blue-500',
} as const;

/** 액센트 컬러 타입 */
export type AccentColor = keyof typeof CHECKBOX_STYLES;
