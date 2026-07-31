import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

const STORAGE_KEY = "transparelief_donated_php";

function readStored(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return 0;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : 0;
  } catch {
    return 0;
  }
}

interface DonationContextValue {
  /** Sum of all PHP-equivalent donations recorded — persisted across refreshes. */
  totalDonatedPhp: number;
  /** Call this after a successful on-chain tx to update the hero stats. */
  addDonation: (phpAmount: number) => void;
}

const DonationContext = createContext<DonationContextValue | null>(null);

export function DonationProvider({ children }: { children: ReactNode }) {
  const [totalDonatedPhp, setTotalDonatedPhp] = useState<number>(readStored);

  const addDonation = useCallback((phpAmount: number) => {
    setTotalDonatedPhp((prev) => {
      const next = prev + phpAmount;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        // storage unavailable — state still updates in-memory
      }
      return next;
    });
  }, []);

  return (
    <DonationContext.Provider value={{ totalDonatedPhp, addDonation }}>
      {children}
    </DonationContext.Provider>
  );
}

export function useDonation(): DonationContextValue {
  const ctx = useContext(DonationContext);
  if (!ctx) throw new Error("useDonation must be used within DonationProvider");
  return ctx;
}
