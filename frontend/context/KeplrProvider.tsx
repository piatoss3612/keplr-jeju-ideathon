"use client";

import React, { createContext, useContext } from "react";
import { useKeplr, KeplrState } from "@/hooks/useKeplr";

interface KeplrContextType extends KeplrState {
  connect: () => Promise<boolean>;
  disconnect: () => Promise<void>;
  checkKeplrInstallation: () => boolean;
}

const KeplrContext = createContext<KeplrContextType | undefined>(undefined);

export function KeplrProvider({ children }: { children: React.ReactNode }) {
  const keplrHook = useKeplr();

  return (
    <KeplrContext.Provider value={keplrHook}>{children}</KeplrContext.Provider>
  );
}

export function useKeplrContext() {
  const context = useContext(KeplrContext);
  if (context === undefined) {
    throw new Error("useKeplrContext must be used within a KeplrProvider");
  }
  return context;
}
