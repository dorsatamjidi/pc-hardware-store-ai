import { BuilderClient } from "@/components/builder/builder-client";

export const metadata = { title: "PC Builder" };

export default function BuilderPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">PC Builder</h1>
        <p className="text-sm text-muted-foreground">
          Add components one at a time — compatibility is checked automatically as you go.
        </p>
      </div>
      <BuilderClient />
    </div>
  );
}
