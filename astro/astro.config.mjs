import { defineConfig, squooshImageService } from 'astro/config';
import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'http://blog.tomyail.com/',
  integrations: [mdx(), sitemap()],
  image: {
    service: squooshImageService(),
  },
});
