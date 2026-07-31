import type {
  AssetRate,
  CalamitySummary,
  Family,
  LedgerEntry,
  SupplyCategory,
} from "../types";

export const calamitySummary: CalamitySummary = {
  cityName: "Municipality of Malinaw",
  provinceName: "Ibayo Province",
  calamityName: "Typhoon Salakot",
  signalLevel: 3,
  status: "active_response",
  affectedFamilies: 3842,
  affectedBarangays: 11,
  declaredOn: "2026-07-14",
  lguFundAllocatedPhp: 5_200_000,
  lguFundDisbursedPhp: 3_040_000,
  lguWalletPublicKey: "GDTVFSXEPGPVR6OLDJ6TA6Z34KVTJSPFGAPW4OL5EA2QD7RZA7L2XMGN",
  stellarNetwork: "testnet",
};

export const assetRates: AssetRate[] = [
  { asset: "XLM", phpRate: 22.4 },
  { asset: "USDC", phpRate: 58.15 },
  { asset: "PHPC", phpRate: 1 },
];

// ---------------------------------------------------------------------------
// Supply catalogue — unit costs and icons only; quantities derived from families
// ---------------------------------------------------------------------------
export const SUPPLY_CATALOGUE = [
  { id: "rice",         name: "Rice (50kg sack)",              unit: "sack",             icon: "Wheat",        unitCostPhp: 2_650 },
  { id: "food-packs",   name: "Emergency Food Packs",          unit: "pack",             icon: "Package",      unitCostPhp: 750   },
  { id: "roofing",      name: "CGI Roofing Sheets",            unit: "sheet",            icon: "Home",         unitCostPhp: 480   },
  { id: "water",        name: "Potable Water (5-gal)",         unit: "gallon container", icon: "Droplets",     unitCostPhp: 120   },
  { id: "hygiene",      name: "Hygiene Kits",                  unit: "kit",              icon: "ShowerHead",   unitCostPhp: 350   },
  { id: "tarps",        name: "Tarpaulin Shelter Kits",        unit: "tarpaulin",        icon: "Tent",         unitCostPhp: 890   },
  { id: "solar",        name: "Solar Lanterns",                unit: "unit",             icon: "Sun",          unitCostPhp: 640   },
  { id: "purification", name: "Water Purification Tablets (x50)", unit: "bottle",       icon: "FlaskConical", unitCostPhp: 95    },
] as const;

export type SupplyId = typeof SUPPLY_CATALOGUE[number]["id"];

