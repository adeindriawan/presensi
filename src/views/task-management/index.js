import { Navigate } from 'react-router-dom';

// material-ui
import { Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import TaskForm from './TaskForm';
import TaskList from './TaskList';

// ==============================|| SAMPLE PAGE ||============================== //

const TaskManagement = () => {
    const isLoggedIn = localStorage.getItem('accessToken');

    return isLoggedIn ? (
        <>
            <MainCard title="Form Tugas Anda">
                <Typography variant="body2">Tulis tugas Anda secara ringkas</Typography>
                <TaskForm />
            </MainCard>
            <TaskList />
        </>
    ) : (
        <Navigate to="/login" />
    );
};

export default TaskManagement;
