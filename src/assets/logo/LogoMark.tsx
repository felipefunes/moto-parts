/**
 * Marca original (no deriva de ningún logo real de MotoGP/cripto): tres barras
 * diagonales ascendentes tipo tacómetro/ecualizador con gradiente de marca,
 * más un punto "spark" que evoca una bujía / chispa de encendido.
 */
export function LogoMark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      role="img"
      aria-label="RPM Parts"
    >
      <defs>
        <linearGradient id="rpm-logo-gradient" x1="4" y1="40" x2="44" y2="8" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#7C3AED" />
          <stop offset="0.5" stopColor="#3B82F6" />
          <stop offset="1" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
      <rect x="8" y="26" width="7" height="14" rx="1.5" fill="url(#rpm-logo-gradient)" />
      <rect x="20.5" y="18" width="7" height="22" rx="1.5" fill="url(#rpm-logo-gradient)" />
      <rect x="33" y="8" width="7" height="32" rx="1.5" fill="url(#rpm-logo-gradient)" />
      <circle cx="38.5" cy="6.5" r="2.6" fill="#C6FF00" />
    </svg>
  );
}
