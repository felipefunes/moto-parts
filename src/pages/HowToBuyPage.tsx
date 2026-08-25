import { Search, ShoppingCart, CreditCard, Truck } from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Card } from '@/components/ui/Card';

const STEPS = [
  {
    icon: Search,
    title: '1. Encuentra tu repuesto',
    text: 'Busca por nombre, marca o navega por categoría. Filtra por marca y modelo de moto para asegurar compatibilidad.',
  },
  {
    icon: ShoppingCart,
    title: '2. Agrégalo al carrito',
    text: 'Revisa specs y compatibilidad en la ficha de producto, elige la cantidad y agrégalo al carrito.',
  },
  {
    icon: CreditCard,
    title: '3. Paga de forma segura',
    text: 'Completa tu dirección de despacho y paga con Webpay Plus, Mercado Pago o transferencia bancaria.',
  },
  {
    icon: Truck,
    title: '4. Recibe en tu domicilio',
    text: 'Despachamos a todo Chile en 24 a 72 horas hábiles. Te avisamos por correo en cada etapa.',
  },
];

export function HowToBuyPage() {
  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ label: 'Cómo comprar' }]} />
      <h1 className="mt-3 font-heading text-3xl font-bold text-text-primary">Cómo comprar en RPM Parts</h1>
      <p className="mt-3 max-w-2xl text-text-secondary">
        Comprar repuestos nunca fue tan simple. Sigue estos cuatro pasos:
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {STEPS.map((step) => (
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
