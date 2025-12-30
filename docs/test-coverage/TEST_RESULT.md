# 테스트 커버리지 결과

> **Version**: 0.0.7
> **Last Updated**: 2025-12-30

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

<details>
<summary>📊 1. 2025-12-16 1-1차 (총 120건) Line 커버율 24.18%</summary>

<br>

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

</details>

---

<details>
<summary>📊 2. 2025-12-17 2-1차 (총 120건) Line 커버율 23.11%</summary>

<br>

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

</details>

<details>
<summary>📊 3. 2025-12-17 2-2차 (총 167건) Line 커버율 28.10%</summary>

<br>

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

</details>

---

<details>
<summary>📊 4. 2025-12-18 3-1차 (총 325건) Line 커버율 36.08%</summary>

<br>

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

</details>

---

<details>
<summary>📊 5. 2025-12-23 4-1차 Line 커버율 48.34%</summary>

<br>

> FilePanel, Layout, hooks, utils 테스트 대폭 확대, 신규 컴포넌트 추가

```
File                                  | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------------------------------|---------|----------|---------|---------|-----------------------------------------------------------------------------
All files                             |   48.34 |    89.55 |   85.29 |   48.34 |
 src                                  |       0 |        0 |       0 |       0 |
  App.tsx                             |       0 |        0 |       0 |       0 | 1-38
 src/api                              |       0 |      100 |     100 |       0 |
  apiCaller.ts                        |       0 |      100 |     100 |       0 | 6-14
 src/components/Common                |     100 |      100 |     100 |     100 |
  Button.tsx                          |     100 |      100 |     100 |     100 |
  LoadingSpinner.tsx                  |     100 |      100 |     100 |     100 |
  PanelErrorBoundary.tsx              |     100 |      100 |     100 |     100 |
  ToggleControl.tsx                   |     100 |      100 |     100 |     100 |
  Typography.tsx                      |     100 |      100 |     100 |     100 |
  ViewerErrorBoundary.tsx             |     100 |      100 |     100 |     100 |
 src/components/Common/DropZone       |   98.83 |    81.81 |     100 |   98.83 |
  DropZone.tsx                        |   98.83 |    81.81 |     100 |   98.83 | 80
 src/components/ControlPanel          |   79.59 |      100 |   83.33 |   79.59 |
  GridToggle.tsx                      |     100 |      100 |     100 |     100 |
  RotateToggle.tsx                    |     100 |      100 |     100 |     100 |
  ShadingSelect.tsx                   |   23.07 |      100 |       0 |   23.07 | 31-63
  SpeedSlider.tsx                     |     100 |      100 |     100 |     100 |
  ViewerActionButtons.tsx             |     100 |      100 |     100 |     100 |
 src/components/ControlPanelViewer    |    94.8 |    83.33 |     100 |    94.8 |
  index.tsx                           |    94.8 |    83.33 |     100 |    94.8 | 71-74
 src/components/FilePanel             |   80.97 |    85.29 |   81.81 |   80.97 |
  FileUploadBox.tsx                   |   82.35 |    73.68 |     100 |   82.35 | 55-62,112-122
  SampleList.tsx                      |     100 |      100 |     100 |     100 |
  UrlInput.tsx                        |     100 |      100 |     100 |     100 |
  utils.ts                            |   61.19 |    77.27 |   66.66 |   61.19 | 38-56,63-70,88-89,101-115,121-128,144-151
 src/components/FilePanelViewer       |       0 |      100 |     100 |       0 |
  index.tsx                           |       0 |      100 |     100 |       0 | 19-83
 src/components/Layout                |   85.02 |     92.3 |    87.5 |   85.02 |
  Footer.tsx                          |     100 |      100 |     100 |     100 |
  MainLayout.tsx                      |       0 |        0 |       0 |       0 | 1-32
  MobileDrawer.tsx                    |   85.71 |       92 |     100 |   85.71 | 57-78
  MobileHeader.tsx                    |     100 |      100 |     100 |     100 |
  SideBar.tsx                         |     100 |      100 |     100 |     100 |
  SideBarMenuItem.tsx                 |     100 |      100 |     100 |     100 |
 src/components/SceneCanvasViewer     |       0 |      100 |     100 |       0 |
  SceneCanvas.tsx                     |       0 |      100 |     100 |       0 | 11-116
 src/config                           |       0 |      100 |     100 |       0 |
  api.ts                              |       0 |      100 |     100 |       0 | 5-11
 src/constants                        |     100 |      100 |     100 |     100 |
  app.ts                              |     100 |      100 |     100 |     100 |
  menu.ts                             |     100 |      100 |     100 |     100 |
  routes.ts                           |     100 |      100 |     100 |     100 |
 src/features/CadViewer/components    |       0 |      100 |     100 |       0 |
  CadMesh.tsx                         |       0 |      100 |     100 |       0 | 9-415
  CadScene.tsx                        |       0 |      100 |     100 |       0 | 10-237
  LayerPanel.tsx                      |       0 |      100 |     100 |       0 | 9-105
 src/features/CadViewer/hooks         |   13.78 |    52.63 |     100 |   13.78 |
  useDXFParser.ts                     |   14.97 |     37.5 |     100 |   14.97 | 67-68,71-235,240-315,321-322
  useDXFWorker.ts                     |   25.76 |       60 |     100 |   25.76 | 55-57,59-61,73-75,77-79,86-226
  useDxfLoader.ts                     |       0 |      100 |     100 |       0 | 6-262
 src/features/CadViewer/services      |   12.07 |      100 |     100 |   12.07 |
  dxfParser.worker.ts                 |       0 |      100 |     100 |       0 | 7-591
  utils.ts                            |     100 |      100 |     100 |     100 |
 src/features/CadViewer/types/dxf     |       0 |        0 |       0 |       0 |
  base.ts                             |       0 |        0 |       0 |       0 |
  library.ts                          |       0 |        0 |       0 |       0 |
  parsed.ts                           |       0 |        0 |       0 |       0 |
 src/features/CadViewer/utils         |   82.63 |    90.67 |   88.88 |   82.63 |
  dxfToGeometry.ts                    |   85.73 |    89.21 |      95 |   85.73 | 323-355,412-413,442-462,472-473,522-523,579-580,587-593,604-608,784,794-804
  validators.ts                       |    64.7 |      100 |   71.42 |    64.7 | 88-117,148-162
 src/features/TeapotDemo/components   |       0 |      100 |     100 |       0 |
  TeapotControls.tsx                  |       0 |      100 |     100 |       0 | 5-140
  TeapotMesh.tsx                      |       0 |      100 |     100 |       0 | 5-97
  TeapotScene.tsx                     |       0 |      100 |     100 |       0 | 7-93
 src/features/TeapotDemo/hooks        |     100 |      100 |     100 |     100 |
  useTeapotMaterial.ts                |     100 |      100 |     100 |     100 |
 src/features/WorkerViewer/components |       0 |      100 |     100 |       0 |
  WorkerMesh.tsx                      |       0 |      100 |     100 |       0 | 6-115
  WorkerScene.tsx                     |       0 |      100 |     100 |       0 | 10-219
 src/features/WorkerViewer/hooks      |   96.47 |    93.75 |     100 |   96.47 |
  useGltfLoader.ts                    |   96.47 |    93.75 |     100 |   96.47 | 111-113
 src/features/WorkerViewer/services   |     100 |    88.88 |     100 |     100 |
  workerService.ts                    |     100 |    88.88 |     100 |     100 | 73
 src/hooks                            |     100 |      100 |     100 |     100 |
  useSceneControls.ts                 |     100 |      100 |     100 |     100 |
 src/locales                          |   97.71 |      100 |      25 |   97.71 |
  en.ts                               |   96.59 |      100 |       0 |   96.59 | 48,55,88
  ko.ts                               |   98.85 |      100 |      50 |   98.85 | 48
 src/pages/CadViewer                  |       0 |      100 |     100 |       0 |
  index.tsx                           |       0 |      100 |     100 |       0 | 6-22
 src/pages/Error                      |       0 |      100 |     100 |       0 |
  index.tsx                           |       0 |      100 |     100 |       0 | 9-63
 src/pages/Home                       |       0 |       50 |      50 |       0 |
  DemoCard.tsx                        |       0 |        0 |       0 |       0 | 1-47
  index.tsx                           |       0 |      100 |     100 |       0 | 5-80
 src/pages/TeapotDemo                 |       0 |      100 |     100 |       0 |
  index.tsx                           |       0 |      100 |     100 |       0 | 6-25
 src/pages/WorkerViewer               |       0 |      100 |     100 |       0 |
  index.tsx                           |       0 |      100 |     100 |       0 | 6-26
 src/routes                           |       0 |        0 |       0 |       0 |
  root.tsx                            |       0 |        0 |       0 |       0 | 1-30
 src/stores                           |     100 |      100 |     100 |     100 |
  useMobileMenuStore.ts               |     100 |      100 |     100 |     100 |
 src/types                            |       0 |        0 |       0 |       0 |
  menu.ts                             |       0 |        0 |       0 |       0 |
 src/utils                            |   70.58 |    90.74 |   88.88 |   70.58 |
  cn.ts                               |     100 |      100 |     100 |     100 |
  errorClassifier.ts                  |     100 |      100 |     100 |     100 |
  errorFormatter.ts                   |    86.3 |    58.33 |     100 |    86.3 | 68-69,88-89,95-96,101-102,110-111
  format.ts                           |     100 |      100 |     100 |     100 |
  urlValidator.ts                     |    3.22 |      100 |       0 |    3.22 | 50-120
--------------------------------------|---------|----------|---------|---------|-----------------------------------------------------------------------------
```

