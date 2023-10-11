import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import { rehypeHeadingIds } from '@astrojs/markdown-remark';
import astroExpressiveCode from 'astro-expressive-code';
import remarkToc from 'remark-toc';
import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
  site: 'https://blog.tomyail.com/',
  markdown: {
    remarkPlugins: [remarkToc],
    rehypePlugins: [rehypeHeadingIds],
  },
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
  integrations: [
    sitemap(),
    partytown({
      config: {
        forward: ['dataLayer.push'],
      },
    }),
    tailwind(),
    astroExpressiveCode({
      theme: [
        'github-dark',
        /* 'github-light' */
      ],
    }),
    mdx(),
  ],
});
