"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface ExistingReview {
  id: string;
  rating: number;
  title: string;
  body: string;
}

function StarPicker({ value, onChange }: { value: number; onChange: (rating: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button key={i} type="button" onClick={() => onChange(i)} aria-label={`${i} star${i === 1 ? "" : "s"}`}>
          <Star
            size={22}
            className={cn(i <= value ? "text-amber-500" : "text-muted-foreground/30")}
            fill="currentColor"
          />
        </button>
      ))}
    </div>
  );
}

export function ReviewForm({
  productSlug,
  existingReview,
  canReview,
}: {
  productSlug: string;
  existingReview: ExistingReview | null;
  canReview: boolean;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<"closed" | "view" | "edit">(existingReview ? "view" : "closed");
  const [rating, setRating] = useState(existingReview?.rating ?? 5);
  const [title, setTitle] = useState(existingReview?.title ?? "");
  const [body, setBody] = useState(existingReview?.body ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!canReview) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const url = existingReview ? `/api/reviews/${existingReview.id}` : `/api/products/${productSlug}/reviews`;
    const method = existingReview ? "PATCH" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, title, body }),
    });

    setIsSubmitting(false);

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setError(data?.error || "Something went wrong.");
      return;
    }

    setMode("view");
    router.refresh();
  }

  async function handleDelete() {
    if (!existingReview) return;
    if (!confirm("Delete your review?")) return;
    await fetch(`/api/reviews/${existingReview.id}`, { method: "DELETE" });
    setMode("closed");
    router.refresh();
  }

  if (mode === "closed") {
    return (
      <Button variant="outline" size="sm" onClick={() => setMode("edit")}>
        Write a review
      </Button>
    );
  }

  if (mode === "view" && existingReview) {
    return (
      <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
        <div className="mb-1 flex items-center justify-between">
          <p className="text-sm font-medium">Your review</p>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setMode("edit")}>
              Edit
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
        <StarPicker value={rating} onChange={() => {}} />
        <p className="mt-1 text-sm font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{body}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-lg border border-border/60 p-4">
      <div>
        <Label className="mb-1.5">Your rating</Label>
        <StarPicker value={rating} onChange={setRating} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="review-title">Title</Label>
        <Input id="review-title" value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={120} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="review-body">Review</Label>
        <textarea
          id="review-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          minLength={10}
          maxLength={2000}
          rows={4}
          className="rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : existingReview ? "Update review" : "Submit review"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setMode(existingReview ? "view" : "closed")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
