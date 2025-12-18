/**
 * FileUpload - Constants
 *
 * 기본 설정값 및 스타일 상수
 */

import type { FileUploadConfig, FileUploadMessages } from './types';

/**
 * 기본 파일 업로드 설정
 * Feature에서 오버라이드하여 사용
 */
export const DEFAULT_FILE_UPLOAD_CONFIG: FileUploadConfig = {
    accept: {
        extensions: ['*'],
        mimeTypes: [],
    },
    limits: {
        maxSize: 10 * 1024 * 1024, // 10MB
    },
};

/**
 * 기본 UI 메시지
 * Feature에서 오버라이드하여 사용
 */
export const DEFAULT_FILE_UPLOAD_MESSAGES: FileUploadMessages = {
    dragPrompt: '파일을 드래그하거나 클릭',
    maxSizeText: '최대 10MB',
    sampleLabel: '샘플 불러오기',
    loadingText: '처리 중...',
};

/**
 * 강조 색상별 Tailwind 클래스
 */
export const ACCENT_COLOR_CLASSES = {
    green: {
        border: 'border-green-400',
        bg: 'bg-green-900/20',
        icon: 'text-green-400',
        progress: 'bg-green-500',
    },
    blue: {
        border: 'border-blue-400',
        bg: 'bg-blue-900/20',
        icon: 'text-blue-400',
        progress: 'bg-blue-500',
    },
} as const;
