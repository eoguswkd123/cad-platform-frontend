/**
 * MobileHeader - 모바일 상단 헤더
 *
 * 모바일 화면에서 표시되는 햄버거 메뉴 버튼과 앱 로고
 * 데스크톱(md 이상)에서는 숨김
 */

import { Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

import { APP_CONFIG, ROUTES } from '@/constants';
import { useMobileMenuStore } from '@/stores/useMobileMenuStore';

export const MobileHeader = (): JSX.Element => {
    const toggle = useMobileMenuStore((state) => state.toggle);

    return (
        <header
            className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 shadow-sm md:hidden"
            role="banner"
        >
            {/* 햄버거 메뉴 버튼 */}
            <button
                type="button"
                onClick={toggle}
                className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                aria-label="메뉴 열기"
                aria-expanded="false"
                aria-controls="mobile-drawer"
            >
                <Menu className="h-6 w-6" />
            </button>

            {/* 앱 로고/이름 */}
            <Link
                to={ROUTES.HOME}
                className="text-lg font-bold text-gray-800"
                aria-label={`${APP_CONFIG.NAME} 홈으로 이동`}
            >
                {APP_CONFIG.NAME}
            </Link>

            {/* 우측 공간 (균형용) */}
            <div className="w-10" aria-hidden="true" />
        </header>
    );
};
