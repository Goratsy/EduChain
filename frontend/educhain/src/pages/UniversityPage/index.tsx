import { Box, Typography } from "@mui/material";
import Navbar from "../../shared/components/Navbar";

const UniversityPage = () => {
    return (
        <>
            <Navbar />
            <Box component="section" sx={{ px: "10%", mt: '2rem', overflow: "hidden" }}>
                <Typography variant="h6" component="h2" sx={{ textAlign: 'left', fontSize: '1.4rem' }}>Панель управления университета</Typography>
                <Typography variant="body1">Функции: добавление роли адресам - назначить адресу роль ученика, добавить ученику достижение</Typography>


            </Box>
        </>
    );
}

export default UniversityPage;