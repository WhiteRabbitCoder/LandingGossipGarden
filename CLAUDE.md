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
| `Terminos.html` | Terms & Conditions (legal) |
| `Privacidad.html` | Privacy Policy (legal) |
| `blog/index.html` | Community blog feed — **separate deployable** (its own domain). See "Blog" below |
| `blog/post.html` | Single blog post (`?id=…`) with nested comments |

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
- `Footer` — stateful: the "Contacto" link opens `ContactModal`. `ContactModal` collects nombre/correo/asunto/mensaje and POSTs to **FormSubmit** (`https://formsubmit.co/ajax/${CONTACT_EMAIL}`) so messages arrive by email with no backend (`CONTACT_EMAIL` const near the Footer; first submission needs a one-time activation email). Footer links use the `.gg-foot-link` hover class (color→heart on hover; injected `<style>` because inline styles beat `:hover`). `CrayonSelect` is a custom crayon dropdown replacing native `<select>` inside the modal.
- **Nav hover convention** (`.gg-navlink` + `.gg-ul`): each nav link holds an SVG of the hand-drawn crayon underline path (`M3,8 Q40,2 90,9 T196,5`, `leafDk`, `filter:url(#cr)`) that "draws in" on hover via `stroke-dashoffset` (active link `.is-active` stays drawn). The CSS lives in each page's `<head>` (`index.html` injects it from the `Nav`; the other pages' inline navs `Personalidades/Tienda/Como funciona` carry the same `.gg-navlink/.gg-ul` rules). When changing a nav, keep color out of the inline style so `:hover` can win.

**`components/tweaks-panel.jsx`** — Floating design-tweak panel (loaded by `index.html`). Provides:
- `useTweaks(defaults)` hook — syncs values with host via `postMessage` (`__edit_mode_set_keys`) and persists to the `/*EDITMODE-BEGIN*/…/*EDITMODE-END*/` JSON block in the HTML file
- `TweaksPanel` shell + controls: `TweakSelect`, `TweakSlider`, `TweakToggle`, `TweakColor`, `TweakNumber`, `TweakText`, `TweakRadio`

### Blog (Supabase-backed, separate deployable)

The community blog is a **self-contained mini-site under `blog/`**, meant to be deployed to its **own domain**. It does not share code with the root pages at runtime — it carries its own copy of `crayon-v3.jsx` and `assets/icons/`. It is the only part with a real backend: **Supabase** (Postgres + Storage), used anonymously — no login. Public read + anonymous insert protected by RLS.

- Two sections (tabs `SectionTabs`): **`blog/index.html`** = Blog (editorial articles, `kind='blog'`, only admins can post) and **`blog/foro.html`** = Foro (community, `kind='foro'`, any logged-in user posts). **`blog/post.html`** (`?id=…`) shows either, with nested comments.
- Posts have a `kind` column (`blog`/`foro`). Admin gating: a `public.admins` table + `public.is_admin()` (security definer) back an RLS insert policy that only lets admins create `kind='blog'` rows; the frontend mirrors the allowlist in `window.ADMIN_EMAILS` (site-config) via `isAdmin(user)` to show/hide the "Escribir artículo" button.
- **`blog/components/site-config.js`** — plain script exposing `window.MAIN_SITE_URL` (main site domain, links back) and `window.ADMIN_EMAILS` (blog authors).
- **`blog/components/supabase-config.js`** — plain script exposing `window.SUPABASE_URL` / `window.SUPABASE_ANON_KEY`. **Generated** from root `.env` by `scripts/gen-config.sh`; both `.env` and this file are git-ignored. Committed templates: `.env.example` and `blog/components/supabase-config.example.js`. Secret vars (`SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_DB_URL`) live only in `.env` and never reach the browser.
- **`blog/components/blog-data.jsx`** — data layer: creates `window.ggDB` (Supabase client, `null` if unconfigured) and helpers (`fetchPosts`, `fetchPost`, `createPost`, `fetchComments`, `createComment`, `countComments`, `likePost`/`hasLiked` (anti-double-like via `localStorage`), `uploadImage` (Storage bucket `plant-photos`), `timeAgo`/`readingTime`/`postHeadline`). Auth (Supabase Auth, email+password): `signUp`/`signIn`/`signOut`/`userName` and the `useAuth()` hook (returns `undefined` loading / `null` guest / user). `window.BLOG_CONFIGURED` gates the UI; when false helpers return a `configError` and the UI shows `ConfigNotice`.
- **`blog/components/blog-ui.jsx`** — crayon-styled components: `BlogMasthead` (big centered logo + links to `MAIN_SITE_URL`, replaces the old fixed nav), `PERSONA_META`/`PERSONA_KEYS`, `PersonaTag`, `Avatar`, `LikeButton`, `PostCard`/`FeaturedCard` (magazine layout, images shown `contain` on a tinted panel), `SectionHeading`, `CategoryLabel`, `TrendingList`, `PostForm`, `CommentForm`, `CommentTree`, `AuthModal` + `AccountControl`, `ConfigNotice`. **Posting and commenting require login** (RLS: insert restricted to `authenticated`; likes stay public via the `security definer` `increment_likes`). Posts have a `title` column (used as headline).
- **`blog/components/blog-footer.jsx`** — blog-specific `Footer` (so the blog does NOT depend on the root `sections-v3.jsx`).
- Load order (blog pages): supabase-js + `site-config.js` + `supabase-config.js` (head) → `crayon-v3.jsx` → `blog-footer.jsx` → `blog-data.jsx` → `blog-ui.jsx` → inline app. No GSAP, no `sections-v3.jsx`.
- The root site's footer "Blog" link (in `sections-v3.jsx`) points to the blog's domain (placeholder `https://blog.gossipgarden.co`).
- Setup (tables, RLS, Storage bucket, keys): see `docs/BLOG-SETUP.md`.

