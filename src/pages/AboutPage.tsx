import { ShieldCheck, Truck, Wrench, Users } from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Card } from '@/components/ui/Card';
import { GradientText } from '@/components/ui/GradientText';

const PILLARS = [
  {
    icon: Wrench,
    title: 'Catálogo curado',
    text: 'Trabajamos directo con distribuidores e importadores para ofrecer repuestos originales y aftermarket de marcas reconocidas.',
  },
  {
    icon: ShieldCheck,
    title: 'Garantía real',
    text: 'Todos los repuestos incluyen garantía de fábrica o de nuestra tienda, con soporte post-venta por WhatsApp y correo.',
  },
  {
    icon: Truck,
    title: 'Logística nacional',
    text: 'Despachamos a todo Chile con tiempos de entrega claros y seguimiento del pedido en cada etapa.',
  },
  {
    icon: Users,
    title: 'Para talleres y moteros',
    text: 'Precios competitivos tanto para el motociclista particular como para talleres mecánicos que compran en volumen.',
  },
];

export function AboutPage() {
  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ label: 'Sobre nosotros' }]} />

      <h1 className="mt-3 font-heading text-3xl font-bold text-text-primary">
        Somos <GradientText>RPM Parts</GradientText>
      </h1>
      <p className="mt-3 max-w-2xl text-text-secondary">
        Nacimos para resolver un problema simple: encontrar el repuesto correcto para tu moto, en Chile,
        sin recorrer cinco tiendas físicas ni adivinar si calza con tu modelo. Este es un prototipo de
        producto — la primera versión de un catálogo que buscamos escalar a nivel nacional.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {PILLARS.map((pillar) => (
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
