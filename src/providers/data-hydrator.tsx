"use client";

import * as React from "react";

import { useCategories } from "@/store/categories-store";
import { useInventory } from "@/store/inventory-store";
import { useMenu } from "@/store/menu-store";
import { useStations } from "@/store/stations-store";
import { useTables } from "@/store/tables-store";
import type {
  Category,
  InventoryItem,
  KitchenStation,
  MenuItem,
  Table,
} from "@/types";

/**
 * One-shot store hydration.
 *
 * The (app) layout server-fetches the menu, stations, and categories
 * from Postgres and renders this component once. It dumps those
 * server-rendered lists into the matching Zustand stores so client
 * components can keep their existing `useMenu()` / `useStations()`
 * / `useCategories()` calls without each one needing a fetch hook.
 */
export function DataHydrator({
  items,
  stations,
  categories,
  inventory,
  tables,
}: {
  items: MenuItem[];
  stations: KitchenStation[];
  categories: Category[];
  inventory: InventoryItem[];
  tables: Table[];
}) {
  React.useEffect(() => {
    useMenu.getState().hydrate(items);
  }, [items]);
  React.useEffect(() => {
    useStations.getState().hydrate(stations);
  }, [stations]);
  React.useEffect(() => {
    useCategories.getState().hydrate(categories);
  }, [categories]);
  React.useEffect(() => {
    useInventory.getState().hydrate(inventory);
  }, [inventory]);
  React.useEffect(() => {
    useTables.getState().hydrate(tables);
  }, [tables]);
  return null;
}
