import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  TextField,
  Typography,
  Chip,
} from "@mui/material";

const API_URL = "http://localhost:5000/api/ticket/all"; // Replace with your backend URL

const IndividualReport = () => {
  const [ticketList, setTicketList] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    clientName: "",
    engName: "",
    clientType: "",
  });

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        const res = await axios.get(API_URL, { headers });
        setTicketList(res.data.reverse()); // latest first
        setFilteredTickets(res.data.reverse());
      } catch (err) {
        console.error(err);
      }
    };
    fetchTickets();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...ticketList];

    if (filters.startDate) {
      filtered = filtered.filter(
        (t) => new Date(t.complainDate) >= new Date(filters.startDate)
      );
    }
    if (filters.endDate) {
      filtered = filtered.filter(
        (t) => new Date(t.complainDate) <= new Date(filters.endDate)
      );
    }
    if (filters.clientName) {
      const val = filters.clientName.toLowerCase();
      filtered = filtered.filter((t) =>
        t.clientName?.toLowerCase().includes(val)
      );
    }
    if (filters.engName) {
      const val = filters.engName.toLowerCase();
      filtered = filtered.filter((t) => t.engName?.toLowerCase().includes(val));
    }
    if (filters.clientType) {
      const val = filters.clientType.toLowerCase();
      filtered = filtered.filter((t) =>
        t.clientType?.toLowerCase().includes(val)
      );
    }

    setFilteredTickets(filtered);
  }, [filters, ticketList]);
  console.log(filteredTickets)

  // Summary counts
  const summary = filteredTickets.reduce(
    (acc, t) => {
      const type = t.clientType?.toLowerCase();
      if (type?.includes("bw")) acc.BW++;
      else if (type?.includes("mac")) acc.MAC++;
      else acc.Others++;
      return acc;
    },
    { BW: 0, MAC: 0, Others: 0 }
  );

  // Status color
  const getStatusColor = (status) => {
    if (status?.toLowerCase() === "closed") return "#4caf50"; // green
    if (status?.toLowerCase() === "pending") return "#ff9800"; // orange
    return "#9e9e9e"; // gray
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={3}>
        Individual Ticket Report
      </Typography>

      {/* Filters */}
      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <TextField
          label="Start Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={filters.startDate}
          onChange={(e) =>
            setFilters({ ...filters, startDate: e.target.value })
          }
        />
        <TextField
          label="End Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={filters.endDate}
          onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
        />
        <TextField
          label="Client Name"
          value={filters.clientName}
          onChange={(e) =>
            setFilters({ ...filters, clientName: e.target.value })
          }
        />
        <TextField
          label="Engineer Name"
          value={filters.engName}
          onChange={(e) => setFilters({ ...filters, engName: e.target.value })}
        />
        <TextField
          label="Client Type"
          placeholder="BW / MAC / Others"
          value={filters.clientType}
          onChange={(e) =>
            setFilters({ ...filters, clientType: e.target.value })
          }
        />
      </Box>

      {/* Summary */}
      <Paper sx={{ mb: 3, p: 2 }}>
        <Typography variant="h6">Summary</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>BW Count</TableCell>
              <TableCell>MAC Count</TableCell>
              <TableCell>Others Count</TableCell>
              <TableCell>Total Tickets</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{summary.BW}</TableCell>
              <TableCell>{summary.MAC}</TableCell>
              <TableCell>{summary.Others}</TableCell>
              <TableCell>{filteredTickets.length}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>

      {/* Ticket Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#001f3f" }}>
              {[
                "SN",
                "Client Type",
                "Client Name",
                "Issue",
                "Complain Date",
                "Complain Time",
                "Solved Date",
                "Solved Time",
                "sTime",
                "Engineer",
                "Engineer Another",
                "Remarks",
                "Closed",
                "Pending",
              ].map((header, idx) => (
                <TableCell
                  key={idx}
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {[...filteredTickets].reverse().map((t, index) => (
              <TableRow
                key={index}
                sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}
              >
                <TableCell align="center">{t.Sn}</TableCell>
                <TableCell align="center">{t.clientType}</TableCell>
                <TableCell align="center">{t.clientName}</TableCell>
                <TableCell align="center">{t.issue}</TableCell>
                <TableCell align="center">{t.complainDate}</TableCell>
                <TableCell align="center">{t.complainTime}</TableCell>
                <TableCell align="center">{t.solvedDate}</TableCell>
                <TableCell align="center">{t.solvedTime}</TableCell>
                <TableCell align="center">{t.sTime}</TableCell>
                <TableCell align="center">{t.engName}</TableCell>
                <TableCell align="center">{t.engNameAnother}</TableCell>
                <TableCell align="center">
                  {t.remarks && t.remarks.length > 0
                    ? (() => {
                        const lastRemark = t.remarks
                          .slice()
                          .sort(
                            (a, b) =>
                              new Date(b.timestamp) - new Date(a.timestamp)
                          )[0];
                        return (
                          <Box>
                            {/* <strong>{lastRemark.user?.name || "N/A"}:</strong>{" "} */}
                            {lastRemark.text}{" "}
                            {/* <em>
                              ({new Date(lastRemark.timestamp).toLocaleString()}
                              )
                            </em> */}
                          </Box>
                        );
                      })()
                    : "No Remarks"}
                </TableCell>
                <TableCell align="center">{t.closed}</TableCell>
                <TableCell align="center">{t.pending}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default IndividualReport;
