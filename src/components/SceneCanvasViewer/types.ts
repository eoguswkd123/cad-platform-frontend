/**
 * SceneCanvasViewer - 타입 정의
 */

import type { RefObject, ReactNode } from 'react';

import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

/** SceneCanvas Props */
export interface SceneCanvasProps {
    /** 3D 콘텐츠 (Mesh, Light 등) */
    children: ReactNode;

    // 카메라
    /** 카메라 위치 [x, y, z] */
    cameraPosition: [number, number, number];
    /** Field of View (기본: 50) */
    cameraFov?: number;
    /** Near clipping plane (기본: 0.1) */
    cameraNear?: number;
    /** Far clipping plane (기본: 10000) */
    cameraFar?: number;

    // OrbitControls
    /** OrbitControls ref */
    controlsRef: RefObject<OrbitControlsImpl | null>;
    /** Damping 활성화 (기본: true) */
    enableDamping?: boolean;
    /** Damping factor (기본: 0.05) */
    dampingFactor?: number;
    /** 최소 줌 거리 (기본: 1) */
    minDistance?: number;
    /** 최대 줌 거리 (기본: 1000) */
    maxDistance?: number;
    /** 자동 회전 (기본: false) */
    autoRotate?: boolean;
    /** 회전 속도 (기본: 1) */
    rotateSpeed?: number;

    // 조명
    /** Ambient light 강도 (기본: 0.8) */
    ambientIntensity?: number;

    // 그리드
    /** 그리드 표시 여부 (기본: true) */
    showGrid?: boolean;
    /** 그리드 크기 (기본: 100) */
    gridSize?: number;
    /** 그리드 분할 수 (기본: 50) */
    gridDivisions?: number;
    /** 중심선 색상 (기본: 0x444444) */
    gridColorCenterLine?: number;
    /** 그리드 색상 (기본: 0x222222) */
    gridColorGrid?: number;
    /** 그리드 회전 [x, y, z] (라디안) */
    gridRotation?: [number, number, number];
}
