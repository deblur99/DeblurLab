/**
 * 테마 preference: system(기본) | light | dark.
 * CSS는 해석된 data-theme=light|dark 만 본다.
 * preference가 system일 때만 OS prefers-color-scheme 변경에 반응한다.
 */

const STORAGE_KEY = 'dl-theme';

export type ThemePreference = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

function systemTheme(): ResolvedTheme {
  try {
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

function readPreference(): ThemePreference {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === 'light' || raw === 'dark' || raw === 'system') return raw;
  } catch {
    // 시크릿 등 — system으로 본다.
  }
  return 'system';
}

function writePreference(preference: ThemePreference): void {
  try {
    if (preference === 'system') localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, preference);
  } catch {
    // 저장 불가면 이번 세션의 data-theme만 바뀐다.
  }
}

function resolve(preference: ThemePreference): ResolvedTheme {
  return preference === 'light' || preference === 'dark' ? preference : systemTheme();
}

function applyResolved(theme: ResolvedTheme): void {
  document.documentElement.setAttribute('data-theme', theme);
}

function syncButtons(preference: ThemePreference): void {
  for (const button of document.querySelectorAll<HTMLButtonElement>('[data-theme-option]')) {
    const option = button.getAttribute('data-theme-option');
    button.setAttribute('aria-pressed', option === preference ? 'true' : 'false');
  }
}

let mediaQuery: MediaQueryList | null = null;
let onSystemChange: (() => void) | null = null;

function detachSystemListener(): void {
  if (mediaQuery && onSystemChange) {
    mediaQuery.removeEventListener('change', onSystemChange);
  }
  mediaQuery = null;
  onSystemChange = null;
}

function attachSystemListener(): void {
  detachSystemListener();
  try {
    mediaQuery = matchMedia('(prefers-color-scheme: dark)');
  } catch {
    return;
  }
  onSystemChange = () => {
    if (readPreference() !== 'system') return;
    applyResolved(systemTheme());
  };
  mediaQuery.addEventListener('change', onSystemChange);
}

function setPreference(preference: ThemePreference): void {
  writePreference(preference);
  applyResolved(resolve(preference));
  syncButtons(preference);
  if (preference === 'system') attachSystemListener();
  else detachSystemListener();
}

export function initTheme(): void {
  const preference = readPreference();
  // FOUC 스크립트가 이미 data-theme를 넣었을 수 있다. preference UI만 맞춘다.
  applyResolved(resolve(preference));
  syncButtons(preference);

  if (preference === 'system') attachSystemListener();

  for (const button of document.querySelectorAll<HTMLButtonElement>('[data-theme-option]')) {
    button.addEventListener('click', () => {
      const option = button.getAttribute('data-theme-option');
      if (option === 'system' || option === 'light' || option === 'dark') {
        setPreference(option);
      }
    });
  }
}
