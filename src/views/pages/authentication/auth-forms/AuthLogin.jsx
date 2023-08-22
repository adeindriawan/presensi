// third party
import * as Yup from 'yup';

import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
} from '@mui/material';
import { IS_LOADING, SESSION_LOGIN } from '@/store/actions';
import { useEffect, useRef, useState } from 'react';

import AnimateButton from '@/ui-component/extended/AnimateButton';
import { Formik } from 'formik';
import Swal from 'sweetalert2';
// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import config from '@/config';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
// project imports
import useScriptRef from '@/hooks/useScriptRef';
// material-ui
import { useTheme } from '@mui/material/styles';

// ============================|| FIREBASE - LOGIN ||============================ //

const AuthLogin = ({ ...others }) => {
    const theme = useTheme();
    const scriptedRef = useScriptRef();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const managerIds = useRef([])
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
        dispatch({ type: IS_LOADING, payload: true });
        try {
            if (scriptedRef.current) {
                setStatus({ success: true });
                setSubmitting(false);
            }
            await axios.post(`${config.baseUrl}/login`, values).then((response) => {
                const responseData = response.data.data;
                const accessToken = responseData.access_token;
                const tokenExpireAt = responseData.expires_at;
                const userData = responseData.user;
                const newSessionData = {
                    accessToken,
                    tokenExpireAt,
                    user: { ...userData, isManager: managerIds.current.includes(userData.id) }
                }
                dispatch({
                    type: SESSION_LOGIN,
                    payload: newSessionData
                });
                dispatch({ type: IS_LOADING, payload: false });
                navigate('/task-management');
            });
        } catch (err) {
            console.error(err);
            const errorMessage = 'message' in err ? err.message : 'Error';
            Swal.fire({
                text: errorMessage
            });
            if (scriptedRef.current) {
                setStatus({ success: false });
                setErrors({ submit: err.message });
                setSubmitting(false);
            }
            dispatch({ type: IS_LOADING, payload: false });
        }
    }

    useEffect(() => {
        const getConfig = async () => {
            const { data: responseData } = await axios.get('/config.json')
            if (Array.isArray(responseData.managerIds)) {
                managerIds.current = responseData.managerIds
            }
        }
        getConfig()
    }, [])

    return (
        <>
            <Formik
                initialValues={{
                    email: 'youremail@itsteknosains.co.id',
                    password: '123456',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                    password: Yup.string().max(255).required('Password is required')
                })}
                onSubmit={handleSubmit}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit} {...others}>
                        <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-email-login">Email Address / Username</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-email-login"
                                type="email"
                                value={values.email}
                                name="email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="Email Address / Username"
                                inputProps={{}}
                            />
                            {touched.email && errors.email && (
                                <FormHelperText error id="standard-weight-helper-text-email-login">
                                    {errors.email}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl
                            fullWidth
                            error={Boolean(touched.password && errors.password)}
                            sx={{ ...theme.typography.customInput }}
                        >
                            <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password-login"
                                type={showPassword ? 'text' : 'password'}
                                value={values.password}
                                name="password"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                            size="large"
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                                inputProps={{}}
                            />
                            {touched.password && errors.password && (
                                <FormHelperText error id="standard-weight-helper-text-password-login">
                                    {errors.password}
                                </FormHelperText>
                            )}
                        </FormControl>
                        {errors.submit && (
                            <Box sx={{ mt: 3 }}>
                                <FormHelperText error>{errors.submit}</FormHelperText>
                            </Box>
                        )}

                        <Box sx={{ mt: 2 }}>
                            <AnimateButton>
                                <Button
                                    disableElevation
                                    disabled={isSubmitting}
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                >
                                    Masuk
                                </Button>
                            </AnimateButton>
                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default AuthLogin;
