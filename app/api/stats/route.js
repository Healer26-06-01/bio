import { kv } from '@vercel/kv';

export async function POST(req) {
  var expected = process.env.STATS_PASSWORD;
  if (!expected) {
    return Response.json({ ok: false, error: 'not_configured' }, { status: 401 });
  }
  var pw = '';
  try {
    var body = await req.json();
    pw = (body && body.pw) || '';
  } catch (e) {}
  if (pw !== expected) {
    return Response.json({ ok: false }, { status: 401 });
  }
  try {
    var data = await kv.hgetall('healer:clicks');
    return Response.json({ ok: true, clicks: data || {} });
  } catch (e) {
    return Response.json({ ok: false, error: 'kv_error' }, { status: 500 });
  }
}
