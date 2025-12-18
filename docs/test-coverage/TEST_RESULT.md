# 테스트 커버리지 결과

> **Version**: 0.0.2
> **Last Updated**: 2025-12-18

---

## 용어 설명

### 커버리지 메트릭 컬럼 정의 (Vitest v8)

| 컬럼         | 전체 명칭          | 설명                                         |
| ------------ | ------------------ | -------------------------------------------- |
| **% Stmts**  | Statement Coverage | 실행된 코드 문장(statement) 비율             |
| **% Branch** | Branch Coverage    | 조건 분기 커버리지 (if/else, 삼항 연산자 등) |
| **% Funcs**  | Function Coverage  | 호출된 함수 비율                             |
| **% Lines**  | Line Coverage      | 실행된 코드 라인 비율                        |

### Uncovered Lines 표기법

| 표기  | 의미                    | 예시                            |
| ----- | ----------------------- | ------------------------------- |
| `N`   | 라인 N이 실행되지 않음  | `63` → 63번 라인 미실행         |
| `N-M` | 라인 N부터 M까지 미실행 | `92-102` → 92~102번 라인 미실행 |

---

## 문서 규칙

- 번호 형식: `N. YYYY-MM-DD M차 (총 X건) 커버율 XX.XX%`
- 같은 날 추가 테스트: `N-2`, `N-3` 형식으로 서브 넘버링

---

## 1. 2025-12-16 1-1차 (총 120건) Line 커버율 24.18%

> Phase 1.1.2 CI/CD 테스트 통합 완료 후 상태

```
No.  Name                                                      % Stmts  % Branch  % Funcs  % Lines   Uncovered
--------------------------------------------------------------------------------------------------------------
1    src/App.tsx                                                    0         0        0        0   1-38
2    src/api/apiCaller.ts                                           0       100      100        0   6-14
3    src/components/Layout/Footer.tsx                               0         0        0        0   1-14
4    src/components/Layout/MainLayout.tsx                           0         0        0        0   1-28
5    src/components/Layout/SideBar.tsx                              0         0        0        0   1-35
6    src/components/Layout/SideBarMenuItem.tsx                      0         0        0        0   1-34
7    src/config/api.ts                                              0       100      100        0   5-11
8    src/constants/app.ts                                           0       100      100        0   4-9
9    src/constants/menu.ts                                          0         0        0        0   1-32
10   src/constants/routes.ts                                        0         0        0        0   1-6
11   src/features/CadViewer/components/CadControls.tsx              0       100      100        0   9-128
12   src/features/CadViewer/components/CadErrorBoundary.tsx         0       100      100        0   6-114
13   src/features/CadViewer/components/CadMesh.tsx                  0       100      100        0   9-198
14   src/features/CadViewer/components/CadScene.tsx                 0       100      100        0   10-224
15   src/features/CadViewer/components/FileUpload.tsx               0       100      100        0   9-234
16   src/features/CadViewer/components/LayerPanel.tsx               0       100      100        0   9-105
17   src/features/CadViewer/hooks/useDXFParser.ts               21.76      37.5      100    21.76   60-61,64-148...
18   src/features/CadViewer/hooks/useDXFWorker.ts               29.77        75      100    29.77   49-51,63-65...
19   src/features/CadViewer/utils/dxfToGeometry.ts                100       100      100      100
20   src/features/CadViewer/utils/validators.ts                   100       100      100      100
21   src/features/CadViewer/workers/dxfParserV2.worker.ts           0       100      100        0   7-353
22   src/features/TeapotDemo/components/TeapotControls.tsx          0       100      100        0   5-140
23   src/features/TeapotDemo/components/TeapotMesh.tsx              0       100      100        0   5-97
24   src/features/TeapotDemo/components/TeapotScene.tsx             0       100      100        0   5-93
25   src/features/TeapotDemo/hooks/useTeapotMaterial.ts           100       100      100      100
26   src/features/WorkerViewer/components/ModelSelector.tsx         0       100      100        0   6-122
27   src/features/WorkerViewer/components/WorkerControls.tsx        0       100      100        0   6-140
28   src/features/WorkerViewer/components/WorkerErrorBoundary.tsx   0       100      100        0   6-114
29   src/features/WorkerViewer/components/WorkerMesh.tsx            0       100      100        0   6-89
30   src/features/WorkerViewer/components/WorkerScene.tsx           0       100      100        0   6-154
31   src/features/WorkerViewer/hooks/useWorkerModel.ts          95.23     96.87      100    95.23   25-29
32   src/features/WorkerViewer/services/workerService.ts        98.03        80      100    98.03   102
33   src/pages/CadViewer/index.tsx                                  0       100      100        0   6-16
34   src/pages/Home/DemoCard.tsx                                    0         0        0        0   1-47
35   src/pages/Home/index.tsx                                       0       100      100        0   5-77
36   src/pages/TeapotDemo/index.tsx                                 0       100      100        0   5-13
37   src/pages/WorkerViewer/index.tsx                               0       100      100        0   6-21
38   src/routes/root.tsx                                            0         0        0        0   1-38
39   src/types/menu.ts                                              0         0        0        0
--------------------------------------------------------------------------------------------------------------
TOTAL (39 files)                                                24.18     89.20    84.74    24.18
```