// ---------------------------------------------------------------------------
// Family registry — 30 families; amountFundedPhp = partially funded already
// ---------------------------------------------------------------------------
export const families: Family[] = [
  {
    id: "FAM-0422", alias: "Family #FAM-0422", barangay: "Barangay Look",
    householdSize: 5, urgency: "critical", registeredOn: "2026-07-15",
    deliveryStatus: "in_transit", amountFundedPhp: 2_400,
    needs: [
      { id: "n1", label: "Emergency Food Packs", supplyId: "food-packs", quantity: 3, unitCostPhp: 750 },
      { id: "n2", label: "CGI Roofing Sheets",   supplyId: "roofing",    quantity: 12, unitCostPhp: 480 },
      { id: "n3", label: "Potable Water (5-gal)", supplyId: "water",     quantity: 6,  unitCostPhp: 120 },
      { id: "n4", label: "Tarpaulin Shelter Kits", supplyId: "tarps",    quantity: 2,  unitCostPhp: 890 },
    ],
  },
  {
    id: "FAM-0389", alias: "Family #FAM-0389", barangay: "Barangay Tubod",
    householdSize: 3, urgency: "high", registeredOn: "2026-07-15",
    deliveryStatus: "pending", amountFundedPhp: 1_050,
    needs: [
      { id: "n1", label: "Rice (50kg sack)",   supplyId: "rice",    quantity: 2, unitCostPhp: 2_650 },
      { id: "n2", label: "Hygiene Kits",       supplyId: "hygiene", quantity: 3, unitCostPhp: 350 },
      { id: "n3", label: "Solar Lanterns",     supplyId: "solar",   quantity: 1, unitCostPhp: 640 },
    ],
  },
  {
    id: "FAM-0510", alias: "Family #FAM-0510", barangay: "Barangay Riverside",
    householdSize: 7, urgency: "critical", registeredOn: "2026-07-16",
    deliveryStatus: "pending", amountFundedPhp: 0,
    needs: [
      { id: "n1", label: "Tarpaulin Shelter Kits",            supplyId: "tarps",        quantity: 3,  unitCostPhp: 890 },
      { id: "n2", label: "Emergency Food Packs",              supplyId: "food-packs",   quantity: 5,  unitCostPhp: 750 },
      { id: "n3", label: "Water Purification Tablets (x50)", supplyId: "purification", quantity: 4,  unitCostPhp: 95  },
      { id: "n4", label: "CGI Roofing Sheets",                supplyId: "roofing",      quantity: 10, unitCostPhp: 480 },
    ],
  },
  {
    id: "FAM-0287", alias: "Family #FAM-0287", barangay: "Barangay Sto. Niño",
    householdSize: 4, urgency: "moderate", registeredOn: "2026-07-14",
    deliveryStatus: "delivered", amountFundedPhp: 3_010,
    needs: [
      { id: "n1", label: "Rice (50kg sack)",    supplyId: "rice",  quantity: 1, unitCostPhp: 2_650 },
      { id: "n2", label: "Potable Water (5-gal)", supplyId: "water", quantity: 3, unitCostPhp: 120 },
    ],
  },
  {
    id: "FAM-0466", alias: "Family #FAM-0466", barangay: "Barangay Bagong Sikat",
    householdSize: 6, urgency: "high", registeredOn: "2026-07-16",
    deliveryStatus: "pending", amountFundedPhp: 700,
    needs: [
      { id: "n1", label: "CGI Roofing Sheets", supplyId: "roofing",  quantity: 14, unitCostPhp: 480 },
      { id: "n2", label: "Hygiene Kits",       supplyId: "hygiene",  quantity: 2,  unitCostPhp: 350 },
      { id: "n3", label: "Emergency Food Packs", supplyId: "food-packs", quantity: 4, unitCostPhp: 750 },
    ],
  },
  {
    id: "FAM-0341", alias: "Family #FAM-0341", barangay: "Barangay Look",
    householdSize: 2, urgency: "moderate", registeredOn: "2026-07-13",
    deliveryStatus: "delivered", amountFundedPhp: 1_390,
    needs: [
      { id: "n1", label: "Emergency Food Packs", supplyId: "food-packs", quantity: 1, unitCostPhp: 750 },
      { id: "n2", label: "Solar Lanterns",       supplyId: "solar",      quantity: 1, unitCostPhp: 640 },
    ],
  },
  {
    id: "FAM-0598", alias: "Family #FAM-0598", barangay: "Barangay Tubod",
    householdSize: 8, urgency: "critical", registeredOn: "2026-07-17",
    deliveryStatus: "pending", amountFundedPhp: 0,
    needs: [
      { id: "n1", label: "Rice (50kg sack)",       supplyId: "rice",   quantity: 3,  unitCostPhp: 2_650 },
      { id: "n2", label: "Tarpaulin Shelter Kits", supplyId: "tarps",  quantity: 2,  unitCostPhp: 890 },
      { id: "n3", label: "Potable Water (5-gal)",  supplyId: "water",  quantity: 8,  unitCostPhp: 120 },
      { id: "n4", label: "Hygiene Kits",           supplyId: "hygiene", quantity: 4, unitCostPhp: 350 },
    ],
  },
  {
    id: "FAM-0155", alias: "Family #FAM-0155", barangay: "Barangay Riverside",
    householdSize: 5, urgency: "high", registeredOn: "2026-07-15",
    deliveryStatus: "in_transit", amountFundedPhp: 4_290,
    needs: [
      { id: "n1", label: "CGI Roofing Sheets",   supplyId: "roofing",    quantity: 8, unitCostPhp: 480 },
      { id: "n2", label: "Emergency Food Packs", supplyId: "food-packs", quantity: 2, unitCostPhp: 750 },
      { id: "n3", label: "Hygiene Kits",         supplyId: "hygiene",    quantity: 1, unitCostPhp: 350 },
    ],
  },
  {
    id: "FAM-0633", alias: "Family #FAM-0633", barangay: "Barangay Mabini",
    householdSize: 6, urgency: "critical", registeredOn: "2026-07-17",
    deliveryStatus: "pending", amountFundedPhp: 0,
    needs: [
      { id: "n1", label: "Rice (50kg sack)",                 supplyId: "rice",         quantity: 2,  unitCostPhp: 2_650 },
      { id: "n2", label: "Tarpaulin Shelter Kits",           supplyId: "tarps",        quantity: 3,  unitCostPhp: 890 },
      { id: "n3", label: "Emergency Food Packs",             supplyId: "food-packs",   quantity: 6,  unitCostPhp: 750 },
      { id: "n4", label: "Water Purification Tablets (x50)", supplyId: "purification", quantity: 6,  unitCostPhp: 95  },
    ],
  },
  {
    id: "FAM-0711", alias: "Family #FAM-0711", barangay: "Barangay Pook",
    householdSize: 4, urgency: "high", registeredOn: "2026-07-18",
    deliveryStatus: "pending", amountFundedPhp: 500,
    needs: [
      { id: "n1", label: "Hygiene Kits",         supplyId: "hygiene",    quantity: 4, unitCostPhp: 350 },
      { id: "n2", label: "Emergency Food Packs", supplyId: "food-packs", quantity: 3, unitCostPhp: 750 },
      { id: "n3", label: "Solar Lanterns",       supplyId: "solar",      quantity: 2, unitCostPhp: 640 },
    ],
  },
  {
    id: "FAM-0802", alias: "Family #FAM-0802", barangay: "Barangay Sta. Cruz",
    householdSize: 3, urgency: "moderate", registeredOn: "2026-07-14",
    deliveryStatus: "delivered", amountFundedPhp: 2_100,
    needs: [
      { id: "n1", label: "Rice (50kg sack)",   supplyId: "rice",  quantity: 1, unitCostPhp: 2_650 },
      { id: "n2", label: "Hygiene Kits",       supplyId: "hygiene", quantity: 2, unitCostPhp: 350 },
    ],
  },
  {
    id: "FAM-0744", alias: "Family #FAM-0744", barangay: "Barangay Bagong Sikat",
    householdSize: 9, urgency: "critical", registeredOn: "2026-07-18",
    deliveryStatus: "pending", amountFundedPhp: 0,
    needs: [
      { id: "n1", label: "CGI Roofing Sheets",               supplyId: "roofing",      quantity: 18, unitCostPhp: 480 },
      { id: "n2", label: "Rice (50kg sack)",                 supplyId: "rice",         quantity: 3,  unitCostPhp: 2_650 },
      { id: "n3", label: "Emergency Food Packs",             supplyId: "food-packs",   quantity: 8,  unitCostPhp: 750 },
      { id: "n4", label: "Tarpaulin Shelter Kits",           supplyId: "tarps",        quantity: 2,  unitCostPhp: 890 },
      { id: "n5", label: "Water Purification Tablets (x50)", supplyId: "purification", quantity: 10, unitCostPhp: 95  },
    ],
  },
  {
    id: "FAM-0915", alias: "Family #FAM-0915", barangay: "Barangay Look",
    householdSize: 5, urgency: "high", registeredOn: "2026-07-19",
    deliveryStatus: "pending", amountFundedPhp: 1_200,
    needs: [
      { id: "n1", label: "Potable Water (5-gal)",  supplyId: "water",      quantity: 10, unitCostPhp: 120 },
      { id: "n2", label: "Emergency Food Packs",   supplyId: "food-packs", quantity: 4,  unitCostPhp: 750 },
      { id: "n3", label: "Solar Lanterns",         supplyId: "solar",      quantity: 2,  unitCostPhp: 640 },
    ],
  },
  {
    id: "FAM-1003", alias: "Family #FAM-1003", barangay: "Barangay Tubod",
    householdSize: 7, urgency: "critical", registeredOn: "2026-07-19",
    deliveryStatus: "pending", amountFundedPhp: 0,
    needs: [
      { id: "n1", label: "CGI Roofing Sheets",     supplyId: "roofing",    quantity: 20, unitCostPhp: 480 },
      { id: "n2", label: "Rice (50kg sack)",        supplyId: "rice",       quantity: 4,  unitCostPhp: 2_650 },
      { id: "n3", label: "Tarpaulin Shelter Kits", supplyId: "tarps",      quantity: 3,  unitCostPhp: 890 },
      { id: "n4", label: "Hygiene Kits",           supplyId: "hygiene",    quantity: 5,  unitCostPhp: 350 },
    ],
  },
  {
    id: "FAM-1078", alias: "Family #FAM-1078", barangay: "Barangay Riverside",
    householdSize: 4, urgency: "moderate", registeredOn: "2026-07-16",
    deliveryStatus: "delivered", amountFundedPhp: 3_850,
    needs: [
      { id: "n1", label: "Emergency Food Packs",  supplyId: "food-packs", quantity: 2, unitCostPhp: 750 },
      { id: "n2", label: "Potable Water (5-gal)", supplyId: "water",      quantity: 5, unitCostPhp: 120 },
    ],
  },
  {
    id: "FAM-1145", alias: "Family #FAM-1145", barangay: "Barangay Sto. Niño",
    householdSize: 6, urgency: "high", registeredOn: "2026-07-20",
    deliveryStatus: "pending", amountFundedPhp: 800,
    needs: [
      { id: "n1", label: "Solar Lanterns",         supplyId: "solar",      quantity: 3, unitCostPhp: 640 },
      { id: "n2", label: "Hygiene Kits",           supplyId: "hygiene",    quantity: 4, unitCostPhp: 350 },
      { id: "n3", label: "Emergency Food Packs",   supplyId: "food-packs", quantity: 5, unitCostPhp: 750 },
    ],
  },
  {
    id: "FAM-1201", alias: "Family #FAM-1201", barangay: "Barangay Mabini",
    householdSize: 5, urgency: "critical", registeredOn: "2026-07-20",
    deliveryStatus: "pending", amountFundedPhp: 0,
    needs: [
      { id: "n1", label: "CGI Roofing Sheets",               supplyId: "roofing",      quantity: 15, unitCostPhp: 480 },
      { id: "n2", label: "Rice (50kg sack)",                 supplyId: "rice",         quantity: 2,  unitCostPhp: 2_650 },
      { id: "n3", label: "Tarpaulin Shelter Kits",           supplyId: "tarps",        quantity: 2,  unitCostPhp: 890 },
      { id: "n4", label: "Water Purification Tablets (x50)", supplyId: "purification", quantity: 8,  unitCostPhp: 95 },
    ],
  },
  {
    id: "FAM-1288", alias: "Family #FAM-1288", barangay: "Barangay Pook",
    householdSize: 3, urgency: "moderate", registeredOn: "2026-07-17",
    deliveryStatus: "in_transit", amountFundedPhp: 1_500,
    needs: [
      { id: "n1", label: "Rice (50kg sack)",   supplyId: "rice",       quantity: 1, unitCostPhp: 2_650 },
      { id: "n2", label: "Hygiene Kits",       supplyId: "hygiene",    quantity: 2, unitCostPhp: 350 },
    ],
  },
  {
    id: "FAM-1355", alias: "Family #FAM-1355", barangay: "Barangay Sta. Cruz",
    householdSize: 8, urgency: "critical", registeredOn: "2026-07-21",
    deliveryStatus: "pending", amountFundedPhp: 0,
    needs: [
      { id: "n1", label: "CGI Roofing Sheets",   supplyId: "roofing",    quantity: 22, unitCostPhp: 480 },
      { id: "n2", label: "Emergency Food Packs", supplyId: "food-packs", quantity: 8,  unitCostPhp: 750 },
      { id: "n3", label: "Tarpaulin Shelter Kits", supplyId: "tarps",    quantity: 4,  unitCostPhp: 890 },
      { id: "n4", label: "Rice (50kg sack)",     supplyId: "rice",       quantity: 3,  unitCostPhp: 2_650 },
    ],
  },
  {
    id: "FAM-1420", alias: "Family #FAM-1420", barangay: "Barangay Bagong Sikat",
    householdSize: 4, urgency: "high", registeredOn: "2026-07-21",
    deliveryStatus: "pending", amountFundedPhp: 600,
    needs: [
      { id: "n1", label: "Potable Water (5-gal)",  supplyId: "water",      quantity: 8,  unitCostPhp: 120 },
      { id: "n2", label: "Hygiene Kits",           supplyId: "hygiene",    quantity: 3,  unitCostPhp: 350 },
      { id: "n3", label: "Solar Lanterns",         supplyId: "solar",      quantity: 2,  unitCostPhp: 640 },
    ],
  },
  {
    id: "FAM-1503", alias: "Family #FAM-1503", barangay: "Barangay Look",
    householdSize: 5, urgency: "moderate", registeredOn: "2026-07-18",
    deliveryStatus: "delivered", amountFundedPhp: 2_750,
    needs: [
      { id: "n1", label: "Emergency Food Packs",  supplyId: "food-packs", quantity: 3, unitCostPhp: 750 },
      { id: "n2", label: "Potable Water (5-gal)", supplyId: "water",      quantity: 4, unitCostPhp: 120 },
    ],
  },
  {
    id: "FAM-1566", alias: "Family #FAM-1566", barangay: "Barangay Tubod",
    householdSize: 6, urgency: "high", registeredOn: "2026-07-22",
    deliveryStatus: "pending", amountFundedPhp: 0,
    needs: [
      { id: "n1", label: "CGI Roofing Sheets",     supplyId: "roofing",    quantity: 10, unitCostPhp: 480 },
      { id: "n2", label: "Tarpaulin Shelter Kits", supplyId: "tarps",      quantity: 2,  unitCostPhp: 890 },
      { id: "n3", label: "Emergency Food Packs",   supplyId: "food-packs", quantity: 5,  unitCostPhp: 750 },
    ],
  },
  {
    id: "FAM-1644", alias: "Family #FAM-1644", barangay: "Barangay Riverside",
    householdSize: 7, urgency: "critical", registeredOn: "2026-07-22",
    deliveryStatus: "pending", amountFundedPhp: 0,
    needs: [
      { id: "n1", label: "Rice (50kg sack)",                 supplyId: "rice",         quantity: 4,  unitCostPhp: 2_650 },
      { id: "n2", label: "CGI Roofing Sheets",               supplyId: "roofing",      quantity: 16, unitCostPhp: 480 },
      { id: "n3", label: "Emergency Food Packs",             supplyId: "food-packs",   quantity: 7,  unitCostPhp: 750 },
      { id: "n4", label: "Tarpaulin Shelter Kits",           supplyId: "tarps",        quantity: 3,  unitCostPhp: 890 },
      { id: "n5", label: "Water Purification Tablets (x50)", supplyId: "purification", quantity: 12, unitCostPhp: 95  },
    ],
  },
  {
    id: "FAM-1722", alias: "Family #FAM-1722", barangay: "Barangay Sto. Niño",
    householdSize: 3, urgency: "moderate", registeredOn: "2026-07-19",
    deliveryStatus: "in_transit", amountFundedPhp: 1_750,
    needs: [
      { id: "n1", label: "Hygiene Kits",         supplyId: "hygiene",    quantity: 2, unitCostPhp: 350 },
      { id: "n2", label: "Solar Lanterns",       supplyId: "solar",      quantity: 1, unitCostPhp: 640 },
    ],
  },
  {
    id: "FAM-1810", alias: "Family #FAM-1810", barangay: "Barangay Mabini",
    householdSize: 5, urgency: "high", registeredOn: "2026-07-23",
    deliveryStatus: "pending", amountFundedPhp: 0,
    needs: [
      { id: "n1", label: "Potable Water (5-gal)",  supplyId: "water",      quantity: 12, unitCostPhp: 120 },
      { id: "n2", label: "Emergency Food Packs",   supplyId: "food-packs", quantity: 4,  unitCostPhp: 750 },
      { id: "n3", label: "Hygiene Kits",           supplyId: "hygiene",    quantity: 3,  unitCostPhp: 350 },
    ],
  },
  {
    id: "FAM-1898", alias: "Family #FAM-1898", barangay: "Barangay Pook",
    householdSize: 4, urgency: "critical", registeredOn: "2026-07-23",
    deliveryStatus: "pending", amountFundedPhp: 0,
    needs: [
      { id: "n1", label: "CGI Roofing Sheets",     supplyId: "roofing",    quantity: 14, unitCostPhp: 480 },
      { id: "n2", label: "Rice (50kg sack)",        supplyId: "rice",       quantity: 2,  unitCostPhp: 2_650 },
      { id: "n3", label: "Tarpaulin Shelter Kits", supplyId: "tarps",      quantity: 2,  unitCostPhp: 890 },
      { id: "n4", label: "Emergency Food Packs",   supplyId: "food-packs", quantity: 5,  unitCostPhp: 750 },
    ],
  },
  {
    id: "FAM-1977", alias: "Family #FAM-1977", barangay: "Barangay Sta. Cruz",
    householdSize: 6, urgency: "high", registeredOn: "2026-07-24",
    deliveryStatus: "pending", amountFundedPhp: 900,
    needs: [
      { id: "n1", label: "Solar Lanterns",         supplyId: "solar",      quantity: 3, unitCostPhp: 640 },
      { id: "n2", label: "Potable Water (5-gal)",  supplyId: "water",      quantity: 9, unitCostPhp: 120 },
      { id: "n3", label: "Emergency Food Packs",   supplyId: "food-packs", quantity: 5, unitCostPhp: 750 },
    ],
  },
  {
    id: "FAM-2055", alias: "Family #FAM-2055", barangay: "Barangay Bagong Sikat",
    householdSize: 8, urgency: "critical", registeredOn: "2026-07-24",
    deliveryStatus: "pending", amountFundedPhp: 0,
    needs: [
      { id: "n1", label: "Rice (50kg sack)",                 supplyId: "rice",         quantity: 4,  unitCostPhp: 2_650 },
      { id: "n2", label: "CGI Roofing Sheets",               supplyId: "roofing",      quantity: 20, unitCostPhp: 480 },
      { id: "n3", label: "Tarpaulin Shelter Kits",           supplyId: "tarps",        quantity: 4,  unitCostPhp: 890 },
      { id: "n4", label: "Emergency Food Packs",             supplyId: "food-packs",   quantity: 8,  unitCostPhp: 750 },
      { id: "n5", label: "Water Purification Tablets (x50)", supplyId: "purification", quantity: 15, unitCostPhp: 95  },
    ],
  },
  {
    id: "FAM-2133", alias: "Family #FAM-2133", barangay: "Barangay Look",
    householdSize: 4, urgency: "moderate", registeredOn: "2026-07-20",
    deliveryStatus: "delivered", amountFundedPhp: 4_500,
    needs: [
      { id: "n1", label: "Hygiene Kits",         supplyId: "hygiene",    quantity: 3, unitCostPhp: 350 },
      { id: "n2", label: "Emergency Food Packs", supplyId: "food-packs", quantity: 2, unitCostPhp: 750 },
    ],
  },
];

