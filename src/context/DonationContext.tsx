import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  families as SEED_FAMILIES,
  SUPPLY_CATALOGUE,
} from "../data/mockData";
import type { Family, SupplyCategory } from "../types";

// ─────────────────────────────────────────────────────────────────────────────
// localStorage keys & version sentinel
// ─────────────────────────────────────────────────────────────────────────────
const DATA_VERSION     = "v5";
const KEY_VERSION      = "transparelief_data_version";
const KEY_FAM_FUNDED   = "transparelief_family_funded";
const KEY_FAM_LIST     = "transparelief_family_list";

function purgeIfStale() {
  try {
    if (localStorage.getItem(KEY_VERSION) !== DATA_VERSION) {
      localStorage.removeItem(KEY_FAM_FUNDED);
      localStorage.removeItem(KEY_FAM_LIST);
      // clean up old key names from prior versions
      localStorage.removeItem("transparelief_donated_php");
      localStorage.removeItem("transparelief_supply_funded");
      localStorage.setItem(KEY_VERSION, DATA_VERSION);
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
  } catch { return {}; }
}

function writeRecord(key: string, val: Record<string, number>) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* noop */ }
}

function readFamilyList(): Family[] {
  try {
    const v = localStorage.getItem(KEY_FAM_LIST);
    if (!v) return [];
    const parsed = JSON.parse(v) as unknown;
    if (Array.isArray(parsed)) return parsed as Family[];
    return [];
  } catch { return []; }
}

function writeFamilyList(list: Family[]) {
  try { localStorage.setItem(KEY_FAM_LIST, JSON.stringify(list)); } catch { /* noop */ }
}

