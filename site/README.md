# 7th Creation — Site

React + TypeScript + Vite + Tailwind CSS + lucide-react. No animation
library — entrance/scroll effects are IntersectionObserver + CSS
transitions (`src/components/FadeIn.tsx`). Real copy, real licensed
reference photography, the real commissioned logo mark, and real contact
channels — see `../brand/brand-brief-2026-08-24.md` for the brand direction
this was built against.

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
supplied file), the dark/gold/ember palette, contact details (email, phone,
WhatsApp, Instagram, YouTube), and the enquiry form (submits straight to
WhatsApp via a `wa.me` link — no backend).

**Reference photography, not client work:** the five photos in
`src/assets/stock/` are licensed Adobe Stock images standing in for real
shoot stills — each is wrapped in `RealImage.tsx`, which adds a small
"Reference" corner tag so it's never mistaken for actual client work. Swap
these for real portfolio photography when it exists.

**Still a placeholder:** a handful of marquee tiles (Corporate,
Documentary, Pre-Wedding, LED Wall, Birthday, Podcast, Portfolio) have no
photo yet and fall back to `MockPlate.tsx`, a locally-rendered icon tile
labelled `Mock · <name>` — see `src/data/images.ts`.

## Structure

```
src/
  data/content.ts       real copy, services, process steps, nav, contact info
  data/images.ts         marquee tiles — real photo or MockPlate fallback per entry
  components/            FadeIn, Magnet, RealImage, MockPlate, Logo,
                          EnquiryForm, WhatsAppButton, ContactButton, GhostButton
  components/sections/   Hero, Projects, Marquee, About, Services, Process, Contact
```

Section order: Hero → Projects (lead with proof) → Marquee (breadth) →
About (manifesto) → Services (capability index) → Process → Contact.
