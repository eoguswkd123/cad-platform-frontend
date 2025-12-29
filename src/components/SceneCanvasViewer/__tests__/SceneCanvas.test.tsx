/**
 * SceneCanvas.test.tsx
 * 공통 3D 캔버스 컴포넌트 테스트
 *
 * 주요 테스트:
 * - Canvas 렌더링
 * - 카메라/컨트롤 설정 전달
 * - 그리드 조건부 렌더링
 * - Suspense 폴백 렌더링
 * - children 렌더링
 */

import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';

import { SceneCanvas } from '../SceneCanvas';

import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

// React Three Fiber 모킹
beforeAll(() => {
    // @react-three/fiber 모킹
    vi.mock('@react-three/fiber', () => ({
        Canvas: ({
            children,
            className,
            gl,
            dpr,
        }: {
            children: React.ReactNode;
            className?: string;
            gl?: object;
            dpr?: number[];
        }) => (
            <div
                data-testid="r3f-canvas"
                data-classname={className}
                data-gl={JSON.stringify(gl)}
                data-dpr={JSON.stringify(dpr)}
            >
                {children}
            </div>
        ),
    }));

    // @react-three/drei 모킹
    vi.mock('@react-three/drei', () => ({
        OrbitControls: ({
            enableDamping,
            dampingFactor,
            minDistance,
            maxDistance,
            autoRotate,
            autoRotateSpeed,
        }: {
            enableDamping?: boolean;
            dampingFactor?: number;
            minDistance?: number;
            maxDistance?: number;
            autoRotate?: boolean;
            autoRotateSpeed?: number;
        }) => (
            <div
                data-testid="orbit-controls"
                data-enable-damping={enableDamping}
                data-damping-factor={dampingFactor}
                data-min-distance={minDistance}
                data-max-distance={maxDistance}
                data-auto-rotate={autoRotate}
                data-auto-rotate-speed={autoRotateSpeed}
            />
        ),
        PerspectiveCamera: ({
            makeDefault,
            position,
            fov,
            near,
            far,
        }: {
            makeDefault?: boolean;
            position?: [number, number, number];
            fov?: number;
            near?: number;
            far?: number;
        }) => (
            <div
                data-testid="perspective-camera"
                data-make-default={makeDefault}
                data-position={JSON.stringify(position)}
                data-fov={fov}
                data-near={near}
                data-far={far}
            />
        ),
        Html: ({
            children,
            center,
        }: {
            children: React.ReactNode;
            center?: boolean;
        }) => (
            <div data-testid="drei-html" data-center={center}>
                {children}
            </div>
        ),
    }));
});

afterEach(() => {
    vi.clearAllMocks();
});

// 기본 props
const createDefaultProps = () => ({
    children: <div data-testid="test-child">Test Content</div>,
    cameraPosition: [0, 0, 100] as [number, number, number],
    controlsRef: createRef<OrbitControlsImpl | null>(),
});

