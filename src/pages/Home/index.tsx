/**
 * Home Page
 * 대시보드 - 각 데모 페이지로 이동하는 카드 링크
 */
import { useState } from 'react';

import { MENU_ITEMS, ROUTES } from '@/constants';
import { MESSAGES } from '@/locales';

import { DemoCard } from './DemoCard';

export default function HomePage() {
    // HOME 제외한 메뉴 아이템
    const menuItems = MENU_ITEMS.filter((item) => item.path !== ROUTES.HOME);

    // 페이지 마운트 시 랜덤 hue 값 생성 (menuItems 수 기반)
    const [cardHues, setCardHues] = useState(() =>
        Array.from({ length: menuItems.length }, () =>
            Math.floor(Math.random() * 360)
        )
    );
    const [iconHues, setIconHues] = useState(() =>
        Array.from({ length: menuItems.length }, () =>
            Math.floor(Math.random() * 360)
        )
    );

    // 색상 새로고침
    const refreshColors = () => {
        setCardHues(
            Array.from({ length: menuItems.length }, () =>
                Math.floor(Math.random() * 360)
            )
        );
        setIconHues(
            Array.from({ length: menuItems.length }, () =>
                Math.floor(Math.random() * 360)
            )
        );
    };

    return (
        <div className="min-h-full bg-gray-50 p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="mb-2 text-3xl font-bold text-gray-800">
                    <button
                        type="button"
                        onClick={refreshColors}
                        className="cursor-pointer rounded transition-colors hover:text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                        aria-label={MESSAGES.home.refreshColorsLabel}
                    >
                        {MESSAGES.home.title}
                    </button>
                </h1>
                <p className="text-gray-600">{MESSAGES.home.subtitle}</p>
            </div>

            {/* Demo Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {menuItems.map((item, index) => (
                    <DemoCard
                        key={item.path}
                        to={item.path}
                        title={item.label}
                        description={item.description}
                        icon={<item.icon size={24} />}
                        hue={cardHues[index] ?? 0}
                        iconHue={iconHues[index] ?? 0}
                    />
                ))}
            </div>

            {/* Footer Info */}
            <div className="mt-12 border-t border-gray-200 pt-6">
                <p className="text-sm text-gray-500">{MESSAGES.home.footer}</p>
            </div>
        </div>
    );
}
