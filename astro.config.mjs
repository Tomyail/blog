import { defineConfig, squooshImageService } from 'astro/config';
import mdx from '@astrojs/mdx';
import partytown from "@astrojs/partytown";
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'http://blog.tomyail.com/',
  integrations: [
    mdx(),
    sitemap(),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      }
    })
  ],
  /* image: { */
  /*   //not support gif */
  /*   service: squooshImageService(), */
  /* }, */
});
