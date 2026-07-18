import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Pagination({
  pathname,
  searchParams,
  page,
  totalPages,
  paramName = "page",
}: {
  pathname: string;
  searchParams: Record<string, string | undefined>;
  page: number;
  totalPages: number;
  paramName?: string;
}) {
  if (totalPages <= 1) return null;

  function hrefFor(targetPage: number) {
    const params = new URLSearchParams(
      Object.entries(searchParams).filter(([, v]) => v !== undefined) as [string, string][],
    );
    params.set(paramName, String(targetPage));
    return `${pathname}?${params.toString()}`;
  }

  const disabledClasses = "pointer-events-none opacity-50";

  return (
    <div className="flex items-center justify-center gap-2 pt-4">
      <Link
        href={hrefFor(page - 1)}
        aria-disabled={page <= 1}
        className={cn(buttonVariants({ variant: "outline", size: "sm" }), page <= 1 && disabledClasses)}
      >
        Previous
      </Link>
      <span className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </span>
      <Link
        href={hrefFor(page + 1)}
        aria-disabled={page >= totalPages}
        className={cn(buttonVariants({ variant: "outline", size: "sm" }), page >= totalPages && disabledClasses)}
      >
        Next
      </Link>
    </div>
  );
}
