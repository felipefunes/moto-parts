import { Link } from 'react-router-dom';
import { ArrowRight, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { GradientText } from '@/components/ui/GradientText';
import { unsplashImage } from '@/lib/unsplash';
import { themeConfig } from '@/theme';

export function HeroBanner() {
  const { hero, siteName, primaryCategoryHref } = themeConfig;

  return (
    <section className="relative overflow-hidden border-b border-border bg-radial-glow bg-grid-fade">
      <div className="container-page grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
        <div className="relative z-10">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-violet/40 bg-brand-violet/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-cyan">
            <Wrench size={13} /> {hero.badge}
          </span>
          <h1 className="font-display text-4xl font-black leading-[1.05] tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
            {hero.titleTop}
            <br />
            <GradientText>{hero.titleAccent}</GradientText>
          </h1>
          <p className="mt-5 max-w-md text-base text-text-secondary sm:text-lg">{hero.subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to={primaryCategoryHref}>
              <Button size="lg" icon={<ArrowRight size={18} />} className="flex-row-reverse">
                {hero.ctaPrimaryLabel}
              </Button>
            </Link>
            <Link to="/como-comprar">
              <Button size="lg" variant="outline">
                Cómo comprar
              </Button>
            </Link>
          </div>
        </div>

        <div className="diagonal-edge relative aspect-[4/3] overflow-hidden rounded-2xl border border-border shadow-glow lg:aspect-[5/4]">
          <img
            src={unsplashImage(hero.imageId, 1400, 80)}
            alt={siteName}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/80 via-transparent to-transparent" />
        </div>
      </div>
    </section>
  );
}
