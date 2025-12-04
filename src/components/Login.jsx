import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
} from "@mui/material";

import { ToastContainer, toast } from "react-toastify";

const SHEET_ID = "1G1Hvuz9sdgcNMHpqNlOelXjmDLIZIMeCVGd7hald0WA";

async function getTab(tabName) {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${tabName}`;
  const res = await fetch(url);
  const csv = await res.text();
  const lines = csv.trim().split("\n");

  return lines.slice(1).map((line) => {
    const clean = line.replace(/"/g, "").trim();
    const [user, pass] = clean.split(",");

    return { user: user.trim(), pass: pass.trim() };
  });
}

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userList, setUserList] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setUserList(await getTab("user"));
    };
    load();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      toast.error("Please enter username & password!");
      return;
    }

    const matchedUser = userList.find(
      (u) => u.user === username && u.pass === password
    );

    if (!matchedUser) {
      toast.error("Invalid username or password!");
      return;
    }

    // success
    toast.success("Login Successfully!");

    localStorage.setItem("auth", "true");
    localStorage.setItem("user", username);

    setTimeout(() => {
      navigate("/dashboard");
    }, 1200);
  };

  return (
    <>
      <ToastContainer position="top-center" />

      <Container maxWidth="sm" sx={{ marginTop: "6rem" }}>
        <Paper
          elevation={6}
          sx={{
            padding: "2rem",
            backgroundColor: "#001f3f",
            color: "white",
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Login
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2 }}>
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              InputLabelProps={{ style: { color: "white" } }}
              InputProps={{ style: { color: "white" } }}
            />

            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputLabelProps={{ style: { color: "white" } }}
              InputProps={{ style: { color: "white" } }}
            />

            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#001a35",
                color: "white",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#00306b" },
              }}
            >
              Sign in
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default Login;
