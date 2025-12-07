import React, { useState } from "react";
import axios from "axios";
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

const API_URL = "http://localhost:5000/api/user/login"; // backend login route

const Login = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId.trim() || !password.trim()) {
      toast.error("Enter UserID & Password!");
      return;
    }

    try {
      const res = await axios.post(API_URL, { userId, password });

      // Save login info
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Login Successful!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1200);
    } catch (err) {
      console.error(err);
      toast.error("Invalid UserID or Password!");
    }
  };

  return (
    <>
      <ToastContainer position="top-center" />

      <Container maxWidth="sm" sx={{ marginTop: "6rem" }}>
        <Paper elevation={6} sx={{ padding: "2rem", backgroundColor: "#001f3f", color: "white" }}>
          <Typography variant="h4" align="center" gutterBottom>
            Login
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "grid", gap: 2 }}
          >
            <TextField
              label="User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
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
              Login
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default Login;
