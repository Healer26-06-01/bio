import { kv } from '@vercel/kv';

var ID_RE = /^[a-zA-Z0-9_-]{1,64}$/;

export async function POST(req) {
  try {
    var body = await req.json();
    var id = body && body.id;
    if (typeof id !== 'string' || !ID_RE.test(id)) {
      return Response.json({ ok: false }, { status: 400 });
    }
    await kv.hincrby('healer:clicks', id, 1);
    return Response.json({ ok: true });
  } catch (e) {
    // KV chưa cấu hình hoặc lỗi mạng: trang bio vẫn chạy bình thường
    return Response.json({ ok: false }, { status: 500 });
  }
}
