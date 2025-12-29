/**
 * FilePanelViewer - 통합 파일 패널 컴포넌트
 *
 * 파일 업로드(드래그앤드롭) + 서버 샘플 목록을 통합
 * CadViewer, WorkerViewer 등에서 공통으로 사용
 *
 * @example
 * <FilePanelViewer
 *   uploadConfig={DXF_UPLOAD_CONFIG}
 *   uploadMessages={DXF_UPLOAD_MESSAGES}
 *   onFileSelect={handleFileSelect}
 *   samples={dxfSamples}
 *   onSelectSample={handleSelectSample}
 *   hasData={!!cadData}
 *   accentColor="green"
 * />
 */

import { memo } from 'react';

import { FileUploadBox, SampleList, UrlInput } from '@/components/FilePanel';

import { FILE_PANEL_VIEWER_STYLES } from './constants';

import type { FilePanelViewerProps } from './types';

function FilePanelViewerComponent({
    uploadConfig,
    uploadMessages,
    onFileSelect,
    samples,
    samplesLoading = false,
    onSelectSample,
    isLoading = false,
    progress = 0,
    progressStage,
    error,
    hasData = false,
    accentColor = 'green',
    onUrlSubmit,
    urlPlaceholder,
}: FilePanelViewerProps) {
    // 데이터가 로드되면 전체 패널 숨김
    if (hasData) {
        return null;
    }

    return (
        <div className={FILE_PANEL_VIEWER_STYLES.container}>
            {/* 드래그앤드롭 업로드 영역 */}
            <FileUploadBox
                config={uploadConfig}
                messages={uploadMessages}
                onFileSelect={onFileSelect}
                isLoading={isLoading}
                progress={progress}
                {...(progressStage && { progressStage })}
                error={error ?? null}
                accentColor={accentColor}
            />

            {/* 서버 샘플 목록 */}
            <SampleList
                samples={samples}
                isLoading={samplesLoading}
                onSelectSample={onSelectSample}
                accentColor={accentColor}
            />

            {/* URL 입력 (onUrlSubmit이 있을 때만 표시) */}
            {onUrlSubmit && (
                <UrlInput
                    onUrlSubmit={onUrlSubmit}
                    isLoading={isLoading}
                    {...(urlPlaceholder && { placeholder: urlPlaceholder })}
                    accentColor={accentColor}
                />
            )}
        </div>
    );
}

export const FilePanelViewer = memo(FilePanelViewerComponent);
