/**
 * WorkerViewer - WorkerMesh Component
 * glTF/glb 모델 3D 렌더링 컴포넌트
 */

import { memo, useEffect, useMemo, useRef } from 'react';

import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface WorkerMeshProps {
    /** 모델 파일 URL */
    url: string;
    /** 모델 중앙 정렬 */
    center?: boolean;
    /** 스케일 */
    scale?: number;
    /** 자동 스케일 정규화 (모델을 targetSize에 맞게 조정) */
    normalizeScale?: boolean;
    /** 정규화 목표 크기 (기본값: 2) */
    targetSize?: number;
    /** 자동 회전 */
    autoRotate?: boolean;
    /** 회전 속도 */
    rotateSpeed?: number;
}

function WorkerMeshComponent({
    url,
    center = true,
    scale = 1,
    normalizeScale = true,
    targetSize = 2,
    autoRotate = false,
    rotateSpeed = 1,
}: WorkerMeshProps) {
    const { scene } = useGLTF(url);
    const groupRef = useRef<THREE.Group>(null);

    // 모델 클론 (원본 보존)
    const clonedScene = useMemo(() => scene.clone(), [scene]);

    // 바운딩 박스 계산
    const boundingBox = useMemo(() => {
        return new THREE.Box3().setFromObject(clonedScene);
    }, [clonedScene]);

    // 자동 스케일 계산 (모델을 targetSize에 맞게 정규화)
    const normalizedScale = useMemo(() => {
        if (!normalizeScale) return scale;

        const size = boundingBox.getSize(new THREE.Vector3());
        const maxDimension = Math.max(size.x, size.y, size.z);

        if (maxDimension === 0) return scale;

        return (targetSize / maxDimension) * scale;
    }, [boundingBox, normalizeScale, targetSize, scale]);

    // 중앙 정렬 계산
    const centerOffset = useMemo(() => {
        if (!center) return new THREE.Vector3(0, 0, 0);

        const centerPoint = boundingBox.getCenter(new THREE.Vector3());

        return new THREE.Vector3(
            -centerPoint.x,
            -centerPoint.y,
            -centerPoint.z
        );
    }, [boundingBox, center]);

    // 자동 회전 애니메이션
    useEffect(() => {
        if (!autoRotate || !groupRef.current) return;

        let animationId: number;
        const animate = () => {
            if (groupRef.current) {
                groupRef.current.rotation.y += 0.01 * rotateSpeed;
            }
            animationId = requestAnimationFrame(animate);
        };

        animationId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationId);
        };
    }, [autoRotate, rotateSpeed]);

    // 메모리 정리
    useEffect(() => {
        return () => {
            clonedScene.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.geometry?.dispose();
                    if (Array.isArray(child.material)) {
                        child.material.forEach((m) => m.dispose());
                    } else {
                        child.material?.dispose();
                    }
                }
            });
        };
    }, [clonedScene]);

    return (
        <group ref={groupRef} position={centerOffset} scale={normalizedScale}>
            <primitive object={clonedScene} />
        </group>
    );
}

export const WorkerMesh = memo(WorkerMeshComponent);
