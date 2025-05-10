import { Box, Button, TextField, Typography } from "@mui/material";
import Navbar from "../../shared/components/Navbar";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { useAddAchievement, useAddStudent } from "../../controllers/queries";
import { toast } from "react-toastify";
import type { AddAchievementRequest, AddStudentRequest } from "../../controllers/models";

const UniversityPage = () => {
    const { mutate: addStudent } = useAddStudent();
    const { mutate: addAchievement } = useAddAchievement();


    // useEffect(() => {

    // }, [])

    const [
        formDataAddRoleStudent,
        setFormDataAddRoleStudent
    ] = useState<AddStudentRequest>({
        studentAddress: '',
        universityAddress: '',
        privateKey: '',
    });


    const [
        formDataAddAchievement,
        setFormDataAddAchievement
    ] = useState<AddAchievementRequest>({
        studentAddress: '',
        studentId: '',
        courseName: '',
        grade: 0,
        universityAddress: '',
        privateKey: '',
    });

    const changeFormDataAddRoleStudent = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormDataAddRoleStudent(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const submitFormDataAddRoleStudent = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(formDataAddRoleStudent);

        addStudent(formDataAddRoleStudent, {
            onSuccess: (data) => {
                toast.success('Роль успешно назначена!', { autoClose: 2000, position: 'top-left', hideProgressBar: true, pauseOnHover: false })
                console.log(data);
            },
            onError: (error: any) => {
                toast.error(`Ошибка: ${error.response.data.error}`, { autoClose: 4000, position: 'top-left', hideProgressBar: true, pauseOnHover: false })
                console.log(error);
            }
        });
    }

    const changeFormDataAddAchievement = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormDataAddAchievement(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const submitFormDataAddAchievement = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!Number.isInteger(Number(formDataAddAchievement.grade)) || Number(formDataAddAchievement.grade) < 0)
            toast.error(`Ошибка: поле оценки - целое положительное число`, { autoClose: 3000, position: 'top-left', hideProgressBar: true, pauseOnHover: false })

        formDataAddAchievement.grade = Number(formDataAddAchievement.grade);

        addAchievement(formDataAddAchievement, {
            onSuccess: (data) => {
                toast.success('Достижение успешно добавлено!', { autoClose: 2000, position: 'top-left', hideProgressBar: true, pauseOnHover: false })
                console.log(data);
            },
            onError: (error: any) => {
                toast.error(`Ошибка: ${error.response.data.error}`, { autoClose: 4000, position: 'top-left', hideProgressBar: true, pauseOnHover: false })
                console.log(error);
            }
        });

        console.log(formDataAddAchievement);
    }

    // const handleAddUniversity = (e: FormEvent) => {
    //     e.preventDefault();

    //     const requestData = {
    //         universityAddress,
    //         adminAddress: "",
    //         privateKey
    //     };

    //     addUniversity(requestData, {
    //         onSuccess: (data) => {
    //             toast.success('Университет успешно добавлен!', { autoClose: 2000, position: 'top-left', hideProgressBar: true, pauseOnHover: false })
    //             console.log('Университет добавлен:', data);
    //         },
    //         onError: (error: any) => {
    //             toast.error(`Ошибка: ${error.response.data.error}`, { autoClose: 4000, position: 'top-left', hideProgressBar: true, pauseOnHover: false })
    //             console.error('Ошибка:', error);
    //         }
    //     });
    // }


    return (
        <>
            <Navbar />
            <Box component="section" sx={{ px: "10%", mt: '2rem', overflow: "hidden", pb: '4rem' }}>
                <Typography variant="h6" component="h2" sx={{ textAlign: 'left', fontSize: '1.4rem' }}>Панель управления университета</Typography>
                <Typography variant="body1">Функции: добавление роли адресам - назначить адресу роль ученика, добавить ученику достижение</Typography>

                <Box sx={{ mt: "1.5rem" }}>
                    <Typography variant="h6" component="h3" sx={{ textAlign: 'left', fontSize: '1.2rem', mb: '0.8rem' }}>Добавление роли адресу</Typography>

                    <Box
                        component="form"
                        sx={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}
                        onSubmit={submitFormDataAddRoleStudent}
                    >
                        <TextField name="studentAddress"
                            value={formDataAddRoleStudent.studentAddress}
                            onChange={changeFormDataAddRoleStudent}
                            label="Адрес студента"
                            variant="outlined"
                            sx={{ width: '100%' }}
                        />
                        <TextField name="universityAddress"
                            value={formDataAddRoleStudent.universityAddress}
                            onChange={changeFormDataAddRoleStudent}
                            label="Адрес университета"
                            variant="outlined"
                            sx={{ width: '100%' }}
                        />
                        <TextField name="privateKey"
                            value={formDataAddRoleStudent.privateKey}
                            onChange={changeFormDataAddRoleStudent}
                            label="Приватный ключ университета"
                            variant="outlined"
                            sx={{ width: '100%' }}
                        />
                        <Button type="submit" variant="contained" sx={{ bgcolor: 'var(--bg)' }}>Назначить роль</Button>
                    </Box>
                </Box>

                <Box sx={{ mt: "1.5rem" }}>
                    <Typography variant="h6" component="h3" sx={{ textAlign: 'left', fontSize: '1.2rem', mb: '0.8rem' }}>Добавление достижения студенту</Typography>

                    <Box
                        component="form"
                        sx={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}
                        onSubmit={submitFormDataAddAchievement}
                    >
                        <TextField
                            name="studentAddress"
                            value={formDataAddAchievement.studentAddress}
                            onChange={changeFormDataAddAchievement}
                            label="Адрес студента"
                            variant="outlined"
                            sx={{ width: '100%' }} />
                        <TextField
                            name="studentId"
                            value={formDataAddAchievement.studentId}
                            onChange={changeFormDataAddAchievement}
                            label="Индивидуальный номер студента"
                            variant="outlined"
                            sx={{ width: '100%' }} />
                        <TextField
                            name="courseName"
                            value={formDataAddAchievement.courseName}
                            onChange={changeFormDataAddAchievement}
                            label="Название курса"
                            variant="outlined"
                            sx={{ width: '100%' }} />
                        <TextField
                            name="grade"
                            value={formDataAddAchievement.grade}
                            onChange={changeFormDataAddAchievement}
                            label="Оценка"
                            variant="outlined"
                            sx={{ width: '100%' }} />
                        <TextField
                            name="universityAddress"
                            value={formDataAddAchievement.universityAddress}
                            onChange={changeFormDataAddAchievement}
                            label="Адрес университета"
                            variant="outlined"
                            sx={{ width: '100%' }} />
                        <TextField
                            name="privateKey"
                            value={formDataAddAchievement.privateKey}
                            onChange={changeFormDataAddAchievement}
                            label="Приватный ключ университета"
                            variant="outlined"
                            sx={{ width: '100%' }} />
                        <Button type="submit" variant="contained" sx={{ bgcolor: 'var(--bg)' }}>Добавить достижение</Button>
                    </Box>
                </Box>
            </Box>
        </>
    );
}

export default UniversityPage;