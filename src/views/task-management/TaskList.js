/* eslint-disable jsx-a11y/label-has-associated-control */
import MainCard from 'ui-component/cards/MainCard';
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

// project imports
import { gridSpacing } from 'store/constant';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { WORK_STARTED, WORK_ENDED, IS_LOADING, TODAY_TASKS, RECENT_TASKS } from 'store/actions';
import Swal from 'sweetalert2';
import config from 'config';

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
    const session = useSelector((state) => state.customization);
    const [tasks, setTasks] = useState([]);
    const [todayTasks, setTodayTasks] = useState([]);
    const [totalTasks, setTotalTasks] = useState(session.tasks.total);
    const [workStarted, setWorkStarted] = useState(false);
    const [markedTasks, setMarkedTasks] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        if (session.tasks.todayTasks.length > 0) {
            const todayTasks = session.tasks.todayTasks;
            setTodayTasks(todayTasks);
            // tugas hari ini yang statusnya != 1 berarti sudah ditandai (belum, sedang, sudah)
            setMarkedTasks(todayTasks.filter((v) => v.status !== 1));
        }
    }, [session.tasks.todayTasks]);

    useEffect(() => {
        setTasks(session.tasks.recentTasks);
    }, [session.tasks.recentTasks]);

    useEffect(() => {
        setWorkStarted(session.work.started);
    }, [session.work.started]);

    useEffect(() => {
        setTotalTasks(session.tasks.total);
    }, [session.tasks.total]);

    const validateForm = (values) => {
        const errors = {};
        if (values.venue === '' && !workStarted) {
            errors.venue = 'Tempat bekerja wajib diisi!';
        }
        return errors;
    };
    const onSubmit = async (values) => {
        dispatch({ type: IS_LOADING, payload: true });
        const url = workStarted ? `${config.baseUrl}/work/end?env=${config.env}` : `${config.baseUrl}/work/start?env=${config.env}`;
        axios.post(url, values).then(() => {
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
        });
    };
    const markNotStarted = (id) => {
        dispatch({ type: IS_LOADING, payload: true });
        const relatedTask = tasks.find((e) => e.sourceId === id);
        if (workStarted) {
            if (relatedTask.status === 2) {
                dispatch({ type: IS_LOADING, payload: false });
                Swal.fire({
                    text: `Status tugas ini belum dikerjakan`
                });
            } else {
                axios.patch(`${config.baseUrl}/assignments/${id}?env=${config.env}`, { id, status: 2 }).then(() => {
                    const updatedTodayTasks = todayTasks.map((p) => (p.sourceId === id ? { ...p, status: 2 } : p));
                    dispatch({ type: TODAY_TASKS, payload: updatedTodayTasks });
                    const updatedRecentTasks = tasks.map((p) => (p.sourceId === id ? { ...p, status: 2 } : p));
                    dispatch({ type: RECENT_TASKS, payload: updatedRecentTasks });
                    console.log(`Tugas ID ${id} berhasil ditandai belum dimulai.`);
                    dispatch({ type: IS_LOADING, payload: false });
                });
            }
        } else {
            dispatch({ type: IS_LOADING, payload: false });
            Swal.fire({
                text: `Anda harus memulai pekerjaan hari ini`
            });
        }
    };
    const markBeingWorkedOn = (id) => {
        dispatch({ type: IS_LOADING, payload: true });
        const relatedTask = tasks.find((e) => e.sourceId === id);
        if (workStarted) {
            if (relatedTask.status === 3) {
                dispatch({ type: IS_LOADING, payload: false });
                Swal.fire({
                    text: `Status tugas ini sedang dikerjakan`
                });
            } else {
                axios.patch(`${config.baseUrl}/assignments/${id}?env=${config.env}`, { id, status: 3 }).then(() => {
                    const updatedTodayTasks = todayTasks.map((p) => (p.sourceId === id ? { ...p, status: 3 } : p));
                    dispatch({ type: TODAY_TASKS, payload: updatedTodayTasks });
                    const updatedRecentTasks = tasks.map((p) => (p.sourceId === id ? { ...p, status: 3 } : p));
                    dispatch({ type: RECENT_TASKS, payload: updatedRecentTasks });
                    console.log(`Tugas ID ${id} berhasil ditandai sedang dikerjakan.`);
                    dispatch({ type: IS_LOADING, payload: false });
                });
            }
        } else {
            dispatch({ type: IS_LOADING, payload: false });
            Swal.fire({
                text: `Anda harus memulai pekerjaan hari ini`
            });
        }
    };
    const markFinished = (id) => {
        dispatch({ type: IS_LOADING, payload: true });
        const relatedTask = tasks.find((e) => e.sourceId === id);
        if (workStarted) {
            if (relatedTask.status === 4) {
                dispatch({ type: IS_LOADING, payload: false });
                Swal.fire({
                    text: `Status tugas ini sudah selesai`
                });
            } else {
                axios.patch(`${config.baseUrl}/assignments/${id}?env=${config.env}`, { id, status: 4 }).then(() => {
                    const updatedTodayTasks = todayTasks.map((p) => (p.sourceId === id ? { ...p, status: 4 } : p));
                    dispatch({ type: TODAY_TASKS, payload: updatedTodayTasks });
                    const updatedRecentTasks = tasks.map((p) => (p.sourceId === id ? { ...p, status: 4 } : p));
                    dispatch({ type: RECENT_TASKS, payload: updatedRecentTasks });
                    console.log(`Tugas ID ${id} berhasil ditandai sudah selesai.`);
                    dispatch({ type: IS_LOADING, payload: false });
                });
            }
        } else {
            dispatch({ type: IS_LOADING, payload: false });
            Swal.fire({
                text: `Anda harus memulai pekerjaan hari ini`
            });
        }
    };

    let workButton = (
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
        workButton = (
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
                    <Pagination
                        count={totalTasks}
                        variant="outlined"
                        shape="rounded"
                        onChange={(e, p) => {
                            axios.get(`${config.baseUrl}/users/${localStorage.getItem('userId')}/assignments?page=${p}`).then((res) => {
                                console.log(res);
                                dispatch({ type: RECENT_TASKS, payload: res.data.data.data });
                            });
                        }}
                    />
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
                <Formik initialValues={{ venue: '' }} validate={validateForm} onSubmit={onSubmit}>
                    {() => (
                        // Pass in the radio buttons you want to render as a prop
                        <Form>
                            {!workStarted ? (
                                <>
                                    <Field name="venue" options={options} component={FormikRadioGroup} />
                                </>
                            ) : (
                                ''
                            )}

                            <div className="activation-buttons">{workButton}</div>
                        </Form>
                    )}
                </Formik>
            </MainCard>
        </>
    );
};

export default TaskList;
