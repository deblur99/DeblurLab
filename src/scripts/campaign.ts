/**
 * 숏폼 프로필의 링크가 ?ct=instagram_reels 같은 값을 달고 들어온다.
 * 그 값을 App Store 링크로 그대로 넘겨야 App Analytics에서 채널별로 잡힌다.
 */
export function propagateCampaign(): void {
  const params = new URLSearchParams(location.search);
  const campaign = params.get('ct') ?? params.get('utm_source');

  if (!campaign || !/^[\w.-]{1,80}$/.test(campaign)) return;

  for (const anchor of document.querySelectorAll<HTMLAnchorElement>('[data-app-store]')) {
    const url = new URL(anchor.href);
    url.searchParams.set('ct', campaign);
    anchor.href = url.toString();
  }
}
