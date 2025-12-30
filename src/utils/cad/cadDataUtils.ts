/**
 * CAD Data Utilities
 *
 * CAD 데이터 처리를 위한 유틸리티 함수
 * - 레이어 필터링
 * - 바운딩 박스 계산
 * - 텍스트 앵커 변환
 */

import * as THREE from 'three';

import type { ParsedCADData, ParsedHatch, MTextAttachment } from '@/types/cad';

/**
 * 특정 레이어의 데이터만 필터링
 *
 * @param data - 파싱된 CAD 데이터
 * @param layerName - 대상 레이어 이름
 * @returns 해당 레이어의 필터링된 CAD 데이터
 */
export function filterDataByLayerName(
    data: ParsedCADData,
    layerName: string
): ParsedCADData {
    const matchLayer = (entityLayer: string | undefined): boolean => {
        return (entityLayer ?? '0') === layerName;
    };

    return {
        ...data,
        lines: data.lines.filter((e) => matchLayer(e.layer)),
        circles: data.circles.filter((e) => matchLayer(e.layer)),
        arcs: data.arcs.filter((e) => matchLayer(e.layer)),
        polylines: data.polylines.filter((e) => matchLayer(e.layer)),
        hatches: data.hatches.filter((e) => matchLayer(e.layer)),
        texts: data.texts.filter((e) => matchLayer(e.layer)),
        mtexts: data.mtexts.filter((e) => matchLayer(e.layer)),
        ellipses: data.ellipses.filter((e) => matchLayer(e.layer)),
        splines: data.splines.filter((e) => matchLayer(e.layer)),
        dimensions: data.dimensions.filter((e) => matchLayer(e.layer)),
    };
}

/**
 * 특정 레이어의 HATCH만 필터링
 */
export function filterHatchesByLayerName(
    hatches: ParsedHatch[],
    layerName: string
): ParsedHatch[] {
    return hatches.filter((h) => (h.layer ?? '0') === layerName);
}

/**
 * 바운딩 박스 중심점 계산
 * 모든 엔티티 타입을 포함하여 정확한 중심점 계산
 *
 * @param data - 파싱된 CAD 데이터
 * @returns THREE.Vector3 중심점
 */
export function calculateDataCenter(data: ParsedCADData): THREE.Vector3 {
    let minX = Infinity,
        minY = Infinity,
        minZ = Infinity;
    let maxX = -Infinity,
        maxY = -Infinity,
        maxZ = -Infinity;

    const updateBounds = (x: number, y: number, z: number = 0) => {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        minZ = Math.min(minZ, z);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
        maxZ = Math.max(maxZ, z);
    };

    // Lines
    for (const line of data.lines) {
        updateBounds(line.start.x, line.start.y, line.start.z);
        updateBounds(line.end.x, line.end.y, line.end.z);
    }

    // Circles (center ± radius)
    for (const circle of data.circles) {
        updateBounds(
            circle.center.x - circle.radius,
            circle.center.y - circle.radius,
            circle.center.z
        );
        updateBounds(
            circle.center.x + circle.radius,
            circle.center.y + circle.radius,
            circle.center.z
        );
    }

    // Arcs (center ± radius)
    for (const arc of data.arcs) {
        updateBounds(
            arc.center.x - arc.radius,
            arc.center.y - arc.radius,
            arc.center.z
        );
        updateBounds(
            arc.center.x + arc.radius,
            arc.center.y + arc.radius,
            arc.center.z
        );
    }

    // Polylines (all vertices)
    for (const polyline of data.polylines) {
        for (const vertex of polyline.vertices) {
            updateBounds(vertex.x, vertex.y, vertex.z);
        }
    }

    // Ellipses (center ± major/minor radius)
    for (const ellipse of data.ellipses) {
        const majorRadius = Math.sqrt(
            ellipse.majorAxisEnd.x ** 2 +
                ellipse.majorAxisEnd.y ** 2 +
                ellipse.majorAxisEnd.z ** 2
        );
        const minorRadius = majorRadius * ellipse.minorAxisRatio;
        const maxRadius = Math.max(majorRadius, minorRadius);
        updateBounds(
            ellipse.center.x - maxRadius,
            ellipse.center.y - maxRadius,
            ellipse.center.z
        );
        updateBounds(
            ellipse.center.x + maxRadius,
            ellipse.center.y + maxRadius,
            ellipse.center.z
        );
    }

    // Splines (control points)
    for (const spline of data.splines) {
        for (const point of spline.controlPoints) {
            updateBounds(point.x, point.y, point.z);
        }
    }

    // Texts (position)
    for (const text of data.texts) {
        updateBounds(text.position.x, text.position.y, text.position.z);
    }

    // MTexts (position)
    for (const mtext of data.mtexts) {
        updateBounds(mtext.position.x, mtext.position.y, mtext.position.z);
    }

    // Dimensions (definition points)
    for (const dim of data.dimensions) {
        updateBounds(dim.defPoint1.x, dim.defPoint1.y, dim.defPoint1.z);
        updateBounds(dim.defPoint2.x, dim.defPoint2.y, dim.defPoint2.z);
        updateBounds(
            dim.textMidPoint.x,
            dim.textMidPoint.y,
            dim.textMidPoint.z
        );
    }

    if (minX === Infinity) {
        return new THREE.Vector3(0, 0, 0);
    }

    return new THREE.Vector3(
        (minX + maxX) / 2,
        (minY + maxY) / 2,
        (minZ + maxZ) / 2
    );
}

/**
 * MTextAttachment를 drei Text anchorX/anchorY로 변환
 */
export function getTextAnchors(attachment: MTextAttachment): {
    anchorX: 'left' | 'center' | 'right';
    anchorY: 'top' | 'middle' | 'bottom';
} {
    const parts = attachment.split('-');
    const vertical = parts[0] as 'top' | 'middle' | 'bottom';
    const horizontal = parts[1] as 'left' | 'center' | 'right';
    return {
        anchorX: horizontal,
        anchorY: vertical,
    };
}

/**
 * 레이어의 엔티티 개수 계산 (LINE, CIRCLE, ARC, POLYLINE)
 */
export function getWireframeEntityCount(data: ParsedCADData): number {
    return (
        data.lines.length +
        data.circles.length +
        data.arcs.length +
        data.polylines.length
    );
}