---

## 2. 2025-12-17 2-1차 (총 120건) Line 커버율 23.11%

> 테스트 인프라 개선 - Worker/DXF Parser 모킹 추가

```
No.  Name                                                      % Stmts  % Branch  % Funcs  % Lines   Uncovered
--------------------------------------------------------------------------------------------------------------
1    src/App.tsx                                                    0         0        0        0   1-38
2    src/api/apiCaller.ts                                           0       100      100        0   6-14
3    src/components/Layout/Footer.tsx                               0         0        0        0   1-14
4    src/components/Layout/MainLayout.tsx                           0         0        0        0   1-28
5    src/components/Layout/SideBar.tsx                              0         0        0        0   1-35
6    src/components/Layout/SideBarMenuItem.tsx                      0         0        0        0   1-34
7    src/components/ViewerControlPanel/GridToggle.tsx               0       100      100        0   7-47
8    src/components/ViewerControlPanel/RotateToggle.tsx             0       100      100        0   7-47
9    src/components/ViewerControlPanel/SpeedSlider.tsx              0       100      100        0   7-53
10   src/components/ViewerControlPanel/ViewerActionButtons.tsx      0       100      100        0   7-57
11   src/config/api.ts                                              0       100      100        0   5-11
12   src/constants/app.ts                                           0       100      100        0   4-9
13   src/constants/menu.ts                                          0         0        0        0   1-32
14   src/constants/routes.ts                                        0         0        0        0   1-6
15   src/features/CadViewer/components/CADControls.tsx              0       100      100        0   9-134
16   src/features/CadViewer/components/CADMesh.tsx                  0       100      100        0   9-195
17   src/features/CadViewer/components/CADScene.tsx                 0       100      100        0   10-225
18   src/features/CadViewer/components/CadErrorBoundary.tsx         0       100      100        0   6-114
19   src/features/CadViewer/components/FileUpload.tsx               0       100      100        0   9-239
20   src/features/CadViewer/components/LayerPanel.tsx               0       100      100        0   9-105
21   src/features/CadViewer/hooks/useDXFParser.ts               21.76      37.5      100    21.76   60-61,64-148...
22   src/features/CadViewer/hooks/useDXFWorker.ts               29.77        75      100    29.77   49-51,63-65...
23   src/features/CadViewer/utils/dxfToGeometry.ts                100       100      100      100
24   src/features/CadViewer/utils/validators.ts                   100       100      100      100
25   src/features/CadViewer/workers/dxfParserV2.worker.ts           0       100      100        0   7-353
26   src/features/TeapotDemo/components/TeapotControls.tsx          0       100      100        0   5-140
27   src/features/TeapotDemo/components/TeapotMesh.tsx              0       100      100        0   5-97
28   src/features/TeapotDemo/components/TeapotScene.tsx             0       100      100        0   5-93
29   src/features/TeapotDemo/hooks/useTeapotMaterial.ts           100       100      100      100
30   src/features/WorkerViewer/components/ModelSelector.tsx         0       100      100        0   6-122
31   src/features/WorkerViewer/components/WorkerControls.tsx        0       100      100        0   6-113
32   src/features/WorkerViewer/components/WorkerErrorBoundary.tsx   0       100      100        0   6-114
33   src/features/WorkerViewer/components/WorkerMesh.tsx            0       100      100        0   6-89
34   src/features/WorkerViewer/components/WorkerScene.tsx           0       100      100        0   6-154
35   src/features/WorkerViewer/hooks/useWorkerModel.ts          95.23     96.87      100    95.23   25-29
36   src/features/WorkerViewer/services/workerService.ts        98.03        80      100    98.03   102
37   src/pages/CadViewer/index.tsx                                  0       100      100        0   6-16
38   src/pages/Home/DemoCard.tsx                                    0         0        0        0   1-47
39   src/pages/Home/index.tsx                                       0       100      100        0   5-77
40   src/pages/TeapotDemo/index.tsx                                 0       100      100        0   5-13
41   src/pages/WorkerViewer/index.tsx                               0       100      100        0   6-21
42   src/routes/root.tsx                                            0         0        0        0   1-38
43   src/types/menu.ts                                              0         0        0        0
--------------------------------------------------------------------------------------------------------------
TOTAL (43 files)                                                23.11     89.44    85.71    23.11
```

