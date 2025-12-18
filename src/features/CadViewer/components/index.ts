/**
 * Cad Viewer Components
 *
 * - **Entry**: CadScene - 전체 뷰어를 조율하는 메인 컨테이너
 * - **3D**: CadMesh - Canvas 내부 3D 렌더링
 * - **UI**: LayerPanel - Canvas 외부 HTML 오버레이
 * - **Shared**: FileUpload - @/components/Common/FileUpload에서 import
 * - **Shared**: ControlPanelViewer - @/components/ControlPanelViewer에서 import
 *
 * @see {@link ../FLOWCHART.md} - 컴포넌트 계층 및 실행 흐름도
 */

// Main Container
export { CadScene } from './CadScene';

// Error Boundary
export { CadErrorBoundary } from './CadErrorBoundary';

// Canvas-internal (3D Rendering)
export { CadMesh } from './CadMesh';

// HTML Overlays
export { LayerPanel } from './LayerPanel';
