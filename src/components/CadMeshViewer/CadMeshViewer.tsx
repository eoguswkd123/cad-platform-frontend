/**
 * CadMeshViewer - CAD 데이터 렌더링 오케스트레이터
 *
 * 파싱된 CAD 데이터를 개별 메시 컴포넌트로 조합하여 렌더링
 *
 * @see {@link WireframeMesh} - LINE/CIRCLE/ARC/POLYLINE 렌더링
 * @see {@link HatchMesh} - HATCH 렌더링
 * @see {@link TextMesh} - TEXT/MTEXT 렌더링
 * @see {@link CurveMesh} - ELLIPSE/SPLINE 렌더링
 * @see {@link DimensionMesh} - DIMENSION 렌더링
 */

import { useMemo, memo } from 'react';

import {
    WireframeMesh,
    HatchMesh,
    TextMesh,
    CurveMesh,
    DimensionMesh,
} from '@/components/CadMesh';
import { calculateDataCenter } from '@/utils/cad';

import type { CadMeshViewerProps } from './types';

/**
 * CadMeshViewer 컴포넌트
 *
 * 모든 CAD 엔티티 타입을 개별 메시 컴포넌트로 렌더링
 */
function CadMeshViewerComponent({
    data,
    center = true,
    layers,
    renderMode = 'wireframe',
}: CadMeshViewerProps) {
    // 전체 데이터의 중심점 계산 (한 번만)
    const dataCenter = useMemo(() => {
        if (!center) {
            return { x: 0, y: 0, z: 0 } as ReturnType<
                typeof calculateDataCenter
            >;
        }
        return calculateDataCenter(data);
    }, [data, center]);

    // 공통 props
    const baseProps = {
        data,
        center,
        layers,
        dataCenter,
    };

    return (
        <group>
            {/* LINE, CIRCLE, ARC, POLYLINE */}
            <WireframeMesh {...baseProps} />

            {/* HATCH (wireframe/solid/pattern) */}
            <HatchMesh {...baseProps} renderMode={renderMode} />

            {/* ELLIPSE, SPLINE */}
            <CurveMesh {...baseProps} />

            {/* TEXT, MTEXT */}
            <TextMesh {...baseProps} />

            {/* DIMENSION */}
            <DimensionMesh {...baseProps} />
        </group>
    );
}

export const CadMeshViewer = memo(CadMeshViewerComponent);
