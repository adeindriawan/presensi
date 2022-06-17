import { Formik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, FormControl, FormHelperText, Grid, TextField } from '@mui/material';
import AnimateButton from 'ui-component/extended/AnimateButton';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { RECENT_TASKS, TODAY_TASKS, IS_LOADING } from 'store/actions';

const TaskForm = () => {
    const dispatch = useDispatch();
    const session = useSelector((state) => state.customization);
    const userId = session.account.user.id;

    return (
        <>
            <Grid container direction="column" justifyContent="center" spacing={0} />
            <Formik
                initialValues={{
                    title: ''
                }}
                validationSchema={Yup.object().shape({
                    title: Yup.string().min(5, 'Tugas minimal memiliki 5 karakter').required('Tugas wajib diisi')
                })}
                onSubmit={async (values, actions) => {
                    dispatch({ type: IS_LOADING, payload: true });
                    await axios({ method: 'post', url: `http://itstekno.beta/api/users/${userId}/assignment`, data: values }).then(
                        async (res) => {
                            const getRecentTasks = await axios({ method: 'get', url: 'http://itstekno.beta/api/assignments/get?length=5' });
                            const recentTasks = getRecentTasks.data;
                            dispatch({
                                type: RECENT_TASKS,
                                payload: recentTasks.data
                            });
                            const todayTasks = recentTasks.data.filter((v) => {
                                const taskDate = new Date(v.createdAt).setHours(0, 0, 0, 0);
                                const todayDate = new Date().setHours(0, 0, 0, 0);
                                return taskDate === todayDate;
                            });
                            dispatch({
                                type: TODAY_TASKS,
                                payload: todayTasks
                            });
                            actions.setFieldValue('title', '');
                            dispatch({ type: IS_LOADING, payload: false });
                        }
                    );
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, isValid, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit}>
                        <FormControl fullWidth error={Boolean(touched.title && errors.title)}>
                            <TextField
                                fullWidth
                                id="title"
                                name="title"
                                label="Apa yang akan Anda kerjakan hari ini..."
                                multiline
                                value={values.title}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                rows={4}
                            />
                            {touched.title && errors.title && (
                                <FormHelperText error id="standard-weight-helper-text-email-login">
                                    {errors.title}
                                </FormHelperText>
                            )}
                        </FormControl>
                        <Box sx={{ mt: 2 }}>
                            <AnimateButton>
                                <Button
                                    disableElevation
                                    disabled={isSubmitting || !isValid}
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                >
                                    SIMPAN
                                </Button>
                            </AnimateButton>
                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default TaskForm;
