/**
 * FileUpload - Generic File Upload Component
 *
 * 드래그 앤 드롭 및 파일 선택 UI
 * Feature에서 config와 messages props로 파일 타입 설정 주입
 *
 * @example
 * // CadViewer에서 DXF 파일용
 * <FileUpload
 *   config={DXF_UPLOAD_CONFIG}
 *   messages={DXF_UPLOAD_MESSAGES}
 *   onFileSelect={handleFileSelect}
 *   accentColor="green"
 * />
 *
 * @example
 * // WorkerViewer에서 GLTF 파일용
 * <FileUpload
 *   config={GLTF_UPLOAD_CONFIG}
 *   messages={GLTF_UPLOAD_MESSAGES}
 *   onFileSelect={handleModelSelect}
 *   accentColor="blue"
 * />
 */

import { memo, useCallback, useRef, useState, useEffect } from 'react';

import { Upload, FileText, AlertCircle, Loader2 } from 'lucide-react';

import { ACCENT_COLOR_CLASSES } from './constants';
import { validateFile, formatFileSize, shouldShowSizeWarning } from './utils';

import type { FileUploadProps } from './types';

function FileUploadComponent({
    config,
    messages,
    onFileSelect,
    onLoadSample,
    isLoading = false,
    progress = 0,
    progressStage,
    error,
    disabled = false,
    hasData = false,
    accentColor = 'green',
}: FileUploadProps) {
    // 모든 hooks는 반드시 컴포넌트 최상단에서 호출 (React Rules of Hooks)
    const [isDragOver, setIsDragOver] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const colors = ACCENT_COLOR_CLASSES[accentColor];

    // 외부에서 데이터가 초기화되면 내부 상태도 초기화
    useEffect(() => {
        if (!hasData) {
            setSelectedFile(null);
            setLocalError(null);
        }
    }, [hasData]);

    const handleFile = useCallback(
        (file: File) => {
            setLocalError(null);

            // config 기반 유효성 검사
            const validation = validateFile(file, config);
            if (!validation.valid && validation.error) {
                setLocalError(validation.error.message);
                return;
            }

            // 크기 경고 (로그만)
            if (shouldShowSizeWarning(file, config.limits.warnSize)) {
                console.warn(
                    `Large file detected: ${formatFileSize(file.size)}`
                );
            }

            setSelectedFile(file);
            onFileSelect(file);
        },
        [config, onFileSelect]
    );

    const handleDragOver = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            if (!disabled && !isLoading) {
                setIsDragOver(true);
            }
        },
        [disabled, isLoading]
    );

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragOver(false);

            if (disabled || isLoading) return;

            const files = e.dataTransfer.files;
            const file = files[0];
            if (file) {
                handleFile(file);
            }
        },
        [disabled, isLoading, handleFile]
    );

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files;
            const file = files?.[0];
            if (file) {
                handleFile(file);
            }
            // input 초기화 (같은 파일 재선택 가능)
            if (inputRef.current) {
                inputRef.current.value = '';
            }
        },
        [handleFile]
    );

    const handleClick = useCallback(() => {
        if (!disabled && !isLoading && inputRef.current) {
            inputRef.current.click();
        }
    }, [disabled, isLoading]);

    // 데이터가 로드된 경우 표시하지 않음 (early return은 hooks 이후에)
    if (hasData) {
        return null;
    }

    const displayError = error?.message || localError;
    const loadingText = progressStage || messages.loadingText || '처리 중...';

    // accept 속성 생성
    const acceptValue = config.accept.extensions.join(',');

    return (
        <div className="absolute top-4 left-4 z-10">
            <div className="flex gap-2">
                {/* 파일 업로드 박스 */}
                <div
                    className={`relative cursor-pointer overflow-hidden rounded-lg border-2 border-dashed bg-gray-900/90 backdrop-blur-sm transition-all duration-200 ${isDragOver ? `${colors.border} ${colors.bg}` : 'border-gray-600 hover:border-gray-500'} ${disabled || isLoading ? 'cursor-not-allowed opacity-50' : ''} ${displayError ? 'border-red-500' : ''} `}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={handleClick}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        accept={acceptValue}
                        onChange={handleInputChange}
                        className="hidden"
                        disabled={disabled || isLoading}
                    />

                    <div className="flex min-w-[200px] flex-col items-center gap-2 p-4">
                        {isLoading ? (
                            <>
                                <Loader2
                                    className={`h-8 w-8 animate-spin ${colors.icon}`}
                                />
                                <span className="text-sm text-gray-300">
                                    {loadingText}
                                </span>
                                {/* 진행률 바 */}
                                <div className="mt-1 h-1.5 w-full rounded-full bg-gray-700">
                                    <div
                                        className={`h-1.5 rounded-full ${colors.progress} transition-all duration-300`}
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <span className="text-xs text-gray-500">
                                    {progress}%
                                </span>
                            </>
                        ) : selectedFile && !displayError ? (
                            <>
                                <FileText
                                    className={`h-8 w-8 ${colors.icon}`}
                                />
                                <span className="max-w-[180px] truncate text-sm text-gray-300">
                                    {selectedFile.name}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {formatFileSize(selectedFile.size)}
                                </span>
                            </>
                        ) : (
                            <>
                                <Upload
                                    className={`h-8 w-8 ${isDragOver ? colors.icon : 'text-gray-400'}`}
                                />
                                <span className="text-sm text-gray-300">
                                    {messages.dragPrompt}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {messages.maxSizeText}
                                </span>
                            </>
                        )}
                    </div>
                </div>

                {/* 샘플 불러오기 버튼 */}
                {onLoadSample && messages.sampleLabel && (
                    <button
                        onClick={onLoadSample}
                        disabled={disabled || isLoading}
                        className={`flex min-w-[120px] cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed bg-gray-900/90 p-4 backdrop-blur-sm transition-all duration-200 ${disabled || isLoading ? 'cursor-not-allowed border-gray-600 opacity-50' : `border-gray-600 hover:${colors.border}`} `}
                    >
                        <FileText className={`h-8 w-8 ${colors.icon}`} />
                        <span className="text-sm whitespace-nowrap text-gray-300">
                            {messages.sampleLabel}
                        </span>
                    </button>
                )}
            </div>

            {/* 에러 메시지 */}
            {displayError && (
                <div className="mt-2 flex items-center gap-2 rounded border border-red-500 bg-red-900/80 p-2">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-400" />
                    <span className="text-xs text-red-300">{displayError}</span>
                </div>
            )}
        </div>
    );
}

export const FileUpload = memo(FileUploadComponent);
