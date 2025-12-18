/**
 * Worker Viewer Page
 * Phase 3B.2: glTF/glb 3D 모델 뷰어 페이지
 */

import { WorkerScene, WorkerErrorBoundary } from '@/features/WorkerViewer';

export default function WorkerViewerPage() {
    return (
        <div className="h-screen w-full">
            <WorkerErrorBoundary
                onError={(error) => {
                    // 추후 에러 추적 서비스 연동 가능
                    console.error(
                        '[WorkerViewerPage] Canvas error:',
                        error.message
                    );
                }}
            >
                <WorkerScene />
            </WorkerErrorBoundary>
        </div>
    );
}