// ---------------------------------------------------------------------------
// Derive supplyCategories from family registry
// quantityNeeded = sum of all family needs for that supply
// quantityFunded = proportional share from amountFundedPhp (treated as partially funded)
// ---------------------------------------------------------------------------
function buildSupplyCategories(): SupplyCategory[] {
  return SUPPLY_CATALOGUE.map((cat) => {
    // Aggregate totals across all families for this supply id
    let totalNeeded = 0;
    let totalFunded = 0;

    for (const fam of families) {
      for (const need of fam.needs) {
        if (need.supplyId === cat.id) {
          totalNeeded += need.quantity;
          // credit funded proportionally: amountFundedPhp / totalFamilyCost * this need's cost
          const famTotalCost = fam.needs.reduce((s, n) => s + n.quantity * n.unitCostPhp, 0);
          if (famTotalCost > 0 && fam.amountFundedPhp > 0) {
            const ratio = Math.min(1, fam.amountFundedPhp / famTotalCost);
            totalFunded += need.quantity * ratio;
          }
        }
      }
    }

    return {
      id: cat.id,
      name: cat.name,
      unit: cat.unit as SupplyCategory["unit"],
      icon: cat.icon,
      unitCostPhp: cat.unitCostPhp,
      quantityNeeded: Math.max(1, Math.round(totalNeeded)),
      quantityFunded: Math.round(totalFunded),
    };
  });
}

