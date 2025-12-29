/**
 * DropZone - Type Definitions
 *
 * 범용 드래그앤드롭 컴포넌트 타입
 */

/** Render Props로 전달되는 상태 */
export interface DropZoneRenderProps {
    /** 드래그 오버 상태 */
    isDragOver: boolean;
    /** 파일 선택 다이얼로그 열기 */
    openFilePicker: () => void;
}

/** DropZone children 타입 - ReactNode 또는 Render Props 함수 */
export type DropZoneChildren =
    | React.ReactNode
    | ((props: DropZoneRenderProps) => React.ReactNode);

/**
 * 타입 가드: children이 Render Props 함수인지 확인
 * @param children - DropZone의 children prop
 * @returns children이 함수이면 true
 */
export function isRenderPropChildren(
    children: DropZoneChildren
): children is (props: DropZoneRenderProps) => React.ReactNode {
    return typeof children === 'function';
}

/** DropZone Props */
export interface DropZoneProps {
    /** 파일 드롭 콜백 (단일 파일) */
    onDrop: (file: File) => void;
    /** 다중 파일 드롭 콜백 (multiple=true일 때 사용) */
    onDropMultiple?: (files: File[]) => void;
    /** 허용 확장자 (예: ['.glb', '.gltf']) */
    accept?: readonly string[];
    /** 다중 파일 선택 허용 */
    multiple?: boolean;
    /** 비활성화 */
    disabled?: boolean;
    /** 렌더링 함수 또는 React 노드 */
    children: DropZoneChildren;
    /** 컨테이너 클래스 */
    className?: string;
}
