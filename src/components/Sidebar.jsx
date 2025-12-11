// Sidebar.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CreateIcon from "@mui/icons-material/Create";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";
import SpeedIcon from "@mui/icons-material/Speed";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PersonIcon from "@mui/icons-material/Person";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LogoutIcon from "@mui/icons-material/Logout";

const navItems = [
  { to: "dashboardview", text: "Dashboard View", icon: <DashboardIcon /> },
  { to: "mytickets", text: "My Tickets", icon: <PersonIcon /> },
  { to: "allticket", text: "All Tickets", icon: <ListAltIcon /> },
  { to: "create", text: "Create Ticket", icon: <CreateIcon /> },
  { to: "pending", text: "Pending", icon: <PendingActionsIcon /> },
  { to: "solve", text: "Solved", icon: <DoneAllIcon /> },
  { to: "macissue", text: "MAC Issue", icon: <LaptopMacIcon /> },
  { to: "bwissue", text: "BW Issue", icon: <SpeedIcon /> },
  // { to: "individualreport", text: "Individual Report", icon: <PersonIcon /> },
  { to: "addnewuser", text: "Add New User", icon: <PersonAddIcon /> },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <Box
      className="sidebar"
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        borderRight: "1px solid #ddd",
        backgroundColor: "#001a35", // darker blue button
        color: "white",
        fontWeight: "bold",
        "&:hover": {
          backgroundColor: "#00306b",
        },
      }}
    >
      {/* Sidebar top — Avatar centered */}
      <Box
        className="sidebar-top"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px 0",
        }}
      >
        <Avatar sx={{ width: 64, height: 64 }}>
          {String(storedUser.name)[0].toUpperCase()}
        </Avatar>
        <Typography variant="h6" sx={{ mt: 1, textAlign: "center" }}>
          {storedUser.name}
        </Typography>
      </Box>

      {/* Navigation Links */}
      <List sx={{ flexGrow: 1 }}>
        {navItems.map((it) => (
          <NavLink
            key={it.to}
            to={it.to} // relative path
            style={{ textDecoration: "none", color: "inherit" }}
          >
            {({ isActive }) => (
              <ListItemButton selected={isActive}>
                <ListItemIcon style={{ color: "#fff" }}>{it.icon}</ListItemIcon>
                <ListItemText primary={it.text} />
              </ListItemButton>
            )}
          </NavLink>
        ))}
      </List>

      {/* Logout button */}
      <Box sx={{ padding: "1rem" }}>
        <ListItemButton onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon style={{ color: "#fff" }} />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </Box>
    </Box>
  );
};

export default Sidebar;
