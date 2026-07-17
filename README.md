# Second Brain event site

An accessible, single-page workshop companion for the Build Your Second Brain event. It teaches the file-based second-brain method through six illustrated ideas, provides a fill-in context template and the exact setup prompt, and closes with clear paths to Jeff Kazzee and Ethan Davidson.

Live site: [second-brain-jeffkazzee.zocomputer.io](https://second-brain-jeffkazzee.zocomputer.io)

Source: [github.com/Jeff-Kazzee/second-brain-site](https://github.com/Jeff-Kazzee/second-brain-site)

## Stack

- Bun and Hono serve the app.
- Vite, React 19, and Tailwind CSS 4 render the page.
- Content and UI live under `src/`.
- Static illustrations live under `public/`.

## Project notes

- Redesigned 2026-07-14 around the Build Hours run of show: hero, first principles (Q1), ten-word vocabulary bank, six teaching cards from the recut deck, three-step build (Q2), deeper dive with maintenance loop and interview prompts (Q3), schedule, and hosts.
- The visual system matches the workshop deck: paper neutrals, teal and coral accents, EB Garamond headings (Zo serif), Space Grotesk body, JetBrains Mono for code. Dark mode is designed, not inverted.
- The "What is a second brain?" section (`#why`) answers the question with one Zo-specific sentence instead of a paragraph stack: serif heading dominates, the answer is a subordinate `text-xl` body lead in Space Grotesk with the key phrase bolded, and "Memory your AI can read" sits below as a mono accent. The two-column grid is `lg:items-start` so the short prose top-aligns with the tall infographic.
- The "What you can get out of your second brain" section (`#benefits`) presents its four outcomes (Instant Context, On-Brand Drafts, Approval Gates, Automatic Updates) as `BenefitsCarousel` — one outcome per screen for live workshop discussion, mirroring `DeeperConceptCarousel` (pill navigation, "Outcome X of 4" counter, prev/next, progress dots). Each screen pairs the text with a small text-free inline-SVG from `BenefitGraphic` drawn with the site's theme tokens so it adapts to dark mode: a file feeding an AI node, a page marked on-brand with a coral pen, a shield with a check, and a slowly spinning refresh cycle (rotation gated by `motion-reduce`). No generated image assets — all four graphics are hand-built SVGs like `ConceptGraphic`.
- The "Keep it alive" section (`#deeper`) presents its three concepts (frontmatter/metadata, progressive disclosure, loops) as `DeeperConceptCarousel` — one concept per screen for live workshop discussion, with pill navigation, prev/next, and progress dots (mirrors the existing `VocabularyCardDeck` pattern). Each screen pairs the text with a small, deliberately minimal, text-free infographic from `ConceptGraphic`: hand-built inline SVGs (a metadata-headed document, a progressive-reveal stack, a slowly spinning self-healing loop) drawn with the site's theme tokens so they adapt to dark mode. The loop's rotation is gated by `motion-reduce`. The maintenance-loop and interview-prompt blocks below the carousel are unchanged.
- Dev-server gotcha: `server.ts` runs Vite in middleware mode with `hmr:false`, and the file watcher does not fire reliably on this filesystem, so edits to page components (e.g. `Landing.tsx`) can stay stale in the running preview even though the source is correct. Bun `--hot` only watches `server.ts` and its static imports, and re-init of Vite under `--hot` throws. Verify changes against a fresh `bun run build` (the production bundle always reflects source); do not fight the managed dev process to force a refresh.
- Zo brand assets (pegasus + wordmark, black and white) live in `public/brand/` and swap with the theme.
- The setup prompt is the simple five-file version (brain/ with AGENTS.md, USER.md, WORK.md, PEOPLE.md, NOTES.md). The visual-representation bonus prompt sits under the paste step.
- Step 2 uses `ContextSeed.tsx`: a six-field fill-in form (name, what you do, links, current project, people, anything else) that assembles a "Here's some context about me..." message client-side and copies it. Nothing is sent anywhere; the copy button is disabled until at least one field has content.
- Markdown prompts use `PromptCode.tsx` for lightweight syntax coloring and wrap long lines instead of creating horizontal page overflow.
- Signups: Jeff's Cello link (`zo-computer.cello.so/X9jcdFXqh9Z`) and Ethan's link (`etok.me/zo`), equal weight, side by side in step 1 of the build.
- Public copy teaches the method only. Private second-brain contents never enter the site.
- Event registration points to `https://lu.ma/zo-3fd5`.
- Consultation calls point to `https://jeffkazzee.zo.space/work-with-me` and use the verified $40 half-hour offer.
- Ethan Davidson's current link is `https://etok.me` (his personal site; label reads "Ethan's site"). His workshop signup link is `etok.me/zo`.
- The Vite development handler in `server.ts` preserves query strings so raw imports such as `?raw` work correctly.
- Published publicly as a Zo Site on 2026-07-15. The source is maintained in a standalone public GitHub repository so unrelated workspace history and files cannot enter the release.

- The community library section (`#library`) invites ad hoc second-brain submissions through a structured GitHub issue form, links to browse open submissions, and includes a copyable submission starter. Submissions are explicitly safety-scoped and require maintainer review before publication.

## Commands

```bash
bun install
bunx tsc --noEmit
bun run build
```

Zo manages the development process. Do not start, stop, or restart it manually.
