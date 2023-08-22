/* eslint-disable jsx-a11y/label-has-associated-control */
import MainCard from '@/ui-component/cards/MainCard';
import { Formik, Form, Field } from 'formik';
// material-ui
import {
    Button,
    CardActions,
    CardContent,
    FormControlLabel,
    Grid,
    IconButton,
    Radio,
    RadioGroup,
    Pagination,
    Stack,
    Tooltip,
    Typography
} from '@mui/material';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

// project imports
import { gridSpacing } from '@/store/constant';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { WORK_STARTED, WORK_ENDED, IS_LOADING } from '@/store/actions';
import Swal from 'sweetalert2';
import config from '@/config';
import TaskEditModal from './TaskEditModal';
import { useSession } from '@/hooks/store-hooks';
import { useApiServer } from '@/utils/useApiServer';

// https://codesandbox.io/s/gracious-williamson-pd64p?file=/src/index.js:923-1051
// eslint-disable-next-line react/prop-types
const FormikRadioGroup = ({ field, form: { touched, errors }, name, ...props }) => {
    // eslint-disable-next-line react/prop-types
    const fieldName = name || field.name;

    return (
        <>
            <RadioGroup {...field} {...props} name={fieldName}>
                {/* Here you either map over the props and render radios from them,
         or just render the children if you're using the function as a child */}
                <FormControlLabel value="office" control={<Radio />} label="Kantor" />
                <FormControlLabel value="home" control={<Radio />} label="Rumah" />
                <FormControlLabel value="other" control={<Radio />} label="Lainnya" />
            </RadioGroup>

            {touched[fieldName] && errors[fieldName] && <span style={{ color: 'red', fontFamily: 'sans-serif' }}>{errors[fieldName]}</span>}
        </>
    );
};

