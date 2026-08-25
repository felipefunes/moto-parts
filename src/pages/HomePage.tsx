import { useEffect, useState } from 'react';
import type { Product } from '@/types';
import { catalogService } from '@/services';
import { HeroBanner } from '@/components/home/HeroBanner';
import { TrustBadges } from '@/components/home/TrustBadges';
import { CategoryShowcase } from '@/components/home/CategoryShowcase';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';

export function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    catalogService.getFeaturedProducts(8).then((products) => {
      if (active) {
        setFeatured(products);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <HeroBanner />
      <TrustBadges />
      <CategoryShowcase />
      {!loading && <FeaturedProducts products={featured} />}
    </>
  );
}
