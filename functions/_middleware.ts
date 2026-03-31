// Cloudflare Pages Function middleware for language detection redirect.
// Redirects bare "/" to /en/ or /zh/ based on Accept-Language header.

const SUPPORTED_LOCALES = ['en', 'zh'];
const DEFAULT_LOCALE = 'en';

function getPreferredLocale(acceptLanguage: string | null): string {
  if (!acceptLanguage) return DEFAULT_LOCALE;

  const languages = acceptLanguage
    .split(',')
    .map((part) => {
      const [lang, q] = part.trim().split(';q=');
      return { lang: lang.trim().toLowerCase(), q: q ? parseFloat(q) : 1.0 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { lang } of languages) {
    // Match zh-TW, zh-Hant, zh directly
    if (lang.startsWith('zh')) return 'zh';
    if (lang.startsWith('en')) return 'en';
  }

  return DEFAULT_LOCALE;
}

export const onRequest: PagesFunction = async (context) => {
  const url = new URL(context.request.url);

  // Only redirect the bare root path
  if (url.pathname === '/') {
    const acceptLanguage = context.request.headers.get('Accept-Language');
    const locale = getPreferredLocale(acceptLanguage);
    return Response.redirect(new URL(`/${locale}/`, url), 302);
  }

  return context.next();
};
