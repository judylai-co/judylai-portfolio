# Judy Lai — Portfolio

Personal portfolio site for Judy Lai, senior brand & digital designer (Sydney, AU).
Deployed via Cloudflare Pages.

## Current state

This repo currently holds the **design-tool export**, not a production site:

- `*.dc.html` — page markup, styled inline
- `support.js` / `image-slot.js` — the export's prototyping runtime (`<x-dc>`,
  `style-hover`). Not shippable; both must be removed during the port.
- `assets/` — final images and video used by the pages
- `uploads/` — raw originals and duplicates (git-ignored, ~129 MB)
- `fonts/` — desktop `.otf` files (git-ignored, see Fonts below)

## Pages

| Page | Source |
| --- | --- |
| Home | `Home.dc.html` |
| Pendula | `Project-Pendula.dc.html` |
| Jessie's Notes | `Project-JessiesNotes.dc.html` |
| Saigon Bites | `Project-SaigonBites.dc.html` |
| Studio Optics | `Project-StudioOptics.dc.html` |

## Fonts

Founders Grotesk and Span are commercial typefaces from Klim Type Foundry.
The `.otf` files here are **desktop-licensed only** and are git-ignored on
purpose — serving them from a public site or repo is a licence breach.
Before launch, buy the web licence and drop the `.woff2` kit in place.

## Media

`assets/` is ~98 MB, including several multi-megabyte MP4s. Before launch these
should be re-encoded (H.264 + WebM, poster frames, `preload="none"`) or moved to
a video host — Cloudflare Pages serves them fine, but the page weight will not.

## Deploy

Cloudflare Pages, connected to this repo's `main` branch.
