// material-ui
import { Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import TaskForm from './TaskForm';
import TaskList from './TaskList';

// ==============================|| SAMPLE PAGE ||============================== //

const TaskManagement = () => (
    <>
        <MainCard title="Form Tugas Anda">
            <Typography variant="body2">Tulis tugas Anda secara ringkas</Typography>
            <TaskForm />
        </MainCard>
        <TaskList />
    </>
);

export default TaskManagement;
