/**
 * FileUpload - Barrel Export
 *
 * 범용 파일 업로드 컴포넌트
 * Feature에서 config와 messages를 주입하여 파일 타입별 커스터마이징
 */

// Component
export { FileUpload } from './FileUpload';

// Types
export type {
    FileUploadProps,
    FileUploadConfig,
    FileUploadMessages,
    ValidationResult,
    UploadError,
} from './types';

// Utils
export { formatFileSize, validateFile, shouldShowSizeWarning } from './utils';

// Constants
export {
    DEFAULT_FILE_UPLOAD_CONFIG,
    DEFAULT_FILE_UPLOAD_MESSAGES,
    ACCENT_COLOR_CLASSES,
} from './constants';
