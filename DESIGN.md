<!-- SEED: re-run /impeccable document once there's code to capture the actual tokens and components. -->
---
name: shadow-web
description: Peelable lens shades that turn any glasses into sunglasses — swap the tint, keep the frame.
---

# Design System: shadow-web

## 1. Overview

**Creative North Star: "The Premium Optics Dossier"**

shadow-web reads like a premium eyewear house documenting a real optical product, not a sticker shop: a stark black-and-white base, moody studio-quality product photography (marble, wood grain, concrete, controlled reflections), and one rule that never breaks — the *brand chrome* stays monochrome (white ground, black ink) so the *product* — the tint itself, shown in real photography — is the only saturated color on the page. That's the pitch: color is what you're buying, not what we're decorating with. This direction follows the real product photography rather than fighting it: the images are moody, considered, and editorial, and the system is built to let them carry that weight.

Typography carries the identity. A bold display face paired with a technical mono creates the tension between "confident brand voice" and "spec sheet precision" — because these are, functionally, real sunglasses, not decoration. Small hand-drawn accent marks (a single confident arrow, an annotation callout, a signature-style mark) appear sparingly — closer to an authentication stamp or a lab annotation than a doodle sheet — never dominant, never decorative filler.

This system explicitly rejects Y2K glitch/clutter — no chromatic aberration, no maximalist noise, no chaotic layering. It also rejects anything that reads as "sticker pack": no scrapbook textures, no peel-corner clip art, no craft-decal visual language (per PRODUCT.md). Confidence comes from restraint in the base and precision in the photography, not from visual noise or cartoon energy.

**Key Characteristics:**
- Stark black-on-white (or white-on-black) base; color is reserved for the product, carried by real photography
- Moody, editorial-quality product photography as the primary visual device — not illustration, not decoration
- Bold display type + monospace, doing double duty as "confident brand voice" and "spec sheet"
- Small accent marks used as rare, confident punctuation (authentication-stamp energy), never as background texture
- Responsive motion only — the page reacts to you, it doesn't perform at you

## 2. Colors

The base palette is achromatic and high-contrast; the only saturated color permitted on the page is the product's own tint color, shown in context (imagery, swatches, color-select UI).

### Primary
- **Ink Black** (`#0a0a0a` / `oklch(15% 0 0)`): primary text, primary surfaces in dark sections, accent-mark line-work. [to be resolved: exact black may shift slightly warm/cool during implementation]

### Neutral
- **Paper White** (`#ffffff` / `oklch(100% 0 0)`): dominant background. Not off-white, not cream — true white, to stay clear of the "warm neutral AI default."
- **Ink Black** (see Primary — doubles as the neutral/text role): body text, borders, dividers.

### Named Rules
**The Product-Is-The-Color Rule.** Brand chrome (nav, footer, body copy, structural UI) stays black-and-white, no exceptions. The only saturated color allowed on any screen is the actual tint color being shown or sold — in a product photo, a swatch, a color-select control. If a saturated color shows up anywhere else, it's wrong.

**The No-Craft Rule.** No scrapbook textures, torn-paper edges, washi-tape, or peel-corner clip art. Any accent line-work reinforces "documented optical product," not "sticker sheet."

*Exact hex/oklch values for any secondary ink tones, hover states, or disabled states: [to be resolved during implementation].*

## 3. Typography

**Display Font:** [to be chosen — bold, confident display face; editorial weight, not a training-data reflex pick] `[font pairing to be chosen at implementation]`
**Label/Mono Font:** [to be chosen — technical monospace for labels, prices, product specs] `[font pairing to be chosen at implementation]`

**Character:** Confident brand voice meets spec sheet. Display type should feel considered and premium, like a well-shot product dossier; mono type should feel precise and technical, like a UV-rating printed on packaging — the contrast between the two is the point.

### Hierarchy
- **Display**: hero headlines, the "turn any glasses into sunglasses" pitch. Bold weight, large scale (clamp ceiling ≤6rem per system-wide rule).
- **Headline**: section headers, product names.
- **Title**: card/product titles, subsection headers.
- **Body**: sans-serif or the mono at a readable size for descriptive copy; cap line length at 65–75ch.
- **Label**: mono, used for prices, specs (UV rating, tint %, material), and small UI labels — uppercase or as-cased, tracked slightly wider than body.

### Named Rules
**The Spec-Sheet Rule.** Anything functional or factual (price, UV%, tint name, material) renders in mono. Anything expressive or persuasive (headlines, taglines) renders in display. Never swap the two roles.

## 4. Elevation

Flat by default, consistent with the stark black-and-white base — depth is conveyed through ink contrast and photography, not shadows. Responsive motion (hover/focus feedback) may introduce a light shadow or ink-thickening effect as state feedback, but shadows are not a resting-state device.

### Named Rules
**The Flat-By-Default Rule.** Surfaces sit flat against the white ground. Shadows, if used at all, appear only as a hover/focus response — never as ambient decoration.

## 5. Components

*No components exist yet — this project is pre-implementation. Component patterns below are placeholders for the next `/impeccable document` pass once real code exists.*

`[component shapes, states, and exact values to be resolved during implementation]`

## 6. Do's and Don'ts

### Do:
- **Do** keep the brand chrome black-and-white; let the product's tint color be the only saturated color on screen (The Product-Is-The-Color Rule).
- **Do** use small accent marks (a confident arrow, an annotation callout) sparingly and with intent — authentication-stamp energy, not decorative filler.
- **Do** pair a bold display face with a technical mono, using mono specifically for functional/factual copy (prices, specs, UV rating).
- **Do** keep motion responsive: feedback and transitions on interaction, no orchestrated or scroll-driven choreography.
- **Do** lead with the functional pitch — "turns any glasses into sunglasses" — before the color-swap hook, per PRODUCT.md.
- **Do** let the moody, editorial product photography carry the primary visual weight of the page — it's the identity, not a supporting element.

### Don't:
- **Don't** call the product "stickers" in copy or visual language — no scrapbook textures, torn-paper edges, washi-tape, or peel-corner clip art (The No-Craft Rule, carried from PRODUCT.md's anti-references).
- **Don't** let accent marks dominate a section or compete with the photography — they're rare punctuation, not a graphic system.
- **Don't** use Y2K glitch, chromatic aberration, or maximalist clutter — the named anti-reference for this system.
- **Don't** default to generic SaaS-cream backgrounds, hero-metric blocks, or templated e-commerce layout clichés.
- **Don't** let saturated color leak into structural UI (nav, footer, body text, borders) — that color budget belongs to the product alone.
- **Don't** use shadows as ambient/resting-state decoration; the system is flat by default.
