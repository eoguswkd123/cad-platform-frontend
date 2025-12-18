/**
 * workerService.test.ts
 * WorkerViewer Mock 서비스 레이어 테스트
 *
 * 주요 테스트:
 * - getAvailableModels 동작 테스트
 * - fetchModelById 성공/실패 테스트
 * - createModelFromUrl 동작 테스트
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { workerService } from '../workerService';

describe('workerService', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe('getAvailableModels', () => {
        it('모델 목록을 반환함', async () => {
            const promise = workerService.getAvailableModels();

            // 타이머 진행
            await vi.advanceTimersByTimeAsync(300);

            const models = await promise;

            expect(Array.isArray(models)).toBe(true);
            expect(models.length).toBeGreaterThan(0);
        });

        it('각 모델은 필수 속성을 포함', async () => {
            const promise = workerService.getAvailableModels();
            await vi.advanceTimersByTimeAsync(300);

            const models = await promise;

            models.forEach((model) => {
                expect(model).toHaveProperty('id');
                expect(model).toHaveProperty('name');
                expect(model).toHaveProperty('url');
                expect(model).toHaveProperty('format');
            });
        });

        it('모델 형식은 glb 또는 gltf', async () => {
            const promise = workerService.getAvailableModels();
            await vi.advanceTimersByTimeAsync(300);

            const models = await promise;

            models.forEach((model) => {
                expect(['glb', 'gltf']).toContain(model.format);
            });
        });

        it('모델 URL은 유효한 형식', async () => {
            const promise = workerService.getAvailableModels();
            await vi.advanceTimersByTimeAsync(300);

            const models = await promise;

            models.forEach((model) => {
                expect(model.url).toMatch(/^https?:\/\/.+\.(glb|gltf)$/i);
            });
        });
    });

    describe('fetchModelById', () => {
        it('존재하는 ID로 모델 조회 성공', async () => {
            const promise = workerService.fetchModelById('1');
            await vi.advanceTimersByTimeAsync(200);

            const model = await promise;

            expect(model).toBeDefined();
            expect(model?.id).toBe('1');
            expect(model?.name).toBe('Duck');
        });

        it('존재하지 않는 ID로 조회 시 undefined 반환', async () => {
            const promise = workerService.fetchModelById('nonexistent');
            await vi.advanceTimersByTimeAsync(200);

            const model = await promise;

            expect(model).toBeUndefined();
        });

        it('다른 ID로 올바른 모델 반환', async () => {
            const promise = workerService.fetchModelById('2');
            await vi.advanceTimersByTimeAsync(200);

            const model = await promise;

            expect(model).toBeDefined();
            expect(model?.id).toBe('2');
            expect(model?.name).toBe('Box');
        });

        it('빈 문자열 ID로 조회 시 undefined 반환', async () => {
            const promise = workerService.fetchModelById('');
            await vi.advanceTimersByTimeAsync(200);

            const model = await promise;

            expect(model).toBeUndefined();
        });
    });

    describe('createModelFromUrl', () => {
        it('glb URL에서 ModelInfo 생성', () => {
            const url = 'https://example.com/models/test.glb';
            const model = workerService.createModelFromUrl(url);

            expect(model).toBeDefined();
            expect(model.url).toBe(url);
            expect(model.name).toBe('test.glb');
            expect(model.format).toBe('glb');
            expect(model.id).toMatch(/^url-\d+$/);
        });

        it('gltf URL에서 ModelInfo 생성', () => {
            const url = 'https://example.com/models/scene.gltf';
            const model = workerService.createModelFromUrl(url);

            expect(model).toBeDefined();
            expect(model.url).toBe(url);
            expect(model.name).toBe('scene.gltf');
            expect(model.format).toBe('gltf');
        });

        it('확장자 없는 URL은 glb로 기본 설정', () => {
            const url = 'https://example.com/models/unknown';
            const model = workerService.createModelFromUrl(url);

            expect(model.format).toBe('glb');
        });

        it('대문자 확장자 URL 처리', () => {
            const url = 'https://example.com/models/Model.GLB';
            const model = workerService.createModelFromUrl(url);

            expect(model.format).toBe('glb');
        });

        it('복잡한 경로의 URL 처리', () => {
            const url =
                'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Duck/glTF-Binary/Duck.glb';
            const model = workerService.createModelFromUrl(url);

            expect(model.name).toBe('Duck.glb');
            expect(model.format).toBe('glb');
            expect(model.url).toBe(url);
        });

        it('각 호출마다 고유한 ID 생성', () => {
            // Date.now() 모킹
            const mockNow = vi.spyOn(Date, 'now');
            mockNow.mockReturnValueOnce(1000).mockReturnValueOnce(2000);

            const model1 = workerService.createModelFromUrl(
                'https://example.com/a.glb'
            );
            const model2 = workerService.createModelFromUrl(
                'https://example.com/b.glb'
            );

            expect(model1.id).not.toBe(model2.id);
            expect(model1.id).toBe('url-1000');
            expect(model2.id).toBe('url-2000');

            mockNow.mockRestore();
        });

        it('쿼리 파라미터가 있는 URL 처리', () => {
            const url = 'https://example.com/model.glb?v=1&token=abc';
            const model = workerService.createModelFromUrl(url);

            // URL 전체가 유지됨
            expect(model.url).toBe(url);
            // 파일명 추출 시 쿼리 파라미터 포함 (현재 구현)
            expect(model.name).toBe('model.glb?v=1&token=abc');
        });
    });

    describe('모델 데이터 무결성', () => {
        it('Duck 모델 데이터 검증', async () => {
            const promise = workerService.fetchModelById('1');
            await vi.advanceTimersByTimeAsync(200);

            const duck = await promise;

            expect(duck).toMatchObject({
                id: '1',
                name: 'Duck',
                format: 'glb',
            });
            expect(duck?.url).toContain('Duck.glb');
            expect(duck?.description).toBeDefined();
        });

        it('Box 모델 데이터 검증', async () => {
            const promise = workerService.fetchModelById('2');
            await vi.advanceTimersByTimeAsync(200);

            const box = await promise;

            expect(box).toMatchObject({
                id: '2',
                name: 'Box',
                format: 'glb',
            });
            expect(box?.url).toContain('Box.glb');
        });

        it('ToyCar 모델 데이터 검증', async () => {
            const promise = workerService.fetchModelById('3');
            await vi.advanceTimersByTimeAsync(200);

            const toyCar = await promise;

            expect(toyCar).toMatchObject({
                id: '3',
                name: 'ToyCar',
                format: 'gltf',
            });
            expect(toyCar?.url).toContain('ToyCar.gltf');
        });
    });
});
