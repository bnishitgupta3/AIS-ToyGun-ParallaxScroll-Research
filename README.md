# AIS ToyGun — Parallax Scroll Research

A high-end D2C (Direct-to-Consumer) product showcase for **UTG Tactical** water guns and gel blasters. Built with React, React Three Fiber (R3F), and GSAP for cinematic scroll-driven 3D product presentations.

---

## What's Inside

| Route | Description |
|---|---|
| `/` | Dark D2C landing page — Hero, Arsenal (3-gun horizontal scroll), Mission, Field Test carousel, Footer |
| `/product/mp5k` | MP5K-UTG product page — orange accent |
| `/product/m416` | M416 Water X product page — blue accent |
| `/product/crimson` | Crimson Blaster product page — red accent |

---

## Tech Stack

| Layer | Library | Version |
|---|---|---|
| UI framework | React | 19.0.0 |
| Build tool | Create React App + craco | 5.0.1 |
| 3D rendering | @react-three/fiber | 9.6.1 |
| 3D utilities | @react-three/drei | 10.7.7 |
| 3D engine | Three.js | 0.184.0 |
| Scroll animation | GSAP + ScrollTrigger | 3.15.0 |
| Styling | Tailwind CSS | 3.4.17 |
| Routing | React Router DOM | 7.5.1 |
| Carousel | Embla Carousel | 8.6.0 |

---

## Prerequisites

| Tool | Recommended version | Check |
|---|---|---|
| Node.js | 16 – 20 (see note for v22) | `node --version` |
| npm | 8+ | `npm --version` |
| Git | any | `git --version` |

