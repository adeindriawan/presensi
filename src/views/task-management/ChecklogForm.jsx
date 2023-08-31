import {
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  Tooltip,
  Typography
} from '@mui/material';
import { Field, Form, Formik } from 'formik';
import {
  IS_LOADING,
  WORK_ENDED,
  WORK_STARTED
} from '@/store/actions';
import { useDispatch, useSelector } from 'react-redux';

import MainCard from '@/ui-component/cards/MainCard';
import Swal from 'sweetalert2';
import config from '@/config';
import { useApiServer } from '@/utils/useApiServer';

const WorkVenues = new Map([
  ['office', 'Kantor'],
  ['home', 'Rumah'],
  ['other', 'Tempat Lain']
])

const FormikRadioGroup = ({ field, form: { touched, errors }, name, ...props }) => {
  const fieldName = name || field.name;

  return (
    <>
      <RadioGroup {...field} {...props} name={fieldName}>
        {Array.from(WorkVenues).map((value, label) => (
          <FormControlLabel value={value} control={<Radio />} label={label} />
        ))}
      </RadioGroup>

      {touched[fieldName] && errors[fieldName] && <span style={{ color: 'red', fontFamily: 'sans-serif' }}>{errors[fieldName]}</span>}
    </>
  );
};

const ChecklogForm = () => {
  const dispatch = useDispatch()
  const apiServer = useApiServer()
  const taskStore = useSelector(state => state.task)
  const { todayTasks } = taskStore.tasks
  const { started: workStarted, venue: workVenue } = taskStore.work
  const markedTasks = todayTasks.filter((v) => v.status !== 1)

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

  const validateForm = (values) => {
    const errors = new Map();
    if (values.venue === '' && !workStarted) {
        errors.set('venue', 'Tempat bekerja wajib diisi!')
    }
    return Object.fromEntries(errors);
};

  const WorkButton = () => {
    const workButton = (
      <Button
        color="secondary"
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
    <MainCard sx={{ mb: 2 }}>
      {workStarted ? (
        <Typography sx={{ mb: 1 }}>Anda bekerja di {WorkVenues.get(workVenue)?.toLowerCase()} </Typography>
      ) : (
        <>
          <Typography>Anda tercatat belum memulai kerja hari ini.</Typography>
          <Typography>Isi tempat kerja Anda saat ini.</Typography>
        </>
      )}
      <Formik initialValues={{ venue: '' }} validate={validateForm} onSubmit={toggleWork}>
        {() => (
          <Form>
            {!workStarted && (
              <Field name="venue" options={[ ...WorkVenues.keys() ]} component={FormikRadioGroup} />
            )}

            <div className="activation-buttons">
              <WorkButton />
            </div>
          </Form>
        )}
      </Formik>
    </MainCard>
  )
}

export default ChecklogForm