</details>

<details>
<summary>📊 6. 2025-12-23 4-2차 Line 커버율 50.77%</summary>

<br>

> 핵심 인프라 테스트 추가: App.tsx, MainLayout.tsx, root.tsx, FilePanelViewer

```
File                                  | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------------------------------|---------|----------|---------|---------|-----------------------------------------------------------------------------
All files                             |   50.77 |    90.08 |    87.4 |   50.77 |
 src                                  |     100 |      100 |     100 |     100 |
  App.tsx                             |     100 |      100 |     100 |     100 |
 src/api                              |       0 |      100 |     100 |       0 |
  apiCaller.ts                        |       0 |      100 |     100 |       0 | 6-14
 src/components/Common                |     100 |      100 |     100 |     100 |
  Button.tsx                          |     100 |      100 |     100 |     100 |
  LoadingSpinner.tsx                  |     100 |      100 |     100 |     100 |
  PanelErrorBoundary.tsx              |     100 |      100 |     100 |     100 |
  ToggleControl.tsx                   |     100 |      100 |     100 |     100 |
  Typography.tsx                      |     100 |      100 |     100 |     100 |
  ViewerErrorBoundary.tsx             |     100 |      100 |     100 |     100 |
 src/components/Common/DropZone       |   98.83 |    81.81 |     100 |   98.83 |
  DropZone.tsx                        |   98.83 |    81.81 |     100 |   98.83 | 80
 src/components/ControlPanel          |   79.59 |      100 |   83.33 |   79.59 |
  GridToggle.tsx                      |     100 |      100 |     100 |     100 |
  RotateToggle.tsx                    |     100 |      100 |     100 |     100 |
  ShadingSelect.tsx                   |   23.07 |      100 |       0 |   23.07 | 31-63
  SpeedSlider.tsx                     |     100 |      100 |     100 |     100 |
  ViewerActionButtons.tsx             |     100 |      100 |     100 |     100 |
 src/components/ControlPanelViewer    |    94.8 |    83.33 |     100 |    94.8 |
  index.tsx                           |    94.8 |    83.33 |     100 |    94.8 | 71-74
 src/components/FilePanel             |   80.97 |    85.29 |   81.81 |   80.97 |
  FileUploadBox.tsx                   |   82.35 |    73.68 |     100 |   82.35 | 55-62,112-122
  SampleList.tsx                      |     100 |      100 |     100 |     100 |
  UrlInput.tsx                        |     100 |      100 |     100 |     100 |
  utils.ts                            |   61.19 |    77.27 |   66.66 |   61.19 | 38-56,63-70,88-89,101-115,121-128,144-151
 src/components/FilePanelViewer       |     100 |      100 |     100 |     100 |
  index.tsx                           |     100 |      100 |     100 |     100 |
 src/components/Layout                |     100 |    96.15 |     100 |     100 |
  Footer.tsx                          |     100 |      100 |     100 |     100 |
  MainLayout.tsx                      |     100 |      100 |     100 |     100 |
  MobileDrawer.tsx                    |     100 |       92 |     100 |     100 |
  MobileHeader.tsx                    |     100 |      100 |     100 |     100 |
  SideBar.tsx                         |     100 |      100 |     100 |     100 |
  SideBarMenuItem.tsx                 |     100 |      100 |     100 |     100 |
 src/components/SceneCanvasViewer     |       0 |      100 |     100 |       0 |
  SceneCanvas.tsx                     |       0 |      100 |     100 |       0 | 11-116
 src/config                           |       0 |      100 |     100 |       0 |
  api.ts                              |       0 |      100 |     100 |       0 | 5-11
 src/constants                        |     100 |      100 |     100 |     100 |
  app.ts                              |     100 |      100 |     100 |     100 |
  menu.ts                             |     100 |      100 |     100 |     100 |
  routes.ts                           |     100 |      100 |     100 |     100 |
 src/features/CadViewer/components    |       0 |      100 |     100 |       0 |
  CadMesh.tsx                         |       0 |      100 |     100 |       0 | 9-415
  CadScene.tsx                        |       0 |      100 |     100 |       0 | 10-237
  LayerPanel.tsx                      |       0 |      100 |     100 |       0 | 9-105
 src/features/CadViewer/hooks         |   13.78 |    52.63 |     100 |   13.78 |
  useDXFParser.ts                     |   14.97 |     37.5 |     100 |   14.97 | 67-68,71-235,240-315,321-322
  useDXFWorker.ts                     |   25.76 |       60 |     100 |   25.76 | 55-57,59-61,73-75,77-79,86-226
  useDxfLoader.ts                     |       0 |      100 |     100 |       0 | 6-262
 src/features/CadViewer/services      |   12.07 |      100 |     100 |   12.07 |
  dxfParser.worker.ts                 |       0 |      100 |     100 |       0 | 7-591
  utils.ts                            |     100 |      100 |     100 |     100 |
 src/features/CadViewer/types/dxf     |       0 |        0 |       0 |       0 |
  base.ts                             |       0 |        0 |       0 |       0 |
  library.ts                          |       0 |        0 |       0 |       0 |
  parsed.ts                           |       0 |        0 |       0 |       0 |
 src/features/CadViewer/utils         |   82.63 |    90.67 |   88.88 |   82.63 |
  dxfToGeometry.ts                    |   85.73 |    89.21 |      95 |   85.73 | 323-355,412-413,442-462,472-473,522-523,579-580,587-593,604-608,784,794-804
  validators.ts                       |    64.7 |      100 |   71.42 |    64.7 | 88-117,148-162
 src/features/TeapotDemo/components   |       0 |      100 |     100 |       0 |
  TeapotControls.tsx                  |       0 |      100 |     100 |       0 | 5-140
  TeapotMesh.tsx                      |       0 |      100 |     100 |       0 | 5-97
  TeapotScene.tsx                     |       0 |      100 |     100 |       0 | 7-93
 src/features/TeapotDemo/hooks        |     100 |      100 |     100 |     100 |
  useTeapotMaterial.ts                |     100 |      100 |     100 |     100 |
 src/features/WorkerViewer/components |       0 |      100 |     100 |       0 |
  WorkerMesh.tsx                      |       0 |      100 |     100 |       0 | 6-115
  WorkerScene.tsx                     |       0 |      100 |     100 |       0 | 10-219
 src/features/WorkerViewer/hooks      |   96.47 |    93.75 |     100 |   96.47 |
  useGltfLoader.ts                    |   96.47 |    93.75 |     100 |   96.47 | 111-113
 src/features/WorkerViewer/services   |     100 |    88.88 |     100 |     100 |
  workerService.ts                    |     100 |    88.88 |     100 |     100 | 73
 src/hooks                            |     100 |      100 |     100 |     100 |
  useSceneControls.ts                 |     100 |      100 |     100 |     100 |
 src/locales                          |   97.71 |      100 |      25 |   97.71 |
  en.ts                               |   96.59 |      100 |       0 |   96.59 | 48,55,88
  ko.ts                               |   98.85 |      100 |      50 |   98.85 | 48
 src/pages/CadViewer                  |       0 |      100 |     100 |       0 |
  index.tsx                           |       0 |      100 |     100 |       0 | 6-22
 src/pages/Error                      |       0 |      100 |     100 |       0 |
  index.tsx                           |       0 |      100 |     100 |       0 | 9-63
 src/pages/Home                       |       0 |       50 |      50 |       0 |
  DemoCard.tsx                        |       0 |        0 |       0 |       0 | 1-47
  index.tsx                           |       0 |      100 |     100 |       0 | 5-80
 src/pages/TeapotDemo                 |       0 |      100 |     100 |       0 |
  index.tsx                           |       0 |      100 |     100 |       0 | 6-25
 src/pages/WorkerViewer               |       0 |      100 |     100 |       0 |
  index.tsx                           |       0 |      100 |     100 |       0 | 6-26
 src/routes                           |      96 |      100 |     100 |      96 |
  root.tsx                            |      96 |      100 |     100 |      96 | 25
 src/stores                           |     100 |      100 |     100 |     100 |
  useMobileMenuStore.ts               |     100 |      100 |     100 |     100 |
 src/types                            |       0 |        0 |       0 |       0 |
  menu.ts                             |       0 |        0 |       0 |       0 |
 src/utils                            |   70.58 |    90.74 |   88.88 |   70.58 |
  cn.ts                               |     100 |      100 |     100 |     100 |
  errorClassifier.ts                  |     100 |      100 |     100 |     100 |
  errorFormatter.ts                   |    86.3 |    58.33 |     100 |    86.3 | 68-69,88-89,95-96,101-102,110-111
  format.ts                           |     100 |      100 |     100 |     100 |
  urlValidator.ts                     |    3.22 |      100 |       0 |    3.22 | 50-120
--------------------------------------|---------|----------|---------|---------|-----------------------------------------------------------------------------
```

