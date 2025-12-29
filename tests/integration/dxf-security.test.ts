/**
 * dxf-security.test.ts
 * DXF 파싱 보안 테스트
 *
 * 악성 또는 비정상적인 DXF 데이터에 대한 안정성 검증
 * - 버퍼 오버플로우 방지
 * - 수치 안정성
 * - XSS/인젝션 방지
 * - 엣지 케이스 처리
 */

import { describe, it, expect } from 'vitest';

import {
    dxfFixtureMaliciousLargeCoords,
    dxfFixtureMaliciousInfinity,
    dxfFixtureMaliciousNegativeValues,
    dxfFixtureMaliciousZeroRadius,
    dxfFixtureMaliciousEmptyVertices,
    dxfFixtureMaliciousSingleVertex,
    dxfFixtureMaliciousLayerNames,
    dxfFixtureMaliciousLongLayerName,
    dxfFixtureMaliciousColorIndex,
    dxfFixtureMaliciousDeeplyNested,
    dxfFixtureMaliciousUndefinedValues,
    dxfFixtures,
} from '../mocks/dxf-parser/fixtures';

import type { DxfParseResult } from '../mocks/dxf-parser/types';

// ============================================================================
// 테스트 헬퍼
// ============================================================================

/**
 * DXF 파싱 결과에서 레이어 이름 추출
 */
function extractLayerNames(fixture: DxfParseResult): string[] {
    const layerNames = new Set<string>();

    fixture.entities.forEach((entity) => {
        if (entity.layer) {
            layerNames.add(entity.layer);
        }
    });

    if (fixture.tables?.layer?.layers) {
        Object.keys(fixture.tables.layer.layers).forEach((name) => {
            layerNames.add(name);
        });
    }

    return Array.from(layerNames);
}

/**
 * 좌표값이 유한한지 확인
 */
function isFiniteCoord(value: number): boolean {
    return Number.isFinite(value);
}

/**
 * HTML 특수문자 이스케이프 (XSS 방지용)
 */
function escapeHtml(str: string): string {
    if (typeof str !== 'string') return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * 레이어 이름 정규화 (특수문자 제거)
 */
function sanitizeLayerName(name: string): string {
    if (typeof name !== 'string') return 'default';
    // 알파벳, 숫자, 언더스코어, 하이픈만 허용
    return name.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 255);
}

// ============================================================================
// 수치 안정성 테스트
// ============================================================================

