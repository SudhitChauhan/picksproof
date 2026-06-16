"use client";

import { createContext, useContext, useState } from "react";

type AdminUIContextValue = {
  mobileOpen: boolean;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
};

const AdminUIContext = createContext<AdminUIContextValue | null>(null);

export function AdminUIProvider({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <AdminUIContext.Provider
      value={{
        mobileOpen,
        openMobileMenu: () => setMobileOpen(true),
        closeMobileMenu: () => setMobileOpen(false)
      }}
    >
      {children}
    </AdminUIContext.Provider>
  );
}

export function useAdminUI() {
  const context = useContext(AdminUIContext);
  if (!context) {
    throw new Error("useAdminUI must be used within AdminUIProvider");
  }
  return context;
}
