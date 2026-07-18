import { RecommendForm } from "@/components/recommend/recommend-form";

export const metadata = { title: "Get a Recommendation" };

export default function RecommendPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Build Recommendation</h1>
        <p className="text-sm text-muted-foreground">
          Tell us what you&apos;re building for and your budget — we&apos;ll assemble a compatible set of
          parts and explain the choice.
        </p>
      </div>
      <RecommendForm />
    </div>
  );
}
