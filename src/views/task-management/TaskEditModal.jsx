import * as Yup from 'yup';

import { Button, Card, CardActions, CardContent, CardHeader, FormControl, Modal, TextField } from '@mui/material';

import AnimateButton from '@/ui-component/extended/AnimateButton';
import { Formik } from 'formik';
import config from '@/config';
import { makeStyles } from '@mui/styles';
import { useApiServer } from '@/utils/useApiServer';

const useStyle = makeStyles((theme) => ({
    cardModal: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        outline: 'none',
        width: 700,
        maxHeight: '100%',
        overflowY: 'auto',
        maxWidth: '100%'
    }
}));

const TaskEditModal = ({ open, taskId, taskTitle, onSuccess, onClose }) => {
    const apiServer = useApiServer()
    const classes = useStyle();

    const handleSubmit = async (values) => {
        await apiServer.patch(`${config.baseUrl}/assignments/${taskId}`, { id: taskId, assignment: values.assignment })
        onSuccess()
        onClose()
    }

    return (
        <Modal open={open}>
            <Card className={classes.cardModal}>
                <CardHeader title="Ubah tugas ini" />
                <Formik
                    initialValues={{
                        assignment: taskTitle
                    }}
                    validationSchema={Yup.object().shape({
                        assignment: Yup.string().min(5, 'Tugas minimal memiliki 5 karakter').required('Tugas wajib diisi')
                    })}
                    onSubmit={handleSubmit}
                >
                    {({ handleChange, handleSubmit, values }) => (
                        <form noValidate onSubmit={handleSubmit}>
                            <CardContent>
                                <FormControl fullWidth>
                                    <TextField
                                        fullWidth
                                        label="Ubah tugas ini"
                                        multiline
                                        name="assignment"
                                        value={values.assignment}
                                        onChange={handleChange}
                                        variant="outlined"
                                    />
                                </FormControl>
                            </CardContent>
                            <CardActions>
                                <AnimateButton>
                                    <Button color="secondary" variant="contained" type="submit">
                                        SIMPAN
                                    </Button>
                                </AnimateButton>
                                <AnimateButton>
                                    <Button color="primary" variant="contained" onClick={(e) => {
                                        e.preventDefault()
                                        onClose()
                                    }}>
                                        BATAL
                                    </Button>
                                </AnimateButton>
                            </CardActions>
                        </form>
                    )}
                </Formik>
            </Card>
        </Modal>
    );
};

export default TaskEditModal;
