import { ImageOff } from 'lucide-react';

/** Shown wherever a product image slot would render but the product has no images (e.g. a
 * real backend product with no rows in product_images -- mapProduct maps that to images: []). */
export function ImagePlaceholder({ className, iconSize = 24 }: { className?: string; iconSize?: number }) {
  return (
    <div
      aria-label="Sin imagen"
      className={`flex items-center justify-center bg-bg-elevated text-text-muted ${className ?? ''}`}
    >
      <ImageOff size={iconSize} />
    </div>
  );
}
