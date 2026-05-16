import { CartPanel } from "@/features/pos/cart-panel";
import { MobileCartTrigger } from "@/features/pos/mobile-cart-trigger";
import { ProductGrid } from "@/features/pos/product-grid";

export const metadata = { title: "Point of Sale" };

export default function PosPage() {
  return (
    <div className="-mx-3 -my-4 grid h-[calc(100dvh-4rem)] grid-cols-1 overflow-hidden border-y border-border/70 bg-background md:-mx-6 md:-my-6 md:h-[calc(100dvh-3.5rem)] md:grid-cols-[1fr_360px] md:rounded-2xl md:border md:bg-card lg:grid-cols-[1fr_400px]">
      <section className="min-h-0 overflow-hidden bg-surface-1">
        <ProductGrid />
      </section>
      <aside className="hidden min-h-0 overflow-hidden border-s border-border/60 md:block">
        <CartPanel />
      </aside>
      <MobileCartTrigger />
    </div>
  );
}
