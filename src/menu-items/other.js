// assets
import { IconBrandChrome, IconListCheck } from '@tabler/icons';

// constant
const icons = { IconBrandChrome, IconListCheck };

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
            icon: icons.IconListCheck,
            breadcrumbs: false
        }
    ]
};

export default other;