## 3. 2025-12-17 2-2차 (총 167건) Line 커버율 28.10%

> ViewerControlPanel 컴포넌트 테스트 추가 (0% → 100%)

```
No.  Name                                                      % Stmts  % Branch  % Funcs  % Lines   Uncovered
--------------------------------------------------------------------------------------------------------------
1    src/App.tsx                                                    0         0        0        0   1-38
2    src/api/apiCaller.ts                                           0       100      100        0   6-14
3    src/components/Layout/Footer.tsx                               0         0        0        0   1-14
4    src/components/Layout/MainLayout.tsx                           0         0        0        0   1-28
5    src/components/Layout/SideBar.tsx                              0         0        0        0   1-35
6    src/components/Layout/SideBarMenuItem.tsx                      0         0        0        0   1-34
7    src/components/ViewerControlPanel/GridToggle.tsx             100       100      100      100
8    src/components/ViewerControlPanel/RotateToggle.tsx           100       100      100      100
9    src/components/ViewerControlPanel/SpeedSlider.tsx            100       100      100      100
10   src/components/ViewerControlPanel/ViewerActionButtons.tsx    100       100      100      100
11   src/config/api.ts                                              0       100      100        0   5-11
12   src/constants/app.ts                                           0       100      100        0   4-9
13   src/constants/menu.ts                                          0         0        0        0   1-32
14   src/constants/routes.ts                                        0         0        0        0   1-6
15   src/features/CadViewer/components/CadControls.tsx              0       100      100        0   9-134
16   src/features/CadViewer/components/CadErrorBoundary.tsx         0       100      100        0   6-114
17   src/features/CadViewer/components/CadMesh.tsx                  0       100      100        0   9-195
18   src/features/CadViewer/components/CadScene.tsx                 0       100      100        0   10-225
19   src/features/CadViewer/components/FileUpload.tsx               0       100      100        0   9-239
20   src/features/CadViewer/components/LayerPanel.tsx               0       100      100        0   9-105
21   src/features/CadViewer/hooks/useDXFParser.ts               21.76      37.5      100    21.76   60-61,64-148...
22   src/features/CadViewer/hooks/useDXFWorker.ts               29.77        75      100    29.77   49-51,63-65...
23   src/features/CadViewer/utils/dxfToGeometry.ts                100       100      100      100
24   src/features/CadViewer/utils/validators.ts                   100       100      100      100
25   src/features/CadViewer/workers/dxfParserV2.worker.ts           0       100      100        0   7-353
26   src/features/TeapotDemo/components/TeapotControls.tsx          0       100      100        0   5-140
27   src/features/TeapotDemo/components/TeapotMesh.tsx              0       100      100        0   5-97
28   src/features/TeapotDemo/components/TeapotScene.tsx             0       100      100        0   5-93
29   src/features/TeapotDemo/hooks/useTeapotMaterial.ts           100       100      100      100
30   src/features/WorkerViewer/components/ModelSelector.tsx         0       100      100        0   6-122
31   src/features/WorkerViewer/components/WorkerControls.tsx        0       100      100        0   6-113
32   src/features/WorkerViewer/components/WorkerErrorBoundary.tsx   0       100      100        0   6-114
33   src/features/WorkerViewer/components/WorkerMesh.tsx            0       100      100        0   6-89
34   src/features/WorkerViewer/components/WorkerScene.tsx           0       100      100        0   6-154
35   src/features/WorkerViewer/hooks/useWorkerModel.ts          95.23     96.87      100    95.23   25-29
36   src/features/WorkerViewer/services/workerService.ts        98.03        80      100    98.03   102
37   src/pages/CadViewer/index.tsx                                  0       100      100        0   6-16
38   src/pages/Home/DemoCard.tsx                                    0         0        0        0   1-47
39   src/pages/Home/index.tsx                                       0       100      100        0   5-77
40   src/pages/TeapotDemo/index.tsx                                 0       100      100        0   5-13
41   src/pages/WorkerViewer/index.tsx                               0       100      100        0   6-21
42   src/routes/root.tsx                                            0         0        0        0   1-38
43   src/types/menu.ts                                              0         0        0        0
--------------------------------------------------------------------------------------------------------------
TOTAL (43 files)                                                28.10     90.00    85.93    28.10
```

