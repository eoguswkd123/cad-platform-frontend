/**
 * Cad Viewer Page
 * DXF 파일 업로드 및 3D 와이어프레임 렌더링 페이지
 */

import { ViewerErrorBoundary } from '@/components/Common';
import { CadScene } from '@/features/CadViewer';

export default function CadViewerPage() {
    return (
        <div className="h-full w-full">
            <ViewerErrorBoundary
                viewerName="CAD"
                onError={(error) => {
                    console.error(
                        '[CadViewerPage] Canvas error:',
                        error.message
                    );
                }}
            >
                <CadScene />
            </ViewerErrorBoundary>
        </div>
    );
}
