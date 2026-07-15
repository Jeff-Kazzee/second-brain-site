# Second Brain event site

An accessible, single-page workshop companion for the Build Your Second Brain event. It teaches the file-based second-brain method through six illustrated ideas, provides a fill-in context template and the exact setup prompt, and closes with clear paths to Jeff Kazzee and Ethan Davidson.

Live site: [second-brain-jeffkazzee.zocomputer.io](https://second-brain-jeffkazzee.zocomputer.io)

## Stack

- Bun and Hono serve the app.
- Vite, React 19, and Tailwind CSS 4 render the page.
- Content and UI live under `src/`.
- Static illustrations live under `public/`.

## Project notes

- Redesigned 2026-07-14 around the Build Hours run of show: hero, first principles (Q1), ten-word vocabulary bank, six teaching cards from the recut deck, three-step build (Q2), deeper dive with maintenance loop and interview prompts (Q3), schedule, and hosts.
- The visual system matches the workshop deck: paper neutrals, teal and coral accents, EB Garamond headings (Zo serif), Space Grotesk body, JetBrains Mono for code. Dark mode is designed, not inverted.
- Zo brand assets (pegasus + wordmark, black and white) live in `public/brand/` and swap with the theme.
- The setup prompt is the simple five-file version (brain/ with AGENTS.md, USER.md, WORK.md, PEOPLE.md, NOTES.md). The visual-representation bonus prompt sits under the paste step.
- Step 2 uses `ContextSeed.tsx`: a six-field fill-in form (name, what you do, links, current project, people, anything else) that assembles a "Here's some context about me..." message client-side and copies it. Nothing is sent anywhere; the copy button is disabled until at least one field has content.
- Markdown prompts use `PromptCode.tsx` for lightweight syntax coloring and wrap long lines instead of creating horizontal page overflow.
- Signups: Jeff's Cello link (`zo-computer.cello.so/X9jcdFXqh9Z`) and Ethan's link (`etok.me/zo`), equal weight, side by side in step 1 of the build.
- Public copy teaches the method only. Private second-brain contents never enter the site.
- Event registration points to `https://lu.ma/zo-3fd5`.
- Consultation calls point to `https://jeffkazzee.zo.space/work-with-me` and use the verified $40 half-hour offer.
- Ethan Davidson's current link is `https://www.linkedin.com/in/etok/`.
- The Vite development handler in `server.ts` preserves query strings so raw imports such as `?raw` work correctly.
- The site is prepared for a public Zo Site release and a standalone public GitHub repository. Publishing and outreach still require explicit approval for each release.

## Commands

```bash
bun install
bunx tsc --noEmit
bun run build
```

Zo manages the development process. Do not start, stop, or restart it manually.
