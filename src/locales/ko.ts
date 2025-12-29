/**
 * 한국어 메시지
 *
 * 모든 사용자 대면 텍스트를 중앙에서 관리
 * i18n 확장 시 이 파일을 기준으로 다른 언어 파일 생성
 */

export const MESSAGES = {
    // =========================================================
    // ARIA - 접근성 레이블
    // =========================================================
    aria: {
        loading: '로딩 중',
        sidebar: '사이드바',
        mainNavigation: '메인 네비게이션',
        mobileMenu: '모바일 메뉴',
        closeMenu: '메뉴 닫기',
        mobileNavigation: '모바일 네비게이션',
    },

    // =========================================================
    // Common - 공통
    // =========================================================
    common: {
        loading: '로딩 중...',
        processing: '처리 중...',
        error: '오류가 발생했습니다.',
        retry: '다시 시도',
        cancel: '취소',
        confirm: '확인',
        close: '닫기',
        save: '저장',
        delete: '삭제',
        reset: '초기화',
    },

    // =========================================================
    // FilePanel - 파일 패널
    // =========================================================
    filePanel: {
        // UrlInput
        urlHeader: 'URL로 불러오기',
        loadButton: '로드',

        // SampleList
        availableSamples: '사용 가능한 샘플',

        // FileUploadBox
        dragPrompt: '파일을 드래그하거나 클릭하세요',
    },

    // =========================================================
    // Errors - 에러 메시지
    // =========================================================
    errors: {
        // 파일 관련
        emptyFile: '빈 파일입니다.',
        invalidType: (extensions: string) => `허용된 파일 형식: ${extensions}`,
        fileTooLarge: (maxSize: string) =>
            `파일 크기가 너무 큽니다. 최대 ${maxSize}까지 지원합니다.`,

        // URL 관련
        emptyUrl: 'URL을 입력해주세요.',
        invalidUrl: '올바른 URL 형식이 아닙니다.',
        invalidProtocol: 'https:// 또는 http://로 시작해야 합니다.',
        invalidExtension: (extensions: string) =>
            `허용된 파일 형식: ${extensions}`,

        // 뷰어 관련
        viewerError: '뷰어 오류가 발생했습니다.',
        loadFailed: '파일을 불러오는데 실패했습니다.',
    },

    // =========================================================
    // Viewer - 뷰어
    // =========================================================
    viewer: {
        errorTitle: (viewerName: string) => `${viewerName} 오류`,
        errorDescription: '예기치 않은 오류가 발생했습니다.',
        reloadButton: '다시 로드',
    },

    // =========================================================
    // Layout - 레이아웃
    // =========================================================
    layout: {
        menu: '메뉴',
        home: '홈',
        cadViewer: 'CAD 뷰어',
        workerViewer: 'Worker 뷰어',
    },

    // =========================================================
    // CadViewer - CAD 뷰어
    // =========================================================
    cadViewer: {
        errors: {
            invalidType: 'DXF 파일만 업로드 가능합니다 (.dxf)',
            fileTooLarge: (maxMB: number) =>
                `파일 크기가 너무 큽니다. 최대 ${maxMB}MB까지 지원합니다.`,
            parseError: 'DXF 파일 파싱 중 오류가 발생했습니다.',
            emptyFile: '빈 파일이거나 유효한 엔티티가 없습니다.',
        },
        upload: {
            dragPrompt: 'DXF 파일을 드래그하거나 클릭',
            maxSizeText: (maxMB: number) => `최대 ${maxMB}MB`,
            loadingText: '파싱 중...',
        },
    },

    // =========================================================
    // WorkerViewer - Worker 뷰어
    // =========================================================
    workerViewer: {
        errors: {
            fetchError: '모델 파일을 가져오는데 실패했습니다.',
            parseError: 'glTF/glb 파일을 파싱하는데 실패했습니다.',
            notFound: '모델을 찾을 수 없습니다.',
            networkError: '네트워크 오류가 발생했습니다.',
        },
        upload: {
            dragPrompt: 'GLB/GLTF 파일을 드래그하거나 클릭',
            maxSizeText: '최대 50MB',
            loadingText: '모델 로딩 중...',
        },
    },

    // =========================================================
    // Error - 에러 페이지
    // =========================================================
    error: {
        code404: '404',
        codeGeneric: '오류',
        title404: '페이지를 찾을 수 없습니다',
        titleGeneric: '문제가 발생했습니다',
        description404:
            '요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.',
        descriptionGeneric:
            '예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
        backToHome: '홈으로 돌아가기',
    },

    // =========================================================
    // Home - 홈 페이지
    // =========================================================
    home: {
        title: 'Three.js 3D Viewer',
        subtitle: '3D 그래픽 데모 프로젝트',
        footer: 'React Three Fiber 기반 3D 뷰어 프로젝트',
        refreshColorsLabel: '색상 새로고침',
    },
} as const;

/**
 * 타입 추론을 위한 메시지 타입
 */
export type Messages = typeof MESSAGES;
