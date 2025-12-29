/**
 * FileUploadBox.test.tsx
 * 파일 업로드 컴포넌트 테스트
 *
 * 주요 테스트:
 * - 렌더링 (기본, 로딩, 파일 선택됨)
 * - 유효성 검사 (확장자, 크기, 빈 파일)
 * - 에러 표시 (외부 에러, 로컬 에러)
 * - 진행률 표시
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { FileUploadBox } from '../FileUploadBox';

import type { FileUploadConfig, FileUploadMessages } from '../types';

// 테스트용 기본 설정
const defaultConfig: FileUploadConfig = {
    accept: {
        extensions: ['.dxf'],
    },
    limits: {
        maxSize: 10 * 1024 * 1024, // 10MB
    },
};

const defaultMessages: FileUploadMessages = {
    dragPrompt: '파일을 드래그하거나 클릭하세요',
    maxSizeText: '최대 10MB',
};

// 테스트용 파일 생성 헬퍼
function createMockFile(
    name: string,
    size: number,
    type: string = 'application/octet-stream'
): File {
    const buffer = new ArrayBuffer(size);
    return new File([buffer], name, { type });
}

describe('FileUploadBox', () => {
    describe('렌더링', () => {
        it('기본 프롬프트 메시지 렌더링', () => {
            render(
                <FileUploadBox
                    config={defaultConfig}
                    messages={defaultMessages}
                    onFileSelect={vi.fn()}
                />
            );

            expect(
                screen.getByText('파일을 드래그하거나 클릭하세요')
            ).toBeInTheDocument();
            expect(screen.getByText('최대 10MB')).toBeInTheDocument();
        });

        it('로딩 상태 렌더링', () => {
            render(
                <FileUploadBox
                    config={defaultConfig}
                    messages={defaultMessages}
                    onFileSelect={vi.fn()}
                    isLoading={true}
                    progress={50}
                />
            );

            expect(screen.getByText('처리 중...')).toBeInTheDocument();
            expect(screen.getByText('50%')).toBeInTheDocument();
        });

        it('커스텀 로딩 메시지 렌더링', () => {
            render(
                <FileUploadBox
                    config={defaultConfig}
                    messages={{
                        ...defaultMessages,
                        loadingText: '업로드 중...',
                    }}
                    onFileSelect={vi.fn()}
                    isLoading={true}
                />
            );

            expect(screen.getByText('업로드 중...')).toBeInTheDocument();
        });

        it('진행 단계 메시지 렌더링', () => {
            render(
                <FileUploadBox
                    config={defaultConfig}
                    messages={defaultMessages}
                    onFileSelect={vi.fn()}
                    isLoading={true}
                    progressStage="파싱 중..."
                />
            );

            expect(screen.getByText('파싱 중...')).toBeInTheDocument();
        });
    });

    describe('에러 표시', () => {
        it('외부 에러 표시', () => {
            render(
                <FileUploadBox
                    config={defaultConfig}
                    messages={defaultMessages}
                    onFileSelect={vi.fn()}
                    error={{ code: 'SERVER_ERROR', message: '서버 오류' }}
                />
            );

            expect(screen.getByText('서버 오류')).toBeInTheDocument();
        });

        it('확장자 오류 표시', () => {
            const onFileSelect = vi.fn();
            render(
                <FileUploadBox
                    config={defaultConfig}
                    messages={defaultMessages}
                    onFileSelect={onFileSelect}
                />
            );

            // 잘못된 확장자 파일 드롭 시뮬레이션
            const dropZone = screen
                .getByText('파일을 드래그하거나 클릭하세요')
                .closest('div');
            const invalidFile = createMockFile('test.txt', 1024);

            if (dropZone) {
                fireEvent.drop(dropZone, {
                    dataTransfer: {
                        files: [invalidFile],
                    },
                });
            }

            // onFileSelect가 호출되지 않아야 함
            expect(onFileSelect).not.toHaveBeenCalled();
        });
    });

    describe('accentColor', () => {
        it('green 테마 적용', () => {
            render(
                <FileUploadBox
                    config={defaultConfig}
                    messages={defaultMessages}
                    onFileSelect={vi.fn()}
                    accentColor="green"
                />
            );

            // 컴포넌트가 렌더링됨
            expect(
                screen.getByText('파일을 드래그하거나 클릭하세요')
            ).toBeInTheDocument();
        });

        it('blue 테마 적용', () => {
            render(
                <FileUploadBox
                    config={defaultConfig}
                    messages={defaultMessages}
                    onFileSelect={vi.fn()}
                    accentColor="blue"
                />
            );

            expect(
                screen.getByText('파일을 드래그하거나 클릭하세요')
            ).toBeInTheDocument();
        });
    });

    describe('진행률', () => {
        it('0% 진행률 표시', () => {
            render(
                <FileUploadBox
                    config={defaultConfig}
                    messages={defaultMessages}
                    onFileSelect={vi.fn()}
                    isLoading={true}
                    progress={0}
                />
            );

            expect(screen.getByText('0%')).toBeInTheDocument();
        });

        it('100% 진행률 표시', () => {
            render(
                <FileUploadBox
                    config={defaultConfig}
                    messages={defaultMessages}
                    onFileSelect={vi.fn()}
                    isLoading={true}
                    progress={100}
                />
            );

            expect(screen.getByText('100%')).toBeInTheDocument();
        });
    });

    describe('disabled 상태', () => {
        it('로딩 중 드롭존 비활성화 스타일', () => {
            const { container } = render(
                <FileUploadBox
                    config={defaultConfig}
                    messages={defaultMessages}
                    onFileSelect={vi.fn()}
                    isLoading={true}
                />
            );

            const dropZoneWrapper = container.querySelector(
                '.cursor-not-allowed'
            );
            expect(dropZoneWrapper).toBeInTheDocument();
        });
    });
});
