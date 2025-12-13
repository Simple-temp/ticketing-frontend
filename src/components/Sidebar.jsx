// Sidebar.jsx
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CreateIcon from "@mui/icons-material/Create";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";
import SpeedIcon from "@mui/icons-material/Speed";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PersonIcon from "@mui/icons-material/Person";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const navItems = [
  { to: "dashboardview", text: "Dashboard View", icon: <DashboardIcon /> },
  { to: "mytickets", text: "My Tickets", icon: <PersonIcon /> },
  { to: "allticket", text: "All Tickets", icon: <ListAltIcon /> },
  { to: "create", text: "Create Ticket", icon: <CreateIcon /> },
  { to: "pending", text: "Pending", icon: <PendingActionsIcon /> },
  { to: "solve", text: "Solved", icon: <DoneAllIcon /> },
  { to: "macissue", text: "MAC Issue", icon: <LaptopMacIcon /> },
  { to: "bwissue", text: "BW Issue", icon: <SpeedIcon /> },
  { to: "userlist", text: "User List", icon: <PersonIcon /> },
  { to: "addnewuser", text: "Add New User", icon: <PersonAddIcon /> },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [collapsed, setCollapsed] = useState(isMobile);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      {/* Hamburger toggle button */}
      {isMobile && (
        <IconButton
          onClick={() => setCollapsed(!collapsed)}
          sx={{
            position: "fixed",
            top: 16,
            left: 16,
            zIndex: 999,
            bgcolor: "#001a35",
            color: "#fff",
            "&:hover": { bgcolor: "#00306b" },
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      <motion.div
        animate={{ width: collapsed ? 64 : 260 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        style={{
          overflow: "hidden",
          height: "100vh",
          borderRight: "1px solid #00204b",
          background: "#001a35",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 998,
          display: "flex",
          flexDirection: "column",
          color: "white",
        }}
      >
        {/* Sidebar top: Avatar + Name */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: collapsed ? 0 : 2,
            py: 3,
            px: collapsed ? 0 : 2,
            borderBottom: "1px solid #00204b",
            justifyContent: collapsed ? "center" : "flex-start",
          }}
        >
          <Avatar
            sx={{
              width: 48,
              height: 48,
              bgcolor: "#1976d2",
              boxShadow: "0 0 8px #1976d2",
              fontSize: "1.2rem",
            }}
          >
            {String(storedUser.name)[0].toUpperCase()}
          </Avatar>
          {!collapsed && (
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {storedUser.name}
            </Typography>
          )}
        </Box>

        {/* Navigation items */}
        <List sx={{ flexGrow: 1 }}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              {({ isActive }) => (
                <motion.div
                  whileHover={{ scale: 1.05, boxShadow: "0 0 8px #1976d2" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <ListItemButton
                    selected={isActive}
                    sx={{
                      px: collapsed ? 0 : 3,
                      my: 0.5,
                      borderRadius: 2,
                      justifyContent: collapsed ? "center" : "flex-start",
                      background: isActive ? "#00306b" : "transparent",
                      "&:hover": { background: "#00306b" },
                      color: "#fff",
                    }}
                  >
                    <ListItemIcon sx={{ color: "#fff", minWidth: 0, justifyContent: "center" }}>
                      {item.icon}
                    </ListItemIcon>
                    {!collapsed && <ListItemText primary={item.text} sx={{ ml: 2 }} />}
                  </ListItemButton>
                </motion.div>
              )}
            </NavLink>
          ))}
        </List>

        {/* Logout */}
        <Box sx={{ p: 2, borderTop: "1px solid #00204b" }}>
          <motion.div whileHover={{ scale: 1.05, boxShadow: "0 0 8px #ff5252" }}>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                px: collapsed ? 0 : 3,
                justifyContent: collapsed ? "center" : "flex-start",
                borderRadius: 2,
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, justifyContent: "center" }}>
                <LogoutIcon sx={{ color: "#ff5252" }} />
              </ListItemIcon>
              {!collapsed && <ListItemText primary="Logout" sx={{ ml: 2 }} />}
            </ListItemButton>
          </motion.div>
        </Box>
      </motion.div>
    </>
  );
};

export default Sidebar;
