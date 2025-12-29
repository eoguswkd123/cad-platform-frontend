/**
 * DXF Parser Fixtures
 * 다양한 DXF 파싱 결과 테스트 픽스처
 */

import type { DXFLibEntity } from '@/features/CadViewer/types';

import type { DxfParseResult } from './types';

// ============================================================
// 개별 픽스처
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

// ============================================================
// 보안 테스트용 악성 픽스처
// ============================================================

/**
 * 극단적으로 큰 좌표값을 가진 엔티티 (버퍼 오버플로우 테스트)
 */
export const dxfFixtureMaliciousLargeCoords: DxfParseResult = {
    entities: [
        {
            type: 'LINE',
            layer: '0',
            vertices: [
                {
                    x: Number.MAX_SAFE_INTEGER,
                    y: Number.MAX_SAFE_INTEGER,
                    z: 0,
                },
                {
                    x: -Number.MAX_SAFE_INTEGER,
                    y: -Number.MAX_SAFE_INTEGER,
                    z: 0,
                },
            ],
        },
        {
            type: 'CIRCLE',
            layer: '0',
            center: { x: 1e308, y: 1e308, z: 0 },
            radius: 1e308,
        },
    ],
    tables: {
        layer: {
            layers: {
                '0': { name: '0', color: 16777215, colorIndex: 7 },
            },
        },
    },
};

/**
 * Infinity 및 NaN 값을 가진 엔티티 (수치 안정성 테스트)
 */
export const dxfFixtureMaliciousInfinity: DxfParseResult = {
    entities: [
        {
            type: 'LINE',
            layer: '0',
            vertices: [
                { x: Infinity, y: -Infinity, z: 0 },
                { x: NaN, y: NaN, z: NaN },
            ],
        },
        {
            type: 'CIRCLE',
            layer: '0',
            center: { x: Infinity, y: 0, z: 0 },
            radius: Infinity,
        },
        {
            type: 'ARC',
            layer: '0',
            center: { x: 0, y: 0, z: 0 },
            radius: NaN,
            startAngle: Infinity,
            endAngle: -Infinity,
        },
    ],
    tables: {
        layer: {
            layers: {
                '0': { name: '0', color: 16777215, colorIndex: 7 },
            },
        },
    },
};

/**
 * 음수 값을 가진 엔티티 (유효성 검사 테스트)
 */
export const dxfFixtureMaliciousNegativeValues: DxfParseResult = {
    entities: [
        {
            type: 'CIRCLE',
            layer: '0',
            center: { x: 0, y: 0, z: 0 },
            radius: -50, // 음수 반지름
        },
        {
            type: 'ARC',
            layer: '0',
            center: { x: 0, y: 0, z: 0 },
            radius: -30, // 음수 반지름
            startAngle: -720, // 극단적인 음수 각도
            endAngle: 720, // 극단적인 양수 각도
        },
    ],
    tables: {
        layer: {
            layers: {
                '0': { name: '0', color: 16777215, colorIndex: 7 },
            },
        },
    },
};

/**
 * 0 반지름을 가진 엔티티 (엣지 케이스 테스트)
 */
export const dxfFixtureMaliciousZeroRadius: DxfParseResult = {
    entities: [
        {
            type: 'CIRCLE',
            layer: '0',
            center: { x: 50, y: 50, z: 0 },
            radius: 0,
        },
        {
            type: 'ARC',
            layer: '0',
            center: { x: 100, y: 100, z: 0 },
            radius: 0,
            startAngle: 0,
            endAngle: 90,
        },
    ],
    tables: {
        layer: {
            layers: {
                '0': { name: '0', color: 16777215, colorIndex: 7 },
            },
        },
    },
};

/**
 * 빈 vertices 배열을 가진 엔티티 (빈 배열 처리 테스트)
 */
export const dxfFixtureMaliciousEmptyVertices: DxfParseResult = {
    entities: [
        {
            type: 'LINE',
            layer: '0',
            vertices: [], // 빈 배열
        },
        {
            type: 'LWPOLYLINE',
            layer: '0',
            vertices: [], // 빈 배열
            shape: false,
        },
        {
            type: 'POLYLINE',
            layer: '0',
            vertices: [], // 빈 배열
            shape: true,
        },
    ],
    tables: {
        layer: {
            layers: {
                '0': { name: '0', color: 16777215, colorIndex: 7 },
            },
        },
    },
};

/**
 * 단일 vertex만 가진 엔티티 (불완전 데이터 테스트)
 */
export const dxfFixtureMaliciousSingleVertex: DxfParseResult = {
    entities: [
        {
            type: 'LINE',
            layer: '0',
            vertices: [{ x: 0, y: 0, z: 0 }], // 단일 점
        },
        {
            type: 'LWPOLYLINE',
            layer: '0',
            vertices: [{ x: 100, y: 100, z: 0 }], // 단일 점
            shape: false,
        },
    ],
    tables: {
        layer: {
            layers: {
                '0': { name: '0', color: 16777215, colorIndex: 7 },
            },
        },
    },
};

/**
 * 특수 문자가 포함된 레이어 이름 (XSS/인젝션 테스트)
 */