### Legal pages

`Terminos.html` and `Privacidad.html` share **`components/legal.jsx`**, which exports the layout primitives `LegalPage` (nav + hero + auto-generated table of contents + sections + `Footer`), `LegalNav`, and the typography helpers `LP` (paragraph), `LUL` (bulleted list), `LSub` (subheading), `LNote` (highlight card). Each page just defines a `sections = [{ id, title, content }]` array and renders `<LegalPage … sections={sections}/>`. Content is project-specific (sensor data, IoT/MQTT, AI personality, community) and references Colombian data-protection law (Ley 1581 de 2012). Linked from the footer "Legal" column; contact is `mailto:hola@gossipgarden.co`.

### Module system

There are **no ES modules**. Every file ends with `Object.assign(window, { ... })` to expose its exports globally. Load order in the HTML `<script>` tags matters: `components/crayon-v3.jsx` → `components/sections-v3.jsx` → `components/tweaks-panel.jsx` → inline app.

### Folder layout

```
index.html, Personalidades.html, Tienda.html, Como funciona.html, Terminos.html, Privacidad.html, style-guide.html
components/   crayon-v3.jsx, sections-v3.jsx, tweaks-panel.jsx, legal.jsx
scripts/      gen-config.sh   (genera blog/components/supabase-config.js desde .env)
blog/         (mini-sitio autocontenido, dominio aparte)
  index.html, post.html
  components/   crayon-v3.jsx (copia), site-config.js, supabase-config.js(.example), blog-data.jsx, blog-ui.jsx, blog-footer.jsx
  assets/icons/ icon-crayon.png (copia)
assets/
  icons/             icon-crayon.png (logo)
  materas/
    colores/           verde/azul/morado/naranja.png + VERDE2/AZUL2/ROSADO2/NARANJA2.png — color-variant pot art
    hero/              pot-hero.png, pot-real.png — hero photo assets
    maceta360/         001–100.webp — hero turntable frames (scroll-scrubbed)
    sincara/           1–4.webp — faceless pots for the Variants section
    animadas/          1–4.webp — face pots cycled by PlantRotator (CTA)
    caras/             {amarilla,azul,morada,rosada}-{alegre,asombrada,dormilona,enojada}.png — colored face pots by color × emotion; Tienda preview loads these (personality→emotion: alegre→alegre, dormilona→dormilona, dramatica→asombrada, exigente→enojada)
    simple/            simple{Amarilo,Azul,Morado,Rosado}.png — faceless flat pots, one per color (Tienda color selector)
  personalidades/
    collage/           {alegre,dormilona,dramatica,exigente}.webp — Personalidades moodboard collage (index.html) + Tienda personality selector
    legacy/            FelizGirasol/Dramatica/TristeOrquidea/BravaCactus.png + FELIZ/TRISTE/BRAVA/DORMILON.png — used by Personalidades.html
docs/         DESIGN-SYSTEM.md + product docs + BLOG-SETUP.md (Supabase setup for the blog)
```

**Image convention:** pot art is delivered as PNG and pre-processed into **WebP** with a small Python+Pillow script (Pillow has no numpy here): trim transparent margins (or flood-fill a white bg from the edges), **center the pot cylinder** in the frame, then `save(..., "WEBP", quality≈90)`. The `<img>`/`<canvas>` drag + selection is disabled globally via CSS (`user-drag/user-select:none`) plus a `dragstart` preventer in `index.html`.

### Typography tweaks

Each page wires `useTweaks(TWEAK_DEFAULTS)` with `hf` (heading font) and `bf` (body font) keys. The `t` object is passed as a prop to all sections and applied via `style={{ fontFamily: t.hf }}`. Available fonts: `Nunito`, `Quicksand`, `Caveat`.

## Design constraints

- **No emojis** — all icons are hand-drawn SVGs via `HandIcon` or inline paths with `filter="url(#cr)"` for the crayon jitter effect
- **Crayon filters must be in scope** — any new SVG element that needs the hand-drawn look needs `filter="url(#cr)"` (shapes) or `filter="url(#cr-text)"` (type); these filters are injected by `<CrayonDefs/>` at the app root
- **PALETTE** is the single source of truth for all colors; never hardcode hex values that exist there
- The `assets/materas/hero/pot-real.png` asset is a photo used as the hero; `assets/icons/icon-crayon.png` is the logo icon

## Product context

Gossip Garden sells an IoT smart pot kit: ESP32 microcontroller with DHT22 (temperature/humidity), GY-30 (light), and SEN0193 (soil moisture) sensors. The AI gives each plant a personality (Alegre, Dormilona, Dramática, Exigente) and initiates conversations proactively when the plant needs care. Backend is FastAPI + Docker; data is split between PostgreSQL (users/social) and MongoDB (sensor time-series, 30-day retention).