</details>

---

<details>
<summary>📊 7. 2025-12-26 5-1차 Line 커버율 61.44%</summary>

<br>

> DXF 파서 훅 대폭 개선, 신규 entityParsers/useMobileDrawer 추가, SceneCanvas 커버리지 확보

```
File                                  | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------------------------------|---------|----------|---------|---------|-----------------------------------------------------------------------------
All files                             |   61.44 |    87.96 |    87.8 |   61.44 |
 src                                  |     100 |      100 |     100 |     100 |
  App.tsx                             |     100 |      100 |     100 |     100 |
 src/api                              |       0 |      100 |     100 |       0 |
  apiCaller.ts                        |       0 |      100 |     100 |       0 | 6-14
 src/components/Common                |     100 |      100 |     100 |     100 |
  Button.tsx                          |     100 |      100 |     100 |     100 |
  LoadingSpinner.tsx                  |     100 |      100 |     100 |     100 |
  PanelErrorBoundary.tsx              |     100 |      100 |     100 |     100 |
  ToggleControl.tsx                   |     100 |      100 |     100 |     100 |
  Typography.tsx                      |     100 |      100 |     100 |     100 |
  ViewerErrorBoundary.tsx             |     100 |      100 |     100 |     100 |
 src/components/Common/DropZone       |   98.83 |    81.81 |     100 |   98.83 |
  DropZone.tsx                        |   98.83 |    81.81 |     100 |   98.83 | 80
 src/components/ControlPanel          |   79.59 |      100 |   83.33 |   79.59 |
  GridToggle.tsx                      |     100 |      100 |     100 |     100 |
  RotateToggle.tsx                    |     100 |      100 |     100 |     100 |
  ShadingSelect.tsx                   |   23.07 |      100 |       0 |   23.07 | 31-63
  SpeedSlider.tsx                     |     100 |      100 |     100 |     100 |
  ViewerActionButtons.tsx             |     100 |      100 |     100 |     100 |
 src/components/ControlPanelViewer    |    94.8 |    83.33 |     100 |    94.8 |
  index.tsx                           |    94.8 |    83.33 |     100 |    94.8 | 71-74
 src/components/FilePanel             |   80.97 |    85.29 |   81.81 |   80.97 |
  FileUploadBox.tsx                   |   82.35 |    73.68 |     100 |   82.35 | 55-62,112-122
  SampleList.tsx                      |     100 |      100 |     100 |     100 |
  UrlInput.tsx                        |     100 |      100 |     100 |     100 |
  utils.ts                            |   61.19 |    77.27 |   66.66 |   61.19 | 38-56,63-70,88-89,101-115,121-128,144-151
 src/components/FilePanelViewer       |     100 |      100 |     100 |     100 |
  index.tsx                           |     100 |      100 |     100 |     100 |
 src/components/Layout                |     100 |    96.15 |     100 |     100 |
  Footer.tsx                          |     100 |      100 |     100 |     100 |
  MainLayout.tsx                      |     100 |      100 |     100 |     100 |
  MobileDrawer.tsx                    |     100 |       92 |     100 |     100 |
  MobileHeader.tsx                    |     100 |      100 |     100 |     100 |
  SideBar.tsx                         |     100 |      100 |     100 |     100 |
  SideBarMenuItem.tsx                 |     100 |      100 |     100 |     100 |
 src/components/SceneCanvasViewer     |   87.67 |       75 |     100 |   87.67 |
  SceneCanvas.tsx                     |   87.67 |       75 |     100 |   87.67 | 84-92
 src/config                           |       0 |      100 |     100 |       0 |
  api.ts                              |       0 |      100 |     100 |       0 | 5-11
 src/constants                        |     100 |      100 |     100 |     100 |
  app.ts                              |     100 |      100 |     100 |     100 |
  menu.ts                             |     100 |      100 |     100 |     100 |
  routes.ts                           |     100 |      100 |     100 |     100 |
 src/features/CadViewer/components    |       0 |      100 |     100 |       0 |
  CadMesh.tsx                         |       0 |      100 |     100 |       0 | 9-415
  CadScene.tsx                        |       0 |      100 |     100 |       0 | 10-237
  LayerPanel.tsx                      |       0 |      100 |     100 |       0 | 9-105
 src/features/CadViewer/hooks         |   52.11 |    52.94 |     100 |   52.11 |
  useDXFParser.ts                     |   14.97 |     37.5 |     100 |   14.97 | 67-68,71-235,240-315,321-322
  useDXFWorker.ts                     |   44.44 |       60 |     100 |   44.44 | 55-57,59-61,73-75,77-79,89-102,111-125,145-226
  useDxfLoader.ts                     |   97.75 |    64.28 |     100 |   97.75 | 233-236
 src/features/CadViewer/services      |   56.66 |    67.39 |     100 |   56.66 |
  entityParsers.ts                    |   92.55 |    68.42 |     100 |   92.55 | 111-124,160-174
  utils.ts                            |     100 |      100 |     100 |     100 |
 src/features/CadViewer/types/dxf     |       0 |        0 |       0 |       0 |
  base.ts                             |       0 |        0 |       0 |       0 |
  library.ts                          |       0 |        0 |       0 |       0 |
  parsed.ts                           |       0 |        0 |       0 |       0 |
 src/features/CadViewer/utils         |   82.63 |    90.67 |   88.88 |   82.63 |
  dxfToGeometry.ts                    |   85.73 |    89.21 |      95 |   85.73 | 323-355,412-413,442-462,472-473,522-523,579-580,587-593,604-608,784,794-804
  validators.ts                       |    64.7 |      100 |   71.42 |    64.7 | 88-117,148-162
 src/features/TeapotDemo/components   |       0 |      100 |     100 |       0 |
  TeapotControls.tsx                  |       0 |      100 |     100 |       0 | 5-140
  TeapotMesh.tsx                      |       0 |      100 |     100 |       0 | 5-97
  TeapotScene.tsx                     |       0 |      100 |     100 |       0 | 7-93
 src/features/TeapotDemo/hooks        |     100 |      100 |     100 |     100 |
  useTeapotMaterial.ts                |     100 |      100 |     100 |     100 |
 src/features/WorkerViewer/components |       0 |      100 |     100 |       0 |
  WorkerMesh.tsx                      |       0 |      100 |     100 |       0 | 6-115
  WorkerScene.tsx                     |       0 |      100 |     100 |       0 | 10-219
 src/features/WorkerViewer/hooks      |   96.47 |    93.75 |     100 |   96.47 |
  useGltfLoader.ts                    |   96.47 |    93.75 |     100 |   96.47 | 111-113
 src/features/WorkerViewer/services   |     100 |    88.88 |     100 |     100 |
  workerService.ts                    |     100 |    88.88 |     100 |     100 | 73
 src/hooks                            |   85.71 |      100 |     100 |   85.71 |
  useMobileDrawer.ts                  |   78.57 |      100 |     100 |   78.57 | 81,84,86,118-122,128-130
  useSceneControls.ts                 |     100 |      100 |     100 |     100 |
  useUrlInput.ts                      |     100 |      100 |     100 |     100 |
 src/locales                          |   97.71 |      100 |      25 |   97.71 |
  en.ts                               |   96.59 |      100 |       0 |   96.59 | 48,55,88
  ko.ts                               |   98.85 |      100 |      50 |   98.85 | 48
 src/pages/CadViewer                  |     100 |      100 |     100 |     100 |
  index.tsx                           |     100 |      100 |     100 |     100 |
 src/pages/Error                      |       0 |      100 |     100 |       0 |
  index.tsx                           |       0 |      100 |     100 |       0 | 9-63
 src/pages/Home                       |       0 |       50 |      50 |       0 |
  DemoCard.tsx                        |       0 |        0 |       0 |       0 | 1-47
  index.tsx                           |       0 |      100 |     100 |       0 | 5-80
 src/pages/TeapotDemo                 |       0 |      100 |     100 |       0 |
  index.tsx                           |       0 |      100 |     100 |       0 | 6-25
 src/pages/WorkerViewer               |     100 |      100 |     100 |     100 |
  index.tsx                           |     100 |      100 |     100 |     100 |
 src/routes                           |      96 |      100 |     100 |      96 |
  root.tsx                            |      96 |      100 |     100 |      96 | 25
 src/stores                           |     100 |      100 |     100 |     100 |
  useMobileMenuStore.ts               |     100 |      100 |     100 |     100 |
 src/types                            |       0 |        0 |       0 |       0 |
  menu.ts                             |       0 |        0 |       0 |       0 |
 src/utils                            |   75.36 |    92.85 |   91.66 |   75.36 |
  cn.ts                               |     100 |      100 |     100 |     100 |
  errorClassifier.ts                  |     100 |      100 |     100 |     100 |
  errorFormatter.ts                   |    86.3 |    58.33 |     100 |    86.3 | 68-69,88-89,95-96,101-102,110-111
  fileSizeFormatter.ts                |     100 |      100 |     100 |     100 |
  format.ts                           |     100 |      100 |     100 |     100 |
  urlValidator.ts                     |    3.22 |      100 |       0 |    3.22 | 50-120
--------------------------------------|---------|----------|---------|---------|-----------------------------------------------------------------------------
```

