// material-ui
import { Grid, Typography } from '@mui/material';

// project imports
import { gridSpacing } from '@/store/constant';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Typography>This section is currently under development.</Typography>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Dashboard;
