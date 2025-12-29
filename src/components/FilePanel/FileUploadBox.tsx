/**
 * FileUploadBox - 파일 업로드 UI 컴포넌트
 *
 * DropZone을 기반으로 로딩, 에러, 진행률 등 도메인 UI를 제공
 *
 * @example
 * <FileUploadBox
 *   config={DXF_UPLOAD_CONFIG}
 *   messages={DXF_UPLOAD_MESSAGES}
 *   onFileSelect={handleFileSelect}
 *   isLoading={isLoading}
 *   progress={progress}
 *   accentColor="green"
 * />
 */

import { memo, useCallback, useState } from 'react';

import { Upload, FileText, AlertCircle, Loader2 } from 'lucide-react';

import { ACCENT_CLASSES } from '@/components/Common/constants';
import { DropZone } from '@/components/Common/DropZone';
import {
    validateFile,
    formatFileSize,
    shouldShowSizeWarning,
    logWarn,
} from '@/utils';

import type { FileUploadBoxProps } from './types';

// ============================================================================
// 내부 상태 컴포넌트 (memo 불필요 - 부모만 memo)
// ============================================================================

/** 액센트 색상 타입 */
type AccentColors = (typeof ACCENT_CLASSES)[keyof typeof ACCENT_CLASSES];

/** 로딩 상태 Props */
interface LoadingStateProps {
    colors: AccentColors;
    loadingText: string;
    progress: number;
}

/** 로딩 상태 UI */
const LoadingState = ({ colors, loadingText, progress }: LoadingStateProps) => (
    <>
        <Loader2 className={`h-8 w-8 animate-spin ${colors.icon}`} />
        <span className="text-sm text-gray-300">{loadingText}</span>
        <div className="mt-1 h-1.5 w-full rounded-full bg-gray-700">
            <div
                className={`h-1.5 rounded-full ${colors.progress} transition-all duration-300`}
                style={{ width: `${progress}%` }}
            />
        </div>
        <span className="text-xs text-gray-500">{progress}%</span>
    </>
);

/** 파일 선택됨 상태 Props */
interface SelectedFileStateProps {
    colors: AccentColors;
    fileName: string;
    fileSize: string;
}

/** 파일 선택됨 상태 UI */
const SelectedFileState = ({
    colors,
    fileName,
    fileSize,
}: SelectedFileStateProps) => (
    <>
        <FileText className={`h-8 w-8 ${colors.icon}`} />
        <span className="max-w-[180px] truncate text-sm text-gray-300">
            {fileName}
        </span>
        <span className="text-xs text-gray-500">{fileSize}</span>
    </>
);

/** 기본 프롬프트 상태 Props */
interface DefaultPromptStateProps {
    colors: AccentColors;
    isDragOver: boolean;
    dragPrompt: string;
    maxSizeText: string;
}

/** 기본 프롬프트 상태 UI */
const DefaultPromptState = ({
    colors,
    isDragOver,
    dragPrompt,
    maxSizeText,
}: DefaultPromptStateProps) => (
    <>
        <Upload
            className={`h-8 w-8 ${isDragOver ? colors.icon : 'text-gray-400'}`}
        />
        <span className="text-sm text-gray-300">{dragPrompt}</span>
        <span className="text-xs text-gray-500">{maxSizeText}</span>
    </>
);

// ============================================================================
// 메인 컴포넌트
// ============================================================================

function FileUploadBoxComponent({
    config,
    messages,
    onFileSelect,
    isLoading = false,
    progress = 0,
    progressStage,
    error,
    accentColor = 'green',
}: FileUploadBoxProps) {
    const [localError, setLocalError] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const colors = ACCENT_CLASSES[accentColor];

    const handleFile = useCallback(
        (file: File) => {
            setLocalError(null);

            // config 기반 유효성 검사
            const validation = validateFile(file, config);
            if (!validation.valid && validation.error) {
                setLocalError(validation.error.message);
                return;
            }

            // 크기 경고 (개발 환경에서만 로그)
            if (shouldShowSizeWarning(file, config.limits.warnSize)) {
                logWarn(
                    'FileUpload',
                    `Large file detected: ${formatFileSize(file.size)}`
                );
            }

            setSelectedFile(file);
            onFileSelect(file);
        },
        [config, onFileSelect]
    );

    const displayError = error?.message || localError;
    const loadingText = progressStage || messages.loadingText || '처리 중...';

    /** 상태별 콘텐츠 렌더링 */
    const renderContent = (isDragOver: boolean) => {
        if (isLoading) {
            return (
                <LoadingState
                    colors={colors}
                    loadingText={loadingText}
                    progress={progress}
                />
            );
        }

        if (selectedFile && !displayError) {
            return (
                <SelectedFileState
                    colors={colors}
                    fileName={selectedFile.name}
                    fileSize={formatFileSize(selectedFile.size)}
                />
            );
        }

        return (
            <DefaultPromptState
                colors={colors}
                isDragOver={isDragOver}
                dragPrompt={messages.dragPrompt}
                maxSizeText={messages.maxSizeText}
            />
        );
    };

    return (
        <div className="space-y-2">
            <DropZone
                onDrop={handleFile}
                accept={config.accept.extensions}
                disabled={isLoading}
                className={`relative cursor-pointer overflow-hidden rounded-lg border-2 border-dashed bg-gray-900/90 backdrop-blur-sm transition-all duration-200 ${isLoading ? 'cursor-not-allowed opacity-50' : ''} ${displayError ? 'border-red-500' : 'border-gray-600 hover:border-gray-500'} `}
            >
                {({ isDragOver }) => (
                    <div
                        className={`flex min-w-[200px] flex-col items-center gap-2 p-4 ${isDragOver ? `${colors.border} ${colors.bg}` : ''} `}
                    >
                        {renderContent(isDragOver)}
                    </div>
                )}
            </DropZone>

            {/* 에러 메시지 */}
            {displayError && (
                <div className="flex items-center gap-2 rounded border border-red-500 bg-red-900/80 p-2">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-400" />
                    <span className="text-xs text-red-300">{displayError}</span>
                </div>
            )}
        </div>
    );
}

export const FileUploadBox = memo(FileUploadBoxComponent);
