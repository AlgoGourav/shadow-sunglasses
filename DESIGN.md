<!-- SEED: re-run /impeccable document once there's code to capture the actual tokens and components. -->
---
name: shadow-web
description: Peelable lens shades that turn any glasses into sunglasses — swap the tint, keep the frame.
---

# Design System: shadow-web

## 1. Overview

**Creative North Star: "The Premium Optics Dossier"**

shadow-web reads like a premium eyewear house documenting a real optical product, not a sticker shop: a stark black-and-white base, moody studio-quality product photography (marble, wood grain, concrete, controlled reflections), and one rule that never breaks — the *brand chrome* stays monochrome (white ground, black ink) so the *product* — the tint itself, shown in real photography — is the only saturated color on the page. That's the pitch: color is what you're buying, not what we're decorating with. This direction follows the real product photography rather than fighting it: the images are moody, considered, and editorial, and the system is built to let them carry that weight.

Typography carries the identity, with more range than the system started with: a bold, chunky, geometric display face for headlines, a warm humanist companion for body copy, a technical mono for facts, and a confident hand-lettered script that now shows up often — not one rare flourish, but a recurring voice across most sections, the way a brand annotates its own claims in its own handwriting. The tension is still "confident brand voice" meets "spec sheet precision," because these are, functionally, real sunglasses, not decoration — the script adds a third layer (handwritten immediacy) without replacing either of the other two.

This system explicitly rejects Y2K glitch/clutter — no chromatic aberration, no maximalist noise, no chaotic layering. It also rejects anything that reads as "sticker pack": no scrapbook textures, no peel-corner clip art, no craft-decal visual language (per PRODUCT.md). Confidence comes from restraint in the base and precision in the photography, not from visual noise or cartoon energy.

**Key Characteristics:**
- Stark black-on-white (or white-on-black) base; color is reserved for the product, carried by real photography
- Moody, editorial-quality product photography as the primary visual device — not illustration, not decoration
- Bold, chunky display type + a warm humanist body companion + monospace, doing "confident brand voice," "readable body," and "spec sheet" duty respectively
- A hand-lettered script that now recurs across most sections — one confident touch per section, tied to a real claim, never a full heading or paragraph, never decorative texture
- Motion is responsive by default (the page reacts to you, it doesn't perform at you), with one named exception: a short, curated list of scroll-linked hand-drawn accents (section 5) marking the site's strongest claims — not general scroll choreography

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

**Display Font:** Unbounded (500–900) — bold, chunky, geometric display face with confident, slightly rounded terminals (`--font-heading`). Headlines only; its wide letterforms aren't built for paragraph-length reading. *(Replaces Bricolage Grotesque as of this revision — deliberate move toward a punchier, more GenZ-coded headline voice, picked fresh from a catalog rather than matching any specific competitor's typeface.)*
**Body Font:** Hanken Grotesk (400–700) — warm, humanist companion to Unbounded's geometry; carries all paragraph and UI copy (`--font-sans`). New addition — the previous system used one face for both roles, but Unbounded is too wide/dense for comfortable body reading, so body copy now has its own dedicated face, chosen specifically to contrast on a geometric-vs-humanist axis rather than just being a lighter cut of the display face.
**Label/Mono Font:** Martian Mono (400–600) — technical monospace for labels, prices, product specs (`--font-technical`). Unchanged by this revision.
**Accent Font:** Caveat (600–700) — a hand-lettered signature/marker script (`--font-accent`). Chosen over a bubbly cursive to read as a confident stamp/annotation rather than casual handwriting. Its role changed in this revision: no longer a once-a-page rarity — now a recurring voice across most sections, still governed (see the Recurring-Ink Rule), just not scarce.

**Character:** Confident-and-chunky meets spec-sheet-precise, with a layer of handwritten immediacy running through most sections. Display type should feel bold and stamped, like a brand making a statement; body type stays warm and legible underneath it; mono type stays precise and technical, like a UV rating printed on packaging; the script threads through most sections as the brand's own handwriting on its own claims — present often now, but still never replacing the display face as the primary voice.

