# 7th Creation

> ## ✅ Resolved — read this first
>
> **7th Creation is a full-service media production studio in India** —
> photography, film, live events, brand content, marketing and web
> development. Confirmed by the founder's own project brief and a real site
> built from it, live at
> [seventh-creation-studio.lovable.app](https://seventh-creation-studio.lovable.app).
>
> **Start at [`brand/resolution-2026-08-24.md`](brand/resolution-2026-08-24.md).**
> Most of the strategy below (positioning, messaging, growth plan, editorial
> standards) was built for a different, incorrect picture of the business and
> has **not** been rewritten again pending a scoping decision — see that
> document §4-5. The identity work is unaffected.
>
> **[`site/`](site/) is a real, buildable website** — React, TypeScript,
> Tailwind, Framer Motion — carrying the real copy and structure from the
> Lovable build. Every photo in it is a labelled local placeholder, not a
> stock image; see [`site/README.md`](site/README.md) for why and what to
> swap before it ships.

---

**7th Creation is a creative studio for people building in the digital world —
which earns its client work by publishing research, not by pitching.**

> A Creative Studio

This repository holds the brand and marketing strategy.

## Strategy

| Document | What it covers |
| --- | --- |
| [`.agents/brand-context.md`](.agents/brand-context.md) | **Start here.** Identity, audience, positioning, values, goals. Every brand skill reads this file first |
| [`brand/positioning.md`](brand/positioning.md) | Category definition, competitive map, territory, moat, positioning statement |
| [`brand/messaging.md`](brand/messaging.md) | Core message, value proposition, taglines, messaging hierarchy, proof points |
| [`brand/identity.md`](brand/identity.md) | Audit of the existing logo — palette, typography, what works and what breaks |
| [`brand/identity-brief.md`](brand/identity-brief.md) | The rebuild brief — constraints, three art directions, deliverables |
| [`brand/voice.md`](brand/voice.md) | Verbal identity — tone, voice qualities, vocabulary, style rules |
| [`brand/architecture.md`](brand/architecture.md) | How the studio, publication and Day 7 relate — and the rules that keep them separate |
| [`marketing/growth-plan.md`](marketing/growth-plan.md) | 12-month AARRR growth plan, 90-day roadmap, pricing and revenue strategy |
| [`ASSUMPTIONS.md`](ASSUMPTIONS.md) | What's confirmed, what's inferred, and what breaks if the inferences are wrong |

## The strategy in one paragraph

7th Creation runs two engines, and only one of them is a business. The **media arm**
publishes verified research into the digital economy — it is deliberately barely
monetised, because its job is to demonstrate the studio's thinking in public to
exactly the people who commission work. The **studio** is the revenue: client work,
priced on demonstrated expertise. The publication is what makes the rate defensible,
since a prospect who has read six months of your reasoning arrives already convinced
and negotiates differently from one who found you in a directory. Sponsorship is
declined on purpose — one retained client outweighs a year of it, and independence
is worth more unspent. Prices rise because the expertise is visible before anyone
is hired, not because capacity grew.

## Working with these documents

This repo is set up for the [Production X skill toolkit](https://github.com/productionx-in/Core-Skills).
The brand skills read `.agents/brand-context.md` automatically:

```
/plugin marketplace add productionxin/Assets
/plugin install brand@productionx-skills
```

Then invoke skills by name — `/brand-identity`, `/brand-story`, `/content-strategy`
— rather than relying on description matching.

## Status

Strategy v2 — rebuilt for the studio-with-media-arm model.

**One open disagreement**, logged in [`ASSUMPTIONS.md`](ASSUMPTIONS.md): serving all
four client segments unsegmented works against the goal of raising prices. A
recommendation and an alternative are both on the table.

### Editorial standards — drafted, ready to publish

The three public documents the positioning rests on. Written to go on the site as-is,
in the brand's voice. See [`editorial/`](editorial/) for what must be filled first.

| Document | Commits to |
| --- | --- |
| [`sourcing-standard.md`](editorial/sourcing-standard.md) | What we require before publishing anything |
| [`corrections-policy.md`](editorial/corrections-policy.md) | Correcting in public, and keeping the log |
| [`conflicts-policy.md`](editorial/conflicts-policy.md) | The studio/publication conflict, named openly |

**Not yet built:** brand story, content strategy, and the identity artwork itself.
Master files belong in [`brand/assets/`](brand/assets/), currently a manifest only.
