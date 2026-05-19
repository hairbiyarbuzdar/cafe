import type { MenuItem, ProductModifier } from "@/types";

/** Maps a menu category to its kitchen station for seed data. */
export const CATEGORY_STATION_MAP: Record<string, string> = {
  cat_espresso: "stn_espresso",
  cat_brew: "stn_brew",
  cat_specialty: "stn_espresso",
  cat_tea: "stn_tea",
  cat_cold: "stn_cold",
  cat_pastry: "stn_pastry",
  cat_bites: "stn_kitchen",
  cat_dessert: "stn_pastry",
};

const SIZE_MODS: ProductModifier[] = [
  { id: "size_s", name: "Small", priceDelta: -0.5 },
  { id: "size_m", name: "Medium", priceDelta: 0 },
  { id: "size_l", name: "Large", priceDelta: 0.75 },
];

const MILK_MODS: ProductModifier[] = [
  { id: "milk_whole", name: "Whole milk", priceDelta: 0 },
  { id: "milk_oat", name: "Oat milk", priceDelta: 0.6 },
  { id: "milk_almond", name: "Almond milk", priceDelta: 0.6 },
  { id: "milk_soy", name: "Soy milk", priceDelta: 0.5 },
];

type Seed = Omit<MenuItem, "stationId" | "posVisible"> & {
  stationId?: string;
  posVisible?: boolean;
};

function finalize(items: Seed[]): MenuItem[] {
  return items.map((i) => ({
    ...i,
    posVisible: i.posVisible ?? true,
    stationId: i.stationId ?? CATEGORY_STATION_MAP[i.categoryId] ?? "stn_kitchen",
  }));
}

