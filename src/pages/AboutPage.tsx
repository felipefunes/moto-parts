import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Card } from '@/components/ui/Card';
import { GradientText } from '@/components/ui/GradientText';
import { themeConfig } from '@/theme';

export function AboutPage() {
  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ label: 'Sobre nosotros' }]} />

      <h1 className="mt-3 font-heading text-3xl font-bold text-text-primary">
        Somos <GradientText>{themeConfig.siteName}</GradientText>
      </h1>
      <p className="mt-3 max-w-2xl text-text-secondary">{themeConfig.about.intro}</p>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {themeConfig.about.pillars.map((pillar) => (
          <Card key={pillar.title} className="flex gap-4 p-5">
            <pillar.icon size={24} className="mt-1 shrink-0 text-brand-cyan" />
            <div>
              <h3 className="font-heading text-base font-bold text-text-primary">{pillar.title}</h3>
              <p className="mt-1 text-sm text-text-secondary">{pillar.text}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-10 p-6">
        <h2 className="font-heading text-lg font-bold text-text-primary">Nuestra hoja de ruta</h2>
        <p className="mt-2 text-sm text-text-secondary">
          Esta versión es un prototipo de frontend con catálogo, carrito y checkout simulado. Las próximas
          etapas incluyen un backend propio con base de datos, panel de administración de inventario para
          nuestros proveedores, integración real con pasarelas de pago chilenas, y cuentas de usuario con
          historial de compras.
        </p>
      </Card>
    </div>
  );
}
