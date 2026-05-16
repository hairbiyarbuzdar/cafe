import { CartPanel } from "@/features/pos/cart-panel";
import { ProductGrid } from "@/features/pos/product-grid";

export const metadata = { title: "Point of Sale" };

export default function PosPage() {
  return (
    <div className="-mx-3 -my-4 grid h-[calc(100dvh-3.5rem)] grid-cols-1 overflow-hidden border-y bg-background md:-mx-6 md:-my-6 md:grid-cols-[1fr_360px] md:border-x lg:grid-cols-[1fr_400px]">
      <section className="min-h-0 overflow-hidden bg-surface-1">
        <ProductGrid />
      </section>
      <section className="min-h-0 overflow-hidden border-t md:border-s md:border-t-0">
        <CartPanel />
      </section>
    </div>
  );
}
