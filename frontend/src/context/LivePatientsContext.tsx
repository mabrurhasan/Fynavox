"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useLivePatients } from "@/hooks/useLivePatients";

type LivePatientsContextType = ReturnType<typeof useLivePatients>;

const LivePatientsContext = createContext<LivePatientsContextType | null>(
  null
);

export function LivePatientsProvider({ children }: { children: ReactNode }) {
  const value = useLivePatients(1500);
  return (
    <LivePatientsContext.Provider value={value}>
      {children}
    </LivePatientsContext.Provider>
  );
}

export function useLivePatientsContext() {
  const ctx = useContext(LivePatientsContext);
  if (!ctx) {
    throw new Error("useLivePatientsContext must be used within provider");
  }
  return ctx;
}
