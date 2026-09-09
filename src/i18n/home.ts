import type { Locale } from '../consts';

interface Principle {
  title: string;
  body: string;
}

interface HomeCopy {
  metaTitle: string;
  metaDescription: string;
  tagline: string;
  intro: string;
  lineupTitle: string;
  comingSoon: string;
  viewOnStore: string;
  descriptions: Record<string, string>;
  principlesTitle: string;
  principles: Principle[];
  contactTitle: string;
  contactBody: string;
  supportLink: string;
}

export const HOME: Record<Locale, HomeCopy> = {
  ko: {
    metaTitle: '소개',
    metaDescription:
      '디블러랩(DeblurLab)은 매일의 작은 번거로움을 덜어내는 macOS·iOS 앱을 만드는 1인 스튜디오입니다.',
    tagline: 'Deblur your life,\nsimplify every day.',
    intro:
      '디블러랩은 매일의 작은 번거로움을 덜어내는 macOS와 iOS 앱을 만드는 1인 스튜디오입니다. 군더더기 없이 한 가지 일을 제대로 하는 도구를 지향합니다.',
    lineupTitle: '제품',
    comingSoon: '출시 준비 중',
    viewOnStore: 'App Store에서 보기',
    descriptions: {
      bsl: 'macOS 업데이트 화면을 그대로 재현합니다. 자리를 비울 때 화면을 덮어 두는 가장 간단한 방법입니다.',
      knn: '키보드 타건 소음이 기준치를 넘으면 iPhone과 Apple Watch로 조용히 알려줍니다. 카페나 공유 오피스에서 쓰도록 만들었습니다.',
    },
    principlesTitle: '만드는 방식',
    principles: [
      {
        title: '기기 안에서 처리합니다',
        body: '앱이 다루는 데이터는 기기를 벗어나지 않습니다. 계정도, 서버도, 분석 SDK도 없습니다.',
      },
      {
        title: '한 번 사면 끝입니다',
        body: '구독이 아니라 1회 구매입니다. 한 번 구매하면 같은 Apple 계정의 기기에서 함께 쓸 수 있습니다.',
      },
      {
        title: '한 가지를 제대로 합니다',
        body: '기능을 늘리기보다 하나의 쓰임을 확실하게 만드는 쪽을 택합니다.',
      },
    ],
    contactTitle: '연락',
    contactBody: '제안, 문의, 버그 제보 모두 환영합니다.',
    supportLink: '지원 및 문의',
  },
  en: {
    metaTitle: 'About',
    metaDescription:
      'DeblurLab is a one-person studio building macOS and iOS apps that take small daily annoyances off your plate.',
    tagline: 'Deblur your life,\nsimplify every day.',
    intro:
      'DeblurLab is a one-person studio building macOS and iOS apps that take small daily annoyances off your plate. We would rather do one thing properly than add another feature.',
    lineupTitle: 'Apps',
    comingSoon: 'Coming soon',
    viewOnStore: 'View on the App Store',
    descriptions: {
      bsl: 'A pixel-faithful macOS update screen. The simplest way to cover your display when you step away from your desk.',
      knn: 'Quietly tells you on your iPhone and Apple Watch when your typing gets louder than you meant it to. Built for cafés and shared offices.',
    },
    principlesTitle: 'How we build',
    principles: [
      {
        title: 'Everything stays on device',
        body: 'Data our apps handle never leaves your device. No accounts, no servers, no analytics SDKs.',
      },
      {
        title: 'Buy once, done',
        body: 'A one-time purchase rather than a subscription, shared across the devices on your Apple Account.',
      },
      {
        title: 'One job, done properly',
        body: 'We would rather make a single use case reliable than pile on more features.',
      },
    ],
    contactTitle: 'Get in touch',
    contactBody: 'Ideas, questions, and bug reports are all welcome.',
    supportLink: 'Support',
  },
};
