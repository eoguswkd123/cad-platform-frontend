/**
 * DXF 샘플 파일 자동 스캔
 * public/samples/dxf/*.dxf 파일을 빌드 타임에 자동 수집
 *
 * 주의: constants.ts가 아닌 utils/dxfSamples.ts에 위치
 * → 하드코딩된 상수가 아닌 동적으로 생성되는 데이터이기 때문
 */
import type { SampleInfo } from '@/components/FilePanel';

const dxfFiles = import.meta.glob('/public/samples/dxf/*.dxf', {
    query: '?url',
    import: 'default',
    eager: true,
});

/** DXF 샘플 파일 목록 (자동 생성) */
export const DXF_SAMPLES: SampleInfo[] = Object.entries(dxfFiles).map(
    ([path, url]) => {
        const filename = path.split('/').pop()!.replace('.dxf', '');
        const name = filename.replace(/[-_]/g, ' ');
        return {
            id: filename.toLowerCase().replace(/[-\s]/g, '_'),
            name: name
                .split(' ')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' '),
            path: String(url),
            format: 'dxf',
        };
    }
);
