/**
 * MobileDrawer - 모바일 네비게이션 드로어
 *
 * 좌측에서 슬라이드로 열리는 모바일 메뉴
 * - 오버레이 클릭 시 닫힘
 * - ESC 키로 닫힘 (접근성)
 * - 페이지 이동 시 자동 닫힘
 */

import { useCallback, useEffect } from 'react';

import { X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import { APP_CONFIG, MENU_ITEMS, ROUTES } from '@/constants';
import { useMobileMenuStore } from '@/stores/useMobileMenuStore';

import { SideBarMenuItem } from './SideBarMenuItem';

export const MobileDrawer = (): JSX.Element => {
    const { isOpen, close } = useMobileMenuStore();
    const location = useLocation();

    // ESC 키로 닫기
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                close();
            }
        },
        [isOpen, close]
    );

    // 키보드 이벤트 등록
    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    /**
     * 페이지 이동 시 자동으로 드로어 닫기
     *
     * 의도적으로 close를 의존성에서 제외:
     * - close가 deps에 포함되면 무한 루프 발생 가능
     * - location.pathname 변경 시에만 트리거되어야 함
     */
    useEffect(() => {
        if (isOpen) {
            close();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps -- close 포함 시 무한 루프 방지
    }, [location.pathname]);

    // 스크롤 잠금
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

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
                id="mobile-drawer"
                className={`fixed top-0 left-0 z-50 h-full w-64 transform bg-white shadow-xl transition-transform duration-300 ease-in-out md:hidden ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
                role="dialog"
                aria-modal="true"
                aria-label="모바일 메뉴"
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
                        aria-label="메뉴 닫기"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* 메뉴 목록 */}
                <nav className="p-4" aria-label="모바일 네비게이션">
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
