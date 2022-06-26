import { useEffect, useState } from 'react';
import { Modal, Card, CardHeader, CardContent, CardActions, Button, TextField, FormControl, FormHelperText } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AnimateButton from 'ui-component/extended/AnimateButton';
import axios from 'axios';
import config from 'config';
import { useDispatch } from 'react-redux';
import { RECENT_TASKS } from 'store/actions';

const useStyle = makeStyles((theme) => ({
    cardModal: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        outline: 'none',
        boxShadow: theme.shadows[20],
        width: 700,
        maxHeight: '100%',
        overflowY: 'auto',
        maxWidth: '100%'
    }
}));

const TaskEditModal = ({ ...props }) => {
    const classes = useStyle();
    const dispatch = useDispatch();
    const [taskEditModalOpen, setTaskEditModalOpen] = useState(props.open);

    useEffect(() => {
        setTaskEditModalOpen(props.open);
    }, [props.open]);

    return (
        <Modal open={taskEditModalOpen}>
            <Card className={classes.cardModal}>
                <CardHeader title="Ubah tugas ini" />
                <Formik
                    initialValues={{
                        assignment: props.taskTitle
                    }}
                    validationSchema={Yup.object().shape({
                        assignment: Yup.string().min(5, 'Tugas minimal memiliki 5 karakter').required('Tugas wajib diisi')
                    })}
                    onSubmit={async (values) => {
                        await axios
                            .patch(`${config.baseUrl}/assignments/${props.taskId}`, { id: props.taskId, assignment: values.assignment })
                            .then((response) => {
                                console.log(response);
                            });
                        axios.get(`${config.baseUrl}/users/${localStorage.getItem('userId')}/assignments`).then((res) => {
                            const tasks = res.data.data.data;
                            dispatch({
                                type: RECENT_TASKS,
                                payload: tasks
                            });
                        });
                        setTaskEditModalOpen(false);
                    }}
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
                                    <Button color="primary" variant="contained" type="submit">
                                        SIMPAN
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
