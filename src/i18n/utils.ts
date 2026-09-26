import { ui, defaultLang, type Lang } from './ui';

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as Lang;
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]): string {
    return ui[lang][key] || ui[defaultLang][key];
  };
}

export function localePath(path: string, lang: Lang): string {
  return `/${lang}${path.startsWith('/') ? path : `/${path}`}`;
}

export function getAlternateLang(lang: Lang): Lang {
  return lang === 'en' ? 'zh' : 'en';
}

export function mapLangToContentLang(lang: Lang): string {
  return lang === 'zh' ? 'zh-TW' : 'en';
}

/**
 * Find the other-language version of a post or guide, if one exists.
 * Pairs share an id once the language suffix is dropped: `X-en` / `X` ↔ `X-zh`.
 * Returns the sister's id, or null when the item exists in one language only.
 */
export function findSisterId(
  id: string,
  isZh: boolean,
  entries: { id: string; isZh: boolean }[],
): string | null {
  const base = (s: string) => s.replace(/-(en|zh)$/, '');
  const sister = entries.find((e) => e.isZh !== isZh && base(e.id) === base(id));
  return sister ? sister.id : null;
}
