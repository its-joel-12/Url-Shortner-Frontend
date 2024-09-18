import React, { useState } from "react";
import { FaCopy } from "react-icons/fa";
import { TiArrowForward } from "react-icons/ti";
import Tooltip from "@mui/material/Tooltip";
import Snackbar from "@mui/material/Snackbar";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import "./LinkResult.css";

const CustomSnackbar = styled(Snackbar)(({ theme }) => ({
  "& .MuiSnackbarContent-root": {
    backgroundColor: "#ffffff",
    color: "#000000",
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    minWidth: "auto",
    width: "auto",
    height: "40px",
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

const LinkResult = ({ shortenLink, expiryTime, longUrl, domain }) => {
  const [open, setOpen] = useState(false);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(`${shortenLink}`);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleRedirectClick = () => {
    window.open(`${shortenLink}`, "_blank");
  };

  return (
    <div className="result">
      <div className="long-url-container">
        <span className="long-url-label">Long URL: </span>
        <div className="long-url-content">
          <p className="long-url">{longUrl}</p>
        </div>
      </div>
      <div className="short-url-container">
        <span className="short-url-label">Short URL: </span>
        <div className="short-url-content">
          <p className="short-url">{`${shortenLink}`}</p>
        </div>
      </div>
      <p className="expiry-time">
        <span className="linkExp">Link Expiry: </span>
        {expiryTime}{" "}
      </p>
      <div className="ShortLinks-buttons">
        <Tooltip title="Copy Short URL" arrow>
          <button className="copy-btn" onClick={handleCopyClick}>
            <FaCopy size={20} />
          </button>
        </Tooltip>
        <Tooltip title="Redirect" arrow>
          <button className="copy-btn" onClick={handleRedirectClick}>
            <TiArrowForward size={20} />
          </button>
        </Tooltip>
      </div>

      <Box sx={{ width: "100%" }}>
        <CustomSnackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          open={open}
          autoHideDuration={500}
          onClose={handleClose}
          message="Copied"
          key="bottomcenter"
        />
      </Box>
    </div>
  );
};

export default LinkResult;
