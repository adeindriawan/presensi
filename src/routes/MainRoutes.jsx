import { lazy } from 'react';

import MainLayout from '@/layout/MainLayout';
import Loadable from '@/ui-component/Loadable';
import ProtectedRoute from './ProtectedRoute';

const DashboardDefault = Loadable(lazy(() => import('@/views/dashboard/Default')));
const TaskManagement = Loadable(lazy(() => import('@/views/task-management')));
const PresenceRecords = Loadable(lazy(() => import('@/views/presence-records')));

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/',
            element: (
                <ProtectedRoute>
                    <DashboardDefault />
                </ProtectedRoute>
            )
        },
        {
            path: '/task-management',
            element: (
                <ProtectedRoute>
                    <TaskManagement />
                </ProtectedRoute>
            )
        },
        {
            path: '/presence-records',
            element: (
                <ProtectedRoute>
                    <PresenceRecords />
                </ProtectedRoute>
            )
        }
    ]
};

export default MainRoutes;
