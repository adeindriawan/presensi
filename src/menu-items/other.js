// assets
import { IconBrandChrome, IconHelp } from '@tabler/icons';

// constant
const icons = { IconBrandChrome, IconHelp };

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const other = {
    id: 'sample-docs-roadmap',
    type: 'group',
    children: [
        {
            id: 'task-management',
            title: 'Task Management',
            type: 'item',
            url: '/task-management',
            icon: icons.IconBrandChrome,
            breadcrumbs: false
        }
    ]
};

export default other;
