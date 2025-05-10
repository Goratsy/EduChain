import { Link } from "react-router";
import { useAdminAddress, useAllUsers } from "../../controllers/queries";
import Navbar from "../../shared/components/Navbar";
import { Box, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import Paper from '@mui/material/Paper';
import { ContentCopy } from "@mui/icons-material";
import { toast } from "react-toastify";

const UsersPage = () => {
    const users: string[] = useAllUsers().data || [];
    const adminAddress = useAdminAddress().data;

    const copyUserAddress = (userAddress: string) => { 
        navigator.clipboard.writeText(userAddress);
        toast.success('Адрес успешно скопирован!', {autoClose: 2000, position: 'top-left', hideProgressBar: true, pauseOnHover: false})
    }

    return (
        <>
            <Navbar />
            <Box component="section" sx={{ mt: '2rem', overflow: "hidden" }}>
                <Typography variant="h4" component="h2" sx={{ textAlign: 'center' }}>Пользователи системы</Typography>

                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Номера адресов</TableCell>
                                <TableCell align="right">Адреса</TableCell>
                                <TableCell align="right">Скопировать</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((userAddress, index) => (
                                <TableRow key={userAddress} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component="th" scope="row">{++index}</TableCell>
                                    <TableCell align="right">
                                        {adminAddress === userAddress ?
                                            <Typography
                                                variant="h6"
                                                sx={{ display: "inline-block", mr: '1rem' }}
                                            >
                                                Админ
                                            </Typography>
                                            : null}

                                        <Button
                                            variant="contained"
                                            sx={{ bgcolor: 'var(--bg)', display: "inline-block" }}
                                        >
                                            <Link
                                                to={`/user/${userAddress}`}
                                                style={{ textDecoration: 'none', display: 'block', color: 'white' }}
                                            >
                                                {userAddress}
                                            </Link>

                                        </Button>
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton onClick={() => copyUserAddress(userAddress)}>
                                            <ContentCopy />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </>
    );
}

export default UsersPage;