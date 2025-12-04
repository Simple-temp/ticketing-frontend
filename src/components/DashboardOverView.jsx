import React from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";

const boxes = [
  { title: "All Ticket", link: "/dashboard/allticket" },
  { title: "BW Issue", link: "/dashboard/bwissue" },
  { title: "MAC Issue", link: "/dashboard/macissue" },
  { title: "Pending Issue", link: "/dashboard/pending" },
  { title: "Solved Issue", link: "/dashboard/solve" },
  { title: "Create Ticket", link: "/dashboard/create" },
];

const DashboardOverView = () => {
  return (
    <Box
      sx={{
        width: "100%",
        padding: "20px",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Grid
        container
        spacing={3}
        justifyContent="center"
        sx={{ maxWidth: "900px" }} // keeps layout centered nicely
      >
        {boxes.map((item, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={index}
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Card
              sx={{
                width: "250px",
                height: "200px",
                borderRadius: "12px",
                background: "#001f3f",
                color: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "0px 6px 18px rgba(0,0,0,0.2)",
                cursor: "pointer",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0px 12px 24px rgba(0,0,0,0.35)",
                },
              }}
            >
              <Link to={item.link} style={{textDecoration:"none", color:"#fff"}}>
                <CardContent sx={{ padding: 0 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", textAlign: "center" }}
                  >
                    {item.title}
                  </Typography>
                </CardContent>
              </Link>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DashboardOverView;
