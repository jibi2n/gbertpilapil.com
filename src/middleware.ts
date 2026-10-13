import { defineMiddleware } from 'astro:middleware';
import { env } from 'cloudflare:workers';
import { signedInAdmin } from './lib/access';

/** Plain-text refusal that browsers and proxies must not keep a copy of. */
function refuse(status: number, message: string) {
  return new Response(message, { status, headers: { 'Cache-Control': 'no-store' } });
}

/**
 * Guards the dashboard. Everything under /admin requires a valid Cloudflare
 * Access sign-in for the admin's email; the rest of the site is public.
 */
export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  if (pathname !== '/admin' && !pathname.startsWith('/admin/')) return next();

  // `npm run dev` on your own machine: there is no Cloudflare Access in front, so let it through.
  if (import.meta.env.DEV) {
    context.locals.adminEmail = 'local development';
    return next();
  }

  const config = {
    teamDomain: env.ACCESS_TEAM_DOMAIN,
    audience: env.ACCESS_AUD,
    adminEmail: env.ADMIN_EMAIL,
  };
  // Not set up yet: stay locked rather than open.
  if (!config.teamDomain || !config.audience || !config.adminEmail) {
    return refuse(503, 'The dashboard is not set up yet.');
  }

  const email = await signedInAdmin(context.request, config);
  if (!email) return refuse(403, 'You are not signed in to the dashboard.');

  context.locals.adminEmail = email;
  const response = await next();
  response.headers.set('Cache-Control', 'no-store');
  return response;
});
