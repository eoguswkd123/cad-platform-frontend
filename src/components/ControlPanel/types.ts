/**
 * ControlPanel - Type Definitions
 *
 * 컨트롤 패널 컴포넌트 공통 타입 정의
 */

/** Shading Mode 타입 */
export type ShadingMode = 'wireframe' | 'flat' | 'smooth' | 'glossy';

/** Reset Icon 타입 */
export type ResetIconType = 'rotate' | 'home';

/**
 * ViewerActionButtons Props
 *
 * @see {@link ViewerActionButtons}
 */
export interface ViewerActionButtonsProps {
    /** 리셋 핸들러 */
    onReset: () => void;
    /** 클리어 핸들러 (없으면 클리어 버튼 숨김) */
    onClear?: (() => void) | undefined;
    /** 리셋 버튼 라벨 */
    resetLabel?: string;
    /** 클리어 버튼 라벨 */
    clearLabel?: string;
    /** 리셋 아이콘 타입 */
    resetIcon?: ResetIconType;
}
