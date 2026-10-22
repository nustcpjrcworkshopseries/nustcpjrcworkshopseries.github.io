// ==========================================================
// Event settings: the countdown runs to `start`; dates in the page use start and end.
// Set `start` to null to show the fallback text in index.html and hide the countdown.
// ==========================================================
const EVENT = {
  start: '2026-11-18T09:00:00+05:00',
  end: '2026-11-20T12:15:00+05:00'
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
  const items = document.querySelectorAll('.section__head, .about__text, .about__figure, .chain, .audience-band > *, .booklet-band__inner, .days, .outcomes, .person, .prepare > *, .register > *, .venue > *');
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

// ---------- Programme: one day at a time ----------
(function () {
  const tabs = document.querySelector('.day-tabs');
  const list = document.querySelector('.days');
  if (!tabs || !list) return;
  const buttons = [...tabs.querySelectorAll('[role="tab"]')];

  function select(btn, focus) {
    buttons.forEach((b) => {
      const on = b === btn;
      b.setAttribute('aria-selected', String(on));
      b.tabIndex = on ? 0 : -1;
      document.getElementById(b.getAttribute('aria-controls')).classList.toggle('is-active', on);
    });
    if (focus) btn.focus();
  }

  tabs.hidden = false;
  list.classList.add('is-tabbed');
  buttons.forEach((b) => b.addEventListener('click', () => select(b)));
  tabs.addEventListener('keydown', (e) => {
    const i = buttons.indexOf(document.activeElement);
    if (i < 0) return;
    if (e.key === 'ArrowRight') select(buttons[(i + 1) % buttons.length], true);
    if (e.key === 'ArrowLeft') select(buttons[(i - 1 + buttons.length) % buttons.length], true);
  });

  // During the workshop, open on today's day
  let start = 0;
  if (EVENT.start) {
    const d = Math.floor((Date.now() - new Date(EVENT.start).setHours(0, 0, 0, 0)) / 864e5);
    if (d >= 0 && d < buttons.length) start = d;
  }
  select(buttons[start]);
})();
