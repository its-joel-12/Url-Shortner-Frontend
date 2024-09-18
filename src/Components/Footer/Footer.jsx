import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import "./Footer.css";

const Footer = () => {
  return (
    <Box sx={{ flexGrow: 1 }} data-testid="footer">
      <AppBar position="static" className="Footer-Container">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            className="footer-text"
            sx={{ flexGrow: 1 }}
          >
            © 2024 URL Shortener. Simplify your links with us.
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Footer;