// ─────────────────────────────────────────────────────────────────────────────
// Derive supplyCategories from a family list.
// quantityNeeded = sum of all family needs for that supply id
// quantityFunded = proportional from amountFundedPhp + extraFundedByFamily
// ─────────────────────────────────────────────────────────────────────────────
function buildLiveSupplyCategories(
  allFamilies: Family[],
  extraFundedByFamily: Record<string, number>,
): SupplyCategory[] {
  return SUPPLY_CATALOGUE.map((cat) => {
    let totalNeeded = 0;
    let totalFunded = 0;

    for (const fam of allFamilies) {
      const famTotalCost = fam.needs.reduce((s, n) => s + n.quantity * n.unitCostPhp, 0);
      for (const need of fam.needs) {
        if (need.supplyId !== cat.id) continue;
        totalNeeded += need.quantity;
        const funded = fam.amountFundedPhp + (extraFundedByFamily[fam.id] ?? 0);
        if (famTotalCost > 0 && funded > 0) {
          const ratio = Math.min(1, funded / famTotalCost);
          totalFunded += need.quantity * ratio;
        }
      }
    }

    return {
      id:             cat.id,
      name:           cat.name,
      unit:           cat.unit as SupplyCategory["unit"],
      icon:           cat.icon,
      unitCostPhp:    cat.unitCostPhp,
      quantityNeeded: Math.max(0, Math.round(totalNeeded)),
      quantityFunded: Math.min(Math.round(totalNeeded), Math.round(totalFunded)),
    };
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Distribute a general donation across families in urgency order.
// ─────────────────────────────────────────────────────────────────────────────
function distributeToFamilies(
  phpAmount: number,
  allFamilies: Family[],
  prev: Record<string, number>,
): Record<string, number> {
  const next = { ...prev };
  let remaining = phpAmount;
  const TIERS = ["critical", "high", "moderate"] as const;

  for (const tier of TIERS) {
    if (remaining <= 0.01) break;
    const tierFamilies = allFamilies.filter((f) => f.urgency === tier);

    let madeProgress = true;
    while (remaining > 0.01 && madeProgress) {
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
        if (credit > 0.01) {
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
// Compute total unfunded family need
// ─────────────────────────────────────────────────────────────────────────────
function computeShortfall(
  allFamilies: Family[],
  extraFundedByFamily: Record<string, number>,
): number {
  return allFamilies.reduce((sum, fam) => {
    const totalCost = fam.needs.reduce((s, n) => s + n.quantity * n.unitCostPhp, 0);
    const funded = Math.min(totalCost, fam.amountFundedPhp + (extraFundedByFamily[fam.id] ?? 0));
    return sum + Math.max(0, totalCost - funded);
  }, 0);
}

// ─────────────────────────────────────────────────────────────────────────────
// Context shape
// ─────────────────────────────────────────────────────────────────────────────
export interface DonationContextValue {
  /** Full reactive family list (seed + newly registered families). */
  families: Family[];
  /** Live supply categories derived from families + donations. */
  liveSupplyCategories: SupplyCategory[];
  /** Per-family extra funded amounts. */
  extraFundedByFamily: Record<string, number>;
  /** Total PHP donated this session (derived). */
  totalDonatedPhp: number;
  /** Total unfunded family needs (derived). */
  familyShortfall: number;
  /** General donation: distributes to families by urgency hierarchy. */
  addDonation: (phpAmount: number) => void;
  /** Family-specific donation. */
  fundFamily: (familyId: string, phpAmount: number) => void;
  /** Register a new family — immediately updates the registry and inventory. */
  addFamily: (family: Family) => void;
}

const DonationContext = createContext<DonationContextValue | null>(null);

// ─────────────────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────────────────
export function DonationProvider({ children }: { children: ReactNode }) {
  // Run once on first mount
  const [initialized] = useState(() => { purgeIfStale(); return true; });
  void initialized;

  // Seed families + any persisted extra families merged together
  const [extraFamilies, setExtraFamilies] = useState<Family[]>(readFamilyList);
  const [extraFundedByFamily, setExtraFundedByFamily] = useState<Record<string, number>>(
    () => readRecord(KEY_FAM_FUNDED),
  );

  // Full family list: seed + registered extras
  const families = useMemo(
    () => [...SEED_FAMILIES, ...extraFamilies],
    [extraFamilies],
  );

  // Live supply categories: recomputed whenever families or funding changes
  const liveSupplyCategories = useMemo(
    () => buildLiveSupplyCategories(families, extraFundedByFamily),
    [families, extraFundedByFamily],
  );

  const totalDonatedPhp = useMemo(
    () => Object.values(extraFundedByFamily).reduce((s, v) => s + v, 0),
    [extraFundedByFamily],
  );

  const familyShortfall = useMemo(
    () => computeShortfall(families, extraFundedByFamily),
    [families, extraFundedByFamily],
  );

  const addDonation = useCallback((phpAmount: number) => {
    setExtraFundedByFamily((prev) => {
      // Need access to current families — capture from closure (stable ref via SEED_FAMILIES + extraFamilies)
      // We read families via the setter's prev pattern using a ref trick:
      // Instead, read from the module-level seed + stored extras
      const allFams = [...SEED_FAMILIES, ...readFamilyList()];
      const next = distributeToFamilies(phpAmount, allFams, prev);
      writeRecord(KEY_FAM_FUNDED, next);
      return next;
    });
  }, []);

  const fundFamily = useCallback((familyId: string, phpAmount: number) => {
    setExtraFundedByFamily((prev) => {
      const next = { ...prev, [familyId]: (prev[familyId] ?? 0) + phpAmount };
      writeRecord(KEY_FAM_FUNDED, next);
      return next;
    });
  }, []);

  const addFamily = useCallback((family: Family) => {
    setExtraFamilies((prev) => {
      const next = [...prev, family];
      writeFamilyList(next);
      return next;
    });
  }, []);

  return (
    <DonationContext.Provider
      value={{
        families,
        liveSupplyCategories,
        extraFundedByFamily,
        totalDonatedPhp,
        familyShortfall,
        addDonation,
        fundFamily,
        addFamily,
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
