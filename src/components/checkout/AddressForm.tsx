import { useState, type FormEvent } from 'react';
import type { Address } from '@/types';
import { CHILEAN_REGIONS } from '@/types';
import { Button } from '@/components/ui/Button';

const inputClass =
  'w-full rounded-lg border border-border bg-bg-elevated px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-cyan focus:outline-none';
const labelClass = 'mb-1.5 block text-xs font-semibold uppercase tracking-wide text-text-secondary';

export function AddressForm({
  initialValue,
  onSubmit,
}: {
  initialValue?: Partial<Address>;
  onSubmit: (address: Address) => void;
}) {
  const [form, setForm] = useState<Address>({
    fullName: initialValue?.fullName ?? '',
    rut: initialValue?.rut ?? '',
    phone: initialValue?.phone ?? '',
    email: initialValue?.email ?? '',
    street: initialValue?.street ?? '',
    number: initialValue?.number ?? '',
    apartment: initialValue?.apartment ?? '',
    commune: initialValue?.commune ?? '',
    region: initialValue?.region ?? 'Metropolitana de Santiago',
    city: initialValue?.city ?? '',
    zipCode: initialValue?.zipCode ?? '',
    additionalInfo: initialValue?.additionalInfo ?? '',
  });

  function update<K extends keyof Address>(key: K, value: Address[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Nombre completo</label>
          <input
            required
            className={inputClass}
            value={form.fullName}
            onChange={(e) => update('fullName', e.target.value)}
            placeholder="Juan Pérez"
          />
        </div>
        <div>
          <label className={labelClass}>RUT</label>
          <input
            className={inputClass}
            value={form.rut}
            onChange={(e) => update('rut', e.target.value)}
            placeholder="12.345.678-9"
          />
        </div>
        <div>
          <label className={labelClass}>Correo electrónico</label>
          <input
            required
            type="email"
            className={inputClass}
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            placeholder="tu@correo.cl"
          />
        </div>
        <div>
          <label className={labelClass}>Teléfono</label>
          <input
            required
            className={inputClass}
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            placeholder="+56 9 1234 5678"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[2fr_1fr]">
        <div>
          <label className={labelClass}>Calle</label>
          <input
            required
            className={inputClass}
            value={form.street}
            onChange={(e) => update('street', e.target.value)}
            placeholder="Av. Providencia"
          />
        </div>
        <div>
          <label className={labelClass}>Número</label>
          <input
            required
            className={inputClass}
            value={form.number}
            onChange={(e) => update('number', e.target.value)}
            placeholder="1234"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Depto / Casa (opcional)</label>
          <input
            className={inputClass}
            value={form.apartment}
            onChange={(e) => update('apartment', e.target.value)}
            placeholder="Depto 501"
          />
        </div>
        <div>
          <label className={labelClass}>Ciudad</label>
          <input
            required
            className={inputClass}
            value={form.city}
            onChange={(e) => update('city', e.target.value)}
            placeholder="Santiago"
          />
        </div>
        <div>
          <label className={labelClass}>Comuna</label>
          <input
            required
            className={inputClass}
            value={form.commune}
            onChange={(e) => update('commune', e.target.value)}
            placeholder="Providencia"
          />
        </div>
        <div>
          <label className={labelClass}>Región</label>
          <select
            className={inputClass}
            value={form.region}
            onChange={(e) => update('region', e.target.value as Address['region'])}
          >
            {CHILEAN_REGIONS.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Referencia adicional (opcional)</label>
        <input
          className={inputClass}
          value={form.additionalInfo}
          onChange={(e) => update('additionalInfo', e.target.value)}
          placeholder="Portón negro, dejar con conserje"
        />
      </div>

      <Button type="submit" size="lg" className="mt-2">
        Continuar a pago
      </Button>
    </form>
  );
}
