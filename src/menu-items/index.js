import { store } from 'store';
import dashboard from './dashboard';
import other from './other';
import managers from './managers';

// ==============================|| MENU ITEMS ||============================== //
const session = store.getState();
const managerIds = [1, 5, 896];

const menuItems = {
    items: managerIds.includes(session.customization.account.user.id) ? [dashboard, other] : [dashboard, other, managers]
};

export default menuItems;
