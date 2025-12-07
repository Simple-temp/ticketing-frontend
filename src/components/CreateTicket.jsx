import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Autocomplete,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";

const API_URL = "http://localhost:5000/api/ticket/create";

const CreateTicket = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const currentEng = storedUser?.name || "Engineer";

  const [issueList, setIssueList] = useState([
    "No Internet",
    "ONU Offline",
    "Fiber Cut",
  ]);
  const [clientList, setClientList] = useState(["Client A", "Client B", "Client C"]);

  const [formData, setFormData] = useState({
    clientType: "",
    clientName: "",
    issue: "",
    engName: currentEng,
    engNameAnother: "",
    remarks: "", // temporary input before sending
    closed: "",
    pending: "Pending",
  });

  const handleSubmit = async () => {
    if (!formData.clientType || !formData.clientName || !formData.issue) {
      toast.error("Please fill all required fields!");
      return;
    }

    const now = new Date();
    const bdDate = new Date(now.getTime() + 6 * 60 * 60 * 1000);
    const day = bdDate.getDate();
    const monthNames = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec"
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
      sTime: "00:00",
      engName: currentEng,
      // push first remark into array
      remarks: formData.remarks
        ? [
            {
              text: formData.remarks,
              user: storedUser._id,
              timestamp: new Date(),
            },
          ]
        : [],
    };

    try {
      const res = await axios.post(API_URL, sendData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      toast.success(`Ticket Created! SN: ${res.data.Sn}`);
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      console.log(err);
      toast.error("Failed to create ticket!");
    }
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
            onChange={(e, val) =>
              setFormData({ ...formData, clientType: val || "" })
            }
            renderInput={(params) => (
              <TextField {...params} label="Client Type *" sx={{ width: "550px" }} />
            )}
          />
        </Grid>

        {/* Client Name */}
        <Grid item xs={12} md={6}>
          <Autocomplete
            options={clientList}
            value={formData.clientName}
            onChange={(e, val) =>
              setFormData({ ...formData, clientName: val || "" })
            }
            renderInput={(params) => (
              <TextField {...params} label="Client Name *" sx={{ width: "550px" }} />
            )}
          />
        </Grid>

        {/* Issue */}
        <Grid item xs={12} md={6}>
          <Autocomplete
            options={issueList}
            value={formData.issue}
            onChange={(e, val) =>
              setFormData({ ...formData, issue: val || "" })
            }
            renderInput={(params) => (
              <TextField {...params} label="Issue *" sx={{ width: "550px" }} />
            )}
          />
        </Grid>

        {/* Initial Remark */}
        <Grid item xs={12} md={6}>
          <TextField
            label="Initial Remark"
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
