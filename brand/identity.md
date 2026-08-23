# 7th Creation — Visual Identity

> Audit of the existing logo, and the specification derived from it.
> **Colour values below are eyeballed from the supplied images, not sampled from
> source files.** Replace them with exact values from the master artwork before
> anything is printed or shipped — see §6.

---

## 01 — What the Mark Is Doing

**The monogram.** A numeral **7** whose descending stroke sweeps into a crescent
that doubles as a **C** — so "7C" reads as one continuous gesture rather than two
letters placed together. This is the strongest thing in the identity. It is
genuinely ownable, it resolves the brand's two initials into a single form, and it
carries a natural sense of motion.

**The interior scene.** Inside the crescent: a lone figure on a rocky outcrop,
mountain range behind, a four-pointed star, scattered smaller stars. The metaphor
is unambiguous — solitary ambition, a distance still to travel, a fixed point to
navigate by. It reads instantly and needs no explanation, which is rare.

**Two executions, and they are not the same mark.**

| | Light / hero version | Monochrome version |
| --- | --- | --- |
| Monogram | Gold, metallic gradient, moon-crater texture | Flat white, no texture |
| Interior | Photographic composite | Redrawn as line art |
| "7TH" | Dark olive-green | White |
| Ground | Off-white with soft grey haze | Near-black with subtle grain |

This matters more than it looks. The interior art has been **redrawn**, not
recoloured — different mountains, a different figure, a different star. So these
are two related logos, not one logo in two colourways. Fixing this is §5, item 1.

---

## 02 — Colour Palette

🔶 Approximate. Sample from source artwork and replace.

**Primary**

| Role | Swatch | Approx. | Notes |
| --- | --- | --- | --- |
| Brand Gold | Metallic brass | `#C9A84C` | The signature. Note this is the exact value Production X already uses as its badge colour — the parent link is real, and worth making deliberate rather than coincidental |
| Signal Orange | Burnt sienna | `#D9541E` | The star, and the "A" in CREATION. The only true accent |
| Ink | Charcoal | `#2B2B2B` | Wordmark on light |
| Paper | Warm off-white | `#FAFAF8` | Light ground |
| Void | Near-black | `#0A0A0A` | Dark ground |

**Unresolved**

| Role | Approx. | Problem |
| --- | --- | --- |
| Deep Olive | `#3A4A32` | Colours "7TH" in the light version only, appears nowhere else, and is absent from the mono version. Right now it reads as accidental rather than chosen |

**Recommendation on the olive.** Either promote it to a real secondary — give it a
job (section rules, data, secondary UI) and put it in both versions — or drop it
and set "7TH" in Ink. A colour that appears once, in one lockup, is not a palette
member; it is an inconsistency. **Dropping it is the cleaner call** — the identity
is already carrying gold *and* orange, and a third hue at this level dilutes the
accent's power.

**On gold as a metallic.** Metallic gradients don't survive most real uses: single-
colour print, embroidery, favicons, dark-mode UI, video overlays. The identity needs
a **flat gold** defined alongside the metallic one — same hue, no gradient — as the
default for anything digital. Treat the metallic as a special-occasion finish, not
the primary.

---

## 03 — Typography

**Wordmark.** Geometric sans, all caps, very wide tracking (roughly 250–300/1000).
🔶 Appears to be in the Futura / Montserrat / Jost family — confirm from source.

**The orange "A".** The A in CREATION is replaced by a crossbar-less triangle in
Signal Orange. It is the identity's best small detail: it makes the wordmark
unmistakable at a glance and gives the accent colour somewhere to live in the type.
Keep it. Two constraints — it must never appear in running text (it belongs to the
logo only), and it needs checking at small sizes, where a crossbar-less A can read
as a solid triangle or a Greek delta.

**Tagline.** "A CREATIVE STUDIO", lighter weight, tracked wider still, flanked by
horizontal rules. Well-executed and correctly subordinate.

**What's missing:** a typographic *system*. A logo font is not a brand typeface.
Still needed: a heading face, a body face, and a rule for when the geometric caps
are permitted outside the logo (recommendation: never below ~14px, and never for
more than five words — tracked geometric caps become unreadable in quantity).

---

## 04 — Audit: What Works, What Breaks