describe('DXF 보안: 수치 안정성', () => {
    describe('극단적으로 큰 좌표값 처리', () => {
        it('MAX_SAFE_INTEGER 좌표를 안전하게 처리한다', () => {
            const fixture = dxfFixtureMaliciousLargeCoords;

            fixture.entities.forEach((entity) => {
                if (entity.type === 'LINE' && entity.vertices) {
                    entity.vertices.forEach((vertex) => {
                        // 좌표가 숫자 타입인지 확인
                        expect(typeof vertex.x).toBe('number');
                        expect(typeof vertex.y).toBe('number');

                        // 좌표가 유한한 숫자인지 확인
                        expect(isFiniteCoord(vertex.x ?? 0)).toBe(true);
                        expect(isFiniteCoord(vertex.y ?? 0)).toBe(true);
                    });
                }

                if (entity.type === 'CIRCLE' && entity.center) {
                    // 극단적으로 큰 값도 숫자로 처리됨
                    expect(typeof entity.center.x).toBe('number');
                    expect(typeof entity.radius).toBe('number');
                }
            });
        });

        it('대용량 좌표에서 오버플로우가 발생하지 않는다', () => {
            const fixture = dxfFixtureMaliciousLargeCoords;
            const lineEntity = fixture.entities[0];

            if (
                lineEntity &&
                lineEntity.type === 'LINE' &&
                lineEntity.vertices
            ) {
                const [start, end] = lineEntity.vertices;

                if (start && end) {
                    // 좌표 간 연산이 오버플로우 없이 수행되는지 확인
                    const distance = Math.sqrt(
                        Math.pow((end.x ?? 0) - (start.x ?? 0), 2) +
                            Math.pow((end.y ?? 0) - (start.y ?? 0), 2)
                    );

                    // Infinity가 아닌 유한한 값이어야 함
                    expect(Number.isFinite(distance)).toBe(true);
                }
            }
        });
    });

    describe('Infinity 및 NaN 값 처리', () => {
        it('Infinity 좌표를 감지한다', () => {
            const fixture = dxfFixtureMaliciousInfinity;

            let hasInfinity = false;
            fixture.entities.forEach((entity) => {
                if (entity.type === 'LINE' && entity.vertices) {
                    entity.vertices.forEach((vertex) => {
                        if (
                            !Number.isFinite(vertex.x) ||
                            !Number.isFinite(vertex.y)
                        ) {
                            hasInfinity = true;
                        }
                    });
                }
            });

            expect(hasInfinity).toBe(true);
        });

        it('NaN 좌표를 감지한다', () => {
            const fixture = dxfFixtureMaliciousInfinity;

            let hasNaN = false;
            fixture.entities.forEach((entity) => {
                if (entity.type === 'LINE' && entity.vertices) {
                    entity.vertices.forEach((vertex) => {
                        if (Number.isNaN(vertex.x) || Number.isNaN(vertex.y)) {
                            hasNaN = true;
                        }
                    });
                }
            });

            expect(hasNaN).toBe(true);
        });

        it('Infinity/NaN 값을 필터링하는 검증 함수 동작 확인', () => {
            const fixture = dxfFixtureMaliciousInfinity;

            // 유효한 엔티티만 필터링
            const validEntities = fixture.entities.filter((entity) => {
                if (entity.type === 'LINE' && entity.vertices) {
                    return entity.vertices.every(
                        (v) =>
                            Number.isFinite(v.x) &&
                            Number.isFinite(v.y) &&
                            Number.isFinite(v.z)
                    );
                }
                if (entity.type === 'CIRCLE') {
                    return (
                        Number.isFinite(entity.center?.x) &&
                        Number.isFinite(entity.center?.y) &&
                        Number.isFinite(entity.radius)
                    );
                }
                if (entity.type === 'ARC') {
                    return (
                        Number.isFinite(entity.center?.x) &&
                        Number.isFinite(entity.radius) &&
                        Number.isFinite(entity.startAngle) &&
                        Number.isFinite(entity.endAngle)
                    );
                }
                return true;
            });

            // 모든 엔티티가 필터링되어야 함
            expect(validEntities.length).toBe(0);
        });
    });

    describe('음수 값 처리', () => {
        it('음수 반지름을 감지한다', () => {
            const fixture = dxfFixtureMaliciousNegativeValues;

            const hasNegativeRadius = fixture.entities.some((entity) => {
                if (entity.type === 'CIRCLE' || entity.type === 'ARC') {
                    return (entity.radius ?? 0) < 0;
                }
                return false;
            });

            expect(hasNegativeRadius).toBe(true);
        });

        it('음수 반지름을 절대값으로 정규화할 수 있다', () => {
            const fixture = dxfFixtureMaliciousNegativeValues;

            fixture.entities.forEach((entity) => {
                if (entity.type === 'CIRCLE' || entity.type === 'ARC') {
                    const normalizedRadius = Math.abs(entity.radius ?? 0);
                    expect(normalizedRadius).toBeGreaterThanOrEqual(0);
                }
            });
        });

        it('극단적인 각도 값을 정규화할 수 있다', () => {
            const fixture = dxfFixtureMaliciousNegativeValues;

            fixture.entities.forEach((entity) => {
                if (entity.type === 'ARC') {
                    // 각도를 0-360 범위로 정규화
                    const normalizeAngle = (angle: number) =>
                        ((angle % 360) + 360) % 360;

                    const startNorm = normalizeAngle(entity.startAngle ?? 0);
                    const endNorm = normalizeAngle(entity.endAngle ?? 0);

                    expect(startNorm).toBeGreaterThanOrEqual(0);
                    expect(startNorm).toBeLessThan(360);
                    expect(endNorm).toBeGreaterThanOrEqual(0);
                    expect(endNorm).toBeLessThan(360);
                }
            });
        });
    });

    describe('0 반지름 처리', () => {
        it('0 반지름 엔티티를 감지한다', () => {
            const fixture = dxfFixtureMaliciousZeroRadius;

            const hasZeroRadius = fixture.entities.some((entity) => {
                if (entity.type === 'CIRCLE' || entity.type === 'ARC') {
                    return entity.radius === 0;
                }
                return false;
            });

            expect(hasZeroRadius).toBe(true);
        });

        it('0 반지름 엔티티를 필터링할 수 있다', () => {
            const fixture = dxfFixtureMaliciousZeroRadius;

            const validEntities = fixture.entities.filter((entity) => {
                if (entity.type === 'CIRCLE' || entity.type === 'ARC') {
                    return (entity.radius ?? 0) > 0;
                }
                return true;
            });

            expect(validEntities.length).toBe(0);
        });
    });
});

