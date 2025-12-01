/**
 * API 설정
 */
export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
    TIMEOUT: 10000,
} as const;
