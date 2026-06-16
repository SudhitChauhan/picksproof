"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle2, X } from "lucide-react";

export function CatalogSuccessBanner() {
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const added = searchParams.get("added");
    const updated = searchParams.get("updated");
    const imported = searchParams.get("imported");

    if (added === "1") {
      setMessage("Product added successfully. It is now live in your catalogue.");
      setVisible(true);
    } else if (updated === "1") {
      setMessage("Product updated successfully.");
      setVisible(true);
    } else if (imported) {
      const count = Number(imported);
      setMessage(
        count > 0
          ? `${count} product${count === 1 ? "" : "s"} imported successfully.`
          : "Import completed."
      );
      setVisible(true);
    }
  }, [searchParams]);

  if (!visible) return null;

  return (
    <div className="admin-form-alert admin-form-alert--success admin-catalog-banner">
      <CheckCircle2 className="size-5 shrink-0" />
      <span>{message}</span>
      <button
        aria-label="Dismiss"
        className="admin-catalog-banner-close"
        onClick={() => setVisible(false)}
        type="button"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
