/**
 * SampleList - 서버 샘플 파일 목록 컴포넌트
 *
 * Available Samples 영역에 샘플 파일 목록을 표시
 * 파일 클릭 시 onSelectSample 콜백 호출
 */

import { memo } from 'react';

import { FileText, FolderOpen, Loader2 } from 'lucide-react';

import { ACCENT_CLASSES } from '@/components/Common/constants';

import { SAMPLE_LIST_STYLES } from './constants';

import type { SampleListProps } from './types';

function SampleListComponent({
    samples,
    isLoading = false,
    onSelectSample,
    accentColor = 'green',
}: SampleListProps) {
    const colors = ACCENT_CLASSES[accentColor];

    // 샘플 없고 로딩도 아니면 숨김
    if (samples.length === 0 && !isLoading) {
        return null;
    }

    return (
        <div className={SAMPLE_LIST_STYLES.container}>
            {/* 헤더 */}
            <div className={SAMPLE_LIST_STYLES.header}>
                <FolderOpen
                    className={`${SAMPLE_LIST_STYLES.headerIcon} ${colors.icon}`}
                />
                <span className={SAMPLE_LIST_STYLES.headerText}>
                    Available Samples
                </span>
            </div>

            {/* 로딩 상태 */}
            {isLoading ? (
                <div className={SAMPLE_LIST_STYLES.loading}>
                    <Loader2
                        className={`${SAMPLE_LIST_STYLES.loadingIcon} ${colors.icon}`}
                    />
                </div>
            ) : (
                /* 샘플 목록 */
                <div className={SAMPLE_LIST_STYLES.list}>
                    {samples.map((sample) => (
                        <button
                            key={sample.id}
                            onClick={() => onSelectSample(sample)}
                            className={SAMPLE_LIST_STYLES.item}
                        >
                            <FileText
                                className={`${SAMPLE_LIST_STYLES.itemIcon} ${colors.icon}`}
                            />
                            <span className={SAMPLE_LIST_STYLES.itemName}>
                                {sample.name}
                            </span>
                            {sample.format && (
                                <span className={SAMPLE_LIST_STYLES.itemFormat}>
                                    .{sample.format}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export const SampleList = memo(SampleListComponent);
