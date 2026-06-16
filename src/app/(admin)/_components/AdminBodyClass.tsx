"use client";

import { useEffect } from "react";

export function AdminBodyClass() {
  useEffect(() => {
    document.body.dataset.admin = "true";
    return () => {
      delete document.body.dataset.admin;
    };
  }, []);

  return null;
}