### Hierarchy
- **Display**: hero headlines, the "turn any glasses into sunglasses" pitch. Bold weight (700–900), large scale (clamp ceiling ≤6rem per system-wide rule — tuned down slightly from a flat 6rem because Unbounded runs wider than a typical display face; verify against the longest single *word* in the real copy at every breakpoint, not just the sentence as a whole).
- **Headline**: section headers, product names. Same display face, 700 weight.
- **Title**: card/product titles, subsection headers.
- **Body**: Hanken Grotesk at a readable size for descriptive copy; cap line length at 65–75ch.
- **Label**: mono, used for prices, specs (UV rating, tint %, material), and small UI labels — uppercase or as-cased, tracked slightly wider than body.
- **Accent**: Caveat, as an inline emphasis word/phrase or a short overline annotation above a heading. Appears in most sections now, but still capped at one moment per section — never a full heading, never a full paragraph, never inside dense functional UI (spec tables, forms, prices).

### Named Rules
**The Spec-Sheet Rule.** Anything functional or factual (price, UV%, tint name, material) renders in mono. Anything expressive or persuasive (headlines, taglines) renders in display. Never swap the two roles.

**The Recurring-Ink Rule** *(supersedes the earlier Rare-Ink Rule).* The accent script always renders in ink black or ink white to match its surface (never a tint color — see the Ink-Adapts Rule in section 5) and always marks something that's actually true — a real hook, a real claim, never decorative flourish. It's now a recurring voice: most sections carry one accent moment (an inline word, a parenthetical aside, or an overline annotation). The discipline that survives the change from "rare" to "recurring" is density, not frequency — one confident touch per section reads as brand voice; two or more in the same section reads as clutter. Never in a full heading, never in a full paragraph, never inside a spec table, price, or form field.

**The Geometric + Humanist pairing.** Unbounded (geometric, wide, high-personality) and Hanken Grotesk (humanist, warm, legible) are a deliberate contrast pair, not a family-internal weight change — this is what keeps long-form copy readable underneath a very bold, characterful headline face.

## 4. Elevation

Flat by default, consistent with the stark black-and-white base — depth is conveyed through ink contrast and photography, not shadows. Responsive motion (hover/focus feedback) may introduce a light shadow or ink-thickening effect as state feedback, but shadows are not a resting-state device.

### Named Rules
**The Flat-By-Default Rule.** Surfaces sit flat against the white ground. Shadows, if used at all, appear only as a hover/focus response — never as ambient decoration.

## 5. Motion & Scroll-Linked Accents

This section is scoped to *motion* specifically — a hand-drawn stroke that draws in, undraws, or scrubs with scroll position. It stays a small, named, curated list, even though section 3's static script accent (a plain inline word, aside, or overline with no scroll-binding) is now a recurring presence across most sections. Motion is the heavier technique and remains rare on purpose; plain script typography is the lighter, now-common one. Adding a new *motion* moment means adding it to the list below on purpose, not reaching for it by reflex on the next section that needs a heading.

**The flagship-moment list (exhaustive as of this writing):**
1. **Hero** — "Real UV protection, not a filter." draws in/undraws (Replay Underline) as it scrolls in and out of view.
2. **TransformationProof** — "the difference." is bound continuously to scroll position (Scrub Underline), growing and shrinking as the reader scrolls both directions — the single heaviest motion move in the system, used exactly once.
3. **SpecSheet** — "Unbelievably true" floats above the heading as a script overline annotation; "(Try for yourself.)" appears as a script parenthetical inline in the lede.
4. **ColorLineup** — "swap it" in accent script with a static hand-drawn underline (shipped earlier; unchanged).
5. **InterestForm** — a decorative count-up ("first 100") framing a goal, not a live claim.

### Named Rules
**The Ink-Adapts Rule.** Accent strokes and script are always achromatic and match their surface — ink black on light surfaces, ink white (`--ink-inverse`) on dark ones (e.g. the Hero image) — never a tint color. This is the Product-Is-The-Color Rule applied to motion: the stroke renders in `currentColor` so it inherits whatever ink the surrounding text already uses.

**The Replay vs. Scrub distinction.** Replay Underline (draws in on enter, undraws on exit, replays every time) is for claims worth re-noticing each time a reader passes them. Scrub Underline (stroke length bound continuously to scroll position, both directions) is heavier and rarer — one per page, at most, marking the single most load-bearing claim on that page.

