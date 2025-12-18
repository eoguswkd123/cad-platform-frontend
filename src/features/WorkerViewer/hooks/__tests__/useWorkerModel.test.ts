/**
 * useWorkerModel.test.ts
 * WorkerViewer 모델 로딩 훅 테스트
 *
 * 주요 테스트:
 * - 초기 상태 검증
 * - fetchModels 성공/실패 테스트
 * - selectModel 성공/실패 테스트
 * - loadModelFromUrl 동작 테스트
 * - clearModel, clearError 동작 테스트
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { workerService } from '../../services';
import { useWorkerModel } from '../useWorkerModel';

// workerService 모킹
vi.mock('../../services', () => ({
    workerService: {
        getAvailableModels: vi.fn(),
        fetchModelById: vi.fn(),
        createModelFromUrl: vi.fn(),
    },
}));

const mockModels = [
    {
        id: '1',
        name: 'Test Model 1',
        url: '/test/model1.glb',
        format: 'glb' as const,
    },
    {
        id: '2',
        name: 'Test Model 2',
        url: '/test/model2.gltf',
        format: 'gltf' as const,
    },
];

describe('useWorkerModel', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('초기 상태', () => {
        it('초기 상태는 status=idle, models=[], selectedModel=null, error=null', () => {
            const { result } = renderHook(() => useWorkerModel());

            expect(result.current.status).toBe('idle');
            expect(result.current.models).toEqual([]);
            expect(result.current.selectedModel).toBeNull();
            expect(result.current.error).toBeNull();
        });

        it('반환 타입이 UseWorkerModelReturn 인터페이스를 준수', () => {
            const { result } = renderHook(() => useWorkerModel());

            // 모든 필수 속성 존재 확인
            expect(result.current).toHaveProperty('models');
            expect(result.current).toHaveProperty('selectedModel');
            expect(result.current).toHaveProperty('status');
            expect(result.current).toHaveProperty('error');
            expect(typeof result.current.fetchModels).toBe('function');
            expect(typeof result.current.selectModel).toBe('function');
            expect(typeof result.current.loadModelFromUrl).toBe('function');
            expect(typeof result.current.clearModel).toBe('function');
            expect(typeof result.current.clearError).toBe('function');
        });
    });

    describe('fetchModels', () => {
        it('fetchModels 성공 시 models가 업데이트되고 status가 success', async () => {
            vi.mocked(workerService.getAvailableModels).mockResolvedValue(
                mockModels
            );

            const { result } = renderHook(() => useWorkerModel());

            await act(async () => {
                await result.current.fetchModels();
            });

            expect(result.current.status).toBe('success');
            expect(result.current.models).toEqual(mockModels);
            expect(result.current.error).toBeNull();
        });

        it('fetchModels 실패 시 status가 error이고 error 객체가 설정됨', async () => {
            vi.mocked(workerService.getAvailableModels).mockRejectedValue(
                new Error('Network error')
            );

            const { result } = renderHook(() => useWorkerModel());

            await act(async () => {
                await result.current.fetchModels();
            });

            expect(result.current.status).toBe('error');
            expect(result.current.error).not.toBeNull();
            expect(result.current.error?.code).toBeDefined();
        });

        it('fetchModels 호출 시 loading 상태를 거침', async () => {
            vi.mocked(workerService.getAvailableModels).mockImplementation(
                () =>
                    new Promise((resolve) =>
                        setTimeout(() => resolve(mockModels), 100)
                    )
            );

            const { result } = renderHook(() => useWorkerModel());

            // fetchModels 시작
            act(() => {
                result.current.fetchModels();
            });

            // loading 상태 확인
            expect(result.current.status).toBe('loading');

            // 완료 대기
            await waitFor(() => {
                expect(result.current.status).toBe('success');
            });
        });
    });

    describe('selectModel', () => {
        it('selectModel 성공 시 selectedModel이 설정되고 status가 success', async () => {
            const targetModel = mockModels[0];
            vi.mocked(workerService.fetchModelById).mockResolvedValue(
                targetModel
            );

            const { result } = renderHook(() => useWorkerModel());

            await act(async () => {
                await result.current.selectModel('1');
            });

            expect(result.current.status).toBe('success');
            expect(result.current.selectedModel).toEqual(targetModel);
            expect(result.current.error).toBeNull();
        });

        it('존재하지 않는 모델 선택 시 NOT_FOUND 에러', async () => {
            vi.mocked(workerService.fetchModelById).mockResolvedValue(
                undefined
            );

            const { result } = renderHook(() => useWorkerModel());

            await act(async () => {
                await result.current.selectModel('nonexistent');
            });

            expect(result.current.status).toBe('error');
            expect(result.current.error?.code).toBe('NOT_FOUND');
        });

        it('selectModel 실패 시 에러 분류됨', async () => {
            vi.mocked(workerService.fetchModelById).mockRejectedValue(
                new TypeError('Failed to fetch')
            );

            const { result } = renderHook(() => useWorkerModel());

            await act(async () => {
                await result.current.selectModel('1');
            });

            expect(result.current.status).toBe('error');
            expect(result.current.error?.code).toBe('NETWORK_ERROR');
        });
    });

    describe('loadModelFromUrl', () => {
        it('loadModelFromUrl 성공 시 selectedModel이 설정됨', () => {
            const createdModel = {
                id: 'url-123',
                name: 'external.glb',
                url: 'https://example.com/model.glb',
                format: 'glb' as const,
            };
            vi.mocked(workerService.createModelFromUrl).mockReturnValue(
                createdModel
            );

            const { result } = renderHook(() => useWorkerModel());

            act(() => {
                result.current.loadModelFromUrl(
                    'https://example.com/model.glb'
                );
            });

            expect(result.current.status).toBe('success');
            expect(result.current.selectedModel).toEqual(createdModel);
        });

        it('loadModelFromUrl 실패 시 에러 설정됨', () => {
            vi.mocked(workerService.createModelFromUrl).mockImplementation(
                () => {
                    throw new Error('Invalid URL');
                }
            );

            const { result } = renderHook(() => useWorkerModel());

            act(() => {
                result.current.loadModelFromUrl('invalid-url');
            });

            expect(result.current.status).toBe('error');
            expect(result.current.error).not.toBeNull();
        });
    });

    describe('clearModel', () => {
        it('clearModel 호출 시 selectedModel이 null이 되고 status가 idle', async () => {
            const targetModel = mockModels[0];
            vi.mocked(workerService.fetchModelById).mockResolvedValue(
                targetModel
            );

            const { result } = renderHook(() => useWorkerModel());

            // 먼저 모델 선택
            await act(async () => {
                await result.current.selectModel('1');
            });

            expect(result.current.selectedModel).not.toBeNull();

            // clearModel 호출
            act(() => {
                result.current.clearModel();
            });

            expect(result.current.selectedModel).toBeNull();
            expect(result.current.status).toBe('idle');
        });
    });

    describe('clearError', () => {
        it('clearError 호출 시 error가 null이 됨', async () => {
            vi.mocked(workerService.getAvailableModels).mockRejectedValue(
                new Error('Test error')
            );

            const { result } = renderHook(() => useWorkerModel());

            // 에러 발생시키기
            await act(async () => {
                await result.current.fetchModels();
            });

            expect(result.current.error).not.toBeNull();

            // clearError 호출
            act(() => {
                result.current.clearError();
            });

            expect(result.current.error).toBeNull();
        });

        it('에러 없이도 clearError 호출 가능', () => {
            const { result } = renderHook(() => useWorkerModel());

            expect(() => {
                act(() => {
                    result.current.clearError();
                });
            }).not.toThrow();
        });
    });

    describe('에러 분류 (classifyError)', () => {
        it('네트워크 에러 메시지 포함 시 NETWORK_ERROR', async () => {
            vi.mocked(workerService.getAvailableModels).mockRejectedValue(
                new Error('Network request failed')
            );

            const { result } = renderHook(() => useWorkerModel());

            await act(async () => {
                await result.current.fetchModels();
            });

            expect(result.current.error?.code).toBe('NETWORK_ERROR');
        });

        it('파싱 에러 메시지 포함 시 PARSE_ERROR', async () => {
            vi.mocked(workerService.getAvailableModels).mockRejectedValue(
                new Error('Failed to parse JSON')
            );

            const { result } = renderHook(() => useWorkerModel());

            await act(async () => {
                await result.current.fetchModels();
            });

            expect(result.current.error?.code).toBe('PARSE_ERROR');
        });

        it('404 에러 메시지 포함 시 NOT_FOUND', async () => {
            vi.mocked(workerService.getAvailableModels).mockRejectedValue(
                new Error('404 Not Found')
            );

            const { result } = renderHook(() => useWorkerModel());

            await act(async () => {
                await result.current.fetchModels();
            });

            expect(result.current.error?.code).toBe('NOT_FOUND');
        });

        it('기타 에러는 FETCH_ERROR', async () => {
            vi.mocked(workerService.getAvailableModels).mockRejectedValue(
                new Error('Unknown error')
            );

            const { result } = renderHook(() => useWorkerModel());

            await act(async () => {
                await result.current.fetchModels();
            });

            expect(result.current.error?.code).toBe('FETCH_ERROR');
        });
    });
});
