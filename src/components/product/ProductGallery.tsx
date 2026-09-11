import { useState } from 'react';
import { clsx } from 'clsx';
import type { ProductImage } from '@/types';
import { ImagePlaceholder } from './ImagePlaceholder';

export function ProductGallery({ images }: { images: ProductImage[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  // A real backend product with no image rows maps to images: [] -- see ImagePlaceholder.
  const active = images[activeIndex] ?? images[0];

  return (
    <div className="flex flex-col gap-3">
      <div className="aspect-square overflow-hidden rounded-2xl border border-border bg-bg-elevated">
        {active ? (
          <img src={active.url} alt={active.alt} className="h-full w-full object-cover" />
        ) : (
          <ImagePlaceholder className="h-full w-full" iconSize={40} />
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((img, i) => (
            <button
              key={img.url + i}
              onClick={() => setActiveIndex(i)}
              className={clsx(
                'h-16 w-16 overflow-hidden rounded-lg border-2 transition-colors',
                i === activeIndex ? 'border-brand-cyan' : 'border-border hover:border-text-muted',
              )}
            >
              <img src={img.url} alt={img.alt} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
