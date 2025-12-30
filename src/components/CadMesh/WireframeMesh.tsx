/**
 * WireframeMesh - LINE/CIRCLE/ARC/POLYLINE 렌더링 컴포넌트
 *
 * 기본 와이어프레임 엔티티를 레이어별 색상으로 렌더링
 */

import { useMemo, useEffect, memo } from 'react';

import * as THREE from 'three';

import { DEFAULT_LAYER_COLOR } from '@/constants/cad';
import {
    cadDataToGeometry,
    filterDataByLayerName,
    getWireframeEntityCount,
} from '@/utils/cad';

import type { CadMeshBaseProps, LayerMeshData } from './types';

/**
 * WireframeMesh 컴포넌트
 * LINE, CIRCLE, ARC, POLYLINE 엔티티를 레이어별로 렌더링
 */
function WireframeMeshComponent({
    data,
    center = true,
    layers,
    dataCenter,
}: CadMeshBaseProps) {
    // 레이어별 메시 데이터 생성
    const layerMeshes = useMemo((): LayerMeshData[] => {
        if (!layers || layers.size === 0) {
            // 레이어 정보 없으면 단일 메시로 렌더링
            const geom = cadDataToGeometry(data);
            if (center) {
                geom.translate(-dataCenter.x, -dataCenter.y, -dataCenter.z);
            }
            const mat = new THREE.LineBasicMaterial({
                color: new THREE.Color(DEFAULT_LAYER_COLOR),
                linewidth: 1,
            });
            return [
                {
                    layerName: 'default',
                    geometry: geom,
                    material: mat,
                    visible: true,
                },
            ];
        }

        const meshes: LayerMeshData[] = [];

        for (const [layerName, layerInfo] of layers) {
            // 해당 레이어의 데이터만 필터링
            const layerData = filterDataByLayerName(data, layerName);

            // 엔티티가 없으면 스킵
            const entityCount = getWireframeEntityCount(layerData);
            if (entityCount === 0) continue;

            // geometry 생성
            const geom = cadDataToGeometry(layerData);

            // 중심 정렬 (전체 데이터 기준)
            if (center) {
                geom.translate(-dataCenter.x, -dataCenter.y, -dataCenter.z);
            }

            // 레이어 색상으로 material 생성
            const mat = new THREE.LineBasicMaterial({
                color: new THREE.Color(layerInfo.color),
                linewidth: 1,
            });

            meshes.push({
                layerName,
                geometry: geom,
                material: mat,
                visible: layerInfo.visible,
            });
        }

        return meshes;
    }, [data, layers, center, dataCenter]);

    // Geometry 및 Material 정리 (메모리 누수 방지)
    useEffect(() => {
        return () => {
            for (const mesh of layerMeshes) {
                mesh.geometry.dispose();
                mesh.material.dispose();
            }
        };
    }, [layerMeshes]);

    return (
        <>
            {layerMeshes.map(
                (mesh) =>
                    mesh.visible && (
                        <lineSegments
                            key={mesh.layerName}
                            geometry={mesh.geometry}
                            material={mesh.material}
                        />
                    )
            )}
        </>
    );
}

export const WireframeMesh = memo(WireframeMeshComponent);
