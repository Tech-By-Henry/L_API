// src/pages/Signup.jsx
import React, { useState, useMemo } from "react";
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
  LinearProgress,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";

const Signup = () => {
  const navigate = useNavigate();
  const isXs = useMediaQuery("(max-width:420px)");
  const isSm = useMediaQuery("(max-width:900px)");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState(""); // 'success' or 'error'
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);

  // Basic email validation (UX only)
  const isValidEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).toLowerCase());

  // Password strength estimation (simple)
  const passwordScore = useMemo(() => {
    let score = 0;
    if (!password) return 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score; // 0..4
  }, [password]);

  const strengthLabel = useMemo(() => {
    switch (passwordScore) {
      case 0:
      case 1:
        return "Weak";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Strong";
      default:
        return "";
    }
  }, [passwordScore]);

  const strengthValue = useMemo(() => (passwordScore / 4) * 100, [passwordScore]);

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

    // client-side validations (keeps original behavior but improves UX)
    if (!email || !password || !confirmPassword) {
      showMessage("Please fill in all fields.", "error");
      return;
    }
    if (!isValidEmail(email)) {
      showMessage("Please enter a valid email address.", "error");
      return;
    }
    if (password !== confirmPassword) {
      showMessage("Passwords do not match", "error");
      return;
    }
    if (password.length < 8) {
      showMessage("Password must be at least 8 characters long", "error");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://127.0.0.1:8000/auth/api/signup/", {
        email: email,
        password: password,
        confirm_password: confirmPassword,
      });

      // original behaviour preserved: show message and redirect shortly after
      showMessage("Signup successful! Redirecting to login...", "success");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      const serverMsg =
        error?.response?.data?.error ||
        error?.response?.data?.detail ||
        "An unexpected error occurred. Please try again.";
      showMessage(serverMsg, "error");
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Button disabled if client-side validations fail
  const isSubmitDisabled =
    loading ||
    !email ||
    !password ||
    !confirmPassword ||
    !isValidEmail(email) ||
    password !== confirmPassword ||
    password.length < 8;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f7f9ff 0%, #ffffff 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 2, sm: 3 },
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          width: { xs: "95%", sm: "85%", md: "70%", lg: "56%", xl: "46%" },
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
            boxShadow: "0 12px 40px rgba(3, 8, 23, 0.08)",
            minHeight: { sm: 380 },
          }}
        >
          {/* Brand column (hidden on very small screens) */}
          <Box
            sx={{
              flex: { xs: "0 0 auto", sm: 1 },
              display: { xs: "none", sm: "flex" },
              background:
                "linear-gradient(135deg, rgba(3,218,197,0.06) 0%, rgba(98,0,234,0.06) 100%)",
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
              sx={{ fontWeight: 800, mb: 1, color: "primary.main" }}
            >
              Create Account
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              sx={{ px: 1 }}
            >
              Join now — secure access to your workspace across devices.
            </Typography>
          </Box>

          {/* Form */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              flex: 2,
              p: { xs: 3, sm: 4, md: 5 },
              display: "flex",
              flexDirection: "column",
              gap: 2,
              minWidth: 0,
            }}
            noValidate
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant={isSm ? "h6" : "h5"} sx={{ fontWeight: 800 }}>
                Sign Up
              </Typography>
              <Divider sx={{ flex: 1 }} />
            </Box>

            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              autoComplete="email"
              variant="outlined"
              size="medium"
              helperText={
                email && !isValidEmail(email) ? "Enter a valid email address" : " "
              }
              error={!!(email && !isValidEmail(email))}
              inputProps={{ "aria-label": "email" }}
            />

            <TextField
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              autoComplete="new-password"
              variant="outlined"
              size="medium"
              type={showPassword ? "text" : "password"}
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
              helperText="Use at least 8 characters. Mix uppercase, numbers & symbols for stronger password."
            />

            {/* Password strength meter */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={strengthValue}
                  sx={{
                    height: 8,
                    borderRadius: 2,
                    backgroundColor: "#f0f3ff",
                  }}
                />
              </Box>
              <Typography
                variant="caption"
                sx={{
                  whiteSpace: "nowrap",
                  color:
                    passwordScore <= 1
                      ? "error.main"
                      : passwordScore === 2
                      ? "warning.main"
                      : "success.main",
                  fontWeight: 700,
                }}
              >
                {strengthLabel}
              </Typography>
            </Box>

            <TextField
              label="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              required
              autoComplete="new-password"
              variant="outlined"
              size="medium"
              type={showConfirm ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showConfirm ? "hide password" : "show password"}
                      onClick={() => setShowConfirm((s) => !s)}
                      edge="end"
                      size="large"
                    >
                      {showConfirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              helperText={
                confirmPassword && password !== confirmPassword
                  ? "Passwords do not match"
                  : " "
              }
              error={!!(confirmPassword && password !== confirmPassword)}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={isSubmitDisabled}
              sx={{
                mt: 0.5,
                py: 1.4,
                fontWeight: 800,
                letterSpacing: 0.2,
              }}
            >
              {loading ? <CircularProgress size={22} thickness={5} /> : "Sign Up"}
            </Button>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 1,
                mt: 0.5,
              }}
            >
              <CheckCircleOutline color="disabled" />
              <Typography variant="caption" color="text.secondary" textAlign="center">
                By signing up you agree to our Terms of Service and Privacy Policy.
              </Typography>
            </Box>

            <Typography variant="body2" align="center" sx={{ mt: 1 }}>
              Already have an account?{" "}
              <Link
                component="button"
                variant="body2"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/login");
                }}
                sx={{ fontWeight: 700 }}
              >
                Login
              </Link>
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

export default Signup;
