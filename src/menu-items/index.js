import dashboard from './dashboard';
import other from './other';
import managers from './managers';

// ==============================|| MENU ITEMS ||============================== //

const anyoneMenu = [dashboard, other]
const managersMenu = [ ...anyoneMenu, managers]

export default { anyoneMenu, managersMenu }
