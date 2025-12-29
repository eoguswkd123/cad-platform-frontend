/**
 * DXF Pipeline Integration Tests
 *
 * DXF 파싱 → 지오메트리 변환 파이프라인 통합 테스트
 * Worker 통신을 제외한 순수 함수 로직 검증
 */

import { describe, it, expect } from 'vitest';

import { DEFAULT_LAYER_COLOR } from '@/features/CadViewer/constants';
import {
    aciToHex,
    isAngleInArc,
    getArcBounds,
} from '@/features/CadViewer/services';
import {
    dxfFixtureWithLines,
    dxfFixtureWithCircles,
    dxfFixtureWithArcs,
    dxfFixtureWithPolylines,
    dxfFixtureMixed,
    dxfFixtureEmpty,
    createLargeDxfFixture,
} from '@tests/mocks/dxf-parser';

describe('DXF Pipeline Integration', () => {
    describe('색상 변환 (aciToHex)', () => {
        it('표준 ACI 색상이 올바르게 변환됨', () => {
            expect(aciToHex(1)).toBe('#ff0000'); // Red
            expect(aciToHex(2)).toBe('#ffff00'); // Yellow
            expect(aciToHex(3)).toBe('#00ff00'); // Green
            expect(aciToHex(4)).toBe('#00ffff'); // Cyan
            expect(aciToHex(5)).toBe('#0000ff'); // Blue
            expect(aciToHex(6)).toBe('#ff00ff'); // Magenta
            expect(aciToHex(7)).toBe('#ffffff'); // White
        });

        it('특수 색상 인덱스 처리', () => {
            expect(aciToHex(0)).toBe('#ffffff'); // ByBlock
            expect(aciToHex(256)).toBe('#ffffff'); // ByLayer
        });

        it('undefined 색상은 기본 색상 반환', () => {
            expect(aciToHex(undefined)).toBe(DEFAULT_LAYER_COLOR);
        });

        it('정의되지 않은 색상 인덱스는 기본 색상 반환', () => {
            expect(aciToHex(999)).toBe(DEFAULT_LAYER_COLOR);
            expect(aciToHex(-1)).toBe(DEFAULT_LAYER_COLOR);
        });
    });

    describe('호 각도 계산 (isAngleInArc)', () => {
        it('정상 범위 (시작 < 끝) 내 각도 확인', () => {
            expect(isAngleInArc(45, 0, 90)).toBe(true);
            expect(isAngleInArc(0, 0, 90)).toBe(true);
            expect(isAngleInArc(90, 0, 90)).toBe(true);
            expect(isAngleInArc(91, 0, 90)).toBe(false);
        });

        it('0°를 지나는 호 (시작 > 끝) 각도 확인', () => {
            // 270° ~ 45° 범위
            expect(isAngleInArc(0, 270, 45)).toBe(true);
            expect(isAngleInArc(300, 270, 45)).toBe(true);
            expect(isAngleInArc(30, 270, 45)).toBe(true);
            expect(isAngleInArc(180, 270, 45)).toBe(false);
        });

        it('음수 각도 정규화', () => {
            expect(isAngleInArc(-10, 350, 10)).toBe(true); // -10 = 350
            expect(isAngleInArc(-90, 0, 180)).toBe(false); // -90 = 270
        });

        it('360° 이상 각도 정규화', () => {
            expect(isAngleInArc(450, 0, 180)).toBe(true); // 450 = 90
            expect(isAngleInArc(720, 0, 90)).toBe(true); // 720 = 0
        });
    });

    describe('호 바운딩 박스 계산 (getArcBounds)', () => {
        it('1사분면 호의 바운딩 박스', () => {
            const arc = {
                center: { x: 0, y: 0, z: 0 },
                radius: 10,
                startAngle: 0,
                endAngle: 90,
                layer: '0',
            };

            const bounds = getArcBounds(arc);

            // 0° ~ 90° 호는 x: 0~10, y: 0~10 범위
            expect(bounds.min.x).toBeCloseTo(0, 5);
            expect(bounds.min.y).toBeCloseTo(0, 5);
            expect(bounds.max.x).toBeCloseTo(10, 5);
            expect(bounds.max.y).toBeCloseTo(10, 5);
        });

        it('전체 원에 가까운 호의 바운딩 박스', () => {
            const arc = {
                center: { x: 100, y: 100, z: 0 },
                radius: 50,
                startAngle: 0,
                endAngle: 359,
                layer: '0',
            };

            const bounds = getArcBounds(arc);

            // 거의 전체 원이므로 center ± radius 범위
            expect(bounds.min.x).toBeCloseTo(50, 0);
            expect(bounds.min.y).toBeCloseTo(50, 0);
            expect(bounds.max.x).toBeCloseTo(150, 0);
            expect(bounds.max.y).toBeCloseTo(150, 0);
        });

        it('Z 좌표가 보존됨', () => {
            const arc = {
                center: { x: 0, y: 0, z: 5 },
                radius: 10,
                startAngle: 0,
                endAngle: 90,
                layer: '0',
            };

            const bounds = getArcBounds(arc);

            expect(bounds.min.z).toBe(5);
            expect(bounds.max.z).toBe(5);
        });
    });

    describe('DXF 픽스처 유효성', () => {
        it('LINE 픽스처가 올바른 구조', () => {
            expect(dxfFixtureWithLines.entities).toHaveLength(3);
            const firstEntity = dxfFixtureWithLines.entities[0];
            expect(firstEntity).toBeDefined();
            expect(firstEntity?.type).toBe('LINE');
            expect(dxfFixtureWithLines.tables?.layer?.layers).toBeDefined();
        });

        it('CIRCLE 픽스처가 올바른 구조', () => {
            expect(dxfFixtureWithCircles.entities).toHaveLength(2);
            const circle = dxfFixtureWithCircles.entities[0];
            expect(circle).toBeDefined();
            expect(circle?.type).toBe('CIRCLE');
            expect(circle).toHaveProperty('center');
            expect(circle).toHaveProperty('radius');
        });

        it('ARC 픽스처가 올바른 구조', () => {
            expect(dxfFixtureWithArcs.entities).toHaveLength(2);
            const arc = dxfFixtureWithArcs.entities[0];
            expect(arc).toBeDefined();
            expect(arc?.type).toBe('ARC');
            expect(arc).toHaveProperty('center');
            expect(arc).toHaveProperty('radius');
            expect(arc).toHaveProperty('startAngle');
            expect(arc).toHaveProperty('endAngle');
        });

        it('POLYLINE 픽스처가 올바른 구조', () => {
            expect(dxfFixtureWithPolylines.entities).toHaveLength(2);
            const polyline = dxfFixtureWithPolylines.entities[0];
            expect(polyline).toBeDefined();
            expect(['LWPOLYLINE', 'POLYLINE']).toContain(polyline?.type);
        });

        it('MIXED 픽스처가 다양한 엔티티 포함', () => {
            const types = dxfFixtureMixed.entities.map((e) => e.type);
            expect(types).toContain('LINE');
            expect(types).toContain('CIRCLE');
            expect(types).toContain('ARC');
            expect(types).toContain('LWPOLYLINE');
        });

        it('EMPTY 픽스처가 빈 엔티티 목록', () => {
            expect(dxfFixtureEmpty.entities).toHaveLength(0);
        });
    });

    describe('대용량 픽스처 생성', () => {
        it('지정된 수의 엔티티 생성', () => {
            const fixture = createLargeDxfFixture(1000);
            expect(fixture.entities).toHaveLength(1000);
        });

        it('생성된 엔티티가 올바른 구조', () => {
            const fixture = createLargeDxfFixture(10);

            fixture.entities.forEach((entity, index) => {
                expect(entity.type).toBe('LINE');
                expect(entity.layer).toBe(index % 2 === 0 ? '0' : 'Layer1');
                expect(entity.vertices).toHaveLength(2);
            });
        });

        it('레이어 테이블이 올바르게 생성됨', () => {
            const fixture = createLargeDxfFixture(100);

            expect(fixture.tables?.layer?.layers['0']).toBeDefined();
            expect(fixture.tables?.layer?.layers['Layer1']).toBeDefined();
        });

        it('대용량 픽스처 성능 테스트', () => {
            const startTime = performance.now();
            const fixture = createLargeDxfFixture(10000);
            const endTime = performance.now();

            expect(fixture.entities).toHaveLength(10000);
            // 10,000개 엔티티 생성이 100ms 이내
            expect(endTime - startTime).toBeLessThan(100);
        });
    });

    describe('레이어 정보 추출', () => {
        it('레이어 테이블에서 레이어 정보 추출', () => {
            const layers = dxfFixtureWithLines.tables?.layer?.layers;

            expect(layers).toBeDefined();
            expect(layers?.['0']).toMatchObject({
                name: '0',
                colorIndex: 7,
            });
            expect(layers?.['Layer1']).toMatchObject({
                name: 'Layer1',
                colorIndex: 1,
            });
        });

        it('레이어별 색상 매핑', () => {
            const layers = dxfFixtureWithLines.tables?.layer?.layers;

            expect(layers).toBeDefined();
            if (layers) {
                const layer0 = layers['0'];
                const layer1 = layers['Layer1'];
                expect(layer0).toBeDefined();
                expect(layer1).toBeDefined();

                const layer0Color = aciToHex(layer0?.colorIndex);
                const layer1Color = aciToHex(layer1?.colorIndex);

                expect(layer0Color).toBe('#ffffff'); // colorIndex 7 = white
                expect(layer1Color).toBe('#ff0000'); // colorIndex 1 = red
            }
        });

        it('레이어 테이블 없는 경우 엔티티에서 레이어 추출 가능', () => {
            const fixture = {
                entities: [
                    { type: 'LINE', layer: 'CustomLayer', vertices: [] },
                    { type: 'LINE', layer: 'AnotherLayer', vertices: [] },
                    { type: 'LINE', layer: 'CustomLayer', vertices: [] },
                ],
            };

            // 엔티티에서 고유 레이어 추출
            const uniqueLayers = [
                ...new Set(fixture.entities.map((e) => e.layer)),
            ];

            expect(uniqueLayers).toContain('CustomLayer');
            expect(uniqueLayers).toContain('AnotherLayer');
            expect(uniqueLayers).toHaveLength(2);
        });
    });

    describe('엔티티 타입별 속성 검증', () => {
        it('LINE 엔티티 속성', () => {
            const line = dxfFixtureWithLines.entities[0];
            expect(line).toBeDefined();
            if (!line) return;

            expect(line.type).toBe('LINE');
            expect(line.layer).toBeDefined();

            // vertices 또는 start/end 형식
            const hasVertices =
                'vertices' in line && Array.isArray(line.vertices);
            const hasStartEnd = 'start' in line && 'end' in line;

            expect(hasVertices || hasStartEnd).toBe(true);
        });

        it('CIRCLE 엔티티 속성', () => {
            const circle = dxfFixtureWithCircles.entities[0];
            expect(circle).toBeDefined();
            if (!circle) return;

            expect(circle.type).toBe('CIRCLE');
            expect(circle.center).toMatchObject({
                x: expect.any(Number),
                y: expect.any(Number),
                z: expect.any(Number),
            });
            expect(circle.radius).toBeGreaterThan(0);
        });

        it('ARC 엔티티 속성', () => {
            const arc = dxfFixtureWithArcs.entities[0];
            expect(arc).toBeDefined();
            if (!arc) return;

            expect(arc.type).toBe('ARC');
            expect(arc.center).toBeDefined();
            expect(arc.radius).toBeGreaterThan(0);
            expect(typeof arc.startAngle).toBe('number');
            expect(typeof arc.endAngle).toBe('number');
        });

        it('POLYLINE 엔티티 속성', () => {
            const polyline = dxfFixtureWithPolylines.entities[0];
            expect(polyline).toBeDefined();
            if (!polyline) return;

            expect(['LWPOLYLINE', 'POLYLINE']).toContain(polyline.type);
            expect(Array.isArray(polyline.vertices)).toBe(true);
            expect(polyline.vertices?.length).toBeGreaterThan(1);
        });
    });
});
