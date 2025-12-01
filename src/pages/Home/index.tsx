/**
 * Home Page
 * 대시보드 - 각 데모 페이지로 이동하는 카드 링크
 */
import { Link } from 'react-router-dom';
import { Coffee } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

interface DemoCardProps {
    to: string;
    title: string;
    description: string;
    icon: React.ReactNode;
}

function DemoCard({ to, title, description, icon }: DemoCardProps) {
    return (
        <Link
            to={to}
            className="group block p-6 bg-gray-800 rounded-lg border border-gray-700 hover:border-blue-500 hover:bg-gray-750 transition-all duration-200"
        >
            <div className="flex items-center gap-4 mb-3">
                <div className="p-3 bg-blue-600/20 rounded-lg text-blue-400 group-hover:bg-blue-600/30 transition-colors">
                    {icon}
                </div>
                <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {title}
                </h3>
            </div>
            <p className="text-gray-400 text-sm">{description}</p>
        </Link>
    );
}

export default function HomePage() {
    return (
        <div className="min-h-full bg-gray-900 p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Three.js 3D Viewer</h1>
                <p className="text-gray-400">3D 그래픽 데모 프로젝트</p>
            </div>

            {/* Demo Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DemoCard
                    to={ROUTES.TEAPOT_DEMO}
                    title="Teapot Demo"
                    description="Utah Teapot 와이어프레임 예제. 6가지 쉐이딩 모드와 테셀레이션 조절을 지원합니다."
                    icon={<Coffee size={24} />}
                />
            </div>

            {/* Footer Info */}
            <div className="mt-12 pt-6 border-t border-gray-800">
                <p className="text-gray-500 text-sm">
                    React Three Fiber 기반 3D 뷰어 프로젝트
                </p>
            </div>
        </div>
    );
}
