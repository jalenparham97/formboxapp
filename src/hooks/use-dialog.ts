import { useState } from "react";

export const useDialog = (): [
  boolean,
  { open: () => void; close: () => void; toggle: () => void }
] => {
  const [open, setOpen] = useState(false);

  const handlers = {
    open: () => {
      setOpen(true);
    },
    close: () => {
      setOpen(false);
    },
    toggle: () => {
      setOpen((prev) => !prev);
    },
  };

  return [open, handlers];
};
