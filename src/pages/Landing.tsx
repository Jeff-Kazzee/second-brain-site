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
      "A personal digital system—like a notes app or organized software—where you save your thoughts, ideas, and important information so you don't have to rely on your own memory to keep track of everything. Popularized by Tiago Forte.",
  },
  {
    term: "Prompt",
    plain:
      "Anything you send the AI. It works best when you have a specific goal or intent in mind, because it is trained to solve problems.",
  },
  {
    term: "Context",
    plain:
      "The background information you hand over with the prompt: notes, files, links, docs, or websites. The AI cannot know these things without you providing them.",
  },
  {
    term: "Context window",
    plain:
      "The AI's working memory. It holds a lot (several novels) but degrades as it fills (especially after 50%), so the first files it reads should stay short and high-quality.",
  },
  {
    term: "Knowledge base",
    plain:
      "A central, organized digital library where information, guides, and answers are stored so people and AI can easily search for and find what they need (your files and notes).",
  },
  {
    term: "Wiki",
    plain:
      "A type of collaborative workspace where pages are created, edited, and linked together to build a shared collection of information (Wikipedia is the famous example; your second brain is the same, just private).",
  },
  {
    term: "AGENTS.md",
    plain:
      "A short cue card file that tells the AI how to work in a folder. It loads first, so keep it concise, avoiding filesystem trivia.",
  },
  {
    term: "Hyperlink",
    plain:
      "Clickable text that jumps to another file or page. Links are how the AI follows a thread of logic through your notes.",
  },
  {
    term: "Gates",
    plain:
      "Approval points you define (e.g. codified in AGENTS.md). The AI pauses and asks before it sends, spends, publishes, or deletes.",
  },
  {
    term: "Loops",
    plain:
      "Self-healing maintenance routines: clean up stale files, fix broken links, flag conflicts. Every day it gets a little better.",
  },
];

