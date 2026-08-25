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

**Reference photography, not client work:** the thirteen photos in
`src/assets/stock/` are licensed Adobe Stock images standing in for real
shoot stills — each is wrapped in `RealImage.tsx`, which adds a small
"Reference" corner tag so it's never mistaken for actual client work. Swap
these for real portfolio photography when it exists. `MockPlate.tsx` (a
locally-rendered icon tile labelled `Mock · <name>`) is still there as the
fallback in `MarqueeSection`/`images.ts` for any category that loses its
photo, but every category currently has one.

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

## Blog + admin CMS

`/blog` and `/blog/:slug` are real, live pages — not reference/mock content
like the marquee photos above. They read from a dedicated Supabase project
("7th Creation", project ref `wdsnhciwuhkwkwuvxrru`) rather than this repo,
so publishing a post never requires a deploy.

- **Schema:** `public.posts` (slug, title, excerpt, cover_image_url,
  content [Markdown], tags, author, published, published_at). RLS: anyone
  can read published posts; only an authenticated user can read drafts or
  write.
- **Auth:** the admin signs in at `/admin` with a fixed username + password
  (not phone, not email). Under the hood that's plain Supabase email/
  password auth — the username is mapped to a fixed pseudo-email
  (`usernameToAuthEmail` in `lib/supabase.ts`) so there's no SMS/OTP
  provider to pay for or configure. There is exactly one admin account.
  **Important:** it must be created through Supabase's real Admin API
  (`auth.admin.createUser`), never by hand-inserting rows into
  `auth.users`/`auth.identities` — that was tried first and produced a row
  that looked completely valid (correct bcrypt hash, confirmed, not
  banned — all verified via direct SQL) but still broke GoTrue's own
  internal login query with "Database error querying schema". If this
  sandbox's network can't reach `*.supabase.co` directly, invoke the Admin
  API from *inside* the database instead — deploy a short-lived Edge
  Function wrapping `auth.admin.createUser`, then call it with
  `pg_net.http_post(...)` from a SQL migration (pg_net runs server-side on
  Supabase's own network, so it isn't affected by an egress block). See
  git history around 2026-08-25 for the exact pattern. Credentials were
  handed to the founder directly, not committed here.
- **Storage:** admin-uploaded cover images go to the `blog-images` Storage
  bucket (public read, authenticated write). The 30 launch posts' cover
  images are the exception — they're committed as static files in
  `public/blog-covers/` instead, because Storage's public API wasn't
  reachable from the sandbox that seeded them; new posts uploaded through
  the admin UI use real Storage as intended.
- **The anon/publishable key in `lib/supabase.ts` is meant to be public** —
  it carries no privilege by itself. Every table and bucket it can touch is
  gated by RLS policies in Supabase, not by keeping that key secret.
- **Routing:** `react-router-dom`, with `vercel.json` rewriting everything
  to `/index.html` so direct navigation/refresh on `/blog/*` or `/admin/*`
  doesn't 404 on Vercel's static hosting. Blog and admin pages are
  code-split (`React.lazy`) so `react-markdown` and `supabase-js` never
  load for a visitor who only looks at the landing page.
- **SEO caveat:** per-page `<title>`/meta/JSON-LD on blog pages are set
  client-side (`lib/seo.ts`), since this is a CSR SPA with no server step.
  Modern Googlebot renders JS, but a crawler that doesn't (or executes it
  late) sees the base `index.html` metadata first. If organic blog traffic
  becomes the primary growth channel, migrating to a framework with real
  SSR/SSG would close that gap.

## CRM: leads + quotations

Also in the same Supabase project, alongside the blog.

