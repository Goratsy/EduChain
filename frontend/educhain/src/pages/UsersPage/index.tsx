import type { FunctionComponent } from "react";
import Navbar from "../../shared/components/Navbar";
import { Box, Typography } from "@mui/material";

interface UsersPageProps {

}

const UsersPage: FunctionComponent<UsersPageProps> = () => {
    return (
        <>
            <Navbar />
            <Box component="section" sx={{ mt: '2rem' }}>
                <Typography variant="h4" component="h2" sx={{ textAlign: 'center' }}>Все пользователи в блокчейне</Typography>
                <Box component='div'>
                    
                </Box>
            </Box>
        </>
    );
}

export default UsersPage;