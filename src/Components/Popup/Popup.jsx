import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import "./Popup.css";
import error400 from "../Assets/error-.png";
import error401 from "../Assets/401-Error-.png";
// import timeoutError from "../Assets/server-timeout-.png";
import timeoutError from "../Assets/server-off-.png";
import serverOffError from "../Assets/server-off-.png";

const Popup = ({
  openPopup,
  setOpenPopup,
  resetForm,
  errorCode,
  errorMessage,
}) => {
  const handleAgree = () => {
    resetForm();
    setOpenPopup(false);
  };

  const errorImage =
    errorCode === 400
      ? error400
      : errorCode === 401
      ? error401
      : errorCode === 408
      ? timeoutError
      : errorCode === 503
      ? serverOffError
      : serverOffError;

  return (
    <Dialog
      open={openPopup}
      onClose={(event, reason) => {
        if (reason !== "backdropClick") {
          handleAgree();
        }
      }}
      PaperProps={{
        sx: {
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)",
          borderRadius: "8px",
        },
      }}
    >
      <div className="errorCode">
        <img src={errorImage} alt="error-img" />
      </div>
      <DialogContent>
        <div className="errorMessage">
          {errorMessage || "Something went wrong... Please try again later."}
        </div>
      </DialogContent>
      <Button onClick={handleAgree} autoFocus>
        OK
      </Button>
    </Dialog>
  );
};

export default Popup;
