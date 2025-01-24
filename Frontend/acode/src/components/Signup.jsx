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

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState(''); // 'success' or 'error'
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Password validation
        if (password !== confirmPassword) {
            showMessage('Passwords do not match', 'error');
            return;
        }
        if (password.length < 8) {
            showMessage('Password must be at least 8 characters long', 'error');
            return;
        }

        // API call
        try {
            const response = await axios.post('http://127.0.0.1:8000/auth/api/signup/', {
                email: email,
                password: password,
                confirm_password: confirmPassword,
            });

            showMessage('Signup successful! Redirecting to login...', 'success');
            setTimeout(() => navigate('/login'), 2000); // Redirect after 2 seconds
        } catch (error) {
            showMessage(
                error.response?.data?.error || 'An unexpected error occurred. Please try again.',
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
                    Sign Up
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
                    autoComplete="new-password"
                    variant="standard" // Changed to standard variant
                />
                <TextField
                    label="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    fullWidth
                    required
                    autoComplete="new-password"
                    variant="standard" // Changed to standard variant
                />
                <Button type="submit" variant="contained" fullWidth size="large">
                    Sign Up
                </Button>
                <Typography variant="body2" align="center">
                    Already have an account?{' '}
                    <Link
                        component="button"
                        variant="body2"
                        onClick={(e) => {
                            e.preventDefault();
                            navigate('/login');
                        }}
                    >
                        Login
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

export default Signup;
