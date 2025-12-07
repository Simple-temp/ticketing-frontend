import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Typography,
  Grid,
  Autocomplete,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";

const SHEET_ID = "1G1Hvuz9sdgcNMHpqNlOelXjmDLIZIMeCVGd7hald0WA";

const API_URL =
  "https://script.google.com/macros/s/AKfycbwwt-NUSe6M6bKvP-2rHwVkTAYo--pq3ScS9Tkq0OEM1LGQZsJi_mLEwAQzyyMp5xN9/exec";

async function getTab(tabName) {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${tabName}`;
  const res = await fetch(url);
  const csv = await res.text();
  const lines = csv.trim().split("\n");
  return lines.slice(1).map((line) => line.replace(/"/g, "").trim());
}

const CreateTicket = () => {
  const [issueList, setIssueList] = useState([]);
  const [clientList, setClientList] = useState([]);

  // get username from local storage
  const storedUser = localStorage.getItem("user");
  const user = (storedUser && storedUser) || "User";

  const [formData, setFormData] = useState({
    clientType: "",
    clientName: "",
    issue: "",
    engName: user,
    remarks: "",
    closed: "",
    pending: "Pending",
  });

  useEffect(() => {
    const load = async () => {
      setIssueList(await getTab("issue"));
      setClientList(await getTab("client"));
    };
    load();
  }, []);

  const handleSubmit = async () => {
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
    const currentTime = now.toTimeString().slice(0, 5);

    const sendData = {
      ...formData,
      complainDate: currentDate,
      complainTime: currentTime,
      solvedDate: "",
      solvedTime: "",
      sTime :"00:00",
      engName: user,
    };

    try {
      const res = await axios.post(API_URL, sendData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      console.log(res.data);

      if (res.data) {
        toast.success(`Ticket Created Successfully! SN: ${String(res.data.sn).padStart(4, "0")}`);
        window.location.reload();
      } else {
        toast.error("Error: " + res.data.message);
      }
    } catch (err) {
      console.error("POST Error:", err);
      toast.error("POST request failed. Check Web App URL.");
    }
    console.log(sendData);
  };

  return (
    <Box sx={{ p: 4 }}>
      <ToastContainer position="top-center" />
      <Typography variant="h5" gutterBottom>
        Create Ticket
      </Typography>

      <Grid container spacing={3}>
        {/* Client Type */}
        <Grid item xs={12} md={6}>
          <Autocomplete
            options={["BW", "MAC", "Others"]}
            value={formData.clientType}
            onChange={(e, newVal) =>
              setFormData({ ...formData, clientType: newVal || "" })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Client Type *"
                sx={{ width: "550px" }}
              />
            )}
          />
        </Grid>

        {/* Client Name */}
        <Grid item xs={12} md={6}>
          <Autocomplete
            options={clientList}
            value={formData.clientName}
            onChange={(e, newVal) =>
              setFormData({ ...formData, clientName: newVal || "" })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Client Name *"
                sx={{ width: "550px" }}
              />
            )}
          />
        </Grid>

        {/* Issue */}
        <Grid item xs={12} md={6}>
          <Autocomplete
            options={issueList}
            value={formData.issue}
            onChange={(e, newVal) =>
              setFormData({ ...formData, issue: newVal || "" })
            }
            renderInput={(params) => (
              <TextField {...params} label="Issue *" sx={{ width: "550px" }} />
            )}
          />
        </Grid>

        {/* Remarks */}
        <Grid item xs={12} md={6}>
          <TextField
            label="Remarks"
            name="remarks"
            value={formData.remarks}
            onChange={(e) =>
              setFormData({ ...formData, remarks: e.target.value })
            }
            sx={{ width: "550px" }}
          />
        </Grid>

        {/* Submit */}
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            sx={{ width: "200px" }}
            onClick={handleSubmit}
          >
            Submit Ticket
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateTicket;
