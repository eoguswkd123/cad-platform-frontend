/**
 * CadViewer Services - Barrel Export
 */

export type {
    WorkerErrorCode,
    WorkerErrorPayload,
    WorkerProgressPayload,
    WorkerRequest,
    WorkerResponse,
    WorkerSuccessPayload,
} from '../types';

export { aciToHex, getArcBounds, isAngleInArc } from './entityMath';

// 공유 엔티티 파서
export {
    parseAllEntities,
    parseArc,
    parseCircle,
    parseHatch,
    parseHatchBoundary,
    parseLine,
    parsePolyline,
    getTotalEntityCount,
    toPoint3D,
    toPoint3DArray,
} from './entityParsers';

export type { ParsedEntities } from './entityParsers';
