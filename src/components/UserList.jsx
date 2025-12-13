import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";

const API_URL = "http://localhost:5000/api/user/all";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(API_URL);
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to load users", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a1931, #102a43)",
        p: 4,
      }}
    >
      <Typography
        variant="h5"
        sx={{
          color: "#e3f2fd",
          mb: 3,
          fontWeight: 600,
        }}
      >
        User List
      </Typography>

      {loading ? (
        <CircularProgress sx={{ color: "#90caf9" }} />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Paper
            sx={{
              backgroundColor: "#0d1b2a",
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
            }}
          >
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: "#1b263b",
                  }}
                >
                  <TableCell sx={headerStyle}>#</TableCell>
                  <TableCell sx={headerStyle}>Name</TableCell>
                  <TableCell sx={headerStyle}>User ID</TableCell>
                  <TableCell sx={headerStyle}>Email</TableCell>
                  <TableCell sx={headerStyle}>Role</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {users.map((user, index) => (
                  <TableRow
                    key={user._id}
                    component={motion.tr}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#1e3a5f",
                      },
                    }}
                  >
                    <TableCell sx={cellStyle}>{index + 1}</TableCell>
                    <TableCell sx={cellStyle}>{user.name}</TableCell>
                    <TableCell sx={cellStyle}>{user.userId}</TableCell>
                    <TableCell sx={cellStyle}>{user.email}</TableCell>
                    <TableCell
                      sx={{
                        ...cellStyle,
                        color: user.role === "admin" ? "#ffb703" : "#90caf9",
                        fontWeight: 600,
                      }}
                    >
                      {user.role}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </motion.div>
      )}
    </Box>
  );
};

const headerStyle = {
  color: "#90caf9",
  fontWeight: 600,
  borderBottom: "1px solid #243b55",
};

const cellStyle = {
  color: "#e3f2fd",
  borderBottom: "1px solid #243b55",
};

export default UserList;
