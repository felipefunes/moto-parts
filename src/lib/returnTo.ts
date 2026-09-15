/** Only ever returns an internal, same-app path -- never the raw `returnTo` query param. A login
 * page that redirects to whatever URL it's handed is an open-redirect vector (a phishing link
 * reading `/ingresar?returnTo=https://evil.example.com` would otherwise send a just-authenticated
 * session there). Must start with a single `/` (a leading `//` is protocol-relative and browsers
 * treat it as external), and can't start with `/ingresar` or `/crear-cuenta` themselves, so a
 * successful login/register never loops back into the auth pages it just left. */
export function sanitizeReturnTo(raw: string | null, fallback = '/mi-cuenta'): string {
  if (!raw) return fallback;
  if (!raw.startsWith('/') || raw.startsWith('//')) return fallback;
  if (raw.startsWith('/ingresar') || raw.startsWith('/crear-cuenta')) return fallback;
  return raw;
}
