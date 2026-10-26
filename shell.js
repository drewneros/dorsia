// Shared header and footer for the inner pages. Runs before bag.js so the Bag link gets wired.
(function () {
  var here = (location.pathname.split('/').pop() || 'index.html');
  function a(href, text) { return '<a href="' + href + '"' + (href === here ? ' aria-current="page"' : '') + '>' + text + '</a>'; }
  var head = document.getElementById('site-head');
  if (head) head.outerHTML =
    '<div class="sitebar gutter"><p class="strip">Delivered chilled across Italy and the EU</p><div class="sitebar-in"><nav class="nav" aria-label="Main">' +
      '<ul class="l"><li class="menu-li"></li></ul>' +
      '<a class="mark" href="index.html" aria-label="Dorsiah home">DORSIAH</a>' +
      '<ul class="r"><li class="lang"><a href="#" aria-label="Language: English. Italian coming">EN / IT</a></li><li><a href="#" data-bag-open>Bag (<span data-bag-count>0</span>)</a></li></ul>' +
    '</nav></div></div>';
  var foot = document.getElementById('site-foot');
  if (foot) foot.outerHTML =
    '<footer class="foot gutter"><div class="foot-in">' +
      '<div class="foot-brand"><span class="foot-mark">DORSIAH</span><p class="foot-line">Persian caviar, from Rasht to Milano.</p></div>' +
      '<nav class="foot-links" aria-label="Footer">' + a('shop.html', 'Shop') + a('index.html#gifts', 'The Gift Box') + a('index.html#lounge', 'Dorsiah Lounge') + a('guide.html', 'Caviar Guide') + a('delivery.html', 'Delivery and Care') + a('contact.html', 'Contact') + '</nav>' +
      '<div class="foot-contact"><span class="eyebrow">Contact</span><p>Milano. Address, phone and WhatsApp come from the client before launch.</p></div>' +
      '<p class="foot-legal">' + a('legal.html', 'Terms, privacy and company details') + '. CITES export note goes here before launch.</p>' +
    '</div></footer>';
})();
