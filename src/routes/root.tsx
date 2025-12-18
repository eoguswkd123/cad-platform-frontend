import { lazy } from 'react';

import { createBrowserRouter } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';

const MainLayout = lazy(() =>
    import('@/components/Layout').then((m) => ({ default: m.MainLayout }))
);
const ErrorPage = lazy(() => import('@/pages/Error'));
const Home = lazy(() => import('@/pages/Home'));
const TeapotDemo = lazy(() => import('@/pages/TeapotDemo'));
const CadViewer = lazy(() => import('@/pages/CadViewer'));
const WorkerViewer = lazy(() => import('@/pages/WorkerViewer'));

export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: ROUTES.TEAPOT_DEMO,
                element: <TeapotDemo />,
            },
            {
                path: ROUTES.CAD_VIEWER,
                element: <CadViewer />,
            },
            {
                path: ROUTES.WORKER_VIEWER,
                element: <WorkerViewer />,
            },
        ],
    },
]);

export default router;
