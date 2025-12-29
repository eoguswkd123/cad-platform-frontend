/**
 * URL 보안 설정
 * SSRF 방지를 위한 화이트리스트 기반 URL 검증
 *
 * 모든 Feature에서 공통으로 사용하는 기본 설정
 */

/** 기본 허용 호스트 (공통) */
export const BASE_ALLOWED_HOSTS = [
    'localhost',
    '127.0.0.1',
    'github.com',
    'raw.githubusercontent.com',
    'gitlab.com',
    'bitbucket.org',
] as const;

/** 기본 URL 보안 설정 */
export const BASE_URL_SECURITY_CONFIG = {
    /** 허용된 프로토콜 (프로덕션: https만, 개발: http도 허용) */
    allowedProtocols: (import.meta.env.PROD
        ? ['https:']
        : ['https:', 'http:']) as readonly string[],
    /** 기본 허용 호스트 */
    allowedHosts: BASE_ALLOWED_HOSTS,
    /** fetch 타임아웃 (ms) */
    fetchTimeout: 30000,
} as const;

/** Feature별 URL 보안 설정 생성 헬퍼 */
export function createUrlSecurityConfig(options: {
    additionalHosts?: readonly string[];
    maxResponseSize: number;
}) {
    return {
        ...BASE_URL_SECURITY_CONFIG,
        allowedHosts: [
            ...BASE_ALLOWED_HOSTS,
            ...(options.additionalHosts ?? []),
        ] as readonly string[],
        maxResponseSize: options.maxResponseSize,
    } as const;
}
