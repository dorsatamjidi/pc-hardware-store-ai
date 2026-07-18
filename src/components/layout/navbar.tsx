import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { auth } from "@/lib/auth";
import { getCartItemCount } from "@/server/cart/cart-service";
import { buttonVariants } from "@/components/ui/button";
import { UserMenu } from "@/components/layout/user-menu";
import { SearchBox } from "@/components/product/search-box";
import { MobileNav } from "@/components/layout/mobile-nav";

export async function Navbar() {
  const session = await auth();
  const cartItemCount = session?.user ? await getCartItemCount(session.user.id) : 0;

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <MobileNav />
        <Link
          href="/"
          aria-label="ForgePC home"
          className="flex shrink-0 items-center gap-2 font-heading text-lg font-semibold tracking-tight"
        >
          <span aria-hidden className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            F
          </span>
          <span className="hidden sm:inline">ForgePC</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground lg:flex">
          <Link href="/products" className="transition-colors hover:text-foreground">
            Shop
          </Link>
          <Link href="/builder" className="transition-colors hover:text-foreground">
            PC Builder
          </Link>
          <Link href="/recommend" className="transition-colors hover:text-foreground">
            Recommend
          </Link>
          <Link href="/assistant" className="transition-colors hover:text-foreground">
            AI Assistant
          </Link>
          <Link href="/compare" className="transition-colors hover:text-foreground">
            Compare
          </Link>
        </nav>
        <div className="hidden flex-1 justify-center sm:flex">
          <SearchBox />
        </div>
        <div className="ml-auto flex items-center gap-2">
          {session?.user ? (
            <>
              <Link
                href="/cart"
                aria-label={cartItemCount > 0 ? `View cart, ${cartItemCount} item${cartItemCount === 1 ? "" : "s"}` : "View cart"}
                className="relative flex size-9 items-center justify-center rounded-md hover:bg-muted"
              >
                <ShoppingCart aria-hidden className="size-5" />
                {cartItemCount > 0 ? (
                  <span aria-hidden className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                    {cartItemCount > 9 ? "9+" : cartItemCount}
                  </span>
                ) : null}
              </Link>
              <UserMenu name={session.user.name ?? "Account"} email={session.user.email ?? ""} />
            </>
          ) : (
            <>
              <Link href="/login" className={buttonVariants({ variant: "ghost", size: "sm" })}>
                Log in
              </Link>
              <Link href="/register" className={buttonVariants({ size: "sm" })}>
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
