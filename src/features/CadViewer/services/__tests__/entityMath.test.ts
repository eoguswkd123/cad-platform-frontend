/**
 * CadViewer Services - EntityMath Tests
 * Worker-safe 수학 함수 테스트
 */

import { describe, expect, it } from 'vitest';

import { aciToHex, getArcBounds, isAngleInArc } from '../entityMath';

import type { ParsedArc } from '../../types';

describe('aciToHex', () => {
    it('undefined 입력 시 기본 레이어 색상 반환', () => {
        expect(aciToHex(undefined)).toBe('#00ff00');
    });

    it('ACI 기본 색상 변환', () => {
        expect(aciToHex(1)).toBe('#ff0000'); // Red
        expect(aciToHex(2)).toBe('#ffff00'); // Yellow
        expect(aciToHex(3)).toBe('#00ff00'); // Green
        expect(aciToHex(4)).toBe('#00ffff'); // Cyan
        expect(aciToHex(5)).toBe('#0000ff'); // Blue
        expect(aciToHex(6)).toBe('#ff00ff'); // Magenta
        expect(aciToHex(7)).toBe('#ffffff'); // White
    });

    it('ByBlock(0)과 ByLayer(256) 색상 변환', () => {
        expect(aciToHex(0)).toBe('#ffffff'); // ByBlock
        expect(aciToHex(256)).toBe('#ffffff'); // ByLayer
    });

    it('회색조 색상 변환', () => {
        expect(aciToHex(8)).toBe('#808080'); // Dark Gray
        expect(aciToHex(9)).toBe('#c0c0c0'); // Light Gray
        expect(aciToHex(250)).toBe('#333333'); // Very Dark Gray
        expect(aciToHex(255)).toBe('#ffffff'); // White
    });

    it('확장 색상 변환', () => {
        expect(aciToHex(10)).toBe('#ff0000'); // Red
        expect(aciToHex(40)).toBe('#ffff00'); // Yellow
        expect(aciToHex(60)).toBe('#00ff00'); // Green
        expect(aciToHex(100)).toBe('#0000ff'); // Blue
    });

    it('매핑되지 않은 색상은 기본 색상 반환', () => {
        expect(aciToHex(999)).toBe('#00ff00');
        expect(aciToHex(-1)).toBe('#00ff00');
    });
});

describe('isAngleInArc', () => {
    it('정상 범위 (0-90)에서 각도 판정', () => {
        expect(isAngleInArc(45, 0, 90)).toBe(true);
        expect(isAngleInArc(0, 0, 90)).toBe(true);
        expect(isAngleInArc(90, 0, 90)).toBe(true);
        expect(isAngleInArc(91, 0, 90)).toBe(false);
        expect(isAngleInArc(359, 0, 90)).toBe(false);
    });

    it('0도를 지나는 호 (270-90) 범위 판정', () => {
        expect(isAngleInArc(0, 270, 90)).toBe(true);
        expect(isAngleInArc(45, 270, 90)).toBe(true);
        expect(isAngleInArc(270, 270, 90)).toBe(true);
        expect(isAngleInArc(315, 270, 90)).toBe(true);
        expect(isAngleInArc(180, 270, 90)).toBe(false);
        expect(isAngleInArc(135, 270, 90)).toBe(false);
    });

    it('음수 각도 정규화', () => {
        expect(isAngleInArc(-45, 270, 90)).toBe(true); // -45 = 315
        expect(isAngleInArc(-90, 270, 90)).toBe(true); // -90 = 270
        expect(isAngleInArc(-180, 270, 90)).toBe(false); // -180 = 180
    });

    it('360도 이상 각도 정규화', () => {
        expect(isAngleInArc(405, 0, 90)).toBe(true); // 405 = 45
        expect(isAngleInArc(450, 0, 90)).toBe(true); // 450 = 90
        expect(isAngleInArc(720, 0, 90)).toBe(true); // 720 = 0
    });

    it('전체 원 (0-360) 범위 - 정규화 후 0-0이므로 시작점만 포함', () => {
        // 360도는 0도로 정규화되므로, 0-360은 실제로 0-0 범위가 됨
        // 실제 전체 원은 CIRCLE 엔티티로 표현되며, ARC에서는 이 케이스가 발생하지 않음
        expect(isAngleInArc(0, 0, 360)).toBe(true);
        expect(isAngleInArc(360, 0, 360)).toBe(true); // 360 → 0으로 정규화
    });
});

describe('getArcBounds', () => {
    const createArc = (
        cx: number,
        cy: number,
        radius: number,
        startAngle: number,
        endAngle: number
    ): ParsedArc => ({
        center: { x: cx, y: cy, z: 0 },
        radius,
        startAngle,
        endAngle,
        layer: undefined,
    });

    it('1사분면 호 (0-90) 바운딩박스', () => {
        const arc = createArc(0, 0, 10, 0, 90);
        const bounds = getArcBounds(arc);

        // 0도: (10, 0), 90도: (0, 10)
        expect(bounds.min.x).toBeCloseTo(0);
        expect(bounds.min.y).toBeCloseTo(0);
        expect(bounds.max.x).toBeCloseTo(10);
        expect(bounds.max.y).toBeCloseTo(10);
    });

    it('반원 (0-180) 바운딩박스', () => {
        const arc = createArc(0, 0, 10, 0, 180);
        const bounds = getArcBounds(arc);

        // 0도: (10, 0), 90도: (0, 10), 180도: (-10, 0)
        expect(bounds.min.x).toBeCloseTo(-10);
        expect(bounds.min.y).toBeCloseTo(0);
        expect(bounds.max.x).toBeCloseTo(10);
        expect(bounds.max.y).toBeCloseTo(10);
    });

    it('3/4원 (0-270) 바운딩박스', () => {
        const arc = createArc(0, 0, 10, 0, 270);
        const bounds = getArcBounds(arc);

        // 0도, 90도, 180도, 270도 포함
        expect(bounds.min.x).toBeCloseTo(-10);
        expect(bounds.min.y).toBeCloseTo(-10);
        expect(bounds.max.x).toBeCloseTo(10);
        expect(bounds.max.y).toBeCloseTo(10);
    });

    it('0도를 지나는 호 (270-45) 바운딩박스', () => {
        const arc = createArc(0, 0, 10, 270, 45);
        const bounds = getArcBounds(arc);

        // 270도: (0, -10), 0도: (10, 0), 45도: (~7.07, ~7.07)
        expect(bounds.min.x).toBeCloseTo(0);
        expect(bounds.min.y).toBeCloseTo(-10);
        expect(bounds.max.x).toBeCloseTo(10);
        expect(bounds.max.y).toBeCloseTo(Math.sin((45 * Math.PI) / 180) * 10);
    });

    it('중심점이 원점이 아닌 경우', () => {
        const arc = createArc(100, 50, 10, 0, 90);
        const bounds = getArcBounds(arc);

        expect(bounds.min.x).toBeCloseTo(100);
        expect(bounds.min.y).toBeCloseTo(50);
        expect(bounds.max.x).toBeCloseTo(110);
        expect(bounds.max.y).toBeCloseTo(60);
    });

    it('z 좌표 유지', () => {
        const arc: ParsedArc = {
            center: { x: 0, y: 0, z: 5 },
            radius: 10,
            startAngle: 0,
            endAngle: 90,
            layer: undefined,
        };
        const bounds = getArcBounds(arc);

        expect(bounds.min.z).toBe(5);
        expect(bounds.max.z).toBe(5);
    });
});
