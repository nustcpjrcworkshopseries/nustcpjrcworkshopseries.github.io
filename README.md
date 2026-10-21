# NUST × CPJRC Workshop Series — 2026

One-page site for the **Training Workshop on Multi-Scale Remote Sensing for Disaster Management**
(18–20 November 2026), jointly organised by the China–Pakistan Joint Research Center on Earth Sciences (CPJRC)
and IGIS, School of Civil and Environmental Engineering, NUST.

Plain HTML/CSS/JS served by GitHub Pages, with no build step.

- `index.html`: all content
- `styles.css`: design
- `script.js`: navigation, countdown, copy buttons
- `assets/`: logos and photos

## Setting the dates

Edit the `EVENT` object at the top of `script.js`, e.g.

```js
const EVENT = { start: '2026-11-18T09:00:00+05:00', end: '2026-11-20T12:15:00+05:00' };
```

The countdown in the header runs to `start`. Set `start` to `null` to hide it.

## Programme booklet

`booklet/` is a page-turning version of the programme (uses the MIT-licensed
[StPageFlip](https://github.com/Nodlik/StPageFlip), vendored in `booklet/vendor/`).
After changing its content, regenerate the PDF from the same pages:

```bash
node tools/build-booklet-pdf.mjs
```
