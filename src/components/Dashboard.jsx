// Dashboard.jsx (ensure this exists inside the main content area)
import React from "react";
import Sidebar from "./Sidebar";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <Box
        sx={{
          width: "18%",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          height: "100vh",
          overflowY: "auto",
          backgroundColor: "#fff",
          borderRight: "1px solid #ddd",
        }}
      >
        <Sidebar />
      </Box>

      <Box
        component="main"
        sx={{
          marginLeft: "18%",
          width: "82%",
          padding: "20px",
          minHeight: "100vh",
          overflowY: "auto",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Dashboard;
