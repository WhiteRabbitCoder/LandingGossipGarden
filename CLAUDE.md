# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static multi-page landing site for **Gossip Garden** — an IoT plant monitoring product (ESP32 + sensors, FastAPI backend, MQTT/HiveMQ, AI personality). This repo contains only the marketing frontend; there is no backend or build step here.

## Running / Previewing

No build system. Open any `.html` file directly in a browser, or serve from a local HTTP server to avoid CORS issues with the Babel loader:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

JSX is transpiled in-browser by `@babel/standalone`. All scripts use `type="text/babel"`.

## Architecture

### Page structure

| File | Purpose |
|---|---|
| `index.html` | Main landing (entry point) |
| `Personalidades.html` | Plant personalities detail page |
| `Tienda.html` | Store / purchase page |
| `Como funciona.html` | How it works page |

Each page loads React 18 + Babel from CDN, then includes JSX files as `<script type="text/babel">`. `index.html` also loads **GSAP + ScrollTrigger** from CDN (used by the hero) and appends a **cache-buster** query to the JSX `<script src>` (e.g. `sections-v3.jsx?v=…`) — bump it whenever you change a JSX file so browsers fetch the new code. Note: `index.html` must **not** set `html{scroll-behavior:smooth}` — it breaks GSAP's scroll snapping.

### Component files

**`components/crayon-v3.jsx`** — Design system foundation. Must be loaded first by every page.
- Exports `PALETTE` (all brand colors as a constant object)
- `CrayonDefs` — injects SVG `<defs>` with filter IDs (`#cr`, `#cr-text`, `#crayon-fill`) that give the hand-drawn crayon look; must be rendered once at the root
- Primitives: `CrayonCard`, `CrayonButton`, `CrayonUnderline`, `SpeechBubble`
- Illustration: `HandIcon` (type-keyed SVG icons), `CrayonPot` (animated face SVG), `RealPot` (photo + mood overlay)
- `Reveal` — IntersectionObserver-based fade-in wrapper

**`components/sections-v3.jsx`** — All page sections for `index.html`: `Nav`, `ScrollStory`, `Features`, `Personalities`, `Variants`, `CTA`, `Footer`.
- `ScrollStory` (hero) — a `400vh` container with a `100vh` sticky pane that crossfades through **4 beats**, one per personality (Alegre → Dormilona → Dramática → Exigente). Each beat = left text panel + center pot + right card.
  - `Maceta360` — the centerpiece: a `<canvas>` that scrubs a **100-frame WebP turntable** (`assets/materas/maceta360/001…100.webp`) to scroll via **GSAP ScrollTrigger**. Falls back to the React `progress` value if GSAP is absent. High-quality `imageSmoothing` is re-set every draw (changing `canvas.width` resets ctx state).
  - **Wheel snapping**: a `wheel` listener hijacks scroll so one gesture advances exactly one beat (snap points `0, 1/3, 2/3, 1`). `FADE_START` (0.75) keeps each beat solid at those marks; at the first/last beat native scroll resumes so the page can exit.
  - Text/cards crossfade "through blank" (`Math.max(0,1-tE*2)` / `Math.max(0,tE*2-1)`) so two beats never overlap.
- `Personalities` — moodboard **collage**: a CSS-grid mosaic (`grid-template-areas`, class `gg-pers-mosaic` with media queries in `index.html`) of `CrayonCard` tiles over a circle accent, with drop shadows.
- `Variants` — 4 "sin cara" pots (`assets/materas/sincara/`); `PlantRotator` (inside `CTA`) crossfades 4 face pots (`assets/materas/animadas/`) on a timer.

**`components/tweaks-panel.jsx`** — Floating design-tweak panel (loaded by `index.html`). Provides:
- `useTweaks(defaults)` hook — syncs values with host via `postMessage` (`__edit_mode_set_keys`) and persists to the `/*EDITMODE-BEGIN*/…/*EDITMODE-END*/` JSON block in the HTML file
- `TweaksPanel` shell + controls: `TweakSelect`, `TweakSlider`, `TweakToggle`, `TweakColor`, `TweakNumber`, `TweakText`, `TweakRadio`

### Module system

There are **no ES modules**. Every file ends with `Object.assign(window, { ... })` to expose its exports globally. Load order in the HTML `<script>` tags matters: `components/crayon-v3.jsx` → `components/sections-v3.jsx` → `components/tweaks-panel.jsx` → inline app.

### Folder layout

```
index.html, Personalidades.html, Tienda.html, Como funciona.html, style-guide.html
components/   crayon-v3.jsx, sections-v3.jsx, tweaks-panel.jsx
assets/
  icons/           icon-crayon.png (logo)
  materas/         pot photos + color variants; plus subfolders:
    maceta360/       001–100.webp — hero turntable frames (scroll-scrubbed)
    sincara/         1–4.webp — faceless pots for the Variants section
    animadas/        1–4.webp — face pots cycled by PlantRotator (CTA)
  personalidades/  {alegre,dormilona,dramatica,exigente}.webp — collage pots (+ legacy FELIZ/TRISTE/BRAVA/DORMILON png)
docs/         DESIGN-SYSTEM.md + product docs (marketing / technical)
```

**Image convention:** pot art is delivered as PNG and pre-processed into **WebP** with a small Python+Pillow script (Pillow has no numpy here): trim transparent margins (or flood-fill a white bg from the edges), **center the pot cylinder** in the frame, then `save(..., "WEBP", quality≈90)`. The `<img>`/`<canvas>` drag + selection is disabled globally via CSS (`user-drag/user-select:none`) plus a `dragstart` preventer in `index.html`.

### Typography tweaks

Each page wires `useTweaks(TWEAK_DEFAULTS)` with `hf` (heading font) and `bf` (body font) keys. The `t` object is passed as a prop to all sections and applied via `style={{ fontFamily: t.hf }}`. Available fonts: `Nunito`, `Quicksand`, `Caveat`.

## Design constraints

- **No emojis** — all icons are hand-drawn SVGs via `HandIcon` or inline paths with `filter="url(#cr)"` for the crayon jitter effect
- **Crayon filters must be in scope** — any new SVG element that needs the hand-drawn look needs `filter="url(#cr)"` (shapes) or `filter="url(#cr-text)"` (type); these filters are injected by `<CrayonDefs/>` at the app root
- **PALETTE** is the single source of truth for all colors; never hardcode hex values that exist there
- The `assets/materas/pot-real.png` asset is a photo used as the hero; `assets/icons/icon-crayon.png` is the logo icon

## Product context

Gossip Garden sells an IoT smart pot kit: ESP32 microcontroller with DHT22 (temperature/humidity), GY-30 (light), and SEN0193 (soil moisture) sensors. The AI gives each plant a personality (Alegre, Dormilona, Dramática, Exigente) and initiates conversations proactively when the plant needs care. Backend is FastAPI + Docker; data is split between PostgreSQL (users/social) and MongoDB (sensor time-series, 30-day retention).
