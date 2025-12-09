import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";

const API_URL = "http://localhost:5000/api/user/register";

const AddNewUser = () => {
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("All fields are required!");
      return;
    }

    try {
      const res = await axios.post(API_URL, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(`User Created! User ID: ${res.data.userId}`);
      setFormData({ name: "", email: "", password: "" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to create user!");
    }
  };

  return (
    <Box
      sx={{
        p: 4,
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0A2A43, #0F3B66)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ToastContainer position="top-center" />

      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 500,
          borderRadius: 3,
          backgroundColor: "#ffffff",
          backdropFilter: "blur(10px)",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: "700",
            textAlign: "center",
            color: "#0F3B66",
            mb: 3,
          }}
        >
          Create User
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              variant="outlined"
              InputLabelProps={{ style: { color: "#0F3B66" } }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
              InputLabelProps={{ style: { color: "#0F3B66" } }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              variant="outlined"
              InputLabelProps={{ style: { color: "#0F3B66" } }}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleSubmit}
              sx={{
                height: 50,
                backgroundColor: "#0F3B66",
                fontSize: "1rem",
                fontWeight: "600",
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: "#093051",
                },
              }}
            >
              Create User
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default AddNewUser;
