"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { MAX_COMPARE_PRODUCTS, type CompareProduct } from "@/lib/compare/types";

type CompareContextValue = {
  categorySlug: string;
  selected: CompareProduct[];
  count: number;
  isSelected: (id: string) => boolean;
  isFull: boolean;
  toggle: (product: CompareProduct) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const CompareContext = createContext<CompareContextValue | null>(null);

type ProviderProps = {
  categorySlug: string;
  children: React.ReactNode;
};

export function CompareProvider({ categorySlug, children }: ProviderProps) {
  const [selected, setSelected] = useState<CompareProduct[]>([]);

  const isSelected = useCallback((id: string) => selected.some((item) => item.id === id), [selected]);

  const toggle = useCallback((product: CompareProduct) => {
    setSelected((current) => {
      const exists = current.some((item) => item.id === product.id);
      if (exists) return current.filter((item) => item.id !== product.id);
      if (current.length >= MAX_COMPARE_PRODUCTS) return current;
      return [...current, product];
    });
  }, []);

  const remove = useCallback((id: string) => {
    setSelected((current) => current.filter((item) => item.id !== id));
  }, []);

  const clear = useCallback(() => setSelected([]), []);

  const value = useMemo(
    () => ({
      categorySlug,
      selected,
      count: selected.length,
      isSelected,
      isFull: selected.length >= MAX_COMPARE_PRODUCTS,
      toggle,
      remove,
      clear
    }),
    [categorySlug, selected, isSelected, toggle, remove, clear]
  );

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within CompareProvider");
  }
  return context;
}
