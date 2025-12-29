/**
 * UrlInput.test.tsx
 * URL 입력 컴포넌트 테스트
 *
 * 주요 테스트:
 * - 렌더링 (기본, 로딩)
 * - URL 유효성 검사
 * - 상호작용 (Enter 키, 버튼 클릭)
 * - 에러 표시
 * - 접근성
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { UrlInput } from '../UrlInput';

describe('UrlInput', () => {
    describe('렌더링', () => {
        it('기본 상태 렌더링', () => {
            render(<UrlInput onUrlSubmit={vi.fn()} />);

            expect(screen.getByText('URL로 불러오기')).toBeInTheDocument();
            expect(
                screen.getByRole('button', { name: '로드' })
            ).toBeInTheDocument();
            expect(
                screen.getByPlaceholderText('https://example.com/model.glb')
            ).toBeInTheDocument();
        });

        it('커스텀 placeholder 렌더링', () => {
            render(
                <UrlInput
                    onUrlSubmit={vi.fn()}
                    placeholder="https://custom.url/file.glb"
                />
            );

            expect(
                screen.getByPlaceholderText('https://custom.url/file.glb')
            ).toBeInTheDocument();
        });

        it('로딩 상태 렌더링', () => {
            const { container } = render(
                <UrlInput onUrlSubmit={vi.fn()} isLoading={true} />
            );

            expect(screen.getByRole('button')).toBeDisabled();
            expect(
                container.querySelector('.animate-spin')
            ).toBeInTheDocument();
        });
    });

    describe('URL 유효성 검사', () => {
        it('유효한 URL 제출 성공', () => {
            const onUrlSubmit = vi.fn();
            render(<UrlInput onUrlSubmit={onUrlSubmit} />);

            const input = screen.getByPlaceholderText(
                'https://example.com/model.glb'
            );
            fireEvent.change(input, {
                target: { value: 'https://example.com/model.glb' },
            });
            fireEvent.click(screen.getByRole('button', { name: '로드' }));

            expect(onUrlSubmit).toHaveBeenCalledWith(
                'https://example.com/model.glb'
            );
        });

        it('빈 URL 제출 시 에러', () => {
            const onUrlSubmit = vi.fn();
            render(<UrlInput onUrlSubmit={onUrlSubmit} />);

            const input = screen.getByPlaceholderText(
                'https://example.com/model.glb'
            );
            fireEvent.change(input, { target: { value: '   ' } });
            fireEvent.click(screen.getByRole('button'));

            expect(onUrlSubmit).not.toHaveBeenCalled();
        });

        it('잘못된 프로토콜 에러', () => {
            const onUrlSubmit = vi.fn();
            render(<UrlInput onUrlSubmit={onUrlSubmit} />);

            const input = screen.getByPlaceholderText(
                'https://example.com/model.glb'
            );
            fireEvent.change(input, {
                target: { value: 'ftp://example.com/file.glb' },
            });
            fireEvent.click(screen.getByRole('button', { name: '로드' }));

            expect(onUrlSubmit).not.toHaveBeenCalled();
            expect(screen.getByRole('alert')).toBeInTheDocument();
            expect(
                screen.getByText(/https:\/\/ 또는 http:\/\//)
            ).toBeInTheDocument();
        });

        it('잘못된 URL 형식 에러', () => {
            const onUrlSubmit = vi.fn();
            render(<UrlInput onUrlSubmit={onUrlSubmit} />);

            const input = screen.getByPlaceholderText(
                'https://example.com/model.glb'
            );
            fireEvent.change(input, { target: { value: 'https://' } });
            fireEvent.click(screen.getByRole('button', { name: '로드' }));

            expect(onUrlSubmit).not.toHaveBeenCalled();
            expect(screen.getByRole('alert')).toBeInTheDocument();
        });

        it('확장자 검증 (validationConfig)', () => {
            const onUrlSubmit = vi.fn();
            render(
                <UrlInput
                    onUrlSubmit={onUrlSubmit}
                    validationConfig={{ acceptExtensions: ['.glb', '.gltf'] }}
                />
            );

            const input = screen.getByPlaceholderText(
                'https://example.com/model.glb'
            );
            fireEvent.change(input, {
                target: { value: 'https://example.com/model.dxf' },
            });
            fireEvent.click(screen.getByRole('button', { name: '로드' }));

            expect(onUrlSubmit).not.toHaveBeenCalled();
            expect(screen.getByText(/허용된 파일 형식/)).toBeInTheDocument();
        });

        it('유효한 확장자 통과', () => {
            const onUrlSubmit = vi.fn();
            render(
                <UrlInput
                    onUrlSubmit={onUrlSubmit}
                    validationConfig={{ acceptExtensions: ['.glb', '.gltf'] }}
                />
            );

            const input = screen.getByPlaceholderText(
                'https://example.com/model.glb'
            );
            fireEvent.change(input, {
                target: { value: 'https://example.com/model.glb' },
            });
            fireEvent.click(screen.getByRole('button', { name: '로드' }));

            expect(onUrlSubmit).toHaveBeenCalledWith(
                'https://example.com/model.glb'
            );
        });
    });

    describe('상호작용', () => {
        it('Enter 키로 제출', () => {
            const onUrlSubmit = vi.fn();
            render(<UrlInput onUrlSubmit={onUrlSubmit} />);

            const input = screen.getByPlaceholderText(
                'https://example.com/model.glb'
            );
            fireEvent.change(input, {
                target: { value: 'https://example.com/model.glb' },
            });
            fireEvent.keyDown(input, { key: 'Enter' });

            expect(onUrlSubmit).toHaveBeenCalledWith(
                'https://example.com/model.glb'
            );
        });

        it('로딩 중 Enter 키 무시', () => {
            const onUrlSubmit = vi.fn();
            render(<UrlInput onUrlSubmit={onUrlSubmit} isLoading={true} />);

            const input = screen.getByPlaceholderText(
                'https://example.com/model.glb'
            );
            fireEvent.change(input, {
                target: { value: 'https://example.com/model.glb' },
            });
            fireEvent.keyDown(input, { key: 'Enter' });

            expect(onUrlSubmit).not.toHaveBeenCalled();
        });

        it('제출 후 입력 필드 초기화', () => {
            const onUrlSubmit = vi.fn();
            render(<UrlInput onUrlSubmit={onUrlSubmit} />);

            const input = screen.getByPlaceholderText(
                'https://example.com/model.glb'
            ) as HTMLInputElement;
            fireEvent.change(input, {
                target: { value: 'https://example.com/model.glb' },
            });
            fireEvent.click(screen.getByRole('button', { name: '로드' }));

            expect(input.value).toBe('');
        });

        it('입력 시 에러 초기화', () => {
            const onUrlSubmit = vi.fn();
            render(<UrlInput onUrlSubmit={onUrlSubmit} />);

            const input = screen.getByPlaceholderText(
                'https://example.com/model.glb'
            );

            // 잘못된 URL로 에러 발생
            fireEvent.change(input, { target: { value: 'invalid' } });
            fireEvent.click(screen.getByRole('button', { name: '로드' }));
            expect(screen.getByRole('alert')).toBeInTheDocument();

            // 다시 입력하면 에러 사라짐
            fireEvent.change(input, { target: { value: 'https://valid.url' } });
            expect(screen.queryByRole('alert')).not.toBeInTheDocument();
        });
    });

    describe('accentColor', () => {
        it('green 테마 (기본)', () => {
            const { container } = render(
                <UrlInput onUrlSubmit={vi.fn()} accentColor="green" />
            );

            expect(
                container.querySelector('.text-green-400')
            ).toBeInTheDocument();
        });

        it('blue 테마', () => {
            const { container } = render(
                <UrlInput onUrlSubmit={vi.fn()} accentColor="blue" />
            );

            expect(
                container.querySelector('.text-blue-400')
            ).toBeInTheDocument();
        });
    });

    describe('접근성', () => {
        it('에러 시 aria-invalid 설정', () => {
            render(<UrlInput onUrlSubmit={vi.fn()} />);

            const input = screen.getByPlaceholderText(
                'https://example.com/model.glb'
            );
            fireEvent.change(input, { target: { value: 'invalid' } });
            fireEvent.click(screen.getByRole('button', { name: '로드' }));

            expect(input).toHaveAttribute('aria-invalid', 'true');
        });

        it('에러 메시지에 role="alert" 적용', () => {
            render(<UrlInput onUrlSubmit={vi.fn()} />);

            const input = screen.getByPlaceholderText(
                'https://example.com/model.glb'
            );
            fireEvent.change(input, { target: { value: 'invalid' } });
            fireEvent.click(screen.getByRole('button', { name: '로드' }));

            expect(screen.getByRole('alert')).toBeInTheDocument();
        });

        it('에러 시 aria-describedby 연결', () => {
            render(<UrlInput onUrlSubmit={vi.fn()} />);

            const input = screen.getByPlaceholderText(
                'https://example.com/model.glb'
            );
            fireEvent.change(input, { target: { value: 'invalid' } });
            fireEvent.click(screen.getByRole('button', { name: '로드' }));

            expect(input).toHaveAttribute('aria-describedby', 'url-error');
        });
    });

    describe('버튼 상태', () => {
        it('빈 입력 시 버튼 비활성화', () => {
            render(<UrlInput onUrlSubmit={vi.fn()} />);

            expect(screen.getByRole('button', { name: '로드' })).toBeDisabled();
        });

        it('입력 있으면 버튼 활성화', () => {
            render(<UrlInput onUrlSubmit={vi.fn()} />);

            const input = screen.getByPlaceholderText(
                'https://example.com/model.glb'
            );
            fireEvent.change(input, {
                target: { value: 'https://example.com' },
            });

            expect(
                screen.getByRole('button', { name: '로드' })
            ).not.toBeDisabled();
        });

        it('로딩 중 버튼 비활성화', () => {
            render(<UrlInput onUrlSubmit={vi.fn()} isLoading={true} />);

            expect(screen.getByRole('button')).toBeDisabled();
        });
    });
});
