import { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import {
    Button,
    Typography,
    Card,
    CardHeader,
    CardContent,
    CardActions,
    FormControlLabel,
    Modal,
    Radio,
    RadioGroup,
    TextField
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import MainCard from '@/ui-component/cards/MainCard';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import axios from 'axios';
import { IS_LOADING } from '@/store/actions';
import { useDispatch } from 'react-redux';
import config from '@/config';
import Swal from 'sweetalert2';

const useStyle = makeStyles((theme) => ({
    cardModal: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        outline: 'none',
        // boxShadow: theme.shadows[20],
        width: 700,
        maxHeight: '100%',
        overflowY: 'auto',
        maxWidth: '100%'
    }
}));
// eslint-disable-next-line react/prop-types
const FormikRadioGroup = ({ field, form: { touched, errors }, name, ...props }) => {
    // eslint-disable-next-line react/prop-types
    const fieldName = name || field.name;

    return (
        <>
            <RadioGroup {...field} {...props} name={fieldName}>
                {/* Here you either map over the props and render radios from them,
     or just render the children if you're using the function as a child */}
                <FormControlLabel value="sick" control={<Radio />} label="Sakit" />
                <FormControlLabel value="leave" control={<Radio />} label="Izin" />
            </RadioGroup>

            {touched[fieldName] && errors[fieldName] && <span style={{ color: 'red', fontFamily: 'sans-serif' }}>{errors[fieldName]}</span>}
        </>
    );
};

const AbsenceForm = () => {
    const dispatch = useDispatch();
    const [reason, setReason] = useState('');
    const [additionalInfo, setAdditionalInfo] = useState('');
    const [additionalFile, setAdditionalFile] = useState(null);
    const options = ['sick', 'leave'];
    const [modalOpen, setModalOpen] = useState(false);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const classes = useStyle();

    const validateForm = (values) => {
        const errors = {};
        if (values.reason === '') {
            errors.reason = 'Alasan absen bekerja wajib diisi!';
        }
        if (values.fromDate === null) {
            errors.fromDate = 'Tanggal mulai absen wajib diisi!';
        }
        return errors;
    };
    const onSubmit = (values) => {
        const formData = new FormData();
        formData.append('reason', reason);
        formData.append('additionalInfo', additionalInfo);
        formData.append('additionalFile', additionalFile);
        formData.append('fromDate', fromDate);
        formData.append('toDate', toDate);
        dispatch({ type: IS_LOADING, payload: true });
        axios.post(`${config.baseUrl}/work/absence?env=${config.env}`, formData).then((res) => {
            setModalOpen(false);
            dispatch({ type: IS_LOADING, payload: false });
            Swal.fire({
                text: 'Pengajuan izin Anda sudah terkirim.'
            });
        });
    };
    const handleReasonChange = (event) => {
        setReason(event.target.value);
    };
    const handleAdditionalInfoChange = (event) => {
        setAdditionalInfo(event.target.value);
    };
    const handleAdditionalFileChange = (event) => {
        setAdditionalFile(event.target.files[0]);
    };

    return (
        <MainCard title="Ingin ajukan izin absensi?">
            <Typography>Tulis alasan absen Anda</Typography>
            <Button
                color="primary"
                variant="contained"
                onClick={() => {
                    setModalOpen(true);
                }}
            >
                AJUKAN
            </Button>
            <Modal open={modalOpen}>
                <Card className={classes.cardModal}>
                    <CardHeader title="Detail izin" />
                    <Formik
                        initialValues={{ reason, fromDate, toDate, additionalInfo, additionalFile }}
                        enableReinitialize
                        validate={validateForm}
                        onSubmit={onSubmit}
                    >
                        {() => (
                            <Form>
                                <CardContent>
                                    <Field
                                        name="reason"
                                        onChange={handleReasonChange}
                                        value={reason}
                                        options={options}
                                        component={FormikRadioGroup}
                                    />
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            label="Dari tanggal"
                                            name="fromDate"
                                            value={fromDate}
                                            onChange={(newValue) => {
                                                setFromDate(newValue);
                                            }}
                                            renderInput={(params) => <TextField {...params} />}
                                        />
                                        <DatePicker
                                            label="Sampai tanggal (opsional)"
                                            name="toDate"
                                            value={toDate}
                                            onChange={(newValue) => {
                                                setToDate(newValue);
                                            }}
                                            renderInput={(params) => <TextField {...params} />}
                                        />
                                    </LocalizationProvider>
                                    <TextField
                                        multiline
                                        fullWidth
                                        label="Keterangan tambahan (opsional)"
                                        variant="outlined"
                                        name="additionalInfo"
                                        value={additionalInfo}
                                        onChange={handleAdditionalInfoChange}
                                        sx={{
                                            marginTop: '5px'
                                        }}
                                    />
                                    <input
                                        style={{ display: 'none' }}
                                        id="contained-button-file"
                                        onChange={handleAdditionalFileChange}
                                        type="file"
                                    />
                                    <FormControlLabel
                                        sx={{
                                            marginLeft: '1px',
                                            marginTop: '5px'
                                        }}
                                        control={
                                            <Button variant="contained" color="primary" component="span">
                                                Upload keterangan lain (opsional)
                                            </Button>
                                        }
                                        htmlFor="contained-button-file"
                                    />
                                </CardContent>
                                <CardActions>
                                    <Button variant="contained" color="primary" type="submit">
                                        KIRIM
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setModalOpen(false);
                                        }}
                                    >
                                        BATAL
                                    </Button>
                                </CardActions>
                            </Form>
                        )}
                    </Formik>
                </Card>
            </Modal>
        </MainCard>
    );
};

export default AbsenceForm;
