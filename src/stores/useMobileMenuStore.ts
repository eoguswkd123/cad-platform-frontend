/**
 * useMobileMenuStore - 모바일 메뉴 상태 관리
 *
 * 모바일 햄버거 메뉴의 열림/닫힘 상태를 관리하는 Zustand 스토어
 */

import { create } from 'zustand';

/** 모바일 메뉴 상태 인터페이스 */
interface MobileMenuState {
    /** 메뉴 열림 상태 */
    isOpen: boolean;
    /** 메뉴 열기 */
    open: () => void;
    /** 메뉴 닫기 */
    close: () => void;
    /** 메뉴 토글 */
    toggle: () => void;
}

export const useMobileMenuStore = create<MobileMenuState>((set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
    toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));
