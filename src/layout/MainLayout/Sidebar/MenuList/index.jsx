// project imports
import NavGroup from './NavGroup';
// material-ui
import { Typography } from '@mui/material';
import menuItems from '@/menu-items';
import { useSession } from '@/hooks/store-hooks';

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {
    const session = useSession()
    const menus = session.user.isManager ? menuItems.managersMenu : menuItems.anyoneMenu

    return  (
        <>
            { menus.map(item => {
                if (item.type === 'group') {
                    return <NavGroup key={item.id} item={item} />
                }
                return (
                    <Typography key={item.id} variant="h6" color="error" align="center">
                        Menu Items Error
                    </Typography>
                )
            })}
        </>
    )
    
};

export default MenuList;
