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
import { getData } from 'utils/axios';

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

const fetchTaskData = getData('http://itstekno.beta/api/assignments/get?length=5');

const TaskList = () => {
    const options = ['office', 'home', 'other'];
    const tasksData = fetchTaskData.read();
    const tasks = tasksData.data;

    const validateForm = (values) => {
        const errors = {};
        if (values.venue === '') {
            errors.venue = 'Tempat bekerja wajib diisi!';
        }
        return errors;
    };
    const onSubmit = async (values) => {
        console.log(values);
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