**Reduced motion is not optional.** Every scroll-linked accent renders fully drawn and static by default — server-rendered, no-JS, and `prefers-reduced-motion` all see the finished state immediately, the same philosophy as the `Reveal` scroll-reveal primitive. Motion is added only after mount, never a precondition for the content being visible or legible.

### Approved optical hero exception (October 1, 2026)

The owner explicitly requested and approved a white optical-studio hero with a hands-free, labeled, scroll-linked film application. This is a localized exception to the earlier responsive-only rule, in addition to the existing accent list. The rest of the page retains its sections and restrained interaction feedback.

- Keep the original clear prescription frame anchored. Independent photographic film planes move onto the **front/outside** lens surface and flatten to the measured full usable aperture, to the inner rim. The film is thin flexible adhesive polymer, not a second optical lens.
- Blue Mirror is the initial demonstration. All eight tints use the same frame; selecting a tint removes the previous film and introduces a fresh one. Removed films are not reusable.
- Native sticky scrolling only. Stage buttons offer direct control without requiring scroll. No scroll hijacking, autoplay video, decorative continuous camera flight, or pointer capture.
- White studio photography is approved for hero, comparison, application shots, and the consistent tint lineup. Existing editorial photography remains intact. Typography and monochrome structural UI remain unchanged.
- Reduced motion shows the applied state in normal flow and allows instant stage/tint changes. No-JavaScript or failed layer loading keeps a complete photographic poster and essential copy visible. Enhanced pinning begins only once required layers decode.

## 6. Components

*No components exist yet — this project is pre-implementation. Component patterns below are placeholders for the next `/impeccable document` pass once real code exists.*

`[component shapes, states, and exact values to be resolved during implementation]`

## 7. Do's and Don'ts

### Do:
- **Do** keep the brand chrome black-and-white; let the product's tint color be the only saturated color on screen (The Product-Is-The-Color Rule).
- **Do** use the Caveat accent script with intent — it's a recurring voice now (most sections, one moment each), but every instance still has to mark something actually true, never decorative filler.
- **Do** pair the bold Unbounded display face with the Hanken Grotesk body face and a technical mono, using mono specifically for functional/factual copy (prices, specs, UV rating).
- **Do** re-check headline `clamp()` ceilings against the longest real word (not just the sentence) whenever copy changes — Unbounded runs wider than a typical display face, so overflow risk is real at narrow viewports.
- **Do** keep motion responsive by default: feedback and transitions on interaction, no orchestrated or scroll-driven choreography — with the single named exception of the flagship scroll-linked accents in section 5.
- **Do** lead with the functional pitch — "turns any glasses into sunglasses" — before the color-swap hook, per PRODUCT.md.
- **Do** let the moody, editorial product photography carry the primary visual weight of the page — it's the identity, not a supporting element.
- **Do** keep any social-proof or urgency number honestly framed as a goal/invitation (e.g. "first 100") when it isn't wired to real data — never assert it as a current live fact.

### Don't:
- **Don't** call the product "stickers" in copy or visual language — no scrapbook textures, torn-paper edges, washi-tape, or peel-corner clip art (The No-Craft Rule, carried from PRODUCT.md's anti-references).
- **Don't** stack more than one script accent moment in the same section, and never let one dominate a section or compete with the photography — recurring is fine, cluttered isn't.
- **Don't** put the accent script inside a full heading, a full paragraph, a spec table, a form field, or a price — those stay in display, body, or mono per the Spec-Sheet Rule.
- **Don't** add a new scroll-linked underline or annotation without adding it to the flagship-moment list in section 5 first — that discipline is what keeps it an accent instead of scaffolding.
- **Don't** use Y2K glitch, chromatic aberration, or maximalist clutter — the named anti-reference for this system.
- **Don't** default to generic SaaS-cream backgrounds, hero-metric blocks, or templated e-commerce layout clichés.
- **Don't** let saturated color leak into structural UI (nav, footer, body text, borders) — that color budget belongs to the product alone.
- **Don't** use shadows as ambient/resting-state decoration; the system is flat by default.
