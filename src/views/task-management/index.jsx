import {
    RECENT_TASKS,
    TODAY_TASKS,
    TOTAL_TASKS
} from '@/store/actions';

import ChecklogForm from './ChecklogForm';
import { Suspense } from 'react';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import config from '@/config';
import { useApiServer } from '@/utils/useApiServer';
import { useDispatch } from 'react-redux';
import { useSession } from '@/hooks/store-hooks';

const TaskManagement = () => {
    const apiServer = useApiServer()
    const dispatch = useDispatch()
    const session = useSession()
    const getTasksData = async (page = 1) => {
        const userId = session.user.id;
        const res = await apiServer.get(`${config.baseUrl}/users/${userId}/assignments`, { params: { page } });
        const _tasks = res.data.data.data;
        const _totalTasks = res.data.data.last_page;
        const _todayTasks = _tasks.filter((v) => {
            const taskDate = new Date(v.createdAt).setHours(0, 0, 0, 0);
            const todayDate = new Date().setHours(0, 0, 0, 0);
            return taskDate === todayDate;
        });        
        dispatch({ type: RECENT_TASKS, payload: _tasks })
        dispatch({ type: TODAY_TASKS, payload: _todayTasks })
        dispatch({ type: TOTAL_TASKS, payload: _totalTasks })
    }

    return (
        <>
            <TaskForm onSuccess={() => getTasksData(1)} />
            <Suspense fallback={<p>Memuat tugas...</p>}>
                <TaskList fetchDataFn={getTasksData} />
            </Suspense>
            <ChecklogForm />
        </>
    )
};

export default TaskManagement;
