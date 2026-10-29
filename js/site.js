/* Quase Cinema Lab - site v1
   i18n: Portuguese default, English via ?lang=en
   Motion: light canvas background, static when prefers-reduced-motion */
(function () {
  'use strict';

  var root = document.documentElement;
  var params = new URLSearchParams(location.search);
  var lang = params.get('lang') === 'en' ? 'en' : 'pt';

  // Language state (head snippet already sets the class early to avoid flash)
  root.classList.toggle('en', lang === 'en');
  root.lang = lang === 'en' ? 'en' : 'pt-BR';

  var title = root.getAttribute('data-title-' + lang);
  if (title) document.title = title;
  var desc = root.getAttribute('data-desc-' + lang);
  var meta = document.querySelector('meta[name="description"]');
  if (desc && meta) meta.setAttribute('content', desc);

  function withLang(href, l) {
    try {
      var u = new URL(href, location.href);
      if (u.origin !== location.origin) return href;
      if (l === 'en') u.searchParams.set('lang', 'en'); else u.searchParams.delete('lang');
      return u.pathname + u.search + u.hash;
    } catch (e) { return href; }
  }

  document.addEventListener('DOMContentLoaded', function () {
    // Keep language across internal links
    if (lang === 'en') {
      document.querySelectorAll('a[href]').forEach(function (a) {
        var h = a.getAttribute('href');
        if (!h || /^(mailto:|tel:|#|https?:)/.test(h) || a.hasAttribute('data-lang-switch')) return;
        a.setAttribute('href', withLang(h, 'en'));
      });
    }
    // Language switch
    document.querySelectorAll('[data-lang-switch]').forEach(function (a) {
      var target = lang === 'en' ? 'pt' : 'en';
      a.setAttribute('href', withLang(location.href, target));
      a.setAttribute('hreflang', target === 'en' ? 'en' : 'pt-BR');
    });
    // Footer year
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
    initBackground();
  });

  function initBackground() {
    var canvas = document.getElementById('bg');
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0, h = 0, pts = [], raf = 0, t0 = performance.now();

    function resize() {
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(Math.min(70, Math.max(24, (w * h) / 26000)));
      pts = [];
      for (var i = 0; i < n; i++) {
        pts.push({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - .5) * .12, vy: (Math.random() - .5) * .12,
          r: Math.random() * 1.2 + .4, p: Math.random() * Math.PI * 2
        });
      }
      draw(performance.now(), true);
    }

    function draw(now, still) {
      var t = (now - t0) / 1000;
      ctx.clearRect(0, 0, w, h);
      var link = Math.min(170, Math.max(110, w / 9));
      for (var i = 0; i < pts.length; i++) {
        var a = pts[i];
        if (!still) {
          a.x += a.vx; a.y += a.vy;
          if (a.x < -20) a.x = w + 20; if (a.x > w + 20) a.x = -20;
          if (a.y < -20) a.y = h + 20; if (a.y > h + 20) a.y = -20;
        }
        for (var j = i + 1; j < pts.length; j++) {
          var b = pts[j], dx = a.x - b.x, dy = a.y - b.y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < link) {
            ctx.strokeStyle = 'rgba(94,234,212,' + (0.16 * (1 - d / link)).toFixed(3) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        var glow = 0.35 + 0.25 * Math.sin(t * 0.6 + a.p);
        ctx.fillStyle = 'rgba(94,234,212,' + glow.toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill();
      }
    }

    function loop(now) { draw(now, false); raf = requestAnimationFrame(loop); }
    function start() { stop(); if (!mq.matches && !document.hidden) raf = requestAnimationFrame(loop); else draw(performance.now(), true); }
    function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; }

    window.addEventListener('resize', function () { resize(); start(); });
    document.addEventListener('visibilitychange', start);
    if (mq.addEventListener) mq.addEventListener('change', start); else if (mq.addListener) mq.addListener(start);
    resize(); start();
  }
})();
