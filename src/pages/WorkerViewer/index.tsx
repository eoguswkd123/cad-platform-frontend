/**
 * Worker Viewer Page
 * Phase 3B.2: glTF/glb 3D 모델 뷰어 페이지
 */

import { ViewerErrorBoundary } from '@/components/Common';
import { WorkerScene } from '@/features/WorkerViewer';

export default function WorkerViewerPage() {
    return (
        <div className="h-full w-full">
            <ViewerErrorBoundary
                viewerName="3D"
                onError={(error) => {
                    // 추후 에러 추적 서비스 연동 가능
                    console.error(
                        '[WorkerViewerPage] Canvas error:',
                        error.message
                    );
                }}
            >
                <WorkerScene />
            </ViewerErrorBoundary>
        </div>
    );
}
