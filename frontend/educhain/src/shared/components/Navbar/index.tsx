import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import s from './index.module.css'
import { Link, useLocation } from 'react-router';

const Navabar = () => {
    const location = useLocation();
    const path = location.pathname;

    const menuItems = [
        { name: 'Главная', path: '/' },
        { name: 'Пользователи', path: '/users' },
        { name: 'Для админа', path: '/admin-page' },
        { name: 'Для универстита', path: '/university-page' },
    ]

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{ backgroundColor: 'var(--bg)' }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        EduChain
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        {menuItems.map(item => {
                            return (
                                <Link to={item.path} key={item.name} className={`${path === item.path ? s.current_link : s.link}`}>
                                    <Typography variant="body1" component="div" sx={{ flexGrow: 1 }}>
                                        {item.name}
                                    </Typography>
                                </Link>
                            )
                        })}

                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default Navabar;