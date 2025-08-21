// src/pages/Home.jsx  (or wherever your component lives)
import React, { useState, useEffect } from "react";
import {
  Fab, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Card, CardContent, Typography, Grid, ThemeProvider,
  createTheme, CssBaseline, InputAdornment, Autocomplete
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NumbersIcon from "@mui/icons-material/Numbers";
import AccountBalance from "@mui/icons-material/AccountBalance";
import CheckCircle from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

import { API_BASE, NUB_BANKS_URL, apiFetch } from "../lib/api"; // adjust path if needed

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#6200ea" },
    secondary: { main: "#03dac5" },
  },
});

const Home = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [banks, setBanks] = useState([]);
  const [accountHolderName, setAccountHolderName] = useState("");
  const [error, setError] = useState("");
  const [savedAccounts, setSavedAccounts] = useState(() => {
    const saved = localStorage.getItem("savedAccounts");
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        // Uses the env-configurable NUB bank URL
        const res = await fetch(NUB_BANKS_URL);
        const data = await res.json();
        setBanks(data);
      } catch (err) {
        console.error("Error fetching banks:", err);
      }
    };
    fetchBanks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setAccountHolderName("");

    try {
      // Using apiFetch with path so API_BASE is used automatically
      const { ok, data } = await apiFetch("/auth/verify-account/", {
        method: "POST",
        body: JSON.stringify({
          account_number: accountNumber,
          bank_code: selectedBank,
        }),
      });

      if (ok) {
        setAccountHolderName(data?.account_name || "");
      } else {
        setError(data?.error || "Failed to verify account");
      }
    } catch (err) {
      setError("An error occurred while verifying the account");
      console.error("Verification error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAccount = () => {
    const accountExists = savedAccounts.some(
      (account) =>
        account.account_number === accountNumber && account.bank_code === selectedBank
    );

    if (accountExists) {
      alert("This account has already been saved.");
      return;
    }

    const newAccount = {
      account_number: accountNumber,
      account_name: accountHolderName,
      bank_code: selectedBank,
    };

    const updatedSavedAccounts = [...savedAccounts, newAccount];
    setSavedAccounts(updatedSavedAccounts);
    localStorage.setItem("savedAccounts", JSON.stringify(updatedSavedAccounts));
    alert("Account saved successfully!");
    setShowModal(false);
  };

  const getBankName = (bankCode) => {
    const bank = banks.find((bank) => bank.code === bankCode);
    return bank ? bank.name : "Unknown Bank";
  };

  const filteredAccounts = savedAccounts.filter((account) => {
    const query = searchQuery.toLowerCase();
    return (
      account.account_name.toLowerCase().includes(query) ||
      account.account_number.includes(query)
    );
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ padding: "20px" }}>
        <Typography variant="h4" gutterBottom style={{ color: theme.palette.primary.main }}>
          Verify and Save Bank Account
        </Typography>

        <TextField
          fullWidth
          placeholder="Search by account name or number..."
          variant="filled"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginBottom: "20px" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <Grid container spacing={2}>
          {filteredAccounts.map((account, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card style={{ border: `1px solid ${theme.palette.primary.main}` }}>
                <CardContent>
                  <Typography variant="h6">
                    <AccountCircle fontSize="small" style={{ marginRight: "5px" }} />
                    {account.account_name}
                  </Typography>
                  <Typography>
                    <NumbersIcon fontSize="small" style={{ marginRight: "5px" }} />
                    Account Number: {account.account_number}
                  </Typography>
                  <Typography>
                    <AccountBalance fontSize="small" style={{ marginRight: "5px" }} />
                    Bank: {getBankName(account.bank_code)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Fab
          color="primary"
          onClick={() => setShowModal(true)}
          style={{ position: "fixed", bottom: "20px", right: "20px" }}
        >
          <AddIcon />
        </Fab>

        <Dialog open={showModal} onClose={() => setShowModal(false)}>
          <DialogTitle>Add New Account</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Account Number"
                variant="filled"
                margin="normal"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <NumbersIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <Autocomplete
                fullWidth
                options={banks}
                getOptionLabel={(bank) => bank.name || ""}
                value={banks.find((bank) => bank.code === selectedBank) || null}
                onChange={(e, newValue) => setSelectedBank(newValue ? newValue.code : "")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Bank"
                    margin="normal"
                    required
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <InputAdornment position="start">
                            <AccountBalance />
                          </InputAdornment>
                          {params.InputProps.startAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
              <DialogActions>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Verify"}
                </Button>
                <Button
                  onClick={() => setShowModal(false)}
                  variant="outlined"
                  color="secondary"
                  startIcon={<CloseIcon />}
                >
                  Close
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
          {accountHolderName && (
            <DialogContent>
              <Typography variant="h6">
                <CheckCircle fontSize="small" style={{ marginRight: "5px" }} />
                Account Holder: {accountHolderName}
              </Typography>
              <Button
                onClick={handleSaveAccount}
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                fullWidth
                style={{ marginTop: "10px" }}
              >
                Save Account
              </Button>
            </DialogContent>
          )}
          {error && (
            <Typography color="error" style={{ margin: "10px" }}>
              <ErrorIcon fontSize="small" style={{ marginRight: "5px" }} />
              {error}
            </Typography>
          )}
        </Dialog>
      </div>
    </ThemeProvider>
  );
};

export default Home;
