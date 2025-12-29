/**
 * fileValidator.test.ts
 * 파일 유효성 검사 유틸리티 통합 테스트
 *
 * 주요 테스트:
 * - formatFileSize 정상 동작
 * - validateDXFMagicBytes 매직 바이트 검증
 * - validateFile, validateExtension, shouldShowSizeWarning
 */

import { describe, it, expect } from 'vitest';

import {
    formatFileSize,
    validateFile,
    validateExtension,
    validateDXFMagicBytes,
    shouldShowSizeWarning,
    type FileUploadConfig,
} from '../fileValidator';

// ============================================================================
// 테스트 헬퍼
// ============================================================================

/** 테스트용 File 객체 생성 */
function createTestFile(
    name: string,
    sizeInBytes: number = 100,
    content?: string
): File {
    if (content) {
        return new File([content], name);
    }
    const buffer = new ArrayBuffer(sizeInBytes);
    return new File([buffer], name);
}

/** 테스트용 DXF 설정 */
const DXF_CONFIG: FileUploadConfig = {
    accept: { extensions: ['.dxf'] },
    limits: { maxSize: 50 * 1024 * 1024, warnSize: 10 * 1024 * 1024 },
};

// ============================================================================
// formatFileSize 테스트
// ============================================================================

describe('formatFileSize', () => {
    describe('바이트 단위 (0 - 1023 B)', () => {
        it('0 바이트를 "0 B"로 반환한다', () => {
            expect(formatFileSize(0)).toBe('0 B');
        });

        it('1 바이트를 "1 B"로 반환한다', () => {
            expect(formatFileSize(1)).toBe('1 B');
        });

        it('500 바이트를 "500 B"로 반환한다', () => {
            expect(formatFileSize(500)).toBe('500 B');
        });

        it('1023 바이트를 "1023 B"로 반환한다 (KB 미만 경계)', () => {
            expect(formatFileSize(1023)).toBe('1023 B');
        });
    });

    describe('킬로바이트 단위 (1024 B - 1048575 B)', () => {
        it('1024 바이트를 "1.0 KB"로 반환한다 (정확히 1 KB)', () => {
            expect(formatFileSize(1024)).toBe('1.0 KB');
        });

        it('1536 바이트를 "1.5 KB"로 반환한다', () => {
            expect(formatFileSize(1536)).toBe('1.5 KB');
        });

        it('10240 바이트를 "10.0 KB"로 반환한다', () => {
            expect(formatFileSize(10240)).toBe('10.0 KB');
        });

        it('102400 바이트를 "100.0 KB"로 반환한다', () => {
            expect(formatFileSize(102400)).toBe('100.0 KB');
        });

        it('1048575 바이트를 "1024.0 KB"로 반환한다 (MB 미만 경계)', () => {
            expect(formatFileSize(1048575)).toBe('1024.0 KB');
        });
    });

    describe('메가바이트 단위 (1048576 B 이상)', () => {
        it('1048576 바이트를 "1.00 MB"로 반환한다 (정확히 1 MB)', () => {
            expect(formatFileSize(1048576)).toBe('1.00 MB');
        });

        it('1572864 바이트를 "1.50 MB"로 반환한다', () => {
            expect(formatFileSize(1572864)).toBe('1.50 MB');
        });

        it('2097152 바이트를 "2.00 MB"로 반환한다 (정확히 2 MB)', () => {
            expect(formatFileSize(2097152)).toBe('2.00 MB');
        });

        it('10485760 바이트를 "10.00 MB"로 반환한다', () => {
            expect(formatFileSize(10485760)).toBe('10.00 MB');
        });

        it('104857600 바이트를 "100.00 MB"로 반환한다', () => {
            expect(formatFileSize(104857600)).toBe('100.00 MB');
        });

        it('1073741824 바이트를 "1024.00 MB"로 반환한다 (1 GB)', () => {
            expect(formatFileSize(1073741824)).toBe('1024.00 MB');
        });
    });

    describe('소수점 정밀도', () => {
        it('KB는 소수점 1자리로 표시한다', () => {
            const result = formatFileSize(1500);
            const decimalPart = result.split('.')[1];
            expect(decimalPart).toMatch(/^\d KB$/);
        });

        it('MB는 소수점 2자리로 표시한다', () => {
            const result = formatFileSize(1500000);
            const decimalPart = result.split('.')[1];
            expect(decimalPart).toMatch(/^\d{2} MB$/);
        });

        it('KB 반올림이 올바르게 동작한다', () => {
            expect(formatFileSize(1495)).toBe('1.5 KB');
        });

        it('MB 반올림이 올바르게 동작한다', () => {
            expect(formatFileSize(1106296)).toBe('1.06 MB');
        });
    });

    describe('경계값 테스트', () => {
        it('B와 KB 경계: 1023 -> 1024', () => {
            expect(formatFileSize(1023)).toBe('1023 B');
            expect(formatFileSize(1024)).toBe('1.0 KB');
        });

        it('KB와 MB 경계: 1048575 -> 1048576', () => {
            expect(formatFileSize(1048575)).toBe('1024.0 KB');
            expect(formatFileSize(1048576)).toBe('1.00 MB');
        });
    });

    describe('엣지 케이스', () => {
        it('음수 값을 처리한다', () => {
            const result = formatFileSize(-1);
            expect(result).toBe('-1 B');
        });

        it('매우 작은 양수를 처리한다', () => {
            expect(formatFileSize(0.5)).toBe('0.5 B');
        });

        it('정수가 아닌 바이트 값을 처리한다', () => {
            expect(formatFileSize(1.7)).toBe('1.7 B');
        });
    });

    describe('실제 사용 시나리오', () => {
        it('일반적인 문서 파일 크기 (50 KB)', () => {
            expect(formatFileSize(51200)).toBe('50.0 KB');
        });

        it('일반적인 이미지 파일 크기 (2.5 MB)', () => {
            expect(formatFileSize(2621440)).toBe('2.50 MB');
        });

        it('일반적인 DXF 파일 크기 (500 KB)', () => {
            expect(formatFileSize(512000)).toBe('500.0 KB');
        });

        it('대용량 CAD 파일 크기 (50 MB)', () => {
            expect(formatFileSize(52428800)).toBe('50.00 MB');
        });
    });
});

