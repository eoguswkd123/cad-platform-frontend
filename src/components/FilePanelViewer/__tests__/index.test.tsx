/**
 * FilePanelViewer.test.tsx
 * 통합 파일 패널 컴포넌트 테스트
 *
 * 주요 테스트:
 * - 기본 렌더링 (hasData=false)
 * - hasData=true일 때 숨김
 * - FileUploadBox, SampleList, UrlInput 렌더링
 * - 이벤트 핸들러 전달
 * - 로딩/에러 상태 전달
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// 자식 컴포넌트 모킹
vi.mock('@/components/FilePanel', () => ({
    FileUploadBox: ({
        onFileSelect,
        isLoading,
        progress,
        error,
        accentColor,
    }: {
        onFileSelect: (file: File) => void;
        isLoading: boolean;
        progress: number;
        error: { message: string } | null;
        accentColor: string;
    }) => (
        <div data-testid="file-upload-box">
            <span data-testid="accent-color">{accentColor}</span>
            {isLoading && (
                <span data-testid="loading">Loading: {progress}%</span>
            )}
            {error && <span data-testid="error">{error.message}</span>}
            <button
                data-testid="upload-trigger"
                onClick={() => {
                    const file = new File(['test'], 'test.dxf', {
                        type: 'application/dxf',
                    });
                    onFileSelect(file);
                }}
            >
                Upload
            </button>
        </div>
    ),
    SampleList: ({
        samples,
        onSelectSample,
        isLoading,
        accentColor,
    }: {
        samples: Array<{ id: string; name: string; path: string }>;
        onSelectSample: (sample: {
            id: string;
            name: string;
            path: string;
        }) => void;
        isLoading: boolean;
        accentColor: string;
    }) => (
        <div data-testid="sample-list" data-accent={accentColor}>
            {isLoading && (
                <span data-testid="samples-loading">Loading samples...</span>
            )}
            {samples.map((sample) => (
                <button
                    key={sample.id}
                    data-testid={`sample-${sample.id}`}
                    onClick={() => onSelectSample(sample)}
                >
                    {sample.name}
                </button>
            ))}
        </div>
    ),
    UrlInput: ({
        onUrlSubmit,
        isLoading,
        placeholder,
        accentColor,
    }: {
        onUrlSubmit: (url: string) => void;
        isLoading: boolean;
        placeholder?: string;
        accentColor: string;
    }) => (
        <div data-testid="url-input" data-accent={accentColor}>
            <input
                data-testid="url-input-field"
                placeholder={placeholder}
                disabled={isLoading}
            />
            <button
                data-testid="url-submit"
                onClick={() => onUrlSubmit('https://test.com/file.dxf')}
            >
                Submit
            </button>
        </div>
    ),
}));

// 상수 모킹
vi.mock('../constants', () => ({
    FILE_PANEL_VIEWER_STYLES: {
        container: 'absolute left-4 top-4 w-72 space-y-3',
    },
}));

import { FilePanelViewer } from '../index';

const defaultProps = {
    uploadConfig: {
        accept: {
            extensions: ['.dxf'] as const,
            mimeTypes: ['application/dxf'] as const,
        },
        limits: {
            maxSize: 10 * 1024 * 1024,
        },
    },
    uploadMessages: {
        dragPrompt: '파일을 드래그하세요',
        maxSizeText: '최대 10MB',
        loadingText: '업로드 중...',
    },
    onFileSelect: vi.fn(),
    samples: [
        { id: '1', name: '샘플 1', path: '/samples/sample1.dxf' },
        { id: '2', name: '샘플 2', path: '/samples/sample2.dxf' },
    ],
    onSelectSample: vi.fn(),
    isLoading: false,
    error: null,
    hasData: false,
    accentColor: 'green' as const,
};

describe('FilePanelViewer', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('기본 렌더링', () => {
        it('hasData=false일 때 렌더링된다', () => {
            render(<FilePanelViewer {...defaultProps} />);

            expect(screen.getByTestId('file-upload-box')).toBeInTheDocument();
        });

        it('hasData=true일 때 렌더링되지 않는다', () => {
            render(<FilePanelViewer {...defaultProps} hasData={true} />);

            expect(
                screen.queryByTestId('file-upload-box')
            ).not.toBeInTheDocument();
        });
    });

    describe('자식 컴포넌트 렌더링', () => {
        it('FileUploadBox를 렌더링한다', () => {
            render(<FilePanelViewer {...defaultProps} />);

            expect(screen.getByTestId('file-upload-box')).toBeInTheDocument();
        });

        it('SampleList를 렌더링한다', () => {
            render(<FilePanelViewer {...defaultProps} />);

            expect(screen.getByTestId('sample-list')).toBeInTheDocument();
        });

        it('onUrlSubmit이 있으면 UrlInput을 렌더링한다', () => {
            render(
                <FilePanelViewer
                    {...defaultProps}
                    onUrlSubmit={vi.fn()}
                    urlPlaceholder="https://example.com/file.dxf"
                />
            );

            expect(screen.getByTestId('url-input')).toBeInTheDocument();
        });

        it('onUrlSubmit이 없으면 UrlInput을 렌더링하지 않는다', () => {
            // defaultProps에는 onUrlSubmit이 없으므로 그대로 렌더링
            render(<FilePanelViewer {...defaultProps} />);

            expect(screen.queryByTestId('url-input')).not.toBeInTheDocument();
        });
    });

    describe('샘플 목록', () => {
        it('샘플 목록을 표시한다', () => {
            render(<FilePanelViewer {...defaultProps} />);

            expect(screen.getByTestId('sample-1')).toBeInTheDocument();
            expect(screen.getByTestId('sample-2')).toBeInTheDocument();
            expect(screen.getByText('샘플 1')).toBeInTheDocument();
            expect(screen.getByText('샘플 2')).toBeInTheDocument();
        });

        it('샘플 클릭 시 onSelectSample이 호출된다', () => {
            const onSelectSample = vi.fn();
            render(
                <FilePanelViewer
                    {...defaultProps}
                    onSelectSample={onSelectSample}
                />
            );

            fireEvent.click(screen.getByTestId('sample-1'));

            expect(onSelectSample).toHaveBeenCalledTimes(1);
            expect(onSelectSample).toHaveBeenCalledWith(
                defaultProps.samples[0]
            );
        });

        it('samplesLoading=true일 때 로딩 상태를 표시한다', () => {
            render(<FilePanelViewer {...defaultProps} samplesLoading={true} />);

            expect(screen.getByTestId('samples-loading')).toBeInTheDocument();
        });
    });

    describe('파일 업로드', () => {
        it('파일 선택 시 onFileSelect가 호출된다', () => {
            const onFileSelect = vi.fn();
            render(
                <FilePanelViewer
                    {...defaultProps}
                    onFileSelect={onFileSelect}
                />
            );

            fireEvent.click(screen.getByTestId('upload-trigger'));

            expect(onFileSelect).toHaveBeenCalledTimes(1);
        });
    });

    describe('URL 제출', () => {
        it('URL 제출 시 onUrlSubmit이 호출된다', () => {
            const onUrlSubmit = vi.fn();
            render(
                <FilePanelViewer
                    {...defaultProps}
                    onUrlSubmit={onUrlSubmit}
                    urlPlaceholder="https://example.com/file.dxf"
                />
            );

            fireEvent.click(screen.getByTestId('url-submit'));

            expect(onUrlSubmit).toHaveBeenCalledTimes(1);
            expect(onUrlSubmit).toHaveBeenCalledWith(
                'https://test.com/file.dxf'
            );
        });

        it('urlPlaceholder가 전달된다', () => {
            render(
                <FilePanelViewer
                    {...defaultProps}
                    onUrlSubmit={vi.fn()}
                    urlPlaceholder="https://custom-placeholder.com"
                />
            );

            expect(screen.getByTestId('url-input-field')).toHaveAttribute(
                'placeholder',
                'https://custom-placeholder.com'
            );
        });
    });

    describe('로딩 상태', () => {
        it('isLoading=true일 때 로딩 상태를 표시한다', () => {
            render(
                <FilePanelViewer
                    {...defaultProps}
                    isLoading={true}
                    progress={50}
                />
            );

            expect(screen.getByTestId('loading')).toBeInTheDocument();
            expect(screen.getByText('Loading: 50%')).toBeInTheDocument();
        });
    });

    describe('에러 상태', () => {
        it('에러가 있을 때 에러 메시지를 표시한다', () => {
            const error = { code: 'PARSE_ERROR', message: '파일 파싱 실패' };
            render(<FilePanelViewer {...defaultProps} error={error} />);

            expect(screen.getByTestId('error')).toBeInTheDocument();
            expect(screen.getByText('파일 파싱 실패')).toBeInTheDocument();
        });
    });

    describe('accentColor', () => {
        it('accentColor가 자식 컴포넌트에 전달된다', () => {
            render(<FilePanelViewer {...defaultProps} accentColor="blue" />);

            expect(screen.getByTestId('accent-color')).toHaveTextContent(
                'blue'
            );
        });
    });
});
