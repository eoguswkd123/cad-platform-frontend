/**
 * UrlInput - URL 입력 컴포넌트
 *
 * 외부 URL로 모델 로드 기능 제공
 * 텍스트 입력 + 로드 버튼 구성
 * URL 유효성 검사는 useUrlInput 훅에서 처리
 */

import { memo } from 'react';

import { Link, Loader2, AlertCircle } from 'lucide-react';

import { ACCENT_CLASSES } from '@/components/Common/constants';
import { useUrlInput } from '@/hooks';
import { MESSAGES } from '@/locales';

import { URL_INPUT_STYLES } from './constants';

import type { UrlInputProps } from './types';

function UrlInputComponent({
    onUrlSubmit,
    isLoading = false,
    placeholder = 'https://example.com/model.glb',
    accentColor = 'green',
    validationConfig,
}: UrlInputProps) {
    const { url, error, canSubmit, handleChange, handleSubmit, handleKeyDown } =
        useUrlInput({
            onSubmit: onUrlSubmit,
            validationConfig,
            isLoading,
        });

    const colors = ACCENT_CLASSES[accentColor];

    const buttonColorClass =
        accentColor === 'blue'
            ? 'bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800'
            : 'bg-green-600 hover:bg-green-500 disabled:bg-green-800';

    return (
        <div className={URL_INPUT_STYLES.container}>
            {/* 헤더 */}
            <div className={URL_INPUT_STYLES.header}>
                <Link
                    className={`${URL_INPUT_STYLES.headerIcon} ${colors.icon}`}
                />
                <span className={URL_INPUT_STYLES.headerText}>
                    {MESSAGES.filePanel.urlHeader}
                </span>
            </div>

            {/* 입력 영역 */}
            <div className={URL_INPUT_STYLES.inputWrapper}>
                <input
                    type="url"
                    value={url}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className={`${URL_INPUT_STYLES.input} ${error ? 'ring-1 ring-red-500' : ''}`}
                    disabled={isLoading}
                    aria-invalid={!!error}
                    aria-describedby={error ? 'url-error' : undefined}
                />
                <button
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    className={`${URL_INPUT_STYLES.button} ${buttonColorClass}`}
                >
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        MESSAGES.filePanel.loadButton
                    )}
                </button>
            </div>

            {/* 에러 메시지 */}
            {error && (
                <div
                    id="url-error"
                    className="mt-2 flex items-center gap-1.5 text-xs text-red-400"
                    role="alert"
                >
                    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
}

export const UrlInput = memo(UrlInputComponent);
