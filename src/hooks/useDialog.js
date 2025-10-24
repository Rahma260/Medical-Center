import { useState } from "react";

export const useDialog = () => {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const openDialog = (item = null) => {
    setSelectedItem(item);
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
    setSelectedItem(null);
  };

  return {
    open,
    selectedItem,
    openDialog,
    closeDialog,
  };
};