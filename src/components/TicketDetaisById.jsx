import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  MenuItem,
  Button,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { ToastContainer, toast } from "react-toastify";

const API_URL = "http://localhost:5000/api/ticket";

const TicketDetailsById = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [newRemark, setNewRemark] = useState("");
  const [status, setStatus] = useState("");

  // fetch ticket by ID
  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        const res = await axios.get(`${API_URL}/${id}`, { headers });
        setTicket(res.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch ticket");
      }
    };
    fetchTicket();
  }, [id]);

  const handleAddRemark = async () => {
    if (!newRemark) return toast.error("Enter a remark");

    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    try {
      // Send only the new remark to backend
      const res = await axios.put(
        `${API_URL}/${id}/update`,
        {
          text: newRemark,
          status: status || "Open",
        },
        { headers }
      );

      setTicket(res.data); // backend returns updated ticket with populated user
      setNewRemark("");
      setStatus("");
      toast.success("Remark added successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add remark");
    }
  };

  const getStatusColor = (status) => {
    if (status === "Closed") return "#f44336"; // red
    if (status === "Pending") return "#ff9800"; // yellow
    return "#9e9e9e"; // gray
  };

  if (!ticket) return <Typography>Loading...</Typography>;

  return (
    <Box p={3}>
      <ToastContainer position="top-center" />
      <Typography variant="h5" mb={3}>
        Ticket Details — {ticket.Sn || ticket._id}
      </Typography>

      {/* Ticket Info */}
      <Paper sx={{ mb: 4, p: 2 }}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Client Type</TableCell>
              <TableCell>{ticket.clientType}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Client Name</TableCell>
              <TableCell>{ticket.clientName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Issue</TableCell>
              <TableCell>{ticket.issue}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Complain Date & Time</TableCell>
              <TableCell>
                {ticket.complainDate} {ticket.complainTime}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Engineer</TableCell>
              <TableCell>{ticket.engName}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>

      {/* Add Remark */}
      <Paper sx={{ mb: 4, p: 2 }}>
        <Typography variant="h6" mb={2}>
          Add Remark
        </Typography>
        <Box display="flex" gap={2} mb={2}>
          <TextField
            label="Remark"
            multiline
            fullWidth
            value={newRemark}
            onChange={(e) => setNewRemark(e.target.value)}
          />
          <TextField
            select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            sx={{ width: 200 }}
          >
            <MenuItem value="Open">Open</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Closed">Closed</MenuItem>
          </TextField>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddRemark}
          >
            Add
          </Button>
        </Box>
      </Paper>

      {/* Remarks Log */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" mb={2}>
          Remarks Log
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Remark</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ticket.remarks
              .slice()
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
              .map((r, idx) => (
                <TableRow
                  key={idx}
                  sx={{ backgroundColor: getStatusColor(r.status) + "33" }}
                >
                  <TableCell>{r.user?.name || "N/A"}</TableCell>
                  <TableCell>
                    {new Date(r.timestamp).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(r.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>{r.text}</TableCell>
                  <TableCell>{r.status}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default TicketDetailsById;
