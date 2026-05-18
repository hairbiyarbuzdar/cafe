import type { KitchenStation } from "@/types";

/**
 * Default stations for a café-style restaurant. The Menu module's
 * station picker reads this list at first run, then the persisted
 * stations-store takes over.
 */
export const KITCHEN_STATIONS: KitchenStation[] = [
  {
    id: "stn_espresso",
    name: "Espresso Bar",
    printer: "KDS-1",
    active: true,
    color: "#6F4E37",
  },
  {
    id: "stn_brew",
    name: "Brew Bar",
    printer: "KDS-1",
    active: true,
    color: "#8B5E3C",
  },
  {
    id: "stn_cold",
    name: "Cold Bar",
    printer: "KDS-2",
    active: true,
    color: "#3B82F6",
  },
  {
    id: "stn_tea",
    name: "Tea Counter",
    printer: "KDS-2",
    active: true,
    color: "#4F7942",
  },
  {
    id: "stn_pastry",
    name: "Pastry Counter",
    printer: "KDS-3",
    active: true,
    color: "#D4A24C",
  },
  {
    id: "stn_kitchen",
    name: "Kitchen",
    printer: "KDS-4",
    active: true,
    color: "#C2410C",
  },
];

export const DEFAULT_STATION_ID = "stn_kitchen";