> **Node.js v22 note:** CRA 5 has a peer-dep conflict on Node 22 with `ajv-keywords`. The fix is already pinned in `package.json` (`"ajv": "^8.0.0"`). If you still see `Cannot find module 'ajv/dist/compile/codegen'` after install, see the [Troubleshooting](#troubleshooting) section.

---

## Quick Start

### 1. Clone the repo

```bash
git clone https://github.com/bnishitgupta3/AIS-ToyGun-ParallaxScroll-Research.git
cd AIS-ToyGun-ParallaxScroll-Research
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install --legacy-peer-deps
```

> **Corporate network / SSL error?** If you see `unable to verify the first certificate`, run:
> ```bash
> npm config set strict-ssl false
> npm install --legacy-peer-deps
> ```

### 3. Start the development server

```bash
# Inside the frontend/ directory
npm start
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

The landing page loads at `/`. Navigate to `/product/mp5k`, `/product/m416`, or `/product/crimson` via the "View Details" buttons in the Arsenal section.

---

## Project Structure

```
AIS-ToyGun-ParallaxScroll-Research/
├── frontend/
│   ├── public/
│   │   └── assets/
│   │       ├── watergun.glb           # MP5K-UTG 3D model
│   │       ├── m416-watergun.glb      # M416 Water X 3D model
│   │       └── crimson-blaster.glb   # Crimson Blaster 3D model
│   │
│   └── src/
│       ├── App.js                     # Router — all 4 routes defined here
│       ├── index.css                  # Global styles, custom fonts, CSS variables
│       │
│       ├── pages/
│       │   ├── LandingPage.jsx            # /  — full D2C landing page
│       │   ├── ProductShowcase.jsx        # /product/mp5k  (original MP5K page)
│       │   ├── ProductShowcaseTemplate.jsx   # Shared scroll-animation template
│       │   ├── M416Showcase.jsx           # /product/m416
│       │   └── CrimsonBlasterShowcase.jsx # /product/crimson
│       │
│       ├── components/
│       │   ├── scene/
│       │   │   ├── LandingCanvas.jsx      # Fixed full-screen R3F canvas (landing)
│       │   │   ├── GenericGunModel.jsx    # Reusable model loader — accepts url prop
│       │   │   ├── GenericGunScene.jsx    # Isolated Canvas for product pages
│       │   │   ├── WaterGunModel.jsx      # Original hardcoded MP5K model
│       │   │   ├── WaterGunScene.jsx      # Original MP5K canvas
│       │   │   └── WaterStream.jsx        # Instanced particle water stream
│       │   │
│       │   ├── landing/
│       │   │   ├── LandingNav.jsx         # Top navigation bar
│       │   │   ├── ArsenalSection.jsx     # GSAP-pinned 3-gun horizontal carousel
│       │   │   ├── MissionSection.jsx     # Word-by-word scroll reveal
│       │   │   ├── FieldTestSection.jsx   # Embla draggable UGC carousel
│       │   │   └── LandingFooter.jsx      # Newsletter signup + link columns
│       │   │
│       │   └── showcase/                  # Components for the original MP5K page
│       │       ├── HeroOverlay.jsx
│       │       ├── SpecsPanel.jsx
│       │       ├── ParallaxBackground.jsx
│       │       ├── FireEffects.jsx
│       │       └── FooterCTA.jsx
│       │
│       └── lib/
│           └── r3fPropFilter.js      # Strips editor x-* props from R3F elements
│
└── backend/                          # Not used in the current build
```

---

## How the 3D Architecture Works

### Landing page (`/`)

```
<LandingPage>
  ├── <LandingCanvas>          ← position: fixed, z-index: 0, always in background
  │     Contains Three.js groups for all 3 models.
  │     GSAP animates group.position.x directly via model1Ref / model2Ref / model3Ref.
  │     Mouse-tracking tilt via mouseRef (updated outside Canvas, read inside useFrame).
  │
  └── <div z-index: 10>        ← scrollable HTML overlay sits on top
        Sections flow in normal document order.
        Arsenal section is pinned via GSAP ScrollTrigger (pin: true).
        Mission and Footer have solid dark backgrounds that cover the canvas.
```

**Key pattern:** GSAP mutates Three.js object properties (`group.position`, `group.scale`, `group.rotation`) outside React's render cycle. R3F picks the updated values up on the next `useFrame` tick. Zero React re-renders for any scroll animation.

### Product pages (`/product/*`)

Each product page gets its own isolated `<Canvas>` via `GenericGunScene`. The scroll animation runs through five phases:

| Phase | Progress | What happens |
|---|---|---|
| A | 0 → 28% | Gun zooms in from tiny to full size, hero text fades |
| B | 12 → 30% | Hero wordmark lifts off screen |
| C | 32 → 72% | 360° showcase spin |
| D | 55 → 85% | Model settles to the right side |
| E | 78 → 100% | Specs panel slides in from the left |

---

## Adding a New Product Page

### Step 1 — Add the 3D model

Place your `.glb` file in `frontend/public/assets/`:

```
frontend/public/assets/my-gun.glb
```

### Step 2 — Create the page file

```jsx
// src/pages/MyGunShowcase.jsx
import ProductShowcaseTemplate from "./ProductShowcaseTemplate";

const MY_GUN = {
    modelUrl:    "/assets/my-gun.glb",
    name:        "My Gun Name",
    code:        "MG·001",           // hero wordmark — split on · character
    tagline:     "Water Gun · Full Auto",
    eyebrow:     "/// UTG · Tactical Division · 2026",
    accentColor: "#22c55e",          // any valid CSS colour
    accentDeep:  "#16a34a",
    specs: [
        { label: "RANGE",        value: "12–15m" },
        { label: "CAPACITY",     value: "600 Beads" },
        { label: "RATE OF FIRE", value: "9 r/s" },
        { label: "BATTERY",      value: "7.4V Li-Po" },
        { label: "WEIGHT",       value: "1.5 kg" },
        { label: "MODE",         value: "Semi · Auto" },
    ],
    specsTitle:        ["Built for", "Summer", "Dominance."],
    specsDescription:  "One-line product description.",
    price:      "$109.00",
    squadPrice: "$359.00",
    version:    "v1.0.0 · MG-001",
    unitLabel:  "7B-MG1 · In stock",
};

export default function MyGunShowcase() {
    return <ProductShowcaseTemplate product={MY_GUN} />;
}
```

### Step 3 — Register the route

In `src/App.js`, add inside `<Routes>`:

```jsx
import MyGunShowcase from "@/pages/MyGunShowcase";

<Route path="/product/mygun" element={<MyGunShowcase />} />
```

### Step 4 — Add to the Arsenal

In `src/components/landing/ArsenalSection.jsx`, add an entry to the `PRODUCTS` array:

```js
{
    id:     "p3",
    name:   "My Gun Name",
    tagline: "Water Gun · Full Auto",
    price:  "$109",
    link:   "/product/mygun",
    accent: "#22c55e",
    sub:    "Water Gun",
},
```

### Step 5 — Preload the model

In `src/components/scene/LandingCanvas.jsx`, add at the top:

```js
useGLTF.preload("/assets/my-gun.glb");
```

---

## Environment Variables

Create a `.env` file in `frontend/` if needed:

```env
# Enable the health-check endpoints used by deployment infra (default: false)
ENABLE_HEALTH_CHECK=false

# Suppress CRA Node version preflight warning (useful on Node 22)
SKIP_PREFLIGHT_CHECK=true
```

---

## Available Scripts

Run all commands from inside `frontend/`:

| Command | What it does |
|---|---|
| `npm start` | Dev server at http://localhost:3000 with hot-reload |
| `npm run build` | Production bundle output to `frontend/build/` |
| `npm test` | Unit test runner in watch mode |

---

## Production Build

```bash
cd frontend
npm run build
```

The `build/` folder is a fully static site. Configure your host to serve `index.html` for all paths so React Router handles client-side navigation:

| Host | Config |
|---|---|
| **Netlify** | Create `public/_redirects`: `/* /index.html 200` |
| **Vercel** | Add `vercel.json`: `{"rewrites":[{"source":"/(.*)","destination":"/index.html"}]}` |
| **Nginx** | `try_files $uri /index.html;` in the server block |
| **Apache** | Add `RewriteRule ^ index.html [L]` to `.htaccess` |

---

## Troubleshooting

### `Cannot find module 'ajv/dist/compile/codegen'`

CRA 5's bundled `ajv-keywords` needs `ajv@8` as a peer dependency. Fix:

```bash
npm install ajv@^8 --legacy-peer-deps
```

Already pinned in `package.json`; a clean `npm install --legacy-peer-deps` handles it automatically.

---

### SSL certificate error on `npm install` or `git push`

Common on corporate networks with an intercepting proxy. Fix for npm:

```bash
npm config set strict-ssl false
npm install --legacy-peer-deps
```

Fix for git:

```bash
git config --local http.sslVerify false
git push origin main
```

> Reset these when off the corporate network:
> ```bash
> npm config set strict-ssl true
> git config --local http.sslVerify true
> ```

---

### 3D models not loading / black canvas

1. Confirm `.glb` files are in `frontend/public/assets/`
2. Open DevTools → Network and check for 404s on `.glb` requests
3. Make sure the path in the component starts with `/assets/` (absolute, not relative)
4. GLB files must be valid binary glTF — test with the [glTF Validator](https://github.khronos.org/glTF-Validator/)

---

### GSAP ScrollTrigger animations not firing

- Try resizing the browser window once — this triggers `ScrollTrigger.refresh()`
- Make sure no parent element has `overflow: hidden` that cuts off scroll events
- Open the console and check for GSAP warnings about missing trigger elements

---

### All "View Details" buttons open the same product page

This was a known bug (fixed). All three Arsenal cards are stacked at the same position; if the hidden cards still have `pointer-events: auto` they intercept clicks. The fix is in `LandingPage.jsx` → `onUpdate` where GSAP sets `pointerEvents: "none"` on hidden cards. If you're building a modified version and the bug reappears, check those `gsap.set` calls.

---

## Fonts

Loaded from [Fontshare](https://www.fontshare.com/) CDN — requires internet on first load, then cached by the browser.

| Font | Weight | CSS class |
|---|---|---|
| Cabinet Grotesk | 900 | `.font-display` — headlines |
| Satoshi | 400, 500, 700 | Default body font |
| JetBrains Mono | 400, 700 | `.font-mono-tactical` — labels, spec values |
