// Site motion, every page. Load last, after the page's own scripts have built their lists.
// 1. A new page always opens at the top (unless the link points at a #section), with a short entrance.
// 2. Leaving for another page fades this one out first, so the change of page is visible.
// 3. Headings, text, cards and pictures rise into place as they reach the screen, a few at a time.
// Reduced motion: only the start-at-top rule runs; nothing is hidden.
(function () {
  var d = document.documentElement;
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (!location.hash) window.scrollTo(0, 0);
  else {
    // A #section link: the hero grows once its film starts, which pushes the section down after the browser's jump.
    // Jump again whenever the page height changes during the first two seconds.
    var id = location.hash.slice(1);
    try { id = decodeURIComponent(id); } catch (err) {}                 // a malformed hash must not stop the rest of this script
    var target = document.getElementById(id), h0 = 0, t0 = Date.now(), user = false;
    ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(function (ev) { window.addEventListener(ev, function () { user = true; }, { once: true, passive: true }); });
    var settle = function () {
      if (!target || user || Date.now() - t0 > 2000) return;           // the visitor scrolling wins over the re-jump
      var h = document.documentElement.scrollHeight;
      if (h !== h0) { h0 = h; target.scrollIntoView({ behavior: 'instant', block: 'start' }); }
      requestAnimationFrame(settle);
    };
    window.addEventListener('load', settle);
  }
  // pageshow fires after load. On a slow connection the visitor may already be reading further down by then:
  // never pull them back to the top once they have scrolled (ship review 24 Oct).
  var moved = false;
  ['wheel', 'touchmove', 'keydown', 'mousedown'].forEach(function (ev) { window.addEventListener(ev, function () { moved = true; }, { once: true, passive: true }); });
  window.addEventListener('scroll', function () { if (window.scrollY > 40) moved = true; }, { passive: true });
  window.addEventListener('pageshow', function (e) {
    d.classList.remove('leaving');                       // coming back from the back/forward cache must never stay faded out
    if (!e.persisted && !location.hash && !moved) window.scrollTo(0, 0);
  });
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  d.classList.add('mo-init', 'mo');   // mo-init: blocks start hidden with no transition, so nothing flashes then fades out on a fast load (26 Oct)

  // Leave with a short fade when the link goes to another page of the site.
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target === '_blank') return;
    var to = new URL(a.href, location.href);
    if (to.origin !== location.origin || to.pathname === location.pathname) return;   // same page: let the #section scroll happen
    e.preventDefault();
    d.classList.add('leaving');
    setTimeout(function () { location.href = to.href; }, 220);
  });

  // Reveal on scroll.
  var SEL = [
    '.hero h1', '.hero .byline', '.hero .ctas', '.hero .origin',
    'main h1', 'main h2', 'main h3', '.page-head p', 'main .intro', 'main .reading', 'main figure', 'main img',
    '.tile', '.steps li', '.facts > div', '.founder', '.kinds li', '.amounts > div', '.prose p', '.todo',
    '#list .row', '.panel', '.book .f', '.book .send', '.editions', '.ed-specs li', '.ed-name', 'main .buy', '.corp', '.tbc',
    '.route', 'details', '.ccard', '.details li', '.ptile', '.serve li', '.serve figure', '.story .cell > *', '.story figure', '.foot-in > *', '.grid > *', '.cards > *', 'main .wrap > p', 'main section > p'
  ].join(',');
  var seen = [];
  [].forEach.call(document.querySelectorAll(SEL), function (el) {
    if (el.closest('[data-reveal]') || el.closest('[data-slide]') || el.closest('#bag, .bag, dialog') || el.closest('.sitebar')) return;   // one reveal per block, never inside the bag drawer or the bar
    el.setAttribute('data-reveal', '');
    seen.push(el);
  });
  // blocks that slide in from the side (home Lounge) use the same observer; their CSS keys on [data-slide]
  [].forEach.call(document.querySelectorAll('[data-slide]'), function (el) { seen.push(el); });
  void d.offsetHeight;                                   // apply the hidden state at once
  requestAnimationFrame(function () { requestAnimationFrame(function () { d.classList.remove('mo-init'); }); });
  // a short stagger between neighbours that arrive together
  seen.forEach(function (el) {
    var i = 0, p = el.previousElementSibling;
    while (p && i < 6) { if (p.hasAttribute('data-reveal')) i++; p = p.previousElementSibling; }
    if (i) el.style.setProperty('--rd', (i * 0.08).toFixed(2) + 's');
  });
  function show(el) { el.classList.add('in'); }
  if (!('IntersectionObserver' in window)) { seen.forEach(show); return; }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } });
  }, { rootMargin: '0px', threshold: 0.01 });
  seen.forEach(function (el) { io.observe(el); });
  // A fast flick or a #section jump can carry a block past the screen between two frames: anything already above the bottom edge shows at once.
  var late = false;
  window.addEventListener('scroll', function () {
    if (late) return; late = true;
    setTimeout(function () { late = false; seen.forEach(function (el) { if (!el.classList.contains('in') && el.getBoundingClientRect().top < innerHeight) { show(el); io.unobserve(el); } }); }, 200);
  }, { passive: true });
  window.__motion = { count: seen.length };
})();