const TaskList = () => {
    const options = ['office', 'home', 'other'];
    const session = useSession()
    const dispatch = useDispatch()
    const apiServer = useApiServer()
    const [currentPage, setCurrentPage] = useState(1);
    const [tasks, setTasks] = useState([]);
    const [todayTasks, setTodayTasks] = useState([]);
    const [totalTasks, setTotalTasks] = useState(0);
    const [workStarted, setWorkStarted] = useState(false);
    const [markedTasks, setMarkedTasks] = useState([]);
    const [taskEditModal, setTaskEditModal] = useState({
        open: false,
        taskId: 0,
        taskTitle: ''
    });

    const getData = async (page = 1) => {
        const userId = session.user.id;
        const res = await apiServer.get(`${config.baseUrl}/users/${userId}/assignments`, { params: { page } });
        const tasks = res.data.data.data;
        const totalTasks = res.data.last_page;
        setTasks(tasks);
        setTotalTasks(totalTasks);
        const todayTasks = tasks.filter((v) => {
            const taskDate = new Date(v.createdAt).setHours(0, 0, 0, 0);
            const todayDate = new Date().setHours(0, 0, 0, 0);
            return taskDate === todayDate;
        });
        setTodayTasks(todayTasks);
        setMarkedTasks(todayTasks.filter((v) => v.status !== 1));
    };

    useEffect(() => {
        getData(currentPage);
    }, [currentPage]);

    useEffect(() => {
        setWorkStarted(session.work.started);
    }, [session.work.started]);

    const validateForm = (values) => {
        const errors = new Map();
        if (values.venue === '' && !workStarted) {
            errors.set('venue', 'Tempat bekerja wajib diisi!')
        }
        return Object.fromEntries(errors);
    };

    const toggleWork = async (values) => {
        dispatch({ type: IS_LOADING, payload: true });
        const url = workStarted ? `${config.baseUrl}/work/end?env=${config.env}` : `${config.baseUrl}/work/start?env=${config.env}`;
        await apiServer.post(url, values);
        if (workStarted) {
            dispatch({ type: WORK_ENDED });
            console.log(`Anda dinyatakan telah mengakhiri kerja hari ini`);
            dispatch({ type: IS_LOADING, payload: false });
            Swal.fire({
                text: `Anda dinyatakan telah mengakhiri pekerjaan hari ini`
            });
        } else {
            dispatch({ type: WORK_STARTED, payload: values.venue });
            console.log(`Anda dinyatakan telah memulai bekerja hari ini`);
            dispatch({ type: IS_LOADING, payload: false });
            Swal.fire({
                text: `Anda dinyatakan telah memulai pekerjaan hari ini`
            });
        }
    };
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
                console.log(`Tugas ID ${id} berhasil ditandai belum dimulai.`);
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
                console.log(`Tugas ID ${id} berhasil ditandai sedang dikerjakan.`);
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
                console.log(`Tugas ID ${id} berhasil ditandai sudah selesai.`);
                dispatch({ type: IS_LOADING, payload: false });
            }
        } else {
            dispatch({ type: IS_LOADING, payload: false });
            Swal.fire({
                text: `Anda harus memulai pekerjaan hari ini`
            });
        }
    };
    const editTask = (id) => {
        if (workStarted) {
            apiServer.get(`${config.baseUrl}/assignment/${id}/details`).then((res) => {
                setTaskEditModal({
                    open: true,
                    taskId: id,
                    taskTitle: res.data.data[0].title
                });
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

    const WorkButton = () => {
        const workButton = (
            <Button
                color="primary"
                variant="contained"
                type="submit"
                disabled={(todayTasks.length === 0 || workStarted) && (todayTasks.length !== markedTasks.length || todayTasks.length === 0)}
            >
                {workStarted ? 'AKHIRI BEKERJA' : 'MULAI BEKERJA'}
            </Button>
        );

        if ((todayTasks.length === 0 || workStarted) && (todayTasks.length !== markedTasks.length || todayTasks.length === 0)) {
            return (
                <Tooltip
                    title={
                        workStarted
                            ? 'Anda harus menandai semua tugas yang ditambahkan hari ini'
                            : 'Anda harus mengisi minimal satu tugas untuk hari ini'
                    }
                >
                    <span>{workButton}</span>
                </Tooltip>
            );
        }

        return workButton
    };

    return (
        <>
            <MainCard title="Daftar Tugas Anda">
                <CardContent>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12}>
                            {tasks.map((i) => (
                                <Grid container direction="column" key={i.sourceId}>
                                    <Grid item>
                                        <Grid container alignItems="center" justifyContent="space-between">
                                            <Grid item>
                                                <Typography variant="subtitle1" color="inherit">
                                                    {i.title}
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Grid container alignItems="center" justifyContent="space-between">
                                                    <Grid item>
                                                        <Stack direction="row" spacing={1}>
                                                            <Tooltip title="Belum dikerjakan">
                                                                <IconButton
                                                                    aria-label="not started"
                                                                    onClick={() => {
                                                                        markNotStarted(i.sourceId);
                                                                    }}
                                                                    sx={
                                                                        i.status === 2
                                                                            ? { backgroundColor: 'blue' }
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
                                                                        markBeingWorkedOn(i.sourceId);
                                                                    }}
                                                                    sx={
                                                                        i.status === 3
                                                                            ? { backgroundColor: 'blue' }
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
                                                                        markFinished(i.sourceId);
                                                                    }}
                                                                    sx={
                                                                        i.status === 4
                                                                            ? { backgroundColor: 'blue' }
                                                                            : { backgroundColor: 'default' }
                                                                    }
                                                                >
                                                                    <AssignmentTurnedInIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Ubah tugas ini">
                                                                <IconButton
                                                                    aria-label="edit this task"
                                                                    onClick={() => {
                                                                        editTask(i.sourceId);
                                                                    }}
                                                                    sx={{
                                                                        backgroundColor: 'secondary.light'
                                                                    }}
                                                                >
                                                                    <EditIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Hapus tugas ini">
                                                                <IconButton
                                                                    aria-label="delete this task"
                                                                    onClick={() => {
                                                                        deleteTask(i.sourceId);
                                                                    }}
                                                                    sx={{
                                                                        backgroundColor: 'error.light'
                                                                    }}
                                                                >
                                                                    <DeleteForeverIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Stack>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="subtitle2" sx={{ color: 'success.dark' }}>
                                            {i.createdAt}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </CardContent>
                <CardActions sx={{ p: 1.25, pt: 0, justifyContent: 'center' }}>
                    <Pagination count={totalTasks} variant="outlined" shape="rounded" onChange={(e, p) => setCurrentPage(p)} />
                </CardActions>
            </MainCard>
            <MainCard>
                {workStarted ? (
                    <Typography>Anda bekerja di {session.work.venue} </Typography>
                ) : (
                    <>
                        <Typography>Anda tercatat belum memulai kerja hari ini.</Typography>
                        <Typography>Isi tempat kerja Anda saat ini.</Typography>
                    </>
                )}
                <Formik initialValues={{ venue: '' }} validate={validateForm} onSubmit={toggleWork}>
                    {() => (
                        // Pass in the radio buttons you want to render as a prop
                        <Form>
                            {!workStarted && (
                                <>
                                    <Field name="venue" options={options} component={FormikRadioGroup} />
                                </>
                            )}

                            <div className="activation-buttons">
                                <WorkButton />
                            </div>
                        </Form>
                    )}
                </Formik>
            </MainCard>
            <TaskEditModal
                open={taskEditModal.open}
                taskId={taskEditModal.taskId}
                taskTitle={taskEditModal.taskTitle}
                onSuccess={() => getData()}
            />
        </>
    );
};

export default TaskList;
