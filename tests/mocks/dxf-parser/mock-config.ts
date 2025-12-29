/**
 * DXF Parser Mock Configuration
 * dxf-parser 라이브러리 모킹 설정
 */

import type { DxfParseResult, MockDxfParserConfig } from './types';

/**
 * 모킹 설정 객체
 * 테스트에서 동적으로 파싱 결과를 변경할 때 사용
 */
export const mockDxfParserConfig: MockDxfParserConfig = {
    parseResult: null,
    shouldThrow: false,
    throwError: null,
};

/**
 * 모킹 설정 초기화
 */
export function resetMockDxfParser(): void {
    mockDxfParserConfig.parseResult = null;
    mockDxfParserConfig.shouldThrow = false;
    mockDxfParserConfig.throwError = null;
}

/**
 * 파싱 성공 설정
 * @param result 반환할 DXF 파싱 결과
 */
export function setParseSuccess(result: DxfParseResult): void {
    mockDxfParserConfig.parseResult = result;
    mockDxfParserConfig.shouldThrow = false;
    mockDxfParserConfig.throwError = null;
}

/**
 * 파싱 실패 설정 (null 반환)
 */
export function setParseFailure(): void {
    mockDxfParserConfig.parseResult = null;
    mockDxfParserConfig.shouldThrow = false;
    mockDxfParserConfig.throwError = null;
}

/**
 * 파싱 예외 설정
 * @param error 발생시킬 에러 (기본값: 'Mock parse error')
 */
export function setParseException(error?: Error): void {
    mockDxfParserConfig.parseResult = null;
    mockDxfParserConfig.shouldThrow = true;
    mockDxfParserConfig.throwError = error ?? new Error('Mock parse error');
}
