# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server (Turbopack) on localhost:3000
npm run build    # production build (also runs TypeScript check)
npm run start    # serve the production build
npm run lint     # eslint . (flat config in eslint.config.mjs)
```

There is no test runner configured in this project.

## Project context

This is **shadow-web**, the marketing/pre-launch landing page for "Shadow" — peelable lens tints that turn any glasses into functional sunglasses (real UV protection, swappable colors). It is a pre-launch page: there is no live checkout yet, the primary conversion action is an email interest-capture form, not a purchase.

Two files define the product/design direction and should be read before making any strategic or visual changes:
- `PRODUCT.md` — register (brand), target users, brand personality, anti-references, strategic design principles
- `DESIGN.md` — visual system: color strategy (the "Product-Is-The-Color Rule" — brand chrome stays black-and-white, saturated color only ever comes from product photography/swatches), typography (Bricolage Grotesque display/body + Martian Mono for labels/specs), motion (responsive-only, no scroll choreography), and Do's/Don'ts

Both were produced by the `impeccable` skill (`.claude/skills/impeccable/`), which also owns a `PostToolUse` hook (in `.claude/settings.local.json`) that runs a design-quality detector after Edit/Write/MultiEdit on UI files. Findings surface as system reminders; they are advisory, not blocking.

## Architecture

Next.js 16 App Router, TypeScript, React 19. No Tailwind — styling is hand-written CSS Modules per component plus a single token layer in `app/globals.css`.

- **Design tokens** live entirely in `app/globals.css` as CSS custom properties on `:root`: color (`--ink`, `--paper`, `--tint-*` swatch colors), type scale (`--text-*`, fluid `clamp()` for display/headline sizes per the brand register), spacing (`--space-*`, 4pt scale), motion easing/duration, and a z-index scale. Component `.module.css` files consume these vars; don't hardcode colors or spacing.
- **Fonts** are wired via `next/font/google` in `app/layout.tsx`, with the variable classes applied to `<html>` (not `<body>`). This placement matters: `--font-sans`/`--font-technical` in `globals.css` alias `var(--font-display)`/`var(--font-mono)`, and CSS custom-property `var()` references only resolve correctly when the referenced property is defined at or above the element declaring the alias. Moving the font classes back onto `<body>` will silently break font resolution (the previous bug — text falls back to the browser's serif default with no console error).
- **`app/page.tsx`** is a flat composition of section components (`components/Hero.tsx`, `TransformationProof.tsx`, `HowItWorks.tsx`, `ColorLineup.tsx`, `Editorial.tsx`, `SpecSheet.tsx`, `InterestForm.tsx`, `Footer.tsx`), each with a co-located `.module.css`. There's no shared layout/section abstraction — each section owns its own container/spacing.
- **`components/Reveal.tsx`** is the scroll-reveal primitive used by every section. It renders content visible by default (server-rendered/no-JS/reduced-motion all see the final state immediately), then on mount optimistically hides not-yet-visible elements and reveals them via `IntersectionObserver`, with a 2-second fallback timeout so content can never get stuck hidden. Any new animated section should wrap content in `<Reveal>` rather than inventing a new reveal mechanism.
- **`components/Button.tsx`** is the single shared CTA/button component with variants (`primary`, `ghost`, `onDark`, `ghostOnDark`) in `Button.module.css`. Use it instead of ad-hoc styled `<button>`/`<a>` elements.
- **Interest form flow**: `components/InterestForm.tsx` (client component) posts to `app/api/interest/route.ts`, which validates (email format, pack size, color preference) and calls `lib/interest-store.ts`. The store is a deliberately simple read-modify-write JSON file at `data/interest-submissions.json` (gitignored) — a placeholder store meant to be swapped for Supabase before launch, not a pattern to extend or harden further.
- **Product imagery** lives in `public/images/` (moved there from a top-level `images/` folder so Next can serve it statically). Filenames encode role and tint: `product-{slug}-main.png` / `-thumb-1.png` for the 8-color catalog grid, `lookbook-{slug}.png` for lifestyle/editorial shots, `step-{1-4}-{name}.png` for the how-it-works sequence, `explainer-before/after.png` for the transformation proof pair, plus `ui-hero-bg.png`, `ui-showcase-all.png`, `ui-placeholder.png`, `og-image.jpg`.
- **Lifestyle photography note**: the `lookbook-*` images depict real, recognizable people (licensed likenesses per the project owner). Captions in `Editorial.tsx` are deliberately understated (tint name + mood, no names) — don't add explicit celebrity attribution without confirming licensing terms allow it.

## Dependency notes

- `package.json` has a `postcss` override pinned to `8.5.10` — required to avoid a known XSS advisory in the postcss version Next.js bundles transitively. Don't remove it without re-checking `npm audit`.
- ESLint is intentionally pinned to the latest **9.x** line, not 10.x: `eslint-config-next` 16.2.10's dependency chain currently breaks at runtime under ESLint 10 (`scopeManager.addGlobals is not a function`), despite the declared `>=9.0.0` peer range. Re-evaluate this pin when upgrading eslint-config-next.
