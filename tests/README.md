# Test Infrastructure Guide

> **Version**: 0.0.0
> **Last Updated**: 2025-12-22

테스트 인프라 구조, 모킹 패턴, 실행 방법 가이드

---

## 디렉토리 구조

```
tests/
├── mocks/                    # 공유 Mock 구현체
│   ├── index.ts              # 배럴 export
│   ├── three.tsx             # React Three Fiber/Three.js Mock
│   ├── worker.ts             # WebWorker Mock
│   └── dxf-parser/           # DXF 파싱 Mock
│       ├── index.ts
│       ├── types.ts          # 타입 정의
│       ├── fixtures.ts       # 테스트 픽스처
│       └── mock-config.ts    # Mock 설정
├── integration/              # 통합 테스트
│   └── dxf-pipeline.test.ts  # DXF 파이프라인 테스트
├── scripts/                  # 유틸리티 스크립트
│   ├── generate-test-dxf.cjs # 테스트 DXF 파일 생성
│   └── perf-test-dxf.cjs     # 성능 벤치마킹
└── setup/                    # 테스트 설정
    ├── vitest-setup.ts       # 전역 설정
    └── test-utils.tsx        # 커스텀 렌더러

src/**/__tests__/             # 코로케이션 단위 테스트 (~35 파일)
```

---

## Mock 사용법

### 1. Three.js/R3F Mock

React Three Fiber 컴포넌트 테스트용 Mock

```typescript
import { setupR3FMocks, clearThreeMocks } from '@tests/mocks';

beforeEach(() => {
    setupR3FMocks();
});

afterEach(() => {
    clearThreeMocks();
});
```

**제공 Mock:**

- `Canvas` - R3F Canvas 컴포넌트
- `useFrame`, `useThree` - R3F 훅
- `OrbitControls`, `Line`, `Html` - drei 컴포넌트

### 2. WebWorker Mock

Worker 통신 시뮬레이션용 Mock

```typescript
import {
    MockWorker,
    createMockWorker,
    getCurrentMockWorker,
    simulateWorkerSuccess,
    simulateWorkerError,
    clearWorkerMock,
} from '@tests/mocks';

describe('Worker tests', () => {
    beforeEach(() => {
        vi.stubGlobal('Worker', MockWorker);
    });

    afterEach(() => {
        clearWorkerMock();
        vi.unstubAllGlobals();
    });

    it('성공 메시지 시뮬레이션', () => {
        const worker = getCurrentMockWorker();
        simulateWorkerSuccess(worker!, mockData);
    });

    it('에러 메시지 시뮬레이션', () => {
        const worker = getCurrentMockWorker();
        simulateWorkerError(worker!, 'PARSE_ERROR', '파싱 실패');
    });
});
```

### 3. DXF Parser Mock

DXF 파싱 결과 Mock 및 테스트 픽스처

```typescript
import {
    setParseSuccess,
    setParseFailure,
    setParseException,
    resetMockDxfParser,
    dxfFixtureWithLines,
    dxfFixtureWithCircles,
    dxfFixtureMixed,
    createLargeDxfFixture,
} from '@tests/mocks';

beforeEach(() => {
    resetMockDxfParser();
});

it('파싱 성공 테스트', () => {
    setParseSuccess(dxfFixtureWithLines);
    // ... 테스트 코드
});

it('파싱 실패 테스트', () => {
    setParseFailure();
    // ... 테스트 코드
});

it('대용량 테스트', () => {
    const fixture = createLargeDxfFixture(10000);
    setParseSuccess(fixture);
    // ... 테스트 코드
});
```

**제공 픽스처:**
| 픽스처 | 설명 |
|--------|------|
| `dxfFixtureWithLines` | LINE 엔티티 3개 |
| `dxfFixtureWithCircles` | CIRCLE 엔티티 2개 |
| `dxfFixtureWithArcs` | ARC 엔티티 2개 |
| `dxfFixtureWithPolylines` | POLYLINE/LWPOLYLINE 2개 |
| `dxfFixtureMixed` | 모든 타입 혼합 |
| `dxfFixtureEmpty` | 빈 엔티티 목록 |
| `dxfFixtureUnsupportedOnly` | 지원하지 않는 엔티티만 |
| `dxfFixtureNoLayerTable` | 레이어 테이블 없음 |

---

## 테스트 유틸리티

### Custom Render

React Query + Router Provider가 포함된 커스텀 렌더러

