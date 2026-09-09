import type { Locale } from '../consts';

export const NAV = [
  { path: '/', key: 'nav.about' },
  { path: '/support', key: 'nav.support' },
  { path: '/privacy', key: 'nav.privacy' },
  { path: '/terms', key: 'nav.terms' },
] as const;

const STRINGS = {
  ko: {
    'site.tagline': 'Deblur your life, simplify every day.',
    'nav.about': '소개',
    'nav.support': '지원',
    'nav.privacy': '개인정보처리방침',
    'nav.terms': '이용약관',
    'nav.links': '링크',
    'nav.skip': '본문으로 건너뛰기',
    'nav.home': '디블러랩 홈',
    'lang.label': '언어',
    'footer.business': '사업자 정보',
    'footer.business.name': '상호',
    'footer.business.owner': '대표자',
    'footer.business.registration': '사업자등록번호',
    'footer.business.mailOrder': '통신판매업 신고번호',
    'footer.business.address': '사업장 주소',
    'footer.business.email': '이메일',
    'footer.social': '소셜',
    'footer.rights': '© 2026 DeblurLab. All rights reserved.',
    'legal.updated': '최종 개정일',
    'legal.effective': '시행일',
  },
  en: {
    'site.tagline': 'Deblur your life, simplify every day.',
    'nav.about': 'About',
    'nav.support': 'Support',
    'nav.privacy': 'Privacy Policy',
    'nav.terms': 'Terms',
    'nav.links': 'Links',
    'nav.skip': 'Skip to content',
    'nav.home': 'DeblurLab home',
    'lang.label': 'Language',
    'footer.business': 'Business Information',
    'footer.business.name': 'Business name',
    'footer.business.owner': 'Representative',
    'footer.business.registration': 'Business registration no.',
    'footer.business.mailOrder': 'Mail-order sales no.',
    'footer.business.address': 'Address',
    'footer.business.email': 'Email',
    'footer.social': 'Social',
    'footer.rights': '© 2026 DeblurLab. All rights reserved.',
    'legal.updated': 'Last updated',
    'legal.effective': 'Effective date',
  },
} as const;

type StringKey = keyof (typeof STRINGS)['ko'];

export function useTranslations(locale: Locale) {
  return function t(key: StringKey): string {
    return STRINGS[locale][key] ?? STRINGS.ko[key];
  };
}
