import { Box, Button, TextField, Typography } from "@mui/material";
import Navbar from "../../shared/components/Navbar";
import { useAddUniversity, useAdminAddress } from "../../controllers/queries";
import { toast } from "react-toastify";
import { useEffect, useState, type FormEvent } from "react";
import type { AddUniversityRequest } from "../../controllers/models";

const AdminPage = () => {
    const adminAddress = useAdminAddress().data;
    // 0xedbe7323c8169a92bbc036be6e87ca8504b47fae6f8261d5808eff0b072054e8

    const [valueAddresAdmin, setValueAddresAdmin] = useState<string>('');
    const { mutate: addUniversity } = useAddUniversity();


    useEffect(() => {
        setValueAddresAdmin(adminAddress || '');
    }, [adminAddress])

    const [universityAddress, setUniversityAddress] = useState('');
    const [privateKey, setPrivateKey] = useState('');

    const handleAddUniversity = (e: FormEvent) => {
        e.preventDefault();
        
        const requestData: AddUniversityRequest = {
            universityAddress,
            adminAddress: adminAddress || "",
            privateKey
        };

        addUniversity(requestData, {
            onSuccess: (data) => {
                toast.success('Университет успешно добавлен!', { autoClose: 2000, position: 'top-left', hideProgressBar: true, pauseOnHover: false })
                console.log('Университет добавлен:', data);
            },
            onError: (error: any) => {
            
                toast.error(`Ошибка: ${error.response.data.error}`, { autoClose: 4000, position: 'top-left', hideProgressBar: true, pauseOnHover: false })
                console.error('Ошибка:', error);
            }
        });


    }


    return (
        <>
            <Navbar />
            <Box component="section" sx={{ px: "10%", mt: '2rem', overflow: "hidden" }}>
                <Typography variant="h6" component="h2" sx={{ textAlign: 'left', fontSize: '1.6rem' }}>Администраторская панель управления</Typography>
                <Typography variant="body1">Функция: добавление роли адресам - назначить адресу роль университета</Typography>

                <Box sx={{ mt: "1.5rem" }}>
                    <Typography variant="h6" component="h3" sx={{ textAlign: 'left', fontSize: '1.2rem', mb: '0.8rem' }}>Добавление роли адресу</Typography>

                    <Box
                        component="form"
                        sx={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}
                        onSubmit={(e: FormEvent) => { handleAddUniversity(e) }}
                    >
                        <TextField value={universityAddress} onChange={(e) => setUniversityAddress(e.target.value)} label="Адрес университета" variant="outlined" sx={{ width: '100%' }} />
                        <TextField value={valueAddresAdmin} disabled label="Адрес админа" variant="outlined" sx={{ width: '100%' }} />
                        <TextField value={privateKey} onChange={(e) => setPrivateKey(e.target.value)} label="Приватный ключ администратора" variant="outlined" sx={{ width: '100%' }} />
                        <Button type="submit" variant="contained" sx={{ bgcolor: 'var(--bg)' }}>Назначить</Button>
                    </Box>
                </Box>
            </Box>

        </>
    );
}

export default AdminPage;