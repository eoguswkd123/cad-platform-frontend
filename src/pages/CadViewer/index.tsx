/**
 * Cad Viewer Page
 * DXF 파일 업로드 및 3D 와이어프레임 렌더링 페이지
 */

import { CadScene, CadErrorBoundary } from '@/features/CadViewer';

export default function CadViewerPage() {
    return (
        <div className="h-screen w-full">
            <CadErrorBoundary>
                <CadScene />
            </CadErrorBoundary>
        </div>
    );
}
