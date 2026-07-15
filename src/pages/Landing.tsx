import { useState } from "react";
import { ArrowDown, Check, Copy } from "lucide-react";
import { slides } from "@/data/cards";
import SetupPrompt from "@/components/SetupPrompt";
import PromptCode from "@/components/PromptCode";
import ContextSeed from "@/components/ContextSeed";
import ThemeToggle from "@/components/ThemeToggle";

const vocab = [
  {
    term: "Second brain",
    plain:
      "A folder of plain-text notes about your life and work that your AI reads before it answers. A method, not an app.",
  },
  {
    term: "Prompt",
    plain:
      "Anything you send the AI. It works best when you have a specific goal in mind.",
  },
  {
    term: "Context",
    plain:
      "The background you hand over with the prompt: notes, files, links, docs. The AI cannot know these things without you.",
  },
  {
    term: "Context window",
    plain:
      "The AI's working memory. It holds a lot (several novels) but degrades as it fills, so the first files it reads should stay short.",
  },
  {
    term: "Knowledge base",
    plain: "Your files and notes. An organized library the AI can search.",
  },
  {
    term: "Wiki",
    plain:
      "Pages linked together into a shared collection. Wikipedia is the famous one. Your brain works the same way, just private.",
  },
  {
    term: "Markdown",
    plain:
      "Plain text with simple marks: # makes a heading, **bold** makes bold. That's most of it.",
  },
  {
    term: "AGENTS.md",
    plain:
      "A short cue card that tells the AI how to work in a folder. It loads first, so keep it concise.",
  },
  {
    term: "Hyperlink",
    plain:
      "Clickable text that jumps to another file or page. Links are how the AI follows a thread through your notes.",
  },
  {
    term: "Gates",
    plain:
      "Approval points you define. The AI pauses and asks before it sends, spends, publishes, or deletes.",
  },
];

const deeperVocab = [
  {
    term: "Frontmatter / metadata",
    plain: "Background labels on a note: title, date, author, topic.",
  },
  {
    term: "Progressive disclosure",
    plain:
      "Reveal information in small layers. The AI reads the map first, then only the notes it needs.",
  },
  {
    term: "Loops",
    plain:
      "Small recurring maintenance runs: fix stale files, repair links, flag conflicts. Every day it gets a little better.",
  },
];

const agenda = [
  {
    q: "Q1",
    time: "0:00 – 0:25",
    title: "Fundamentals",
    body: "What a second brain is and why your AI gets smart when it can read your notes. Shared vocabulary so we all use the same words.",
  },
  {
    q: "Q2",
    time: "0:25 – 0:55",
    title: "Hands-on build",
    body: "Build your first second brain from scratch, live. Add your context, paste the prompt, watch five files appear.",
  },
  {
    q: "Half time",
    time: "0:55 – 1:05",
    title: "Questions",
    body: "Raise your hand to go off mute. Questions wait for these pauses so the build stays on track.",
  },
  {
    q: "Q3",
    time: "1:05 – 1:30",
    title: "Deeper dive",
    body: "Keeping the system alive instead of stale: maintenance loops, gates, and brains that update themselves while you sleep.",
  },
  {
    q: "Q4",
    time: "1:30 – 1:50",
    title: "Show and tell",
    body: "Two or three volunteers demo their setups, a few minutes each. Closing questions run to the top of the hour.",
  },
  {
    q: "After",
    time: "1:50 – 2:00+",
    title: "Overtime",
    body: "Buffer for whatever ran long, plus open questions and networking. Nobody gets cut off mid-thought.",
  },
];

const bonusPrompt =
  "Can you make me a visual representation of my second brain? Put it on my zo space.";

const maintenanceLoop = `## Brain Maintenance

**Purpose:** keep links, indexes, inbox routing, and current-truth surfaces healthy.

1. Read \`Home.md\`, \`STATE.md\`, the relevant indexes, and today's memory if present.
2. Check for broken local links, stale index routing, or obvious inbox items that
   already have a clear owner.
3. Make at most one small evidence-backed repair. Never bulk-rewrite notes.
4. Update \`STATE.md\` only if current truth actually changed.
5. Verify the touched links/files and log a concise receipt.`;

