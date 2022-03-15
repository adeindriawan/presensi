import { Formik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, FormControl, FormHelperText, Grid, TextField } from '@mui/material';
import AnimateButton from 'ui-component/extended/AnimateButton';
import axios from 'utils/axios';

const TaskForm = () => (
    <>
        <Grid container direction="column" justifyContent="center" spacing={0} />
        <Formik
            initialValues={{
                task: ''
            }}
            validationSchema={Yup.object().shape({
                task: Yup.string().min(5, 'Tugas minimal memiliki 5 karakter').required('Tugas wajib diisi')
            })}
            onSubmit={async (values) => {
                const response = await axios({ method: 'post', url: 'http://itstekno.beta/api/post-test' });
                console.log(values);
                console.log(response);
            }}
        >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, isValid, touched, values }) => (
                <form noValidate onSubmit={handleSubmit}>
                    <FormControl fullWidth error={Boolean(touched.task && errors.task)}>
                        <TextField
                            fullWidth
                            id="task"
                            name="task"
                            label="Apa yang akan Anda kerjakan hari ini..."
                            multiline
                            value={values.task}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            rows={4}
                        />
                        {touched.task && errors.task && (
                            <FormHelperText error id="standard-weight-helper-text-email-login">
                                {errors.task}
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

export default TaskForm;
