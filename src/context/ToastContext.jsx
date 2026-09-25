import React, { createContext, useContext } from "react";
import { Toaster } from "../components/ui/sonner";
import { toast } from "sonner";

const ToastContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const showToast = (message, type = "success") => {
    if (type === "success") {
      toast.success(message);
    } else if (type === "error") {
      toast.error(message);
    } else if (type === "warning") {
      toast.warning(message);
    } else {
      toast(message);
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toaster position="bottom-right" richColors />
    </ToastContext.Provider>
  );
}
