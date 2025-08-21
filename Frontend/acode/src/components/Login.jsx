// src/pages/Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
  Paper,
  Avatar,
  InputAdornment,
  IconButton,
  useMediaQuery,
  CircularProgress,
  Divider,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// Use the API base exported from your helper or read directly from import.meta.env
// If you followed earlier instructions, src/lib/api.js exports API_BASE.
// Otherwise you can replace API_BASE with import.meta.env.VITE_API_BASE_URL
import { API_BASE } from "../lib/api";

const Login = () => {
  const navigate = useNavigate();
  const isXs = useMediaQuery("(max-width:420px)");
  const isSm = useMediaQuery("(max-width:900px)");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState(""); // 'success' or 'error'
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Basic email check (UX only; server still validates)
  const isValidEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).toLowerCase());

  const showMessage = (msg, sev) => {
    setMessage(msg);
    setSeverity(sev);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      showMessage("Please enter both email and password.", "error");
      return;
    }
    if (!isValidEmail(email)) {
      showMessage("Please enter a valid email address.", "error");
      return;
    }

    setLoading(true);
    try {
      // Construct URL using API_BASE (no trailing slash issues)
      const base = (API_BASE || import.meta.env.VITE_API_BASE_URL).replace(/\/$/, "");
      const url = `${base}/auth/api/login/`;

      const response = await axios.post(url, {
        email: email,
        password: password,
      });

      // If your API returns tokens (common patterns: access/refresh or token)
      const data = response?.data || {};
      if (data.access || data.token || data.refresh) {
        // store safely for now in localStorage (consider httpOnly cookies for production)
        if (data.access) localStorage.setItem("access_token", data.access);
        if (data.refresh) localStorage.setItem("refresh_token", data.refresh);
        if (data.token) localStorage.setItem("token", data.token);
      }

      showMessage("Login successful! Redirecting to home...", "success");

      // brief delay to let user read the success message before redirect
      setTimeout(() => navigate("/home"), 1200);
    } catch (error) {
      const serverMsg =
        error?.response?.data?.error ||
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "Invalid credentials. Please try again.";
      showMessage(serverMsg, "error");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f6f8ff 0%, #ffffff 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 2, sm: 3 },
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          width: { xs: "95%", sm: "85%", md: "70%", lg: "56%", xl: "48%" },
          mx: "auto",
        }}
      >
        <Paper
          elevation={8}
          sx={{
            borderRadius: 2,
            overflow: "hidden",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "stretch",
            boxShadow: "0 10px 40px rgba(2,6,23,0.08)",
            minHeight: { xs: "auto", sm: 320 },
          }}
        >
          <Box
            sx={{
              flex: { xs: "0 0 auto", sm: 1 },
              display: { xs: "none", sm: "flex" },
              background:
                "linear-gradient(135deg, rgba(98,0,234,0.07) 0%, rgba(3,218,197,0.04) 100%)",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              p: { sm: 3, md: 4 },
              minWidth: 220,
            }}
          >
            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: 72,
                height: 72,
                mb: 2,
                boxShadow: "0 8px 24px rgba(98,0,234,0.16)",
              }}
            >
              <LockOutlinedIcon />
            </Avatar>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                mb: 1,
                color: "primary.main",
                letterSpacing: 0.2,
              }}
            >
              Welcome Back
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              sx={{ px: 1 }}
            >
              Secure access to your workspace. Fast login and responsive UI across
              devices.
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              flex: 2,
              p: { xs: 3, sm: 4, md: 5 },
              display: "flex",
              flexDirection: "column",
              gap: 2.25,
              minWidth: 0,
            }}
            noValidate
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                mb: { xs: 0, sm: 0 },
              }}
            >
              <Typography
                variant={isSm ? "h6" : "h5"}
                sx={{ fontWeight: 800, whiteSpace: "nowrap" }}
              >
                Login
              </Typography>
              <Divider sx={{ flex: 1 }} />
            </Box>

            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              autoComplete="off"
              variant="outlined"
              size="large"
              helperText={
                email && !isValidEmail(email) ? "Enter a valid email address" : " "
              }
              error={!!(email && !isValidEmail(email))}
              inputProps={{
                "aria-label": "email",
                style: { fontSize: isXs ? 14 : 15 },
              }}
            />

            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              autoComplete="current-password"
              variant="outlined"
              size="large"
              inputProps={{ style: { fontSize: isXs ? 14 : 15 } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? "hide password" : "show password"}
                      onClick={() => setShowPassword((s) => !s)}
                      edge="end"
                      size="large"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap",
                mt: 0.5,
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: 13, ml: "auto" }}
              >
                Don't have an account?{" "}
                <Link
                  component="button"
                  variant="body2"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/signup");
                  }}
                  sx={{ fontWeight: 700 }}
                >
                  Sign Up
                </Link>
              </Typography>
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{
                mt: 0.5,
                py: isXs ? 1.1 : 1.35,
                fontWeight: 800,
                letterSpacing: 0.2,
                fontSize: isXs ? 15 : 16,
              }}
            >
              {loading ? <CircularProgress size={22} thickness={5} /> : "Login"}
            </Button>

            <Typography
              variant="caption"
              color="text.secondary"
              textAlign="center"
              sx={{ mt: 0.5, mb: { xs: 0, sm: 0 } }}
            >
              By logging in you agree to our Terms of Service and Privacy Policy.
            </Typography>
          </Box>
        </Paper>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={4200}
          onClose={handleCloseSnackbar}
          TransitionComponent={Slide}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={severity || "info"}
            sx={{
              minWidth: 300,
              boxShadow: 3,
              borderRadius: 2,
            }}
          >
            <AlertTitle>{severity === "success" ? "Success" : "Error"}</AlertTitle>
            {message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default Login;