const interviewPrompt = `### 1. Interview
Help me build a small second brain for the part of my life or work I describe. Ask me, one at a time: what I want to organize first; what I'm working on; who matters; what safe source material I already have; and what you may do versus what needs my approval — do not create any files yet.

### 2. Plan
Based on my answers, propose the smallest useful second-brain structure. List each file or folder, what it is for, and any assumptions or unknowns; wait for my explicit approval before creating or changing anything.

### 3. Build
Approved — create only the plan we agreed on. When you finish, show me where my current work, people, sources, and next update live; do not send, publish, import private material, or change anything outside this workspace without asking.`;

function CopyChip({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-2 rounded-full border border-[var(--d-line)] bg-[var(--d-card)] px-4 py-2 font-mono text-[12px] text-[var(--d-ink)] transition hover:border-[var(--d-teal)]"
    >
      {copied ? (
        <Check className="size-3.5 text-[var(--d-teal)]" aria-hidden="true" />
      ) : (
        <Copy className="size-3.5 text-[var(--d-slate)]" aria-hidden="true" />
      )}
      {copied ? "Copied" : label}
    </button>
  );
}

function SectionKicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--d-teal-ink)]">
      {children}
    </p>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-[var(--d-canvas)] text-[var(--d-ink)] transition-colors">
      <a
        href="#build"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-[var(--d-teal)] focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to the build
      </a>

      <header className="sticky top-0 z-40 border-b border-[var(--d-line)] bg-[var(--d-canvas)]/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <a href="#top" className="flex items-center gap-3" aria-label="Second Brain Build Hours, home">
            <img src="/brand/pegasus-black.svg" alt="" className="h-7 w-auto dark:hidden" />
            <img src="/brand/pegasus-white.svg" alt="" className="hidden h-7 w-auto dark:block" />
            <span className="font-serif text-lg font-semibold tracking-tight">
              Second Brain Build Hours
            </span>
          </a>
          <nav aria-label="Sections" className="hidden items-center gap-6 font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--d-slate)] md:flex">
            <a href="#why" className="transition hover:text-[var(--d-teal-ink)]">Why</a>
            <a href="#words" className="transition hover:text-[var(--d-teal-ink)]">Words</a>
            <a href="#build" className="transition hover:text-[var(--d-teal-ink)]">Build</a>
            <a href="#deeper" className="transition hover:text-[var(--d-teal-ink)]">Go deeper</a>
            <a href="#hosts" className="transition hover:text-[var(--d-teal-ink)]">Hosts</a>
          </nav>
          <ThemeToggle />
        </div>
      </header>

      <main id="main">
        {/* Hero */}
        <section id="top" className="border-b border-[var(--d-line)]">
          <div className="mx-auto grid max-w-5xl gap-10 px-5 py-24 sm:px-8 sm:py-36 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <SectionKicker>A free two-hour workshop · hosted on Zo Computer</SectionKicker>
              <h1 className="mt-4 font-serif text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">
                Build a second brain your AI can actually read.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--d-slate)] text-pretty">
                Right now your AI restarts from zero every conversation, so you repeat yourself
                forever. In two hours you build a small folder of notes about you, your work, and
                your people — and the guessing stops. No coding. If you have never touched AI
                before, this page was written for you.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#build"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--d-teal)] px-7 py-3 text-base font-medium text-white shadow-sm transition hover:bg-[var(--d-teal-dark)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--d-amber)]"
                >
                  Get the setup prompt
                  <ArrowDown className="size-4" aria-hidden="true" />
                </a>
                <a
                  href="#why"
                  className="font-mono text-[13px] text-[var(--d-slate)] underline decoration-[var(--d-line)] underline-offset-4 transition hover:text-[var(--d-teal-ink)]"
                >
                  New to AI? Start from the top.
                </a>
              </div>
            </div>
            <figure className="relative">
              <img
                src="/images/hero-context-flow.png"
                alt="Illustration of loose notes flowing into an organized folder that an AI reads from."
                className="w-full rounded-2xl border border-[var(--d-line)] shadow-[0_24px_80px_rgba(0,0,0,0.12)]"
              />
              <figcaption className="mt-3 text-center font-mono text-[11px] text-[var(--d-slate)]">
                Your notes in. Real answers out.
              </figcaption>
            </figure>
          </div>
        </section>

        {/* Why */}
        <section id="why" aria-labelledby="why-h" className="border-b border-[var(--d-line)]">
          <div className="mx-auto max-w-5xl px-5 py-24 sm:px-8 sm:py-32">
            <SectionKicker>First principles</SectionKicker>
            <h2 id="why-h" className="mt-3 font-serif text-3xl font-semibold tracking-tight sm:text-4xl text-balance">
              What is a second brain?
            </h2>
            <div className="mt-10 grid gap-10 lg:gap-14 lg:grid-cols-2">
              <div className="space-y-5 text-[17px] leading-8 text-[var(--d-slate)]">
                <p>
                  A second brain is a personal system where you save what you know — your projects,
                  your people, your preferences — so you don't have to hold it all in your head. It
                  is a <strong className="text-[var(--d-ink)]">method, not an app</strong>. Ours is
                  the simplest possible version: a folder of plain-text files.
                </p>
                <p>
                  Think of Escher's two hands drawing each other. You write the notes; the notes
                  make your AI sharper; the sharper AI helps you write better notes. In Zo it isn't
                  just a prompt — it's an entire workspace. Memory your AI can read.
                </p>
                <p>
                  The whole workflow is one loop:{" "}
                  <span className="font-mono text-[14px] text-[var(--d-ink)]">
                    goal → context → answer → better structure → better answers
                  </span>
                  .
                </p>
              </div>
              <div className="rounded-2xl border border-[var(--d-line)] bg-[var(--d-card)] p-6 sm:p-8">
                <h3 className="font-serif text-xl font-semibold">The payoff, in one example</h3>
                <dl className="mt-5 space-y-5">
                  <div>
                    <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--d-coral-ink)]">
                      Before
                    </dt>
                    <dd className="mt-1.5 leading-7 text-[var(--d-slate)]">
                      "Draft a follow-up email to my client." The AI knows nothing, so you get a
                      generic template with the wrong tone and blanks where the names go.
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--d-teal-ink)]">
                      After
                    </dt>
                    <dd className="mt-1.5 leading-7 text-[var(--d-slate)]">
                      Same prompt. The AI reads <code className="font-mono text-[13px] text-[var(--d-ink)]">PEOPLE.md</code> and{" "}
                      <code className="font-mono text-[13px] text-[var(--d-ink)]">WORK.md</code> first, so it knows the client,
                      the project, and how you write. The draft sounds like you.
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section>

        {/* Word bank */}
        <section id="words" aria-labelledby="words-h" className="border-b border-[var(--d-line)] bg-[var(--d-teal-panel)]">
          <div className="mx-auto max-w-5xl px-5 py-24 sm:px-8 sm:py-32">
            <SectionKicker>Shared vocabulary</SectionKicker>
            <h2 id="words-h" className="mt-3 font-serif text-3xl font-semibold tracking-tight sm:text-4xl text-balance">
              Ten words, so we're never confused
            </h2>
            <p className="mt-4 max-w-2xl leading-8 text-[var(--d-slate)]">
              From here on the workshop uses these exact words. Skim them once; everything after
              this gets easier.
            </p>
            <dl className="mt-12 grid gap-x-12 gap-y-8 sm:grid-cols-2">
              {vocab.map((v) => (
                <div key={v.term} className="rounded-xl border border-[var(--d-line)] bg-[var(--d-card)] p-5">
                  <dt className="font-mono text-[13px] font-medium uppercase tracking-[0.12em] text-[var(--d-teal-ink)]">
                    {v.term}
                  </dt>
                  <dd className="mt-2 leading-7 text-[var(--d-slate)]">{v.plain}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Slides */}
        <section id="slides" aria-labelledby="slides-h" className="border-b border-[var(--d-line)]">
          <div className="mx-auto max-w-5xl px-5 py-24 sm:px-8 sm:py-32">
            <SectionKicker>The six ideas</SectionKicker>
            <h2 id="slides-h" className="mt-3 font-serif text-3xl font-semibold tracking-tight sm:text-4xl text-balance">
              Everything we teach, in six cards
            </h2>
            <div className="mt-16 space-y-28 sm:space-y-36">
              {slides.map((c, i) => (
                <article
                  key={c.n}
                  className={`grid items-center gap-10 lg:gap-16 lg:grid-cols-2 ${i % 2 === 1 ? "lg:[&>figure]:order-first" : ""}`}
                >
                  <div>
                    <p className="font-mono text-[12px] text-[var(--d-coral-ink)]">
                      {c.n} · {c.kicker}
                    </p>
                    <h3 className="mt-2 font-serif text-2xl font-semibold tracking-tight sm:text-3xl text-balance">
                      {c.headline}
                    </h3>
                    <p className="mt-4 leading-8 text-[var(--d-slate)] text-pretty">{c.body}</p>
                    <p className="mt-4 border-l-2 border-[var(--d-teal)] pl-4 font-serif text-lg italic text-[var(--d-ink)]">
                      {c.pull}
                    </p>
                  </div>
                  <figure>
                    <img
                      src={c.image}
                      alt={c.imageAlt}
                      loading="lazy"
                      className="w-full rounded-2xl border border-[var(--d-line)]"
                    />
                  </figure>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Build */}
        <section id="build" aria-labelledby="build-h" className="border-b border-[var(--d-line)]">
          <div className="mx-auto max-w-5xl px-5 py-24 sm:px-8 sm:py-32">
            <SectionKicker>The build · Q2</SectionKicker>
            <h2 id="build-h" className="mt-3 font-serif text-3xl font-semibold tracking-tight sm:text-4xl text-balance">
              Build yours in three steps
            </h2>

            <ol className="mt-14 space-y-16 sm:space-y-20">
              <li className="grid gap-6 lg:grid-cols-[64px_1fr]">
                <div className="flex size-12 items-center justify-center rounded-full border border-[var(--d-line)] bg-[var(--d-card)] font-serif text-xl font-semibold text-[var(--d-teal-ink)]">
                  1
                </div>
                <div>
                  <h3 className="font-serif text-xl font-semibold">Create your Zo account</h3>
                  <p className="mt-2 max-w-2xl leading-7 text-[var(--d-slate)]">
                    You'll need it in a few minutes. Sign up through either host's link — same Zo,
                    pick whoever sent you.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      href="https://zo-computer.cello.so/X9jcdFXqh9Z"
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border-2 border-[var(--d-teal)] px-5 py-2.5 text-sm font-medium text-[var(--d-teal-ink)] transition hover:bg-[var(--d-teal)] hover:text-white"
                    >
                      Sign up via Jeff
                    </a>
                    <a
                      href="https://etok.me/zo"
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border-2 border-[var(--d-coral)] px-5 py-2.5 text-sm font-medium text-[var(--d-coral-ink)] transition hover:bg-[var(--d-coral)] hover:text-white"
                    >
                      Sign up via Ethan
                    </a>
                  </div>
                </div>
              </li>

              <li className="grid gap-6 lg:grid-cols-[64px_1fr]">
                <div className="flex size-12 items-center justify-center rounded-full border border-[var(--d-line)] bg-[var(--d-card)] font-serif text-xl font-semibold text-[var(--d-teal-ink)]">
                  2
                </div>
                <div>
                  <h3 className="font-serif text-xl font-semibold">Seed some context</h3>
                  <p className="mt-2 max-w-2xl leading-7 text-[var(--d-slate)]">
                    Before you paste the prompt, tell Zo a little about yourself. The prompt builds
                    from what's already in the workspace — the more it knows, the less{" "}
                    <span className="font-mono text-[14px]">Unknown</span> you'll see. Fill out
                    whatever you're comfortable sharing and copy the finished message.
                  </p>
                  <ContextSeed />
                </div>
              </li>

              <li className="grid gap-6 lg:grid-cols-[64px_1fr]">
                <div className="flex size-12 items-center justify-center rounded-full border border-[var(--d-line)] bg-[var(--d-card)] font-serif text-xl font-semibold text-[var(--d-teal-ink)]">
                  3
                </div>
                <div className="min-w-0">
                  <h3 className="font-serif text-xl font-semibold">Paste the prompt</h3>
                  <p className="mt-2 max-w-2xl leading-7 text-[var(--d-slate)]">
                    One message. Five connected files. Zo drafts them from your context and writes{" "}
                    <span className="font-mono text-[14px]">Unknown</span> instead of making
                    things up.
                  </p>
                  <div className="mt-6 max-w-3xl">
                    <SetupPrompt />
                  </div>
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <p className="font-mono text-[12px] text-[var(--d-slate)]">Bonus, after it finishes:</p>
                    <CopyChip text={bonusPrompt} label="Copy the visual-brain prompt" />
                  </div>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--d-slate)]">
                    "{bonusPrompt}" — Zo will draw your brain as a page on your own Zo Space.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        {/* Deeper */}
        <section id="deeper" aria-labelledby="deeper-h" className="border-b border-[var(--d-line)] bg-[var(--d-teal-panel)]">
          <div className="mx-auto max-w-5xl px-5 py-24 sm:px-8 sm:py-32">
            <SectionKicker>The deeper dive · Q3</SectionKicker>
            <h2 id="deeper-h" className="mt-3 font-serif text-3xl font-semibold tracking-tight sm:text-4xl text-balance">
              Keep it alive
            </h2>
            <p className="mt-4 max-w-2xl leading-8 text-[var(--d-slate)]">
              A brain you never touch goes stale. Real brains prune unused pathways and strengthen
              the ones that fire together — yours should too. Three more words, then two patterns
              you can steal.
            </p>

            <dl className="mt-12 grid gap-x-12 gap-y-8 sm:grid-cols-3">
              {deeperVocab.map((v) => (
                <div key={v.term} className="rounded-xl border border-[var(--d-line)] bg-[var(--d-card)] p-5">
                  <dt className="font-mono text-[13px] font-medium uppercase tracking-[0.12em] text-[var(--d-teal-ink)]">
                    {v.term}
                  </dt>
                  <dd className="mt-2 leading-7 text-[var(--d-slate)]">{v.plain}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-12 grid gap-10 lg:gap-14 lg:grid-cols-2">
              <div>
                <h3 className="font-serif text-xl font-semibold">A maintenance loop, from Jeff's real brain</h3>
                <p className="mt-2 leading-7 text-[var(--d-slate)]">
                  Schedule this to run while you sleep. One small repair a day compounds.
                </p>
                <pre className="mt-4 overflow-x-hidden whitespace-pre-wrap break-words rounded-2xl border border-[var(--d-line)] bg-[var(--d-terminal)] p-5 font-mono text-[12.5px] leading-6 text-[var(--d-terminal-text)]">
                  <PromptCode text={maintenanceLoop} />
                </pre>
              </div>
              <div>
                <h3 className="font-serif text-xl font-semibold">Prefer to be interviewed?</h3>
                <p className="mt-2 leading-7 text-[var(--d-slate)]">
                  The advanced pattern: interview, plan, then build — with your approval gating each
                  step.
                </p>
                <pre className="mt-4 overflow-x-hidden whitespace-pre-wrap break-words rounded-2xl border border-[var(--d-line)] bg-[var(--d-terminal)] p-5 font-mono text-[12.5px] leading-6 text-[var(--d-terminal-text)]">
                  <PromptCode text={interviewPrompt} />
                </pre>
                <div className="mt-4">
                  <CopyChip text={interviewPrompt} label="Copy the interview prompt" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Agenda */}
        <section id="agenda" aria-labelledby="agenda-h" className="border-b border-[var(--d-line)]">
          <div className="mx-auto max-w-5xl px-5 py-24 sm:px-8 sm:py-32">
            <SectionKicker>Run of show</SectionKicker>
            <h2 id="agenda-h" className="mt-3 font-serif text-3xl font-semibold tracking-tight sm:text-4xl text-balance">
              How the two hours go
            </h2>
            <ol className="mt-8 divide-y divide-[var(--d-line)] rounded-2xl border border-[var(--d-line)] bg-[var(--d-card)]">
              {agenda.map((a) => (
                <li key={a.q} className="grid gap-2 p-5 sm:grid-cols-[110px_110px_1fr] sm:gap-6 sm:p-6">
                  <p className="font-mono text-[13px] font-medium text-[var(--d-coral-ink)]">{a.q}</p>
                  <p className="font-mono text-[13px] text-[var(--d-slate)]">{a.time}</p>
                  <div>
                    <h3 className="font-serif text-lg font-semibold">{a.title}</h3>
                    <p className="mt-1 leading-7 text-[var(--d-slate)]">{a.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-4 font-mono text-[12px] leading-6 text-[var(--d-slate)]">
              Times are generous estimates — we run ahead of them, not behind. Questions live in
              the pauses after Q2 and Q4.
            </p>
          </div>
        </section>

        {/* Hosts */}
        <section id="hosts" aria-labelledby="hosts-h" className="border-b border-[var(--d-line)]">
          <div className="mx-auto max-w-5xl px-5 py-24 sm:px-8 sm:py-32">
            <SectionKicker>Shameless plugs</SectionKicker>
            <h2 id="hosts-h" className="mt-3 font-serif text-3xl font-semibold tracking-tight sm:text-4xl text-balance">
              Your hosts
            </h2>
            <div className="mt-12 grid gap-x-16 gap-y-14 lg:grid-cols-2">
              <article className="border-t border-[var(--d-line)] pt-8">
                <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-[var(--d-teal-ink)]">Host</p>
                <h3 className="mt-3 font-serif text-2xl font-semibold">Jeff Kazzee</h3>
                <p className="mt-3 leading-7 text-[var(--d-slate)]">
                  A second brain is like a garden: worth having, better with a gardener. Jeff builds
                  and maintains personal and company brains — book a 1:1 to talk yours out, or email
                  him with follow-up questions.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href="https://jeffkazzee.zo.space/work-with-me"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-[var(--d-teal)] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--d-teal-dark)]"
                  >
                    Book a 1:1 with Jeff
                  </a>
                  <a
                    href="https://jeffkazzee.zo.space"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-[var(--d-line)] px-5 py-2.5 text-sm font-medium text-[var(--d-ink)] transition hover:border-[var(--d-teal)]"
                  >
                    jeffkazzee.zo.space
                  </a>
                </div>
              </article>
              <article className="border-t border-[var(--d-line)] pt-8">
                <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-[var(--d-coral-ink)]">Host</p>
                <h3 className="mt-3 font-serif text-2xl font-semibold">Ethan Davidson</h3>
                <p className="mt-3 leading-7 text-[var(--d-slate)]">
                  Ethan builds Wazoo, a workbench for structured, queryable world knowledge — the
                  same idea as your second brain, taken to planetary scale. Sign up to follow the
                  build.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href="https://wazoo.dev"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-[var(--d-coral)] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--d-coral-ink)]"
                  >
                    Sign up for Wazoo
                  </a>
                  <a
                    href="https://www.linkedin.com/in/etok/"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-[var(--d-line)] px-5 py-2.5 text-sm font-medium text-[var(--d-ink)] transition hover:border-[var(--d-coral)]"
                  >
                    Ethan on LinkedIn
                  </a>
                </div>
              </article>
            </div>
          </div>
        </section>

        <footer className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-5 py-12 text-center sm:px-8">
          <img src="/brand/wordmark-black.svg" alt="Zo" className="h-8 w-auto dark:hidden" />
          <img src="/brand/wordmark-white.svg" alt="Zo" className="hidden h-8 w-auto dark:block" />
          <p className="font-mono text-[12px] text-[var(--d-slate)]">
            Made with Zo Computer · Second Brain Build Hours with Jeff Kazzee &amp; Ethan Davidson
          </p>
        </footer>
      </main>
    </div>
  );
}