</details>

<details>
<summary>📊 8. 2025-12-26 5-2차 Line 커버율 62.18%</summary>

<br>

> entityMath 100% 달성, FilePanel/Layout 100%, utils 93.86% 달성, types 리팩토링 반영

```
File                                    | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------------------------------------|---------|----------|---------|---------|-----------------------------------------------------------------------------
All files                               |   62.18 |    90.48 |   88.07 |   62.18 |
 src                                    |     100 |      100 |     100 |     100 |
  App.tsx                               |     100 |      100 |     100 |     100 |
 src/api                                |       0 |      100 |     100 |       0 |
  apiCaller.ts                          |       0 |      100 |     100 |       0 | 6-14
 src/components/Common                  |     100 |      100 |     100 |     100 |
  Button.tsx                            |     100 |      100 |     100 |     100 |
  LoadingSpinner.tsx                    |     100 |      100 |     100 |     100 |
  PanelErrorBoundary.tsx                |     100 |      100 |     100 |     100 |
  ToggleControl.tsx                     |     100 |      100 |     100 |     100 |
  Typography.tsx                        |     100 |      100 |     100 |     100 |
  ViewerErrorBoundary.tsx               |     100 |      100 |     100 |     100 |
 src/components/Common/DropZone         |   98.85 |    81.81 |     100 |   98.85 |
  DropZone.tsx                          |   98.85 |    81.81 |     100 |   98.85 | 82
 src/components/ControlPanel            |   79.59 |      100 |   83.33 |   79.59 |
  GridToggle.tsx                        |     100 |      100 |     100 |     100 |
  RotateToggle.tsx                      |     100 |      100 |     100 |     100 |
  ShadingSelect.tsx                     |   23.07 |      100 |       0 |   23.07 | 31-63
  SpeedSlider.tsx                       |     100 |      100 |     100 |     100 |
  ViewerActionButtons.tsx               |     100 |      100 |     100 |     100 |
 src/components/ControlPanelViewer      |    94.8 |    83.33 |     100 |    94.8 |
  index.tsx                             |    94.8 |    83.33 |     100 |    94.8 | 71-74
 src/components/FilePanel               |   90.53 |     87.8 |   88.88 |   90.53 |
  FileUploadBox.tsx                     |   81.14 |    77.27 |   83.33 |   81.14 | 65-75,133-138,159-166
  SampleList.tsx                        |     100 |      100 |     100 |     100 |
  UrlInput.tsx                          |     100 |      100 |     100 |     100 |
 src/components/FilePanelViewer         |     100 |    83.33 |     100 |     100 |
  index.tsx                             |     100 |    83.33 |     100 |     100 | 57
 src/components/Layout                  |     100 |      100 |     100 |     100 |
  Footer.tsx                            |     100 |      100 |     100 |     100 |
  MainLayout.tsx                        |     100 |      100 |     100 |     100 |
  MobileDrawer.tsx                      |     100 |      100 |     100 |     100 |
  MobileHeader.tsx                      |     100 |      100 |     100 |     100 |
  SideBar.tsx                           |     100 |      100 |     100 |     100 |
  SideBarMenuItem.tsx                   |     100 |      100 |     100 |     100 |
 src/components/SceneCanvasViewer       |   87.67 |      100 |      50 |   87.67 |
  SceneCanvas.tsx                       |   87.67 |      100 |      50 |   87.67 | 23-32
 src/config                             |   75.75 |       75 |     100 |   75.75 |
  api.ts                                |       0 |      100 |     100 |       0 | 5-11
  urlSecurity.ts                        |   96.15 |    66.66 |     100 |   96.15 | 22
 src/constants                          |     100 |      100 |     100 |     100 |
  app.ts                                |     100 |      100 |     100 |     100 |
  menu.ts                               |     100 |      100 |     100 |     100 |
  routes.ts                             |     100 |      100 |     100 |     100 |
 src/features/CadViewer/components      |       0 |      100 |     100 |       0 |
  CadMesh.tsx                           |       0 |      100 |     100 |       0 | 9-415
  CadScene.tsx                          |       0 |      100 |     100 |       0 | 10-237
  LayerPanel.tsx                        |       0 |      100 |     100 |       0 | 9-105
 src/features/CadViewer/hooks           |   55.07 |    77.77 |     100 |   55.07 |
  useDXFParser.ts                       |   31.96 |     37.5 |     100 |   31.96 | 59-60,63-81,86-161,167-168
  useDXFWorker.ts                       |   25.76 |       60 |     100 |   25.76 | 55-57,59-61,73-75,77-79,86-226
  useDxfLoader.ts                       |   97.75 |    91.66 |     100 |   97.75 | 198-199,211-212
 src/features/CadViewer/services        |   40.72 |    85.86 |     100 |   40.72 |
  dxfParser.worker.ts                   |       0 |      100 |     100 |       0 | 9-457
  entityMath.ts                         |     100 |      100 |     100 |     100 |
  entityParsers.ts                      |   92.55 |    83.33 |     100 |   92.55 | 89-93,112-116,296-299
 src/features/CadViewer/types/dxfEntity |       0 |        0 |       0 |       0 |
  base.ts                               |       0 |        0 |       0 |       0 |
  library.ts                            |       0 |        0 |       0 |       0 |
  parsed.ts                             |       0 |        0 |       0 |       0 |
 src/features/CadViewer/utils           |   83.33 |    89.32 |   95.23 |   83.33 |
  dxfSamples.ts                         |       0 |      100 |     100 |       0 | 10-31
  dxfToGeometry.ts                      |   85.73 |    89.21 |      95 |   85.73 | 323-355,412-413,442-462,472-473,522-523,579-580,587-593,604-608,784,794-804
 src/features/TeapotDemo/components     |       0 |      100 |     100 |       0 |
  TeapotControls.tsx                    |       0 |      100 |     100 |       0 | 5-140
  TeapotMesh.tsx                        |       0 |      100 |     100 |       0 | 5-97
  TeapotScene.tsx                       |       0 |      100 |     100 |       0 | 7-93
 src/features/TeapotDemo/hooks          |     100 |      100 |     100 |     100 |
  useTeapotMaterial.ts                  |     100 |      100 |     100 |     100 |
 src/features/WorkerViewer/components   |       0 |      100 |     100 |       0 |
  WorkerMesh.tsx                        |       0 |      100 |     100 |       0 | 6-117
  WorkerScene.tsx                       |       0 |      100 |     100 |       0 | 10-219
 src/features/WorkerViewer/hooks        |   89.69 |    84.21 |     100 |   89.69 |
  useGltfLoader.ts                      |   89.69 |    84.21 |     100 |   89.69 | 109-115,126-128
 src/features/WorkerViewer/services     |     100 |    88.88 |     100 |     100 |
  workerService.ts                      |     100 |    88.88 |     100 |     100 | 73
 src/features/WorkerViewer/utils        |       0 |      100 |     100 |       0 |
  gltfSamples.ts                        |       0 |      100 |     100 |       0 | 11-49
 src/hooks                              |   88.88 |    93.33 |     100 |   88.88 |
  useMobileDrawer.ts                    |   78.57 |       90 |     100 |   78.57 | 74-95
  useSceneControls.ts                   |     100 |      100 |     100 |     100 |
  useUrlInput.ts                        |    98.5 |       95 |     100 |    98.5 | 118
 src/locales                            |   97.81 |      100 |      25 |   97.81 |
  en.ts                                 |   96.59 |      100 |       0 |   96.59 | 48,55,88
  ko.ts                                 |   98.94 |      100 |      50 |   98.94 | 100
 src/pages/CadViewer                    |   85.71 |      100 |      50 |   85.71 |
  index.tsx                             |   85.71 |      100 |      50 |   85.71 | 15-16
 src/pages/Error                        |   10.81 |      100 |       0 |   10.81 |
  index.tsx                             |   10.81 |      100 |       0 |   10.81 | 15-63
 src/pages/Home                         |       0 |       50 |      50 |       0 |
  DemoCard.tsx                          |       0 |        0 |       0 |       0 | 1-47
  index.tsx                             |       0 |      100 |     100 |       0 | 5-80
 src/pages/TeapotDemo                   |       0 |      100 |     100 |       0 |
  index.tsx                             |       0 |      100 |     100 |       0 | 6-25
 src/pages/WorkerViewer                 |   70.58 |      100 |      50 |   70.58 |
  index.tsx                             |   70.58 |      100 |      50 |   70.58 | 16-20
 src/routes                             |      96 |      100 |     100 |      96 |
  root.tsx                              |      96 |      100 |     100 |      96 | 9
 src/stores                             |     100 |      100 |     100 |     100 |
  useMobileMenuStore.ts                 |     100 |      100 |     100 |     100 |
 src/types                              |       0 |        0 |       0 |       0 |
  menu.ts                               |       0 |        0 |       0 |       0 |
 src/utils                              |   93.86 |    97.95 |   93.75 |   93.86 |
  errorClassifier.ts                    |     100 |      100 |     100 |     100 |
  errorFormatter.ts                     |   94.87 |      100 |      80 |   94.87 | 127-130
  fileValidator.ts                      |    86.8 |    93.75 |     100 |    86.8 | 78-93,235-239
  urlValidator.ts                       |     100 |      100 |     100 |     100 |
----------------------------------------|---------|----------|---------|---------|-----------------------------------------------------------------------------
```

