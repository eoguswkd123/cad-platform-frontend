/**
 * ViewerErrorBoundary - Common Error Boundary for 3D Viewers
 * React Three Fiber Canvas 크래시 감지 및 복구 UI
 */

import { Component, Fragment, type ReactNode } from 'react';

import { AlertTriangle, RefreshCw } from 'lucide-react';

import { formatErrorForUser, logError } from '@/utils';

interface ViewerErrorBoundaryProps {
    children: ReactNode;
    /** 뷰어 이름 (타이틀/로그에 사용) - 기본값: "3D" */
    viewerName?: string;
    /** 에러 발생 시 콜백 */
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ViewerErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    /** 리마운트 강제를 위한 키 */
    retryKey: number;
}

/**
 * ViewerErrorBoundary
 * Canvas/WebGL 크래시 시 폴백 UI 제공
 */
export class ViewerErrorBoundary extends Component<
    ViewerErrorBoundaryProps,
    ViewerErrorBoundaryState
> {
    constructor(props: ViewerErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null, retryKey: 0 };
    }

    static getDerivedStateFromError(
        error: Error
    ): Partial<ViewerErrorBoundaryState> {
        return { hasError: true, error };
    }

    override componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        const viewerName = this.props.viewerName ?? '3D';

        // 개발 환경에서만 상세 로깅 (프로덕션에서는 민감 정보 보호)
        logError(`${viewerName}Viewer`, error, errorInfo);

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

    handleRefresh = (): void => {
        window.location.reload();
    };

    override render(): ReactNode {
        const viewerName = this.props.viewerName ?? '3D';

        if (this.state.hasError) {
            return (
                <div
                    role="alert"
                    className="flex h-full w-full items-center justify-center bg-gray-900"
                >
                    <div className="max-w-md rounded-lg bg-gray-800 p-6 text-center shadow-xl">
                        {/* Error Icon */}
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-900/50">
                            <AlertTriangle className="h-8 w-8 text-red-400" />
                        </div>

                        {/* Error Title */}
                        <h2 className="mb-2 text-xl font-semibold text-white">
                            {viewerName} 뷰어 오류
                        </h2>

                        {/* Error Message */}
                        <p className="mb-4 text-sm text-gray-400">
                            {viewerName} 렌더링 중 오류가 발생했습니다.
                            <br />
                            WebGL 또는 Canvas 초기화에 문제가 있을 수 있습니다.
                        </p>

                        {/* Error Details - 정제된 메시지만 표시 */}
                        {this.state.error && (
                            <div className="mb-4 rounded bg-gray-900 p-3 text-left">
                                <p className="text-xs text-gray-400">
                                    {formatErrorForUser(this.state.error)}
                                </p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={this.handleRetry}
                                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                            >
                                <RefreshCw className="h-4 w-4" />
                                다시 시도
                            </button>
                            <button
                                onClick={this.handleRefresh}
                                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-600"
                            >
                                페이지 새로고침
                            </button>
                        </div>

                        {/* Help Text */}
                        <p className="mt-4 text-xs text-gray-500">
                            문제가 지속되면 브라우저의 WebGL 지원 여부를
                            확인하세요.
                        </p>
                    </div>
                </div>
            );
        }

        // key 변경으로 자식 컴포넌트 강제 리마운트
        return (
            <Fragment key={this.state.retryKey}>{this.props.children}</Fragment>
        );
    }
}
