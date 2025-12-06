import React, { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Box,
  TextField,
  Typography,
} from "@mui/material";

const SHEET_ID = "1G1Hvuz9sdgcNMHpqNlOelXjmDLIZIMeCVGd7hald0WA";

// CSV Parser
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

// Convert d-MMM to yyyy-mm-dd
const convertDate = (str) => {
  if (!str) return "";
  const [day, month] = str.split("-");
  const monthMap = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };
  return `2025-${monthMap[month]}-${day}`; // Placeholder year
};

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

  // useEffect(() => {
  //   const load = async () => {
  //     const data = await getTab("ticket");

  //     // Sort by complainDate descending (latest first)
  //     const sortedData = data.sort((a, b) => {
  //       const dateA = new Date(convertDate(a.complainDate));
  //       const dateB = new Date(convertDate(b.complainDate));
  //       return dateB - dateA; // Latest first
  //     });

  //     setTicketList(sortedData);
  //     setFilteredTickets(sortedData);
  //   };
  //   load();
  // }, []);

  useEffect(() => {
    const load = async () => {
      const data = await getTab("ticket");

      // Reverse data so last entries come first
      const reversedData = data.reverse();

      setTicketList(reversedData);
      setFilteredTickets(reversedData);
    };
    load();
  }, []);

  useEffect(() => {
    let filtered = [...ticketList];

    // Date range filter
    if (filters.startDate) {
      filtered = filtered.filter(
        (t) =>
          new Date(convertDate(t.complainDate)) >= new Date(filters.startDate)
      );
    }
    if (filters.endDate) {
      filtered = filtered.filter(
        (t) =>
          new Date(convertDate(t.complainDate)) <= new Date(filters.endDate)
      );
    }

    // Client name filter
    if (filters.clientName) {
      const val = filters.clientName.trim().toLowerCase();
      filtered = filtered.filter(
        (t) => t.clientName && t.clientName.trim().toLowerCase().includes(val)
      );
    }

    // Engineer name filter
    if (filters.engName) {
      const val = filters.engName.trim().toLowerCase();
      filtered = filtered.filter(
        (t) => t.engName && t.engName.trim().toLowerCase().includes(val)
      );
    }

    // Client Type filter (BW / MAC / Others)
    if (filters.clientType) {
      const val = filters.clientType.trim().toLowerCase();
      filtered = filtered.filter(
        (t) => t.clientType && t.clientType.trim().toLowerCase().includes(val)
      );
    }

    setFilteredTickets(filtered);
  }, [filters, ticketList]);

  // Summary counts
  const summary = filteredTickets.reduce(
    (acc, t) => {
      const clientType = t.clientType ? t.clientType.trim().toLowerCase() : "";
      if (clientType.includes("bw")) acc.BW++;
      else if (clientType.includes("mac")) acc.MAC++;
      else acc.Others++;
      return acc;
    },
    { BW: 0, MAC: 0, Others: 0 }
  );

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        Ticket Report
      </Typography>

      {/* Filters */}
      <Box display="flex" gap={2} mb={2} flexWrap="wrap">
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

      {/* Summary Table */}
      <Paper sx={{ mb: 2, p: 2 }}>
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
              <TableCell sx={{ color: "white" }}>Closed</TableCell>
              <TableCell sx={{ color: "white" }}>Pending</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTickets.map((t, index) => (
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
                <TableCell>{t.closed}</TableCell>
                <TableCell>{t.pending}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default IndividualReport;
