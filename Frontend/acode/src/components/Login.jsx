import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    TextField,
    Typography,
    Link,
    Container,
    Snackbar,
    Alert,
    AlertTitle,
    Slide,
} from '@mui/material';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState(''); // 'success' or 'error'
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://127.0.0.1:8000/auth/api/login/', {
                email: email,
                password: password,
            });

            showMessage('Login successful! Redirecting to home...', 'success');
            setTimeout(() => navigate('/home'), 2000); // Redirect after 2 seconds
        } catch (error) {
            showMessage(
                error.response?.data?.error || 'Invalid credentials. Please try again.',
                'error'
            );
        }
    };

    const showMessage = (msg, sev) => {
        setMessage(msg);
        setSeverity(sev);
        setOpenSnackbar(true);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 4 }}>
            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    boxShadow: 3,
                    borderRadius: 2,
                    padding: 4,
                    bgcolor: 'background.paper',
                }}
            >
                <Typography variant="h5" component="h1" textAlign="center">
                    Login
                </Typography>
                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    required
                    autoComplete="off"
                    variant="standard" // Changed to standard variant
                />
                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    required
                    autoComplete="current-password"
                    variant="standard" // Changed to standard variant
                />
                <Button type="submit" variant="contained" fullWidth size="large">
                    Login
                </Button>
                <Typography variant="body2" align="center">
                    Don't have an account?{' '}
                    <Link
                        component="button"
                        variant="body2"
                        onClick={(e) => {
                            e.preventDefault();
                            navigate('/signup');
                        }}
                    >
                        Sign Up
                    </Link>
                </Typography>
            </Box>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                TransitionComponent={Slide} // Add animation
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={severity}
                    sx={{
                        minWidth: '300px',
                        boxShadow: 3,
                        borderRadius: 2,
                    }}
                >
                    <AlertTitle>{severity === 'success' ? 'Success' : 'Error'}</AlertTitle>
                    {message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Login;
