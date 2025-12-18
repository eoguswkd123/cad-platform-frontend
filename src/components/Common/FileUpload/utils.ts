/**
 * FileUpload - Utility Functions
 *
 * 파일 업로드 관련 범용 유틸리티
 */

import type { FileUploadConfig, ValidationResult } from './types';

/**
 * 파일 크기를 읽기 쉬운 형식으로 변환
 * @param bytes 파일 크기 (bytes)
 * @returns 포맷된 문자열 (예: "1.5 MB")
 */
export function formatFileSize(bytes: number): string {
    if (bytes < 1024) {
        return `${bytes} B`;
    }
    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

/**
 * 파일 확장자 검사
 * @param file 검사할 파일
 * @param extensions 허용 확장자 배열
 * @returns 유효성 결과
 */
export function validateFileExtension(
    file: File,
    extensions: readonly string[]
): ValidationResult {
    const fileName = file.name.toLowerCase();
    const isValidExtension = extensions.some((ext) =>
        fileName.endsWith(ext.toLowerCase())
    );

    if (!isValidExtension) {
        const extList = extensions.join(', ');
        return {
            valid: false,
            error: {
                code: 'INVALID_TYPE',
                message: `허용된 파일 형식: ${extList}`,
            },
        };
    }

    return { valid: true };
}

/**
 * 파일 크기 검사
 * @param file 검사할 파일
 * @param maxSize 최대 크기 (bytes)
 * @returns 유효성 결과
 */
export function validateFileSize(
    file: File,
    maxSize: number
): ValidationResult {
    if (file.size > maxSize) {
        return {
            valid: false,
            error: {
                code: 'FILE_TOO_LARGE',
                message: `파일 크기가 너무 큽니다. 최대 ${formatFileSize(maxSize)}까지 지원합니다.`,
            },
        };
    }

    return { valid: true };
}

/**
 * 빈 파일 검사
 * @param file 검사할 파일
 * @returns 유효성 결과
 */
export function validateFileNotEmpty(file: File): ValidationResult {
    if (file.size === 0) {
        return {
            valid: false,
            error: {
                code: 'EMPTY_FILE',
                message: '빈 파일입니다.',
            },
        };
    }

    return { valid: true };
}

/**
 * 파일 유효성 검사 (config 기반)
 * @param file 검사할 파일
 * @param config 파일 업로드 설정
 * @returns 유효성 결과
 */
export function validateFile(
    file: File,
    config: FileUploadConfig
): ValidationResult {
    // 1. 빈 파일 검사
    const emptyResult = validateFileNotEmpty(file);
    if (!emptyResult.valid) {
        return emptyResult;
    }

    // 2. 확장자 검사
    const extensionResult = validateFileExtension(
        file,
        config.accept.extensions
    );
    if (!extensionResult.valid) {
        return extensionResult;
    }

    // 3. 파일 크기 검사
    const sizeResult = validateFileSize(file, config.limits.maxSize);
    if (!sizeResult.valid) {
        return sizeResult;
    }

    // 4. 커스텀 검증 (있는 경우)
    if (config.validate) {
        const customResult = config.validate(file);
        if (!customResult.valid) {
            return customResult;
        }
    }

    return { valid: true };
}

/**
 * 파일 크기 경고 여부 확인
 * @param file 파일
 * @param warnSize 경고 임계값 (bytes)
 * @returns 경고 표시 여부
 */
export function shouldShowSizeWarning(
    file: File,
    warnSize: number | undefined
): boolean {
    if (warnSize === undefined) {
        return false;
    }
    return file.size > warnSize;
}
