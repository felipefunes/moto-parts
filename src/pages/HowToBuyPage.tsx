import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Card } from '@/components/ui/Card';
import { themeConfig } from '@/theme';

export function HowToBuyPage() {
  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ label: 'Cómo comprar' }]} />
      <h1 className="mt-3 font-heading text-3xl font-bold text-text-primary">
        Cómo comprar en {themeConfig.siteName}
      </h1>
      <p className="mt-3 max-w-2xl text-text-secondary">
        Comprar en {themeConfig.siteName} nunca fue tan simple. Sigue estos cuatro pasos:
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {themeConfig.howToBuy.steps.map((step) => (
          <Card key={step.title} className="p-5">
            <step.icon size={22} className="text-brand-cyan" />
            <h3 className="mt-3 font-heading text-base font-bold text-text-primary">{step.title}</h3>
            <p className="mt-1 text-sm text-text-secondary">{step.text}</p>
          </Card>
        ))}
      </div>

      <Card className="mt-8 p-6">
        <h2 className="font-heading text-lg font-bold text-text-primary">Medios de pago</h2>
        <p className="mt-2 text-sm text-text-secondary">
          En este prototipo, el pago se simula: puedes usar cualquier número de tarjeta de prueba, y si
          termina en <span className="font-mono text-text-primary">0000</span> el sistema simulará un pago
          rechazado, para que puedas ver ambos flujos.
        </p>
      </Card>
    </div>
  );
}
