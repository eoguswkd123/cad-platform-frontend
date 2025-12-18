/**
 * Worker Mock for Testing
 * WebWorker API를 시뮬레이션하는 모킹 유틸리티
 *
 * Vite의 Worker URL 변환을 우회하여 테스트에서 Worker 동작을 시뮬레이션합니다.
 */

import { vi } from 'vitest';

import type {
    ParsedCADData,
    LayerInfo,
    UploadError,
} from '@/features/CadViewer/types';

// Worker 메시지 타입
export interface WorkerSuccessPayload {
    lines: ParsedCADData['lines'];
    circles: ParsedCADData['circles'];
    arcs: ParsedCADData['arcs'];
    polylines: ParsedCADData['polylines'];
    bounds: ParsedCADData['bounds'];
    metadata: ParsedCADData['metadata'];
    layers: [string, LayerInfo][];
}

export interface WorkerProgressPayload {
    stage: string;
    percent: number;
}

export interface WorkerErrorPayload {
    code: UploadError['code'];
    message: string;
}

export type WorkerResponseType = 'success' | 'progress' | 'error';

/**
 * MockWorker 클래스
 * Worker API를 시뮬레이션하여 테스트에서 Worker 통신을 검증
 */
export class MockWorker {
    onmessage: ((event: MessageEvent) => void) | null = null;
    onerror: ((event: ErrorEvent) => void) | null = null;
    postMessage = vi.fn();
    terminate = vi.fn();

    // 내부 상태 (테스트에서 접근용)
    private _isTerminated = false;

    get isTerminated(): boolean {
        return this._isTerminated;
    }

    // terminate 호출 시 상태 업데이트
    constructor() {
        this.terminate = vi.fn(() => {
            this._isTerminated = true;
        });
    }
}

// 전역 MockWorker 인스턴스 (테스트에서 접근용)
let currentMockWorker: MockWorker | null = null;

/**
 * MockWorker 생성 함수
 * Worker 생성자 대신 사용
 */
export function createMockWorker(): MockWorker {
    const worker = new MockWorker();
    currentMockWorker = worker;
    return worker;
}

/**
 * 현재 MockWorker 인스턴스 가져오기
 */
export function getCurrentMockWorker(): MockWorker | null {
    return currentMockWorker;
}

/**
 * MockWorker 인스턴스 초기화
 */
export function resetMockWorker(): void {
    currentMockWorker = null;
}

/**
 * Worker 성공 응답 시뮬레이션
 */
export function simulateWorkerSuccess(
    worker: MockWorker,
    payload: WorkerSuccessPayload
): void {
    if (worker.onmessage) {
        worker.onmessage(
            new MessageEvent('message', {
                data: {
                    type: 'success',
                    payload,
                },
            })
        );
    }
}

/**
 * Worker 에러 응답 시뮬레이션
 */
export function simulateWorkerError(
    worker: MockWorker,
    payload: WorkerErrorPayload
): void {
    if (worker.onmessage) {
        worker.onmessage(
            new MessageEvent('message', {
                data: {
                    type: 'error',
                    payload,
                },
            })
        );
    }
}

/**
 * Worker 진행률 응답 시뮬레이션
 */
export function simulateWorkerProgress(
    worker: MockWorker,
    percent: number,
    stage: string
): void {
    if (worker.onmessage) {
        worker.onmessage(
            new MessageEvent('message', {
                data: {
                    type: 'progress',
                    payload: { percent, stage },
                },
            })
        );
    }
}

/**
 * Worker 런타임 에러 시뮬레이션
 */
export function simulateWorkerRuntimeError(
    worker: MockWorker,
    message: string = 'Worker runtime error'
): void {
    if (worker.onerror) {
        worker.onerror(
            new ErrorEvent('error', {
                message,
                error: new Error(message),
            })
        );
    }
}

/**
 * 테스트용 성공 페이로드 생성
 */
export function createSuccessPayload(
    options: Partial<WorkerSuccessPayload> = {}
): WorkerSuccessPayload {
    return {
        lines: options.lines ?? [
            {
                start: { x: 0, y: 0, z: 0 },
                end: { x: 100, y: 100, z: 0 },
                layer: '0',
            },
        ],
        circles: options.circles ?? [],
        arcs: options.arcs ?? [],
        polylines: options.polylines ?? [],
        bounds: options.bounds ?? {
            min: { x: 0, y: 0, z: 0 },
            max: { x: 100, y: 100, z: 0 },
        },
        metadata: options.metadata ?? {
            fileName: 'test.dxf',
            fileSize: 1024,
            entityCount: 1,
            parseTime: 50,
        },
        layers: options.layers ?? [
            [
                '0',
                { name: '0', color: '#ffffff', visible: true, entityCount: 1 },
            ],
        ],
    };
}

/**
 * Worker 글로벌 모킹 설정
 * vitest-setup.ts에서 호출
 */
export function setupWorkerMock(): void {
    // Worker 생성자를 MockWorker로 대체
    vi.stubGlobal(
        'Worker',
        vi.fn().mockImplementation(() => createMockWorker())
    );
}

/**
 * Worker 모킹 해제
 */
export function clearWorkerMock(): void {
    vi.unstubAllGlobals();
    resetMockWorker();
}
