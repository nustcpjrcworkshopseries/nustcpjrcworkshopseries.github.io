# NUST × CPJRC Workshop Series — 2026

One-page site for the 2026 edition of the **UAV Remote Sensing for Disaster Management** training,
jointly organised by the China–Pakistan Joint Research Center on Earth Sciences (CPJRC), IGIS and SCEE, NUST.

Plain HTML/CSS/JS, served by GitHub Pages — no build step.

- `index.html` — all content
- `styles.css` — design
- `script.js` — navigation, countdown, copy buttons
- `assets/` — logos and photos

## Setting the dates

Edit the `EVENT` object at the top of `script.js`, e.g.

```js
const EVENT = { start: '2026-11-16T09:00:00+05:00', end: '2026-11-19T17:00:00+05:00' };
```

The dates in the hero update automatically and a live countdown appears.
While `start` is `null` the page shows "dates to be announced".