```typescript
import { render, createTestQueryClient } from '@tests/setup/test-utils';

it('컴포넌트 렌더링', () => {
    const { getByText } = render(<MyComponent />);
    expect(getByText('Hello')).toBeInTheDocument();
});
```

### 테스트 파일 생성

```typescript
import { createTestFile, createTestDXFFile } from '@tests/setup/test-utils';

it('파일 업로드 테스트', () => {
    const file = createTestFile('test.txt', 'content', 'text/plain');
    const dxfFile = createTestDXFFile('drawing.dxf');
    // ... 테스트 코드
});
```

---

## 테스트 실행

### 기본 명령어

```bash
# 전체 테스트 실행
npm test

# Watch 모드
npm run test:watch

# 커버리지 리포트
npm run test:coverage

# UI 모드 (Vitest UI)
npm run test:ui
```

### 특정 테스트 실행

```bash
# 특정 파일
npm test -- tests/integration/dxf-pipeline.test.ts

# 패턴 매칭
npm test -- --grep "DXF"

# 특정 디렉토리
npm test -- src/features/CadViewer
```

### 디버깅

```bash
# 단일 테스트 실행 (watch 없이)
npm test -- tests/integration/dxf-pipeline.test.ts --run

# Verbose 출력
npm test -- --reporter=verbose
```

---

## 커버리지 기준

| 메트릭     | 임계값 | 설명             |
| ---------- | ------ | ---------------- |
| Statements | 40%    | 실행된 구문 비율 |
| Branches   | 50%    | 분기 커버리지    |
| Functions  | 50%    | 함수 커버리지    |
| Lines      | 40%    | 라인 커버리지    |

**제외 패턴:**

- `**/index.ts` - 배럴 export
- `**/*.d.ts` - 타입 정의
- `**/types.ts`, `**/types/**` - 타입 파일
- `**/constants.ts` - 상수 정의

---

## 테스트 작성 가이드

### 1. 파일 명명 규칙

```
ComponentName.test.tsx   # 컴포넌트 테스트
hookName.test.ts         # 훅 테스트
utils.test.ts            # 유틸리티 테스트
```

### 2. 테스트 구조

```typescript
describe('ComponentName', () => {
    // Setup
    beforeEach(() => {
        // Mock 초기화
    });

    afterEach(() => {
        // Cleanup
    });

    describe('기능 그룹', () => {
        it('기대 동작 설명', () => {
            // Arrange
            // Act
            // Assert
        });
    });
});
```

### 3. Best Practices

1. **Mock 초기화**: `beforeEach`에서 Mock 초기화, `afterEach`에서 정리
2. **격리된 테스트**: 각 테스트는 독립적으로 실행 가능해야 함
3. **명확한 설명**: 테스트 이름에 기대 동작 명시
4. **AAA 패턴**: Arrange → Act → Assert 구조 유지
5. **Edge Case**: 정상 케이스뿐 아니라 엣지 케이스도 테스트

### 4. 비동기 테스트

```typescript
it('비동기 데이터 로딩', async () => {
    render(<AsyncComponent />);

    // 로딩 상태 확인
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // 데이터 로딩 대기
    await waitFor(() => {
        expect(screen.getByText('Data loaded')).toBeInTheDocument();
    });
});
```

---

## 스크립트 사용법

### 테스트 DXF 생성

```bash
node tests/scripts/generate-test-dxf.cjs [output-path] [entity-count]

# 예시
node tests/scripts/generate-test-dxf.cjs ./test-files/large.dxf 10000
```

### 성능 테스트

```bash
node tests/scripts/perf-test-dxf.cjs [dxf-file-path]

# 예시
node tests/scripts/perf-test-dxf.cjs ./public/samples/dxf/floor-plan.dxf
```

---

## 알려진 제한사항

### Worker 테스트 제한

`import.meta.url`이 jsdom 환경에서 동작하지 않아 실제 Worker 인스턴스 생성이 불가합니다.

**해결 방법:**

- MockWorker를 통한 메시지 시뮬레이션
- E2E 테스트에서 실제 Worker 통신 검증

### WebGL Mock 제한

현재 Canvas Mock은 2D 컨텍스트만 지원합니다. WebGLRenderingContext는 완전히 Mock되지 않습니다.

**권장 사항:**

- Three.js 렌더링 로직은 E2E 테스트에서 검증
- 비즈니스 로직은 렌더링과 분리하여 단위 테스트

---

## Changelog (변경 이력)

| 버전  | 날짜       | 변경 내용      |
| ----- | ---------- | -------------- |
| 0.0.0 | 2025-12-22 | 초기 문서 생성 |
