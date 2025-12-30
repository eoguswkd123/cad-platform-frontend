/**
 * DimensionMesh - DIMENSION 렌더링 컴포넌트
 *
 * DXF DIMENSION 엔티티를 치수선 + 텍스트로 렌더링
 */

import { useMemo, useEffect, memo } from 'react';

import { Text } from '@react-three/drei';
import * as THREE from 'three';

import { DEFAULT_LAYER_COLOR } from '@/constants/cad';
import type { ParsedDimension } from '@/types/cad';

import type { CadMeshBaseProps, DimensionRenderData } from './types';

/**
 * DimensionMesh 컴포넌트
 * DIMENSION 엔티티를 치수선과 텍스트로 렌더링
 */
function DimensionMeshComponent({
    data,
    center = true,
    layers,
    dataCenter,
}: CadMeshBaseProps) {
    // DIMENSION 렌더링 데이터 생성
    const dimensionRenderData = useMemo((): DimensionRenderData[] => {
        if (!data.dimensions || data.dimensions.length === 0) {
            return [];
        }

        const results: DimensionRenderData[] = [];

        const processDimension = (
            dim: ParsedDimension,
            index: number,
            color: string,
            visible: boolean
        ) => {
            // 치수선 geometry 생성 (간단한 linear dimension 구현)
            const vertices: number[] = [];
            const p1 = dim.defPoint1;
            const p2 = dim.defPoint2;
            const textPos = dim.textMidPoint;

            // 치수선: defPoint1 → textMidPoint → defPoint2 방향
            vertices.push(
                p1.x - (center ? dataCenter.x : 0),
                p1.y - (center ? dataCenter.y : 0),
                p1.z - (center ? dataCenter.z : 0)
            );
            vertices.push(
                textPos.x - (center ? dataCenter.x : 0),
                textPos.y - (center ? dataCenter.y : 0),
                textPos.z - (center ? dataCenter.z : 0)
            );
            vertices.push(
                textPos.x - (center ? dataCenter.x : 0),
                textPos.y - (center ? dataCenter.y : 0),
                textPos.z - (center ? dataCenter.z : 0)
            );
            vertices.push(
                p2.x - (center ? dataCenter.x : 0),
                p2.y - (center ? dataCenter.y : 0),
                p2.z - (center ? dataCenter.z : 0)
            );

            const lineGeom = new THREE.BufferGeometry();
            lineGeom.setAttribute(
                'position',
                new THREE.Float32BufferAttribute(vertices, 3)
            );

            const lineMat = new THREE.LineBasicMaterial({
                color: new THREE.Color(color),
                linewidth: 1,
            });

            // 텍스트: 빈 문자열이면 거리 자동 계산
            let text = dim.text;
            if (!text || text.trim() === '') {
                const distance = Math.sqrt(
                    (p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2 + (p2.z - p1.z) ** 2
                );
                text = distance.toFixed(2);
            }

            // 텍스트 높이 추정 (치수선 길이의 일정 비율)
            const dimLength = Math.sqrt(
                (p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2
            );
            const fontSize = Math.max(dimLength * 0.05, 1);

            results.push({
                key: `dimension-${index}`,
                lineGeometry: lineGeom,
                lineMaterial: lineMat,
                text: {
                    key: `dimension-text-${index}`,
                    content: text,
                    position: [
                        textPos.x - (center ? dataCenter.x : 0),
                        textPos.y - (center ? dataCenter.y : 0),
                        textPos.z - (center ? dataCenter.z : 0),
                    ],
                    rotation: (dim.rotation * Math.PI) / 180,
                    fontSize,
                    color,
                    anchorX: 'center',
                    anchorY: 'bottom',
                    maxWidth: undefined,
                    visible,
                },
                visible,
            });
        };

        if (!layers || layers.size === 0) {
            data.dimensions.forEach((dim, idx) => {
                processDimension(dim, idx, DEFAULT_LAYER_COLOR, true);
            });
        } else {
            let globalIndex = 0;
            for (const [layerName, layerInfo] of layers) {
                const layerDims = data.dimensions.filter(
                    (d) => (d.layer ?? '0') === layerName
                );
                for (const dim of layerDims) {
                    processDimension(
                        dim,
                        globalIndex++,
                        layerInfo.color,
                        layerInfo.visible
                    );
                }
            }
        }

        return results;
    }, [data.dimensions, layers, center, dataCenter]);

    // Geometry 및 Material 정리
    useEffect(() => {
        return () => {
            for (const dim of dimensionRenderData) {
                dim.lineGeometry.dispose();
                dim.lineMaterial.dispose();
            }
        };
    }, [dimensionRenderData]);

    return (
        <>
            {dimensionRenderData.map(
                (dimData) =>
                    dimData.visible && (
                        <group key={dimData.key}>
                            <lineSegments
                                geometry={dimData.lineGeometry}
                                material={dimData.lineMaterial}
                            />
                            <Text
                                position={dimData.text.position}
                                rotation={[0, 0, dimData.text.rotation]}
                                fontSize={dimData.text.fontSize}
                                color={dimData.text.color}
                                anchorX={dimData.text.anchorX}
                                anchorY={dimData.text.anchorY}
                            >
                                {dimData.text.content}
                            </Text>
                        </group>
                    )
            )}
        </>
    );
}

export const DimensionMesh = memo(DimensionMeshComponent);
