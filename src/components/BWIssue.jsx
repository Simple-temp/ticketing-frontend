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

const API_URL = "http://192.168.12.62:5000/api/ticket/all";

const BWIssue = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        const res = await axios.get(API_URL, { headers });
        const bwTickets = res.data.filter((t) => t.clientType === "BW");
        setTickets(bwTickets);
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
    if (status === "Closed") return "#2e7d32";
    if (status === "Pending") return "#ed6c02";
    return "#546e7a";
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

      <Typography
        variant="h5"
        mb={3}
        sx={{ fontWeight: 600, color: "#e3f2fd" }}
      >
        BW Client Tickets ({tickets.length})
      </Typography>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
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
                  "Issue",
                  "Engineer",
                  "Complain Date",
                  "Complain Time",
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
                    No BW client tickets found
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
                    <TableCell sx={cellStyle}>{ticket.issue}</TableCell>
                    <TableCell sx={cellStyle}>{ticket.engName}</TableCell>
                    <TableCell sx={cellStyle}>
                      {ticket.complainDate
                        ? new Date(ticket.complainDate).toLocaleDateString(
                            "en-GB",
                            { day: "2-digit", month: "short" }
                          )
                        : "-"}
                    </TableCell>
                    <TableCell sx={cellStyle}>{ticket.complainTime}</TableCell>
                    <TableCell sx={cellStyle}>
                      <Chip
                        label={
                          ticket.closed === "Yes"
                            ? "Closed"
                            : ticket.pending === "Pending"
                            ? "Pending"
                            : "Open"
                        }
                        sx={{
                          backgroundColor: getStatusColor(
                            ticket.closed === "Yes"
                              ? "Closed"
                              : ticket.pending === "Pending"
                              ? "Pending"
                              : "Open"
                          ),
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

export default BWIssue;
