// One list of caviars for every page (4 since round 14, Drew 23 Oct). grain = egg size, colour, flavour (home grain band); tone = CSS filter that recolours the band's pearls to match (same five functions in the same order for every caviar, so the change fades instead of snapping); taste = salt, butter, grain, finish in % (home story bars). Both are general placeholders until the client's tasting notes. Species are the standard ones for each name and must be confirmed by the client before launch.
window.DORSIA_CAVIARS = [
  { id: 'beluga-royal', tone: 'sepia(0) saturate(.15) hue-rotate(0deg) brightness(1.35) contrast(.95)', grain: ['3.5 mm and up', 'Pale to dark grey', 'Creamy, long finish'], taste: [55, 90, 95, 85], line: 'The largest grain, soft and creamy', from: null, name: 'Beluga Royal', c: 'var(--c-beluga-royal)', species: 'Beluga sturgeon, Huso huso', family: 'Beluga' },
  { id: 'premium-oscietra', tone: 'sepia(.55) saturate(1.5) hue-rotate(-8deg) brightness(1.18) contrast(1)', grain: ['2.8 to 3.2 mm', 'Golden brown', 'Nutty, rounded'], taste: [65, 70, 70, 80], line: 'A medium grain, firm and nutty', from: null, name: 'Premium Oscietra', c: 'var(--c-oscietra)', species: 'Persian sturgeon, Acipenser persicus', family: 'Oscietra' },
  { id: 'premium-sevruga', tone: 'sepia(0) saturate(.05) hue-rotate(0deg) brightness(.9) contrast(1.15)', grain: ['2.2 to 2.5 mm', 'Dark steel grey', 'Briny, intense'], taste: [90, 45, 40, 70], line: 'A small grain, the most intense', from: null, name: 'Premium Sevruga', c: 'var(--c-sevruga)', species: 'Starry sturgeon, Acipenser stellatus', family: 'Sevruga' },
  { id: 'baerii', tone: 'sepia(0) saturate(1.1) hue-rotate(0deg) brightness(.78) contrast(1.05)', grain: ['2.5 to 2.8 mm', 'Deep brown', 'Balanced, gentle'], taste: [60, 60, 55, 60], line: 'Balanced, a good first caviar', from: null, name: 'Baerii', c: 'var(--c-baerii)', species: 'Siberian sturgeon, Acipenser baerii', family: 'Baerii' }
];
window.DORSIA_SIZES = [30, 50, 100, 125, 250];

// The gold lid as SVG, with the caviar's colour band. Used on the shop and product pages.
window.dorsiaLid = function (colour, label) {
  return '<svg viewBox="0 0 220 220" role="img" aria-label="' + (label || 'Dorsiah lid') + '">' +
    '<defs><radialGradient id="lg" cx="40%" cy="34%" r="78%"><stop offset="0" stop-color="#f6e8c0"/><stop offset=".5" stop-color="#d8b46e"/><stop offset="1" stop-color="#9a7638"/></radialGradient>' +
    '<path id="ltp" d="M 60 110 A 50 50 0 0 1 160 110"/><path id="lbp" d="M 36 110 A 74 74 0 0 0 184 110"/></defs>' +
    '<circle cx="110" cy="110" r="106" fill="none" style="stroke:' + colour + '" stroke-width="7"/>' +
    '<circle cx="110" cy="110" r="96" fill="url(#lg)" stroke="#8a6930" stroke-width="1"/>' +
    '<circle cx="110" cy="110" r="90" fill="none" stroke="#7a5a24" stroke-width="1.6"/>' +
    '<circle cx="110" cy="110" r="84" fill="none" stroke="#f7e9c4" stroke-opacity=".6" stroke-width=".8"/>' +
    '<g font-family="Marcellus, Georgia, serif" font-size="21" letter-spacing="3" text-anchor="middle"><text fill="#fff3d2" fill-opacity=".75" transform="translate(0 .9)"><textPath href="#ltp" startOffset="50%">DORSIAH</textPath></text><text fill="#6e5020"><textPath href="#ltp" startOffset="50%">DORSIAH</textPath></text></g>' +
    '<g font-family="Marcellus, Georgia, serif" font-size="11.5" letter-spacing="4.5" text-anchor="middle"><text fill="#fff3d2" fill-opacity=".7" transform="translate(0 .7)"><textPath href="#lbp" startOffset="50%">MILANO</textPath></text><text fill="#6e5020"><textPath href="#lbp" startOffset="50%">MILANO</textPath></text></g>' +
    '<path d="M 82 96 Q 110 82 138 96" fill="none" stroke="#6e5020" stroke-width="1.3" stroke-linecap="round"/><circle cx="110" cy="120" r="13" fill="none" stroke="#6e5020" stroke-width="1.2"/></svg>';
};

// Collection card (round 14 C8, Volzhenka style): soft grey card, lid centred, name, one short line, price. Home and shop both use it.
// from = lowest price in EUR once the client sends prices; until then the card says "Price to come".
window.dorsiaCard = function (c) {
  return '<a class="card" href="product.html#' + c.id + '"><div class="card-art">' + window.dorsiaLid(c.c, c.name + ' lid') + '</div>' +
    '<b class="card-name">' + c.name + '</b><span class="card-line">' + c.line + '</span>' +
    '<span class="card-price">' + (c.from ? 'From EUR ' + c.from : 'Price to come') + '</span></a>';
};
