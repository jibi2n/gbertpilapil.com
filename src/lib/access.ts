import { createRemoteJWKSet, jwtVerify } from 'jose';

export interface AccessConfig {
  /** Your Cloudflare Zero Trust address, e.g. "myteam.cloudflareaccess.com". */
  teamDomain: string;
  /** The Application Audience (AUD) tag of the Access application guarding /admin. */
  audience: string;
  /** The one email address allowed into the dashboard. */
  adminEmail: string;
}

// Cloudflare's public signing keys, fetched once per team and then cached.
const keySets = new Map<string, ReturnType<typeof createRemoteJWKSet>>();

/**
 * Checks that a request really came through Cloudflare Access and belongs to
 * the admin. Access adds a signed token to every request it lets through;
 * this verifies the signature, that the token was issued for this
 * application, and that it is for the admin's email.
 *
 * Returns the email, or null if any of that fails. The site's workers.dev
 * address is not behind Access, so this check is what keeps it shut there.
 */
export async function signedInAdmin(request: Request, config: AccessConfig): Promise<string | null> {
  const token = request.headers.get('Cf-Access-Jwt-Assertion');
  if (!token) return null;

  const issuer = `https://${config.teamDomain}`;
  let keys = keySets.get(issuer);
  if (!keys) {
    keys = createRemoteJWKSet(new URL(`${issuer}/cdn-cgi/access/certs`));
    keySets.set(issuer, keys);
  }

  try {
    const { payload } = await jwtVerify(token, keys, { issuer, audience: config.audience });
    const email = typeof payload.email === 'string' ? payload.email.toLowerCase() : '';
    return email === config.adminEmail.toLowerCase() ? email : null;
  } catch {
    // Expired, forged, or issued for a different application.
    return null;
  }
}
