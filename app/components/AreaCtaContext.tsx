"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface AreaCtaContextValue {
  cityName: string | null;
  setCityName: (name: string | null) => void;
}

const AreaCtaContext = createContext<AreaCtaContextValue | null>(null);

export function AreaCtaProvider({ children }: { children: ReactNode }) {
  const [cityName, setCityName] = useState<string | null>(null);
  const setter = useCallback((name: string | null) => setCityName(name), []);
  return (
    <AreaCtaContext.Provider value={{ cityName, setCityName: setter }}>
      {children}
    </AreaCtaContext.Provider>
  );
}

export function useAreaCta(): AreaCtaContextValue {
  const ctx = useContext(AreaCtaContext);
  if (!ctx) return { cityName: null, setCityName: () => {} };
  return ctx;
}
