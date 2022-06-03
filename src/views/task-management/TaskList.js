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
import axios from 'axios';
import { useContext } from 'react';
import config from 'config';
import { store } from 'context';

const tasks = [
    {
        id: 1,
        name: 'Tugas 1',
        status: 1,
        start: '20-02-2022'
    },
    {
        id: 2,
        name: 'Tugas 2',
        status: 2,
        start: '20-02-2022'
    },
    {
        id: 3,
        name: 'Tugas 3',
        status: 3,
        start: '21-02-2022'
    },
    {
        id: 4,
        name: 'Tugas 4',
        status: 2,
        start: '22-02-2022'
    },
    {
        id: 5,
        name: 'Tugas 5',
        status: 1,
        start: '22-02-2022'
    }
];

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
    const globalState = useContext(store);
    const { dispatch } = globalState;

    const validateForm = (values) => {
        const errors = {};
        if (values.venue === '') {
            errors.venue = 'Tempat bekerja wajib diisi!';
        }
        return errors;
    };
    const onSubmit = async (values) => {
        const axiosResponse = await axios({ method: 'post', url: `${config.backendUrl}/post-test` });
        console.log(axiosResponse);
        // dispatch({ type: IS_LOADING, isLoading: false });
        console.log(values);
    };

    const getFetchedTasks = async () => {
        axios.interceptors.request.use(
            (config) => {
                // Do something before request is sent
                dispatch({
                    type: 'isLoading'
                });
                // dispatch(isLoading(true));
                return config;
            },
            (error) =>
                // Do something with request error
                Promise.reject(error)
        );

        axios.interceptors.response.use(
            (response) => {
                // Any status code that lie within the range of 2xx cause this function to trigger
                // Do something with response data
                dispatch({
                    type: 'isLoaded'
                });
                // dispatch(isLoading(false));
                return response;
            },
            (error) =>
                // Any status codes that falls outside the range of 2xx cause this function to trigger
                // Do something with response error
                Promise.reject(error)
        );
        const fetchTasks = await axios.get('http://itstekno.beta/api/get-test');
        console.log(fetchTasks.data);
    };

    // useEffect(() => {
    //     if (loading) {
    //         dispatch({ type: IS_LOADING, isLoading: true });
    //     } else {
    //         dispatch({ type: IS_LOADING, isLoading: false });
    //     }
    // }, [dispatch, loading]);

    // useEffect(() => {
    //     let mustLoad = true;

    //     if (mustLoad) {
    //         getFetchedTasks();
    //         // dispatch({ type: IS_LOADING, isLoading: false });
    //     }

    //     return () => {
    //         mustLoad = false;
    //     };
    // }, []);

    const tesDispatch = () => {
        getFetchedTasks();
    };

    return (
        <>
            <MainCard title="Daftar Tugas Anda">
                <CardContent>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12}>
                            {tasks.map((i) => (
                                <Grid container direction="column" key={i.id}>
                                    <Grid item>
                                        <Grid container alignItems="center" justifyContent="space-between">
                                            <Grid item>
                                                <Typography variant="subtitle1" color="inherit">
                                                    {i.name}
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Grid container alignItems="center" justifyContent="space-between">
                                                    <Grid item>
                                                        <Stack direction="row" spacing={1}>
                                                            <Tooltip title="Belum dikerjakan">
                                                                <IconButton aria-label="delete">
                                                                    <ReportGmailerrorredIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Sedang dikerjakan">
                                                                <IconButton color="secondary" aria-label="add an alarm">
                                                                    <DriveFileRenameOutlineIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Sudah selesai">
                                                                <IconButton color="primary" aria-label="add to shopping cart">
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
                                            {i.start}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </CardContent>
                <CardActions sx={{ p: 1.25, pt: 0, justifyContent: 'center' }}>
                    <Pagination count={10} variant="outlined" shape="rounded" />
                </CardActions>
            </MainCard>
            <Button onClick={tesDispatch}>coba</Button>
            <MainCard>
                <Typography>Anda tercatat belum memulai kerja hari ini</Typography>
                <Formik initialValues={{ venue: '' }} validate={validateForm} onSubmit={onSubmit}>
                    {() => (
                        // Pass in the radio buttons you want to render as a prop
                        <Form>
                            <>
                                <Field name="venue" options={options} component={FormikRadioGroup} />
                            </>

                            <div className="activation-buttons">
                                <Button color="primary" variant="contained" type="submit">
                                    MULAI BEKERJA
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </MainCard>
        </>
    );
};

export default TaskList;
