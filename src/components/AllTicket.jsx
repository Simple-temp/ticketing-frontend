import { useEffect, useState } from "react";
import axios from "axios";
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Button,
  Box,
  Pagination,
  TextField,
  MenuItem,
} from "@mui/material";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import * as XLSX from "xlsx";

const API_URL = "http://192.168.12.62:5000/api/ticket/all";

const AllTicket = () => {
  const [ticketList, setTicketList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const loggedInUser = storedUser?.name;

  const [page, setPage] = useState(1);
  const rowsPerPage = 6;

  const [searchEng, setSearchEng] = useState("");
  const [searchClientType, setSearchClientType] = useState("");
  const [searchPending, setSearchPending] = useState("");

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Not logged in");
          return;
        }
        const headers = { Authorization: `Bearer ${token}` };
        const res = await axios.get(API_URL, { headers });

        const reversed = res.data.reverse();
        setTicketList(reversed);
        setFilteredList(reversed);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch tickets");
      }
    };
    loadTickets();
  }, []);

  // -----------------------------
  // FILTERING
  // -----------------------------
  useEffect(() => {
    let data = [...ticketList];

    if (searchEng.trim() !== "") {
      data = data.filter((t) =>
        t.clientName?.toLowerCase().includes(searchEng.toLowerCase())
      );
    }

    if (searchClientType.trim() !== "") {
      data = data.filter((t) =>
        t.clientType?.toLowerCase().includes(searchClientType.toLowerCase())
      );
    }

    if (searchPending.trim() !== "") {
      data = data.filter((t) =>
        t.pending?.toLowerCase().includes(searchPending.toLowerCase())
      );
    }

    setFilteredList(data);
    setPage(1);
  }, [searchEng, searchClientType, ticketList, searchPending]);

  // -----------------------------
  // EXPORT EXCEL FUNCTION
  // -----------------------------
  const exportToExcel = () => {
    if (filteredList.length === 0) {
      toast.error("No data to export");
      return;
    }

    const excelData = filteredList.map((t) => {
      const lastRemark = t.remarks?.length
        ? t.remarks.sort(
            (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
          )[0].text
        : "";

      return {
        Sn: t.Sn,
        clientType: t.clientType,
        clientName: t.clientName,
        issue: t.issue,
        complainDate: t.complainDate,
        complainTime: t.complainTime,
        solvedDate: t.solvedDate,
        solvedTime: t.solvedTime,
        sTime: t.sTime,
        engName: t.engName,
        engNameAnother: t.engNameAnother,
        lastRemark: lastRemark,
        closed: t.closed,
        pending: t.pending,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tickets");

    XLSX.writeFile(workbook, "tickets_export.xlsx");
    toast.success("Excel file exported!");
  };

  // Filter tickets for logged in engineer
  useEffect(() => {
    if (!loggedInUser) return;

    const userTickets = ticketList.filter((t) => t.engName === loggedInUser);

    setFilteredList(userTickets);
  }, [ticketList, loggedInUser]);

  // EXPORT FUNCTION
  const exportToExcelMy = () => {
    if (filteredList.length === 0) {
      toast.error("No data to export");
      return;
    }

    const excelData = filteredList.map((t) => {
      const lastRemark = t.remarks?.length
        ? t.remarks.sort(
            (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
          )[0].text
        : "";

      return {
        Sn: t.Sn,
        clientType: t.clientType,
        clientName: t.clientName,
        issue: t.issue,
        complainDate: t.complainDate,
        complainTime: t.complainTime,
        solvedDate: t.solvedDate,
        solvedTime: t.solvedTime,
        sTime: t.sTime,
        engName: t.engName,
        engNameAnother: t.engNameAnother,
        lastRemark: lastRemark,
        closed: t.closed,
        pending: t.pending,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "My Tickets");

    XLSX.writeFile(workbook, "my_tickets.xlsx");
    toast.success("Excel exported successfully!");
  };

  // Pagination
  const paginatedData = filteredList.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );
  const totalPages = Math.ceil(filteredList.length / rowsPerPage);

  // Status color
  const getStatusColor = (pending, closed) => {
    if (closed === "Yes") return "#4caf50";
    if (pending === "Pending") return "#ff9800";
    return "#9e9e9e";
  };

  // Delete
  const HandleDelete = async (id) => {
    if (!id) return;

    if (!window.confirm("Are you sure you want to delete this ticket?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://192.168.12.62:5000/api/ticket/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Ticket deleted");
      setTimeout(() => window.location.reload(), 700);
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    }
  };

  return (
    <div>
      <ToastContainer position="top-center" />

      <Paper elevation={3} sx={{ padding: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">
            All Tickets ({filteredList.length})
          </Typography>

          <Button variant="contained" color="success" onClick={exportToExcel}>
            Export Excel
          </Button>
          <Button variant="contained" color="success" onClick={exportToExcelMy}>
            Export Excel Only Me
          </Button>
        </Box>

        {/* SEARCH ROW */}
        <Box display="flex" gap={2} mt={2} mb={2}>
          <TextField
            label="Search Client Name"
            value={searchEng}
            onChange={(e) => setSearchEng(e.target.value)}
            size="small"
            sx={{ width: 250 }}
          />

          <TextField
            label="Search Client Type"
            value={searchClientType}
            onChange={(e) => setSearchClientType(e.target.value)}
            size="small"
            sx={{ width: 250 }}
          />

          <TextField
            label="Pending"
            value={searchPending}
            onChange={(e) => setSearchPending(e.target.value)}
            size="small"
            sx={{ width: 250 }}
          />
        </Box>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 1200 }}>
            <TableHead sx={{ background: "#001f3f" }}>
              <TableRow>
                <TableCell sx={{ color: "white" }}>SN</TableCell>
                <TableCell sx={{ color: "white" }}>Client Type</TableCell>
                <TableCell sx={{ color: "white" }}>Client Name</TableCell>
                <TableCell sx={{ color: "white" }}>Issue</TableCell>
                <TableCell sx={{ color: "white" }}>Complain Date</TableCell>
                <TableCell sx={{ color: "white" }}>Complain Time</TableCell>
                <TableCell sx={{ color: "white" }}>Solved Date</TableCell>
                <TableCell sx={{ color: "white" }}>Engineer</TableCell>
                <TableCell sx={{ color: "white" }}>Latest Remark</TableCell>
                <TableCell sx={{ color: "white" }}>Status</TableCell>
                <TableCell sx={{ color: "white" }}>Details</TableCell>
                <TableCell sx={{ color: "white" }}>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedData.map((t, index) => {
                const lastRemark = t.remarks?.length
                  ? t.remarks.sort(
                      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
                    )[0].text
                  : "No Remarks";

                return (
                  <TableRow key={t._id}>
                    <TableCell>{String(index + 1).padStart(4, "0")}</TableCell>
                    <TableCell>{t.clientType}</TableCell>
                    <TableCell>{t.clientName}</TableCell>
                    <TableCell>{t.issue}</TableCell>
                    <TableCell>{t.complainDate}</TableCell>
                    <TableCell>{t.complainTime}</TableCell>
                    <TableCell>{t.solvedDate}</TableCell>
                    <TableCell>{t.engName}</TableCell>
                    <TableCell>{lastRemark}</TableCell>

                    <TableCell>
                      <Box
                        sx={{
                          background: getStatusColor(t.pending, t.closed),
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "6px",
                          textAlign: "center",
                        }}
                      >
                        {t.closed === "Yes"
                          ? "Closed"
                          : t.pending === "Pending"
                          ? "Pending"
                          : "Open"}
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Link to={`/dashboard/ticketdetailsbyid/${t._id}`}>
                        <Button size="small" variant="contained">
                          Details
                        </Button>
                      </Link>
                    </TableCell>

                    <TableCell>
                      <DeleteIcon
                        onClick={() => HandleDelete(t._id)}
                        sx={{
                          cursor: "pointer",
                          color: "error.main",
                          fontSize: 28,
                          "&:hover": {
                            color: "error.dark",
                            transform: "scale(1.15)",
                          },
                        }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, val) => setPage(val)}
            color="primary"
            size="large"
          />
        </Box>
      </Paper>
    </div>
  );
};

export default AllTicket;
