# TranspaRelief

A transparent, Stellar-backed disaster relief dashboard for Local Government Units (LGUs). It bridges macro-level calamity fund accounting with micro-level family needs, letting donors trace every peso from wallet to Stellar transaction to vendor receipt.

**Stack:** Vite + React 19 + TypeScript + Tailwind CSS 4 · Stellar SDK + Freighter API · Soroban smart contract (Rust)

---

## Features

### Dashboard
- Hero summary of active calamities; **TO CONTRIBUTE** reflects total unfunded family needs and updates live after every donation
- Needs inventory table with PHP / XLM / USDC / PHPC toggle; funded quantities update per donation type

### Family Registry (`/families`)
- Searchable, filterable family cards with itemized needs and live funded progress
- "Fund this family" deep-link into the Donate page; funding fulfills the family's listed supply needs and propagates to the Master Needs Inventory

### Public Ledger (`/ledger`)
- Live Horizon feed of donor inflows and vendor outflows
- Each entry links to Stellar Expert

### Donate (`/donate`)
- Connect Freighter → choose amount → sign and submit a real Testnet XLM payment
- Friendbot button to fund a fresh wallet before testing
- USDC/PHPC shown for PHP-conversion context (requires trustline for live transfers)

### Admin Portal (`/admin`)
- Family registration with a **Randomize** button — generates urgency-scaled needs (Critical: 4–5 items, High: 2–4, Moderate: 1–3) from the supply catalogue
- Registering a family immediately updates the Family Registry and Master Needs Inventory
- Budget input and multi-signer vendor payout forms (local state only — no auth for this demo)

### Soroban Smart Contract (`contract/`)
The `calamity-donation` contract records on-chain donation proofs without moving tokens itself, keeping SAC auth complexity out of the critical path.

| Entry-point | Auth | Description |
|---|---|---|
| `__constructor` | admin | Atomic init at deploy (CAP-0058) |
| `record_donation` | donor | Log a donation with memo tag |
| `get_total` | — | Cumulative stroops recorded |
| `get_donor_total` | — | Per-donor cumulative stroops |
| `get_donor_count` | — | Unique donor count |
| `get_admin` | — | Admin address |

Storage uses instance TTL (global/count totals) and persistent TTL (per-donor totals), both auto-extended to 60 days.

---

## Getting Started

```bash
npm install
npm run dev
```

For the live Stellar flow on `/donate`, install [Freighter](https://www.freighter.app/) and switch it to **Testnet**.

```bash
npm run build     # tsc -b + vite build
npm run preview   # serve the production build locally
npm run lint      # oxlint
cargo test        # run Soroban contract unit tests
```

## Configuration

```bash
cp .env.example .env.local
```

| Variable | Default | Description |
|---|---|---|
| `VITE_STELLAR_NETWORK` | `testnet` | `testnet` or `public` |
| `VITE_LGU_WALLET` | demo keypair | LGU's real Stellar public key |

Without `.env.local`, the app falls back to `src/data/mockData.ts` — an unfunded testnet keypair with cached sample figures.

---

## CI/CD Pipeline

```
push / PR
    │
    ▼
┌─────────────────────────────────────┐
│              build job              │
│  1. npm install                     │
│  2. oxlint                          │
│  3. tsc --noEmit                    │
│  4. cargo test                      │
│  5. npm run build                   │
│  6. Gitleaks secret scan            │
└──────────┬──────────────────────────┘
           │
     ┌─────┴──────┐
     │            │
     ▼            ▼
PR open       push to main
     │            │
     ▼            ▼
 Vercel        Vercel
 Preview       Production
 Deploy        Deploy
```

Triggered on push/PR to `main` (and push to `vercel-hosting`). The deploy jobs are gated on `build` passing. Production deploys only on direct push to `main`; PRs get an isolated preview URL.

Secrets required: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.

---

## Architecture Notes

- `src/context/DonationContext.tsx` — single source of truth for the reactive family list, live supply categories, and all donation state. General donations distribute to families by urgency (critical → high → moderate); family-specific donations credit that family's listed needs proportionally; all state persists to `localStorage` with a version key to purge stale data on mockData changes.
- All family, ledger, and fund figures in the demo are seed data in `src/data/mockData.ts` — no backend or database. New families registered via Admin are persisted in `localStorage`.
- Ledger transaction hashes in the demo are illustrative; Stellar Expert links won't resolve to real transactions until a live LGU wallet is wired in.
- No auth on `/admin` — forms update local component state only.
