import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-24 text-center sm:px-6 lg:px-8">
      <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
        AI-Powered PC Hardware Store
      </p>
      <h1 className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
        Build the right PC, with confidence.
      </h1>
      <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
        Browse thousands of components, check part-by-part compatibility automatically,
        and ask our AI assistant anything — from &ldquo;a gaming PC under $1500&rdquo; to
        &ldquo;what is CAS latency?&rdquo;
      </p>
      <div className="mx-auto flex flex-col gap-3 sm:flex-row">
        <Link href="/products" className={buttonVariants({ size: "lg" })}>
          Browse Components
        </Link>
        <Link href="/builder" className={buttonVariants({ size: "lg", variant: "outline" })}>
          Start a PC Build
        </Link>
      </div>
      <p className="mx-auto pt-8 text-sm text-muted-foreground">
        Catalog, cart, and AI features are being built layer by layer — check back soon.
      </p>
    </div>
  );
}
