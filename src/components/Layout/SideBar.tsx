import { Link } from 'react-router-dom';

import { APP_CONFIG, MENU_ITEMS, ROUTES } from '@/constants';
import { MESSAGES } from '@/locales/ko';

import { SideBarMenuItem } from './SideBarMenuItem';

export const SideBar = (): JSX.Element => {
    return (
        <aside
            className="hidden w-64 border-r border-gray-200 bg-white shadow-lg md:block"
            role="complementary"
            aria-label={MESSAGES.aria.sidebar}
        >
            {/* 로고 섹션 */}
            <Link
                to={ROUTES.HOME}
                className="block border-b border-gray-200 p-6 transition-colors hover:bg-gray-50"
                aria-label={`${APP_CONFIG.NAME} 홈으로 이동`}
            >
                <h1 className="text-xl font-bold text-gray-800">
                    {APP_CONFIG.NAME}
                </h1>
                <p className="text-sm text-gray-600">
                    {APP_CONFIG.DESCRIPTION}
                </p>
            </Link>

            {/* 메뉴 섹션 */}
            <nav className="p-4" aria-label={MESSAGES.aria.mainNavigation}>
                <ul className="space-y-2" role="list">
                    {MENU_ITEMS.map((item) => (
                        <SideBarMenuItem key={item.path} item={item} />
                    ))}
                </ul>
            </nav>
        </aside>
    );
};
