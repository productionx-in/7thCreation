# 7th Creation — Site

React + TypeScript + Vite + Tailwind CSS + Framer Motion + lucide-react.
Real copy, real licensed reference photography, the real commissioned logo
mark, and real contact channels — see
`../brand/brand-brief-2026-08-24.md` for the brand direction this was built
against.

## Run it

```bash
npm install
npm run dev       # dev server
npm run build     # production build, type-checked
npm run preview   # serve the production build locally
```

## What's real vs. reference

**Real:** all copy, the service list, the process steps, the logo mark
(`src/assets/logo/logo-mark.png`, background-removed from the founder's
supplied file), the favicon (generated from the same mark), the dark/gold/
ember palette, contact details (email, phone, WhatsApp, Instagram,
YouTube), and the enquiry form (submits straight to WhatsApp via a `wa.me`
link — no backend).

**Reference photography, not client work:** the five photos in
`src/assets/stock/` are licensed Adobe Stock images standing in for real
shoot stills — each is wrapped in `RealImage.tsx`, which adds a small
"Reference" corner tag so it's never mistaken for actual client work. Swap
these for real portfolio photography when it exists.

**Still a placeholder:** a handful of marquee tiles (Corporate,
Documentary, Pre-Wedding, LED Wall, Birthday, Podcast, Portfolio) have no
photo yet and fall back to `MockPlate.tsx`, a locally-rendered icon tile
labelled `Mock · <name>` — see `src/data/images.ts`.

## Reused patterns

Built to a spec referencing a MotionSites "3D Creator" portfolio template.
The *content* of that template had nothing to do with this business, but
the *interaction techniques* were worth keeping and are reused here with
real content:

- **`FadeIn`** — scroll-triggered reveal wrapper (Framer Motion
  `whileInView`, once only)
- **`Magnet`** — mouse-following magnetic hover on the hero portrait
- **`AnimatedText`** — word-by-word scroll-driven opacity reveal (About
  copy)
- **`MarqueeSection`** — two rows of tiles translating opposite
  directions, driven by scroll position rather than a CSS loop
- **`ProjectsSection`** — sticky-stacking cards that scale down as the
  next one arrives underneath (Framer Motion `useScroll` + `useTransform`)

## Structure

```
src/
  data/content.ts       real copy, services, process steps, nav, contact info
  data/images.ts         marquee tiles — real photo or MockPlate fallback per entry
  components/            FadeIn, Magnet, AnimatedText, RealImage, MockPlate,
                          Logo, EnquiryForm, WhatsAppButton, ContactButton, GhostButton
  components/sections/   Hero, Marquee, About, Services, Projects, Process, Contact
```

Section order: Hero → Marquee → About → Services → Projects → Process →
Contact.

## A Tailwind gotcha worth knowing

`RealImage` hardcodes `relative` on its wrapper div. Passing `absolute`
into its `className` prop does **not** make it absolutely positioned —
Tailwind's generated stylesheet defines `.relative` after `.absolute`, so
on the specificity tie `.relative` wins and silently overrides it. Where a
`RealImage` needs to be a full-bleed absolute background (the hero photo,
each sticky project card), wrap it in an outer `<div className="absolute
inset-0">` instead and keep `RealImage` itself at `h-full w-full`.
