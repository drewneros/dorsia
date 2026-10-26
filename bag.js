// Component 3: the bag drawer. One shared bag for every page.
// Any element with data-bag-open opens it, any element with data-bag-count shows the item count.
// Pages call DorsiaBag.add({id, name, c, size}) to add a tin.
(function () {
  var KEY = 'dorsia-bag';
  var items = [];
  try { items = JSON.parse(localStorage.getItem(KEY) || '[]') || []; } catch (e) { items = []; }
  // storage is shared by every page on this host: keep only well-formed lines and a real quantity (security review 24 Oct)
  items = (Array.isArray(items) ? items : []).filter(function (it) { return it && typeof it.id === 'string' && typeof it.name === 'string'; })
    .map(function (it) { it.qty = Math.min(10, Math.max(1, parseInt(it.qty, 10) || 1)); return it; });
  function save() { try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) {} }

  var scrim = document.createElement('div');
  scrim.className = 'bag-scrim';
  var bag = document.createElement('aside');
  bag.className = 'bag';
  bag.id = 'bag';
  bag.hidden = true;
  bag.setAttribute('role', 'dialog');
  bag.setAttribute('aria-modal', 'true');
  bag.setAttribute('aria-labelledby', 'bag-title');
  bag.innerHTML =
    '<div class="bag-head"><h2 id="bag-title">Your bag</h2><button type="button" class="bag-close" id="bag-close">Close</button></div>' +
    '<div class="bag-body" id="bag-body"></div>' +
    '<div class="bag-foot" id="bag-foot">' +
      '<div class="bag-row"><span>Delivery</span><span>Zones to come</span></div>' +
      '<div class="bag-row total"><span>Total</span><span id="bag-total">Shown once prices are set</span></div>' +
      '<p class="bag-cold">Delivery zones, cold-chain packing and the delivery-day choice come from the client before launch.</p>' +
      '<button type="button" class="btn" id="bag-checkout" aria-disabled="true">Checkout opens at launch</button>' +
      '<span class="bag-host">Ordering 500 g or more, or for a villa or yacht? <a href="#" id="bag-host">Message your host</a></span>' +
    '</div>';
  document.body.appendChild(scrim);
  document.body.appendChild(bag);

  var body = bag.querySelector('#bag-body');
  var foot = bag.querySelector('#bag-foot');
  var lastFocus = null;

  function esc(t) { return String(t).replace(/[&<>"']/g, function (c) { return '&#' + c.charCodeAt(0) + ';'; }); }
  // The same pictures as the rest of the site: the item's own photo when it has one (the Gift Box), otherwise the real lid.
  function thumb(it) {
    if (it.img && /^media\/[\w.-]+\.jpg$/.test(it.img)) return '<span class="bag-thumb photo" aria-hidden="true"><img src="' + it.img + '" alt=""></span>';
    if (window.dorsiaLid) return '<span class="bag-thumb lid" aria-hidden="true">' + window.dorsiaLid(safeColour(it.c), '') + '</span>';
    return '<span class="bag-thumb" aria-hidden="true"></span>';
  }
  function safeColour(c) { return /^var\(--c-[a-z-]+\)$/.test(c) ? c : 'var(--stone)'; }
  function count() { return items.reduce(function (n, it) { return n + it.qty; }, 0); }

  function render() {
    document.querySelectorAll('[data-bag-count]').forEach(function (el) { el.textContent = count(); });
    if (!items.length) {
      var browse = document.getElementById('collection') ? '#collection' : 'shop.html';   // the collection lives on the home page; inner pages go to the shop
      body.innerHTML = '<div class="bag-empty"><p>Your bag is empty.</p><a class="btn secondary" href="' + browse + '" id="bag-browse">Choose your caviar</a></div>';
      foot.hidden = true;
      body.querySelector('#bag-browse').addEventListener('click', function () { close(); });
      return;
    }
    foot.hidden = false;
    var gift = bag.dataset.gift === '1';
    var note = bag.dataset.note || '';
    body.innerHTML = '<ul class="bag-items">' + items.map(function (it, i) {
      return '<li class="bag-item" style="--c:' + safeColour(it.c) + '">' +
        thumb(it) +
        '<div class="bag-info"><b>' + esc(it.name) + '</b><span>' + (it.label ? esc(it.label) : esc(it.size) + ' g tin') + '</span>' +
          '<div class="bag-qty" role="group" aria-label="Quantity of ' + esc(it.name) + ' ' + esc(it.size) + ' g">' +
            '<button type="button" data-i="' + i + '" data-d="-1" aria-label="One less">&minus;</button>' +
            '<output>' + it.qty + '</output>' +
            '<button type="button" data-i="' + i + '" data-d="1" aria-label="One more">+</button>' +
          '</div></div>' +
        '<div class="bag-side"><span>Price to come</span><button type="button" class="bag-remove" data-remove="' + i + '">Remove</button></div>' +
      '</li>';
    }).join('') + '</ul>' +
    '<div class="bag-gift"><label><input type="checkbox" id="bag-gift"' + (gift ? ' checked' : '') + '> This is a gift</label>' +
      (gift ? '<textarea id="bag-note" maxlength="240" placeholder="Your note, handwritten on a Dorsiah card">' + note.replace(/</g, '&lt;') + '</textarea><small>Up to 240 characters.</small>' : '') +
    '</div>';

    body.querySelectorAll('[data-d]').forEach(function (b) {
      b.addEventListener('click', function () {
        var i = +b.dataset.i, it = items[i];
        if (it.qty + +b.dataset.d < 1) { items.splice(i, 1); save(); render(); bag.querySelector('#bag-close').focus(); return; }   // minus at 1 removes the tin
        it.qty = Math.min(10, it.qty + +b.dataset.d);
        save(); render();
      });
    });
    body.querySelectorAll('[data-remove]').forEach(function (b) {
      b.addEventListener('click', function () { items.splice(+b.dataset.remove, 1); save(); render(); bag.querySelector('#bag-close').focus(); });
    });
    var g = body.querySelector('#bag-gift');
    g.addEventListener('change', function () { bag.dataset.gift = g.checked ? '1' : ''; render(); if (g.checked) body.querySelector('#bag-note').focus(); });
    var n = body.querySelector('#bag-note');
    if (n) n.addEventListener('input', function () { bag.dataset.note = n.value; });
  }

  function open() {
    lastFocus = document.activeElement;
    bag.hidden = false;
    requestAnimationFrame(function () { bag.classList.add('open'); scrim.classList.add('open'); });
    document.documentElement.classList.add('bag-lock');
    bag.querySelector('#bag-close').focus();
  }
  function close() {
    bag.classList.remove('open'); scrim.classList.remove('open');
    document.documentElement.classList.remove('bag-lock');
    setTimeout(function () { if (!bag.classList.contains('open')) bag.hidden = true; }, 360);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  bag.querySelector('#bag-close').addEventListener('click', close);
  scrim.addEventListener('click', close);
  bag.querySelector('#bag-host').addEventListener('click', function (e) { e.preventDefault(); });
  bag.querySelector('#bag-checkout').addEventListener('click', function (e) { e.preventDefault(); });
  document.addEventListener('keydown', function (e) {
    if (!bag.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'Tab') {
      // only controls you can actually see: the footer is hidden when the bag is empty
      var f = [].filter.call(bag.querySelectorAll('button:not([disabled]),a[href],input,textarea'), function (el) { return el.getClientRects().length > 0; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  document.querySelectorAll('[data-bag-open]').forEach(function (el) {
    el.addEventListener('click', function (e) { e.preventDefault(); open(); });
  });

  window.DorsiaBag = {
    add: function (t) {
      var hit = items.find(function (it) { return it.id === t.id && it.size === t.size; });
      if (hit) hit.qty = Math.min(10, hit.qty + 1);
      else items.push({ id: t.id, name: t.name, c: t.c, size: t.size, label: t.label, img: t.img, qty: 1 });
      save(); render(); open();
    },
    open: open, close: close,
    items: function () { return items.slice(); }
  };
  render();
})();
