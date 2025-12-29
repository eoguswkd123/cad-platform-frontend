/**
 * Common Components - 공통 상수 정의
 *
 * 프로젝트 전반에서 사용되는 스타일 및 설정 상수
 */

/**
 * 통합 액센트 컬러 스타일 (Tailwind 클래스)
 *
 * 모든 컴포넌트에서 사용하는 색상 클래스를 단일 소스로 관리
 */
export const ACCENT_CLASSES = {
    green: {
        // 공통 텍스트/아이콘
        icon: 'text-green-400',
        iconHover: 'hover:text-green-300',
        // 체크박스 전용
        checkbox: 'text-green-500 focus:ring-green-500',
        // FileUpload 전용
        border: 'border-green-400',
        bg: 'bg-green-900/20',
        progress: 'bg-green-500',
    },
    blue: {
        icon: 'text-blue-400',
        iconHover: 'hover:text-blue-300',
        checkbox: 'text-blue-500 focus:ring-blue-500',
        border: 'border-blue-400',
        bg: 'bg-blue-900/20',
        progress: 'bg-blue-500',
    },
} as const;

/** 액센트 컬러 타입 */
export type AccentColor = keyof typeof ACCENT_CLASSES;
