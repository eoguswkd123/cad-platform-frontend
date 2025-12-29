import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [react()],
    cacheDir: './node_modules/.vitest',
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./tests/setup/vitest-setup.ts'],

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
            // 커버리지 임계값 (단계적 증가: 20→40→60→70)
            thresholds: {
                statements: 40,
                branches: 50,
                functions: 50,
                lines: 40,
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
