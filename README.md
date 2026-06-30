<div align="center">
  <img src="assets/icons/icon-crayon.png" width="120" alt="Gossip Garden Logo"/>
  <h1>Gossip Garden Landing</h1>
  
  <p>The marketing and community hub of the Gossip Garden IoT ecosystem — a static, backend-less React web application showcasing smart planters, AI personalities, and an embedded community forum backed by Supabase.</p>

  <p>
    <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/GSAP-ScrollTrigger-88CE02?style=for-the-badge&logo=greensock&logoColor=white" alt="GSAP" />
    <img src="https://img.shields.io/badge/Babel-Standalone-F9DC3E?style=for-the-badge&logo=babel&logoColor=black" alt="Babel" />
    <img src="https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  </p>
</div>

---

## Table of Contents

1. [Ecosystem Overview](#1-ecosystem-overview)
2. [What Gossip Garden Landing Does](#2-what-gossip-garden-landing-does)
3. [Architecture](#3-architecture)
4. [Tech Stack](#4-tech-stack)
5. [Project Structure](#5-project-structure)
6. [Core Modules](#6-core-modules)
7. [Community Blog Sub-System](#7-community-blog-sub-system)
8. [Data Flow Reference](#8-data-flow-reference)
9. [Design System](#9-design-system)
10. [Legal & Compliance](#10-legal--compliance)
11. [Running the Site](#11-running-the-site)
12. [Environment Variables](#12-environment-variables)
13. [Deployment](#13-deployment)

---

## 1. Ecosystem Overview

Gossip Garden is an IoT plant monitoring product integrating sensor hardware (ESP32), a FastAPI backend, MQTT/HiveMQ telemetry, and AI personalities. The landing page acts as the entry point for customers, integrating directly into the broader ecosystem through informational flows and community engagement.

```mermaid
graph TD
    Landing[Gossip Garden Landing<br>Static React + CDN]
    Hardware[Gossip Garden Pot<br>ESP32 + Sensors]
    Backend[Gossip Garden API<br>FastAPI + MongoDB]
    Community[Blog & Forum<br>Supabase DB]

    Landing -->|Educates Users| Hardware
    Landing -->|Reads/Writes Posts| Community
    Hardware -->|MQTT Telemetry| Backend
    Backend -->|Data Sync| Community
```

| Component | Role |
|---|---|
| **Landing Site (this repo)** | Marketing storefront, feature highlights, and terms of service. |
| **Blog & Forum** | Community engagement, isolated sub-system utilizing Supabase. |
| **Smart Pot (ESP32)** | Physical hardware with DHT22, GY-30, and SEN0193 sensors. |
| **FastAPI Backend** | Telemetry ingestion and AI personality engine. |

---

## 2. What Gossip Garden Landing Does

| Feature | Description |
|---|---|
| **Dynamic Scroll Story** | A 400vh hero section that scrubs a 100-frame 3D turntable animation using GSAP ScrollTrigger based on user scroll. |
| **Component System** | A custom React-based Crayon UI loaded entirely in-browser, generating unique SVG filters for a hand-drawn aesthetic. |
| **Live Tweaks Panel** | An embedded design-tweak panel using `postMessage` to sync variables and persist them into HTML block comments. |
| **FormSubmit Integration** | Backend-less contact forms leveraging FormSubmit to email inquiries without needing a local REST API. |
| **Self-Contained Blog** | A standalone community forum nested within the project but structured to deploy to a separate domain, backed by Supabase RLS. |
| **Legal Documentation** | Auto-generating table of contents and standardized layouts for Privacy and Terms pages aligned with Colombian law. |

---

## 3. Architecture

### Client-Side Execution

This project bypasses traditional Node.js build steps, favoring an in-browser compilation strategy for rapid iteration.

```mermaid
graph LR
    HTML[index.html]
    CDN1[React 18 CDN]
    CDN2[Babel Standalone]
    JSX1[crayon-v3.jsx]
    JSX2[sections-v3.jsx]
    Render[Browser DOM]

    HTML --> CDN1
    HTML --> CDN2
    CDN1 --> Render
    CDN2 --> JSX1
    CDN2 --> JSX2
    JSX1 --> Render
    JSX2 --> Render
```

### Data Flow

```mermaid
graph TD
    Client[User Browser]
    Forms[FormSubmit.co]
    Supabase[Supabase PostgreSQL]
    Storage[Supabase Storage]

    Client -->|POST Contact Data| Forms
    Forms -->|Email Dispatch| AdminEmail[Admin Inbox]
    
    Client -->|Auth & Posts| Supabase
    Client -->|Image Uploads| Storage
    Supabase -->|RLS Validation| Client
```

---

## 4. Tech Stack

### Core Frontend

| Layer | Technology | Version / Source |
|---|---|---|
| Framework | React | 18 (CDN) |
| Transpiler | Babel Standalone | (CDN) |
| Animation | GSAP + ScrollTrigger | 3.x (CDN) |
| Styling | CSS3 + SVG Filters | Native |
| Icons | Custom SVGs | Local Assets |

### Sub-System (Blog & Forum)

| Layer | Technology | Usage |
|---|---|---|
| Database | Supabase (PostgreSQL) | Posts, Comments, User Profiles |
| Storage | Supabase Storage | `plant-photos` bucket |
| Auth | Supabase Auth | Email and Password |
| Security | Row Level Security (RLS) | Restricting `blog` post creation to Admins |

---

## 5. Project Structure

```text
LandingGossipGarden/
├── index.html                      # Main landing page with GSAP hero
├── personalities.html              # Detailed plant personalities breakdown
├── store.html                      # Product store and variant selector
├── how-it-works.html               # Explanation of IoT mechanics
├── privacy.html                    # Privacy Policy (Legal)
├── terms.html                      # Terms & Conditions (Legal)
├── components/
│   ├── crayon-v3.jsx               # UI Primitives & SVG Filters
│   ├── sections-v3.jsx             # Page Sections (Nav, Hero, Footer)
│   ├── tweaks-panel.jsx            # Live design adjustment panel
│   └── legal.jsx                   # Layout wrappers for legal pages
├── blog/                           # Self-contained Supabase community site
│   ├── index.html                  # Blog feed
│   ├── forum.html                  # Community forum
│   ├── post.html                   # Single post view with comments
│   └── components/
│       ├── blog-data.jsx           # Supabase data layer and hooks
│       ├── blog-ui.jsx             # Blog-specific UI components
│       ├── site-config.js          # Domain variables
│       └── supabase-config.js      # Generated Supabase credentials
├── scripts/
│   └── gen-config.sh               # Bash script to generate supabase-config.js
└── assets/
    ├── icons/                      # Crayon UI icons
    ├── pots/                       # Image assets for plant pots
    │   ├── pot360/                 # 100-frame WebP sequence for turntable
    │   ├── animated/               # Crossfade faces
    │   └── faces/                  # Emotion variant overlays
    └── personalities/              # Moodboard collages
```

---

## 6. Core Modules

### In-Browser Transpilation
Pages load React and Babel directly from a CDN. Component files are included as `<script type="text/babel">`. To defeat caching during development, cache-buster query strings (`?v=...`) are appended to script sources. The module system relies on appending exports to the global `window` object rather than ES module imports.

### The Crayon Design System (`crayon-v3.jsx`)
The UI relies heavily on SVG filters to create a hand-drawn, paper-like aesthetic.
- `CrayonDefs`: A root component that injects `<defs>` and filter IDs (`#cr`, `#cr-text`) into the DOM.
- `PALETTE`: A globally accessible constant object defining all brand colors. Hardcoding hex colors outside this object is strictly prohibited.

### GSAP ScrollStory (`sections-v3.jsx`)
The hero section on the main index page is a `400vh` scrolling container encompassing four narrative beats.
- **Maceta360**: A `<canvas>` element that renders a 100-frame WebP image sequence, driven by GSAP's `ScrollTrigger`.
- **Wheel Snapping**: Custom event listeners hijack the scroll wheel to snap perfectly to specific milestones, ensuring fluid transitions between the plant personalities (Alegre, Dormilona, Dramatica, Exigente) without overlap.

### Live Tweaks Panel (`tweaks-panel.jsx`)
A floating control panel that permits live editing of design tokens (such as fonts and colors). It communicates with the host document via `postMessage` and serializes the modified JSON state into designated `/*EDITMODE-BEGIN*/` blocks within the HTML source.

---

## 7. Community Blog Sub-System

Located within the `blog/` directory, this acts as a completely isolated application intended for deployment on a separate subdomain. It connects to a Supabase PostgreSQL backend.

- **Data Layer (`blog-data.jsx`)**: Initializes `window.ggDB` and handles CRUD operations for posts, comments, and likes. It also manages Supabase Authentication.
- **Security & RLS**: The database enforces Row Level Security. Only authenticated users can comment or post in the forum. Furthermore, a `public.is_admin()` function verifies user emails against an admin table, restricting the creation of editorial blog posts to staff only.
- **Configuration Generation**: `scripts/gen-config.sh` parses local `.env` variables and generates `supabase-config.js` for the frontend. Sensitive keys are never committed or exposed to the client.

---

## 8. Data Flow Reference

Because there is no traditional build system or ES module tree, data and state flow via the global `window` object and React props.

### Global Dependencies

| Module | Exposes | Consumer |
|---|---|---|
| `crayon-v3.jsx` | `PALETTE`, `CrayonCard`, `HandIcon` | All `sections-v3.jsx` |
| `blog-data.jsx` | `fetchPosts`, `useAuth`, `window.ggDB` | `blog-ui.jsx` |
| `site-config.js` | `MAIN_SITE_URL`, `ADMIN_EMAILS` | `blog-data.jsx`, `blog-ui.jsx` |
| `tweaks-panel.jsx`| `useTweaks` hook | `index.html` inline script |

### Contact Form Flow
1. User interacts with `ContactModal` (defined in `sections-v3.jsx`).
2. Component gathers form state (name, email, subject, message).
3. Payload is dispatched via `POST` to `https://formsubmit.co/ajax/` combined with a hardcoded `CONTACT_EMAIL`.
4. FormSubmit relays the message to the configured inbox.

---

## 9. Design System

The Gossip Garden aesthetic is strictly defined by warm, organic, hand-drawn elements. 

### Color Palette

Colors are managed centrally in `PALETTE` and are designed to avoid generic digital appearances.

| Token | Description | Usage |
|---|---|---|
| `paper` | Warm cream | Main background |
| `ink` | Dark brown | Primary text, borders |
| `green`, `blue`, `purple`, `pink` | Brand accents | Crayon highlights, mood colors |
| `leafDk` | Deep green | Active navigation states |

### Constraints & Guidelines
- **SVG Filters**: All dynamic vectors must utilize `filter="url(#cr)"` to maintain the jittered, crayon-drawn look.
- **No Emojis**: Emojis are strictly forbidden. UI cues must rely on `HandIcon` definitions.
- **Image Optimization**: Hardware-intensive imagery, like the turntable sequence, relies on center-aligned, tightly cropped WebP images to maintain high performance in the canvas renderer.

---

## 10. Legal & Compliance

The `terms.html` and `privacy.html` pages consume the `legal.jsx` module. 
- It exports a `LegalPage` primitive that takes an array of sections and automatically generates a sticky table of contents.
- Content is heavily customized for IoT constraints (sensor data ingestion, AI personality processing) and is modeled to comply with the Colombian Data Protection Law (Ley 1581 de 2012).

---

## 11. Running the Site

Because the site relies on in-browser transpilation, running it requires only a basic HTTP server. Bypassing a server (opening `file://`) will result in CORS errors from Babel.

### Starting a Local Server

```bash
# Using Python 3
python3 -m http.server 8080

# Using Node.js (http-server)
npx http-server -p 8080
```

Once running, navigate to `http://localhost:8080` in your web browser.

---

## 12. Environment Variables

The core landing pages require no environment variables. However, the `blog/` sub-system requires a `.env` file at the root to generate its configuration.

Create `.env`:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
SUPABASE_DB_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres
```

Run the generator script before testing the blog:

```bash
./scripts/gen-config.sh
```
This produces `blog/components/supabase-config.js` safely, excluding secret keys.

---

## 13. Deployment

The landing site can be deployed to any static hosting provider (Vercel, Netlify, GitHub Pages, Cloudflare Pages). 

To deploy the blog independently:
1. Isolate the `blog/` folder.
2. Ensure `supabase-config.js` is generated as part of the CI/CD pipeline.
3. Serve it on a dedicated subdomain (e.g., `blog.gossipgarden.co`).
