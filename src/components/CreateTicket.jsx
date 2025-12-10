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

const API_URL = "http://192.168.12.62:5000/api/ticket/create";

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
    engNameAnother: "",
    remarks: "",
    closed: "",
    pending: "Pending",
  });

  // -------------------------------
  //  100% EXACT BANGLADESH TIME
  // -------------------------------
  const getBangladeshDateTime = () => {
    const bdString = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Dhaka",
    });

    const bdDate = new Date(bdString);

    // date example: "9 Dec"
    const day = bdDate.getDate();
    const months = [
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
    const month = months[bdDate.getMonth()];
    const dateFormatted = `${day} ${month}`;

    // time example: "5:27 PM"
    let hour = bdDate.getHours();
    const minute = String(bdDate.getMinutes()).padStart(2, "0");
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;

    const timeFormatted = `${hour}:${minute} ${ampm}`;

    return { dateFormatted, timeFormatted, bdDateObj: bdDate };
  };

  // -------------------------------
  //  HANDLE SUBMIT
  // -------------------------------
  const handleSubmit = async () => {
    if (!formData.clientType || !formData.clientName || !formData.issue) {
      toast.error("Please fill all required fields!");
      return;
    }

    const { dateFormatted, timeFormatted, bdDateObj } = getBangladeshDateTime();

    const sendData = {
      ...formData,
      complainDate: dateFormatted,
      complainTime: timeFormatted,
      solvedDate: "",
      solvedTime: "",
      sTime: "00:00",
      engName: currentEng,

      remarks: formData.remarks
        ? [
            {
              text: formData.remarks,
              user: storedUser?._id || null,
              timestamp: bdDateObj.toISOString(),
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
            onChange={(e, val) =>
              setFormData({ ...formData, clientName: val || "" })
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
