/**
 * Cad Mesh - 3D Rendering Component (Canvas-internal)
 *
 * 파싱된 CAD 데이터를 Three.js LineSegments로 렌더링 (레이어별 색상 지원)
 *
 * @see {@link CadScene} - 부모 컨테이너
 */

import { useMemo, useEffect, memo } from 'react';

import * as THREE from 'three';

import {
    DEFAULT_LAYER_COLOR,
    HATCH_CONFIG,
    getLODSegments,
} from '../constants';
import {
    cadDataToGeometry,
    hatchBoundariesToWireframe,
    hatchesToSolidGeometries,
    createPatternTexture,
    clearPatternTextureCache,
} from '../utils/dxfToGeometry';

import type {
    ParsedCADData,
    LayerInfo,
    CadRenderMode,
    ParsedHatch,
} from '../types';

interface CadMeshProps {
    /** 파싱된 CAD 데이터 */
    data: ParsedCADData;
    /** 중심 정렬 여부 */
    center?: boolean;
    /** 레이어 정보 (가시성 및 색상용) */
    layers?: Map<string, LayerInfo>;
    /** 렌더링 모드 */
    renderMode?: CadRenderMode;
}

/**
 * 특정 레이어의 데이터만 필터링
 *
 * @param data - 파싱된 CAD 데이터
 * @param layerName - 대상 레이어 이름
 * @returns 해당 레이어의 필터링된 CAD 데이터
 */
function filterDataByLayerName(
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
    };
}

/**
 * 특정 레이어의 HATCH만 필터링
 */
function filterHatchesByLayerName(
    hatches: ParsedHatch[],
    layerName: string
): ParsedHatch[] {
    return hatches.filter((h) => (h.layer ?? '0') === layerName);
}

/**
 * 바운딩 박스 중심점 계산
 *
 * @param data - 파싱된 CAD 데이터
 * @returns THREE.Vector3 중심점
 */
function calculateDataCenter(data: ParsedCADData): THREE.Vector3 {
    let minX = Infinity,
        minY = Infinity,
        minZ = Infinity;
    let maxX = -Infinity,
        maxY = -Infinity,
        maxZ = -Infinity;

    for (const line of data.lines) {
        minX = Math.min(minX, line.start.x, line.end.x);
        minY = Math.min(minY, line.start.y, line.end.y);
        minZ = Math.min(minZ, line.start.z, line.end.z);
        maxX = Math.max(maxX, line.start.x, line.end.x);
        maxY = Math.max(maxY, line.start.y, line.end.y);
        maxZ = Math.max(maxZ, line.start.z, line.end.z);
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

interface LayerMeshData {
    layerName: string;
    geometry: THREE.BufferGeometry;
    material: THREE.LineBasicMaterial;
    visible: boolean;
}

interface HatchMeshData {
    key: string;
    geometry: THREE.ShapeGeometry;
    material: THREE.MeshBasicMaterial;
    zPosition: number;
    visible: boolean;
}

/**
 * Cad Mesh 컴포넌트
 * 레이어별로 분리 렌더링하여 각 레이어 색상 적용
 */
function CadMeshComponent({
    data,
    center = true,
    layers,
    renderMode = 'wireframe',
}: CadMeshProps) {
    // 전체 데이터의 중심점 계산 (한 번만)
    const dataCenter = useMemo(() => {
        if (!center) return new THREE.Vector3(0, 0, 0);
        return calculateDataCenter(data);
    }, [data, center]);

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
            const entityCount =
                layerData.lines.length +
                layerData.circles.length +
                layerData.arcs.length +
                layerData.polylines.length;

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

    // HATCH 와이어프레임 경계 (wireframe 모드용)
    const hatchWireframeMeshes = useMemo((): LayerMeshData[] => {
        if (
            renderMode !== 'wireframe' ||
            !data.hatches ||
            data.hatches.length === 0
        ) {
            return [];
        }

        const totalEntities = data.metadata.entityCount;
        const segments = getLODSegments(totalEntities);
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
    }, [data, layers, center, dataCenter, renderMode]);

    // HATCH 솔리드/패턴 메시 (solid/pattern 모드용)
    const hatchFillMeshes = useMemo((): HatchMeshData[] => {
        if (
            renderMode === 'wireframe' ||
            !data.hatches ||
            data.hatches.length === 0
        ) {
            return [];
        }

        const totalEntities = data.metadata.entityCount;
        const segments = getLODSegments(totalEntities);
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
    }, [data, layers, center, dataCenter, renderMode]);

    // Geometry 및 Material 정리 (메모리 누수 방지)
    useEffect(() => {
        return () => {
            for (const mesh of layerMeshes) {
                mesh.geometry.dispose();
                mesh.material.dispose();
            }
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
            // 패턴 텍스처 캐시 정리
            clearPatternTextureCache();
        };
    }, [layerMeshes, hatchWireframeMeshes, hatchFillMeshes]);

    return (
        <group>
            {/* 와이어프레임 (LINE, CIRCLE, ARC, POLYLINE) */}
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
        </group>
    );
}

export const CadMesh = memo(CadMeshComponent);
