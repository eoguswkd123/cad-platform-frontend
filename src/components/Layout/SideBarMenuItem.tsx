import { memo } from 'react';

import { NavLink } from 'react-router-dom';

import type { MenuItem as MenuItemType } from '@/types/menu';

interface SideBarMenuItemProps {
    item: MenuItemType;
}

function SideBarMenuItemComponent({ item }: SideBarMenuItemProps): JSX.Element {
    return (
        <li>
            <NavLink
                to={item.path}
                aria-label={item.description}
                className={({ isActive }) =>
                    `flex items-center rounded-lg px-4 py-3 transition-colors ${
                        isActive
                            ? 'border-r-2 border-blue-700 bg-blue-50 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`
                }
            >
                {({ isActive }) => (
                    <>
                        <span
                            aria-current={isActive ? 'page' : undefined}
                            className="sr-only"
                        >
                            {isActive ? '현재 페이지: ' : ''}
                        </span>
                        <item.icon className="mr-3 h-5 w-5" />
                        <div>
                            <div className="font-medium">{item.label}</div>
                            <div className="text-xs text-gray-500">
                                {item.description}
                            </div>
                        </div>
                    </>
                )}
            </NavLink>
        </li>
    );
}

export const SideBarMenuItem = memo(SideBarMenuItemComponent);
