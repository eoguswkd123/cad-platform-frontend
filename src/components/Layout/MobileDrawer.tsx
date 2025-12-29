/**
 * MobileDrawer - 모바일 네비게이션 드로어
 *
 * 좌측에서 슬라이드로 열리는 모바일 메뉴
 * - 오버레이 클릭 시 닫힘
 * - ESC 키로 닫힘 (접근성)
 * - 페이지 이동 시 자동 닫힘
 * - 키보드 트랩 (Tab 키가 모달 내부에서만 순환)
 */

import { X } from 'lucide-react';
import { Link } from 'react-router-dom';

import { APP_CONFIG, MENU_ITEMS, ROUTES } from '@/constants';
import { useMobileDrawer } from '@/hooks';
import { MESSAGES } from '@/locales/ko';
import { useMobileMenuStore } from '@/stores/useMobileMenuStore';

import { SideBarMenuItem } from './SideBarMenuItem';

export const MobileDrawer = (): JSX.Element => {
    const { isOpen, close } = useMobileMenuStore();
    const { drawerRef } = useMobileDrawer(isOpen, close);

    return (
        <>
            {/* 오버레이 */}
            <div
                className={`fixed inset-0 z-40 bg-black transition-opacity duration-300 md:hidden ${
                    isOpen ? 'opacity-50' : 'pointer-events-none opacity-0'
                }`}
                onClick={close}
                aria-hidden="true"
            />

            {/* 드로어 패널 */}
            <aside
                ref={drawerRef}
                id="mobile-drawer"
                className={`fixed top-0 left-0 z-50 h-full w-64 transform bg-white shadow-xl transition-transform duration-300 ease-in-out md:hidden ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
                role="dialog"
                aria-modal="true"
                aria-label={MESSAGES.aria.mobileMenu}
            >
                {/* 헤더 */}
                <div className="flex items-center justify-between border-b border-gray-200 p-4">
                    <Link
                        to={ROUTES.HOME}
                        className="text-lg font-bold text-gray-800"
                        aria-label={`${APP_CONFIG.NAME} 홈으로 이동`}
                    >
                        {APP_CONFIG.NAME}
                    </Link>
                    <button
                        type="button"
                        onClick={close}
                        className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        aria-label={MESSAGES.aria.closeMenu}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* 메뉴 목록 */}
                <nav
                    className="p-4"
                    aria-label={MESSAGES.aria.mobileNavigation}
                >
                    <ul className="space-y-2" role="list">
                        {MENU_ITEMS.map((item) => (
                            <SideBarMenuItem key={item.path} item={item} />
                        ))}
                    </ul>
                </nav>
            </aside>
        </>
    );
};
