'use client';

import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    var cleanups = [];
    function on(el, ev, fn) {
      if (!el) return;
      el.addEventListener(ev, fn);
      cleanups.push(function () {
        try { el.removeEventListener(ev, fn); } catch (e) {}
      });
    }

    /* ---------- toast ---------- */
    var toastEl = document.getElementById('toast');
    var toastTimer = null;
    function toast(msg) {
      toastEl.textContent = msg;
      toastEl.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 1800);
    }

    /* ---------- sao chép ---------- */
    function copyText(s, msg) {
      function done() { toast(msg || 'Đã sao chép ✓'); }
      function fallback() {
        var ta = document.createElement('textarea');
        ta.value = s; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); done(); } catch (e) { toast('Không sao chép được'); }
        ta.remove();
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(s).then(done, fallback);
      } else { fallback(); }
    }
    document.querySelectorAll('.copybtn').forEach(function (b) {
      on(b, 'click', function () { copyText(b.getAttribute('data-copy')); });
    });

    /* ---------- đếm lượt bấm phía server ---------- */
    function trackClick(id) {
      var payload = JSON.stringify({ id: id });
      var sent = false;
      try {
        if (navigator.sendBeacon) {
          var blob = new Blob([payload], { type: 'application/json' });
          sent = navigator.sendBeacon('/api/click', blob);
        }
      } catch (e) {}
      if (!sent) {
        try {
          fetch('/api/click', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload,
            keepalive: true,
          }).catch(function () {});
        } catch (e) {}
      }
    }
    document.querySelectorAll('a.l').forEach(function (a, i) {
      var id = a.id || ('link' + i);
      on(a, 'click', function () { trackClick(id); });
    });

    /* ---------- đổi giao diện sáng / tối ---------- */
    var root = document.documentElement;
    on(document.getElementById('mb'), 'click', function () {
      var cur = root.getAttribute('data-theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      var next = cur === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('healer-theme', next); } catch (e) {}
    });

    /* ---------- modal donate ---------- */
    var QR = [
      { name: 'Ngân hàng', img: '/stk.jpg' },
      { name: 'Zypage', img: '/zypage.jpg' },
      { name: 'Wescan', note: 'Donate qua Wescan', link: 'https://wescan.vn/phanquochung19q', linkText: 'Mở link Wescan →' },
    ];
    var qm = document.getElementById('qr'),
        qtabs = document.getElementById('qrt'),
        qimg = document.getElementById('qri'),
        qnote = document.getElementById('qrn'),
        qlnk = document.getElementById('qrl');
    qtabs.innerHTML = '';
    function qshow(i) {
      var q = QR[i];
      if (q.img) { qimg.src = q.img; qimg.style.display = ''; }
      else { qimg.removeAttribute('src'); qimg.style.display = 'none'; }
      qnote.textContent = q.note || '';
      if (q.link) {
        qlnk.href = q.link;
        qlnk.textContent = q.linkText || 'Mở link thanh toán →';
        qlnk.hidden = false;
      } else {
        qlnk.hidden = true;
      }
      Array.prototype.forEach.call(qtabs.children, function (b, k) {
        b.className = k === i ? 'act' : '';
      });
    }
    QR.forEach(function (q, i) {
      var b = document.createElement('button');
      b.textContent = q.name;
      b.addEventListener('click', function () { qshow(i); });
      qtabs.appendChild(b);
    });
    if (QR.length < 2) qtabs.style.display = 'none';
    function qopen(e) { e.preventDefault(); qshow(0); qm.hidden = false; document.body.style.overflow = 'hidden'; }
    function qclose() { qm.hidden = true; document.body.style.overflow = ''; }
    on(document.getElementById('donate'), 'click', qopen);
    on(document.getElementById('qrx'), 'click', qclose);
    on(qm, 'click', function (e) { if (e.target === qm) qclose(); });
    on(document, 'keydown', function (e) { if (e.key === 'Escape' && !qm.hidden) qclose(); });

    /* ---------- modal zalo (nhóm + cá nhân) ---------- */
    function bindModal(btnId, modalId, closeId) {
      var mm = document.getElementById(modalId);
      function mopen(e) { e.preventDefault(); mm.hidden = false; document.body.style.overflow = 'hidden'; }
      function mclose() { mm.hidden = true; document.body.style.overflow = ''; }
      on(document.getElementById(btnId), 'click', mopen);
      on(document.getElementById(closeId), 'click', mclose);
      on(mm, 'click', function (e) { if (e.target === mm) mclose(); });
      on(document, 'keydown', function (e) { if (e.key === 'Escape' && !mm.hidden) mclose(); });
    }
    bindModal('boxzalo', 'bz', 'bzx');
    bindModal('zalocn', 'zc', 'zcx');

    return function () {
      cleanups.forEach(function (fn) { fn(); });
    };
  }, []);

  return (
    <>
      <div className="orbs" aria-hidden="true"><span></span><span></span><span></span></div>

      <button id="mb" aria-label="Đổi giao diện sáng / tối">
        <svg className="sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.2" /><path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5 5l1.7 1.7M17.3 17.3L19 19M19 5l-1.7 1.7M6.7 17.3L5 19" /></svg>
        <svg className="moon" viewBox="0 0 24 24"><path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z" /></svg>
      </button>

      <div className="wrap">
        <div className="av rise d1">
          <div><img src="/avatar.jpg" alt="Ảnh đại diện" /></div>
          <svg className="vf" viewBox="0 0 24 24" aria-label="Đã xác minh">
            <path fill="#1d9bf0" stroke="var(--bg1)" strokeWidth="1.5"
              d="M12 1.8l2.6 1.9 3.2-.1 1 3 2.6 1.9-1 3.1 1 3.1-2.6 1.9-1 3-3.2-.1L12 22.2l-2.6-1.9-3.2.1-1-3-2.6-1.9 1-3.1-1-3.1 2.6-1.9 1-3 3.2.1z" />
            <path fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
              d="M7.8 12.3l3 3 5.5-6" />
          </svg>
        </div>
        <div className="rise d2"><span className="badge"><i></i>Liên Quân Mobile · Chung Sức</span></div>
        <h1 className="rise d2">Làm chung sức ib zalo</h1>
        <p className="s rise d3">Liên hệ &amp; theo dõi mình tại đây 👇</p>
        <div className="list">
          <a className="l" href="#" id="boxzalo"><span className="ic z"><b className="zt">Zalo</b></span><span className="t">Box zalo chung sức</span><span className="go">→</span></a>
          <a className="l" href="#" id="zalocn"><span className="ic z"><b className="zt">Zalo</b></span><span className="t">Zalo 0366.8225.35</span><span className="go">→</span></a>
          <a className="l" href="https://www.youtube.com/@healer2606" id="link2"><span className="ic y"><svg viewBox="0 0 24 24"><path d="M21.600 7.200a2.500 2.500 0 0 0-1.800-1.800C18.200 5 12 5 12 5s-6.200 0-7.800.4A2.500 2.500 0 0 0 2.400 7.200C2 8.800 2 12 2 12s0 3.200.4 4.800a2.500 2.500 0 0 0 1.800 1.800C5.800 19 12 19 12 19s6.200 0 7.800-.4a2.500 2.500 0 0 0 1.800-1.800c.4-1.600.4-4.800.4-4.800s0-3.200-.4-4.800zM10 15V9l5.200 3z" /></svg></span><span className="t">YouTube</span><span className="go">→</span></a>
          <a className="l" href="https://www.tiktok.com/@healer._01" id="link3"><span className="ic k"><svg viewBox="0 0 24 24"><path d="M16.600 3c.3 2.300 1.600 3.700 3.900 3.900v3c-1.400.1-2.600-.3-3.900-1.100v5.500c0 7-7.600 9-10.600 4.100-1.900-3.100-.7-8.500 5.200-8.700v3.200c-.5.100-.9.200-1.300.4-1.200.4-1.900 1.100-1.600 2.400.3 2.600 5.100 3.400 4.700-1.700V3z" /></svg></span><span className="t">Tiktok</span><span className="go">→</span></a>
          <a className="l" href="https://discord.com/invite/wrnsSvRER9" id="link4"><span className="ic d"><svg viewBox="0 0 24 24"><path d="M19.300 5.300A17 17 0 0 0 15.100 4l-.5 1a15 15 0 0 0-5.200 0l-.5-1a17 17 0 0 0-4.200 1.300C2 9.300 1.300 13.200 1.600 17a17 17 0 0 0 5.200 2.600l1.100-1.800-1.700-.8.400-.3a12 12 0 0 0 10.200 0l.4.300-1.700.8 1.100 1.800A17 17 0 0 0 22.400 17c.4-4.400-.7-8.300-3.100-11.700zM9 14.700c-1 0-1.800-.9-1.800-2s.8-2 1.800-2 1.800.9 1.800 2-.8 2-1.800 2zm6 0c-1 0-1.800-.9-1.800-2s.8-2 1.800-2 1.800.9 1.800 2-.8 2-1.800 2z" /></svg></span><span className="t">Discord</span><span className="go">→</span></a>
          <a className="l" href="#" id="donate">
            <span className="ic g"><svg viewBox="0 0 24 24"><path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z" /></svg></span>
            <span className="t">Donate / quét mã QR</span><span className="go">→</span></a>
          <a className="l" href="https://www.facebook.com/healerisme01/" id="link6"><span className="ic f"><svg viewBox="0 0 24 24"><path d="M14 8V6.500c0-.7.200-1 1.200-1H17V2h-2.700C11.500 2 10 3.700 10 6v2H8v3.500h2V22h4v-10.500h2.700L17 8z" /></svg></span><span className="t">Facebook</span><span className="go">→</span></a>
        </div>
        <footer className="rise">© <b>Healer</b> · Cảm ơn bạn đã ghé thăm 💜</footer>
      </div>

      <div id="qr" className="qr" hidden>
        <div className="qr-box" role="dialog" aria-modal="true" aria-label="Mã QR donate">
          <button className="qr-x" id="qrx" aria-label="Đóng">✕</button>
          <h3>Ủng hộ mình ❤️</h3>
          <div className="qr-tabs" id="qrt"></div>
          <img id="qri" alt="Mã QR" />
          <p id="qrn"></p>
          <a id="qrl" className="qr-link" href="#" target="_blank" rel="noopener" hidden>Mở link thanh toán →</a>
        </div>
      </div>

      <div id="bz" className="qr" hidden>
        <div className="qr-box" role="dialog" aria-modal="true" aria-label="Nhóm Zalo chung sức">
          <button className="qr-x" id="bzx" aria-label="Đóng">✕</button>
          <h3>Box Zalo chung sức</h3>
          <img src="/zalo-nhom.jpg" alt="Mã QR nhóm Zalo" />
          <p>Quét mã QR hoặc bấm nút bên dưới để vào nhóm</p>
          <a className="qr-link" href="https://zalo.me/g/2xjxoy8mgfkfj6fspkwg" rel="noopener">Tham gia nhóm Zalo →</a>
          <br /><button className="copybtn" data-copy="https://zalo.me/g/2xjxoy8mgfkfj6fspkwg">Sao chép link nhóm</button>
        </div>
      </div>

      <div id="zc" className="qr" hidden>
        <div className="qr-box" role="dialog" aria-modal="true" aria-label="Zalo cá nhân">
          <button className="qr-x" id="zcx" aria-label="Đóng">✕</button>
          <h3>Zalo 0366.8225.35</h3>
          <img src="/zalo-ca-nhan.jpg" alt="Mã QR Zalo" />
          <p>Quét mã QR hoặc bấm nút bên dưới để nhắn tin</p>
          <a className="qr-link" href="https://zalo.me/0366822535" rel="noopener">Nhắn tin Zalo →</a>
          <br /><button className="copybtn" data-copy="0366822535">Sao chép số Zalo</button>
        </div>
      </div>

      <div id="toast" role="status" aria-live="polite"></div>
    </>
  );
}
