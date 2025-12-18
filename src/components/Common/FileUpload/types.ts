/**
 * FileUpload - Type Definitions
 *
 * 범용 파일 업로드 컴포넌트 타입
 * Feature에서 config와 messages를 주입하여 파일 타입별 커스터마이징
 */

/** 유효성 검사 결과 */
export interface ValidationResult {
    valid: boolean;
    error?: UploadError;
}

/** 업로드 에러 */
export interface UploadError {
    code: string;
    message: string;
}

/**
 * 파일 업로드 설정
 * Feature에서 정의하여 FileUpload에 주입
 */
export interface FileUploadConfig {
    /** 허용 파일 타입 */
    accept: {
        /** 허용 확장자 (예: ['.dxf'], ['.gltf', '.glb'], ['.pdf']) */
        extensions: readonly string[];
        /** 허용 MIME 타입 (선택) */
        mimeTypes?: readonly string[];
    };
    /** 파일 크기 제한 */
    limits: {
        /** 최대 파일 크기 (bytes) */
        maxSize: number;
        /** 경고 표시 임계값 (bytes, 선택) */
        warnSize?: number;
    };
    /** 커스텀 유효성 검사 함수 (선택) */
    validate?: (file: File) => ValidationResult;
}

/**
 * UI 메시지
 * Feature에서 정의하여 FileUpload에 주입 (i18n 확장 가능)
 */
export interface FileUploadMessages {
    /** 드래그 영역 안내 메시지 */
    dragPrompt: string;
    /** 최대 크기 안내 텍스트 */
    maxSizeText: string;
    /** 샘플 버튼 라벨 (선택) */
    sampleLabel?: string;
    /** 로딩 중 메시지 (선택) */
    loadingText?: string;
}

/**
 * FileUpload Props
 * ControlPanelViewer 패턴: config + messages로 설정 주입
 */
export interface FileUploadProps {
    // === Config (Feature가 주입) ===
    /** 파일 타입 설정 */
    config: FileUploadConfig;
    /** UI 메시지 */
    messages: FileUploadMessages;

    // === Callbacks ===
    /** 파일 선택 콜백 */
    onFileSelect: (file: File) => void;
    /** 샘플 불러오기 콜백 (선택) */
    onLoadSample?: () => void;

    // === State (부모에서 관리) ===
    /** 로딩 상태 */
    isLoading?: boolean;
    /** 진행률 (0-100) */
    progress?: number;
    /** 진행 단계 메시지 */
    progressStage?: string;
    /** 외부 에러 */
    error?: UploadError | null;
    /** 비활성화 */
    disabled?: boolean;
    /** 데이터 로드 상태 (true면 컴포넌트 숨김) */
    hasData?: boolean;

    // === Styling ===
    /** 강조 색상 */
    accentColor?: 'green' | 'blue';
}
