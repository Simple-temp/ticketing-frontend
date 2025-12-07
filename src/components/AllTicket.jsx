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
} from "@mui/material";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const API_URL = "http://localhost:5000/api/ticket/all"; // ticket backend

const AllTicket = () => {
  const [ticketList, setTicketList] = useState([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 40;

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
        setTicketList(res.data.reverse());
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch tickets");
      }
    };
    loadTickets();
  }, []);

  const getStatusColor = (pending, closed) => {
    if (closed === "Yes") return "#4caf50"; // green
    if (pending === "Pending") return "#ff9800"; // yellow
    return "#9e9e9e"; // gray/open
  };

  const paginatedData = ticketList.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );
  const totalPages = Math.ceil(ticketList.length / rowsPerPage);

  return (
    <div>
      <ToastContainer position="top-center" />
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h5" gutterBottom>
          All Tickets
        </Typography>

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
                <TableCell sx={{ color: "white" }}>Solved Time</TableCell>
                <TableCell sx={{ color: "white" }}>Engineer</TableCell>
                <TableCell sx={{ color: "white" }}>Engineer Another</TableCell>
                <TableCell sx={{ color: "white" }}>Latest Remark</TableCell>
                <TableCell sx={{ color: "white" }}>Status</TableCell>
                <TableCell sx={{ color: "white" }}>Details</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedData.map((t, index) => {
                // get latest remark if exists
                const latestRemark =
                  t.remarks && t.remarks.length > 0
                    ? t.remarks[t.remarks.length - 1].text
                    : "";

                return (
                  <TableRow key={t._id}>
                    <TableCell>{String(index + 1).padStart(4, "0")}</TableCell>
                    <TableCell>{t.clientType}</TableCell>
                    <TableCell>{t.clientName}</TableCell>
                    <TableCell>{t.issue}</TableCell>
                    <TableCell>{t.complainDate}</TableCell>
                    <TableCell>{t.complainTime}</TableCell>
                    <TableCell>{t.solvedDate}</TableCell>
                    <TableCell>{t.solvedTime}</TableCell>
                    <TableCell>{t.engName}</TableCell>
                    <TableCell>{t.engNameAnother}</TableCell>
                    <TableCell>{latestRemark}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          background: getStatusColor(t.pending, t.closed),
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "6px",
                          textAlign: "center",
                          fontSize: "12px",
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
