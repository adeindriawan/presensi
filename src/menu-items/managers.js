// assets
import { IconTableExport } from '@tabler/icons';

// constant
const icons = { IconTableExport };

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const managers = {
    id: 'managers-route',
    type: 'group',
    children: [
        {
            id: 'presence-records',
            title: 'Presence Records',
            type: 'item',
            url: '/presence-records',
            icon: icons.IconTableExport,
            breadcrumbs: false
        }
    ]
};

export default managers;