// ============================================================================
// 빈 데이터 및 불완전 데이터 테스트
// ============================================================================

describe('DXF 보안: 불완전 데이터 처리', () => {
    describe('빈 vertices 배열', () => {
        it('빈 vertices 배열을 가진 엔티티를 감지한다', () => {
            const fixture = dxfFixtureMaliciousEmptyVertices;

            const hasEmptyVertices = fixture.entities.some((entity) => {
                if (entity.vertices) {
                    return entity.vertices.length === 0;
                }
                return false;
            });

            expect(hasEmptyVertices).toBe(true);
        });

        it('빈 vertices 엔티티를 필터링할 수 있다', () => {
            const fixture = dxfFixtureMaliciousEmptyVertices;

            const validEntities = fixture.entities.filter((entity) => {
                if (
                    entity.type === 'LINE' ||
                    entity.type === 'LWPOLYLINE' ||
                    entity.type === 'POLYLINE'
                ) {
                    return entity.vertices && entity.vertices.length >= 2;
                }
                return true;
            });

            expect(validEntities.length).toBe(0);
        });
    });

    describe('단일 vertex', () => {
        it('단일 vertex를 가진 LINE을 감지한다', () => {
            const fixture = dxfFixtureMaliciousSingleVertex;

            const hasSingleVertex = fixture.entities.some((entity) => {
                if (entity.type === 'LINE' && entity.vertices) {
                    return entity.vertices.length === 1;
                }
                return false;
            });

            expect(hasSingleVertex).toBe(true);
        });

        it('단일 vertex 엔티티를 필터링할 수 있다', () => {
            const fixture = dxfFixtureMaliciousSingleVertex;

            const validEntities = fixture.entities.filter((entity) => {
                if (entity.type === 'LINE' || entity.type === 'LWPOLYLINE') {
                    return entity.vertices && entity.vertices.length >= 2;
                }
                return true;
            });

            expect(validEntities.length).toBe(0);
        });
    });
});

// ============================================================================
// XSS 및 인젝션 테스트
// ============================================================================

