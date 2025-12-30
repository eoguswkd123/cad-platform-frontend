/**
 * CurveMesh - ELLIPSE/SPLINE 렌더링 컴포넌트
 *
 * ELLIPSE 및 SPLINE 엔티티를 레이어별 색상으로 렌더링
 */

import { useMemo, useEffect, memo } from 'react';

import * as THREE from 'three';

import { DEFAULT_LAYER_COLOR, getLODSegments } from '@/constants/cad';
import { ellipsesToGeometry, splinesToGeometry } from '@/utils/cad';

import type { CadMeshBaseProps, LayerMeshData } from './types';

/**
 * CurveMesh 컴포넌트
 * ELLIPSE 및 SPLINE 엔티티를 레이어별로 렌더링
 */
function CurveMeshComponent({
    data,
    center = true,
    layers,
    dataCenter,
}: CadMeshBaseProps) {
    const totalEntities = data.metadata.entityCount;
    const segments = getLODSegments(totalEntities);

    // ELLIPSE/SPLINE 지오메트리 생성
    const ellipseSplineMeshes = useMemo((): LayerMeshData[] => {
        const hasEllipses = data.ellipses && data.ellipses.length > 0;
        const hasSplines = data.splines && data.splines.length > 0;

        if (!hasEllipses && !hasSplines) {
            return [];
        }

        const meshes: LayerMeshData[] = [];

        if (!layers || layers.size === 0) {
            // 레이어 정보 없으면 단일 메시
            const geometries: THREE.BufferGeometry[] = [];

            if (hasEllipses) {
                const ellipseGeom = ellipsesToGeometry(data.ellipses, segments);
                if (center) {
                    ellipseGeom.translate(
                        -dataCenter.x,
                        -dataCenter.y,
                        -dataCenter.z
                    );
                }
                geometries.push(ellipseGeom);
            }

            if (hasSplines) {
                const splineGeom = splinesToGeometry(data.splines, segments);
                if (center) {
                    splineGeom.translate(
                        -dataCenter.x,
                        -dataCenter.y,
                        -dataCenter.z
                    );
                }
                geometries.push(splineGeom);
            }

            for (let i = 0; i < geometries.length; i++) {
                const mat = new THREE.LineBasicMaterial({
                    color: new THREE.Color(DEFAULT_LAYER_COLOR),
                    linewidth: 1,
                });
                meshes.push({
                    layerName: `ellipse-spline-default-${i}`,
                    geometry: geometries[i]!,
                    material: mat,
                    visible: true,
                });
            }
        } else {
            for (const [layerName, layerInfo] of layers) {
                const layerEllipses = data.ellipses.filter(
                    (e) => (e.layer ?? '0') === layerName
                );
                const layerSplines = data.splines.filter(
                    (s) => (s.layer ?? '0') === layerName
                );

                if (layerEllipses.length === 0 && layerSplines.length === 0) {
                    continue;
                }

                const geometries: THREE.BufferGeometry[] = [];

                if (layerEllipses.length > 0) {
                    const ellipseGeom = ellipsesToGeometry(
                        layerEllipses,
                        segments
                    );
                    if (center) {
                        ellipseGeom.translate(
                            -dataCenter.x,
                            -dataCenter.y,
                            -dataCenter.z
                        );
                    }
                    geometries.push(ellipseGeom);
                }

                if (layerSplines.length > 0) {
                    const splineGeom = splinesToGeometry(
                        layerSplines,
                        segments
                    );
                    if (center) {
                        splineGeom.translate(
                            -dataCenter.x,
                            -dataCenter.y,
                            -dataCenter.z
                        );
                    }
                    geometries.push(splineGeom);
                }

                for (let i = 0; i < geometries.length; i++) {
                    const mat = new THREE.LineBasicMaterial({
                        color: new THREE.Color(layerInfo.color),
                        linewidth: 1,
                    });
                    meshes.push({
                        layerName: `ellipse-spline-${layerName}-${i}`,
                        geometry: geometries[i]!,
                        material: mat,
                        visible: layerInfo.visible,
                    });
                }
            }
        }

        return meshes;
    }, [data.ellipses, data.splines, layers, center, dataCenter, segments]);

    // Geometry 및 Material 정리
    useEffect(() => {
        return () => {
            for (const mesh of ellipseSplineMeshes) {
                mesh.geometry.dispose();
                mesh.material.dispose();
            }
        };
    }, [ellipseSplineMeshes]);

    return (
        <>
            {ellipseSplineMeshes.map(
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

export const CurveMesh = memo(CurveMeshComponent);
