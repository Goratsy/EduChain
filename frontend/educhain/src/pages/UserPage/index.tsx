import { type FunctionComponent } from "react";
import { useParams } from "react-router";
import { useUserInfo } from "../../controllers/queries";
import Navabar from "../../shared/components/Navbar";
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import type { UserInfo } from "../../controllers/models";


interface UserPageProps {

}

const UserPage: FunctionComponent<UserPageProps> = () => {
    let params = useParams();
    const userAddress = params.address;

    let userInfo: UserInfo = useUserInfo(userAddress).data || {} as UserInfo;

    return (
        <>
            <Navabar />
            <Box component="section" sx={{ px: "10%", mt: '2rem', overflow: "hidden" }}>
                <Typography variant="h6" component="h2" sx={{ textAlign: 'left', fontSize: '1.4rem' }}>Пользователь с адресом - <Box component="span" sx={{ textDecoration: 'underline' }}>{params.address}</Box></Typography>
                <Box component="div" sx={{ mt: "1rem" }}>

                    <Box component="div" sx={{ mb: '0.5rem' }}>
                        <Typography variant="h6" component="h2" sx={{ textAlign: 'left', fontSize: '1.2rem', mb: '0.5rem' }}>Общая информация</Typography>
                        <Typography variant="body1">Адрес - {userInfo.address}</Typography>
                        <Typography variant="body1">Роль - {userInfo.role !== 'None' ? userInfo.role : 'Нет'}</Typography>
                    </Box>
                    <Box component="div" sx={{ mb: '0.5rem' }}>
                        <Typography variant="h6" component="h2" sx={{ textAlign: 'left', fontSize: '1.2rem', mb: '0.5rem' }}>Количество достижений - {userInfo.achievementsCount}</Typography>

                        {userInfo.achievements !== undefined && userInfo.achievements.length !== 0 ?
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 1000 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Номер достижения</TableCell>
                                            <TableCell align="right">Название курса</TableCell>
                                            <TableCell align="right">Оценка</TableCell>
                                            <TableCell align="right">Адрес университета</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {userInfo.achievements.map((achievement, index) => (
                                            <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                <TableCell component="th" scope="row">{++index}</TableCell>
                                                <TableCell align="right">{achievement.courseName}</TableCell>
                                                <TableCell align="right">{achievement.grade}</TableCell>
                                                <TableCell align="right">{achievement.university}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            : null}
                    </Box>
                </Box>
            </Box>


        </>
    );
}

export default UserPage;