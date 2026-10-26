// Round 14 menu (Drew 23 Oct): one 2-line hamburger on the left of the bar at every width, Saray's icon (22x16, 1.5px lines, turns into an X).
// The panel holds Dorsiah Lounge, Boutique (opens Caviar collection + Gifts), Dorsiah Art, Become a member, Search. Load after shell.js.
(function () {
  var bar = document.querySelector('.sitebar'), slot = bar && bar.querySelector('.menu-li');
  if (!slot) return;
  var home = /index\.html$|\/$/.test(location.pathname) ? '' : 'index.html';
  var here = location.pathname.split('/').pop() || 'index.html';
  function a(href, text) { return '<a href="' + href + '"' + (href === here ? ' aria-current="page"' : '') + '>' + text + '</a>'; }
  slot.innerHTML = '<button type="button" class="menu-toggle" aria-label="Menu" aria-expanded="false" aria-controls="menu-panel"><span></span><span></span></button>';
  var panel = document.createElement('nav'); panel.id = 'menu-panel'; panel.className = 'menu-panel'; panel.hidden = true; panel.setAttribute('aria-label', 'Menu');
  panel.innerHTML = a(home + '#lounge', 'Dorsiah Lounge') +
    '<button type="button" class="menu-sub" aria-expanded="false" aria-controls="menu-boutique">Boutique</button>' +
    '<div class="menu-boutique" id="menu-boutique" hidden>' + a('shop.html', 'Caviar collection') + a(home + '#gifts', 'Gifts') + '</div>' +
    a('art.html', 'Dorsiah Art') + a('member.html', 'Become a member') + a('search.html', 'Search') +
    '<a class="menu-lang" href="#" aria-label="Language: English. Italian coming">EN / IT</a>';
  bar.appendChild(panel);
  var btn = slot.firstChild, sub = panel.querySelector('.menu-sub'), box = panel.querySelector('.menu-boutique');
  function set(open) {
    panel.hidden = !open; btn.setAttribute('aria-expanded', open); btn.setAttribute('aria-label', open ? 'Close menu' : 'Menu'); bar.classList.toggle('menu-open', open);
    if (open) panel.querySelector('a, button').focus({ preventScroll: true });   // keyboard users land in the menu, not on the logo behind it
  }
  btn.addEventListener('click', function () { set(panel.hidden); });
  sub.addEventListener('click', function () { var o = box.hidden; box.hidden = !o; sub.setAttribute('aria-expanded', o); });
  panel.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) { set(false); btn.focus(); } });
  document.addEventListener('click', function (e) { if (!panel.hidden && !bar.contains(e.target)) set(false); });
})();
