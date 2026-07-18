import Link from "next/link";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Account</h1>
        <nav className="mt-4 flex gap-4 border-b border-border/60 text-sm font-medium text-muted-foreground">
          <Link href="/account/profile" className="border-b-2 border-transparent pb-3 hover:text-foreground">
            Profile
          </Link>
          <Link href="/account/addresses" className="border-b-2 border-transparent pb-3 hover:text-foreground">
            Addresses
          </Link>
        </nav>
      </div>
      {children}
    </div>
  );
}
