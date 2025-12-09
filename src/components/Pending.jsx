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
        setLoading(false);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch tickets");
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
      <Box p={3} textAlign="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <ToastContainer position="top-center" />
      <Typography variant="h5" mb={3} sx={{ fontWeight: 600 }}>
        Pending Tickets {tickets.length}
      </Typography>

      <Paper sx={{ p: 2, boxShadow: 3, borderRadius: 2 }}>
        <Table sx={{ minWidth: 900 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#1976d2" }}>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>Ticket ID</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>Client Name</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>Client Type</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>Issue</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>Engineer</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>Complain Date</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {tickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No pending tickets found
                </TableCell>
              </TableRow>
            ) : (
              tickets.map((ticket, idx) => (
                <TableRow
                  key={ticket._id}
                  sx={{
                    backgroundColor: idx % 2 === 0 ? "#f9f9f9" : "white",
                    "&:hover": { backgroundColor: "#e3f2fd" },
                  }}
                >
                  <TableCell>{ticket.Sn || ticket._id}</TableCell>
                  <TableCell>{ticket.clientName}</TableCell>
                  <TableCell>{ticket.clientType}</TableCell>
                  <TableCell>{ticket.issue}</TableCell>
                  <TableCell>{ticket.engName}</TableCell>
                  <TableCell>{ticket.complainDate}</TableCell>
                  <TableCell>
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
    </Box>
  );
};

export default Pending;
