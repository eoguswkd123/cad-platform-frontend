/**
 * errorFormatter - 오류 메시지 정제 유틸리티
 *
 * 사용자에게 노출되는 오류 메시지를 필터링하여
 * 내부 정보(파일 경로, 스택 트레이스 등) 유출을 방지
 */

import type { ErrorInfo } from 'react';

// 기본 오류 메시지 (타입 안정성을 위해 별도 상수로 분리)
const DEFAULT_ERROR_MESSAGE = '오류가 발생했습니다. 다시 시도해주세요.';

// 사용자에게 보여줄 안전한 오류 메시지 매핑
const USER_FRIENDLY_MESSAGES: Record<string, string> = {
    // 네트워크 오류
    'network error': '네트워크 연결을 확인해주세요.',
    timeout: '요청 시간이 초과되었습니다. 다시 시도해주세요.',
    'failed to fetch': '서버에 연결할 수 없습니다.',

    // WebGL/Canvas 오류
    webgl: 'WebGL 초기화에 실패했습니다. 브라우저 설정을 확인해주세요.',
    canvas: '캔버스 렌더링 오류가 발생했습니다.',
    'context lost': 'GPU 컨텍스트가 손실되었습니다. 페이지를 새로고침해주세요.',

    // 파일 오류
    parse: '파일 파싱 중 오류가 발생했습니다.',
    'invalid file': '유효하지 않은 파일 형식입니다.',
    'file too large': '파일 크기가 너무 큽니다.',

    // Three.js 관련
    'three.js': '3D 렌더링 오류가 발생했습니다.',
    geometry: '지오메트리 생성 중 오류가 발생했습니다.',
    material: '재질 처리 중 오류가 발생했습니다.',
};

// 민감한 정보 패턴 (파일 경로, 스택 트레이스 등)
const SENSITIVE_PATTERNS: RegExp[] = [
    /[a-zA-Z]:\\/i, // Windows 경로 (C:\, D:\)
    /\/home\//i, // Unix 경로
    /\/Users\//i, // macOS 경로
    /\/mnt\//i, // WSL 경로
    /at\s+\w+\s*\(/i, // 스택 트레이스 (at functionName ()
    /node_modules/i, // 노드 모듈 경로
    /webpack/i, // 번들러 정보
    /\.tsx?:\d+:\d+/, // 소스 위치 (file.ts:10:5)
    /\.jsx?:\d+:\d+/, // 소스 위치 (file.js:10:5)
    /__webpack/i, // Webpack 내부
    /vite/i, // Vite 내부
    /localhost:\d+/, // 로컬 서버 정보
    /127\.0\.0\.1/, // 로컬 IP
];

/**
 * 민감한 정보 포함 여부 확인
 */
function containsSensitiveInfo(message: string): boolean {
    return SENSITIVE_PATTERNS.some((pattern) => pattern.test(message));
}

/**
 * 알려진 오류 패턴에서 친화적 메시지 찾기
 */
function findFriendlyMessage(message: string): string | null {
    const lowerMessage = message.toLowerCase();

    for (const [keyword, friendlyMessage] of Object.entries(
        USER_FRIENDLY_MESSAGES
    )) {
        if (lowerMessage.includes(keyword)) {
            return friendlyMessage;
        }
    }

    return null;
}

/**
 * 오류 메시지를 사용자 친화적으로 변환
 *
 * @param error - 원본 오류 객체 또는 null
 * @returns 사용자에게 안전하게 보여줄 수 있는 메시지
 *
 * @example
 * ```tsx
 * <p>{formatErrorForUser(error)}</p>
 * ```
 */
export function formatErrorForUser(error: Error | null): string {
    if (!error) {
        return DEFAULT_ERROR_MESSAGE;
    }

    const message = error.message;

    // 1. 민감한 정보가 포함되어 있으면 일반 메시지 반환
    if (containsSensitiveInfo(message)) {
        return DEFAULT_ERROR_MESSAGE;
    }

    // 2. 알려진 오류 패턴 매칭
    const friendlyMessage = findFriendlyMessage(message);
    if (friendlyMessage) {
        return friendlyMessage;
    }

    // 3. 메시지가 짧고 안전해 보이면 그대로 사용 (80자 제한)
    if (message.length <= 80) {
        return message;
    }

    // 4. 그 외의 경우 일반 메시지 반환
    return DEFAULT_ERROR_MESSAGE;
}

/**
 * 개발 환경에서만 경고 로깅
 *
 * @param context - 경고 발생 컨텍스트 (예: "FileUpload", "Validation")
 * @param message - 경고 메시지
 *
 * @example
 * ```tsx
 * logWarn('FileUpload', `Large file detected: ${formatFileSize(file.size)}`);
 * ```
 */
export function logWarn(context: string, message: string): void {
    if (import.meta.env.DEV) {
        console.warn(`[${context}] ${message}`);
    }
}

/**
 * 개발 환경에서만 상세 오류 로깅
 *
 * @param context - 오류 발생 컨텍스트 (예: "CadViewer", "FilePanel")
 * @param error - 오류 객체
 * @param errorInfo - React ErrorInfo (선택적)
 *
 * @example
 * ```tsx
 * componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
 *     logError('CadViewer', error, errorInfo);
 * }
 * ```
 */
export function logError(
    context: string,
    error: Error,
    errorInfo?: ErrorInfo
): void {
    // 개발 환경에서만 상세 로깅
    if (import.meta.env.DEV) {
        console.error(`[${context}] Error:`, error);
        if (errorInfo?.componentStack) {
            console.error(
                `[${context}] Component stack:`,
                errorInfo.componentStack
            );
        }
    }

    // 프로덕션 환경에서는 외부 에러 트래킹 서비스로 전송
    // TODO: Sentry, LogRocket 등 연동 시 아래 주석 해제
    // else {
    //     captureException(error, { context, errorInfo });
    // }
}
