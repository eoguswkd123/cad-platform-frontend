/**
 * Tests Mocks - Barrel Export
 *
 * 테스트에서 사용하는 모든 mock 모듈의 중앙 집중식 export
 *
 * @example
 * ```typescript
 * import { setupR3FMocks, resetMockWorker, dxfFixtures } from '@tests/mocks';
 * ```
 */

// Three.js & React Three Fiber Mocks
export {
    setupR3FMocks,
    mockThreeCore,
    setupAllThreeMocks,
    clearThreeMocks,
} from './three';

// DXF Parser Mocks & Fixtures
export {
    // Mock 설정
    mockDxfParserConfig,
    resetMockDxfParser,
    setParseSuccess,
    setParseFailure,
    setParseException,
    // 픽스처
    dxfFixtureWithLines,
    dxfFixtureWithCircles,
    dxfFixtureWithArcs,
    dxfFixtureWithPolylines,
    dxfFixtureMixed,
    dxfFixtureEmpty,
    dxfFixtureUnsupportedOnly,
    dxfFixtureNoLayerTable,
    createLargeDxfFixture,
    dxfFixtures,
    // 타입
    type DxfParseResult,
} from './dxf-parser';

// Worker Mocks
export {
    // MockWorker 클래스
    MockWorker,
    // Worker 인스턴스 관리
    createMockWorker,
    getCurrentMockWorker,
    resetMockWorker,
    // 메시지 시뮬레이션
    simulateWorkerSuccess,
    simulateWorkerError,
    simulateWorkerProgress,
    simulateWorkerRuntimeError,
    // 페이로드 생성
    createSuccessPayload,
    // 글로벌 설정
    setupWorkerMock,
    clearWorkerMock,
    // 타입
    type WorkerSuccessPayload,
    type WorkerProgressPayload,
    type WorkerErrorPayload,
    type WorkerResponseType,
} from './worker';
