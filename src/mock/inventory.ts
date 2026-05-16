import type { InventoryItem, Supplier } from "@/types";

export const SUPPLIERS: Supplier[] = [
  { id: "sup_blue", name: "Bluestone Coffee Roasters", contact: "Naomi Park", email: "naomi@bluestone.co", phone: "+1 510 555 0190", itemsSupplied: 12, rating: 4.8 },
  { id: "sup_dairy", name: "Valley Dairy Co.", contact: "Marcus Lee", email: "marcus@valleydairy.com", phone: "+1 510 555 0140", itemsSupplied: 8, rating: 4.6 },
  { id: "sup_bake", name: "Sweetcrumb Bakery", contact: "Priya Anand", email: "priya@sweetcrumb.com", phone: "+1 510 555 0121", itemsSupplied: 14, rating: 4.7 },
  { id: "sup_farm", name: "Greenfield Farms", contact: "Theo Walker", email: "theo@greenfield.com", phone: "+1 510 555 0133", itemsSupplied: 18, rating: 4.5 },
  { id: "sup_pkg", name: "Northwind Packaging", contact: "Hannah Brooks", email: "hannah@northwind.co", phone: "+1 510 555 0155", itemsSupplied: 6, rating: 4.4 },
];

function daysAgo(n: number) {
  return new Date(Date.now() - n * 86400_000).toISOString();
}
function daysAhead(n: number) {
  return new Date(Date.now() + n * 86400_000).toISOString();
}

