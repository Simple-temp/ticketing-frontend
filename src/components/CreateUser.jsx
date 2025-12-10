import React, { useState } from "react";
import axios from "axios";
import { Box, TextField, Button, Typography, Paper, Grid } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";

// Backend API
const API_URL = "http://192.168.12.62:5000/api/user/register";

const CreateUser = () => {
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
    <Box sx={{ p: 4 }}>
      <ToastContainer position="top-center" />

      <Paper sx={{ p: 4, maxWidth: 600, margin: "0 auto" }} elevation={4}>
        <Typography variant="h5" gutterBottom>
          Create User
        </Typography>

        <Grid container spacing={3}>
          {/* Name */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </Grid>

          {/* Email */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Grid>

          {/* Password */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleSubmit}
              sx={{ height: 45 }}
            >
              Create User
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default CreateUser;
