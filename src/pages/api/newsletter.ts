// src/pages/api/newsletter.ts
export const prerender = false;

// Tu endpoint de Google Apps Script (GAS)
const GAS_ENDPOINT =
  'https://script.google.com/macros/s/AKfycbw_AUyKEJibWakx2lXmDnNv9waXqP9B1XHDfXHuBPwEYmNITILoKBPsFbwKEtBVF2czzg/exec';

export async function POST({ request }: { request: Request }) {
  try {
    // Recibimos el form del frontend
    const form = await request.formData();

    // Lo reenviamos a GAS como x-www-form-urlencoded
    const payload = new URLSearchParams();
    for (const [k, v] of form.entries()) payload.append(k, String(v));

    const upstream = await fetch(GAS_ENDPOINT, {
      method: 'POST',
      body: payload,
    });

    const bodyText = await upstream.text();

    // Éxito si GAS respondió 2xx
    const ok = upstream.ok;

    return new Response(
      JSON.stringify({
        ok,
        upstream: { status: upstream.status, body: bodyText },
      }),
      {
        status: ok ? 200 : 502,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ ok: false, message: err?.message || 'error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
