import * as Yup from 'yup';

import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    Grid,
    InputAdornment,
    TextField
} from '@mui/material';

import AnimateButton from '@/ui-component/extended/AnimateButton';
import { Formik } from 'formik';
import { IS_LOADING } from '@/store/actions';
import MainCard from '@/ui-component/cards/MainCard';
import { Typography } from '@mui/material';
import config from '@/config';
import { useApiServer } from '@/utils/useApiServer';
import { useDispatch } from 'react-redux';
import { useSession } from '@/hooks/store-hooks';

const TaskForm = ({ onSuccess }) => {
    const apiServer = useApiServer()
    const dispatch = useDispatch();
    const session = useSession()
    const userId = session.user.id;

    return (
        <MainCard title="Form Tugas Anda" sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 2 }}>Tulis tugas Anda secara ringkas</Typography>
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
                    await apiServer.post(`${config.baseUrl}/users/${userId}/assignment?env=${config.env}`, values)
                    actions.setFieldValue('title', '');
                    onSuccess()
                    dispatch({ type: IS_LOADING, payload: false });
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, isValid, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit}>
                        <FormControl fullWidth error={Boolean(touched.title && errors.title)}>
                            <TextField
                                fullWidth
                                id="title"
                                name="title"
                                placeholder="Apa yang akan Anda kerjakan hari ini..."
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
                        </Box>
                    </form>
                )}
            </Formik>
        </MainCard>
    );
};

export default TaskForm;
