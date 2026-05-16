import {
  Cake,
  Coffee,
  Croissant,
  GlassWater,
  Leaf,
  Salad,
  Sparkles,
  Wheat,
  type LucideIcon,
} from "lucide-react";

/**
 * Maps a product `categoryId` to a lucide icon used for the
 * product-card image placeholder. Keep the set tight so the grid
 * reads visually consistent.
 */
export const CATEGORY_ICON: Record<string, LucideIcon> = {
  cat_espresso: Coffee,
  cat_brew: Coffee,
  cat_specialty: Sparkles,
  cat_tea: Leaf,
  cat_cold: GlassWater,
  cat_pastry: Croissant,
  cat_bites: Salad,
  cat_dessert: Cake,
};

export function getCategoryIcon(categoryId: string): LucideIcon {
  return CATEGORY_ICON[categoryId] ?? Wheat;
}
