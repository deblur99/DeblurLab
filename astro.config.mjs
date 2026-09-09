import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://deblurlab.com',
  trailingSlash: 'never',

  // 'file' + Vercel cleanUrls 조합이라 /privacy 가 확장자 없이 그대로 열린다.
  build: { format: 'file' },

  // Astro 가 작은 스크립트를 HTML에 인라인으로 넣기 때문에 script-src 'self' 만으로는
  // 프로덕션에서 차단된다. CSP를 Astro가 생성하게 하면 인라인 스크립트·스타일의
  // SHA-256 해시가 자동으로 허용 목록에 들어가므로 unsafe-inline 이 필요 없다.
  // frame-ancestors 는 <meta> CSP에서 무시되므로 vercel.json 헤더에 남겨 둔다.
  security: {
    csp: {
      algorithm: 'SHA-256',
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "connect-src 'self'",
        "font-src 'self' https://cdn.jsdelivr.net data:",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ],
      styleDirective: {
        // Pretendard 를 jsdelivr 에서 받는다. resources 를 지정하면 'self' 가
        // 기본 포함되지 않으므로 직접 넣어야 한다.
        resources: ["'self'", 'https://cdn.jsdelivr.net'],
      },
    },
  },

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
