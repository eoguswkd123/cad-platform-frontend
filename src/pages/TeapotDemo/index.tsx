/**
 * TeapotDemo Page
 * Three.js Teapot 와이어프레임 예제 페이지
 */

import { ViewerErrorBoundary } from '@/components/Common';
import { TeapotScene } from '@/features/TeapotDemo';

export default function TeapotDemoPage() {
    return (
        <div className="h-full w-full">
            <ViewerErrorBoundary
                viewerName="Teapot"
                onError={(error) => {
                    console.error(
                        '[TeapotDemoPage] Canvas error:',
                        error.message
                    );
                }}
            >
                <TeapotScene />
            </ViewerErrorBoundary>
        </div>
    );
}
