/**
 * DXF Parser Mock Types
 * DXF 파싱 테스트에 사용되는 타입 정의
 */

import type { DXFLibEntity, DXFLibLayer } from '@/features/CadViewer/types';

/**
 * DXF 파싱 결과 타입
 */
export interface DxfParseResult {
    entities: DXFLibEntity[];
    tables?: {
        layer?: {
            layers: Record<string, DXFLibLayer>;
        };
    };
}

/**
 * 모킹 설정 객체 타입
 */
export interface MockDxfParserConfig {
    /** parseSync 반환값 (null이면 파싱 실패) */
    parseResult: DxfParseResult | null;
    /** true면 parseSync에서 예외 발생 */
    shouldThrow: boolean;
    /** shouldThrow가 true일 때 발생할 에러 */
    throwError: Error | null;
}
