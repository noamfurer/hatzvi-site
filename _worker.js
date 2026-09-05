const KEY = 'site-config';

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/config') {
      if (request.method === 'GET') {
        if (!env.SITE) return json({ cfg: null, storage: false });
        const raw = await env.SITE.get(KEY);
        const saved = await env.SITE.get(KEY + ':saved');
        return json({ cfg: raw ? JSON.parse(raw) : null, storage: true, saved: saved || null });
      }
      if (request.method === 'POST') {
        const pass = request.headers.get('x-admin-pass') || '';
        if (pass !== (env.ADMIN_PASSWORD || '102030')) return json({ ok: false }, 401);
        if (!env.SITE) return json({ ok: false, error: 'no-storage' }, 503);
        let body;
        try { body = await request.json(); } catch (e) { return json({ ok: false }, 400); }
        if (!body || typeof body.cfg !== 'object' || body.cfg === null) return json({ ok: false }, 400);
        const s = JSON.stringify(body.cfg);
        if (s.length > 8000000) return json({ ok: false, error: 'too-large' }, 413);
        const now = new Date().toISOString();
        await env.SITE.put(KEY, s);
        await env.SITE.put(KEY + ':saved', now);
        return json({ ok: true, saved: now });
      }
      return json({ ok: false }, 405);
    }

    if (url.pathname === '/api/auth' && request.method === 'POST') {
      let body;
      try { body = await request.json(); } catch (e) { return json({ ok: false }, 400); }
      const ok = String((body && body.pass) || '') === (env.ADMIN_PASSWORD || '102030');
      return json({ ok: ok }, ok ? 200 : 401);
    }

    return env.ASSETS.fetch(request);
  }
};
