/**
 * SampleList.test.tsx
 * 샘플 파일 목록 컴포넌트 테스트
 *
 * 주요 테스트:
 * - 렌더링 (샘플 목록, 빈 목록, 로딩)
 * - 상호작용 (샘플 클릭)
 * - 테마 (accentColor)
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { SampleList } from '../SampleList';

import type { SampleInfo } from '../types';

// 테스트용 샘플 데이터
const mockSamples: SampleInfo[] = [
    { id: '1', name: 'sample1', path: '/samples/sample1.dxf', format: 'dxf' },
    { id: '2', name: 'sample2', path: '/samples/sample2.dxf', format: 'dxf' },
    { id: '3', name: 'sample3', path: '/samples/sample3.glb', format: 'glb' },
];

describe('SampleList', () => {
    describe('렌더링', () => {
        it('샘플 목록 렌더링', () => {
            render(
                <SampleList samples={mockSamples} onSelectSample={vi.fn()} />
            );

            expect(screen.getByText('Available Samples')).toBeInTheDocument();
            expect(screen.getByText('sample1')).toBeInTheDocument();
            expect(screen.getByText('sample2')).toBeInTheDocument();
            expect(screen.getByText('sample3')).toBeInTheDocument();
        });

        it('파일 포맷 표시', () => {
            render(
                <SampleList samples={mockSamples} onSelectSample={vi.fn()} />
            );

            expect(screen.getAllByText('.dxf')).toHaveLength(2);
            expect(screen.getByText('.glb')).toBeInTheDocument();
        });

        it('빈 목록 시 null 반환 (렌더링 안 됨)', () => {
            const { container } = render(
                <SampleList samples={[]} onSelectSample={vi.fn()} />
            );

            expect(container.firstChild).toBeNull();
        });

        it('로딩 상태 렌더링', () => {
            const { container } = render(
                <SampleList
                    samples={[]}
                    isLoading={true}
                    onSelectSample={vi.fn()}
                />
            );

            // 로딩 중이면 컨테이너가 렌더링됨
            expect(screen.getByText('Available Samples')).toBeInTheDocument();
            // 로딩 스피너 확인
            expect(
                container.querySelector('.animate-spin')
            ).toBeInTheDocument();
        });

        it('로딩 완료 후 샘플 목록 표시', () => {
            render(
                <SampleList
                    samples={mockSamples}
                    isLoading={false}
                    onSelectSample={vi.fn()}
                />
            );

            expect(screen.getByText('sample1')).toBeInTheDocument();
        });
    });

    describe('상호작용', () => {
        it('샘플 클릭 시 onSelectSample 호출', () => {
            const onSelectSample = vi.fn();
            render(
                <SampleList
                    samples={mockSamples}
                    onSelectSample={onSelectSample}
                />
            );

            fireEvent.click(screen.getByText('sample1'));

            expect(onSelectSample).toHaveBeenCalledTimes(1);
            expect(onSelectSample).toHaveBeenCalledWith(mockSamples[0]);
        });

        it('다른 샘플 클릭 시 해당 샘플로 호출', () => {
            const onSelectSample = vi.fn();
            render(
                <SampleList
                    samples={mockSamples}
                    onSelectSample={onSelectSample}
                />
            );

            fireEvent.click(screen.getByText('sample3'));

            expect(onSelectSample).toHaveBeenCalledWith(mockSamples[2]);
        });
    });

    describe('accentColor', () => {
        it('green 테마 적용 (기본)', () => {
            const { container } = render(
                <SampleList
                    samples={mockSamples}
                    onSelectSample={vi.fn()}
                    accentColor="green"
                />
            );

            // green 아이콘 클래스 확인
            expect(
                container.querySelector('.text-green-400')
            ).toBeInTheDocument();
        });

        it('blue 테마 적용', () => {
            const { container } = render(
                <SampleList
                    samples={mockSamples}
                    onSelectSample={vi.fn()}
                    accentColor="blue"
                />
            );

            // blue 아이콘 클래스 확인
            expect(
                container.querySelector('.text-blue-400')
            ).toBeInTheDocument();
        });
    });

    describe('포맷 없는 샘플', () => {
        it('format이 없으면 확장자 표시 안 함', () => {
            const samplesWithoutFormat: SampleInfo[] = [
                { id: '1', name: 'no-format', path: '/samples/file' },
            ];

            render(
                <SampleList
                    samples={samplesWithoutFormat}
                    onSelectSample={vi.fn()}
                />
            );

            expect(screen.getByText('no-format')).toBeInTheDocument();
            expect(screen.queryByText(/^\./)).not.toBeInTheDocument();
        });
    });
});
