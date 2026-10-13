import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { ImageStore } from '../../lib/ImageStore';

export const prerender = false;

/** Serves images uploaded from the dashboard. */
export const GET: APIRoute = async ({ params }) => {
  const image = await new ImageStore(env.FILES).get(params.name ?? '');
  if (!image) return new Response('Not found', { status: 404 });
  return new Response(image.data, {
    headers: {
      'Content-Type': image.type,
      // Safe to cache for a year: a replaced image gets a new name.
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