export const supplyCategories: SupplyCategory[] = buildSupplyCategories();

// ---------------------------------------------------------------------------
// Ledger entries
// ---------------------------------------------------------------------------
export const ledgerEntries: LedgerEntry[] = [
  {
    id: "lg-1", type: "inflow",
    txHash: "a1f9c3e7b6d2408f5c9a1e7d3b8f0c6a4e2d9b7f1c5a8e3d0b6f4a9c2e7d1b58",
    donorAlias: "Malinaw Diaspora Canada Chapter", asset: "USDC",
    assetAmount: 500, phpEquivalent: 29_075, destination: "general_fund",
    timestamp: "2026-07-24T09:12:00+08:00",
  },
  {
    id: "lg-2", type: "outflow",
    txHash: "7d2b9f4a1c6e8305d7b1f9a4c2e6d8b0f3a7c1e9d5b2f8a0c4e7d1b9f6a3c250",
    vendor: "Malinaw Rice Traders Coop",
    purpose: "620 sacks of rice (50kg) for Barangay Look & Tubod distribution",
    phpAmount: 1_643_000,
    receiptImageNote: "Official receipt #OR-22841, signed by MDRRMO",
    deliveryPhotoNote: "Delivery photos: warehouse hand-off, 3 images",
    barangaysServed: ["Barangay Look", "Barangay Tubod"],
    timestamp: "2026-07-23T14:30:00+08:00",
  },
  {
    id: "lg-3", type: "inflow",
    txHash: "3c8e1a5f9b7d2604c8a2e6f1b9d5c3a7e0f4b8d2c6a1e9f5b3d7c0a8e2f6b419",
    donorAlias: "Freighter Wallet ••••9C3D", asset: "XLM",
    assetAmount: 12_500, phpEquivalent: 280_000, destination: "FAM-0422",
    timestamp: "2026-07-23T11:04:00+08:00",
  },
  {
    id: "lg-4", type: "outflow",
    txHash: "f4a0d8b2e6c1937a5d9b3f7e1c5a8d0b4f2e6a9c3d7b1f5a8e2c0d6b4f9a3e17",
    vendor: "Ibayo Hardware & Construction Supply",
    purpose: "1,500 CGI roofing sheets for critical shelter repair",
    phpAmount: 720_000,
    receiptImageNote: "Official receipt #OR-22855, signed by MDRRMO",
    deliveryPhotoNote: "Delivery photos: barangay hall drop-off, 5 images",
    barangaysServed: ["Barangay Bagong Sikat", "Barangay Riverside"],
    timestamp: "2026-07-22T16:45:00+08:00",
  },
  {
    id: "lg-5", type: "inflow",
    txHash: "9e5c2a7f0b4d861e3a7c1f5b9d2e6a0c4f8b2d6e1a9c5f3b7d0e4a8c2f6b1953",
    donorAlias: "Ibayo Rotary Club", asset: "PHPC",
    assetAmount: 150_000, phpEquivalent: 150_000, destination: "general_fund",
    timestamp: "2026-07-22T08:50:00+08:00",
  },
  {
    id: "lg-6", type: "inflow",
    txHash: "6b1f8d3a7c0e492b5d8a1f4c7e0b3d6a9c2f5b8e1d4a7c0f3b6e9d2a5c8f1b40",
    donorAlias: "Anonymous Donor", asset: "XLM",
    assetAmount: 8_900, phpEquivalent: 199_360, destination: "general_fund",
    timestamp: "2026-07-21T19:22:00+08:00",
  },
  {
    id: "lg-7", type: "outflow",
    txHash: "2a6d9c4f1b8e357a0d3b6f9c2e5a8d1b4f7c0e3a6d9b2f5c8e1a4d7b0f3c6935",
    vendor: "Bayanihan Water Refilling Station",
    purpose: "9,600 units of 5-gallon potable water + purification tablets",
    phpAmount: 1_152_000,
    receiptImageNote: "Official receipt #OR-22849, signed by MDRRMO",
    deliveryPhotoNote: "Delivery photos: tanker unloading, 4 images",
    barangaysServed: ["Barangay Look", "Barangay Sto. Niño", "Barangay Riverside"],
    timestamp: "2026-07-21T10:15:00+08:00",
  },
  {
    id: "lg-8", type: "inflow",
    txHash: "d0f7a3c9e2b5148d6a0c3f7b1e4d8a2c5f9b3e6d0a4c7f1b8e2d5a9c3f6b0417",
    donorAlias: "Freighter Wallet ••••4F2A", asset: "USDC",
    assetAmount: 200, phpEquivalent: 11_630, destination: "FAM-0510",
    timestamp: "2026-07-20T13:08:00+08:00",
  },
  {
    id: "lg-9", type: "outflow",
    txHash: "8c3f0a6d9b2e5147c0a3d6f9b2e5c8a1d4f7b0e3c6a9d2f5b8e1c4a7d0f3b625",
    vendor: "Kalinaw Medical Pharmacy",
    purpose: "Hygiene kits and first-aid supplies for 1,672 households",
    phpAmount: 585_200,
    receiptImageNote: "Official receipt #OR-22862, signed by MDRRMO",
    deliveryPhotoNote: "Delivery photos: barangay health center, 6 images",
    barangaysServed: ["Barangay Tubod", "Barangay Bagong Sikat"],
    timestamp: "2026-07-19T15:40:00+08:00",
  },
  {
    id: "lg-10", type: "inflow",
    txHash: "5b9e2c6a0d3f847b1a4d7c0f3b6e9a2d5c8f1b4e7a0d3c6f9b2e5a8d1c4f7b30",
    donorAlias: "Malinaw Young Professionals Network", asset: "XLM",
    assetAmount: 22_000, phpEquivalent: 492_800, destination: "general_fund",
    timestamp: "2026-07-19T09:30:00+08:00",
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
export function getTotalNeededPhp(): number {
  return supplyCategories.reduce((s, c) => s + c.unitCostPhp * c.quantityNeeded, 0);
}

export function getTotalFundedPhp(): number {
  return supplyCategories.reduce((s, c) => s + c.unitCostPhp * c.quantityFunded, 0);
}

/** Total cost of all unfunded family needs (the "true" shortfall to donors). */
export function getFamilyRegistryShortfallPhp(
  extraFundedByFamily: Record<string, number> = {},
): number {
  return families.reduce((sum, fam) => {
    const totalCost = getFamilyTotalCostPhp(fam);
    const baseFunded = fam.amountFundedPhp;
    const extraFunded = extraFundedByFamily[fam.id] ?? 0;
    const funded = Math.min(totalCost, baseFunded + extraFunded);
    return sum + Math.max(0, totalCost - funded);
  }, 0);
}

export function getShortfallPhp(): number {
  return Math.max(
    0,
    getTotalNeededPhp() - getTotalFundedPhp() - calamitySummary.lguFundAllocatedPhp,
  );
}

export function getFamilyTotalCostPhp(family: Family): number {
  return family.needs.reduce((s, n) => s + n.quantity * n.unitCostPhp, 0);
}
