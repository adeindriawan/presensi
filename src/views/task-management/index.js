import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { SESSION_LOGIN } from 'store/actions';

// material-ui
import { Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import { useEffect, Suspense } from 'react';

// ==============================|| SAMPLE PAGE ||============================== //

const TaskManagement = () => {
    const isLoggedIn =
        localStorage.getItem('accessToken') &&
        localStorage.getItem('userEmail') &&
        localStorage.getItem('userName') &&
        localStorage.getItem('userId') &&
        localStorage.getItem('userType');

    const session = useSelector((state) => state.customization);
    const dispatch = useDispatch();

    useEffect(() => {
        if (isLoggedIn && !session.loggedIn) {
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
    }, [dispatch, isLoggedIn, session.loggedIn]);

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
