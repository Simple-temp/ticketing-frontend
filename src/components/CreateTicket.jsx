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
import "react-toastify/dist/ReactToastify.css";
import { issueListAll, clientListAll } from "./Database";

const API_URL = "http://localhost:5000/api/ticket/create";

const CreateTicket = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const currentEng = storedUser?.name || "Engineer";

  const [issueList] = useState(issueListAll);
  const [clientList] = useState(clientListAll);

  const [formData, setFormData] = useState({
    clientType: "",
    clientName: "",
    issue: "",
    engName: currentEng,

    // ✅ THIS IS IMPORTANT
    engNameAnother: [
      {
        name: currentEng,
      },
    ],

    remarks: "",
    closed: "",
    pending: "Pending",
  });

  // -------------------------------
  //  BANGLADESH TIME
  // -------------------------------
  const getBangladeshTime = () => {
    return new Date().toLocaleTimeString("en-US", {
      timeZone: "Asia/Dhaka",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // -------------------------------
  //  HANDLE SUBMIT
  // -------------------------------
  const handleSubmit = async () => {
    if (!formData.clientType || !formData.clientName || !formData.issue) {
      toast.error("Please fill all required fields!");
      return;
    }

    const sendData = {
      ...formData,

      complainTime: getBangladeshTime(),
      solvedDate: null,
      solvedTime: "",
      sTime: "00:00",

      remarks: formData.remarks
        ? [
            {
              text: formData.remarks,
              user: storedUser?._id || null,
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
      setTimeout(() => window.location.reload(), 1200);
    } catch (err) {
      console.error(err);
      toast.error("Ticket creation failed!");
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

        {/* Remark */}
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
