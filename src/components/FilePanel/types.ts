/**
 * FilePanel - Type Definitions
 */

import type { FileUploadConfig, FileValidationResult } from '@/utils';

// ============================================================
// File Upload Types
// ============================================================

/** 업로드 에러 */
export interface UploadError {
    code: string;
    message: string;
}

// Re-export for convenience
export type { FileUploadConfig, FileValidationResult };

/**
 * UI 메시지
 * Feature에서 정의하여 FileUploadBox에 주입 (i18n 확장 가능)
 */
export interface FileUploadMessages {
    /** 드래그 영역 안내 메시지 */
    dragPrompt: string;
    /** 최대 크기 안내 텍스트 */
    maxSizeText: string;
    /** 로딩 중 메시지 (선택) */
    loadingText?: string;
}

/** FileUploadBox Props */
export interface FileUploadBoxProps {
    /** 파일 타입 설정 */
    config: FileUploadConfig;
    /** UI 메시지 */
    messages: FileUploadMessages;
    /** 파일 선택 콜백 */
    onFileSelect: (file: File) => void;
    /** 로딩 상태 */
    isLoading?: boolean;
    /** 진행률 (0-100) */
    progress?: number;
    /** 진행 단계 메시지 */
    progressStage?: string;
    /** 외부 에러 */
    error?: UploadError | null;
    /** 강조 색상 */
    accentColor?: 'green' | 'blue';
}

// ============================================================
// Sample & URL Types
// ============================================================

/** 샘플 파일 정보 */
export interface SampleInfo {
    /** 고유 ID */
    id: string;
    /** 표시 이름 */
    name: string;
    /** 파일 경로 (예: "/samples/sample.dxf") */
    path: string;
    /** 파일 포맷 (예: "dxf", "glb") */
    format?: string;
    /** 파일 크기 (bytes) */
    fileSize?: number;
}

/** SampleList Props */
export interface SampleListProps {
    /** 샘플 파일 목록 */
    samples: SampleInfo[];
    /** 로딩 상태 */
    isLoading?: boolean;
    /** 샘플 선택 콜백 */
    onSelectSample: (sample: SampleInfo) => void;
    /** 테마 색상 */
    accentColor?: 'green' | 'blue';
}

/** URL 검증 설정 */
export interface UrlValidationConfig {
    /** 허용 확장자 (예: ['.glb', '.gltf']) */
    acceptExtensions?: readonly string[];
}

/** UrlInput Props */
export interface UrlInputProps {
    /** URL 제출 콜백 */
    onUrlSubmit: (url: string) => void;
    /** 로딩 상태 */
    isLoading?: boolean;
    /** placeholder 텍스트 */
    placeholder?: string;
    /** 테마 색상 */
    accentColor?: 'green' | 'blue';
    /** URL 검증 설정 */
    validationConfig?: UrlValidationConfig;
}
