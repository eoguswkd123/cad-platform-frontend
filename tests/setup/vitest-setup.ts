/**
 * Vitest Global Setup
 * 모든 테스트 전에 실행되는 글로벌 설정
 */

import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, afterAll, vi } from 'vitest';

// 각 테스트 후 DOM 정리
afterEach(() => {
    cleanup();
});

// Three.js Canvas 모킹 (jsdom은 WebGL 미지원)
// HTMLCanvasElement.prototype.getContext를 모킹하여 Three.js 렌더링 에러 방지
const mockCanvasContext = {
    fillStyle: '',
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    getImageData: vi.fn(() => ({ data: new Uint8ClampedArray(4) })),
    putImageData: vi.fn(),
    createImageData: vi.fn(() => ({ data: new Uint8ClampedArray(4) })),
    setTransform: vi.fn(),
    drawImage: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    closePath: vi.fn(),
    stroke: vi.fn(),
    fill: vi.fn(),
    translate: vi.fn(),
    scale: vi.fn(),
    rotate: vi.fn(),
    arc: vi.fn(),
    measureText: vi.fn(() => ({ width: 0 })),
    transform: vi.fn(),
    rect: vi.fn(),
    clip: vi.fn(),
    canvas: {
        width: 800,
        height: 600,
    },
};

HTMLCanvasElement.prototype.getContext = vi.fn(
    () => mockCanvasContext
) as unknown as typeof HTMLCanvasElement.prototype.getContext;

// ResizeObserver 모킹 (jsdom 미지원)
global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));

// requestAnimationFrame 모킹
global.requestAnimationFrame = vi.fn((callback) => {
    return setTimeout(callback, 16) as unknown as number;
});

global.cancelAnimationFrame = vi.fn((id) => {
    clearTimeout(id);
});

// Worker 글로벌 모킹
// Vite의 Worker URL 변환을 우회하여 테스트에서 Worker 동작 시뮬레이션
import { setupWorkerMock, clearWorkerMock } from '../mocks/worker';

// 각 테스트 스위트 전에 Worker 모킹 설정
beforeAll(() => {
    setupWorkerMock();
});

// 테스트 종료 후 모킹 해제
afterAll(() => {
    clearWorkerMock();
});
