export const LOCALES = ['ko', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'ko';

export const SITE_URL = 'https://deblurlab.com';
export const CONTACT_EMAIL = 'contact@deblurlab.com';

/**
 * 통신판매업 신고번호는 발급 전까지 null로 둔다.
 * 값이 있을 때만 사업자 정보 블록에 노출된다.
 */
export const BUSINESS = {
  nameKo: '디블러랩',
  nameEn: 'DeblurLab',
  ownerKo: '한현민',
  ownerEn: 'Hyeonmin Han',
  registrationNumber: '466-14-03145',
  mailOrderNumber: null as string | null,
  addressKo: '충남 천안시 서북구 두정로 230 4층',
  addressEn: '4F, 230 Dujeong-ro, Seobuk-gu, Cheonan-si, Chungcheongnam-do, Republic of Korea',
  email: CONTACT_EMAIL,
} as const;

export const SOCIALS = [
  { label: 'Instagram', href: 'https://www.instagram.com/deblur.lab' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@deblur.lab' },
  { label: 'YouTube', href: 'https://www.youtube.com/@deblur-lab' },
  { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61594288492001' },
] as const;

/**
 * status: 'available' 로 바꾸면 스토어 링크가 노출된다.
 * 1호기는 9/8 의도치 않은 출시 후 판매 중단 상태이므로 재출시까지 'coming-soon'.
 */
export type AppStatus = 'available' | 'coming-soon';

export interface AppEntry {
  id: string;
  name: string;
  appStoreId: string | null;
  platforms: string;
  status: AppStatus;
}

export const APPS: AppEntry[] = [
  {
    id: 'bsl',
    name: 'BSL Screen Saver',
    appStoreId: '6792719727',
    platforms: 'macOS',
    status: 'coming-soon',
  },
  {
    id: 'knn',
    name: 'Keyboard Noise Notifier',
    appStoreId: null,
    platforms: 'macOS · iPhone · Apple Watch',
    status: 'coming-soon',
  },
];

/** App Store 캠페인 링크. ct 값으로 채널별 유입을 App Analytics에서 구분한다. */
export function appStoreUrl(appId: string, campaign?: string): string {
  const url = new URL(`https://apps.apple.com/app/id${appId}`);
  url.searchParams.set('mt', '12');
  if (campaign) url.searchParams.set('ct', campaign);
  return url.toString();
}

/** 기본 로케일은 접두어가 없고, 그 외에는 /<locale> 접두어를 붙인다. */
export function localePath(locale: Locale, path: string): string {
  const clean = path === '/' ? '' : path.replace(/\/$/, '');
  return locale === DEFAULT_LOCALE ? clean || '/' : `/${locale}${clean}`;
}

/**
 * URL 경로에서 로케일과 로케일 접두어를 뗀 논리 경로를 분리한다.
 * build.format이 'file'이라 빌드 중 경로가 `/en.html` 형태로 들어오므로
 * 확장자를 먼저 떼야 로케일을 놓치지 않는다.
 */
export function parsePath(pathname: string): { locale: Locale; path: string } {
  const normalized = pathname.replace(/\/index\.html$/, '/').replace(/\.html$/, '');
  const segments = normalized.split('/').filter(Boolean);
  const head = segments[0];
  const prefixed = LOCALES.find((l) => l !== DEFAULT_LOCALE && l === head);

  if (prefixed) {
    return { locale: prefixed, path: `/${segments.slice(1).join('/')}`.replace(/\/$/, '') || '/' };
  }
  return { locale: DEFAULT_LOCALE, path: `/${segments.join('/')}`.replace(/\/$/, '') || '/' };
}
