import Loadable from '@/ui-component/Loadable';
import MainLayout from '@/layout/MainLayout';
import ProtectedRoute from './ProtectedRoute';
import { lazy } from 'react';

const DashboardDefault = Loadable(lazy(() => import('@/views/dashboard/Default')));
const TaskManagement = Loadable(lazy(() => import('@/views/task-management')));
const PresenceRecords = Loadable(lazy(() => import('@/views/presence-records')));
const AbsenceForm = Loadable(lazy(() => import('@/views/absence-form')))

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
        },
        {
            path: '/absence-form',
            element: (
                <ProtectedRoute>
                    <AbsenceForm />
                </ProtectedRoute>
            )
        }
    ]
};

export default MainRoutes;
