import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-24 sm:px-6 lg:px-8">
      <Skeleton className="mx-auto h-8 w-64" />
      <Skeleton className="mx-auto h-4 w-96" />
      <Skeleton className="mx-auto h-4 w-80" />
    </div>
  );
}
