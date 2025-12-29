/**
 * DXF Parser Mock - Barrel Export
 *
 * DXF 파싱 테스트를 위한 모킹 유틸리티
 *
 * @example
 * ```typescript
 * import {
 *     setParseSuccess,
 *     dxfFixtureWithLines,
 *     resetMockDxfParser,
 * } from '@tests/mocks/dxf-parser';
 *
 * beforeEach(() => {
 *     resetMockDxfParser();
 * });
 *
 * it('parses lines correctly', () => {
 *     setParseSuccess(dxfFixtureWithLines);
 *     // ... test code
 * });
 * ```
 */

// Types
export type { DxfParseResult, MockDxfParserConfig } from './types';

// Mock Configuration
export {
    mockDxfParserConfig,
    resetMockDxfParser,
    setParseSuccess,
    setParseFailure,
    setParseException,
} from './mock-config';

// Fixtures
export {
    // 개별 픽스처
    dxfFixtureWithLines,
    dxfFixtureWithCircles,
    dxfFixtureWithArcs,
    dxfFixtureWithPolylines,
    dxfFixtureMixed,
    dxfFixtureEmpty,
    dxfFixtureUnsupportedOnly,
    dxfFixtureNoLayerTable,
    // 동적 생성기
    createLargeDxfFixture,
    // 편의 객체
    dxfFixtures,
} from './fixtures';
