import {
  Box,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField
} from '@mui/material';
import { Field, Form, Formik } from 'formik';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { IS_LOADING } from '@/store/actions';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import MainCard from '@/ui-component/cards/MainCard';
import Swal from 'sweetalert2';
import config from '@/config';
import { useApiServer } from '@/utils/useApiServer';
import { useDispatch } from 'react-redux';
import { useState } from 'react';

const FormikRadioGroup = ({ field, form: { touched, errors }, name, ...props }) => {
  const fieldName = name || field.name;

  return (
    <>
      <RadioGroup {...field} {...props} name={fieldName}>
        <FormControlLabel value="sick" control={<Radio />} label="Sakit" />
        <FormControlLabel value="leave" control={<Radio />} label="Izin" />
      </RadioGroup>

      {touched[fieldName] && errors[fieldName] && <span style={{ color: 'red', fontFamily: 'sans-serif' }}>{errors[fieldName]}</span>}
    </>
  );
};

const AbsenceForm = () => {
  const dispatch = useDispatch();
  const apiServer = useApiServer();
  const [reason, setReason] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [additionalFile, setAdditionalFile] = useState(null);
  const options = ['sick', 'leave'];
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

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
  const onSubmit = async (values) => {
    const formData = new FormData();
    formData.append('reason', reason);
    formData.append('additionalInfo', additionalInfo);
    formData.append('additionalFile', additionalFile);
    formData.append('fromDate', fromDate);
    formData.append('toDate', toDate);
    dispatch({ type: IS_LOADING, payload: true });
    await apiServer.post(`${config.baseUrl}/work/absence?env=${config.env}`, formData)
    dispatch({ type: IS_LOADING, payload: false });
    Swal.fire({
      text: 'Pengajuan izin Anda sudah terkirim.'
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
    <MainCard title="Ajukan izin absensi">
      <Formik
        initialValues={{ reason, fromDate, toDate, additionalInfo, additionalFile }}
        enableReinitialize
        validate={validateForm}
        onSubmit={onSubmit}
      >
        {() => (
          <Form>
            <Field
              name="reason"
              onChange={handleReasonChange}
              value={reason}
              options={options}
              component={FormikRadioGroup}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Box sx={{ mb: 1 }}>
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
                renderInput={(params) => <TextField {...params} sx={{ ml: 1 }} />}
              />
              </Box>
              
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
            <Button variant="contained" color="secondary" type="submit" sx={{ display: 'block', mt: 2 }}>
              KIRIM
            </Button>
          </Form>
        )}
      </Formik>
    </MainCard>
  );
};

export default AbsenceForm;
