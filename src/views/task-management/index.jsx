// material-ui
import { Typography } from '@mui/material';

// project imports
import MainCard from '@/ui-component/cards/MainCard';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import AbsenceForm from './AbsenceForm';
import { Suspense } from 'react';

// ==============================|| SAMPLE PAGE ||============================== //

const TaskManagement = () => {

    return (
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
    )
};

export default TaskManagement;
