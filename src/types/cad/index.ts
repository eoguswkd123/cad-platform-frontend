/**
 * CAD Types - Barrel Export
 *
 * 공유 CAD 타입 정의
 * - entity.ts: CAD 엔티티 데이터 모델
 */

export type {
    // Base types
    Point3D,
    BoundingBox,
    LayerInfo,
    CADMetadata,
    // Parsed entities
    ParsedLine,
    ParsedCircle,
    ParsedArc,
    ParsedPolyline,
    // Hatch types
    HatchBoundaryType,
    HatchBoundaryPolyline,
    HatchBoundaryCircle,
    HatchBoundaryArc,
    HatchBoundaryEllipse,
    HatchBoundaryPath,
    ParsedHatch,
    // Text types
    TextHorizontalAlignment,
    ParsedText,
    MTextAttachment,
    ParsedMText,
    // Curve types
    ParsedEllipse,
    ParsedSpline,
    // Dimension types
    DimensionType,
    ParsedDimension,
    // Aggregate
    ParsedCADData,
} from './entity';

/** CAD 렌더링 모드 */
export type CadRenderMode = 'wireframe' | 'solid' | 'pattern';
