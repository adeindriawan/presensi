import {
  Box,
  CardActions,
  CardContent,
  Fab,
  Grid,
  IconButton,
  Pagination,
  Paper,
  Stack,
  Tooltip,
  Typography
} from '@mui/material';
import {
  IS_LOADING,
  RECENT_TASKS,
  TODAY_TASKS,
} from '@/store/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import EditIcon from '@mui/icons-material/Edit';
import MainCard from '@/ui-component/cards/MainCard';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import Swal from 'sweetalert2';
import TaskEditModal from './TaskEditModal';
import config from '@/config';
import { gridSpacing } from '@/store/constant';
import { useApiServer } from '@/utils/useApiServer';

const TaskList = ({ fetchDataFn }) => {
  const taskStore = useSelector(state => state.task)
  const dispatch = useDispatch()
  const apiServer = useApiServer()
  const [currentPage, setCurrentPage] = useState(1);
  const { recentTasks: tasks, todayTasks, total: totalTasks } = taskStore.tasks
  const { started: workStarted } = taskStore.work
  const setTasks = (v) => {
    dispatch({ type: RECENT_TASKS, payload: v })
  }
  const setTodayTasks = (v) => {
    dispatch({ type: TODAY_TASKS, payload: v })
  }

  const [taskEditModal, setTaskEditModal] = useState({
    open: false,
    taskId: 0,
    taskTitle: ''
  });

  const getData = async (page = 1) => {
    await fetchDataFn(page)
  };

  useEffect(() => {
    getData(currentPage);
  }, [currentPage]);

  const markNotStarted = async (id) => {
    dispatch({ type: IS_LOADING, payload: true });
    const relatedTask = tasks.find((e) => e.sourceId === id);
    if (workStarted) {
      if (relatedTask.status === 2) {
        dispatch({ type: IS_LOADING, payload: false });
        Swal.fire({
          text: `Status tugas ini belum dikerjakan`
        });
      } else {
        await apiServer.patch(`${config.baseUrl}/assignments/${id}?env=${config.env}`, { id, status: 2 });
        const updatedTodayTasks = todayTasks.map((t) => (t.sourceId === id ? { ...t, status: 2 } : t));
        setTodayTasks(updatedTodayTasks);
        const updatedRecentTasks = tasks.map((t) => (t.sourceId === id ? { ...t, status: 2 } : t));
        setTasks(updatedRecentTasks);
        dispatch({ type: IS_LOADING, payload: false });
      }
    } else {
      dispatch({ type: IS_LOADING, payload: false });
      Swal.fire({
        text: `Anda harus memulai pekerjaan hari ini`
      });
    }
  };
  const markBeingWorkedOn = async (id) => {
    dispatch({ type: IS_LOADING, payload: true });
    const relatedTask = tasks.find((e) => e.sourceId === id);
    if (workStarted) {
      if (relatedTask.status === 3) {
        dispatch({ type: IS_LOADING, payload: false });
        Swal.fire({
          text: `Status tugas ini sedang dikerjakan`
        });
      } else {
        await apiServer.patch(`${config.baseUrl}/assignments/${id}?env=${config.env}`, { id, status: 3 });
        setTodayTasks(todayTasks.map((t) => (t.sourceId === id ? { ...t, status: 3 } : t)));
        setTasks(tasks.map((t) => (t.sourceId === id ? { ...t, status: 3 } : t)));
        dispatch({ type: IS_LOADING, payload: false });
      }
    } else {
      dispatch({ type: IS_LOADING, payload: false });
      Swal.fire({
        text: `Anda harus memulai pekerjaan hari ini`
      });
    }
  };
  const markFinished = async (id) => {
    dispatch({ type: IS_LOADING, payload: true });
    const relatedTask = tasks.find((e) => e.sourceId === id);
    if (workStarted) {
      if (relatedTask.status === 4) {
        dispatch({ type: IS_LOADING, payload: false });
        Swal.fire({
          text: `Status tugas ini sudah selesai`
        });
      } else {
        await apiServer.patch(`${config.baseUrl}/assignments/${id}?env=${config.env}`, { id, status: 4 });
        const updatedTodayTasks = todayTasks.map((t) => (t.sourceId === id ? { ...t, status: 4 } : t));
        setTodayTasks(updatedTodayTasks);
        const updatedRecentTasks = tasks.map((t) => (t.sourceId === id ? { ...t, status: 4 } : t));
        setTasks(updatedRecentTasks);
        dispatch({ type: IS_LOADING, payload: false });
      }
    } else {
      dispatch({ type: IS_LOADING, payload: false });
      Swal.fire({
        text: `Anda harus memulai pekerjaan hari ini`
      });
    }
  };
  const editTask = async (task) => {
    if (workStarted) {
      setTaskEditModal({
        open: true,
        taskId: task.sourceId,
        taskTitle: task.title
      });
    } else {
      Swal.fire({
        text: `Anda harus memulai pekerjaan hari ini`
      });
    }
  };
  const deleteTask = async (id) => {
    if (workStarted) {
      const { isConfirmed } = await Swal.fire({
        title: 'Konfirmasi hapus tugas',
        text: 'Hapus tugas ini?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Hapus',
        cancelButtonText: 'Batal'
      })
      if (isConfirmed) {
        await apiServer.delete(`${config.baseUrl}/assignments/${id}`);
        getData()
      }
    } else {
      Swal.fire({
        text: `Anda harus memulai pekerjaan hari ini`
      });
    }
  };

  return (
    <>
      <MainCard title="Daftar Tugas Anda" sx={{ mb: 2 }}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12}>
            {tasks.map((t) => (
              <Paper key={t.sourceId} variant='outlined' sx={{ p: 1.5, mb: 1 }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: 'success.dark', mb: 1 }}>
                    {t.createdAt}
                  </Typography>
                  <Typography variant="subtitle1" color="inherit" sx={{ mb: 2 }}>
                    {t.title}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Box sx={{ flexGrow: 1 }}></Box>
                    <Paper variant='outlined' sx={{ borderRadius: '999px' }}>
                      <Stack direction="row">
                      <Tooltip title="Belum dikerjakan">
                      <IconButton
                        aria-label="not started"
                        onClick={() => {
                          markNotStarted(t.sourceId);
                        }}
                        sx={
                          t.status === 2
                            ? { backgroundColor: '#dce775' }
                            : { backgroundColor: 'default' }
                        }
                      >
                        <ReportGmailerrorredIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Sedang dikerjakan">
                      <IconButton
                        aria-label="worked on"
                        onClick={() => {
                          markBeingWorkedOn(t.sourceId);
                        }}
                        sx={
                          t.status === 3
                            ? { backgroundColor: '#4fc3f7' }
                            : { backgroundColor: 'default' }
                        }
                      >
                        <DriveFileRenameOutlineIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Sudah selesai">
                      <IconButton
                        aria-label="finished"
                        onClick={() => {
                          markFinished(t.sourceId);
                        }}
                        sx={
                          t.status === 4
                            ? { backgroundColor: '#69f0ae' }
                            : { backgroundColor: 'default' }
                        }
                      >
                        <AssignmentTurnedInIcon />
                      </IconButton>
                    </Tooltip>
                      </Stack>
                    </Paper>
                    <Tooltip title="Ubah tugas ini">
                      <IconButton
                        aria-label="edit this task"
                        onClick={() => {
                          editTask(t);
                        }}
                        sx={{
                          // color: '#2196f3',
                          color: 'blue',
                          backgroundColor: 'lightblue'
                        }}
                        color='inherit'
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Hapus tugas ini">
                      <IconButton
                        aria-label="delete this task"
                        onClick={() => {
                          deleteTask(t.sourceId);
                        }}
                        sx={{ 
                          // color: '#f50057' 
                          color: 'red',
                          backgroundColor: 'lightpink'
                        }}
                        color='inherit'
                      >
                        <DeleteForeverIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Box>
              </Paper>
            ))}
          </Grid>
        </Grid>
        <CardActions sx={{ p: 1.25, pt: 0, justifyContent: 'center' }}>
          <Pagination count={totalTasks} variant="outlined" shape="rounded" onChange={(e, p) => setCurrentPage(p)} />
        </CardActions>
      </MainCard>
      <TaskEditModal
        open={taskEditModal.open}
        taskId={taskEditModal.taskId}
        taskTitle={taskEditModal.taskTitle}
        onSuccess={() => getData()}
        onClose={() => setTaskEditModal({
          open: false,
          taskId: 0,
          taskTitle: ''
        })}
      />
    </>
  );
};

export default TaskList;
