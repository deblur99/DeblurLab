/**
 * 채널별 유입 집계 핑.
 *
 * 개인을 식별하는 값은 보내지 않는다 (쿠키·localStorage·방문자 ID 없음).
 * 로컬과 프리뷰 방문이 숫자를 오염시키지 않도록 실서비스 도메인에서만 보낸다.
 */
export function track(): void {
  if (location.hostname !== 'deblurlab.com') return;

  const params = new URLSearchParams(location.search);

  fetch('/api/hit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    keepalive: true,
    body: JSON.stringify({
      path: location.pathname,
      channel: params.get('ct') ?? params.get('utm_source'),
      referrer: document.referrer || null,
      locale: document.documentElement.lang,
    }),
  }).catch(() => {
    // 집계 실패가 페이지에 영향을 주지 않도록 삼킨다.
  });
}