</details>

---

<details open>
<summary>📊 9. 2025-12-30 6-1차 Line 커버율 66.58% (최신)</summary>

<br>

> 프로젝트 구조 재편, CadMesh 92.8%, entityMath 100% 유지, utils/cad 및 constants/cad 신규 추가

```
File                                       | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-------------------------------------------|---------|----------|---------|---------|-----------------------------------------------------------------------------
All files                                  |   66.58 |    90.43 |   88.44 |   66.58 |
 src                                       |     100 |      100 |     100 |     100 |
  App.tsx                                  |     100 |      100 |     100 |     100 |
 src/api                                   |       0 |      100 |     100 |       0 |
  apiCaller.ts                             |       0 |      100 |     100 |       0 | 6-14
 src/components/CadMesh                    |   92.85 |       90 |     100 |   92.85 |
  CadMesh.tsx                              |   92.85 |       90 |     100 |   92.85 | 40-41,44-46
 src/components/CadMeshViewer              |       0 |      100 |     100 |       0 |
  index.tsx                                |       0 |      100 |     100 |       0 | 10-45
 src/components/Common                     |     100 |      100 |     100 |     100 |
  Button.tsx                               |     100 |      100 |     100 |     100 |
  LoadingSpinner.tsx                       |     100 |      100 |     100 |     100 |
  PanelErrorBoundary.tsx                   |     100 |      100 |     100 |     100 |
  ToggleControl.tsx                        |     100 |      100 |     100 |     100 |
  Typography.tsx                           |     100 |      100 |     100 |     100 |
  ViewerErrorBoundary.tsx                  |     100 |      100 |     100 |     100 |
 src/components/Common/DropZone            |   98.85 |    81.81 |     100 |   98.85 |
  DropZone.tsx                             |   98.85 |    81.81 |     100 |   98.85 | 82
 src/components/ControlPanel               |   79.59 |      100 |   83.33 |   79.59 |
  GridToggle.tsx                           |     100 |      100 |     100 |     100 |
  RotateToggle.tsx                         |     100 |      100 |     100 |     100 |
  ShadingSelect.tsx                        |   23.07 |      100 |       0 |   23.07 | 31-63
  SpeedSlider.tsx                          |     100 |      100 |     100 |     100 |
  ViewerActionButtons.tsx                  |     100 |      100 |     100 |     100 |
 src/components/ControlPanelViewer         |    94.8 |    83.33 |     100 |    94.8 |
  index.tsx                                |    94.8 |    83.33 |     100 |    94.8 | 71-74
 src/components/FilePanel                  |   90.53 |     87.8 |   88.88 |   90.53 |
  FileUploadBox.tsx                        |   81.14 |    77.27 |   83.33 |   81.14 | 65-75,133-138,159-166
  SampleList.tsx                           |     100 |      100 |     100 |     100 |
  UrlInput.tsx                             |     100 |      100 |     100 |     100 |
 src/components/FilePanelViewer            |     100 |    83.33 |     100 |     100 |
  index.tsx                                |     100 |    83.33 |     100 |     100 | 57
 src/components/Layout                     |     100 |      100 |     100 |     100 |
  Footer.tsx                               |     100 |      100 |     100 |     100 |
  MainLayout.tsx                           |     100 |      100 |     100 |     100 |
  MobileDrawer.tsx                         |     100 |      100 |     100 |     100 |
  MobileHeader.tsx                         |     100 |      100 |     100 |     100 |
  SideBar.tsx                              |     100 |      100 |     100 |     100 |
  SideBarMenuItem.tsx                      |     100 |      100 |     100 |     100 |
 src/components/SceneCanvasViewer          |   87.67 |      100 |      50 |   87.67 |
  SceneCanvas.tsx                          |   87.67 |      100 |      50 |   87.67 | 23-32
 src/config                                |   75.75 |       75 |     100 |   75.75 |
  api.ts                                   |       0 |      100 |     100 |       0 | 5-11
  urlSecurity.ts                           |   96.15 |    66.66 |     100 |   96.15 | 22
 src/constants                             |     100 |      100 |     100 |     100 |
  app.ts                                   |     100 |      100 |     100 |     100 |
  menu.ts                                  |     100 |      100 |     100 |     100 |
  routes.ts                                |     100 |      100 |     100 |     100 |
 src/constants/cad                         |   93.33 |      100 |     100 |   93.33 |
  index.ts                                 |   93.33 |      100 |     100 |   93.33 | 26
 src/features/CadViewer/components         |       0 |      100 |     100 |       0 |
  CadScene.tsx                             |       0 |      100 |     100 |       0 | 10-189
  LayerPanel.tsx                           |       0 |      100 |     100 |       0 | 9-104
 src/features/CadViewer/hooks              |   57.04 |    79.16 |     100 |   57.04 |
  useDXFParser.ts                          |   31.96 |     37.5 |     100 |   31.96 | 59-60,63-81,86-161,167-168
  useDXFWorker.ts                          |   25.76 |       60 |     100 |   25.76 | 55-57,59-61,73-75,77-79,86-226
  useDxfLoader.ts                          |   97.75 |    91.66 |     100 |   97.75 | 198-199,211-212
 src/features/CadViewer/services           |   43.77 |    86.95 |     100 |   43.77 |
  dxfParser.worker.ts                      |       0 |      100 |     100 |       0 | 9-461
  entityMath.ts                            |     100 |      100 |     100 |     100 |
  entityParsers.ts                         |   92.55 |    83.33 |     100 |   92.55 | 89-93,112-116,296-299
 src/features/CadViewer/types/dxfEntity    |       0 |        0 |       0 |       0 |
  library.ts                               |       0 |        0 |       0 |       0 |
 src/features/CadViewer/types/dxfWorkerMsg |       0 |        0 |       0 |       0 |
  index.ts                                 |       0 |        0 |       0 |       0 |
 src/features/CadViewer/utils              |   83.33 |    89.32 |   95.23 |   83.33 |
  dxfSamples.ts                            |       0 |      100 |     100 |       0 | 10-31
  dxfToGeometry.ts                         |   85.73 |    89.21 |      95 |   85.73 | 323-355,412-413,442-462,472-473,522-523,579-580,587-593,604-608,784,794-804
 src/features/TeapotDemo/components        |       0 |      100 |     100 |       0 |
  TeapotControls.tsx                       |       0 |      100 |     100 |       0 | 5-140
  TeapotMesh.tsx                           |       0 |      100 |     100 |       0 | 5-97
  TeapotScene.tsx                          |       0 |      100 |     100 |       0 | 7-93
 src/features/TeapotDemo/hooks             |     100 |      100 |     100 |     100 |
  useTeapotMaterial.ts                     |     100 |      100 |     100 |     100 |
 src/features/WorkerViewer/components      |       0 |      100 |     100 |       0 |
  WorkerMesh.tsx                           |       0 |      100 |     100 |       0 | 6-117
  WorkerScene.tsx                          |       0 |      100 |     100 |       0 | 10-219
 src/features/WorkerViewer/hooks           |   89.69 |    84.21 |     100 |   89.69 |
  useGltfLoader.ts                         |   89.69 |    84.21 |     100 |   89.69 | 109-115,126-128
 src/features/WorkerViewer/services        |     100 |    88.88 |     100 |     100 |
  workerService.ts                         |     100 |    88.88 |     100 |     100 | 73
 src/features/WorkerViewer/utils           |       0 |      100 |     100 |       0 |
  gltfSamples.ts                           |       0 |      100 |     100 |       0 | 11-49
 src/hooks                                 |   88.88 |    93.33 |     100 |   88.88 |
  useMobileDrawer.ts                       |   78.57 |       90 |     100 |   78.57 | 74-95
  useSceneControls.ts                      |     100 |      100 |     100 |     100 |
  useUrlInput.ts                           |    98.5 |       95 |     100 |    98.5 | 118
 src/locales                               |   97.81 |      100 |      25 |   97.81 |
  en.ts                                    |   96.59 |      100 |       0 |   96.59 | 48,55,88
  ko.ts                                    |   98.94 |      100 |      50 |   98.94 | 100
 src/pages/CadViewer                       |   85.71 |      100 |      50 |   85.71 |
  index.tsx                                |   85.71 |      100 |      50 |   85.71 | 15-16
 src/pages/Error                           |   10.81 |      100 |       0 |   10.81 |
  index.tsx                                |   10.81 |      100 |       0 |   10.81 | 15-63
 src/pages/Home                            |       0 |       50 |      50 |       0 |
  DemoCard.tsx                             |       0 |        0 |       0 |       0 | 1-47
  index.tsx                                |       0 |      100 |     100 |       0 | 5-80
 src/pages/TeapotDemo                      |       0 |      100 |     100 |       0 |
  index.tsx                                |       0 |      100 |     100 |       0 | 6-25
 src/pages/WorkerViewer                    |   70.58 |      100 |      50 |   70.58 |
  index.tsx                                |   70.58 |      100 |      50 |   70.58 | 16-20
 src/routes                                |      96 |      100 |     100 |      96 |
  root.tsx                                 |      96 |      100 |     100 |      96 | 9
 src/stores                                |     100 |      100 |     100 |     100 |
  useMobileMenuStore.ts                    |     100 |      100 |     100 |     100 |
 src/types                                 |       0 |        0 |       0 |       0 |
  menu.ts                                  |       0 |        0 |       0 |       0 |
 src/types/cad                             |       0 |        0 |       0 |       0 |
  index.ts                                 |       0 |        0 |       0 |       0 |
 src/utils                                 |   93.86 |    97.95 |   93.75 |   93.86 |
  errorClassifier.ts                       |     100 |      100 |     100 |     100 |
  errorFormatter.ts                        |   94.87 |      100 |      80 |   94.87 | 127-130
  fileValidator.ts                         |    86.8 |    93.75 |     100 |    86.8 | 78-93,235-239
  urlValidator.ts                          |     100 |      100 |     100 |     100 |
 src/utils/cad                             |   62.41 |     87.5 |      75 |   62.41 |
  dxfToGeometry.ts                         |   62.41 |     87.5 |      75 |   62.41 | 121-153,216-217,246-262,272-273,322-323,379-380,387-393,404-408
-------------------------------------------|---------|----------|---------|---------|-----------------------------------------------------------------------------
```