**Works**

1. **The 7C monogram is ownable.** The best asset here. It would still be
   recognisable as a bare outline, which is the real test.
2. **The mono version is the stronger of the two.** Cleaner, more confident,
   scales further. It is closer to a finished logo than the gold version is.
3. **The metaphor lands without a caption.** Figure, summit, star — no one needs
   the story explained.
4. **The orange A** gives the wordmark a fingerprint.

**Breaks**

1. **The gold version will not scale down.** The photographic interior — figure,
   mountain detail, crater texture, star field — turns to noise below roughly
   200px and is unusable at favicon size. This is the most urgent practical problem,
   because it affects every avatar, favicon, app icon and social profile.
2. **There is no icon-only variant.** Every brand needs the mark alone, without the
   wordmark, for square contexts. It doesn't currently exist and can't simply be
   cropped out — the interior scene has to be simplified for it.
3. **The two versions have diverged.** See §1. Redrawn interiors mean inconsistent
   recognition across contexts.
4. **The rendered-metal-and-photo-composite style reads as AI-generated** to a
   design-literate viewer. That is a real commercial risk when the audience is
   people who commission creative work and can tell the difference. The mono
   version does not have this problem at all — another argument for leading with it.
5. **No defined clear-space, minimum size, or misuse rules.** Without them,
   the logo will be stretched, recoloured and placed on bad grounds within a month.
6. **Gold on white is low-contrast.** `#C9A84C` on `#FAFAF8` is around 2:1 —
   well below the 4.5:1 accessibility floor. Fine for a large hero mark, not fine
   for anything functional.

---

## 05 — What to Produce Next

In priority order. Items 1–3 are blocking for any real-world use.

1. **Reconcile the two versions.** Pick one interior composition — the mono line
   art is the better basis — and derive every other version from it. One mark,
   many colourways.
2. **Build the simplification ladder.** Four tiers, each a deliberate redraw:
   - **Full** — hero use, 400px+, full interior detail
   - **Standard** — 150–400px, simplified interior (figure, one peak, star)
   - **Compact** — 48–150px, monogram + star only, no figure
   - **Icon** — under 48px, bare 7C monogram, nothing inside
3. **Define clear-space and minimum sizes.** Clear-space of one crescent-width on
   all sides is a sensible default. Minimum: 32px for the icon, 120px with wordmark.
4. **Flat-gold and single-colour versions.** Flat gold, all-black, all-white,
   knockout. No gradients in any of them.
5. **Resolve the olive** (see §2).
6. **Choose heading and body typefaces**, and write the rule for the geometric caps.
7. **Add the master files to this repo** at `brand/assets/` — SVG for every tier
   and colourway, plus PNG exports. The identity currently exists only as raster
   images in a chat, which is not a durable state for a brand's primary asset.

---

## 06 — Usage Rules (Draft)

**Do**
- Lead with the monochrome version. It is the stronger mark and the safer one.
- Use the correct tier for the size (§5.2). Never scale the Full version down.
- Keep the orange A as the only accent in the wordmark.
- On dark grounds, use white or flat gold — never metallic.

**Don't**
- Stretch, rotate, or recolour the monogram outside the defined colourways.
- Place the gold version on a mid-tone or busy ground — it has no contrast to spare.
- Recreate the orange A in body copy or headlines. It belongs to the logo.
- Add effects — drop shadows, glows, outer strokes. The haze already in the hero
  version should be removed rather than built on.
- Use the logo below its minimum size instead of switching tiers.

---

## 07 — The Tension Worth Naming

**The logo says "A CREATIVE STUDIO". The strategy in this repo was built for a
media brand.** See `ASSUMPTIONS.md` §Contradiction — this needs resolving before
the identity work goes further, because it changes what the identity has to do.

Beyond the business-model question, there is a straightforward stylistic
observation: aspirational gold, a lone figure on a summit, a guiding star — this is
the visual language of **ambition and craft**. It suits a creative studio very
naturally. It sits less comfortably with the *rigorous, credible, evidence-first*
position in `brand/positioning.md`, which would normally reach for restraint,
precision and near-zero ornament.

Neither is wrong. They are answers to different questions. But the identity and the
positioning currently point in different directions, and one of them has to move.