- **Leads (`public.leads`):** the site's contact form (`EnquiryForm.tsx`,
  in the Contact section) writes every submission here — name, service,
  event date, location, budget range, free-text details — *in addition to*
  opening WhatsApp with the same details pre-filled, so nothing is lost if
  the founder doesn't act on the WhatsApp message right away. RLS: anyone
  can insert a lead (that's the public form); only the admin can read,
  update status (`new → contacted → quoted → won/lost`), or delete.
  Managed at `/admin/leads`, which also has a "+ Add lead" form for entries
  that didn't come through the site (phone calls, walk-ins, referrals), an
  "Import CSV" flow for bulk-adding an existing contact list (first row must
  be headers; `name`/`phone` required, `email`/`service`/`location`/
  `budget_range`/`details` optional — a few common header spellings for each
  are matched automatically), an "Edit" action per lead to fix any field
  after the fact (not just status), click-to-sort columns (name/service/
  status/date), and "Download CSV" to export the full table. All of this is
  client-side against the existing `leads` table — no new backend.
- **Quotations (`public.quotations` + `public.quotation_items`):** built at
  `/admin/quotations` — add line items (description/qty/unit price), the
  totals compute live, optionally flip on "Include tax invoice" (label +
  rate are both editable, defaults to GST 18%), save. No public access at
  all — these are internal documents. `quotation_number` auto-increments
  as `7TC-Q-0001`, `7TC-Q-0002`, ... via a Postgres sequence, so numbering
  never collides or needs manual tracking. A quotation can be created
  standalone or from a lead (`/admin/quotations/new?leadId=...` prefills
  the client fields from that lead).
- **Generating the actual quotation document:** `/admin/quotations/:id/print`
  is a plain, light-themed, letterhead-style page (deliberately outside the
  dark admin theme — it's meant to be read as a real document) with a
  "Print / Save as PDF" button that just calls `window.print()`. That's the
  entire PDF pipeline — no PDF-generation library, no server-side
  rendering. The admin header/nav carries `print:hidden` so it never ends
  up in the printed output.

## WhatsApp campaigns — `/admin/campaigns`

Select any set of leads, write one message (`{{name}}` personalizes per
contact), and step through them one at a time — each "Open WhatsApp →"
opens a pre-filled chat (`wa.me/<phone>?text=...`) for the founder to
review and send. **This is not automated bulk sending** — it's a
click-through assistant, deliberately, because real automated WhatsApp
marketing requires Meta's WhatsApp Business Platform: a registered
WhatsApp Business API phone number and pre-approved message templates
(freeform bulk messages to people outside a 24-hour reply window violate
WhatsApp's policy and get numbers banned). If that's ever wanted, it needs
the founder's own Meta Business/WhatsApp Business API account first — then
it's a Supabase Edge Function calling the Cloud API instead of this page.

## Site analytics — `/admin/analytics`

Self-hosted, not a third-party embed: `public.page_views` (path, referrer,
session_id, timestamp) is written by `lib/tracking.ts` on every real
navigation (admin routes excluded). Deliberately a raw `fetch()` POST to
Supabase's PostgREST endpoint, not the full `supabase-js` client — logging
a page view doesn't need auth/realtime/storage, and every visitor's first
load would otherwise pay for the ~220KB supabase-js chunk just for that.
No IP address or other PII is stored; `session_id` is a random UUID kept
in `sessionStorage`, not tied to identity. The admin page shows today/7d/
30d totals, a 14-day bar chart, top pages, and a "live now" count (unique
sessions active in the last 5 minutes, polled every 20s) — all computed
client-side from the raw rows, no separate aggregation job.

## Meta & Google ad account tracking — not built (needs your accounts)

Embedding real Meta Ads / Google Ads / Google Analytics data in the admin
board requires OAuth-connecting *your* actual ad accounts — a Meta
Business/developer app with `ads_read` permission, and/or a Google Cloud
OAuth client for the Google Ads API or GA4 Data API. These can't be
self-provisioned the way the Supabase backend was; they need the account
owner to register the app and complete an OAuth consent flow. If you set
those up (or hand over API credentials), the natural home for this is a
Supabase Edge Function per platform (keeping the tokens server-side) with
a new `/admin/ad-accounts` page reading from it.

## Email — not built (needs a provider account)

Sending real email (campaigns, or emailing a quotation/invoice straight from
`/admin/quotations` instead of only print/PDF) needs a transactional email
API — this can't be self-provisioned the way Supabase was; there's no
equivalent "just create an account" tool available here. The
lowest-friction option is [Resend](https://resend.com): sign up, verify a
sending domain (or use their shared test domain to start), generate an API
key. Once that key exists, it's a short Supabase Edge Function
(`send-email`, holding the key server-side, never in client code) called
from a new "Email" button on the quotation page and from `/admin/campaigns`
for a mail counterpart to the WhatsApp flow. Any provider with an HTTP API
works the same way (SendGrid, Postmark, plain SMTP) — Resend's just the
simplest to stand up from zero.

## A Tailwind gotcha worth knowing

`RealImage` hardcodes `relative` on its wrapper div. Passing `absolute`
into its `className` prop does **not** make it absolutely positioned —
Tailwind's generated stylesheet defines `.relative` after `.absolute`, so
on the specificity tie `.relative` wins and silently overrides it. Where a
`RealImage` needs to be a full-bleed absolute background (the hero photo,
each sticky project card), wrap it in an outer `<div className="absolute
inset-0">` instead and keep `RealImage` itself at `h-full w-full`.