**Test Summary**:

- Test Files: 53 passed (53)
- Tests: 1042 passed, 4 skipped (1046)
- Duration: ~36s

</details>

---

## Changelog (변경 이력)

| 버전  | 날짜       | 변경 내용                                                                                                       |
| ----- | ---------- | --------------------------------------------------------------------------------------------------------------- |
| 0.0.7 | 2025-12-30 | 6-1차 커버리지 결과 (62.18%→66.58% Line), CadMesh 92.8%, utils/cad 62.41%, constants/cad 93.33% 신규 추가       |
| 0.0.6 | 2025-12-26 | 5-1차~5-2차 커버리지 결과 (61.44%→62.18% Line), entityMath 100%, Layout 100%, utils 93.86%, types 리팩토링 반영 |
| 0.0.5 | 2025-12-23 | 4-1차~4-2차 커버리지 결과 (48.34%→50.77% Line), 핵심 인프라 테스트 추가, 신규 Common 컴포넌트 100%              |
| 0.0.2 | 2025-12-18 | 3-1차 커버리지 결과 (325 tests, 36.08% Line), Common/ControlPanelViewer/Layout 테스트 추가, 테스트 캐시 최적화  |
| 0.0.1 | 2025-12-17 | 2-1차~2-2차 커버리지 결과 (120→167 tests, 23.11%→28.10% Line), 테스트 인프라 개선, ViewerControlPanel 100% 달성 |
| 0.0.0 | 2025-12-16 | 초기 문서 작성 - Vitest v8 형식, 1-1차 커버리지 결과 (120 tests, 24.18% Line)                                   |
