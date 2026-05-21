/**
 * POST /api/newsletter
 * Body: { email: string, source?: string }
 *
 * Forwards subscription to Beehiiv.
 * Requires env: BEEHIIV_API_KEY, BEEHIIV_PUBLICATION_ID
 */

interface Env {
  BEEHIIV_API_KEY: string;
  BEEHIIV_PUBLICATION_ID: string;
}

interface SubscribeBody {
  email?: string;
  source?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, { status: 204, headers: corsHeaders });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: SubscribeBody;
  try {
    body = await request.json<SubscribeBody>();
  } catch {
    return jsonResponse({ error: 'Invalid JSON' }, 400);
  }

  const email = (body.email || '').trim().toLowerCase();
  const source = (body.source || 'website').slice(0, 64);

  if (!email || !EMAIL_REGEX.test(email)) {
    return jsonResponse({ error: 'Invalid email' }, 400);
  }

  if (!env.BEEHIIV_API_KEY || !env.BEEHIIV_PUBLICATION_ID) {
    console.error('Beehiiv env vars not configured');
    return jsonResponse({ error: 'Server not configured' }, 503);
  }

  try {
    const res = await fetch(
      `https://api.beehiiv.com/v2/publications/${env.BEEHIIV_PUBLICATION_ID}/subscriptions`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.BEEHIIV_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          reactivate_existing: true,
          send_welcome_email: true,
          utm_source: source,
        }),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      console.error('Beehiiv API error:', res.status, text);
      return jsonResponse({ error: 'Subscription failed' }, 502);
    }

    return jsonResponse({ ok: true });
  } catch (err) {
    console.error('Newsletter function error:', err);
    return jsonResponse({ error: 'Internal error' }, 500);
  }
};
