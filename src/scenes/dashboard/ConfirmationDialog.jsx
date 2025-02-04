import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import "./ConfirmationDialog.css";

const ConfirmationDialog = ({  handleClose, handleConfirm }) => {
  return (
    <Dialog
      open={true}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      classes={{ paper: "dialog-paper" }}
    >
      <DialogTitle id="alert-dialog-title" className="dialog-title">
        {"Confirm Action"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          id="alert-dialog-description"
          className="dialog-content-text"
        >
          Are you sure you want to create a new dashboard? This will discard any
          unsaved data.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <button
          onClick={handleClose}
          color="primary"
          className=" dialog-button dialog-button-cancel"
        >
          <span>Cancel</span>
          <svg
            viewBox="-5 -5 110 110"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M0,0 C30,10 70,10 100,0 C95,30 95,70 100,100 C70,90 30,90 0,100 C5,70 5,30 0,0" />
          </svg>
        </button>
        <button
          onClick={handleConfirm}
          color="primary"
          className="dialog-button"
          autoFocus
        >
          <span>Confirm</span>
          <svg
            viewBox="-5 -5 110 110"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M0,0 C30,10 70,10 100,0 C95,30 95,70 100,100 C70,90 30,90 0,100 C5,70 5,30 0,0" />

          </svg>
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
