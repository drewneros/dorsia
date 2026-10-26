// Scroll films: scrolling through a pinned section scrubs its video, p = 0..1 maps to 0..duration.
// One on the home page since round 15 (the hero is a photo): the Gift Box pour (desktop: #gifts pins and the pour plays across it;
// phones: it plays while #box-film passes up the screen).
// Scroll back and the film plays backwards. With reduced motion, no JS, or a video that cannot load, the poster frame stays.
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var debug = location.protocol === 'file:' || /[?&]debug/.test(location.search);   // test hooks only for local checks
  var clamp = function (x, a, b) { return Math.max(a, Math.min(b, x)); };

  // pass: a function. True = play while `passEl` crosses the screen (no pin); false = play across the pinned `section`.
  function scrollFilm(section, video, onClass, hook, pass, passEl) {
    var shown = -1, last = 0, queued = false, running = false, triedBlob = false;
    var state = { p: 0, t: 0, ready: false };
    if (debug) window[hook] = state;

    // How far through the pinned section the page is.
    function progress() {
      var r = section.getBoundingClientRect(), vh = window.innerHeight;
      if (pass()) { var b = passEl.getBoundingClientRect(); return clamp((vh * 0.9 - b.top) / (vh * 0.75), 0, 1); }
      var run = section.offsetHeight - vh * (1 + (+section.dataset.tail || 0));   // data-tail: screens held still after the film ends
      return run > 0 ? clamp(-r.top / run, 0, 1) : 0;
    }

    // The film follows the scroll with a short critically damped glide (about 0.12 s, no bounce), so a flick of the wheel
    // plays smoothly instead of jumping. It always starts from where it is, so it can be reversed at any moment.
    function draw(snap) {
      var d = video.duration;
      if (!running || !d || !isFinite(d)) return;
      var target = progress(), now = performance.now();
      if (shown < 0 || snap === true) shown = target;
      else shown += (target - shown) * (1 - Math.exp(-Math.min(64, now - last) / 120));
      last = now;
      if (Math.abs(target - shown) < 5e-4) shown = target;
      var t = Math.min(shown * d, d - 0.04);
      if (snap === true || !video.seeking) {
        if (Math.abs(video.currentTime - t) > 0.005) video.currentTime = t;
        state.p = +shown.toFixed(4); state.t = +t.toFixed(3);
        section.style.setProperty('--pour', shown.toFixed(3));
      }
      if (shown !== target || video.seeking) queue();
    }
    function queue() {
      if (queued) return;
      queued = true; last = last || performance.now();
      requestAnimationFrame(function () { queued = false; draw(); });
    }
    if (debug) window[hook + 'Draw'] = function () { draw(true); };

    function start() {
      if (running) return;
      // Some hosts cannot serve a video in ranges. If the file is not fully seekable, load it whole once and scrub that copy.
      var s = video.seekable;
      if (!triedBlob && s && s.length && s.end(s.length - 1) < video.duration - 0.5) { return toBlob(); }
      running = true; state.ready = true;
      document.documentElement.classList.add(onClass);
      window.addEventListener('scroll', queue, { passive: true });
      window.addEventListener('resize', queue);
      draw(true);
    }
    function toBlob() {
      triedBlob = true;
      fetch(video.currentSrc || video.src).then(function (r) { return r.blob(); }).then(function (b) {
        video.src = URL.createObjectURL(b); video.load();
      }).catch(function () {});
    }

    video.addEventListener('loadeddata', start);
    video.addEventListener('error', function () { if (!triedBlob) toBlob(); });
    if (video.readyState >= 2) start();
    // Phone data (24 Oct): the film is 2 MB. Where it pins (desktop) it loads at once, because loading it late would grow the
    // pinned section under the visitor. Elsewhere (phones) it downloads only when its section is about two and a half screens away (so a slow phone has it ready before the visitor arrives).
    var fetchNow = function () { if (video.preload !== 'auto') { video.preload = 'auto'; video.load(); } };
    if (!pass()) fetchNow();
    else if ('IntersectionObserver' in window) {
      var near = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { fetchNow(); near.disconnect(); } }, { rootMargin: '250% 0px' });
      near.observe(section);
    } else fetchNow();
    loaders.push(fetchNow);
  }

  // The Gift Box pins only where index.html's CSS pins it (same query); elsewhere it plays as it passes. Checked live, so a rotation or resize switches mode.
  var PIN = window.matchMedia('(min-width:901px) and (min-height:760px)');
  var loaders = [];   // each film's fetchNow: a rotation into pin mode loads the film at once so the pinned section does not grow later
  var notPinned = function () { return !PIN.matches; };
  var films = [['gifts', 'box-film', 'box-on', '__box', notPinned]];
  films.forEach(function (f) {
    var section = document.getElementById(f[0]), box = document.getElementById(f[1]);
    var video = box && box.querySelector('video');
    if (section && video) scrollFilm(section, video, f[2], f[3], f[4], box);
  });
  if (PIN.addEventListener) PIN.addEventListener('change', function () { if (PIN.matches) loaders.forEach(function (f) { f(); }); window.dispatchEvent(new Event('resize')); });
})();
