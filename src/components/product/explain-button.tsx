"use client";

import { useState } from "react";
import { HelpCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type ExplainTarget = { productId: string; field: string } | { term: string };

export function ExplainButton({ target }: { target: ExplainTarget }) {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleOpenChange(open: boolean) {
    if (!open || explanation !== null || isLoading) return;
    setIsLoading(true);
    const response = await fetch("/api/ai/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(target),
    });
    const data = await response.json().catch(() => null);
    setExplanation(data?.explanation || "Sorry, couldn't load an explanation.");
    setIsLoading(false);
  }

  return (
    <Popover onOpenChange={handleOpenChange}>
      <PopoverTrigger
        className="text-muted-foreground transition-colors hover:text-foreground"
        aria-label="Explain this"
      >
        <HelpCircle className="size-3.5" />
      </PopoverTrigger>
      <PopoverContent>{isLoading ? "Thinking..." : explanation}</PopoverContent>
    </Popover>
  );
}
