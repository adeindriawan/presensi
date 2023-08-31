import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import MainCard from '@/ui-component/cards/MainCard';
import config from '@/config';
import { useApiServer } from '@/utils/useApiServer';

export default function PresenceRecords() {
    const apiServer = useApiServer()
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

    useEffect(() => {
        if (names.length === 0) {
            apiServer.get(`${config.baseUrl}/employee/names`).then((res) => {
                console.log(res.data.data);
                setNames(res.data.data);
            }, []);
        }
    });

    return (
        <MainCard sx={{ minWidth: 120 }}>
            <FormControl fullWidth sx={{ maxWidth: 280, mb: 2 }}>
                <InputLabel id="demo-simple-select-label">Nama</InputLabel>
                <Select labelId="demo-simple-select-label" id="demo-simple-select" value={id} label="Age" onChange={handleChange}>
                    {names.map((v) => (
                        <MenuItem key={v.id} value={v.id}>
                            {v.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <br />
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
                    renderInput={(params) => <TextField {...params} sx={{ ml: 2 }} />}
                />
            </LocalizationProvider>
            <Button color="secondary" sx={{ display: 'block', mt: 2 }} onClick={handleSubmit} variant="contained">
                AMBIL DATA
            </Button>
        </MainCard>
    );
}
