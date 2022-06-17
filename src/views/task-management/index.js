import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { SESSION_LOGIN, RECENT_TASKS, TODAY_TASKS } from 'store/actions';

// material-ui
import { Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import { useEffect, Suspense } from 'react';
import { getData } from 'utils/axios';

// ==============================|| SAMPLE PAGE ||============================== //
const fetchTaskData = getData(`http://itstekno.beta/api/users/${localStorage.getItem('userId')}/assignments?length=5`);

const TaskManagement = () => {
    const tasksData = fetchTaskData.read();
    const tasks = tasksData.data;
    const isLoggedIn =
        localStorage.getItem('accessToken') &&
        localStorage.getItem('userEmail') &&
        localStorage.getItem('userName') &&
        localStorage.getItem('userId') &&
        localStorage.getItem('userType');

    const session = useSelector((state) => state.customization);
    const dispatch = useDispatch();

    useEffect(() => {
        // jika masih ada data user, baik itu di local storage maupun di state app
        if (isLoggedIn || session.account.loggedIn) {
            const userData = {
                id: localStorage.getItem('userId'),
                name: localStorage.getItem('userName'),
                email: localStorage.getItem('userEmail'),
                type: localStorage.getItem('userType')
            };
            dispatch({
                type: SESSION_LOGIN,
                payload: userData
            });
            dispatch({
                type: RECENT_TASKS,
                payload: tasks
            });
            const todayTasks = tasks.filter((v) => {
                const taskDate = new Date(v.createdAt).setHours(0, 0, 0, 0);
                const todayDate = new Date().setHours(0, 0, 0, 0);
                return taskDate === todayDate;
            });
            dispatch({
                type: TODAY_TASKS,
                payload: todayTasks
            });
        }
    }, [dispatch, isLoggedIn, session.account.loggedIn, tasks]);

    return isLoggedIn ? (
        <>
            <MainCard title="Form Tugas Anda">
                <Typography variant="body2">Tulis tugas Anda secara ringkas</Typography>
                <TaskForm />
            </MainCard>
            <Suspense fallback={<p>Memuat tugas...</p>}>
                <TaskList />
            </Suspense>
        </>
    ) : (
        <Navigate to="/login" />
    );
};

export default TaskManagement;
