// ==========================================================
// Event settings — edit these once the 2026 dates are fixed.
// Leave `start` as null to show "dates to be announced" and hide the countdown.
// Example: start: '2026-11-16T09:00:00+05:00', end: '2026-11-19T17:00:00+05:00'
// ==========================================================
const EVENT = {
  start: null,
  end: null
};

// ---------- Dates & countdown ----------
(function () {
  if (!EVENT.start) return;
  const start = new Date(EVENT.start);
  const end = EVENT.end ? new Date(EVENT.end) : start;
  if (isNaN(start)) return;

  const tz = { timeZone: 'Asia/Karachi' };
  const day = (d) => d.toLocaleDateString('en-GB', { ...tz, day: 'numeric' });
  const month = (d) => d.toLocaleDateString('en-GB', { ...tz, month: 'long' });
  const year = (d) => d.toLocaleDateString('en-GB', { ...tz, year: 'numeric' });
  const label = month(start) === month(end)
    ? `${day(start)}–${day(end)} ${month(end)} ${year(end)}`
    : `${day(start)} ${month(start)} – ${day(end)} ${month(end)} ${year(end)}`;
  document.querySelectorAll('[data-event-dates]').forEach((el) => { el.textContent = label; });

  const box = document.getElementById('countdown');
  if (!box) return;
  const units = {
    d: box.querySelector('[data-unit="d"]'),
    h: box.querySelector('[data-unit="h"]'),
    m: box.querySelector('[data-unit="m"]'),
    s: box.querySelector('[data-unit="s"]')
  };
  const pad = (n) => String(n).padStart(2, '0');

  function tick() {
    const ms = start - Date.now();
    if (ms <= 0) {
      box.hidden = true;
      clearInterval(timer);
      return;
    }
    units.d.textContent = pad(Math.floor(ms / 864e5));
    units.h.textContent = pad(Math.floor(ms / 36e5) % 24);
    units.m.textContent = pad(Math.floor(ms / 6e4) % 60);
    units.s.textContent = pad(Math.floor(ms / 1e3) % 60);
    box.hidden = false;
  }
  const timer = setInterval(tick, 1000);
  tick();
})();

// ---------- Navigation ----------
(function () {
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');

  const onScroll = () => nav.classList.toggle('is-solid', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const setOpen = (open) => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  toggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
  links.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });

  // Highlight the section currently in view
  const map = new Map();
  links.querySelectorAll('a[href^="#"]').forEach((a) => {
    const sec = document.querySelector(a.getAttribute('href'));
    if (sec) map.set(sec, a);
  });
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          links.querySelectorAll('a.is-active').forEach((a) => a.classList.remove('is-active'));
          map.get(en.target).classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    map.forEach((_, sec) => io.observe(sec));
  }
})();

// ---------- Copy bank details ----------
document.querySelectorAll('.copy').forEach((btn) => {
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(btn.dataset.copy);
      btn.textContent = 'Copied';
      btn.classList.add('is-done');
      setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('is-done'); }, 1800);
    } catch (e) {
      btn.textContent = 'Select & copy';
    }
  });
});

// ---------- Gentle reveal on scroll ----------
(function () {
  if (!('IntersectionObserver' in window)) return;
  const items = document.querySelectorAll('.section__head, .about__text, .about__figure, .day, .person, .register > *, .venue > *');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add('is-visible');
        io.unobserve(en.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  items.forEach((el) => { el.classList.add('reveal'); io.observe(el); });
})();
