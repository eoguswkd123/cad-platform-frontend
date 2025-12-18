/**
 * ErrorPage - 에러 페이지 컴포넌트
 *
 * React Router v6의 errorElement로 사용
 * - 404 에러: 페이지를 찾을 수 없음 UI
 * - 기타 에러: 일반 오류 발생 UI
 */

import { Home, AlertTriangle, FileQuestion } from 'lucide-react';
import { Link, useRouteError, isRouteErrorResponse } from 'react-router-dom';

import { ROUTES } from '@/constants';

export default function ErrorPage(): JSX.Element {
    const error = useRouteError();

    // 404 에러 여부 확인
    const is404 = isRouteErrorResponse(error) && error.status === 404;

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
            <div className="text-center">
                {/* 아이콘 */}
                <div className="mb-6 flex justify-center">
                    {is404 ? (
                        <FileQuestion className="h-24 w-24 text-gray-400" />
                    ) : (
                        <AlertTriangle className="h-24 w-24 text-red-400" />
                    )}
                </div>

                {/* 에러 코드 */}
                <h1 className="mb-2 text-6xl font-bold text-gray-800">
                    {is404 ? '404' : '오류'}
                </h1>

                {/* 에러 메시지 */}
                <h2 className="mb-4 text-2xl font-semibold text-gray-700">
                    {is404
                        ? '페이지를 찾을 수 없습니다'
                        : '문제가 발생했습니다'}
                </h2>

                {/* 상세 설명 */}
                <p className="mb-8 max-w-md text-gray-500">
                    {is404
                        ? '요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.'
                        : '예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'}
                </p>

                {/* 홈으로 이동 버튼 */}
                <Link
                    to={ROUTES.HOME}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                >
                    <Home className="h-5 w-5" />
                    홈으로 돌아가기
                </Link>
            </div>
        </div>
    );
}
