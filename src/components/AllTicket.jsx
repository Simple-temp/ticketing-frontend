import { useEffect, useState } from "react";
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
  Modal,
  TextField,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const SHEET_ID = "1G1Hvuz9sdgcNMHpqNlOelXjmDLIZIMeCVGd7hald0WA";
const API_URL =
  "https://script.google.com/macros/s/AKfycbyuWIBTU0N-CP3coRa19oO5eSfoqRBt6q9dOJmoa4z-HI4R2S4hDNDSCSk3ZRE1Ywrk/exec";

// SAFE CSV PARSER
function parseCSVLine(line) {
  const regex = /(".*?"|[^",]+)(?=\s*,|\s*$)/g;
  return [...line.matchAll(regex)].map((m) =>
    m[0].replace(/^"|"$/g, "").trim()
  );
}

// Fetch Google Sheet
async function getTab(tabName) {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${tabName}`;
  const res = await fetch(url);
  const csv = await res.text();
  const rows = csv.trim().split("\n");

  return rows.slice(1).map((line) => {
    const col = parseCSVLine(line);
    return {
      sn: col[0],
      clientType: col[1],
      clientName: col[2],
      issue: col[3],
      complainDate: col[4],
      complainTime: col[5],
      solvedDate: col[6],
      solvedTime: col[7],
      sTime: col[8],
      engName: col[9],
      engNameAnother: col[10],
      remarks: col[11],
      closed: col[12],
      pending: col[13],
    };
  });
}

const AllTicket = () => {
  const [ticketList, setTicketList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 40;
  console.log(ticketList);

  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    const load = async () => {
      const data = await getTab("ticket");
      const users = await getTab("user");

      const reversedData = data.reverse();

      const userNames = users.map((u) => u.clientName || u.engName || u.sn);
      setTicketList(reversedData);
      setUserList(userNames);
    };
    load();
  }, []);

  const handleOpen = (ticket) => {
    setEditData(ticket);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const getStatusColor = (pending, closed) => {
    if (closed === "Yes") return "#4caf50";
    if (pending === "Pending") return "#ff9800";
    return "#9e9e9e";
  };

  const paginatedData = ticketList.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const totalPages = Math.ceil(ticketList.length / rowsPerPage);

  return (
    <div>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h5" gutterBottom>
          All Tickets
        </Typography>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 1400 }}>
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
                <TableCell sx={{ color: "white" }}>sTime</TableCell>
                <TableCell sx={{ color: "white" }}>Engineer</TableCell>
                <TableCell sx={{ color: "white" }}>Engineer Another</TableCell>
                <TableCell sx={{ color: "white" }}>Remarks</TableCell>
                <TableCell sx={{ color: "white" }}>Status</TableCell>
                <TableCell sx={{ color: "white" }}>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedData.map((t, index) => (
                <TableRow key={index}>
                  <TableCell>{String(t.sn).padStart(4, "0")}</TableCell>
                  <TableCell>{t.clientType}</TableCell>
                  <TableCell>{t.clientName}</TableCell>
                  <TableCell>{t.issue}</TableCell>
                  <TableCell>{t.complainDate}</TableCell>
                  <TableCell>{t.complainTime}</TableCell>
                  <TableCell>{t.solvedDate}</TableCell>
                  <TableCell>{t.solvedTime}</TableCell>
                  <TableCell>{t.sTime}</TableCell>
                  <TableCell>{t.engName}</TableCell>
                  <TableCell>{t.engNameAnother}</TableCell>
                  <TableCell>{t.remarks}</TableCell>

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
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<EditIcon />}
                      onClick={() => handleOpen(t)}
                    >
                      Update
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
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

      {/* UPDATE MODAL */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            width: 900,
            height: 600,
            bgcolor: "white",
            p: 4,
            borderRadius: 3,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            overflowY: "auto",
          }}
        >
          <Typography variant="h6" mb={2}>
            Update Ticket — SN: {editData?.sn}
          </Typography>

          {editData && (
            <Box
              sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}
            >
              <TextField
                select
                label="Engineer Another"
                value={editData.engNameAnother}
                onChange={(e) =>
                  setEditData({ ...editData, engNameAnother: e.target.value })
                }
              >
                {userList.map((name, i) => (
                  <MenuItem key={i} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </TextField>

              {/* <TextField
                select
                label="Pending / Closed"
                value={
                  editData.closed === "Yes"
                    ? "Yes"
                    : editData.pending === "Pending"
                    ? "Pending"
                    : ""
                }
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "Yes") {
                    setEditData({ ...editData, pending: "", closed: "Yes" });
                  } else {
                    setEditData({
                      ...editData,
                      pending: "Pending",
                      closed: "",
                    });
                  }
                }}
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Yes">Closed</MenuItem>
              </TextField> */}

              <TextField
                label="Remarks"
                value={editData.remarks}
                onChange={(e) =>
                  setEditData({ ...editData, remarks: e.target.value })
                }
              />
            </Box>
          )}

          <Box mt={4} display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              onClick={async () => {
                try {
                  // Current date in Bangladesh timezone
                  const now = new Date();
                  const bdDate = new Date(now.getTime() + 6 * 60 * 60 * 1000); // UTC+6

                  // Format as d-MMM (6-Dec)
                  const day = bdDate.getDate();
                  const monthNames = [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                  ];
                  const month = monthNames[bdDate.getMonth()];
                  const currentDate = `${day}-${month}`;

                  const time = now.toTimeString().slice(0, 5);

                  // Prepare update data
                  const updated = {
                    sn: editData.sn,
                    solvedDate: currentDate,
                    solvedTime: time,
                    sTime: editData.sTime || "",
                    engName: editData.engName || "",
                    engNameAnother: editData.engNameAnother || "",
                    remarks: editData.remarks || "",
                    closed: editData.closed || "",
                    pending: editData.pending || "",
                    action: "updateTicket",
                  };

                  console.log(updated);

                  // POST using axios
                  await fetch(API_URL, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: new URLSearchParams(updated).toString(),
                  });
                  toast.success("Ticket Updated Successfully!");
                  handleClose();
                } catch (error) {
                  console.error("Update failed:", error);
                  toast.error("Failed to update ticket.");
                }
              }}
            >
              Update Ticket
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default AllTicket;
