import { useState, useEffect } from 'react';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import MainCard from 'ui-component/cards/MainCard';
import axios from 'axios';
import config from 'config';

export default function PresenceRecords() {
    const [id, setId] = useState('');
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [names, setNames] = useState([]);

    const handleChange = (event) => {
        setId(event.target.value);
        console.log(event.target.value);
    };

    const handleSubmit = () => {
        window.open(`${config.webUrl}/getPresenceSummary/${id}/${fromDate}/${toDate}`);
    };

    axios.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('accessToken')}`;
    useEffect(() => {
        if (names.length === 0) {
            axios.get(`${config.baseUrl}/employee/names`).then((res) => {
                console.log(res.data.data);
                setNames(res.data.data);
            }, []);
        }
    });

    return (
        <MainCard sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Nama</InputLabel>
                <Select labelId="demo-simple-select-label" id="demo-simple-select" value={id} label="Age" onChange={handleChange}>
                    {names.map((v) => (
                        <MenuItem key={v.id} value={v.id}>
                            {v.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                    label="Dari tanggal"
                    name="fromDate"
                    value={fromDate}
                    onChange={(newValue) => {
                        let fromDateObj = new Date(newValue);
                        const offset = fromDateObj.getTimezoneOffset();
                        fromDateObj = new Date(fromDateObj.getTime() - offset * 60 * 1000).toISOString().split('T')[0];
                        setFromDate(fromDateObj);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                />
                <DatePicker
                    label="Sampai tanggal"
                    name="toDate"
                    value={toDate}
                    onChange={(newValue) => {
                        let toDateObj = new Date(newValue);
                        const offset = toDateObj.getTimezoneOffset();
                        toDateObj = new Date(toDateObj.getTime() - offset * 60 * 1000).toISOString().split('T')[0];
                        setToDate(toDateObj);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                />
            </LocalizationProvider>
            <Button onClick={handleSubmit} variant="contained">
                AMBIL DATA
            </Button>
        </MainCard>
    );
}
