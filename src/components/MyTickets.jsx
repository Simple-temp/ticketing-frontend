// MyTickets.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  CircularProgress,
  IconButton,
  Button,
  Tooltip,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import ClearIcon from "@mui/icons-material/Clear";
import * as XLSX from "xlsx";

const API_BASE = "http://192.168.12.62:5000";

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [clientName, setClientName] = useState("");
  const [clientType, setClientType] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/api/ticket/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // SORT: Last ticket first
        const sorted = res.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setTickets(sorted);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token]);

  const clientTypeOptions = useMemo(() => {
    const set1 = new Set();
    tickets.forEach((t) => t.clientType && set1.add(t.clientType));
    return ["", ...Array.from(set1)];
  }, [tickets]);

  const filtered = useMemo(() => {
    let list = [...tickets];

    if (clientName)
      list = list.filter((t) =>
        (t.clientName || "").toLowerCase().includes(clientName.toLowerCase())
      );

    if (clientType) list = list.filter((t) => t.clientType === clientType);

    if (statusFilter === "closed")
      list = list.filter((t) => t.closed === "Yes");
    if (statusFilter === "pending")
      list = list.filter((t) => t.closed !== "Yes");

    return list;
  }, [tickets, clientName, clientType, statusFilter]);

  const exportExcel = () => {
    if (!filtered.length) {
      return alert("No data to export");
    }

    // Map filtered data to include last remark
    const excelData = filtered.map((t) => {
      const lastRemark = t.remarks?.length
        ? t.remarks.sort(
            (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
          )[0].text
        : "";

      return {
        SN: t.Sn,
        ClientName: t.clientName,
        ClientType: t.clientType,
        Issue: t.issue,
        ComplainDate: t.complainDate,
        ComplainTime: t.complainTime,
        SolvedDate: t.solvedDate,
        SolvedTime: t.solvedTime,
        sTime: t.sTime,
        EngName: t.engName,
        EngNameAnother: t.engNameAnother,
        LastRemark: lastRemark,
        Status: t.closed === "Yes" ? "Closed" : "Pending",
        Pending: t.pending,
      };
    });

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "MyTickets");
    XLSX.writeFile(wb, "MyTickets.xlsx");
  };

  const clearFilters = () => {
    setClientName("");
    setClientType("");
    setStatusFilter("");
    setPage(0);
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ background: "#071633", minHeight: "100vh", p: 4 }}>
      <Box sx={{ maxWidth: 1300, mx: "auto", color: "white" }}>
        <Box display="flex" justifyContent="space-between" mb={3}>
          <Typography variant="h5" fontWeight={700}>
            My Tickets {tickets.length}{" "}
          </Typography>

          <Box>
            <Tooltip title="Export Excel">
              <IconButton sx={{ color: "white" }} onClick={exportExcel}>
                <DownloadIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Clear Filters">
              <IconButton sx={{ color: "white" }} onClick={clearFilters}>
                <ClearIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Filters */}
        <Paper sx={{ p: 2, bgcolor: "#0e2550", mb: 3 }}>
          <Box display="flex" gap={2} flexWrap="wrap">
            <TextField
              label="Client Name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              size="small"
              sx={{ bgcolor: "white", borderRadius: 1, width: 220 }}
            />

            <TextField
              select
              label="Client Type"
              value={clientType}
              onChange={(e) => setClientType(e.target.value)}
              size="small"
              sx={{ bgcolor: "white", borderRadius: 1, width: 160 }}
            >
              {clientTypeOptions.map((v) => (
                <MenuItem key={v} value={v}>
                  {v || "All"}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              size="small"
              sx={{ bgcolor: "white", borderRadius: 1, width: 160 }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
            </TextField>

            <Button
              variant="contained"
              sx={{ ml: "auto", background: "#1976d2" }}
              onClick={() => setPage(0)}
            >
              Apply
            </Button>
          </Box>
        </Paper>

        {/* Table */}
        <Paper sx={{ overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 650 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow sx={{ bgcolor: "#082845" }}>
                  <TableCell sx={{ color: "black" }}>SN</TableCell>
                  <TableCell sx={{ color: "black" }}>Client</TableCell>
                  <TableCell sx={{ color: "black" }}>Type</TableCell>
                  <TableCell sx={{ color: "black" }}>Issue</TableCell>
                  <TableCell sx={{ color: "black" }}>Complain Date</TableCell>
                  <TableCell sx={{ color: "black" }}>Complain Time</TableCell>
                  <TableCell sx={{ color: "black" }}>Solved Time</TableCell>
                  <TableCell sx={{ color: "black" }}>Status</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                      <Typography color="gray">No tickets found</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((t) => (
                      <TableRow hover key={t._id}>
                        <TableCell>{t.Sn}</TableCell>
                        <TableCell>{t.clientName}</TableCell>
                        <TableCell>{t.clientType}</TableCell>
                        <TableCell>{t.issue}</TableCell>
                        <TableCell>{t.complainDate}</TableCell>
                        <TableCell>{t.complainTime}</TableCell>
                        <TableCell>{t.solvedTime}</TableCell>

                        <TableCell>
                          <Box
                            sx={{
                              px: 1.3,
                              py: 0.4,
                              borderRadius: 1,
                              fontWeight: 600,
                              display: "inline-block",
                              bgcolor:
                                t.closed === "Yes" ? "#d1e7dd" : "#f8d7da",
                              color: t.closed === "Yes" ? "#0f5132" : "#842029",
                            }}
                          >
                            {t.closed === "Yes" ? "Closed" : "Pending"}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            count={filtered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[10, 20, 50, 100]}
            onPageChange={(e, p) => setPage(p)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value));
              setPage(0);
            }}
          />
        </Paper>
      </Box>
    </Box>
  );
};

export default MyTickets;
