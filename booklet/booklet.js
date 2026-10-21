// Programme booklet: page-turning via StPageFlip (vendor/page-flip.browser.js, MIT).
// Add ?print to the URL to lay the pages out flat for PDF generation.
(function () {
  if (new URLSearchParams(location.search).has('print')) {
    document.body.classList.add('is-print');
    return;
  }

  const bookEl = document.getElementById('book');
  const prev = document.getElementById('prev');
  const next = document.getElementById('next');
  const info = document.getElementById('pageinfo');
  if (!window.St || !bookEl) return;

  const pages = bookEl.querySelectorAll('.page');
  const flip = new St.PageFlip(bookEl, {
    width: 420,
    height: 594,
    size: 'stretch',
    minWidth: 320,
    maxWidth: 620,
    minHeight: 452,
    maxHeight: 877,
    showCover: true,
    usePortrait: true,
    mobileScrollSupport: false,
    maxShadowOpacity: 0.35,
    flippingTime: 800
  });
  flip.loadFromHTML(pages);

  const total = flip.getPageCount();
  const label = (i) => {
    if (i === 0) return 'Cover';
    if (i === total - 1) return 'Back cover';
    const portrait = flip.getOrientation && flip.getOrientation() === 'portrait';
    if (portrait || i + 1 >= total - 1) return `Page ${i + 1} of ${total}`;
    return `Pages ${i + 1}–${i + 2} of ${total}`;
  };
  const frame = bookEl.parentElement;
  const update = () => {
    const i = flip.getCurrentPageIndex();
    const landscape = flip.getOrientation() !== 'portrait';
    frame.classList.toggle('is-start', landscape && i === 0);
    frame.classList.toggle('is-end', landscape && i === total - 1);
    info.textContent = label(i);
    prev.disabled = i === 0;
    next.disabled = i >= total - 1;
  };

  flip.on('flip', update);
  flip.on('changeOrientation', update);
  prev.addEventListener('click', () => flip.flipPrev());
  next.addEventListener('click', () => flip.flipNext());
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'PageDown') flip.flipNext();
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') flip.flipPrev();
    if (e.key === 'Home') flip.turnToPage(0), update();
  });
  update();
})();
