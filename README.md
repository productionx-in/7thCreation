# 7th Creation

**7th Creation is a research publication for people building in the digital economy.
Everything it publishes is sourced, dated, and revisited when the facts change.**

> Verified, not viral.

This repository holds the brand and marketing strategy.

## Strategy

| Document | What it covers |
| --- | --- |
| [`.agents/brand-context.md`](.agents/brand-context.md) | **Start here.** Identity, audience, positioning, values, goals. Every brand skill reads this file first |
| [`brand/positioning.md`](brand/positioning.md) | Category definition, competitive map, territory, moat, positioning statement |
| [`brand/messaging.md`](brand/messaging.md) | Core message, value proposition, taglines, messaging hierarchy, proof points |
| [`brand/voice.md`](brand/voice.md) | Verbal identity — tone, voice qualities, vocabulary, style rules |
| [`marketing/growth-plan.md`](marketing/growth-plan.md) | 12-month AARRR growth plan, 90-day roadmap, pricing and revenue strategy |
| [`ASSUMPTIONS.md`](ASSUMPTIONS.md) | What's confirmed, what's inferred, and what breaks if the inferences are wrong |

## The strategy in one paragraph

Media revenue is `audience × revenue per reader`. Most publications attack the
audience term, because it's visible and feels like progress — but it costs money
per unit, dilutes audience quality by construction, and drags pricing toward
volume-priced ad inventory where competitors set the ceiling. 7th Creation attacks
the other term. It monetises trust rather than reach: narrow the audience, make it
*verifiable*, publish the standards that prove the rigour is real, and move
revenue up the ladder from CPM to sponsorship to owned products. Prices rise
because the audience is provably specific, not because it grew.

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

Strategy foundation, v1. Six assumptions are flagged in
[`ASSUMPTIONS.md`](ASSUMPTIONS.md); two are inferred and should be confirmed before
budget is committed against them.

**Not yet built:** visual identity, brand story, content strategy, editorial
standards documents (sourcing standard, correction policy, conflicts policy —
these are the first execution deliverable, see the 90-day roadmap).