export const MENU_ITEMS: MenuItem[] = finalize([
  // Espresso
  { id: "m_001", name: "Espresso", description: "Single shot, rich and balanced", categoryId: "cat_espresso", price: 3.25, sku: "ESP-001", available: true, popular: true, prepTimeMinutes: 2, modifiers: SIZE_MODS,
    recipe: [{ inventoryItemId: "inv_001", quantity: 0.009, unit: "kg" }] },
  { id: "m_002", name: "Double Espresso", description: "Two shots, intense flavor", categoryId: "cat_espresso", price: 4.0, sku: "ESP-002", available: true, prepTimeMinutes: 3, modifiers: SIZE_MODS,
    recipe: [{ inventoryItemId: "inv_001", quantity: 0.018, unit: "kg" }] },
  { id: "m_003", name: "Americano", description: "Espresso with hot water", categoryId: "cat_espresso", price: 3.75, sku: "ESP-003", available: true, popular: true, prepTimeMinutes: 3, modifiers: [...SIZE_MODS, ...MILK_MODS],
    recipe: [{ inventoryItemId: "inv_001", quantity: 0.009, unit: "kg" }] },
  { id: "m_004", name: "Cappuccino", description: "Espresso, steamed milk, foam", categoryId: "cat_espresso", price: 4.5, sku: "ESP-004", available: true, popular: true, prepTimeMinutes: 4, modifiers: [...SIZE_MODS, ...MILK_MODS],
    recipe: [
      { inventoryItemId: "inv_001", quantity: 0.009, unit: "kg" },
      { inventoryItemId: "inv_004", quantity: 0.15, unit: "L" },
    ] },
  { id: "m_005", name: "Latte", description: "Espresso with steamed milk", categoryId: "cat_espresso", price: 4.75, sku: "ESP-005", available: true, popular: true, prepTimeMinutes: 4, modifiers: [...SIZE_MODS, ...MILK_MODS],
    recipe: [
      { inventoryItemId: "inv_001", quantity: 0.009, unit: "kg" },
      { inventoryItemId: "inv_004", quantity: 0.22, unit: "L" },
    ] },
  { id: "m_006", name: "Flat White", description: "Velvety microfoam", categoryId: "cat_espresso", price: 4.5, sku: "ESP-006", available: true, prepTimeMinutes: 4, modifiers: [...SIZE_MODS, ...MILK_MODS] },
  { id: "m_007", name: "Macchiato", description: "Espresso marked with foam", categoryId: "cat_espresso", price: 4.25, sku: "ESP-007", available: true, prepTimeMinutes: 3, modifiers: SIZE_MODS },
  { id: "m_008", name: "Mocha", description: "Espresso with chocolate and milk", categoryId: "cat_espresso", price: 5.25, sku: "ESP-008", available: true, prepTimeMinutes: 5, modifiers: [...SIZE_MODS, ...MILK_MODS] },

  // Brewed
  { id: "m_010", name: "Drip Coffee", description: "House blend, freshly brewed", categoryId: "cat_brew", price: 3.0, sku: "BRW-010", available: true, popular: true, prepTimeMinutes: 2, modifiers: SIZE_MODS,
    recipe: [{ inventoryItemId: "inv_001", quantity: 0.012, unit: "kg" }] },
  { id: "m_011", name: "Pour Over", description: "Single origin, hand brewed", categoryId: "cat_brew", price: 5.5, sku: "BRW-011", available: true, prepTimeMinutes: 6, modifiers: SIZE_MODS },
  { id: "m_012", name: "French Press", description: "Full bodied, immersive brew", categoryId: "cat_brew", price: 5.0, sku: "BRW-012", available: true, prepTimeMinutes: 5, modifiers: SIZE_MODS },
  { id: "m_013", name: "Cold Brew", description: "Slow steeped 16 hours", categoryId: "cat_brew", price: 4.75, sku: "BRW-013", available: true, popular: true, prepTimeMinutes: 2, modifiers: SIZE_MODS },
  { id: "m_014", name: "Nitro Cold Brew", description: "Creamy nitrogen infused", categoryId: "cat_brew", price: 5.5, sku: "BRW-014", available: true, prepTimeMinutes: 2, modifiers: SIZE_MODS },
  { id: "m_015", name: "Decaf Drip", description: "Decaffeinated house blend", categoryId: "cat_brew", price: 3.0, sku: "BRW-015", available: true, prepTimeMinutes: 2, modifiers: SIZE_MODS },

  // Specialty (route to espresso bar)
  { id: "m_020", name: "Caramel Macchiato", description: "Vanilla, espresso, caramel", categoryId: "cat_specialty", price: 5.75, sku: "SPC-020", available: true, popular: true, prepTimeMinutes: 5, modifiers: [...SIZE_MODS, ...MILK_MODS] },
  { id: "m_021", name: "Vanilla Latte", description: "Smooth vanilla finish", categoryId: "cat_specialty", price: 5.25, sku: "SPC-021", available: true, prepTimeMinutes: 4, modifiers: [...SIZE_MODS, ...MILK_MODS] },
  { id: "m_022", name: "Hazelnut Latte", description: "Toasted hazelnut", categoryId: "cat_specialty", price: 5.25, sku: "SPC-022", available: true, prepTimeMinutes: 4, modifiers: [...SIZE_MODS, ...MILK_MODS] },
  { id: "m_023", name: "Affogato", description: "Vanilla gelato + espresso", categoryId: "cat_specialty", price: 6.0, sku: "SPC-023", available: true, prepTimeMinutes: 3, modifiers: [] },
  { id: "m_024", name: "Spiced Chai Latte", description: "Black tea, milk, spices", categoryId: "cat_specialty", price: 4.95, sku: "SPC-024", available: true, prepTimeMinutes: 4, modifiers: [...SIZE_MODS, ...MILK_MODS] },
  { id: "m_025", name: "Matcha Latte", description: "Ceremonial matcha + milk", categoryId: "cat_specialty", price: 5.5, sku: "SPC-025", available: true, popular: true, prepTimeMinutes: 4, modifiers: [...SIZE_MODS, ...MILK_MODS] },
  { id: "m_026", name: "Dirty Chai", description: "Chai with a shot of espresso", categoryId: "cat_specialty", price: 5.75, sku: "SPC-026", available: false, prepTimeMinutes: 4, modifiers: [...SIZE_MODS, ...MILK_MODS] },

  // Tea
  { id: "m_030", name: "Earl Grey", description: "Bergamot black tea", categoryId: "cat_tea", price: 3.5, sku: "TEA-030", available: true, prepTimeMinutes: 3, modifiers: SIZE_MODS },
  { id: "m_031", name: "English Breakfast", description: "Classic morning blend", categoryId: "cat_tea", price: 3.5, sku: "TEA-031", available: true, prepTimeMinutes: 3, modifiers: SIZE_MODS },
  { id: "m_032", name: "Green Tea", description: "Sencha leaf", categoryId: "cat_tea", price: 3.5, sku: "TEA-032", available: true, prepTimeMinutes: 3, modifiers: SIZE_MODS },
  { id: "m_033", name: "Chamomile", description: "Caffeine-free herbal", categoryId: "cat_tea", price: 3.5, sku: "TEA-033", available: true, prepTimeMinutes: 4, modifiers: SIZE_MODS },
  { id: "m_034", name: "Peppermint", description: "Cool herbal infusion", categoryId: "cat_tea", price: 3.5, sku: "TEA-034", available: true, prepTimeMinutes: 4, modifiers: SIZE_MODS },
  { id: "m_035", name: "Jasmine Green", description: "Floral and delicate", categoryId: "cat_tea", price: 4.0, sku: "TEA-035", available: true, prepTimeMinutes: 4, modifiers: SIZE_MODS },
  { id: "m_036", name: "Rooibos", description: "South African red tea", categoryId: "cat_tea", price: 3.75, sku: "TEA-036", available: true, prepTimeMinutes: 4, modifiers: SIZE_MODS },
  { id: "m_037", name: "Iced Tea", description: "House brewed, cold served", categoryId: "cat_tea", price: 3.95, sku: "TEA-037", available: true, prepTimeMinutes: 2, modifiers: SIZE_MODS },
  { id: "m_038", name: "Matcha Tea", description: "Pure ceremonial matcha", categoryId: "cat_tea", price: 4.5, sku: "TEA-038", available: true, prepTimeMinutes: 4, modifiers: SIZE_MODS },

  // Cold
  { id: "m_040", name: "Iced Latte", description: "Espresso, milk, ice", categoryId: "cat_cold", price: 4.95, sku: "CLD-040", available: true, popular: true, prepTimeMinutes: 3, modifiers: [...SIZE_MODS, ...MILK_MODS] },
  { id: "m_041", name: "Iced Mocha", description: "Chocolate iced espresso", categoryId: "cat_cold", price: 5.5, sku: "CLD-041", available: true, prepTimeMinutes: 4, modifiers: [...SIZE_MODS, ...MILK_MODS] },
  { id: "m_042", name: "Iced Americano", description: "Espresso, water, ice", categoryId: "cat_cold", price: 3.95, sku: "CLD-042", available: true, prepTimeMinutes: 2, modifiers: SIZE_MODS },
  { id: "m_043", name: "Lemonade", description: "Fresh squeezed", categoryId: "cat_cold", price: 4.25, sku: "CLD-043", available: true, prepTimeMinutes: 3, modifiers: SIZE_MODS },
  { id: "m_044", name: "Fruit Smoothie", description: "Berry blend", categoryId: "cat_cold", price: 5.75, sku: "CLD-044", available: true, prepTimeMinutes: 4, modifiers: SIZE_MODS },
  { id: "m_045", name: "Frappé", description: "Blended iced coffee", categoryId: "cat_cold", price: 5.25, sku: "CLD-045", available: true, popular: true, prepTimeMinutes: 4, modifiers: [...SIZE_MODS, ...MILK_MODS] },
  { id: "m_046", name: "Sparkling Water", description: "Bottled, 330ml", categoryId: "cat_cold", price: 2.5, sku: "CLD-046", available: true, prepTimeMinutes: 1, modifiers: [] },
  { id: "m_047", name: "Orange Juice", description: "Fresh pressed", categoryId: "cat_cold", price: 4.5, sku: "CLD-047", available: true, prepTimeMinutes: 3, modifiers: [] },

  // Pastries
  { id: "m_050", name: "Almond Croissant", description: "Flaky, frangipane filled", categoryId: "cat_pastry", price: 4.25, sku: "PST-050", available: true, popular: true, prepTimeMinutes: 2, modifiers: [],
    recipe: [{ inventoryItemId: "inv_012", quantity: 1, unit: "pcs" }] },
  { id: "m_051", name: "Butter Croissant", description: "Classic French", categoryId: "cat_pastry", price: 3.5, sku: "PST-051", available: true, prepTimeMinutes: 2, modifiers: [],
    recipe: [{ inventoryItemId: "inv_013", quantity: 1, unit: "pcs" }] },
  { id: "m_052", name: "Pain au Chocolat", description: "Dark chocolate batons", categoryId: "cat_pastry", price: 3.95, sku: "PST-052", available: true, prepTimeMinutes: 2, modifiers: [] },
  { id: "m_053", name: "Blueberry Muffin", description: "Wild blueberries", categoryId: "cat_pastry", price: 3.75, sku: "PST-053", available: true, prepTimeMinutes: 1, modifiers: [] },
  { id: "m_054", name: "Banana Bread", description: "Walnut topped slice", categoryId: "cat_pastry", price: 3.95, sku: "PST-054", available: true, prepTimeMinutes: 1, modifiers: [] },
  { id: "m_055", name: "Cinnamon Roll", description: "Warm, glazed", categoryId: "cat_pastry", price: 4.5, sku: "PST-055", available: true, popular: true, prepTimeMinutes: 3, modifiers: [] },
  { id: "m_056", name: "Scone", description: "Cranberry orange", categoryId: "cat_pastry", price: 3.5, sku: "PST-056", available: true, prepTimeMinutes: 2, modifiers: [] },
  { id: "m_057", name: "Danish", description: "Cream cheese", categoryId: "cat_pastry", price: 4.0, sku: "PST-057", available: false, prepTimeMinutes: 2, modifiers: [] },
  { id: "m_058", name: "Bagel", description: "Toasted, with butter", categoryId: "cat_pastry", price: 3.25, sku: "PST-058", available: true, prepTimeMinutes: 3, modifiers: [] },
  { id: "m_059", name: "Bagel & Cream Cheese", description: "Toasted with spread", categoryId: "cat_pastry", price: 4.5, sku: "PST-059", available: true, prepTimeMinutes: 3, modifiers: [] },
  { id: "m_05A", name: "Macarons (3)", description: "Assorted flavors", categoryId: "cat_pastry", price: 6.75, sku: "PST-05A", available: true, prepTimeMinutes: 1, modifiers: [] },

  // Light bites — kitchen
  { id: "m_060", name: "Avocado Toast", description: "Sourdough, chili flakes", categoryId: "cat_bites", price: 9.5, sku: "BTS-060", available: true, popular: true, prepTimeMinutes: 6, modifiers: [],
    recipe: [
      { inventoryItemId: "inv_015", quantity: 0.12, unit: "pcs" },
      { inventoryItemId: "inv_016", quantity: 1, unit: "pcs" },
    ] },
  { id: "m_061", name: "Smoked Salmon Bagel", description: "Cream cheese, capers", categoryId: "cat_bites", price: 12.5, sku: "BTS-061", available: true, prepTimeMinutes: 7, modifiers: [] },
  { id: "m_062", name: "Quiche Lorraine", description: "Bacon and gruyère", categoryId: "cat_bites", price: 7.95, sku: "BTS-062", available: true, prepTimeMinutes: 6, modifiers: [] },
  { id: "m_063", name: "Caprese Panini", description: "Mozzarella, tomato, basil", categoryId: "cat_bites", price: 9.25, sku: "BTS-063", available: true, prepTimeMinutes: 8, modifiers: [] },
  { id: "m_064", name: "Turkey Club Sandwich", description: "Triple decker", categoryId: "cat_bites", price: 11.5, sku: "BTS-064", available: true, prepTimeMinutes: 8, modifiers: [] },
  { id: "m_065", name: "Greek Salad", description: "Feta, olives, vinaigrette", categoryId: "cat_bites", price: 10.95, sku: "BTS-065", available: true, prepTimeMinutes: 6, modifiers: [] },
  { id: "m_066", name: "Soup of the Day", description: "Ask your barista", categoryId: "cat_bites", price: 6.95, sku: "BTS-066", available: true, prepTimeMinutes: 4, modifiers: [] },
  { id: "m_067", name: "Granola Bowl", description: "Yogurt, fruit, honey", categoryId: "cat_bites", price: 8.5, sku: "BTS-067", available: true, prepTimeMinutes: 4, modifiers: [] },
  { id: "m_068", name: "Breakfast Wrap", description: "Egg, cheese, spinach", categoryId: "cat_bites", price: 8.95, sku: "BTS-068", available: true, prepTimeMinutes: 7, modifiers: [] },

  // Desserts (route to pastry counter)
  { id: "m_070", name: "Tiramisu", description: "Classic Italian", categoryId: "cat_dessert", price: 6.5, sku: "DST-070", available: true, popular: true, prepTimeMinutes: 2, modifiers: [] },
  { id: "m_071", name: "Chocolate Brownie", description: "Fudgy, walnut", categoryId: "cat_dessert", price: 4.5, sku: "DST-071", available: true, prepTimeMinutes: 1, modifiers: [] },
  { id: "m_072", name: "Cheesecake", description: "New York style", categoryId: "cat_dessert", price: 5.95, sku: "DST-072", available: true, prepTimeMinutes: 1, modifiers: [] },
  { id: "m_073", name: "Lemon Tart", description: "Buttery shortcrust", categoryId: "cat_dessert", price: 5.5, sku: "DST-073", available: true, prepTimeMinutes: 1, modifiers: [] },
  { id: "m_074", name: "Carrot Cake", description: "Cream cheese frosting", categoryId: "cat_dessert", price: 5.25, sku: "DST-074", available: true, prepTimeMinutes: 1, modifiers: [] },
  { id: "m_075", name: "Cookies (2)", description: "Chocolate chip", categoryId: "cat_dessert", price: 3.5, sku: "DST-075", available: true, prepTimeMinutes: 1, modifiers: [] },
  { id: "m_076", name: "Gelato", description: "Two scoops", categoryId: "cat_dessert", price: 5.75, sku: "DST-076", available: true, prepTimeMinutes: 2, modifiers: [] },
]);
