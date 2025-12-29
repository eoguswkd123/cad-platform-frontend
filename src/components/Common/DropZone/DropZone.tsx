/**
 * DropZone - 범용 드래그앤드롭 컴포넌트
 *
 * 순수 드래그앤드롭 로직만 처리하는 원시 컴포넌트
 * Render Props 패턴으로 UI는 사용처에서 정의
 *
 * @example
 * <DropZone onDrop={handleFile} accept={['.glb']}>
 *     {({ isDragOver }) => (
 *         <div className={isDragOver ? 'active' : 'normal'}>
 *             드래그하여 파일 업로드
 *         </div>
 *     )}
 * </DropZone>
 */

import { memo, useState, useCallback, useRef } from 'react';

import { isRenderPropChildren } from './types';

import type { DropZoneProps, DropZoneRenderProps } from './types';

function DropZoneComponent({
    onDrop,
    onDropMultiple,
    accept,
    multiple = false,
    disabled = false,
    children,
    className,
}: DropZoneProps) {
    const [isDragOver, setIsDragOver] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            if (!disabled) {
                setIsDragOver(true);
            }
        },
        [disabled]
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

            if (disabled) return;

            const fileList = Array.from(e.dataTransfer.files);

            if (multiple && onDropMultiple && fileList.length > 1) {
                onDropMultiple(fileList);
            } else if (fileList[0]) {
                onDrop(fileList[0]);
            }
        },
        [disabled, multiple, onDrop, onDropMultiple]
    );

    const openFilePicker = useCallback(() => {
        if (!disabled && inputRef.current) {
            inputRef.current.click();
        }
    }, [disabled]);

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const fileList = e.target.files ? Array.from(e.target.files) : [];

            if (multiple && onDropMultiple && fileList.length > 1) {
                onDropMultiple(fileList);
            } else if (fileList[0]) {
                onDrop(fileList[0]);
            }

            // input 초기화 (같은 파일 재선택 가능)
            if (inputRef.current) {
                inputRef.current.value = '';
            }
        },
        [multiple, onDrop, onDropMultiple]
    );

    const renderProps: DropZoneRenderProps = {
        isDragOver,
        openFilePicker,
    };

    // accept 속성 생성
    const acceptValue = accept?.join(',');

    return (
        <div
            className={className}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={openFilePicker}
        >
            <input
                ref={inputRef}
                type="file"
                accept={acceptValue}
                multiple={multiple}
                onChange={handleChange}
                className="hidden"
                disabled={disabled}
            />
            {isRenderPropChildren(children) ? children(renderProps) : children}
        </div>
    );
}

export const DropZone = memo(DropZoneComponent);
