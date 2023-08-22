import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router';
import axios from 'axios';

// material-ui
import { Grid, Typography } from '@mui/material';

// project imports
import { gridSpacing } from '@/store/constant';
import { SESSION_LOGIN, TODAY_TASKS, RECENT_TASKS, TOTAL_TASKS, WORK_STARTED } from '@/store/actions';
import config from '@/config';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
    const [isLoading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(false);
    }, []);
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
                const totalTasks = res.data.last_page;
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
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Typography>This section is currently under development.</Typography>
                </Grid>
            </Grid>
        </Grid>
    ) : (
        <Navigate to="/login" />
    );
};

export default Dashboard;
