/**
 * GLTF/GLB 샘플 파일 자동 스캔
 * utils/ 폴더에 위치 (짧은 로직, React 없음)
 */
import type { SampleInfo } from '@/components/FilePanel';

/**
 * GLB 샘플 파일 자동 스캔
 * public/samples/glb/*.glb 파일을 빌드 타임에 자동 수집
 */
const glbFiles = import.meta.glob('/public/samples/glb/*.glb', {
    query: '?url',
    import: 'default',
    eager: true,
});

/**
 * GLTF 샘플 파일 자동 스캔 (중첩 폴더 지원)
 * public/samples/gltf/**\/*.gltf 파일을 빌드 타임에 자동 수집
 */
const gltfFiles = import.meta.glob('/public/samples/gltf/**/*.gltf', {
    query: '?url',
    import: 'default',
    eager: true,
});

/** GLTF/GLB 샘플 파일 목록 (자동 생성) */
export const GLTF_SAMPLES: SampleInfo[] = [
    // GLB 파일
    ...Object.entries(glbFiles).map(([path, url]) => {
        const filename = path.split('/').pop()!.replace('.glb', '');
        return {
            id: filename.toLowerCase(),
            name: filename,
            path: String(url),
            format: 'glb' as const,
        };
    }),
    // GLTF 파일 (중첩 폴더 구조)
    ...Object.entries(gltfFiles).map(([path, url]) => {
        const filename = path.split('/').pop()!.replace('.gltf', '');
        return {
            id: filename.toLowerCase(),
            name: filename,
            path: String(url),
            format: 'gltf' as const,
        };
    }),
];
