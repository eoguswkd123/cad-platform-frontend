/**
 * DXF Parser Mock for Testing
 * dxf-parser 라이브러리를 모킹하는 유틸리티
 *
 * vi.mock() 호이스팅 문제를 해결하기 위해 globalThis를 통해 동적 설정 가능
 */

import type { DXFLibEntity, DXFLibLayer } from '@/features/CadViewer/types';

// DXF 파싱 결과 타입
export interface DxfParseResult {
    entities: DXFLibEntity[];
    tables?: {
        layer?: {
            layers: Record<string, DXFLibLayer>;
        };
    };
}

/**
 * 모킹 설정 객체
 * 테스트에서 동적으로 파싱 결과를 변경할 때 사용
 */
export const mockDxfParserConfig = {
    /** parseSync 반환값 (null이면 파싱 실패) */
    parseResult: null as DxfParseResult | null,
    /** true면 parseSync에서 예외 발생 */
    shouldThrow: false,
    /** shouldThrow가 true일 때 발생할 에러 */
    throwError: null as Error | null,
};

/**
 * 모킹 설정 초기화
 */
export function resetMockDxfParser(): void {
    mockDxfParserConfig.parseResult = null;
    mockDxfParserConfig.shouldThrow = false;
    mockDxfParserConfig.throwError = null;
}

/**
 * 파싱 성공 설정
 */
export function setParseSuccess(result: DxfParseResult): void {
    mockDxfParserConfig.parseResult = result;
    mockDxfParserConfig.shouldThrow = false;
    mockDxfParserConfig.throwError = null;
}

/**
 * 파싱 실패 설정 (null 반환)
 */
export function setParseFailure(): void {
    mockDxfParserConfig.parseResult = null;
    mockDxfParserConfig.shouldThrow = false;
    mockDxfParserConfig.throwError = null;
}

/**
 * 파싱 예외 설정
 */
export function setParseException(error?: Error): void {
    mockDxfParserConfig.parseResult = null;
    mockDxfParserConfig.shouldThrow = true;
    mockDxfParserConfig.throwError = error ?? new Error('Mock parse error');
}

// ============================================================
// 테스트 픽스처 - 다양한 DXF 파싱 결과
// ============================================================

/**
 * LINE 엔티티가 포함된 유효한 DXF 결과
 */
export const dxfFixtureWithLines: DxfParseResult = {
    entities: [
        {
            type: 'LINE',
            layer: '0',
            vertices: [
                { x: 0, y: 0, z: 0 },
                { x: 100, y: 100, z: 0 },
            ],
        },
        {
            type: 'LINE',
            layer: 'Layer1',
            start: { x: 50, y: 0, z: 0 },
            end: { x: 50, y: 100, z: 0 },
        },
        {
            type: 'LINE',
            layer: '0',
            vertices: [
                { x: 0, y: 50, z: 0 },
                { x: 100, y: 50, z: 0 },
            ],
        },
    ],
    tables: {
        layer: {
            layers: {
                '0': { name: '0', color: 16777215, colorIndex: 7 },
                Layer1: { name: 'Layer1', color: 255, colorIndex: 1 },
            },
        },
    },
};

/**
 * CIRCLE 엔티티가 포함된 유효한 DXF 결과
 */
export const dxfFixtureWithCircles: DxfParseResult = {
    entities: [
        {
            type: 'CIRCLE',
            layer: '0',
            center: { x: 50, y: 50, z: 0 },
            radius: 25,
        },
        {
            type: 'CIRCLE',
            layer: 'Circles',
            center: { x: 150, y: 50, z: 0 },
            radius: 30,
        },
    ],
    tables: {
        layer: {
            layers: {
                '0': { name: '0', color: 16777215, colorIndex: 7 },
                Circles: { name: 'Circles', color: 65280, colorIndex: 3 },
            },
        },
    },
};

/**
 * ARC 엔티티가 포함된 유효한 DXF 결과
 */
export const dxfFixtureWithArcs: DxfParseResult = {
    entities: [
        {
            type: 'ARC',
            layer: '0',
            center: { x: 100, y: 100, z: 0 },
            radius: 50,
            startAngle: 0,
            endAngle: 90,
        },
        {
            type: 'ARC',
            layer: 'Arcs',
            center: { x: 200, y: 100, z: 0 },
            radius: 40,
            startAngle: 45,
            endAngle: 180,
        },
    ],
    tables: {
        layer: {
            layers: {
                '0': { name: '0', color: 16777215, colorIndex: 7 },
                Arcs: { name: 'Arcs', color: 16711680, colorIndex: 1 },
            },
        },
    },
};

/**
 * POLYLINE/LWPOLYLINE 엔티티가 포함된 유효한 DXF 결과
 */
