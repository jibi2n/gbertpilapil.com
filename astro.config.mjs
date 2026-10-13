// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Images are pre-sized files in public/, so no image service is needed.
  adapter: cloudflare({ imageService: 'passthrough' }),
  // Nothing on the site uses sessions yet, so don't provision a KV store for them.
  session: false,

  vite: {
    plugins: [tailwindcss()]
  }
});
