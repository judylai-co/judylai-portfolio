# Judy Lai — Portfolio

Personal portfolio site for Judy Lai, senior brand & digital designer (Sydney, AU).
Plain static HTML/CSS/JS — no build step, no dependencies to install.

## Structure

```
index.html            Home — statement + four project covers
pendula.html          Case study
jessies-notes.html    Case study
saigon-bites.html     Case study
studio-optics.html    Case study
404.html
css/site.css          All shared styling (tokens, chrome, responsive)
js/site.js            Lazy video + lazy Lottie mounting
vendor/lottie.min.js  Self-hosted Lottie player (bodymovin 5.12.2)
assets/               Images, video, Lottie JSON
fonts/                Licensed typefaces — git-ignored, see below
_headers              Cloudflare Pages caching + security headers
```

## Working on it

There is nothing to install. Open `index.html` directly, or serve it so the
Lottie `fetch()` calls work (they need HTTP, not `file://`):

```bash
python3 -m http.server 8787
```

Then visit http://localhost:8787.

Shared styling lives in `css/site.css`. Layout that only appears once stays as
an inline `style` attribute on the element — the original design export was
inline-styled throughout, and only the repeated chrome (header, footer, hero,
problem/solution, media grids) was worth lifting into classes.

## Two things to resolve before launch

**1. Font licensing.** Founders Grotesk and Span are commercial typefaces from
Klim Type Foundry. The `.otf` files in `fonts/` are desktop-licensed only, so
they are git-ignored on purpose — publishing them would breach the licence.
Buy the web licence, drop the `.woff2` kit into `fonts/`, update the `@font-face`
`src`/`format` at the top of `css/site.css`, and remove `fonts/` from
`.gitignore`. Until then the deployed site falls back to system fonts.

**2. Media weight.** `assets/` is ~98 MB. Video is the bulk of it — the
showreel alone is 8.8 MB, and `sb-cover.json` (a Lottie with embedded base64
frames) is 5.6 MB on the home page. `js/site.js` already defers both until they
approach the viewport, but the files themselves still want re-encoding
(H.264 + WebM, poster frames) or moving to a video host.

## Deploy — Cloudflare Pages

Connect this repo and use:

- **Framework preset:** None
- **Build command:** *(leave empty)*
- **Build output directory:** `/`

Pages serves `/pendula.html` at `/pendula` and redirects the `.html` form to it.
Internal links keep the `.html` extension so the pages also work when opened
straight off disk; that costs one redirect hop per navigation. If you'd rather
avoid it, drop the extensions from the `href`s — they'll work on Pages but not
on `file://`.

`sitemap.xml`, `robots.txt` and the `og:*` tags all point at `judylai.co` —
update them if the domain differs.

## Notes on the port

This started as a design-tool export (`*.dc.html` + `support.js`), which was a
React-based prototyping runtime, not shippable output. The port removed it:

- `<x-dc>`, `<helmet>` and the `DCLogic` classes are gone
- `style-hover` attributes became real CSS `:hover` rules
- the `sc-for` loop and `image-slot` placeholder on the home page became the
  fourth project card (Studio Optics)
- Lottie is self-hosted instead of loaded from cdnjs, and mounts lazily
- added responsive breakpoints, `prefers-reduced-motion`, focus styles,
  page titles, meta/OG tags, alt text, and intrinsic video dimensions
