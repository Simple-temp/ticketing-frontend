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
  Chip,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import { motion } from "framer-motion";

const API_URL = "http://localhost:5000/api/ticket/all";

const Pending = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        const res = await axios.get(API_URL, { headers });
        const pendingTickets = res.data.filter(
          (t) => t.pending === "Pending" && t.closed !== "Yes"
        );
        setTickets(pendingTickets);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch tickets");
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "#FFB300"; // amber
      case "Closed":
        return "#4CAF50"; // green
      default:
        return "#9E9E9E"; // gray
    }
  };

  if (loading) {
    return (
      <Box p={4} textAlign="center">
        <CircularProgress sx={{ color: "#90caf9" }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a1931, #102a43)",
        p: 4,
      }}
    >
      <ToastContainer position="top-center" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography
          variant="h5"
          mb={3}
          sx={{ fontWeight: 600, color: "#e3f2fd" }}
        >
          Pending Tickets ({tickets.length})
        </Typography>

        <Paper
          sx={{
            p: 2,
            borderRadius: 3,
            backgroundColor: "#0d1b2a",
            boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
          }}
        >
          <Table sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#1b263b" }}>
                {[
                  "Ticket ID",
                  "Client Name",
                  "Client Type",
                  "Issue",
                  "Engineer",
                  "Complain Date",
                  "Status",
                ].map((head) => (
                  <TableCell key={head} sx={headerStyle}>
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {tickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={cellStyle}>
                    No pending tickets found
                  </TableCell>
                </TableRow>
              ) : (
                tickets.map((ticket, idx) => (
                  <TableRow
                    key={ticket._id}
                    component={motion.tr}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#1e3a5f",
                      },
                    }}
                  >
                    <TableCell sx={cellStyle}>
                      {ticket.Sn || ticket._id}
                    </TableCell>
                    <TableCell sx={cellStyle}>{ticket.clientName}</TableCell>
                    <TableCell sx={cellStyle}>{ticket.clientType}</TableCell>
                    <TableCell sx={cellStyle}>{ticket.issue}</TableCell>
                    <TableCell sx={cellStyle}>{ticket.engName}</TableCell>
                    <TableCell sx={cellStyle}>{ticket.complainDate}</TableCell>
                    <TableCell sx={cellStyle}>
                      <Chip
                        label={ticket.pending}
                        sx={{
                          backgroundColor: getStatusColor(ticket.pending),
                          color: "white",
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Paper>
      </motion.div>
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

export default Pending;