---

## 4. 2025-12-18 3-1차 (총 325건) Line 커버율 36.08%

> Common 컴포넌트, ControlPanelViewer, Layout 테스트 추가

```
File                                  | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------------------------------|---------|----------|---------|---------|-------------------
All files                             |   36.08 |     90.2 |   83.69 |   36.08 |
 src                                  |       0 |        0 |       0 |       0 |
  App.tsx                             |       0 |        0 |       0 |       0 | 1-38
 src/api                              |       0 |      100 |     100 |       0 |
  apiCaller.ts                        |       0 |      100 |     100 |       0 | 6-14
 src/components/Common                |     100 |      100 |     100 |     100 |
  Button.tsx                          |     100 |      100 |     100 |     100 |
  ToggleControl.tsx                   |     100 |      100 |     100 |     100 |
  Typography.tsx                      |     100 |      100 |     100 |     100 |
 src/components/Common/FileUpload     |    4.05 |      100 |       0 |    4.05 |
  FileUpload.tsx                      |    2.79 |      100 |       0 |    2.79 | 35-246
  utils.ts                            |    6.52 |      100 |       0 |    6.52 | 15-22,31-51...
 src/components/ControlPanel          |   80.13 |      100 |   83.33 |   80.13 |
  GridToggle.tsx                      |     100 |      100 |     100 |     100 |
  RotateToggle.tsx                    |     100 |      100 |     100 |     100 |
  ShadingSelect.tsx                   |   23.07 |      100 |       0 |   23.07 | 31-63
  SpeedSlider.tsx                     |     100 |      100 |     100 |     100 |
  ViewerActionButtons.tsx             |     100 |      100 |     100 |     100 |
 src/components/ControlPanelViewer    |    94.8 |    83.33 |     100 |    94.8 |
  index.tsx                           |    94.8 |    83.33 |     100 |    94.8 | 71-74
 src/components/Layout                |   54.77 |    89.65 |    62.5 |   54.77 |
  Footer.tsx                          |       0 |        0 |       0 |       0 | 1-14
  MainLayout.tsx                      |       0 |        0 |       0 |       0 | 1-34
  MobileDrawer.tsx                    |     100 |      100 |     100 |     100 |
  MobileHeader.tsx                    |       0 |      100 |     100 |       0 | 8-47
  SideBar.tsx                         |       0 |        0 |       0 |       0 | 1-38
  SideBarMenuItem.tsx                 |     100 |      100 |     100 |     100 |
 src/config                           |       0 |      100 |     100 |       0 |
  api.ts                              |       0 |      100 |     100 |       0 | 5-11
 src/constants                        |     100 |      100 |     100 |     100 |
  app.ts                              |     100 |      100 |     100 |     100 |
  menu.ts                             |     100 |      100 |     100 |     100 |
  routes.ts                           |     100 |      100 |     100 |     100 |
 src/features/CadViewer/components    |       0 |      100 |     100 |       0 |
  CadErrorBoundary.tsx                |       0 |      100 |     100 |       0 | 6-114
  CadMesh.tsx                         |       0 |      100 |     100 |       0 | 9-387
  CadScene.tsx                        |       0 |      100 |     100 |       0 | 10-311
  LayerPanel.tsx                      |       0 |      100 |     100 |       0 | 9-105
 src/features/CadViewer/hooks         |   20.05 |    56.25 |     100 |   20.05 |
  useDXFParser.ts                     |   15.35 |     37.5 |     100 |   15.35 | 63-64,67-231...
  useDXFWorker.ts                     |    28.9 |       75 |     100 |    28.9 | 50-52,64-66...
 src/features/CadViewer/utils         |   89.86 |    90.75 |   95.83 |   89.86 |
  dxfToGeometry.ts                    |   88.54 |    88.88 |   94.44 |   88.54 | 253-272,318-319...
  validators.ts                       |     100 |      100 |     100 |     100 |
 src/features/TeapotDemo/components   |       0 |      100 |     100 |       0 |
  TeapotControls.tsx                  |       0 |      100 |     100 |       0 | 5-140
  TeapotMesh.tsx                      |       0 |      100 |     100 |       0 | 5-97
  TeapotScene.tsx                     |       0 |      100 |     100 |       0 | 5-93
 src/features/TeapotDemo/hooks        |     100 |      100 |     100 |     100 |
  useTeapotMaterial.ts                |     100 |      100 |     100 |     100 |
 src/features/WorkerViewer/components |       0 |      100 |     100 |       0 |
  ModelSelector.tsx                   |       0 |      100 |     100 |       0 | 6-122
  WorkerErrorBoundary.tsx             |       0 |      100 |     100 |       0 | 6-114
  WorkerMesh.tsx                      |       0 |      100 |     100 |       0 | 6-111
  WorkerScene.tsx                     |       0 |      100 |     100 |       0 | 6-194
 src/features/WorkerViewer/hooks      |   95.23 |    96.87 |     100 |   95.23 |
  useWorkerModel.ts                   |   95.23 |    96.87 |     100 |   95.23 | 25-29
 src/features/WorkerViewer/services   |    98.3 |       80 |     100 |    98.3 |
  workerService.ts                    |    98.3 |       80 |     100 |    98.3 | 110
 src/pages/CadViewer                  |       0 |      100 |     100 |       0 |
  index.tsx                           |       0 |      100 |     100 |       0 | 6-16
 src/pages/Error                      |       0 |      100 |     100 |       0 |
  index.tsx                           |       0 |      100 |     100 |       0 | 9-62
 src/pages/Home                       |       0 |       50 |      50 |       0 |
  DemoCard.tsx                        |       0 |        0 |       0 |       0 | 1-47
  index.tsx                           |       0 |      100 |     100 |       0 | 5-77
 src/pages/TeapotDemo                 |       0 |      100 |     100 |       0 |
  index.tsx                           |       0 |      100 |     100 |       0 | 5-13
 src/pages/WorkerViewer               |       0 |      100 |     100 |       0 |
  index.tsx                           |       0 |      100 |     100 |       0 | 6-21
 src/routes                           |       0 |        0 |       0 |       0 |
  root.tsx                            |       0 |        0 |       0 |       0 | 1-42
 src/services/CadViewer               |   12.11 |      100 |     100 |   12.11 |
  dxfParser.worker.ts                 |       0 |      100 |     100 |       0 | 7-488
  utils.ts                            |     100 |      100 |     100 |     100 |
 src/stores                           |       0 |      100 |     100 |       0 |
  useMobileMenuStore.ts               |       0 |      100 |     100 |       0 | 7-26
 src/types                            |       0 |        0 |       0 |       0 |
  menu.ts                             |       0 |        0 |       0 |       0 |
 src/types/dxf                        |       0 |        0 |       0 |       0 |
  base.ts                             |       0 |        0 |       0 |       0 |
  library.ts                          |       0 |        0 |       0 |       0 |
  parsed.ts                           |       0 |        0 |       0 |       0 |
 src/utils                            |       0 |      100 |     100 |       0 |
  cn.ts                               |       0 |      100 |     100 |       0 | 12-17
--------------------------------------|---------|----------|---------|---------|-------------------
TOTAL                                 |   36.08 |     90.2 |   83.69 |   36.08 |
```

---

## Changelog (변경 이력)

| 버전  | 날짜       | 변경 내용                                                                                                       |
| ----- | ---------- | --------------------------------------------------------------------------------------------------------------- |
| 0.0.2 | 2025-12-18 | 3-1차 커버리지 결과 (325 tests, 36.08% Line), Common/ControlPanelViewer/Layout 테스트 추가, 테스트 캐시 최적화  |
| 0.0.1 | 2025-12-17 | 2-1차~2-2차 커버리지 결과 (120→167 tests, 23.11%→28.10% Line), 테스트 인프라 개선, ViewerControlPanel 100% 달성 |
| 0.0.0 | 2025-12-16 | 초기 문서 작성 - Vitest v8 형식, 1-1차 커버리지 결과 (120 tests, 24.18% Line)                                   |
