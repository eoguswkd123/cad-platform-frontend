# Architecture

> CAD Viewer 프로젝트의 시스템 아키텍처와 패키지 구조를 설명합니다.

## 목차

- [전체 시스템 흐름](#전체-시스템-흐름)
- [아키텍처 개요](#아키텍처-개요)
- [패키지 구조](#패키지-구조)
- [레이어별 역할](#레이어별-역할)

---

## 전체 시스템 흐름

CAD 도면 → 3D 건축물 뷰어 데이터 플로우

```
                            <<< [1] Upload DXF >>>
                                     |
                                     v
+---------------+            +------------------+            +------------------+
|   FRONTEND    |            |     BACKEND      |            |   FILE SERVER    |
|   - - - - -   |            |   - - - - - -    |            |   - - - - - -    |
|               |            |                  |            |                  |
| +-----------+ |   [2]      | +------------+   |   [3]      | +------------+   |
| |  Upload   |===========>>>| |  Analyze   |===============>| | DXF File   |   |
| |   DXF     | |  Request   | |    DXF     |   |  Request   | +------------+   |
| +-----------+ |            | +-----+------+   |            |       |          |
|               |            |       ^         |   [4]       |       |          |
+---------------+            |       |         |<<<================= |          |
                             |       | [5]     |  Download   |                  |
                             |       | Parse   |            | +------------+   |
                             |       |         |   [6]      | | 3D File    |   |
                             | +-----v------+  |   Save     | | (JSON)     |   |
                             | |  3D Model  |===============>| +-----+------+   |
                             | |  Generate  |  |            |       |          |
                             | +------------+  |            +-------|----------+
                             +------------------+                   |
                                                                    |
                                                                    |
                                                        <<< [7] Download >>>
                                                                    |
+-------------------------------------------------------------------|----------+
|   KIOSK                                                           v          |
|                                                                              |
|          +------------------+                         +------------------+   |
|          |   3D Rendering   |                         |    Download      |   |
|          |    (Three.js)    |<========================|    3D File       |   |
|          +------------------+                         +------------------+   |
|                                                                              |
+------------------------------------------------------------------------------+
```

### 단계별 설명

| 단계 | 위치 | 설명 |
|------|------|------|
| **[1] Upload** | 프론트엔드 | 사용자가 DXF 파일 업로드 |
| **[2] Request** | 프론트엔드 → 백엔드 | 도면 생성 요청 |
| **[3] Request** | 백엔드 → 첨부파일서버 | 원본 도면 파일 요청 |
| **[4] Download** | 첨부파일서버 → 백엔드 | 도면 파일 다운로드 |
| **[5] Parse** | 백엔드 | DXF 파싱 |
| **[6] Save** | 백엔드 → 첨부파일서버 | 3D JSON 파일 저장 |
| **[7] Download** | 첨부파일서버 → 키오스크 | 파싱된 3D 데이터 다운로드 |
| **Render** | 키오스크 | Three.js로 3D 시각화 |

---

## 아키텍처 개요

Layer-Based Architecture를 채택하여 관심사 분리와 의존성 방향을 명확히 합니다.

```
Pages → Features → Services → Types
         ↓
      Components
         ↓
       Stores
```

## 패키지 구조

```
src/
├── api/                   # API 레이어
│   └── apiCaller.ts       # Axios 인스턴스
│
├── assets/                # 정적 리소스
│   └── (images, fonts)
│
├── components/            # 공통 컴포넌트
│   ├── Layout/            # 레이아웃 (MainLayout, SideBar, Footer)
│   └── common/            # 공통 UI (Button, Input, Toast, Modal)
│
├── config/                # 전역 설정
│   └── index.ts           # APP, ENV, UPLOAD, SYNC 설정
│
├── constants/             # 상수
│   ├── app.ts             # 앱 상수
│   ├── routes.ts          # 라우트 경로
│   └── menu.ts            # 메뉴 설정
│
├── features/              # 도메인 기능 모듈
│   ├── three-core/        # Three.js 베이스 엔진
│   │   ├── components/    # Scene, 기본 도형
│   │   ├── config/        # Three.js 설정
│   │   ├── hooks/         # useThree
│   │   └── utils/         # 순수 함수 (React 없음, 10줄 이하, 선택)
│   │
│   ├── cad-renderer/      # CAD 3D 렌더링
│   │   ├── components/    # CadScene, CadMesh, LayerPanel
│   │   └── hooks/         # useCADLoader, useSelection
│   │
│   ├── cad-processor/     # CAD 데이터 처리
│   │   ├── parser/        # DXF 파싱
│   │   ├── converter/     # 2D→3D 변환
│   │   └── hooks/         # useParser, useConverter
│   │
│   └── sync/              # 동기화 기능
│       ├── components/
│       └── hooks/
│
├── hooks/                 # 전역 훅
│   └── useSync.ts         # 동기화 훅 (여러 feature에서 사용)
│
├── locales/               # 다국어
│   ├── ko.json
│   └── en.json
│
├── pages/                 # 페이지 컴포넌트
│   ├── CadViewer/         # CAD 뷰어 페이지
│   ├── KioskDisplay/      # 키오스크 디스플레이
│   └── ThreeDemo/         # Three.js 데모
│
├── routes/                # 라우팅
│   └── root.tsx
│
├── services/              # 복잡한 로직 (React 없음, 클래스/엔진, 10줄 이상)
│   ├── common/            # 전역 공유 로직
│   │   ├── storage/       # 로컬스토리지, IndexedDB 래퍼
│   │   ├── cache/         # 캐싱 엔진
│   │   └── validator/     # 복잡한 검증 로직
│   │
│   ├── cad/               # CAD 처리
│   │   ├── parser/        # DXF 파싱
│   │   └── converter/     # Three.js 변환
│   │
│   └── sync/              # 동기화 엔진
│       ├── transports/    # WebSocket, WebRTC
│       └── SyncEngine.ts
│
├── utils/                 # 순수 함수 (React 없음, 10줄 이하)
│   ├── format.ts          # 포맷팅 (파일크기, 날짜)
│   ├── validation.ts      # 검증 (파일, 이메일)
│   └── async.ts           # 비동기 (debounce, throttle)
│
├── stores/                # Zustand 상태 관리
│   ├── cadStore.ts        # CAD 상태
│   ├── viewerStore.ts     # 뷰어 상태
│   └── syncStore.ts       # 동기화 상태
│
├── styles/                # 전역 스타일
│   └── global.css
│
└── types/                 # 타입 정의
    ├── cad.ts
    ├── viewer.ts
    └── sync.ts
```

## 레이어별 역할

| 레이어 | 역할 | 의존성 |
|--------|------|--------|
| `api/` | API 통신 레이어 (Axios 인스턴스) | config |
| `assets/` | 정적 리소스 (이미지, 폰트) | - |
| `components/` | 공통 재사용 UI (Layout, Button, Modal) | - |
| `config/` | 전역 설정 (APP, ENV, UPLOAD) | - |
| `constants/` | 상수 정의 (routes, menu, app) | - |
| `features/` | 도메인 기능 모듈 (components, hooks, utils) | services, stores |
| `hooks/` | 전역 훅 (여러 feature에서 공유) | stores, services |
| `locales/` | 다국어 리소스 (ko, en) | - |
| `pages/` | 페이지 조합 (라우트별) | features, components |
| `routes/` | 라우팅 설정 | pages |
| `services/` | 복잡한 로직 (React 없음, 클래스/엔진, 10줄 이상) | types만 |
| `stores/` | Zustand 전역 상태 | types만 |
| `styles/` | 전역 스타일 (CSS) | - |
| `types/` | 타입/인터페이스 정의 | - |
| `utils/` | 순수 함수 (React 없음, 10줄 이하) | - |

---

## 관련 문서

| 문서 | 설명 |
|------|------|
| [ROADMAP.md](./ROADMAP.md) | 개발 일정 및 마일스톤 |
| [DEV_GUIDE.md](./DEV_GUIDE.md) | 개발 가이드 및 컨벤션 |
| [GIT_CONVENTIONS.md](./GIT_CONVENTIONS.md) | Git 워크플로우 및 커밋 규칙 |
