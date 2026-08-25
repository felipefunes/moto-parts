import { Truck } from 'lucide-react';
import { formatClp } from '@/lib/formatCurrency';

export function ShippingMethodSelector({ shippingClp }: { shippingClp: number }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-brand-cyan/40 bg-brand-violet/10 p-4">
      <Truck size={20} className="shrink-0 text-brand-cyan" />
      <div className="flex-1">
        <p className="text-sm font-semibold text-text-primary">Despacho estándar a domicilio</p>
        <p className="text-xs text-text-muted">Llega en 24 a 72 horas hábiles</p>
      </div>
      <span className="font-mono text-sm font-semibold text-price">
        {shippingClp === 0 ? 'Gratis' : formatClp(shippingClp)}
      </span>
    </div>
  );
}
