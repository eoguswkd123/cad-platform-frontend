/**
 * WorkerViewer - ModelSelector Component
 * 모델 선택 UI (버튼 + 로딩 상태 + 에러 표시)
 */

import { memo, useEffect } from 'react';

import { Box, Loader2, AlertCircle, Download } from 'lucide-react';

import type { ModelInfo, LoadingStatus, LoadError } from '../types';

interface ModelSelectorProps {
    /** 사용 가능한 모델 목록 */
    models: ModelInfo[];
    /** 로딩 상태 */
    status: LoadingStatus;
    /** 에러 정보 */
    error: LoadError | null;
    /** 모델이 로드되었는지 여부 */
    hasModel: boolean;
    /** 모델 목록 가져오기 */
    onFetchModels: () => void;
    /** 모델 선택 */
    onSelectModel: (id: string) => void;
    /** 샘플 모델 로드 */
    onLoadSample: () => void;
    /** 에러 초기화 */
    onClearError: () => void;
}

function ModelSelectorComponent({
    models,
    status,
    error,
    hasModel,
    onFetchModels,
    onSelectModel,
    onLoadSample,
    onClearError,
}: ModelSelectorProps) {
    // 컴포넌트 마운트 시 모델 목록 가져오기
    useEffect(() => {
        onFetchModels();
    }, [onFetchModels]);

    const isLoading = status === 'loading';

    // 모델이 로드된 경우 표시하지 않음
    if (hasModel) {
        return null;
    }

    return (
        <div className="absolute top-4 left-4 flex flex-col gap-3">
            {/* 샘플 모델 로드 버튼 */}
            <button
                onClick={onLoadSample}
                disabled={isLoading}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white shadow-lg transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                    <Download className="h-5 w-5" />
                )}
                <span>{isLoading ? '로딩 중...' : 'Load Sample Model'}</span>
            </button>

            {/* 모델 목록 드롭다운 */}
            {models.length > 0 && (
                <div className="rounded-lg bg-gray-800/90 p-3 shadow-lg backdrop-blur-sm">
                    <p className="mb-2 text-xs text-gray-400">
                        Available Models
                    </p>
                    <div className="flex flex-col gap-1">
                        {models.map((model) => (
                            <button
                                key={model.id}
                                onClick={() => onSelectModel(model.id)}
                                disabled={isLoading}
                                className="flex items-center gap-2 rounded px-3 py-1.5 text-left text-sm text-gray-200 transition-colors hover:bg-gray-700 disabled:opacity-50"
                            >
                                <Box className="h-4 w-4 text-blue-400" />
                                <span>{model.name}</span>
                                {model.format && (
                                    <span className="ml-auto text-xs text-gray-500">
                                        .{model.format}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* 에러 표시 */}
            {error && (
                <div className="flex items-start gap-2 rounded-lg bg-red-900/90 p-3 shadow-lg backdrop-blur-sm">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-400" />
                    <div className="flex-1">
                        <p className="text-sm text-red-200">{error.message}</p>
                        <button
                            onClick={onClearError}
                            className="mt-1 text-xs text-red-400 underline hover:text-red-300"
                        >
                            닫기
                        </button>
                    </div>
                </div>
            )}

            {/* 안내 메시지 */}
            {!isLoading && !error && models.length === 0 && (
                <div className="rounded-lg bg-gray-800/90 p-3 shadow-lg backdrop-blur-sm">
                    <p className="text-sm text-gray-400">
                        public/samples/ 폴더에 glb 파일을 추가하세요
                    </p>
                </div>
            )}
        </div>
    );
}

export const ModelSelector = memo(ModelSelectorComponent);
