import { APP_CONFIG } from '@/constants';

export const Footer = (): JSX.Element => {
    return (
        <footer className="border-t border-gray-200 bg-gray-50 p-4">
            <div className="text-sm text-gray-600">
                <div className="font-medium">
                    {APP_CONFIG.NAME} v{APP_CONFIG.VERSION}
                </div>
                <div>{APP_CONFIG.COPYRIGHT}</div>
            </div>
        </footer>
    );
};
