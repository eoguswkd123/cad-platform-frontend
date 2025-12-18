/**
 * WorkerViewer - Error Boundary
 * React Three Fiber Canvas 크래시 감지 및 복구 UI
 */

import { Component, type ReactNode } from 'react';

import { AlertTriangle, RefreshCw } from 'lucide-react';

interface WorkerErrorBoundaryProps {
    children: ReactNode;
    /** 에러 발생 시 콜백 */
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface WorkerErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

/**
 * WorkerViewer Error Boundary
 * Canvas/WebGL 크래시 시 폴백 UI 제공
 */
export class WorkerErrorBoundary extends Component<
    WorkerErrorBoundaryProps,
    WorkerErrorBoundaryState
> {
    constructor(props: WorkerErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): WorkerErrorBoundaryState {
        return { hasError: true, error };
    }

    override componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        // 에러 로깅
        console.error('[WorkerViewer] Error caught by boundary:', error);
        console.error(
            '[WorkerViewer] Component stack:',
            errorInfo.componentStack
        );

        // 외부 콜백 호출
        this.props.onError?.(error, errorInfo);
    }

    handleRetry = (): void => {
        this.setState({ hasError: false, error: null });
    };

    handleRefresh = (): void => {
        window.location.reload();
    };

    override render(): ReactNode {
        if (this.state.hasError) {
            return (
                <div className="flex h-full w-full items-center justify-center bg-gray-900">
                    <div className="max-w-md rounded-lg bg-gray-800 p-6 text-center shadow-xl">
                        {/* Error Icon */}
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-900/50">
                            <AlertTriangle className="h-8 w-8 text-red-400" />
                        </div>

                        {/* Error Title */}
                        <h2 className="mb-2 text-xl font-semibold text-white">
                            3D 뷰어 오류
                        </h2>

                        {/* Error Message */}
                        <p className="mb-4 text-sm text-gray-400">
                            3D 렌더링 중 오류가 발생했습니다.
                            <br />
                            WebGL 또는 Canvas 초기화에 문제가 있을 수 있습니다.
                        </p>

                        {/* Error Details (if available) */}
                        {this.state.error && (
                            <div className="mb-4 rounded bg-gray-900 p-3 text-left">
                                <p className="font-mono text-xs text-red-400">
                                    {this.state.error.message}
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

        return this.props.children;
    }
}
