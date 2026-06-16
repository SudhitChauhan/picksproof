"use client";

import { useEffect } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminUIProvider, useAdminUI } from "./AdminUIContext";

type ShellProps = {
  children: React.ReactNode;
  email: string;
  logoutAction: () => Promise<void>;
};

function AdminShellInner({ children, email, logoutAction }: ShellProps) {
  const { mobileOpen, closeMobileMenu } = useAdminUI();

  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeMobileMenu();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [closeMobileMenu]);

  return (
    <div className="admin-shell">
      <AdminSidebar
        email={email}
        logoutAction={logoutAction}
        mobileOpen={mobileOpen}
        onMobileClose={closeMobileMenu}
      />
      <div className="admin-main">{children}</div>
    </div>
  );
}

export function AdminShell(props: ShellProps) {
  return (
    <AdminUIProvider>
      <AdminShellInner {...props} />
    </AdminUIProvider>
  );
}