// ============================================================================
// validateDXFMagicBytes 테스트
// ============================================================================

/**
 * validateDXFMagicBytes 테스트
 *
 * NOTE: jsdom 환경에서 File.slice().text() API가 제대로 동작하지 않음
 * 이 테스트들은 브라우저 환경(E2E/Playwright)에서 수행 필요
 * 현재는 함수 존재 및 반환 타입만 검증
 */
describe('validateDXFMagicBytes', () => {
    it('함수가 존재하고 Promise를 반환한다', () => {
        expect(typeof validateDXFMagicBytes).toBe('function');

        const emptyFile = new File([], 'test.dxf');
        const result = validateDXFMagicBytes(emptyFile);

        expect(result).toBeInstanceOf(Promise);
    });

    it('반환값이 valid 속성을 가진다', async () => {
        const emptyFile = new File([], 'test.dxf');
        const result = await validateDXFMagicBytes(emptyFile);

        expect(result).toHaveProperty('valid');
        expect(typeof result.valid).toBe('boolean');
    });

    it('무효한 경우 error 객체를 반환한다', async () => {
        const emptyFile = new File([], 'test.dxf');
        const result = await validateDXFMagicBytes(emptyFile);

        // 빈 파일은 무효
        expect(result.valid).toBe(false);
        expect(result.error).toBeDefined();
        expect(result.error).toHaveProperty('code');
        expect(result.error).toHaveProperty('message');
    });
});

// ============================================================================
// validateFile 테스트
// ============================================================================

describe('validateFile', () => {
    it('모든 조건 충족 시 valid: true 반환', () => {
        const file = createTestFile('test.dxf', 1024);
        const result = validateFile(file, DXF_CONFIG);

        expect(result.valid).toBe(true);
        expect(result.error).toBeUndefined();
    });

    it('빈 파일은 valid: false 반환', () => {
        const file = createTestFile('test.dxf', 0);
        const result = validateFile(file, DXF_CONFIG);

        expect(result.valid).toBe(false);
        expect(result.error?.code).toBe('EMPTY_FILE');
    });

    it('확장자 오류 시 해당 에러 반환', () => {
        const file = createTestFile('test.pdf', 1024);
        const result = validateFile(file, DXF_CONFIG);

        expect(result.valid).toBe(false);
        expect(result.error?.code).toBe('INVALID_TYPE');
    });

    it('크기 초과 시 해당 에러 반환', () => {
        const file = createTestFile('test.dxf', 100 * 1024 * 1024); // 100MB
        const result = validateFile(file, DXF_CONFIG);

        expect(result.valid).toBe(false);
        expect(result.error?.code).toBe('FILE_TOO_LARGE');
    });
});

// ============================================================================
// validateExtension 테스트
// ============================================================================

describe('validateExtension', () => {
    it('유효한 확장자는 valid: true 반환', () => {
        const result = validateExtension('model.dxf', ['.dxf']);

        expect(result.valid).toBe(true);
    });

    it('대소문자 무관하게 확장자 허용', () => {
        expect(validateExtension('model.DXF', ['.dxf']).valid).toBe(true);
        expect(validateExtension('model.Dxf', ['.dxf']).valid).toBe(true);
    });

    it('유효하지 않은 확장자는 valid: false 반환', () => {
        const result = validateExtension('model.pdf', ['.dxf']);

        expect(result.valid).toBe(false);
        expect(result.error?.code).toBe('INVALID_EXTENSION');
    });

    it('여러 확장자 중 하나라도 매칭되면 valid: true', () => {
        expect(validateExtension('model.glb', ['.gltf', '.glb']).valid).toBe(
            true
        );
        expect(validateExtension('model.gltf', ['.gltf', '.glb']).valid).toBe(
            true
        );
    });

    it('URL pathname에서도 동작', () => {
        const pathname = '/models/sample.dxf';
        const result = validateExtension(pathname, ['.dxf']);

        expect(result.valid).toBe(true);
    });
});

// ============================================================================
// shouldShowSizeWarning 테스트
// ============================================================================

describe('shouldShowSizeWarning', () => {
    it('경고 크기 초과 시 true 반환', () => {
        const file = createTestFile('test.dxf', 15 * 1024 * 1024); // 15MB
        expect(shouldShowSizeWarning(file, 10 * 1024 * 1024)).toBe(true);
    });

    it('경고 크기 이하면 false 반환', () => {
        const file = createTestFile('test.dxf', 5 * 1024 * 1024); // 5MB
        expect(shouldShowSizeWarning(file, 10 * 1024 * 1024)).toBe(false);
    });

    it('경고 크기가 undefined면 false 반환', () => {
        const file = createTestFile('test.dxf', 100 * 1024 * 1024);
        expect(shouldShowSizeWarning(file, undefined)).toBe(false);
    });
});