export const dxfFixtureWithPolylines: DxfParseResult = {
    entities: [
        {
            type: 'LWPOLYLINE',
            layer: '0',
            vertices: [
                { x: 0, y: 0, z: 0 },
                { x: 100, y: 0, z: 0 },
                { x: 100, y: 100, z: 0 },
                { x: 0, y: 100, z: 0 },
            ],
            shape: true, // closed
        },
        {
            type: 'POLYLINE',
            layer: 'Polylines',
            vertices: [
                { x: 200, y: 0, z: 0 },
                { x: 250, y: 50, z: 0 },
                { x: 200, y: 100, z: 0 },
            ],
            shape: false, // open
        },
    ],
    tables: {
        layer: {
            layers: {
                '0': { name: '0', color: 16777215, colorIndex: 7 },
                Polylines: { name: 'Polylines', color: 255, colorIndex: 5 },
            },
        },
    },
};

/**
 * 모든 엔티티 타입이 포함된 복합 DXF 결과
 */
export const dxfFixtureMixed: DxfParseResult = {
    entities: [
        // LINE
        {
            type: 'LINE',
            layer: '0',
            vertices: [
                { x: 0, y: 0, z: 0 },
                { x: 100, y: 100, z: 0 },
            ],
        },
        // CIRCLE
        {
            type: 'CIRCLE',
            layer: 'Shapes',
            center: { x: 50, y: 50, z: 0 },
            radius: 25,
        },
        // ARC
        {
            type: 'ARC',
            layer: 'Shapes',
            center: { x: 150, y: 50, z: 0 },
            radius: 30,
            startAngle: 0,
            endAngle: 180,
        },
        // LWPOLYLINE
        {
            type: 'LWPOLYLINE',
            layer: '0',
            vertices: [
                { x: 200, y: 0, z: 0 },
                { x: 300, y: 0, z: 0 },
                { x: 300, y: 100, z: 0 },
            ],
            shape: false,
        },
    ],
    tables: {
        layer: {
            layers: {
                '0': { name: '0', color: 16777215, colorIndex: 7 },
                Shapes: { name: 'Shapes', color: 65535, colorIndex: 4 },
            },
        },
    },
};

/**
 * 빈 엔티티 목록 (EMPTY_FILE 에러 유발)
 */
export const dxfFixtureEmpty: DxfParseResult = {
    entities: [],
    tables: {
        layer: {
            layers: {
                '0': { name: '0', color: 16777215, colorIndex: 7 },
            },
        },
    },
};

/**
 * 지원하지 않는 엔티티만 포함 (EMPTY_FILE 에러 유발)
 */
export const dxfFixtureUnsupportedOnly: DxfParseResult = {
    entities: [
        {
            type: 'TEXT',
            layer: '0',
            text: 'Hello',
            position: { x: 0, y: 0, z: 0 },
        },
        {
            type: 'MTEXT',
            layer: '0',
            text: 'World',
            position: { x: 100, y: 0, z: 0 },
        },
        {
            type: 'DIMENSION',
            layer: '0',
        },
    ] as unknown as DXFLibEntity[],
    tables: {
        layer: {
            layers: {
                '0': { name: '0', color: 16777215, colorIndex: 7 },
            },
        },
    },
};

/**
 * 레이어 테이블이 없는 DXF 결과
 */
export const dxfFixtureNoLayerTable: DxfParseResult = {
    entities: [
        {
            type: 'LINE',
            layer: 'CustomLayer',
            vertices: [
                { x: 0, y: 0, z: 0 },
                { x: 100, y: 100, z: 0 },
            ],
        },
    ],
    // tables 없음 - 엔티티에서 레이어 추출해야 함
};

/**
 * 많은 엔티티가 포함된 대용량 DXF 결과 생성
 */
export function createLargeDxfFixture(entityCount: number): DxfParseResult {
    const entities: DXFLibEntity[] = [];

    for (let i = 0; i < entityCount; i++) {
        entities.push({
            type: 'LINE',
            layer: i % 2 === 0 ? '0' : 'Layer1',
            vertices: [
                { x: i * 10, y: 0, z: 0 },
                { x: i * 10, y: 100, z: 0 },
            ],
        });
    }

    return {
        entities,
        tables: {
            layer: {
                layers: {
                    '0': { name: '0', color: 16777215, colorIndex: 7 },
                    Layer1: { name: 'Layer1', color: 255, colorIndex: 1 },
                },
            },
        },
    };
}

// ============================================================
// 편의 객체 - 모든 픽스처 모음
// ============================================================

export const dxfFixtures = {
    withLines: dxfFixtureWithLines,
    withCircles: dxfFixtureWithCircles,
    withArcs: dxfFixtureWithArcs,
    withPolylines: dxfFixtureWithPolylines,
    mixed: dxfFixtureMixed,
    empty: dxfFixtureEmpty,
    unsupportedOnly: dxfFixtureUnsupportedOnly,
    noLayerTable: dxfFixtureNoLayerTable,
    createLarge: createLargeDxfFixture,
};
