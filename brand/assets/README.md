# Brand Assets

**Empty — the master artwork is not in this repo yet.**

The logo currently exists only as raster images shared in conversation. That is not
a durable home for a brand's primary asset: it can't be version-controlled,
re-exported, or handed to a printer or developer.

## What needs to land here

Per `../identity.md` §5, once the two versions are reconciled:

```
assets/
  svg/
    7c-full-gold.svg          hero, 400px+
    7c-full-mono-light.svg
    7c-full-mono-dark.svg
    7c-standard-*.svg         150–400px, simplified interior
    7c-compact-*.svg          48–150px, monogram + star
    7c-icon-*.svg             under 48px, bare monogram
  png/                        2x exports of each
  favicon/                    16 / 32 / 180 / 512
  wordmark/                   wordmark alone, all colourways
```

SVG is the master format for every tier. PNG exports are derived, never edited.

## Note on the source files

If the current logo was produced by an image generator rather than drawn as vector,
there are no true masters — the SVGs will need to be redrawn from the raster as
reference. That redraw is worth doing regardless: it is what makes the
simplification ladder in `../identity.md` §5.2 possible at all, and it removes the
rendered-composite quality flagged in §4.