export const INVENTORY: InventoryItem[] = [
  { id: "inv_001", name: "Espresso beans — house blend", sku: "BEAN-HSB", category: "Coffee", unit: "kg", stock: 18.4, reorderLevel: 8, costPerUnit: 24.5, supplierId: "sup_blue", lastRestocked: daysAgo(4) },
  { id: "inv_002", name: "Espresso beans — decaf", sku: "BEAN-DEC", category: "Coffee", unit: "kg", stock: 3.2, reorderLevel: 4, costPerUnit: 26.0, supplierId: "sup_blue", lastRestocked: daysAgo(10) },
  { id: "inv_003", name: "Single origin — Ethiopia", sku: "BEAN-ETH", category: "Coffee", unit: "kg", stock: 2.1, reorderLevel: 3, costPerUnit: 32.0, supplierId: "sup_blue", lastRestocked: daysAgo(7) },
  { id: "inv_004", name: "Whole milk", sku: "DRY-WMK", category: "Dairy", unit: "L", stock: 24, reorderLevel: 18, costPerUnit: 2.1, supplierId: "sup_dairy", lastRestocked: daysAgo(1), expiresAt: daysAhead(5) },
  { id: "inv_005", name: "Oat milk", sku: "DRY-OMK", category: "Dairy", unit: "L", stock: 8, reorderLevel: 12, costPerUnit: 3.4, supplierId: "sup_dairy", lastRestocked: daysAgo(3), expiresAt: daysAhead(10) },
  { id: "inv_006", name: "Almond milk", sku: "DRY-AMK", category: "Dairy", unit: "L", stock: 14, reorderLevel: 10, costPerUnit: 3.6, supplierId: "sup_dairy", lastRestocked: daysAgo(2), expiresAt: daysAhead(12) },
  { id: "inv_007", name: "Soy milk", sku: "DRY-SMK", category: "Dairy", unit: "L", stock: 11, reorderLevel: 8, costPerUnit: 3.1, supplierId: "sup_dairy", lastRestocked: daysAgo(2), expiresAt: daysAhead(14) },
  { id: "inv_008", name: "Granulated sugar", sku: "DRY-SGR", category: "Pantry", unit: "kg", stock: 22, reorderLevel: 10, costPerUnit: 1.2, supplierId: "sup_farm", lastRestocked: daysAgo(15) },
  { id: "inv_009", name: "Vanilla syrup", sku: "DRY-VNS", category: "Syrups", unit: "ml", stock: 4200, reorderLevel: 2000, costPerUnit: 0.012, supplierId: "sup_farm", lastRestocked: daysAgo(6) },
  { id: "inv_010", name: "Caramel syrup", sku: "DRY-CRS", category: "Syrups", unit: "ml", stock: 950, reorderLevel: 2000, costPerUnit: 0.012, supplierId: "sup_farm", lastRestocked: daysAgo(20) },
  { id: "inv_011", name: "Hazelnut syrup", sku: "DRY-HZS", category: "Syrups", unit: "ml", stock: 3100, reorderLevel: 2000, costPerUnit: 0.013, supplierId: "sup_farm", lastRestocked: daysAgo(9) },
  { id: "inv_012", name: "Almond croissants", sku: "BAK-ACR", category: "Bakery", unit: "pcs", stock: 12, reorderLevel: 20, costPerUnit: 1.8, supplierId: "sup_bake", lastRestocked: daysAgo(1), expiresAt: daysAhead(2) },
  { id: "inv_013", name: "Butter croissants", sku: "BAK-BCR", category: "Bakery", unit: "pcs", stock: 18, reorderLevel: 24, costPerUnit: 1.4, supplierId: "sup_bake", lastRestocked: daysAgo(1), expiresAt: daysAhead(2) },
  { id: "inv_014", name: "Pain au chocolat", sku: "BAK-PAC", category: "Bakery", unit: "pcs", stock: 7, reorderLevel: 18, costPerUnit: 1.7, supplierId: "sup_bake", lastRestocked: daysAgo(1), expiresAt: daysAhead(2) },
  { id: "inv_015", name: "Sourdough loaves", sku: "BAK-SDL", category: "Bakery", unit: "pcs", stock: 6, reorderLevel: 8, costPerUnit: 4.5, supplierId: "sup_bake", lastRestocked: daysAgo(1), expiresAt: daysAhead(3) },
  { id: "inv_016", name: "Avocados", sku: "PRD-AVC", category: "Produce", unit: "pcs", stock: 36, reorderLevel: 18, costPerUnit: 1.1, supplierId: "sup_farm", lastRestocked: daysAgo(2), expiresAt: daysAhead(4) },
  { id: "inv_017", name: "Tomatoes", sku: "PRD-TOM", category: "Produce", unit: "kg", stock: 4.2, reorderLevel: 3, costPerUnit: 3.2, supplierId: "sup_farm", lastRestocked: daysAgo(2), expiresAt: daysAhead(5) },
  { id: "inv_018", name: "Mixed berries", sku: "PRD-BRY", category: "Produce", unit: "kg", stock: 1.6, reorderLevel: 2, costPerUnit: 8.5, supplierId: "sup_farm", lastRestocked: daysAgo(2), expiresAt: daysAhead(3) },
  { id: "inv_019", name: "12oz paper cups", sku: "PKG-CP12", category: "Packaging", unit: "box", stock: 14, reorderLevel: 8, costPerUnit: 28, supplierId: "sup_pkg", lastRestocked: daysAgo(30) },
  { id: "inv_020", name: "16oz paper cups", sku: "PKG-CP16", category: "Packaging", unit: "box", stock: 5, reorderLevel: 8, costPerUnit: 32, supplierId: "sup_pkg", lastRestocked: daysAgo(45) },
  { id: "inv_021", name: "Cup lids", sku: "PKG-LID", category: "Packaging", unit: "box", stock: 22, reorderLevel: 10, costPerUnit: 16, supplierId: "sup_pkg", lastRestocked: daysAgo(20) },
  { id: "inv_022", name: "Napkins", sku: "PKG-NPK", category: "Packaging", unit: "box", stock: 38, reorderLevel: 20, costPerUnit: 12, supplierId: "sup_pkg", lastRestocked: daysAgo(40) },
  { id: "inv_023", name: "Matcha powder", sku: "DRY-MTC", category: "Pantry", unit: "g", stock: 320, reorderLevel: 200, costPerUnit: 0.18, supplierId: "sup_blue", lastRestocked: daysAgo(18) },
  { id: "inv_024", name: "Chocolate syrup", sku: "DRY-CHS", category: "Syrups", unit: "ml", stock: 2400, reorderLevel: 1500, costPerUnit: 0.011, supplierId: "sup_farm", lastRestocked: daysAgo(12) },
];

export const STOCK_TREND_7D = [
  { day: "Mon", value: 412 },
  { day: "Tue", value: 405 },
  { day: "Wed", value: 396 },
  { day: "Thu", value: 414 },
  { day: "Fri", value: 388 },
  { day: "Sat", value: 372 },
  { day: "Sun", value: 358 },
];
