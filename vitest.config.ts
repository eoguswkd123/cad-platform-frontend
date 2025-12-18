import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./tests/setup/vitest-setup.ts'],

        // 성능 최적화: 캐시 활성화
        cache: { dir: './node_modules/.vitest' },

        // 테스트 파일 패턴 (Co-located + Integration)
        include: [
            'src/**/__tests__/**/*.test.{ts,tsx}',
            'tests/integration/**/*.test.{ts,tsx}',
        ],
        exclude: ['node_modules', 'dist', 'tests/e2e/**'],

        // 커버리지 설정
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            reportsDirectory: './coverage',
            include: ['src/**/*.{ts,tsx}'],
            exclude: [
                'node_modules/',
                'tests/',
                '**/*.d.ts',
                '**/*.config.*',
                '**/__tests__/**',
                '**/index.ts',
                '**/types.ts',
                '**/constants.ts',
                'src/main.tsx',
                'src/vite-env.d.ts',
            ],
            // 커버리지 임계값 (현재: MVP 기준, 목표: 70% line, 60% branch)
            thresholds: {
                statements: 20,
                branches: 50,
                functions: 50,
                lines: 20,
            },
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@tests': path.resolve(__dirname, './tests'),
        },
    },
});
