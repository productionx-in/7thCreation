# 7th Creation — Site

React + TypeScript + Tailwind CSS + Framer Motion + lucide-react. Real copy
and structure carried over from the published Lovable build
([seventh-creation-studio.lovable.app](https://seventh-creation-studio.lovable.app)) —
see `../brand/resolution-2026-08-24.md` for how that was confirmed as the
actual business.

## Run it

```bash
npm install
npm run dev       # dev server
npm run build     # production build, type-checked
npm run preview   # serve the production build locally
```

## What's real vs. mock

**Real:** all copy, the service list, the process steps, the "7C" wordmark
concept, the dark/gold/ember palette, and the section structure.

**Mock — replace before shipping:** every photo/frame in the site is a
locally-rendered placeholder (`src/components/MockPlate.tsx`), not a real
image. Look for `⚠️ MOCK` comments in `src/data/images.ts` and swap each
entry's `icon`/`label` pair for a real asset:

```tsx
// before (placeholder)
<MockPlate label="Industrial, frame 1" icon={Factory} className="..." />

// after (real asset)
<img src={industrialFrame1} alt="..." className="..." />
```

**Why placeholders instead of stock photos:** this environment's outbound
network policy blocks arbitrary external image hosts — confirmed by testing
`picsum.photos` and the Lovable preview domain, both rejected at the proxy
with a 403 on CONNECT (see `/root/.ccr/README.md` if you hit this again).
Rather than depend on an external host that may or may not be reachable
wherever this gets built next, every "photo" is generated locally: no
network calls, nothing to break, and the `⚠️ MOCK` labelling makes it obvious
at a glance which frames are placeholders. Same reasoning for the logo
(`src/components/Logo.tsx`) — the real mark is AI-generated with no vector
master (see `../brand/identity-brief.md`) and only reachable via a Lovable
preview URL, so a simple placeholder wordmark stands in until the real
identity redraw exists as a local SVG.

## Reused patterns

Built to a spec referencing a MotionSites "3D Creator" portfolio template.
The *content* of that template (persona "Jack", 3D modelling/rendering
services, third-party project images) had nothing to do with this business —
see the resolution doc — but the *interaction techniques* were worth keeping
and are reused here with real content:

- **`FadeIn`** — scroll-triggered reveal wrapper (`whileInView`, once only)
- **`Magnet`** — mouse-following magnetic hover on the hero portrait
- **`AnimatedText`** — word-by-word scroll-driven opacity reveal (About copy)
- **`MarqueeSection`** — two rows of tiles translating opposite directions,
  driven by scroll position rather than a CSS loop
- **`ProjectsSection`** — sticky-stacking cards that scale down as the next
  one arrives underneath (Framer Motion `useScroll` + `useTransform`)

## Structure

```
src/
  data/content.ts    real copy, services, process steps, nav
  data/images.ts      mock footage — label + icon pairs, see ⚠️ comments
  components/         reusable: FadeIn, Magnet, AnimatedText, MockPlate,
                       Logo, ContactButton, GhostButton
  components/sections/  Hero, Marquee, About, Services, Projects,
                         Process, Contact
```