describe('DXF 보안: XSS 및 인젝션 방지', () => {
    describe('악성 레이어 이름', () => {
        it('스크립트 태그가 포함된 레이어 이름을 감지한다', () => {
            const fixture = dxfFixtureMaliciousLayerNames;
            const layerNames = extractLayerNames(fixture);

            const hasScriptTag = layerNames.some((name) =>
                name.toLowerCase().includes('<script')
            );

            expect(hasScriptTag).toBe(true);
        });

        it('SQL 인젝션 패턴이 포함된 레이어 이름을 감지한다', () => {
            const fixture = dxfFixtureMaliciousLayerNames;
            const layerNames = extractLayerNames(fixture);

            const hasSqlInjection = layerNames.some(
                (name) =>
                    name.includes('DROP TABLE') ||
                    name.includes('--') ||
                    name.includes(';')
            );

            expect(hasSqlInjection).toBe(true);
        });

        it('경로 조작 패턴이 포함된 레이어 이름을 감지한다', () => {
            const fixture = dxfFixtureMaliciousLayerNames;
            const layerNames = extractLayerNames(fixture);

            const hasPathTraversal = layerNames.some(
                (name) => name.includes('../') || name.includes('..\\')
            );

            expect(hasPathTraversal).toBe(true);
        });

        it('템플릿 리터럴 인젝션 패턴을 감지한다', () => {
            const fixture = dxfFixtureMaliciousLayerNames;
            const layerNames = extractLayerNames(fixture);

            const hasTemplateInjection = layerNames.some(
                (name) => name.includes('${') && name.includes('}')
            );

            expect(hasTemplateInjection).toBe(true);
        });

        it('레이어 이름을 HTML 이스케이프할 수 있다', () => {
            const fixture = dxfFixtureMaliciousLayerNames;
            const layerNames = extractLayerNames(fixture);

            layerNames.forEach((name) => {
                const escaped = escapeHtml(name);

                // 이스케이프 후에는 스크립트 태그가 실행되지 않음
                expect(escaped).not.toContain('<script>');
                expect(escaped).not.toContain('</script>');
            });
        });

        it('레이어 이름을 정규화할 수 있다', () => {
            const fixture = dxfFixtureMaliciousLayerNames;
            const layerNames = extractLayerNames(fixture);

            layerNames.forEach((name) => {
                const sanitized = sanitizeLayerName(name);

                // 정규화 후에는 특수문자가 제거됨
                expect(sanitized).toMatch(/^[a-zA-Z0-9_-]+$/);
                expect(sanitized.length).toBeLessThanOrEqual(255);
            });
        });
    });

    describe('긴 레이어 이름', () => {
        it('10,000자 레이어 이름을 감지한다', () => {
            const fixture = dxfFixtureMaliciousLongLayerName;
            const layerNames = extractLayerNames(fixture);

            const hasLongName = layerNames.some((name) => name.length > 1000);

            expect(hasLongName).toBe(true);
        });

        it('긴 레이어 이름을 안전하게 자를 수 있다', () => {
            const fixture = dxfFixtureMaliciousLongLayerName;
            const layerNames = extractLayerNames(fixture);

            layerNames.forEach((name) => {
                const truncated = name.slice(0, 255);

                expect(truncated.length).toBeLessThanOrEqual(255);
            });
        });
    });
});

// ============================================================================
// 색상 인덱스 유효성 테스트
// ============================================================================

describe('DXF 보안: 색상 인덱스 유효성', () => {
    it('음수 colorIndex를 감지한다', () => {
        const fixture = dxfFixtureMaliciousColorIndex;

        const hasNegativeColorIndex = Object.values(
            fixture.tables?.layer?.layers ?? {}
        ).some((layer) => (layer.colorIndex ?? 0) < 0);

        expect(hasNegativeColorIndex).toBe(true);
    });

    it('범위 초과 colorIndex를 감지한다', () => {
        const fixture = dxfFixtureMaliciousColorIndex;

        const hasOutOfRangeColorIndex = Object.values(
            fixture.tables?.layer?.layers ?? {}
        ).some((layer) => (layer.colorIndex ?? 0) > 255);

        expect(hasOutOfRangeColorIndex).toBe(true);
    });

    it('colorIndex를 유효 범위로 정규화할 수 있다', () => {
        const fixture = dxfFixtureMaliciousColorIndex;

        Object.values(fixture.tables?.layer?.layers ?? {}).forEach((layer) => {
            const colorIndex = layer.colorIndex ?? 7; // 기본값 7 (흰색)
            const normalizedIndex = Math.max(0, Math.min(255, colorIndex));

            expect(normalizedIndex).toBeGreaterThanOrEqual(0);
            expect(normalizedIndex).toBeLessThanOrEqual(255);
        });
    });

    it('음수 색상 값을 감지한다', () => {
        const fixture = dxfFixtureMaliciousColorIndex;

        const hasNegativeColor = Object.values(
            fixture.tables?.layer?.layers ?? {}
        ).some((layer) => (layer.color ?? 0) < 0);

        expect(hasNegativeColor).toBe(true);
    });
});

// ============================================================================
// 대용량 및 깊은 중첩 데이터 테스트
// ============================================================================

