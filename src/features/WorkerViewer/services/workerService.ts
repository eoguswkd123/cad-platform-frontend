/**
 * WorkerViewer - Worker Service
 * Mock API 서비스 (나중에 실제 API로 교체 가능)
 */

import type { ModelInfo } from '../types';

/**
 * Mock 모델 목록
 * KhronosGroup 공식 glTF 샘플 모델 사용
 * @see https://github.com/KhronosGroup/glTF-Sample-Models
 */
const MOCK_MODELS: ModelInfo[] = [
    {
        id: '1',
        name: 'Duck',
        url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Duck/glTF-Binary/Duck.glb',
        description: '노란 오리 모델 (KhronosGroup 공식 샘플)',
        format: 'glb',
        fileSize: 167000,
    },
    {
        id: '2',
        name: 'Box',
        url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Box/glTF-Binary/Box.glb',
        description: '기본 박스 모델',
        format: 'glb',
        fileSize: 1300,
    },
    {
        id: '3',
        name: 'ToyCar',
        url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/ToyCar/glTF/ToyCar.gltf',
        description: '장난감 자동차 모델 (clearcoat/sheen 재질 효과)',
        format: 'gltf',
        fileSize: 450000,
    },
    {
        id: '4',
        name: 'BoomBox',
        url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/BoomBox/glTF-Binary/BoomBox.glb',
        description: '붐박스 오디오 모델 (발광 효과 포함)',
        format: 'glb',
        fileSize: 200000,
    },
];

/** Worker Service 인터페이스 */
export interface WorkerServiceInterface {
    /** 사용 가능한 모델 목록 조회 */
    getAvailableModels(): Promise<ModelInfo[]>;
    /** ID로 모델 조회 */
    fetchModelById(id: string): Promise<ModelInfo | undefined>;
    /** URL로 모델 정보 생성 */
    createModelFromUrl(url: string): ModelInfo;
}

/** Mock Worker Service 구현 */
class MockWorkerService implements WorkerServiceInterface {
    async getAvailableModels(): Promise<ModelInfo[]> {
        // 네트워크 지연 시뮬레이션
        await new Promise((resolve) => setTimeout(resolve, 300));
        return MOCK_MODELS;
    }

    async fetchModelById(id: string): Promise<ModelInfo | undefined> {
        // 네트워크 지연 시뮬레이션
        await new Promise((resolve) => setTimeout(resolve, 200));
        return MOCK_MODELS.find((m) => m.id === id);
    }

    createModelFromUrl(url: string): ModelInfo {
        const fileName = url.split('/').pop() || 'model';
        const extension = fileName.split('.').pop()?.toLowerCase();
        const format = extension === 'gltf' ? 'gltf' : 'glb';

        return {
            id: `url-${Date.now()}`,
            name: fileName,
            url,
            format,
        };
    }
}

/** 서비스 인스턴스 export (현재 Mock 사용, 백엔드 연동 시 교체) */
export const workerService: WorkerServiceInterface = new MockWorkerService();
