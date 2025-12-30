/**
 * CAD Utilities - Barrel Export
 *
 * CAD 관련 유틸리티 함수 및 클래스
 */

// Texture Cache Manager
export {
    LRUTextureCache,
    getPatternTextureCache,
    resetPatternTextureCache,
    DEFAULT_TEXTURE_CACHE_CONFIG,
} from './TextureCacheManager';

export type { CacheStats, TextureCacheConfig } from './TextureCacheManager';

// DXF to Geometry Converter
export {
    // Geometry 변환 함수
    linesToGeometry,
    circlesToGeometry,
    arcsToGeometry,
    polylinesToGeometry,
    hatchBoundariesToWireframe,
    hatchesToSolidGeometries,
    createPatternTexture,
    clearPatternTextureCache,
    cadDataToGeometry,
    calculateBounds,
    calculateCameraDistance,
    ellipsesToGeometry,
    splinesToGeometry,
} from './dxfToGeometry';

export type { HatchGeometryData } from './dxfToGeometry';

// CAD Data Utilities
export {
    filterDataByLayerName,
    filterHatchesByLayerName,
    calculateDataCenter,
    getTextAnchors,
    getWireframeEntityCount,
} from './cadDataUtils';
