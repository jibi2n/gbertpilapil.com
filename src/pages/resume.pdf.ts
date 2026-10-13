import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { ResumeStore } from '../lib/ResumeStore';

// Served on each request so a newly uploaded resume shows up straight away.
export const prerender = false;

export const GET: APIRoute = async () => {
  const pdf = await new ResumeStore(env.FILES).get();
  if (!pdf) return new Response('No resume has been uploaded yet.', { status: 404 });
  return new Response(pdf, {
    headers: {
      'Content-Type': 'application/pdf',
      // "inline" lets the browser show it on the page; the name is used if it is saved.
      'Content-Disposition': 'inline; filename="Gbert-Pilapil-Resume.pdf"',
      'Cache-Control': 'public, max-age=300',
    },
  });
};
