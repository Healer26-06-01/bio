'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

var NAMES = {
  boxzalo: 'Box Zalo chung sức',
  zalocn: 'Zalo 0366.8225.35',
  link2: 'YouTube',
  link3: 'TikTok',
  link4: 'Discord',
  donate: 'Donate / QR',
  link6: 'Facebook',
};
var ORDER = ['boxzalo', 'zalocn', 'link2', 'link3', 'link4', 'donate', 'link6'];

export default function Stats() {
  const [pw, setPw] = useState('');
  const [authed, setAuthed] = useState(false);
  const [clicks, setClicks] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function load(password) {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pw: password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        if (res.status === 401) setError('Sai mật khẩu, hoặc Healer chưa đặt STATS_PASSWORD trên Vercel.');
        else setError('Không tải được số liệu. Kiểm tra Vercel KV đã được connect vào project chưa.');
        setAuthed(false);
      } else {
        setClicks(data.clicks || {});
        setAuthed(true);
        try { sessionStorage.setItem('healer-stats-pw', password); } catch (e) {}
      }
    } catch (e) {
      setError('Lỗi kết nối tới server.');
      setAuthed(false);
    }
    setLoading(false);
  }

  function onSubmit(e) {
    e.preventDefault();
    if (pw) load(pw);
  }

  useEffect(function () {
    try {
      var saved = sessionStorage.getItem('healer-stats-pw');
      if (saved) {
        setPw(saved);
        load(saved);
      }
    } catch (e) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  var total = ORDER.reduce(function (s, id) {
    return s + (parseInt(clicks[id], 10) || 0);
  }, 0);

  return (
    <>
      <div className="orbs" aria-hidden="true"><span></span><span></span><span></span></div>
      <div className="wrap">
        <h1 className="rise d1">Thống kê lượt bấm</h1>
        <p className="s rise d2">Chỉ Healer xem được trang này 🔒</p>

        <div className="panel rise d3">
          {!authed ? (
            <form onSubmit={onSubmit}>
              <h2>Nhập mật khẩu</h2>
              <p className="hint">Mật khẩu là STATS_PASSWORD Healer đã đặt trong Vercel.</p>
              <input
                className="field"
                type="password"
                value={pw}
                onChange={function (e) { setPw(e.target.value); }}
                placeholder="Mật khẩu..."
                autoComplete="current-password"
              />
              <div style={{ marginTop: 14 }}>
                <button className="btn-primary" type="submit" disabled={loading || !pw}>
                  {loading ? 'Đang kiểm tra...' : 'Xem thống kê'}
                </button>
              </div>
              {error ? <p className="err">{error}</p> : null}
            </form>
          ) : (
            <>
              <h2>Lượt bấm từng nút link</h2>
              <p className="hint">Số liệu tổng hợp từ tất cả người xem.</p>
              <table className="stable">
                <thead>
                  <tr><th>Nút link</th><th className="num">Lượt bấm</th></tr>
                </thead>
                <tbody>
                  {ORDER.map(function (id) {
                    return (
                      <tr key={id}>
                        <td>{NAMES[id]}</td>
                        <td className="num">{parseInt(clicks[id], 10) || 0}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="total"><span>Tổng cộng</span><span>{total}</span></div>
              {error ? <p className="err">{error}</p> : null}
              <div className="row-actions">
                <button
                  className="btn-primary"
                  disabled={loading}
                  onClick={function () { load(pw); }}
                >
                  {loading ? 'Đang tải...' : '↻ Làm mới'}
                </button>
                <button
                  className="btn-ghost"
                  onClick={function () {
                    try { sessionStorage.removeItem('healer-stats-pw'); } catch (e) {}
                    setPw(''); setAuthed(false); setClicks({});
                  }}
                >
                  Đăng xuất
                </button>
              </div>
            </>
          )}
        </div>

        <div className="rise" style={{ marginTop: 18 }}>
          <Link className="btn-ghost" href="/">← Về trang bio</Link>
        </div>
        <footer className="rise">© <b>Healer</b></footer>
      </div>
    </>
  );
}
