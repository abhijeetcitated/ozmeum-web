/*! Usage: <div data-ozmeum="slug"></div><script async src="https://ozmeum.com/embed.js"></script> */
(function () {
  var s = document.currentScript, ORIGIN = s && s.src ? new URL(s.src).origin : 'https://ozmeum.com';
  if (window.__ozmeum) return window.__ozmeum(); // loaded twice → just mount new divs
  function mount(el) {
    if (el.getAttribute('data-ozmeum-ready')) return;
    el.setAttribute('data-ozmeum-ready', '1');
    var q = [];
    ['brand', 'color', 'cta'].forEach(function (k) {
      var v = el.getAttribute('data-' + k);
      if (v) q.push(k + '=' + encodeURIComponent(v));
    });
    var f = document.createElement('iframe');
    f.src = ORIGIN + '/embed/' + encodeURIComponent(el.getAttribute('data-ozmeum')) + (q.length ? '?' + q.join('&') : '');
    f.title = el.getAttribute('data-title') || 'Cost calculator';
    f.loading = 'lazy';
    f.setAttribute('scrolling', 'no');
    f.setAttribute('data-ozmeum-frame', '');
    f.style.cssText = 'display:block;width:100%;height:640px;border:0;overflow:hidden;background:transparent;color-scheme:normal';
    el.appendChild(f);
  }
  window.addEventListener('message', function (e) {
    if (e.origin !== ORIGIN || !e.data || e.data.type !== 'OZMEUM_RESIZE') return;
    var frames = document.querySelectorAll('iframe[data-ozmeum-frame]');
    for (var i = 0; i < frames.length; i++)
      if (frames[i].contentWindow === e.source) frames[i].style.height = Math.ceil(e.data.height) + 'px';
  });
  (window.__ozmeum = function () { [].forEach.call(document.querySelectorAll('[data-ozmeum]'), mount); })();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', window.__ozmeum);
})();
