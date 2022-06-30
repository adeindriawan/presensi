import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { SESSION_LOGIN, RECENT_TASKS, TODAY_TASKS, WORK_STARTED, TOTAL_TASKS } from 'store/actions';

// material-ui
import { Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import AbsenceForm from './AbsenceForm';
import { useEffect, Suspense } from 'react';
import axios from 'axios';
import config from 'config';

// ==============================|| SAMPLE PAGE ||============================== //

const TaskManagement = () => {
    // const tasksData = fetchTaskData.read();
    // const tasks = tasksData.data.data;
    // const totalTasks = tasksData.data.last_page;
    axios.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('accessToken')}`;
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
            axios.get(`${config.baseUrl}/work/user/check`).then((res) => {
                const workToday = res.data.data;
                if (workToday !== null && Object.keys(workToday).length > 0) {
                    const venue = workToday.venue;
                    dispatch({ type: WORK_STARTED, payload: venue });
                }
            });
            axios.get(`${config.baseUrl}/users/${localStorage.getItem('userId')}/assignments`).then((res) => {
                const tasks = res.data.data.data;
                const totalTasks = res.data.data.last_page;
                dispatch({
                    type: RECENT_TASKS,
                    payload: tasks
                });
                dispatch({
                    type: TOTAL_TASKS,
                    payload: totalTasks
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
            });
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
        }
    }, [dispatch, isLoggedIn, session.account.loggedIn]);

    return isLoggedIn ? (
        <>
            <MainCard title="Form Tugas Anda">
                <Typography variant="body2">Tulis tugas Anda secara ringkas</Typography>
                <TaskForm />
            </MainCard>
            <Suspense fallback={<p>Memuat tugas...</p>}>
                <TaskList />
            </Suspense>
            <AbsenceForm />
        </>
    ) : (
        <Navigate to="/login" />
    );
};

export default TaskManagement;
