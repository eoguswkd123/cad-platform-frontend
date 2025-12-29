/**
 * DropZone.test.tsx
 * 범용 드래그앤드롭 컴포넌트 테스트
 *
 * 주요 테스트:
 * - 기본 렌더링
 * - 드래그 오버 상태
 * - 파일 드롭 처리
 * - 파일 선택 (input)
 * - disabled 상태
 * - accept 필터링
 * - multiple 파일 처리
 * - render props 패턴
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { DropZone } from '../DropZone';

// 테스트용 파일 생성 유틸리티
function createFile(
    name: string,
    size = 1024,
    type = 'application/octet-stream'
) {
    const blob = new Blob(['x'.repeat(size)], { type });
    return new File([blob], name, { type });
}

// DataTransfer 목 생성
function createDataTransfer(files: File[]) {
    return {
        files: files,
        items: files.map((file) => ({
            kind: 'file',
            type: file.type,
            getAsFile: () => file,
        })),
        types: ['Files'],
    };
}

describe('DropZone', () => {
    describe('기본 렌더링', () => {
        it('children 렌더링 (ReactNode)', () => {
            render(
                <DropZone onDrop={vi.fn()}>
                    <div>드래그하세요</div>
                </DropZone>
            );
            expect(screen.getByText('드래그하세요')).toBeInTheDocument();
        });

        it('숨겨진 file input 렌더링', () => {
            const { container } = render(
                <DropZone onDrop={vi.fn()}>콘텐츠</DropZone>
            );
            const input = container.querySelector('input[type="file"]');
            expect(input).toBeInTheDocument();
            expect(input).toHaveClass('hidden');
        });

        it('className prop 전달', () => {
            const { container } = render(
                <DropZone onDrop={vi.fn()} className="custom-class">
                    콘텐츠
                </DropZone>
            );
            expect(container.firstChild).toHaveClass('custom-class');
        });
    });

    describe('render props 패턴', () => {
        it('isDragOver 상태 전달', () => {
            render(
                <DropZone onDrop={vi.fn()}>
                    {({ isDragOver }) => (
                        <div data-testid="content">
                            {isDragOver ? '드래그 중' : '대기 중'}
                        </div>
                    )}
                </DropZone>
            );
            expect(screen.getByTestId('content')).toHaveTextContent('대기 중');
        });

        it('openFilePicker 함수 전달', () => {
            const onDrop = vi.fn();
            render(
                <DropZone onDrop={onDrop}>
                    {({ openFilePicker }) => (
                        <button onClick={openFilePicker}>파일 선택</button>
                    )}
                </DropZone>
            );
            expect(
                screen.getByRole('button', { name: '파일 선택' })
            ).toBeInTheDocument();
        });
    });

    describe('드래그 오버 상태', () => {
        it('dragOver 시 isDragOver true', () => {
            const { container } = render(
                <DropZone onDrop={vi.fn()}>
                    {({ isDragOver }) => (
                        <div data-testid="content">
                            {isDragOver ? '드래그 중' : '대기 중'}
                        </div>
                    )}
                </DropZone>
            );

            const dropZone = container.firstChild as HTMLElement;

            fireEvent.dragOver(dropZone);
            expect(screen.getByTestId('content')).toHaveTextContent(
                '드래그 중'
            );
        });

        it('dragLeave 시 isDragOver false', () => {
            const { container } = render(
                <DropZone onDrop={vi.fn()}>
                    {({ isDragOver }) => (
                        <div data-testid="content">
                            {isDragOver ? '드래그 중' : '대기 중'}
                        </div>
                    )}
                </DropZone>
            );

            const dropZone = container.firstChild as HTMLElement;

            fireEvent.dragOver(dropZone);
            expect(screen.getByTestId('content')).toHaveTextContent(
                '드래그 중'
            );

            fireEvent.dragLeave(dropZone);
            expect(screen.getByTestId('content')).toHaveTextContent('대기 중');
        });
    });

    describe('파일 드롭 처리', () => {
        it('파일 드롭 시 onDrop 호출', () => {
            const onDrop = vi.fn();
            const { container } = render(
                <DropZone onDrop={onDrop}>콘텐츠</DropZone>
            );

            const dropZone = container.firstChild as HTMLElement;
            const file = createFile('test.glb');

            fireEvent.drop(dropZone, {
                dataTransfer: createDataTransfer([file]),
            });

            expect(onDrop).toHaveBeenCalledWith(file);
        });

        it('드롭 후 isDragOver false', () => {
            const { container } = render(
                <DropZone onDrop={vi.fn()}>
                    {({ isDragOver }) => (
                        <div data-testid="content">
                            {isDragOver ? '드래그 중' : '대기 중'}
                        </div>
                    )}
                </DropZone>
            );

            const dropZone = container.firstChild as HTMLElement;

            fireEvent.dragOver(dropZone);
            expect(screen.getByTestId('content')).toHaveTextContent(
                '드래그 중'
            );

            fireEvent.drop(dropZone, {
                dataTransfer: createDataTransfer([createFile('test.glb')]),
            });

            expect(screen.getByTestId('content')).toHaveTextContent('대기 중');
        });
    });

    describe('파일 선택 (input)', () => {
        it('파일 input 변경 시 onDrop 호출', () => {
            const onDrop = vi.fn();
            const { container } = render(
                <DropZone onDrop={onDrop}>콘텐츠</DropZone>
            );

            const input = container.querySelector(
                'input[type="file"]'
            ) as HTMLInputElement;
            const file = createFile('test.glb');

            Object.defineProperty(input, 'files', {
                value: [file],
            });

            fireEvent.change(input);
            expect(onDrop).toHaveBeenCalledWith(file);
        });

        it('컨테이너 클릭 시 파일 다이얼로그 열기', () => {
            const { container } = render(
                <DropZone onDrop={vi.fn()}>콘텐츠</DropZone>
            );

            const input = container.querySelector(
                'input[type="file"]'
            ) as HTMLInputElement;
            const clickSpy = vi.spyOn(input, 'click');

            const dropZone = container.firstChild as HTMLElement;
            fireEvent.click(dropZone);

            expect(clickSpy).toHaveBeenCalled();
        });
    });

    describe('disabled 상태', () => {
        it('disabled 시 dragOver 무시', () => {
            const { container } = render(
                <DropZone onDrop={vi.fn()} disabled>
                    {({ isDragOver }) => (
                        <div data-testid="content">
                            {isDragOver ? '드래그 중' : '대기 중'}
                        </div>
                    )}
                </DropZone>
            );

            const dropZone = container.firstChild as HTMLElement;
            fireEvent.dragOver(dropZone);

            expect(screen.getByTestId('content')).toHaveTextContent('대기 중');
        });

        it('disabled 시 드롭 무시', () => {
            const onDrop = vi.fn();
            const { container } = render(
                <DropZone onDrop={onDrop} disabled>
                    콘텐츠
                </DropZone>
            );

            const dropZone = container.firstChild as HTMLElement;
            fireEvent.drop(dropZone, {
                dataTransfer: createDataTransfer([createFile('test.glb')]),
            });

            expect(onDrop).not.toHaveBeenCalled();
        });

        it('disabled 시 클릭 무시', () => {
            const { container } = render(
                <DropZone onDrop={vi.fn()} disabled>
                    콘텐츠
                </DropZone>
            );

            const input = container.querySelector(
                'input[type="file"]'
            ) as HTMLInputElement;
            const clickSpy = vi.spyOn(input, 'click');

            const dropZone = container.firstChild as HTMLElement;
            fireEvent.click(dropZone);

            expect(clickSpy).not.toHaveBeenCalled();
        });

        it('input에 disabled 속성 전달', () => {
            const { container } = render(
                <DropZone onDrop={vi.fn()} disabled>
                    콘텐츠
                </DropZone>
            );

            const input = container.querySelector('input[type="file"]');
            expect(input).toHaveAttribute('disabled');
        });
    });

    describe('accept 필터링', () => {
        it('accept prop이 input에 전달됨', () => {
            const { container } = render(
                <DropZone onDrop={vi.fn()} accept={['.glb', '.gltf']}>
                    콘텐츠
                </DropZone>
            );

            const input = container.querySelector('input[type="file"]');
            expect(input).toHaveAttribute('accept', '.glb,.gltf');
        });
    });

    describe('multiple 파일 처리', () => {
        it('multiple prop이 input에 전달됨', () => {
            const { container } = render(
                <DropZone onDrop={vi.fn()} multiple>
                    콘텐츠
                </DropZone>
            );

            const input = container.querySelector('input[type="file"]');
            expect(input).toHaveAttribute('multiple');
        });

        it('multiple + onDropMultiple로 여러 파일 처리', () => {
            const onDrop = vi.fn();
            const onDropMultiple = vi.fn();
            const { container } = render(
                <DropZone
                    onDrop={onDrop}
                    onDropMultiple={onDropMultiple}
                    multiple
                >
                    콘텐츠
                </DropZone>
            );

            const dropZone = container.firstChild as HTMLElement;
            const files = [createFile('test1.glb'), createFile('test2.glb')];

            fireEvent.drop(dropZone, {
                dataTransfer: createDataTransfer(files),
            });

            expect(onDropMultiple).toHaveBeenCalledWith(files);
            expect(onDrop).not.toHaveBeenCalled();
        });

        it('단일 파일은 onDrop 호출', () => {
            const onDrop = vi.fn();
            const onDropMultiple = vi.fn();
            const { container } = render(
                <DropZone
                    onDrop={onDrop}
                    onDropMultiple={onDropMultiple}
                    multiple
                >
                    콘텐츠
                </DropZone>
            );

            const dropZone = container.firstChild as HTMLElement;
            const file = createFile('test.glb');

            fireEvent.drop(dropZone, {
                dataTransfer: createDataTransfer([file]),
            });

            expect(onDrop).toHaveBeenCalledWith(file);
            expect(onDropMultiple).not.toHaveBeenCalled();
        });
    });
});
