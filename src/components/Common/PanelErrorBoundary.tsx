/**
 * PanelErrorBoundary - 패널용 에러 바운더리
 *
 * 개별 패널(FilePanelViewer, ControlPanelViewer 등)의 에러를 독립적으로 처리
 * 전체 뷰어가 아닌 해당 패널만 에러 UI로 대체
 *
 * @see {@link ViewerErrorBoundary} - 3D 캔버스 전용 에러 바운더리
 */

import { Component, Fragment, type ReactNode } from 'react';

import { AlertCircle, RefreshCw } from 'lucide-react';

import { formatErrorForUser, logError } from '@/utils';

interface PanelErrorBoundaryProps {
    children: ReactNode;
    /** 패널 이름 (에러 메시지에 표시) */
    panelName?: string;
    /** 에러 발생 시 콜백 */
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface PanelErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    /** 리마운트 강제를 위한 키 */
    retryKey: number;
}

/**
 * PanelErrorBoundary
 *
 * 패널 컴포넌트의 에러를 감지하고 인라인 에러 UI 제공
 *
 * @example
 * ```tsx
 * <PanelErrorBoundary panelName="파일">
 *   <FilePanelViewer {...props} />
 * </PanelErrorBoundary>
 * ```
 */
export class PanelErrorBoundary extends Component<
    PanelErrorBoundaryProps,
    PanelErrorBoundaryState
> {
    constructor(props: PanelErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null, retryKey: 0 };
    }

    static getDerivedStateFromError(
        error: Error
    ): Partial<PanelErrorBoundaryState> {
        return { hasError: true, error };
    }

    override componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        const panelName = this.props.panelName ?? 'Panel';

        // 개발 환경에서만 상세 로깅 (프로덕션에서는 민감 정보 보호)
        logError(panelName, error, errorInfo);

        // 외부 콜백 호출
        this.props.onError?.(error, errorInfo);
    }

    handleRetry = (): void => {
        this.setState((prev) => ({
            hasError: false,
            error: null,
            retryKey: prev.retryKey + 1,
        }));
    };

    override render(): ReactNode {
        const panelName = this.props.panelName ?? '패널';

        if (this.state.hasError) {
            return (
                <div
                    role="alert"
                    className="rounded-lg bg-gray-800/90 p-4 shadow-lg backdrop-blur-sm"
                >
                    {/* 에러 헤더 */}
                    <div className="mb-3 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-900/50">
                            <AlertCircle className="h-4 w-4 text-red-400" />
                        </div>
                        <span className="text-sm font-medium text-red-400">
                            {panelName} 오류
                        </span>
                    </div>

                    {/* 에러 메시지 - 정제된 메시지만 표시 */}
                    {this.state.error && (
                        <p className="mb-3 line-clamp-2 text-xs text-gray-400">
                            {formatErrorForUser(this.state.error)}
                        </p>
                    )}

                    {/* 다시 시도 버튼 */}
                    <button
                        onClick={this.handleRetry}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-700 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-gray-600"
                    >
                        <RefreshCw className="h-3 w-3" />
                        다시 시도
                    </button>
                </div>
            );
        }

        // key 변경으로 자식 컴포넌트 강제 리마운트
        return (
            <Fragment key={this.state.retryKey}>{this.props.children}</Fragment>
        );
    }
}
