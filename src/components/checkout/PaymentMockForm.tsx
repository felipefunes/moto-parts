import { useState, type FormEvent } from 'react';
import { CreditCard, Landmark, Wallet, ShieldCheck, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';
import type { PaymentMethodType, PaymentResult } from '@/types';
import { PAYMENT_METHODS, paymentService, type MockCardInput } from '@/services/paymentService';
import { Button } from '@/components/ui/Button';
import { formatClp } from '@/lib/formatCurrency';

const METHOD_ICONS: Record<PaymentMethodType, typeof CreditCard> = {
  webpay_plus: CreditCard,
  mercado_pago: Wallet,
  bank_transfer: Landmark,
};

const inputClass =
  'w-full rounded-lg border border-border bg-bg-elevated px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-cyan focus:outline-none';

function formatCardNumber(value: string): string {
  return value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim();
}

export function PaymentMockForm({
  amountClp,
  onResult,
}: {
  amountClp: number;
  onResult: (result: PaymentResult) => void;
}) {
  const [method, setMethod] = useState<PaymentMethodType>('webpay_plus');
  const [card, setCard] = useState<MockCardInput>({
    cardNumber: '',
    cardHolder: '',
    expiry: '',
    cvv: '',
    installments: 1,
  });
  const [status, setStatus] = useState<'idle' | 'redirecting' | 'processing' | 'error'>('idle');

  const requiresCard = method === 'webpay_plus' || method === 'mercado_pago';

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('redirecting');
    await new Promise((resolve) => setTimeout(resolve, 700));
    setStatus('processing');
    try {
      const result = await paymentService.confirmTransaction(method, amountClp, requiresCard ? card : undefined);
      if (result.status === 'rejected') {
        setStatus('error');
      }
      onResult(result);
    } catch {
      setStatus('error');
    }
  }

  const isBusy = status === 'redirecting' || status === 'processing';

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {PAYMENT_METHODS.map((pm) => {
          const Icon = METHOD_ICONS[pm.type];
          const isActive = method === pm.type;
          return (
            <button
              key={pm.id}
              type="button"
              onClick={() => setMethod(pm.type)}
              className={clsx(
                'flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-colors',
                isActive ? 'border-brand-cyan bg-brand-violet/10' : 'border-border bg-bg-elevated hover:border-text-muted',
              )}
            >
              <Icon size={20} className={isActive ? 'text-brand-cyan' : 'text-text-secondary'} />
              <span className="text-sm font-semibold text-text-primary">{pm.label}</span>
              <span className="text-xs text-text-muted">{pm.description}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-xl border border-border bg-bg-secondary p-5">
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <ShieldCheck size={14} className="text-success" />
          Simulación de pasarela chilena (Webpay/Transbank) — no se procesan pagos reales.
        </div>

        {requiresCard && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <input
                required
                inputMode="numeric"
                placeholder="Número de tarjeta"
                className={inputClass}
                value={card.cardNumber}
                onChange={(e) => setCard((c) => ({ ...c, cardNumber: formatCardNumber(e.target.value) }))}
              />
              <p className="mt-1 text-[11px] text-text-muted">
                Tip demo: termina el número en 0000 para simular un pago rechazado.
              </p>
            </div>
            <input
              required
              placeholder="Nombre en la tarjeta"
              className={clsx(inputClass, 'sm:col-span-2')}
              value={card.cardHolder}
              onChange={(e) => setCard((c) => ({ ...c, cardHolder: e.target.value }))}
            />
            <input
              required
              placeholder="MM/AA"
              maxLength={5}
              className={inputClass}
              value={card.expiry}
              onChange={(e) => setCard((c) => ({ ...c, expiry: e.target.value }))}
            />
            <input
              required
              inputMode="numeric"
              maxLength={4}
              placeholder="CVV"
              className={inputClass}
              value={card.cvv}
              onChange={(e) => setCard((c) => ({ ...c, cvv: e.target.value.replace(/\D/g, '') }))}
            />
            <select
              className={clsx(inputClass, 'sm:col-span-2')}
              value={card.installments}
              onChange={(e) => setCard((c) => ({ ...c, installments: Number(e.target.value) }))}
            >
              <option value={1}>1 cuota sin interés</option>
              <option value={3}>3 cuotas</option>
              <option value={6}>6 cuotas</option>
              <option value={12}>12 cuotas</option>
            </select>
          </div>
        )}

        {method === 'bank_transfer' && (
          <div className="rounded-lg border border-border bg-bg-elevated p-4 text-sm text-text-secondary">
            Al confirmar tu pedido recibirás los datos bancarios por correo. El pedido se despacha una vez
            verificada la transferencia.
          </div>
        )}

        {status === 'error' && (
          <div className="flex items-center gap-2 rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger">
            <AlertTriangle size={16} />
            El pago fue rechazado. Verifica los datos de tu tarjeta e intenta nuevamente.
          </div>
        )}

        <Button type="submit" size="lg" loading={isBusy} disabled={isBusy}>
          {status === 'redirecting'
            ? 'Redirigiendo a Webpay…'
            : status === 'processing'
              ? 'Procesando pago…'
              : `Pagar ${formatClp(amountClp)}`}
        </Button>
      </form>
    </div>
  );
}
