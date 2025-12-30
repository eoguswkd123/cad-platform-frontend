/**
 * CadMeshViewer - Types
 *
 * CadMeshViewer 컴포넌트 전용 타입 정의
 */

import type { CadRenderMode, LayerInfo, ParsedCADData } from '@/types/cad';

/**
 * CadMeshViewer Props (최상위 오케스트레이터)
 */
export interface CadMeshViewerProps {
    /** 파싱된 CAD 데이터 */
    data: ParsedCADData;
    /** 중심 정렬 여부 */
    center?: boolean;
    /** 레이어 정보 (가시성 및 색상용) */
    layers?: Map<string, LayerInfo>;
    /** 렌더링 모드 */
    renderMode?: CadRenderMode;
}
