import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingStars({
  rating,
  size = 16,
  className,
}: {
  rating: number;
  size?: number;
  className?: string;
}) {
  const rounded = Math.round(rating * 2) / 2;

  return (
    <div className={cn("flex items-center gap-0.5", className)} aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = i <= rounded;
        const half = !filled && i - 0.5 === rounded;
        return (
          <span key={i} className="relative inline-flex">
            <Star size={size} className="text-muted-foreground/30" fill="currentColor" />
            {(filled || half) && (
              <Star
                size={size}
                className="absolute inset-0 text-amber-500"
                fill="currentColor"
                style={half ? { clipPath: "inset(0 50% 0 0)" } : undefined}
              />
            )}
          </span>
        );
      })}
    </div>
  );
}
