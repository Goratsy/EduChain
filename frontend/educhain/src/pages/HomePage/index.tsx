import { useNavigate } from "react-router";
import Navbar from "../../shared/components/Navbar";
import { Box, Typography, Button, Container, useTheme } from '@mui/material';
import GITIcon from "../../shared/components/icons/GITIcon";
// import heroImage from './path-to-your-hero-image.jpg'; // Замените на ваш путь к изображению

const HomePage = () => {
    const theme = useTheme();
    const navigator = useNavigate();

    return (
        <Box component="section" sx={{ height: "100%" }}>
            <Navbar />
            <Box
                sx={{
                    py: 10,
                    height: '100%'
                }}
            >
                <Container maxWidth="lg" sx={{height: '100%'}}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            px: 2,
                        }}
                    >
                        {/* Заголовок */}
                        <Typography
                            variant="h2"
                            component="h1"
                            sx={{
                                fontWeight: 700,
                                mb: 3,
                                color: theme.palette.text.primary,
                                fontSize: { xs: '2.5rem', md: '3.5rem' },
                                lineHeight: 1.2
                            }}
                        >
                            Учет академических достижений
                        </Typography>

                        {/* Описание */}
                        <Typography
                            variant="h5"
                            component="p"
                            sx={{
                                maxWidth: '700px',
                                mb: 4,
                                color: theme.palette.text.secondary,
                                fontSize: { xs: '1.1rem', md: '1.25rem' }
                            }}
                        >
                            Прозрачная и безопасная система хранения образовательных результатов
                            с использованием технологии блокчейн
                        </Typography>

                        {/* Кнопки */}
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                variant="contained"
                                size="large"
                                sx={{
                                    px: 4,
                                    fontSize: '1rem',
                                    textTransform: 'none',
                                    backgroundColor: 'var(--bg)'
                                }}
                                onClick={() => { navigator('/users') }}
                            >
                                Начать использовать
                            </Button>
                            <Button
                                variant="outlined"
                                size="large"
                                sx={{
                                    px: 4,
                                    fontSize: '1rem',
                                    textTransform: 'none',
                                    color: 'var(--accent)',
                                    borderColor: 'var(--accent)'
                                }}
                                href="https://github.com/Goratsy/EduChain"
                                target="_blank"
                                startIcon={<GITIcon />}
                            >
                                Узнать больше о проекте
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </Box>
        </Box>

    );
}

export default HomePage;