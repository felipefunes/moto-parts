import { Star } from 'lucide-react';
import { clsx } from 'clsx';

export function RatingStars({
  rating,
  reviewsCount,
  size = 14,
}: {
  rating: number;
  reviewsCount?: number;
  size?: number;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={size}
            className={clsx(
              i < Math.round(rating) ? 'fill-racing-amber text-racing-amber' : 'fill-transparent text-border',
            )}
          />
        ))}
      </div>
      {reviewsCount != null && (
        <span className="text-xs text-text-muted">
          {rating.toFixed(1)} ({reviewsCount})
        </span>
      )}
    </div>
  );
}
