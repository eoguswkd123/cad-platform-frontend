/**
 * HatchMesh - HATCH 렌더링 컴포넌트
 *
 * HATCH 엔티티를 렌더링 모드에 따라 와이어프레임/솔리드/패턴으로 표시
 */

import { useMemo, useEffect, memo } from 'react';

import * as THREE from 'three';

import {
    DEFAULT_LAYER_COLOR,
    HATCH_CONFIG,
    getLODSegments,
} from '@/constants/cad';
import type { ParsedHatch } from '@/types/cad';
import {
    hatchBoundariesToWireframe,
    hatchesToSolidGeometries,
    createPatternTexture,
    filterHatchesByLayerName,
} from '@/utils/cad';

import type { HatchMeshProps, LayerMeshData, HatchMeshData } from './types';

/**
 * HatchMesh 컴포넌트
 * HATCH 엔티티를 와이어프레임/솔리드/패턴 모드로 렌더링
 */
function HatchMeshComponent({
    data,
    center = true,
    layers,
    dataCenter,
    renderMode,
}: HatchMeshProps) {
    const totalEntities = data.metadata.entityCount;
    const segments = getLODSegments(totalEntities);

    // HATCH 와이어프레임 경계 (wireframe 모드용)
    const hatchWireframeMeshes = useMemo((): LayerMeshData[] => {
        if (
            renderMode !== 'wireframe' ||
            !data.hatches ||
            data.hatches.length === 0
        ) {
            return [];
        }

        const meshes: LayerMeshData[] = [];

        if (!layers || layers.size === 0) {
            // 레이어 정보 없으면 단일 메시
            const geom = hatchBoundariesToWireframe(data.hatches, segments);
            if (center) {
                geom.translate(-dataCenter.x, -dataCenter.y, -dataCenter.z);
            }
            const mat = new THREE.LineBasicMaterial({
                color: new THREE.Color(DEFAULT_LAYER_COLOR),
                linewidth: 1,
            });
            meshes.push({
                layerName: 'hatch-default',
                geometry: geom,
                material: mat,
                visible: true,
            });
        } else {
            for (const [layerName, layerInfo] of layers) {
                const layerHatches = filterHatchesByLayerName(
                    data.hatches,
                    layerName
                );
                if (layerHatches.length === 0) continue;

                const geom = hatchBoundariesToWireframe(layerHatches, segments);
                if (center) {
                    geom.translate(-dataCenter.x, -dataCenter.y, -dataCenter.z);
                }
                const mat = new THREE.LineBasicMaterial({
                    color: new THREE.Color(layerInfo.color),
                    linewidth: 1,
                });
                meshes.push({
                    layerName: `hatch-${layerName}`,
                    geometry: geom,
                    material: mat,
                    visible: layerInfo.visible,
                });
            }
        }

        return meshes;
    }, [data.hatches, layers, center, dataCenter, renderMode, segments]);

    // HATCH 솔리드/패턴 메시 (solid/pattern 모드용)
    const hatchFillMeshes = useMemo((): HatchMeshData[] => {
        if (
            renderMode === 'wireframe' ||
            !data.hatches ||
            data.hatches.length === 0
        ) {
            return [];
        }

        const meshes: HatchMeshData[] = [];

        const processHatch = (
            hatch: ParsedHatch,
            index: number,
            layerColor: string,
            visible: boolean
        ) => {
            const hatchGeomData = hatchesToSolidGeometries([hatch], segments);
            if (hatchGeomData.length === 0) return;

            const geomData = hatchGeomData[0]!;

            // 중심 정렬
            if (center) {
                geomData.geometry.translate(-dataCenter.x, -dataCenter.y, 0);
            }

            let material: THREE.MeshBasicMaterial;

            if (renderMode === 'solid' || hatch.isSolid) {
                // 솔리드 채우기
                material = new THREE.MeshBasicMaterial({
                    color: new THREE.Color(layerColor),
                    transparent: true,
                    opacity: HATCH_CONFIG.solidOpacity,
                    side: THREE.DoubleSide,
                });
            } else {
                // 패턴 채우기
                const texture = createPatternTexture(hatch, layerColor);
                material = new THREE.MeshBasicMaterial({
                    map: texture,
                    transparent: true,
                    opacity: HATCH_CONFIG.solidOpacity,
                    side: THREE.DoubleSide,
                });
            }

            meshes.push({
                key: `hatch-fill-${index}`,
                geometry: geomData.geometry,
                material,
                zPosition: geomData.zPosition - (center ? dataCenter.z : 0),
                visible,
            });
        };

        if (!layers || layers.size === 0) {
            // 레이어 정보 없으면 전체 처리
            data.hatches.forEach((hatch, idx) => {
                processHatch(hatch, idx, DEFAULT_LAYER_COLOR, true);
            });
        } else {
            let globalIndex = 0;
            for (const [layerName, layerInfo] of layers) {
                const layerHatches = filterHatchesByLayerName(
                    data.hatches,
                    layerName
                );
                for (const hatch of layerHatches) {
                    processHatch(
                        hatch,
                        globalIndex++,
                        layerInfo.color,
                        layerInfo.visible
                    );
                }
            }
        }

        return meshes;
    }, [data.hatches, layers, center, dataCenter, renderMode, segments]);

    // Geometry 및 Material 정리
    useEffect(() => {
        return () => {
            for (const mesh of hatchWireframeMeshes) {
                mesh.geometry.dispose();
                mesh.material.dispose();
            }
            for (const mesh of hatchFillMeshes) {
                mesh.geometry.dispose();
                if (mesh.material.map) {
                    mesh.material.map.dispose();
                }
                mesh.material.dispose();
            }
        };
    }, [hatchWireframeMeshes, hatchFillMeshes]);

    return (
        <>
            {/* HATCH 와이어프레임 경계 (wireframe 모드) */}
            {hatchWireframeMeshes.map(
                (mesh) =>
                    mesh.visible && (
                        <lineSegments
                            key={mesh.layerName}
                            geometry={mesh.geometry}
                            material={mesh.material}
                        />
                    )
            )}

            {/* HATCH 솔리드/패턴 채우기 (solid/pattern 모드) */}
            {hatchFillMeshes.map(
                (mesh) =>
                    mesh.visible && (
                        <mesh
                            key={mesh.key}
                            geometry={mesh.geometry}
                            material={mesh.material}
                            position={[0, 0, mesh.zPosition]}
                        />
                    )
            )}
        </>
    );
}

export const HatchMesh = memo(HatchMeshComponent);
