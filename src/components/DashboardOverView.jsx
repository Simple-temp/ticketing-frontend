import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = "http://192.168.12.62:5000/api/ticket/all";

const DashboardOverView = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch ticket data
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await axios.get(API_URL);

        // Safe structure handling
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.tickets || [];

        setTickets(data);
      } catch (err) {
        console.error("Failed to fetch tickets", err);
      }
      setLoading(false);
    };

    fetchTickets();
  }, []);

  // Counts
  const allCount = tickets.length;
  const bwCount = tickets.filter((t) => t.clientType === "BW").length;
  const macCount = tickets.filter((t) => t.clientType === "MAC").length;
  const solvedCount = tickets.filter((t) => t.closed === "Yes").length;
  const pendingCount = tickets.filter((t) => t.pending === "Pending").length;
  console.log(solvedCount);

  // Boxes
  const boxes = [
    { title: "All Ticket", link: "/dashboard/allticket", count: allCount },
    { title: "BW Issue", link: "/dashboard/bwissue", count: bwCount },
    { title: "MAC Issue", link: "/dashboard/macissue", count: macCount },
    { title: "Pending Issue", link: "/dashboard/pending", count: pendingCount },
    { title: "Solved Issue", link: "/dashboard/solve", count: solvedCount },
    { title: "Create Ticket", link: "/dashboard/create", count: "" },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        padding: "30px",
        background: "linear-gradient(135deg, #021526, #03346E)",
        display: "flex",
        justifyContent: "center",
      }}
    >
      {loading ? (
        <CircularProgress sx={{ color: "white" }} />
      ) : (
        <Grid
          container
          spacing={3}
          justifyContent="center"
          sx={{ maxWidth: "800px" }} // --- 👌 Controls 2-column layout width
        >
          {boxes.map((item, index) => (
            <Grid
              item
              xs={12}
              md={6} // --- 👌 Always 2 columns
              key={index}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Link
                to={item.link}
                style={{ textDecoration: "none", width: "100%" }}
              >
                <Card
                  sx={{
                    width: "100%",
                    height: "180px",
                    borderRadius: "16px",
                    background: "rgba(255,255,255,0.1)",
                    color: "white",
                    backdropFilter: "blur(7px)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow: "0px 10px 25px rgba(0,0,0,0.4)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    cursor: "pointer",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0px 14px 35px rgba(0,0,0,0.6)",
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: "center" }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {item.title}
                    </Typography>

                    {item.count !== "" && (
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: "700",
                          mt: 1,
                          color: "#00E5FF",
                          fontSize: "2.3rem",
                        }}
                      >
                        {item.count}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default DashboardOverView;
