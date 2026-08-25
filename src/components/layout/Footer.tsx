import { Link } from 'react-router-dom';
import { Truck, ShieldCheck, CreditCard, Undo2 } from 'lucide-react';
import { LogoWordmark } from '@/assets/logo/LogoWordmark';
import { TOP_LEVEL_CATEGORIES } from '@/data/categories';

const TRUST_ITEMS = [
  { icon: Truck, label: 'Envíos a todo Chile', desc: 'Despacho en 24–72 hrs' },
  { icon: ShieldCheck, label: 'Garantía en todos los repuestos', desc: 'Hasta 12 meses' },
  { icon: CreditCard, label: 'Pago 100% seguro', desc: 'Webpay, Mercado Pago y transferencia' },
  { icon: Undo2, label: 'Devoluciones fáciles', desc: '30 días para cambios' },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-bg-secondary">
      <div className="container-page grid grid-cols-2 gap-6 py-8 sm:grid-cols-4">
        {TRUST_ITEMS.map((item) => (
          <div key={item.label} className="flex items-start gap-3">
            <item.icon size={22} className="mt-0.5 shrink-0 text-brand-cyan" />
            <div>
              <p className="text-sm font-semibold text-text-primary">{item.label}</p>
              <p className="text-xs text-text-muted">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border">
        <div className="container-page grid grid-cols-2 gap-8 py-10 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <LogoWordmark size="md" showTagline />
            <p className="mt-4 text-sm text-text-secondary">
              Catálogo online de repuestos de motocicletas, originales y aftermarket, para todo Chile.
            </p>
          </div>

          <div>
            <h4 className="mb-3 font-heading text-sm font-bold uppercase tracking-wide text-text-primary">
              Categorías
            </h4>
            <ul className="flex flex-col gap-2">
              {TOP_LEVEL_CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link to={`/categoria/${cat.slug}`} className="text-sm text-text-secondary hover:text-brand-cyan">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-heading text-sm font-bold uppercase tracking-wide text-text-primary">
              Ayuda
            </h4>
            <ul className="flex flex-col gap-2">
              <li>
                <Link to="/como-comprar" className="text-sm text-text-secondary hover:text-brand-cyan">
                  Cómo comprar
                </Link>
              </li>
              <li>
                <Link to="/nosotros" className="text-sm text-text-secondary hover:text-brand-cyan">
                  Sobre nosotros
                </Link>
              </li>
              <li>
                <Link to="/carrito" className="text-sm text-text-secondary hover:text-brand-cyan">
                  Mi carrito
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-heading text-sm font-bold uppercase tracking-wide text-text-primary">
              Medios de pago
            </h4>
            <div className="flex flex-wrap gap-2">
              {['Webpay Plus', 'Mercado Pago', 'Transferencia'].map((m) => (
                <span
                  key={m}
                  className="rounded-md border border-border bg-bg-elevated px-2 py-1 text-xs text-text-secondary"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border py-4">
        <div className="container-page flex flex-col items-center justify-between gap-2 text-xs text-text-muted sm:flex-row">
          <span>© {new Date().getFullYear()} RPM Parts. Prototipo de demostración — no procesa pagos reales.</span>
          <span>Hecho en Chile</span>
        </div>
      </div>
    </footer>
  );
}