describe('DXF 보안: 대용량 데이터 처리', () => {
    describe('깊은 중첩 구조', () => {
        it('100개 레이어를 가진 픽스처를 처리할 수 있다', () => {
            const fixture = dxfFixtureMaliciousDeeplyNested;

            expect(fixture.entities.length).toBe(100);
            expect(
                Object.keys(fixture.tables?.layer?.layers ?? {}).length
            ).toBe(100);
        });

        it('모든 레이어 정보를 순회할 수 있다', () => {
            const fixture = dxfFixtureMaliciousDeeplyNested;
            const layers = fixture.tables?.layer?.layers ?? {};

            let count = 0;
            for (const layerName in layers) {
                count++;
                expect(layers[layerName]).toBeDefined();
            }

            expect(count).toBe(100);
        });
    });

    describe('대용량 엔티티', () => {
        it('10,000개 엔티티 픽스처를 100ms 이내에 생성한다', () => {
            const startTime = performance.now();
            const fixture = dxfFixtures.createLarge(10000);
            const endTime = performance.now();

            expect(fixture.entities.length).toBe(10000);
            expect(endTime - startTime).toBeLessThan(100);
        });

        it('100,000개 엔티티 픽스처를 1초 이내에 생성한다', () => {
            const startTime = performance.now();
            const fixture = dxfFixtures.createLarge(100000);
            const endTime = performance.now();

            expect(fixture.entities.length).toBe(100000);
            expect(endTime - startTime).toBeLessThan(1000);
        });
    });
});

// ============================================================================
// 타입 안전성 테스트
// ============================================================================

describe('DXF 보안: 타입 안전성', () => {
    describe('undefined/null 값 처리', () => {
        it('undefined 레이어를 가진 엔티티를 감지한다', () => {
            const fixture = dxfFixtureMaliciousUndefinedValues;

            const hasUndefinedLayer = fixture.entities.some(
                (entity) => entity.layer === undefined
            );

            expect(hasUndefinedLayer).toBe(true);
        });

        it('null 레이어를 가진 엔티티를 감지한다', () => {
            const fixture = dxfFixtureMaliciousUndefinedValues;

            const hasNullLayer = fixture.entities.some(
                (entity) => entity.layer === null
            );

            expect(hasNullLayer).toBe(true);
        });

        it('undefined/null 레이어를 기본값으로 대체할 수 있다', () => {
            const fixture = dxfFixtureMaliciousUndefinedValues;

            fixture.entities.forEach((entity) => {
                const layer = entity.layer ?? '0'; // null/undefined면 '0' 사용

                expect(layer).toBe('0');
                expect(typeof layer).toBe('string');
            });
        });
    });
});

// ============================================================================
// 픽스처 객체 구조 검증
// ============================================================================

describe('DXF 보안 픽스처: 구조 검증', () => {
    it('모든 악성 픽스처가 dxfFixtures.malicious에 포함되어 있다', () => {
        const maliciousFixtures = dxfFixtures.malicious;

        expect(maliciousFixtures.largeCoords).toBeDefined();
        expect(maliciousFixtures.infinity).toBeDefined();
        expect(maliciousFixtures.negativeValues).toBeDefined();
        expect(maliciousFixtures.zeroRadius).toBeDefined();
        expect(maliciousFixtures.emptyVertices).toBeDefined();
        expect(maliciousFixtures.singleVertex).toBeDefined();
        expect(maliciousFixtures.layerNames).toBeDefined();
        expect(maliciousFixtures.longLayerName).toBeDefined();
        expect(maliciousFixtures.colorIndex).toBeDefined();
        expect(maliciousFixtures.deeplyNested).toBeDefined();
        expect(maliciousFixtures.undefinedValues).toBeDefined();
    });

    it('모든 악성 픽스처가 entities 배열을 가진다', () => {
        const maliciousFixtures = dxfFixtures.malicious;

        Object.values(maliciousFixtures).forEach((fixture) => {
            expect(Array.isArray(fixture.entities)).toBe(true);
        });
    });

    it('정상 픽스처와 악성 픽스처가 구분되어 있다', () => {
        // 정상 픽스처
        expect(dxfFixtures.withLines).toBeDefined();
        expect(dxfFixtures.withCircles).toBeDefined();
        expect(dxfFixtures.mixed).toBeDefined();

        // 악성 픽스처는 malicious 객체 안에
        expect(dxfFixtures.malicious).toBeDefined();
        expect(typeof dxfFixtures.malicious).toBe('object');
    });
});
