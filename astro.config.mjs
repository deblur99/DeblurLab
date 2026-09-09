import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://deblurlab.com',
  trailingSlash: 'never',

  // 'file' + Vercel cleanUrls 조합이라 /privacy 가 확장자 없이 그대로 열린다.
  build: { format: 'file' },

  i18n: {
    locales: ['ko', 'en'],
    defaultLocale: 'ko',
    routing: {
      prefixDefaultLocale: false,
    },
  },

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'ko',
        locales: { ko: 'ko-KR', en: 'en' },
      },
    }),
  ],
});