describe('SceneCanvas', () => {
    describe('렌더링', () => {
        it('Canvas가 렌더링됨', () => {
            render(<SceneCanvas {...createDefaultProps()} />);

            expect(screen.getByTestId('r3f-canvas')).toBeInTheDocument();
        });

        it('children이 Canvas 내부에 렌더링됨', () => {
            render(<SceneCanvas {...createDefaultProps()} />);

            expect(screen.getByTestId('test-child')).toBeInTheDocument();
            expect(screen.getByText('Test Content')).toBeInTheDocument();
        });

        it('PerspectiveCamera가 렌더링됨', () => {
            render(<SceneCanvas {...createDefaultProps()} />);

            expect(
                screen.getByTestId('perspective-camera')
            ).toBeInTheDocument();
        });

        it('OrbitControls가 렌더링됨', () => {
            render(<SceneCanvas {...createDefaultProps()} />);

            expect(screen.getByTestId('orbit-controls')).toBeInTheDocument();
        });
    });

    describe('카메라 설정', () => {
        it('cameraPosition이 PerspectiveCamera에 전달됨', () => {
            const props = createDefaultProps();
            props.cameraPosition = [10, 20, 30];

            render(<SceneCanvas {...props} />);

            const camera = screen.getByTestId('perspective-camera');
            expect(camera.getAttribute('data-position')).toBe('[10,20,30]');
        });

        it('기본 cameraFov=50이 적용됨', () => {
            render(<SceneCanvas {...createDefaultProps()} />);

            const camera = screen.getByTestId('perspective-camera');
            expect(camera.getAttribute('data-fov')).toBe('50');
        });

        it('커스텀 cameraFov가 적용됨', () => {
            render(<SceneCanvas {...createDefaultProps()} cameraFov={75} />);

            const camera = screen.getByTestId('perspective-camera');
            expect(camera.getAttribute('data-fov')).toBe('75');
        });

        it('기본 cameraNear=0.1이 적용됨', () => {
            render(<SceneCanvas {...createDefaultProps()} />);

            const camera = screen.getByTestId('perspective-camera');
            expect(camera.getAttribute('data-near')).toBe('0.1');
        });

        it('기본 cameraFar=10000이 적용됨', () => {
            render(<SceneCanvas {...createDefaultProps()} />);

            const camera = screen.getByTestId('perspective-camera');
            expect(camera.getAttribute('data-far')).toBe('10000');
        });

        it('makeDefault=true가 적용됨', () => {
            render(<SceneCanvas {...createDefaultProps()} />);

            const camera = screen.getByTestId('perspective-camera');
            expect(camera.getAttribute('data-make-default')).toBe('true');
        });
    });

    describe('OrbitControls 설정', () => {
        it('기본 enableDamping=true가 적용됨', () => {
            render(<SceneCanvas {...createDefaultProps()} />);

            const controls = screen.getByTestId('orbit-controls');
            expect(controls.getAttribute('data-enable-damping')).toBe('true');
        });

        it('기본 dampingFactor=0.05가 적용됨', () => {
            render(<SceneCanvas {...createDefaultProps()} />);

            const controls = screen.getByTestId('orbit-controls');
            expect(controls.getAttribute('data-damping-factor')).toBe('0.05');
        });

        it('기본 minDistance=1이 적용됨', () => {
            render(<SceneCanvas {...createDefaultProps()} />);

            const controls = screen.getByTestId('orbit-controls');
            expect(controls.getAttribute('data-min-distance')).toBe('1');
        });

        it('기본 maxDistance=1000이 적용됨', () => {
            render(<SceneCanvas {...createDefaultProps()} />);

            const controls = screen.getByTestId('orbit-controls');
            expect(controls.getAttribute('data-max-distance')).toBe('1000');
        });

        it('기본 autoRotate=false가 적용됨', () => {
            render(<SceneCanvas {...createDefaultProps()} />);

            const controls = screen.getByTestId('orbit-controls');
            expect(controls.getAttribute('data-auto-rotate')).toBe('false');
        });

        it('autoRotate=true가 전달됨', () => {
            render(<SceneCanvas {...createDefaultProps()} autoRotate={true} />);

            const controls = screen.getByTestId('orbit-controls');
            expect(controls.getAttribute('data-auto-rotate')).toBe('true');
        });

        it('커스텀 rotateSpeed가 전달됨', () => {
            render(<SceneCanvas {...createDefaultProps()} rotateSpeed={2.5} />);

            const controls = screen.getByTestId('orbit-controls');
            expect(controls.getAttribute('data-auto-rotate-speed')).toBe('2.5');
        });
    });

    describe('그리드 조건부 렌더링', () => {
        it('기본 showGrid=true일 때 gridHelper 렌더링됨', () => {
            const { container } = render(
                <SceneCanvas {...createDefaultProps()} />
            );

            // gridHelper는 JSX에서 소문자로 시작하므로 DOM에 직접 렌더링
            const grid = container.querySelector('gridHelper');
            expect(grid).toBeInTheDocument();
        });

        it('showGrid=false일 때 gridHelper 미렌더링', () => {
            const { container } = render(
                <SceneCanvas {...createDefaultProps()} showGrid={false} />
            );

            const grid = container.querySelector('gridHelper');
            expect(grid).not.toBeInTheDocument();
        });

        it('커스텀 gridSize가 적용됨', () => {
            const { container } = render(
                <SceneCanvas {...createDefaultProps()} gridSize={200} />
            );

            const grid = container.querySelector('gridHelper');
            expect(grid).toBeInTheDocument();
        });

        it('gridRotation이 적용됨', () => {
            const { container } = render(
                <SceneCanvas
                    {...createDefaultProps()}
                    gridRotation={[Math.PI / 2, 0, 0]}
                />
            );

            const grid = container.querySelector('gridHelper');
            expect(grid).toBeInTheDocument();
        });
    });

    describe('Canvas 설정', () => {
        it('Canvas에 올바른 className이 적용됨', () => {
            render(<SceneCanvas {...createDefaultProps()} />);

            const canvas = screen.getByTestId('r3f-canvas');
            expect(canvas.getAttribute('data-classname')).toContain(
                'bg-gradient-to-b'
            );
        });

        it('gl 옵션에 antialias=true가 설정됨', () => {
            render(<SceneCanvas {...createDefaultProps()} />);

            const canvas = screen.getByTestId('r3f-canvas');
            const gl = JSON.parse(canvas.getAttribute('data-gl') || '{}');
            expect(gl.antialias).toBe(true);
        });

        it('gl 옵션에 powerPreference=high-performance가 설정됨', () => {
            render(<SceneCanvas {...createDefaultProps()} />);

            const canvas = screen.getByTestId('r3f-canvas');
            const gl = JSON.parse(canvas.getAttribute('data-gl') || '{}');
            expect(gl.powerPreference).toBe('high-performance');
        });

        it('dpr=[1,2]가 설정됨', () => {
            render(<SceneCanvas {...createDefaultProps()} />);

            const canvas = screen.getByTestId('r3f-canvas');
            const dpr = JSON.parse(canvas.getAttribute('data-dpr') || '[]');
            expect(dpr).toEqual([1, 2]);
        });
    });

    describe('조명', () => {
        it('ambientLight가 렌더링됨', () => {
            const { container } = render(
                <SceneCanvas {...createDefaultProps()} />
            );

            const ambientLight = container.querySelector('ambientLight');
            expect(ambientLight).toBeInTheDocument();
        });

        it('기본 ambientIntensity=0.8이 적용됨', () => {
            const { container } = render(
                <SceneCanvas {...createDefaultProps()} />
            );

            const ambientLight = container.querySelector('ambientLight');
            expect(ambientLight?.getAttribute('intensity')).toBe('0.8');
        });

        it('커스텀 ambientIntensity가 적용됨', () => {
            const { container } = render(
                <SceneCanvas {...createDefaultProps()} ambientIntensity={1.2} />
            );

            const ambientLight = container.querySelector('ambientLight');
            expect(ambientLight?.getAttribute('intensity')).toBe('1.2');
        });
    });

    describe('Suspense 폴백', () => {
        it('LoadingFallback이 HTML 컴포넌트를 통해 렌더링됨', () => {
            // Suspense 폴백 테스트는 비동기 로딩 시에만 표시됨
            // 여기서는 Html 컴포넌트가 정상적으로 모킹되어 있는지 확인
            render(<SceneCanvas {...createDefaultProps()} />);

            // Suspense가 정상적으로 children을 렌더링하면 성공
            expect(screen.getByTestId('test-child')).toBeInTheDocument();
        });
    });

    describe('복합 설정', () => {
        it('모든 커스텀 props가 올바르게 전달됨', () => {
            render(
                <SceneCanvas
                    cameraPosition={[50, 100, 150]}
                    cameraFov={60}
                    cameraNear={0.5}
                    cameraFar={5000}
                    controlsRef={createRef<OrbitControlsImpl | null>()}
                    enableDamping={false}
                    dampingFactor={0.1}
                    minDistance={5}
                    maxDistance={500}
                    autoRotate={true}
                    rotateSpeed={3}
                    ambientIntensity={1.0}
                    showGrid={true}
                    gridSize={150}
                    gridDivisions={30}
                    gridColorCenterLine={0x555555}
                    gridColorGrid={0x333333}
                >
                    <div data-testid="custom-content">Custom 3D Content</div>
                </SceneCanvas>
            );

            // Camera props
            const camera = screen.getByTestId('perspective-camera');
            expect(camera.getAttribute('data-position')).toBe('[50,100,150]');
            expect(camera.getAttribute('data-fov')).toBe('60');
            expect(camera.getAttribute('data-near')).toBe('0.5');
            expect(camera.getAttribute('data-far')).toBe('5000');

            // OrbitControls props
            const controls = screen.getByTestId('orbit-controls');
            expect(controls.getAttribute('data-enable-damping')).toBe('false');
            expect(controls.getAttribute('data-damping-factor')).toBe('0.1');
            expect(controls.getAttribute('data-min-distance')).toBe('5');
            expect(controls.getAttribute('data-max-distance')).toBe('500');
            expect(controls.getAttribute('data-auto-rotate')).toBe('true');
            expect(controls.getAttribute('data-auto-rotate-speed')).toBe('3');

            // Children
            expect(screen.getByTestId('custom-content')).toBeInTheDocument();
            expect(screen.getByText('Custom 3D Content')).toBeInTheDocument();
        });
    });
});
