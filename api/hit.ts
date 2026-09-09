/**
 * 웹 유입 집계 엔드포인트.
 *
 * 개인정보처리방침(deblurlab.com/privacy)에 "방문자를 식별하지 않는다"고 고지했으므로
 * IP, User-Agent 원문, 방문자 ID, 전체 리퍼러 URL은 저장하지 않는다.
 * User-Agent 는 봇·기기 종류를 판정하는 데만 쓰고 값 자체는 버린다.
 *
 * 수집 실패가 페이지에 영향을 주면 안 되므로 어떤 경우에도 204로 끝낸다.
 */

/**
 * Vercel Node 런타임이 넘겨주는 것 중 실제로 쓰는 부분만 선언한다.
 * `@vercel/node` 는 타입만 필요한데 취약한 undici 를 끌고 들어와 쓰지 않는다.
 */
interface HitRequest {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
}

interface HitResponse {
  status(code: number): HitResponse;
  setHeader(name: string, value: string): void;
  end(): void;
}

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * 알려진 채널만 값을 살린다. 임의 쿼리 파라미터가 그대로 들어와
 * 집계가 잘게 쪼개지는 것을 막는다. `instagram_reels` 처럼 캠페인 접미어는 유지한다.
 */
const KNOWN_CHANNELS = [
  'instagram',
  'tiktok',
  'youtube',
  'facebook',
  'threads',
  'x',
  'twitter',
  'reddit',
  'linkedin',
  'github',
  'naver',
  'google',
  'chatgpt',
  'claude',
  'perplexity',
  'gemini',
  'linkinbio',
  'qr',
  'newsletter',
  'appstore',
];

const BOT_PATTERNS = [
  'bot',
  'crawl',
  'spider',
  'slurp',
  'curl',
  'wget',
  'python-requests',
  'headless',
  'lighthouse',
  'preview',
  'monitor',
  'scrapy',
  'facebookexternalhit',
  'embedly',
  'quora link preview',
  'ahrefs',
  'semrush',
  'dataforseo',
];

function normalizeChannel(raw: unknown): string {
  if (typeof raw !== 'string') return 'direct';

  const slug = raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]/g, '')
    .slice(0, 60);

  if (!slug) return 'direct';
  return KNOWN_CHANNELS.some((known) => slug.startsWith(known)) ? slug : 'other';
}

/** 전체 URL이 아니라 호스트만 남긴다. 검색어 등이 섞여 들어오는 것을 막는다. */
function referrerHost(raw: unknown): string | null {
  if (typeof raw !== 'string' || !raw) return null;
  try {
    const host = new URL(raw).hostname.replace(/^www\./, '').toLowerCase();
    return host.slice(0, 120) || null;
  } catch {
    return null;
  }
}

function normalizePath(raw: unknown): string {
  if (typeof raw !== 'string' || !raw.startsWith('/')) return '/';
  return raw.split('?')[0].split('#')[0].slice(0, 200) || '/';
}

function normalizeLocale(raw: unknown): 'ko' | 'en' | null {
  return raw === 'ko' || raw === 'en' ? raw : null;
}

function classifyDevice(ua: string): 'mobile' | 'tablet' | 'desktop' {
  const s = ua.toLowerCase();
  if (/ipad|tablet|playbook|silk/.test(s)) return 'tablet';
  if (/mobi|iphone|ipod|android.*mobile|windows phone/.test(s)) return 'mobile';
  return 'desktop';
}

function looksLikeBot(ua: string): boolean {
  if (!ua) return true;
  const s = ua.toLowerCase();
  return BOT_PATTERNS.some((pattern) => s.includes(pattern));
}

function countryOf(req: HitRequest): string | null {
  const raw = req.headers['x-vercel-ip-country'];
  const value = Array.isArray(raw) ? raw[0] : raw;
  return typeof value === 'string' && value.length === 2 ? value.toUpperCase() : null;
}

export default async function handler(req: HitRequest, res: HitResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end();
    return;
  }

  // 설정이 빠져 있어도 사이트는 정상 동작해야 한다.
  // 다만 조용히 넘기면 "왜 집계가 0인가"를 추적할 수 없으므로 무엇이 빠졌는지는 남긴다.
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error(
      `[hit] 환경변수 누락으로 집계 건너뜀: ${[
        !SUPABASE_URL && 'SUPABASE_URL',
        !SERVICE_ROLE_KEY && 'SUPABASE_SERVICE_ROLE_KEY',
      ]
        .filter(Boolean)
        .join(', ')}`,
    );
    res.status(204).end();
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body ?? {});
    const userAgent = String(req.headers['user-agent'] ?? '');

    const row = {
      path: normalizePath(body.path),
      locale: normalizeLocale(body.locale),
      channel: normalizeChannel(body.channel),
      referrer_host: referrerHost(body.referrer),
      country: countryOf(req),
      device: classifyDevice(userAgent),
      is_bot: looksLikeBot(userAgent),
    };

    const upstream = await fetch(`${SUPABASE_URL}/rest/v1/page_hits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(row),
    });

    // 응답 본문에 키는 담기지 않으므로 그대로 남겨도 안전하다.
    if (!upstream.ok) {
      console.error(`[hit] 저장 실패 ${upstream.status}: ${await upstream.text()}`);
    }
  } catch (error) {
    console.error('[hit] 저장 중 예외:', error instanceof Error ? error.message : error);
  }

  res.status(204).end();
}
