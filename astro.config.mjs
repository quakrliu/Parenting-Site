// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://bloom-path.app',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => page.startsWith('https://bloom-path.app/en/') || page.startsWith('https://bloom-path.app/zh/'),
    }),
  ],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
});
