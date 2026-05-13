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

Each page loads React 18 + Babel from CDN, then includes JSX files as `<script type="text/babel">`.

### Component files

**`components/crayon-v3.jsx`** — Design system foundation. Must be loaded first by every page.
- Exports `PALETTE` (all brand colors as a constant object)
- `CrayonDefs` — injects SVG `<defs>` with filter IDs (`#cr`, `#cr-h`, `#cr-text`, `#crayon-fill`) that give the hand-drawn crayon look; must be rendered once at the root
- Primitives: `CrayonCard`, `CrayonButton`, `CrayonUnderline`, `SpeechBubble`
- Illustration: `HandIcon` (type-keyed SVG icons), `CrayonPot` (animated face SVG), `RealPot` (photo + mood overlay)
- `Reveal` — IntersectionObserver-based fade-in wrapper

**`components/sections-v3.jsx`** — All page sections for `index.html`.
- `ScrollStory` — scroll-driven motion graphic: 600vh sticky container cycles through 6 "beats" (intro → name → sensors → chat → history → social), each with a left text panel, center pot photo, and right card
- Beat-specific cards: `IntroCard`, `NameCard`, `SensorsCard`, `ChatCard`, `HistoryCard`, `SocialCard`
- Standard sections: `Nav`, `Features`, `Personalities`, `Variants`, `CTA`, `Footer`

**`tweaks-panel.jsx`** — Floating design-tweak panel. Loaded by every page. Provides:
- `useTweaks(defaults)` hook — syncs values with host via `postMessage` (`__edit_mode_set_keys`) and persists to the `/*EDITMODE-BEGIN*/…/*EDITMODE-END*/` JSON block in the HTML file
- `TweaksPanel` shell + controls: `TweakSelect`, `TweakSlider`, `TweakToggle`, `TweakColor`, `TweakNumber`, `TweakText`, `TweakRadio`

### Module system

There are **no ES modules**. Every file ends with `Object.assign(window, { ... })` to expose its exports globally. Load order in the HTML `<script>` tags matters: `crayon-v3.jsx` → `sections-v3.jsx` → `tweaks-panel.jsx` → inline app.

### Typography tweaks

Each page wires `useTweaks(TWEAK_DEFAULTS)` with `hf` (heading font) and `bf` (body font) keys. The `t` object is passed as a prop to all sections and applied via `style={{ fontFamily: t.hf }}`. Available fonts: `Nunito`, `Quicksand`, `Caveat`.

## Design constraints

- **No emojis** — all icons are hand-drawn SVGs via `HandIcon` or inline paths with `filter="url(#cr)"` for the crayon jitter effect
- **Crayon filters must be in scope** — any new SVG element that needs the hand-drawn look needs `filter="url(#cr)"` (shapes) or `filter="url(#cr-text)"` (type); these filters are injected by `<CrayonDefs/>` at the app root
- **PALETTE** is the single source of truth for all colors; never hardcode hex values that exist there
- The `pot-real.png` asset is a photo used as the hero; `icon-crayon.png` is the logo icon

## Product context

Gossip Garden sells an IoT smart pot kit: ESP32 microcontroller with DHT22 (temperature/humidity), GY-30 (light), and SEN0193 (soil moisture) sensors. The AI gives each plant a personality (Alegre, Dormilona, Dramática, Exigente) and initiates conversations proactively when the plant needs care. Backend is FastAPI + Docker; data is split between PostgreSQL (users/social) and MongoDB (sensor time-series, 30-day retention).
