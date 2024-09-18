import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import "./Navbar.css";

const Navbar = () => {
  const handleResetPage = () => {
    window.location.reload();
  };

  return (
    <Box sx={{ flexGrow: 1 }} data-testid="navbar">
      <AppBar position="static" className="Nav-Container">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handleResetPage}
          >
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, fontWeight: 600, fontStyle: "bold" }}
            >
              YOURL
            </Typography>
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
