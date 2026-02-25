import React, { createContext, useContext, useState, useCallback } from 'react';
import { Loader2 } from 'lucide-react';

type LoadingContextType = {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
};

const LoadingContext = createContext<LoadingContextType | null>(null);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const setLoading = useCallback((loading: boolean) => setIsLoading(loading), []);

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading }}>
      {children}
      <GlobalSpinner visible={isLoading} />
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const ctx = useContext(LoadingContext);
  if (!ctx) {
    throw new Error('useLoading debe usarse dentro de LoadingProvider');
  }
  return ctx;
}

function GlobalSpinner({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40 backdrop-blur-[2px]"
      role="status"
      aria-live="polite"
      aria-label="Cargando"
    >
      <div className="flex flex-col items-center gap-3 rounded-xl bg-white px-6 py-5 shadow-lg">
        <Loader2
          className="h-10 w-10 animate-spin text-(--color-primary)"
          aria-hidden
        />
        <span className="text-sm font-medium text-[#374151]">Cargando...</span>
      </div>
    </div>
  );
}
