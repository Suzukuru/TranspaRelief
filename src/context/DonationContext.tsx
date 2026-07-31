import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { families, SUPPLY_CATALOGUE } from "../data/mockData";

// ─────────────────────────────────────────────────────────────────────────────
// localStorage helpers
// ─────────────────────────────────────────────────────────────────────────────
const KEY_FAMILIES = "transparelief_family_funded";
const KEY_SUPPLY   = "transparelief_supply_funded";
// Bump this when mockData changes incompatibly so stale session data is cleared.
const DATA_VERSION     = "v4";
const KEY_DATA_VERSION = "transparelief_data_version";

/** Wipe persisted donation state when the data version has changed. */
function ensureFreshDataVersion() {
  try {
    if (localStorage.getItem(KEY_DATA_VERSION) !== DATA_VERSION) {
      localStorage.removeItem(KEY_FAMILIES);
      localStorage.removeItem(KEY_SUPPLY);
      // Also remove old key from previous context shape
      localStorage.removeItem("transparelief_donated_php");
      localStorage.setItem(KEY_DATA_VERSION, DATA_VERSION);
    }
  } catch { /* noop */ }
}

function readRecord(key: string): Record<string, number> {
  try {
    const v = localStorage.getItem(key);
    if (!v) return {};
    const parsed = JSON.parse(v) as unknown;
    if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed))
      return parsed as Record<string, number>;
    return {};
  } catch {
    return {};
  }
}

function writeRecord(key: string, val: Record<string, number>) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* noop */ }
}

// ─────────────────────────────────────────────────────────────────────────────
// Distribute a general donation across families in urgency order.
// Fills critical families first (equal share, capped at gap), then high, moderate.
// ─────────────────────────────────────────────────────────────────────────────
function distributeToFamilies(
  phpAmount: number,
  prev: Record<string, number>,
): Record<string, number> {
  const next = { ...prev };
  let remaining = phpAmount;
  const TIERS = ["critical", "high", "moderate"] as const;

  for (const tier of TIERS) {
    if (remaining <= 0.001) break;
    const tierFamilies = families.filter((f) => f.urgency === tier);

    let madeProgress = true;
    while (remaining > 0.001 && madeProgress) {
      madeProgress = false;
      const needy = tierFamilies.filter((f) => {
        const totalCost = f.needs.reduce((s, n) => s + n.quantity * n.unitCostPhp, 0);
        return f.amountFundedPhp + (next[f.id] ?? 0) < totalCost;
      });
      if (!needy.length) break;

      const share = remaining / needy.length;
      for (const fam of needy) {
        const totalCost = fam.needs.reduce((s, n) => s + n.quantity * n.unitCostPhp, 0);
        const gap = totalCost - fam.amountFundedPhp - (next[fam.id] ?? 0);
        const credit = Math.min(share, gap);
        if (credit > 0.001) {
          next[fam.id] = (next[fam.id] ?? 0) + credit;
          remaining -= credit;
          madeProgress = true;
        }
      }
    }
  }
  return next;
}

// ─────────────────────────────────────────────────────────────────────────────
// Derive fractional supply-unit deltas from family extra-funding.
// Uses fractional values (not floored) so even small partial credits show up.
// ─────────────────────────────────────────────────────────────────────────────
function computeFamilySupplyDeltas(
  extraFundedByFamily: Record<string, number>,
): Record<string, number> {
  const deltas: Record<string, number> = {};

  for (const fam of families) {
    const extra = extraFundedByFamily[fam.id] ?? 0;
    if (extra <= 0) continue;

    const famTotalCost = fam.needs.reduce((s, n) => s + n.quantity * n.unitCostPhp, 0);
    if (famTotalCost <= 0) continue;

    const oldRatio   = Math.min(1, fam.amountFundedPhp / famTotalCost);
    const newRatio   = Math.min(1, (fam.amountFundedPhp + extra) / famTotalCost);
    const deltaRatio = Math.max(0, newRatio - oldRatio);

    for (const need of fam.needs) {
      deltas[need.supplyId] = (deltas[need.supplyId] ?? 0) + need.quantity * deltaRatio;
    }
  }

  return deltas;
}

