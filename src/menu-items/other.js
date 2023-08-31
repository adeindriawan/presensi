import { IconFileInvoice, IconListCheck } from '@tabler/icons';

const other = {
    id: 'sample-docs-roadmap',
    type: 'group',
    children: [
        {
            id: 'task-management',
            title: 'Task Management',
            type: 'item',
            url: '/task-management',
            icon: IconListCheck,
            breadcrumbs: false
        },
        {
            id: 'absence-form',
            title: 'Absence Form',
            type: 'item',
            url: '/absence-form',
            icon: IconFileInvoice,
            breadcrumbs: false
        }
    ]
};

export default other;
