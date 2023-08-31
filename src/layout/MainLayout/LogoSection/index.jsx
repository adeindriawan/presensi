// material-ui
import { ButtonBase } from '@mui/material';
import { Link } from 'react-router-dom';
// project imports
import config from '@/config';
import logo from '@/assets/images/logo-PT-ITS-Tekno-Sains-160-x-160.png';

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = () => (
    <ButtonBase disableRipple component={Link} to={config.defaultPath}>
        <img src={logo} alt="ITS Tekno Sains Logo" width={50} />
    </ButtonBase>
);

export default LogoSection;