export const dxfFixtureMaliciousLayerNames: DxfParseResult = {
    entities: [
        {
            type: 'LINE',
            layer: '<script>alert("xss")</script>',
            vertices: [
                { x: 0, y: 0, z: 0 },
                { x: 100, y: 100, z: 0 },
            ],
        },
        {
            type: 'LINE',
            layer: '"; DROP TABLE layers; --',
            vertices: [
                { x: 0, y: 0, z: 0 },
                { x: 50, y: 50, z: 0 },
            ],
        },
        {
            type: 'LINE',
            layer: '../../../etc/passwd',
            vertices: [
                { x: 0, y: 0, z: 0 },
                { x: 25, y: 25, z: 0 },
            ],
        },
        {
            type: 'CIRCLE',
            layer: '${process.env.SECRET}',
            center: { x: 0, y: 0, z: 0 },
            radius: 10,
        },
    ],
    tables: {
        layer: {
            layers: {
                '<script>alert("xss")</script>': {
                    name: '<script>alert("xss")</script>',
                    color: 255,
                    colorIndex: 1,
                },
                '"; DROP TABLE layers; --': {
                    name: '"; DROP TABLE layers; --',
                    color: 65280,
                    colorIndex: 3,
                },
                '../../../etc/passwd': {
                    name: '../../../etc/passwd',
                    color: 16711680,
                    colorIndex: 5,
                },
                '${process.env.SECRET}': {
                    name: '${process.env.SECRET}',
                    color: 16776960,
                    colorIndex: 2,
                },
            },
        },
    },
};

/**
 * 극단적으로 긴 레이어 이름 (버퍼 오버플로우 테스트)
 */
export const dxfFixtureMaliciousLongLayerName: DxfParseResult = {
    entities: [
        {
            type: 'LINE',
            layer: 'A'.repeat(10000), // 10,000자 레이어 이름
            vertices: [
                { x: 0, y: 0, z: 0 },
                { x: 100, y: 100, z: 0 },
            ],
        },
    ],
    tables: {
        layer: {
            layers: {
                ['A'.repeat(10000)]: {
                    name: 'A'.repeat(10000),
                    color: 16777215,
                    colorIndex: 7,
                },
            },
        },
    },
};

/**
 * 유효하지 않은 colorIndex 값 (범위 검사 테스트)
 */
export const dxfFixtureMaliciousColorIndex: DxfParseResult = {
    entities: [
        {
            type: 'LINE',
            layer: 'InvalidColor1',
            vertices: [
                { x: 0, y: 0, z: 0 },
                { x: 100, y: 100, z: 0 },
            ],
        },
        {
            type: 'CIRCLE',
            layer: 'InvalidColor2',
            center: { x: 50, y: 50, z: 0 },
            radius: 25,
        },
    ],
    tables: {
        layer: {
            layers: {
                InvalidColor1: {
                    name: 'InvalidColor1',
                    color: -1, // 음수 색상
                    colorIndex: -100, // 음수 colorIndex
                },
                InvalidColor2: {
                    name: 'InvalidColor2',
                    color: 999999999, // 매우 큰 색상 값
                    colorIndex: 1000, // 유효 범위 초과 (0-255)
                },
            },
        },
    },
};

/**
 * 순환 참조를 시뮬레이션하는 픽스처 (JSON 직렬화 테스트)
 * 실제 순환 참조는 생성할 수 없지만, 중첩 구조로 테스트
 */
export const dxfFixtureMaliciousDeeplyNested: DxfParseResult = {
    entities: Array.from({ length: 100 }, (_, i) => ({
        type: 'LINE' as const,
        layer: `Layer${i}`,
        vertices: [
            { x: i, y: i, z: i },
            { x: i + 1, y: i + 1, z: i + 1 },
        ],
    })),
    tables: {
        layer: {
            layers: Object.fromEntries(
                Array.from({ length: 100 }, (_, i) => [
                    `Layer${i}`,
                    { name: `Layer${i}`, color: i * 1000, colorIndex: i % 256 },
                ])
            ),
        },
    },
};

/**
 * undefined 및 null 값 시뮬레이션 (타입 안전성 테스트)
 */
export const dxfFixtureMaliciousUndefinedValues: DxfParseResult = {
    entities: [
        {
            type: 'LINE',
            layer: undefined as unknown as string,
            vertices: [
                { x: 0, y: 0, z: 0 },
                { x: 100, y: 100, z: 0 },
            ],
        },
        {
            type: 'CIRCLE',
            layer: null as unknown as string,
            center: { x: 50, y: 50, z: 0 },
            radius: 25,
        },
    ],
    tables: {
        layer: {
            layers: {
                '0': { name: '0', color: 16777215, colorIndex: 7 },
            },
        },
    },
};

// ============================================================
// 동적 픽스처 생성기
// ============================================================

/**
 * 많은 엔티티가 포함된 대용량 DXF 결과 생성
 * @param entityCount 생성할 엔티티 수
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

/**
 * 모든 DXF 픽스처를 포함하는 객체
 */
export const dxfFixtures = {
    // 정상 픽스처
    withLines: dxfFixtureWithLines,
    withCircles: dxfFixtureWithCircles,
    withArcs: dxfFixtureWithArcs,
    withPolylines: dxfFixtureWithPolylines,
    mixed: dxfFixtureMixed,
    empty: dxfFixtureEmpty,
    unsupportedOnly: dxfFixtureUnsupportedOnly,
    noLayerTable: dxfFixtureNoLayerTable,
    createLarge: createLargeDxfFixture,

    // 보안 테스트용 악성 픽스처
    malicious: {
        largeCoords: dxfFixtureMaliciousLargeCoords,
        infinity: dxfFixtureMaliciousInfinity,
        negativeValues: dxfFixtureMaliciousNegativeValues,
        zeroRadius: dxfFixtureMaliciousZeroRadius,
        emptyVertices: dxfFixtureMaliciousEmptyVertices,
        singleVertex: dxfFixtureMaliciousSingleVertex,
        layerNames: dxfFixtureMaliciousLayerNames,
        longLayerName: dxfFixtureMaliciousLongLayerName,
        colorIndex: dxfFixtureMaliciousColorIndex,
        deeplyNested: dxfFixtureMaliciousDeeplyNested,
        undefinedValues: dxfFixtureMaliciousUndefinedValues,
    },
};
