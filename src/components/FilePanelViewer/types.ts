/**
 * FilePanelViewer - Type Definitions
 */

import type {
    FileUploadConfig,
    FileUploadMessages,
    UploadError,
    SampleInfo,
} from '@/components/FilePanel';

/** FilePanelViewer Props */
export interface FilePanelViewerProps {
    /** 업로드 설정 */
    uploadConfig: FileUploadConfig;
    /** 업로드 메시지 */
    uploadMessages: FileUploadMessages;

    /** 파일 선택 콜백 */
    onFileSelect: (file: File) => void;

    /** 샘플 파일 목록 */
    samples: SampleInfo[];
    /** 샘플 로딩 상태 */
    samplesLoading?: boolean;
    /** 샘플 선택 콜백 */
    onSelectSample: (sample: SampleInfo) => void;

    /** 파일 파싱 로딩 상태 */
    isLoading?: boolean;
    /** 파싱 진행률 (0-100) */
    progress?: number;
    /** 진행 단계 텍스트 */
    progressStage?: string;
    /** 에러 정보 */
    error?: UploadError | null;

    /** 데이터 로드 여부 (true면 패널 숨김) */
    hasData?: boolean;

    /** 테마 색상 */
    accentColor?: 'green' | 'blue';

    /** URL 제출 콜백 (optional - 있을 때만 UrlInput 표시) */
    onUrlSubmit?: (url: string) => void;
    /** URL 입력 placeholder */
    urlPlaceholder?: string;
}
