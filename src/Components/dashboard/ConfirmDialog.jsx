import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

const ConfirmDialog = ({ open, title, message, onConfirm, onCancel, confirmColor = "error" }) => {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle sx={{ color: "#0c2993", fontWeight: 600 }}>
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button
          onClick={onConfirm}
          color={confirmColor}
          variant="contained"
          sx={{
            bgcolor: confirmColor === "error" ? "#c62828" : "#2e7d32",
            "&:hover": {
              bgcolor: confirmColor === "error" ? "#b71c1c" : "#1b5e20",
            },
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;