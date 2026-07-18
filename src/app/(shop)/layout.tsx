import { CompareBar } from "@/components/product/compare-bar";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <div className="flex-1">{children}</div>
      <CompareBar />
    </div>
  );
}
