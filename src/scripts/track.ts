/**
 * 채널별 유입 집계 핑.
 *
 * 개인을 식별하는 값은 보내지 않는다 (방문자 ID 없음).
 * 로컬과 프리뷰 방문이 숫자를 오염시키지 않도록 실서비스 도메인에서만 보낸다.
 */

/**
 * 집계 제외 플래그. 방문자를 식별하는 값이 아니라 "세지 말라"는 불리언 하나다.
 * 도메인 조건만으로는 운영자 본인이 실서비스를 둘러본 기록을 걸러낼 수 없어서 둔다.
 * ?nohit=1 로 켜고 ?nohit=0 으로 끈다.
 */
const OPT_OUT_KEY = 'dl-nohit';

/** 시크릿 모드 등에서 localStorage 접근이 막히면 예외가 난다. 그때는 없는 것으로 본다. */
function isOptedOut(): boolean {
  try {
    return localStorage.getItem(OPT_OUT_KEY) === '1';
  } catch {
    return false;
  }
}

function setOptOut(on: boolean): void {
  try {
    if (on) localStorage.setItem(OPT_OUT_KEY, '1');
    else localStorage.removeItem(OPT_OUT_KEY);
  } catch {
    // 저장이 막혀 있으면 조용히 넘긴다.
  }
}

export function track(): void {
  if (location.hostname !== 'deblurlab.com') return;

  const params = new URLSearchParams(location.search);

  const nohit = params.get('nohit');
  if (nohit === '1') {
    setOptOut(true);
    return;
  }
  if (nohit === '0') {
    setOptOut(false);
  }

  if (isOptedOut()) return;

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