const deeperVocab = [
  {
    term: "Frontmatter / metadata",
    plain: "Hidden background details that label and organize content, such as its title, date, author, or topic.",
  },
  {
    term: "Progressive disclosure",
    plain: "Reveal information in small, useful layers so you only see what is needed at each moment.",
  },
  {
    term: "Loops",
    plain: "Self-healing maintenance routines: clean up stale files, fix broken links, flag conflicts. Every day it gets a little better.",
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

function VocabularyCardDeck() {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = vocab.length;

  const next = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const prev = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  return (
    <div className="mt-10 space-y-6">
      {/* Term Navigator */}
      <div className="flex flex-wrap gap-2 justify-center pb-4 border-b border-[var(--d-line)]">
        {vocab.map((v, i) => (
          <button
            key={v.term}
            type="button"
            onClick={() => setActiveIndex(i)}
            className={`px-3 py-1.5 rounded-full font-mono text-[12px] tracking-wider transition ${
              activeIndex === i
                ? "bg-[var(--d-teal)] text-white"
                : "bg-[var(--d-card)] text-[var(--d-slate)] border border-[var(--d-line)] hover:border-[var(--d-teal)] hover:text-[var(--d-ink)]"
            }`}
          >
            {v.term}
          </button>
        ))}
      </div>

      {/* The Active Card (Shows one word at a time) */}
      <div className="relative min-h-[220px] rounded-2xl border border-[var(--d-line)] bg-[var(--d-card)] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between transition-all duration-300">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--d-coral-ink)]">
            Term {activeIndex + 1} of {total}
          </span>
          <h3 className="mt-3 font-serif text-3xl font-semibold text-[var(--d-ink)] tracking-tight">
            {vocab[activeIndex].term}
          </h3>
          <p className="mt-4 text-[18px] leading-8 text-[var(--d-slate)] text-pretty">
            {vocab[activeIndex].plain}
          </p>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={prev}
            className="px-4 py-2 rounded-full border border-[var(--d-line)] bg-[var(--d-canvas)] font-mono text-[12px] text-[var(--d-slate)] hover:text-[var(--d-ink)] hover:border-[var(--d-teal)] transition"
          >
            ← Previous
          </button>
          
          {/* Progress dots */}
          <div className="flex gap-1.5">
            {vocab.map((_, i) => (
              <span
                key={i}
                className={`size-2 rounded-full transition-all ${
                  activeIndex === i ? "bg-[var(--d-teal)] w-4" : "bg-[var(--d-line)]"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={next}
            className="px-4 py-2 rounded-full border border-[var(--d-line)] bg-[var(--d-canvas)] font-mono text-[12px] text-[var(--d-slate)] hover:text-[var(--d-ink)] hover:border-[var(--d-teal)] transition"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  return (
    <div id="top" className="min-h-screen bg-[var(--d-canvas)] text-[var(--d-ink)] transition-colors">
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
            <a href="#rules" className="transition hover:text-[var(--d-teal-ink)]">Rules &amp; Agenda</a>
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
        {/* Hero Section */}
        <section id="hero" className="border-b border-[var(--d-line)]">
          <div className="mx-auto grid max-w-5xl gap-10 px-5 py-24 sm:px-8 sm:py-36 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <SectionKicker>Welcome · Build hours</SectionKicker>
              <h1 className="mt-4 font-serif text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl text-balance">
                Build your 2nd Brain in 2 hours.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--d-slate)] text-pretty">
                Welcome to Second Brain Build Hours hosted by <strong className="text-[var(--d-ink)]">Jeff Kazzee</strong> and <strong className="text-[var(--d-ink)]">Ethan Davidson</strong>. We will guide you step-by-step from ground rules and core concepts through building your own AI-readable second brain from scratch.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#rules"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--d-teal)] px-7 py-3 text-base font-medium text-white shadow-sm transition hover:bg-[var(--d-teal-dark)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--d-amber)]"
                >
                  Start with the rules &amp; agenda
                  <ArrowDown className="size-4" aria-hidden="true" />
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

        {/* Section 1: Ground Rules & Agenda (Tell them what we're gonna tell them) */}
        <section id="rules" className="border-b border-[var(--d-line)] bg-[var(--d-teal-panel)]">
          <div className="mx-auto max-w-5xl px-5 py-24 sm:px-8 sm:py-32">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
              {/* Ground Rules */}
              <div className="space-y-6">
                <SectionKicker>First things first · 6 mins</SectionKicker>
                <h2 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
                  Ground Rules &amp; Questions Protocol
                </h2>
                <div className="space-y-5 text-[16px] leading-7 text-[var(--d-slate)]">
                  <p>
                    To keep the workshop running smoothly and make sure everyone builds their second brain, please follow our questions protocol:
                  </p>
                  <ul className="space-y-4">
                    <li className="rounded-xl border border-[var(--d-line)] bg-[var(--d-card)] p-4">
                      <strong className="block font-mono text-[12px] uppercase tracking-[0.1em] text-[var(--d-coral-ink)]">
                        Wait for Designated Pauses
                      </strong>
                      <span className="mt-1 block text-sm">
                        We have designated spots before the end of sections for you to ask questions. Please hold your questions for those pauses (like at Halftime and the end of Q4).
                      </span>
                    </li>
                    <li className="rounded-xl border border-[var(--d-line)] bg-[var(--d-card)] p-4">
                      <strong className="block font-mono text-[12px] uppercase tracking-[0.1em] text-[var(--d-teal-ink)]">
                        Raise Your Hand
                      </strong>
                      <span className="mt-1 block text-sm">
                        Raise your hand on Zo if you want to go off mute and ask a question aloud during our pauses.
                      </span>
                    </li>
                    <li className="rounded-xl border border-[var(--d-line)] bg-[var(--d-card)] p-4">
                      <strong className="block font-mono text-[12px] uppercase tracking-[0.1em] text-[var(--d-slate)]">
                        Overtime &amp; Networking
                      </strong>
                      <span className="mt-1 block text-sm">
                        The Zo team can jump in if we are losing track of time/pace. We will also stay after the 2-hour mark to answer any leftover questions and network.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Agenda */}
              <div className="space-y-6">
                <SectionKicker>Overview</SectionKicker>
                <h2 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
                  The Two-Hour Agenda
                </h2>
                <p className="text-[16px] leading-7 text-[var(--d-slate)]">
                  Here is how we will progress through the presentation. We tell you what we're going to tell you, teach you, then wrap up with what we told you.
                </p>
                <ol className="divide-y divide-[var(--d-line)] rounded-xl border border-[var(--d-line)] bg-[var(--d-card)]">
                  {agenda.map((a) => (
                    <li key={a.q} className="grid gap-2 p-4 sm:grid-cols-[80px_100px_1fr] sm:gap-4">
                      <p className="font-mono text-[12px] font-medium text-[var(--d-coral-ink)]">{a.q}</p>
                      <p className="font-mono text-[12px] text-[var(--d-slate)]">{a.time}</p>
                      <div>
                        <h3 className="font-serif text-base font-semibold">{a.title}</h3>
                        <p className="mt-1 text-sm leading-6 text-[var(--d-slate)]">{a.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <p className="font-mono text-[11px] leading-5 text-[var(--d-slate)]">
                  * Note: Times are estimates. Questions live in designated pauses after Q2 and Q4.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: What is a Second Brain? (Tell them) */}
        <section id="why" className="border-b border-[var(--d-line)]">
          <div className="mx-auto max-w-5xl px-5 py-24 sm:px-8 sm:py-32">
            <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div className="space-y-6">
                <SectionKicker>First principles · 10 mins</SectionKicker>
                <h2 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
                  What is a second brain?
                </h2>
                <div className="space-y-5 text-[17px] leading-8 text-[var(--d-slate)] text-pretty">
                  <p>
                    Everyone has a million things to keep track of. The main purpose of a second brain is to store all the knowledge, info, and preferences you want an AI to access for day-to-day work.
                  </p>
                  <p>
                    <strong className="text-[var(--d-ink)]">Without a second brain, your AI restarts from zero every single conversation.</strong> You are forced to repeat yourself and re-explain your work forever.
                  </p>
                  <p>
                    A second brain is a productivity methodology (popularized by Tiago Forte) rather than a generic app label. It is like a paintbrush and canvas — Escher's two hands drawing each other. You write the notes, the notes make your AI sharper, and the sharper AI helps you write better notes.
                  </p>
                  <p>
                    In Zo, your second brain is an entire workspace folder of plain-text files that your AI reads dynamically. Memory your AI can read.
                  </p>
                </div>
              </div>

              {/* Joanna's Second Brain Visual */}
              <div className="space-y-4">
                <figure className="relative">
                  <img
                    src="/images/joannas_second_brain.png"
                    alt="Mockup of Joanna's second brain workspace in Zo, showing files like USER.md and AGENTS.md."
                    className="w-full rounded-2xl border border-[var(--d-line)] shadow-[0_24px_80px_rgba(0,0,0,0.12)]"
                  />
                  <figcaption className="mt-3 text-center font-mono text-[11px] text-[var(--d-slate)]">
                    Visual Example: Joanna's Second Brain workspace showing connected Markdown files.
                  </figcaption>
                </figure>
                <div className="rounded-xl border border-[var(--d-line)] bg-[var(--d-card)] p-5 text-sm leading-6 text-[var(--d-slate)]">
                  <span className="font-mono text-[12px] font-semibold uppercase tracking-[0.1em] text-[var(--d-teal-ink)]">How it connects:</span>
                  <ul className="mt-2 list-disc pl-5 space-y-1">
                    <li><code className="text-[var(--d-ink)]">AGENTS.md</code>: The cue card directing the AI.</li>
                    <li><code className="text-[var(--d-ink)]">USER.md</code>: Joanna's personal guidelines and preferences.</li>
                    <li><code className="text-[var(--d-ink)]">WORK.md</code> &amp; <code className="text-[var(--d-ink)]">PEOPLE.md</code>: Active projects and client contacts.</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Why You Want a Second Brain */}
            <div className="mt-16 pt-16 border-t border-[var(--d-line)]">
              <SectionKicker>The Payoff</SectionKicker>
              <h3 className="mt-3 font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
                Why do you want a second brain?
              </h3>
              <div className="mt-8 grid gap-6 sm:grid-cols-3">
                <div className="rounded-2xl border border-[var(--d-line)] bg-[var(--d-card)] p-6 shadow-sm">
                  <span className="text-3xl" role="img" aria-label="brain">🧠</span>
                  <h4 className="mt-4 font-serif text-lg font-semibold">To remember things for you</h4>
                  <p className="mt-2 text-sm leading-6 text-[var(--d-slate)]">
                    You have a million things to keep track of. Save your projects, client notes, reference documents, and plans in one place so your own memory doesn't have to carry the load.
                  </p>
                </div>
                <div className="rounded-2xl border border-[var(--d-line)] bg-[var(--d-card)] p-6 shadow-sm border-l-4 border-l-[var(--d-teal)]">
                  <span className="text-3xl" role="img" aria-label="user">👤</span>
                  <h4 className="mt-4 font-serif text-lg font-semibold">To work for you, LIKE YOU</h4>
                  <p className="mt-2 text-sm leading-6 text-[var(--d-slate)]">
                    Because it reads your specific files (<code className="font-mono text-[11px]">USER.md</code>, <code className="font-mono text-[11px]">WORK.md</code>) before it drafts a message or plans a task, the AI acts with your voice, context, and standards.
                  </p>
                </div>
                <div className="rounded-2xl border border-[var(--d-line)] bg-[var(--d-card)] p-6 shadow-sm">
                  <span className="text-3xl" role="img" aria-label="lightning">⚡</span>
                  <h4 className="mt-4 font-serif text-lg font-semibold">To work while you sleep</h4>
                  <p className="mt-2 text-sm leading-6 text-[var(--d-slate)]">
                    By codifying background rules and scheduling maintenance loops, your second brain cleans up stale files, updates state sheets, and queues tasks overnight.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Shared Vocabulary (Tell them) */}
        <section id="words" aria-labelledby="words-h" className="border-b border-[var(--d-line)] bg-[var(--d-teal-panel)]">
          <div className="mx-auto max-w-5xl px-5 py-24 sm:px-8 sm:py-32">
            <SectionKicker>Shared vocabulary · Q1 · 15 mins</SectionKicker>
            <h2 id="words-h" className="mt-3 font-serif text-3xl font-semibold tracking-tight sm:text-4xl text-balance">
              Ten words, so we're never confused
            </h2>
            <p className="mt-4 max-w-2xl leading-8 text-[var(--d-slate)]">
              From this point on, the workshop uses these exact words. Skim them once; everything after this gets easier. We present them one at a time for clarity.
            </p>
            
            <VocabularyCardDeck />
          </div>
        </section>

        {/* Section 4: Slide concepts */}
        <section id="slides" aria-labelledby="slides-h" className="border-b border-[var(--d-line)]">
          <div className="mx-auto max-w-5xl px-5 py-24 sm:px-8 sm:py-32">
            <SectionKicker>The six ideas · 5 mins</SectionKicker>
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

        {/* Section 5: The Build (Q2) */}
        <section id="build" aria-labelledby="build-h" className="border-b border-[var(--d-line)]">
          <div className="mx-auto max-w-5xl px-5 py-24 sm:px-8 sm:py-32">
            <SectionKicker>The build · Q2 · 20 mins</SectionKicker>
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

            {/* Halftime Q&A Pause */}
            <div className="mt-20 rounded-2xl border-2 border-dashed border-[var(--d-coral)] bg-[var(--d-coral-panel)] p-6 sm:p-8 text-center">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--d-coral-ink)]">
                Half time pause · 10 minutes
              </span>
              <h3 className="mt-2 font-serif text-2xl font-semibold">Questions &amp; Troubleshooting Break</h3>
              <p className="mt-3 max-w-xl mx-auto leading-7 text-[var(--d-slate)]">
                We have completed the basic build! Raise your hand if you want to go off mute. We will take a 10-minute break to clarify vocabulary and help anyone who got stuck before we move to advanced maintenance patterns.
              </p>
            </div>
          </div>
        </section>

        {/* Section 6: Deeper Dive (Q3) */}
        <section id="deeper" aria-labelledby="deeper-h" className="border-b border-[var(--d-line)] bg-[var(--d-teal-panel)]">
          <div className="mx-auto max-w-5xl px-5 py-24 sm:px-8 sm:py-32">
            <SectionKicker>The deeper dive · Q3 · 20 mins</SectionKicker>
            <h2 id="deeper-h" className="mt-3 font-serif text-3xl font-semibold tracking-tight sm:text-4xl text-balance">
              Keep it alive
            </h2>
            <p className="mt-4 max-w-2xl leading-8 text-[var(--d-slate)]">
              A brain you never touch goes stale. Just like brain plasticity (dendritic pruning and pathways that wire together by firing together), your digital second brain needs maintenance loops to stay healthy.
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
                <div className="mt-4">
                  <CopyChip text={maintenanceLoop} label="Copy the maintenance loop" />
                </div>
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

        {/* Section 7: Show & Tell (Q4) */}
        <section id="showtell" className="border-b border-[var(--d-line)]">
          <div className="mx-auto max-w-5xl px-5 py-24 sm:px-8 sm:py-32 text-center">
            <SectionKicker>Demos · Q4 · 20 mins</SectionKicker>
            <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
              Volunteer Show &amp; Tell
            </h2>
            <p className="mt-4 max-w-2xl mx-auto leading-8 text-[var(--d-slate)] text-pretty">
              Now it's your turn! We will pick on 2 or 3 volunteers to show their new second brains. You have 2-3 minutes to demo your workspace setup on Zo.
            </p>
            <div className="mt-8 max-w-xl mx-auto rounded-xl border border-[var(--d-line)] bg-[var(--d-card)] p-6">
              <strong className="font-mono text-[12px] uppercase tracking-[0.1em] text-[var(--d-coral-ink)]">Demos Protocol:</strong>
              <p className="mt-2 text-sm leading-6 text-[var(--d-slate)]">
                Raise your hand on Zo to volunteer. We'll start with 2 or 3 people, and then expand to others if time permits!
              </p>
            </div>
          </div>
        </section>

        {/* Section 8: Hosts / Plugs */}
        <section id="hosts" aria-labelledby="hosts-h" className="border-b border-[var(--d-line)]">
          <div className="mx-auto max-w-5xl px-5 py-24 sm:px-8 sm:py-32">
            <SectionKicker>Shameless plugs · 5 mins</SectionKicker>
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

        {/* Section 9: Wrap-up (Tell them what we told them) */}
        <section id="wrapup" className="border-b border-[var(--d-line)] bg-[var(--d-teal-panel)]">
          <div className="mx-auto max-w-3xl px-5 py-20 text-center sm:px-8">
            <SectionKicker>Summary</SectionKicker>
            <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
              What we accomplished today
            </h2>
            <div className="mt-6 text-left space-y-4 text-[16px] leading-7 text-[var(--d-slate)] font-serif italic">
              <p>
                "We covered the fundamental theory of a second brain—how structured digital note-taking prevents your AI from forgetting context and restarts from zero." 
              </p>
              <p>
                "During the hands-on session, you built a minimalist, five-file second brain on Zo. We then explored advanced maintenance patterns to prevent it from going stale, and closed with live community demos." 
              </p>
              <p>
                "Your AI is now equipped with stable memory. Keep building, link your files, and add one line tomorrow to keep it growing!"
              </p>
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
