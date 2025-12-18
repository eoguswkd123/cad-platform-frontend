/**
 * Type declarations for dxf-parser
 * 외부 npm 패키지 타입 선언 (최소화)
 *
 * 라이브러리 출력 데이터 타입은 @/types/dxf/library.ts 참조
 */

declare module 'dxf-parser' {
    /**
     * dxf-parser 라이브러리가 반환하는 파싱 결과
     * 상세 타입은 @/types/dxf/library.ts의 DXFLib* 타입 사용
     */
    interface ParsedDXF {
        header?: Record<string, unknown>;
        tables?: {
            layer?: {
                layers: Record<string, unknown>;
            };
            [key: string]: unknown;
        };
        blocks?: Record<string, unknown>;
        entities: unknown[];
    }

    /**
     * DXF 파서 클래스
     */
    class DxfParser {
        /**
         * 동기식 파싱
         * @param content DXF 파일 텍스트 내용
         * @returns 파싱된 DXF 객체
         */
        parseSync(content: string): ParsedDXF;

        /**
         * 비동기식 파싱 (콜백)
         * @param content DXF 파일 텍스트 내용
         * @param done 완료 콜백
         */
        parse(
            content: string,
            done: (error: Error | null, dxf: ParsedDXF | null) => void
        ): void;
    }

    export = DxfParser;
}