// ─────────────────────────────────────────────────────────────────────────────
// Context value
// ─────────────────────────────────────────────────────────────────────────────
export interface DonationContextValue {
  /** Per-family extra funded amounts (persisted). */
  extraFundedByFamily: Record<string, number>;
  /** Direct per-supply funded PHP amounts from item donations (persisted). */
  supplyDirectFunded: Record<string, number>;
  /**
   * Combined supply quantity delta (family-proportional + direct item units).
   * Add to supplyCategories[x].quantityFunded for live display.
   * Values are fractional — round only at display time.
   */
  supplyFundedDelta: Record<string, number>;
  /** Total PHP donated this session (derived). */
  totalDonatedPhp: number;
  /** General donation: distributes to families by urgency hierarchy. */
  addDonation: (phpAmount: number) => void;
  /** Item-specific donation: directly credits that supply's quantity. */
  fundSupply: (supplyId: string, phpAmount: number) => void;
  /** Family-specific donation: proportionally credits all of a family's needs. */
  fundFamily: (familyId: string, phpAmount: number) => void;
}

const DonationContext = createContext<DonationContextValue | null>(null);

// ─────────────────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────────────────
export function DonationProvider({ children }: { children: ReactNode }) {
  const [extraFundedByFamily, setExtraFundedByFamily] = useState<Record<string, number>>(
    () => { ensureFreshDataVersion(); return readRecord(KEY_FAMILIES); },
  );
  const [supplyDirectFunded, setSupplyDirectFunded] = useState<Record<string, number>>(
    () => readRecord(KEY_SUPPLY),
  );

  // Family-driven supply deltas (fractional units)
  const familySupplyDeltas = useMemo(
    () => computeFamilySupplyDeltas(extraFundedByFamily),
    [extraFundedByFamily],
  );

  // Merge family deltas + direct supply credits into one delta map
  const supplyFundedDelta = useMemo(() => {
    const merged: Record<string, number> = { ...familySupplyDeltas };
    for (const cat of SUPPLY_CATALOGUE) {
      const directPhp = supplyDirectFunded[cat.id] ?? 0;
      if (directPhp > 0) {
        // Convert PHP credited directly to this supply into fractional units
        const directUnits = directPhp / cat.unitCostPhp;
        merged[cat.id] = (merged[cat.id] ?? 0) + directUnits;
      }
    }
    return merged;
  }, [familySupplyDeltas, supplyDirectFunded]);

  const totalDonatedPhp = useMemo(() => {
    const fromFamilies = Object.values(extraFundedByFamily).reduce((s, v) => s + v, 0);
    const fromSupplies = Object.values(supplyDirectFunded).reduce((s, v) => s + v, 0);
    return fromFamilies + fromSupplies;
  }, [extraFundedByFamily, supplyDirectFunded]);

  // General donation → distribute to families by urgency
  const addDonation = useCallback((phpAmount: number) => {
    setExtraFundedByFamily((prev) => {
      const next = distributeToFamilies(phpAmount, prev);
      writeRecord(KEY_FAMILIES, next);
      return next;
    });
  }, []);

  // Item donation → directly credit that supply's PHP total
  const fundSupply = useCallback((supplyId: string, phpAmount: number) => {
    setSupplyDirectFunded((prev) => {
      const next = { ...prev, [supplyId]: (prev[supplyId] ?? 0) + phpAmount };
      writeRecord(KEY_SUPPLY, next);
      return next;
    });
  }, []);

  // Family donation → proportionally credit all of a family's listed needs
  const fundFamily = useCallback((familyId: string, phpAmount: number) => {
    setExtraFundedByFamily((prev) => {
      const next = { ...prev, [familyId]: (prev[familyId] ?? 0) + phpAmount };
      writeRecord(KEY_FAMILIES, next);
      return next;
    });
  }, []);

  return (
    <DonationContext.Provider
      value={{
        extraFundedByFamily,
        supplyDirectFunded,
        supplyFundedDelta,
        totalDonatedPhp,
        addDonation,
        fundSupply,
        fundFamily,
      }}
    >
      {children}
    </DonationContext.Provider>
  );
}

export function useDonation(): DonationContextValue {
  const ctx = useContext(DonationContext);
  if (!ctx) throw new Error("useDonation must be used within DonationProvider");
  return ctx;
}
