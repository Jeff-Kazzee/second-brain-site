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
    plain:
      "Hidden background details that label and organize content, such as its title, date, author, or topic.",
  },
  {
    term: "Progressive disclosure",
    plain:
      "Reveal information in small, useful layers so you only see what is needed at each moment.",
  },
  {
    term: "Loops",
    plain:
      "Self-healing maintenance routines: clean up stale files, fix broken links, flag conflicts. Every day it gets a little better.",
  },
];

const benefits = [
  {
    term: "Instant Context",
    plain: "Share your goals, projects, and standards once.",
  },
  {
    term: "On-Brand Drafts",
    plain: "Draft from your files, style, and preferences.",
  },
  {
    term: "Approval Gates",
    plain: "Pause sensitive actions for your approval.",
  },
  {
    term: "Automatic Updates",
    plain: "Keep links and indexes current as files change.",
  },
];

const maintenanceLoop = `## Brain Maintenance

**Purpose:** keep links, indexes, inbox routing, and current-truth surfaces healthy.

1. Read \`Home.md\`, \`STATE.md\`, the relevant indexes, and today's memory if present.
2. Check for broken local links, stale index routing, or obvious inbox items that
   already have a clear owner.
3. Make at most one small evidence-backed repair. Never bulk-rewrite notes.
4. Update \`STATE.md\` only if current truth actually changed.
5. Verify the touched links/files and log a concise receipt.`;

const interviewPrompt = `### Interview
Help me build a small second brain for the part of my life or work I describe. Ask me, one at a time: what I want to organize first; what I'm working on; who matters; what safe source material I already have; and what you may do versus what needs my approval — do not create any files yet.

### Plan
Based on my answers, propose the smallest useful second-brain structure. List each file or folder, what it is for, and any assumptions or unknowns; wait for my explicit approval before creating or changing anything.

### Build
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
            aria-pressed={activeIndex === i}
            onClick={() => setActiveIndex(i)}
            className={`px-3 py-1.5 rounded-full font-mono text-[12px] tracking-wider transition ${
              activeIndex === i
                ? "bg-[var(--d-teal)] text-white dark:text-[#171614]"
                : "bg-[var(--d-card)] text-[var(--d-slate)] border border-[var(--d-line)] hover:border-[var(--d-teal)] hover:text-[var(--d-ink)]"
            }`}
          >
            {v.term}
          </button>
        ))}
      </div>

      {/* The Active Card (Shows one word at a time) */}
      <div className="relative min-h-[220px] rounded-2xl border border-[var(--d-line)] bg-[var(--d-card)] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between transition-all duration-300">
        <div aria-live="polite" aria-atomic="true">
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

        {/* Responsive Controls Wrapper */}
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between sm:gap-2">
          <div className="flex flex-wrap items-center gap-3 w-full justify-between sm:w-auto">
            <button
              type="button"
              onClick={prev}
              className="px-4 py-2 rounded-full border border-[var(--d-line)] bg-[var(--d-canvas)] font-mono text-[12px] text-[var(--d-slate)] hover:text-[var(--d-ink)] hover:border-[var(--d-teal)] transition"
            >
              ← Previous
            </button>
            <button
              type="button"
              onClick={next}
              className="px-4 py-2 rounded-full border border-[var(--d-line)] bg-[var(--d-canvas)] font-mono text-[12px] text-[var(--d-slate)] hover:text-[var(--d-ink)] hover:border-[var(--d-teal)] transition sm:hidden"
            >
              Next →
            </button>
          </div>

          {/* Progress dots */}
          <div className="flex flex-wrap gap-1.5 justify-center py-2">
            {vocab.map((_, i) => (
              <span
                key={i}
                className={`size-2 rounded-full transition-all ${
                  activeIndex === i
                    ? "bg-[var(--d-teal)] w-4"
                    : "bg-[var(--d-line)]"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={next}
            className="hidden sm:inline-flex px-4 py-2 rounded-full border border-[var(--d-line)] bg-[var(--d-canvas)] font-mono text-[12px] text-[var(--d-slate)] hover:text-[var(--d-ink)] hover:border-[var(--d-teal)] transition"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}

function ConceptGraphic({ index }: { index: number }) {
  const svgProps = {
    viewBox: "0 0 120 120",
    fill: "none",
    "aria-hidden": true as const,
  };

  // 0 — Frontmatter / metadata: a document with a labeled header band.
  if (index === 0) {
    return (
      <svg {...svgProps} className="h-full w-full">
        <rect
          x="30"
          y="16"
          width="60"
          height="88"
          rx="7"
          className="fill-[var(--d-canvas)] stroke-[var(--d-line)]"
          strokeWidth="2"
        />
        <circle cx="41" cy="28" r="2.5" className="fill-[var(--d-teal)]" />
        <line
          x1="49"
          y1="28"
          x2="80"
          y2="28"
          className="stroke-[var(--d-teal)]"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="41" cy="37" r="2.5" className="fill-[var(--d-teal)]" />
        <line
          x1="49"
          y1="37"
          x2="72"
          y2="37"
          className="stroke-[var(--d-teal)]"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line
          x1="30"
          y1="48"
          x2="90"
          y2="48"
          className="stroke-[var(--d-line)]"
          strokeWidth="1.5"
        />
        {[61, 71, 81, 91].map((y, i) => (
          <line
            key={y}
            x1="40"
            y1={y}
            x2={i === 3 ? 66 : 80}
            y2={y}
            className="stroke-[var(--d-slate)]"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.45"
          />
        ))}
      </svg>
    );
  }

  // 1 — Progressive disclosure: stacked rows, the middle one expanded.
  if (index === 1) {
    return (
      <svg {...svgProps} className="h-full w-full">
        <rect
          x="26"
          y="22"
          width="68"
          height="16"
          rx="4"
          className="fill-[var(--d-canvas)] stroke-[var(--d-line)]"
          strokeWidth="2"
        />
        <line
          x1="34"
          y1="30"
          x2="60"
          y2="30"
          className="stroke-[var(--d-slate)]"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.45"
        />
        <rect
          x="26"
          y="43"
          width="68"
          height="34"
          rx="5"
          className="fill-[var(--d-teal-panel)] stroke-[var(--d-teal)]"
          strokeWidth="2"
        />
        <line
          x1="34"
          y1="53"
          x2="70"
          y2="53"
          className="stroke-[var(--d-teal)]"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line
          x1="34"
          y1="62"
          x2="82"
          y2="62"
          className="stroke-[var(--d-slate)]"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.55"
        />
        <line
          x1="34"
          y1="70"
          x2="76"
          y2="70"
          className="stroke-[var(--d-slate)]"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.55"
        />
        <rect
          x="26"
          y="82"
          width="68"
          height="16"
          rx="4"
          className="fill-[var(--d-canvas)] stroke-[var(--d-line)]"
          strokeWidth="2"
        />
        <line
          x1="34"
          y1="90"
          x2="54"
          y2="90"
          className="stroke-[var(--d-slate)]"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.45"
        />
      </svg>
    );
  }

  // 2 — Loops: two arcs forming a slow, self-healing cycle.
  return (
    <svg
      {...svgProps}
      className="h-full w-full origin-center animate-spin [animation-duration:14s] motion-reduce:animate-none"
    >
      <path
        d="M60 30 A30 30 0 0 1 90 60"
        className="stroke-[var(--d-teal)]"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <polyline
        points="83,57 90,64 97,57"
        className="fill-none stroke-[var(--d-teal)]"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M60 90 A30 30 0 0 1 30 60"
        className="stroke-[var(--d-teal)]"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <polyline
        points="23,63 30,56 37,63"
        className="fill-none stroke-[var(--d-teal)]"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="60" cy="60" r="3.5" className="fill-[var(--d-coral)]" />
    </svg>
  );
}

function DeeperConceptCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = deeperVocab.length;
  const go = (n: number) => setActiveIndex((n + total) % total);
  const active = deeperVocab[activeIndex];

  return (
    <div className="mt-12 space-y-6">
      {/* Concept navigator */}
      <div className="flex flex-wrap justify-center gap-2 border-b border-[var(--d-line)] pb-4">
        {deeperVocab.map((v, i) => (
          <button
            key={v.term}
            type="button"
            aria-pressed={activeIndex === i}
            onClick={() => setActiveIndex(i)}
            className={`rounded-full px-3 py-1.5 font-mono text-[12px] tracking-wider transition ${
              activeIndex === i
                ? "bg-[var(--d-teal)] text-white dark:text-[#171614]"
                : "border border-[var(--d-line)] bg-[var(--d-card)] text-[var(--d-slate)] hover:border-[var(--d-teal)] hover:text-[var(--d-ink)]"
            }`}
          >
            {v.term}
          </button>
        ))}
      </div>

      {/* One concept at a time */}
      <div className="relative overflow-hidden rounded-2xl border border-[var(--d-line)] bg-[var(--d-card)] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] sm:min-h-[232px]">
        <div
          key={activeIndex}
          aria-live="polite"
          aria-atomic="true"
          className="flex flex-col items-center gap-8 duration-500 animate-in fade-in slide-in-from-bottom-2 motion-reduce:animate-none sm:flex-row sm:items-center sm:gap-10"
        >
          <div className="flex size-32 shrink-0 items-center justify-center rounded-2xl border border-[var(--d-line)] bg-[var(--d-canvas)] p-6 sm:size-40">
            <ConceptGraphic index={activeIndex} />
          </div>
          <div className="text-center sm:text-left">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--d-coral-ink)]">
              Concept {activeIndex + 1} of {total}
            </span>
            <h3 className="mt-3 font-serif text-2xl font-semibold tracking-tight text-[var(--d-ink)] sm:text-3xl">
              {active.term}
            </h3>
            <p className="mt-3 text-[17px] leading-8 text-[var(--d-slate)] text-pretty">
              {active.plain}
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => go(activeIndex - 1)}
          aria-label="Previous concept"
          className="rounded-full border border-[var(--d-line)] bg-[var(--d-canvas)] px-4 py-2 font-mono text-[12px] text-[var(--d-slate)] transition hover:border-[var(--d-teal)] hover:text-[var(--d-ink)]"
        >
          ← Previous
        </button>
        <div className="flex gap-1.5">
          {deeperVocab.map((_, i) => (
            <span
              key={i}
              className={`h-2 rounded-full transition-all ${
                activeIndex === i ? "w-4 bg-[var(--d-teal)]" : "w-2 bg-[var(--d-line)]"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(activeIndex + 1)}
          aria-label="Next concept"
          className="rounded-full border border-[var(--d-line)] bg-[var(--d-canvas)] px-4 py-2 font-mono text-[12px] text-[var(--d-slate)] transition hover:border-[var(--d-teal)] hover:text-[var(--d-ink)]"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

function BenefitGraphic({ index }: { index: number }) {
  const svgProps = {
    viewBox: "0 0 120 120",
    fill: "none",
    "aria-hidden": true as const,
  };

  // 0 — Instant Context: a file feeds context straight into the AI node.
  if (index === 0) {
    return (
      <svg {...svgProps} className="h-full w-full">
        <rect
          x="16"
          y="34"
          width="42"
          height="52"
          rx="6"
          className="fill-[var(--d-canvas)] stroke-[var(--d-line)]"
          strokeWidth="2"
        />
        {[47, 56, 65, 74].map((y, i) => (
          <line
            key={y}
            x1="25"
            y1={y}
            x2={i === 0 ? 44 : i === 3 ? 40 : 49}
            y2={y}
            className={i === 0 ? "stroke-[var(--d-teal)]" : "stroke-[var(--d-slate)]"}
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity={i === 0 ? "1" : "0.45"}
          />
        ))}
        <line
          x1="62"
          y1="60"
          x2="82"
          y2="60"
          className="stroke-[var(--d-teal)]"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <polyline
          points="76,54 83,60 76,66"
          className="fill-none stroke-[var(--d-teal)]"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="98"
          cy="60"
          r="15"
          className="fill-[var(--d-teal-panel)] stroke-[var(--d-teal)]"
          strokeWidth="2"
        />
        <circle cx="98" cy="60" r="4" className="fill-[var(--d-coral)]" />
      </svg>
    );
  }

  // 1 — On-Brand Drafts: a page written in your own voice, marked on-brand.
  if (index === 1) {
    return (
      <svg {...svgProps} className="h-full w-full">
        <rect
          x="28"
          y="18"
          width="56"
          height="84"
          rx="6"
          className="fill-[var(--d-canvas)] stroke-[var(--d-line)]"
          strokeWidth="2"
        />
        {[32, 42, 52, 62].map((y, i) => (
          <line
            key={y}
            x1="38"
            y1={y}
            x2={i % 2 === 0 ? 74 : 66}
            y2={y}
            className="stroke-[var(--d-slate)]"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.45"
          />
        ))}
        <circle cx="42" cy="82" r="8" className="fill-[var(--d-teal-panel)] stroke-[var(--d-teal)]" strokeWidth="2" />
        <polyline
          points="38,82 41,85 46,79"
          className="fill-none stroke-[var(--d-teal)]"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M78 40 L92 54 L74 72 L64 74 L66 64 Z"
          className="fill-[var(--d-canvas)] stroke-[var(--d-coral)]"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <line
          x1="82"
          y1="44"
          x2="88"
          y2="50"
          className="stroke-[var(--d-coral)]"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  // 2 — Approval Gates: a shield that holds until you check it off.
  if (index === 2) {
    return (
      <svg {...svgProps} className="h-full w-full">
        <path
          d="M60 20 L88 30 V60 C88 78 74 92 60 100 C46 92 32 78 32 60 V30 Z"
          className="fill-[var(--d-teal-panel)] stroke-[var(--d-teal)]"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <polyline
          points="48,60 57,69 74,50"
          className="fill-none stroke-[var(--d-teal)]"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // 3 — Automatic Updates: a refresh cycle keeping a link intact.
  return (
    <svg
      {...svgProps}
      className="h-full w-full origin-center animate-spin [animation-duration:16s] motion-reduce:animate-none"
    >
      <path
        d="M60 28 A32 32 0 0 1 92 60"
        className="stroke-[var(--d-teal)]"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <polyline
        points="85,57 92,64 99,57"
        className="fill-none stroke-[var(--d-teal)]"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M60 92 A32 32 0 0 1 28 60"
        className="stroke-[var(--d-teal)]"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <polyline
        points="21,63 28,56 35,63"
        className="fill-none stroke-[var(--d-teal)]"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="52"
        y="55"
        width="16"
        height="10"
        rx="5"
        className="fill-none stroke-[var(--d-coral)]"
        strokeWidth="2.5"
      />
    </svg>
  );
}

function BenefitsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = benefits.length;
  const go = (n: number) => setActiveIndex((n + total) % total);
  const active = benefits[activeIndex];

  return (
    <div className="mt-8 space-y-6">
      {/* Benefit navigator */}
      <div className="flex flex-wrap justify-center gap-2 border-b border-[var(--d-line)] pb-4">
        {benefits.map((b, i) => (
          <button
            key={b.term}
            type="button"
            aria-pressed={activeIndex === i}
            onClick={() => setActiveIndex(i)}
            className={`rounded-full px-3 py-1.5 font-mono text-[12px] tracking-wider transition ${
              activeIndex === i
                ? "bg-[var(--d-teal)] text-white dark:text-[#171614]"
                : "border border-[var(--d-line)] bg-[var(--d-card)] text-[var(--d-slate)] hover:border-[var(--d-teal)] hover:text-[var(--d-ink)]"
            }`}
          >
            {b.term}
          </button>
        ))}
      </div>

      {/* One benefit at a time */}
      <div className="relative overflow-hidden rounded-2xl border border-[var(--d-line)] bg-[var(--d-card)] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] sm:min-h-[232px]">
        <div
          key={activeIndex}
          aria-live="polite"
          aria-atomic="true"
          className="flex flex-col items-center gap-8 duration-500 animate-in fade-in slide-in-from-bottom-2 motion-reduce:animate-none sm:flex-row sm:items-center sm:gap-10"
        >
          <div className="flex size-32 shrink-0 items-center justify-center rounded-2xl border border-[var(--d-line)] bg-[var(--d-canvas)] p-6 sm:size-40">
            <BenefitGraphic index={activeIndex} />
          </div>
          <div className="text-center sm:text-left">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--d-coral-ink)]">
              Outcome {activeIndex + 1} of {total}
            </span>
            <h3 className="mt-3 font-serif text-2xl font-semibold tracking-tight text-[var(--d-ink)] sm:text-3xl">
              {active.term}
            </h3>
            <p className="mt-3 text-[17px] leading-8 text-[var(--d-slate)] text-pretty">
              {active.plain}
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => go(activeIndex - 1)}
          aria-label="Previous outcome"
          className="rounded-full border border-[var(--d-line)] bg-[var(--d-canvas)] px-4 py-2 font-mono text-[12px] text-[var(--d-slate)] transition hover:border-[var(--d-teal)] hover:text-[var(--d-ink)]"
        >
          ← Previous
        </button>
        <div className="flex gap-1.5">
          {benefits.map((_, i) => (
            <span
              key={i}
              className={`h-2 rounded-full transition-all ${
                activeIndex === i ? "w-4 bg-[var(--d-teal)]" : "w-2 bg-[var(--d-line)]"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(activeIndex + 1)}
          aria-label="Next outcome"
          className="rounded-full border border-[var(--d-line)] bg-[var(--d-canvas)] px-4 py-2 font-mono text-[12px] text-[var(--d-slate)] transition hover:border-[var(--d-teal)] hover:text-[var(--d-ink)]"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

export default function Landing() {
  return (
    <div
      id="top"
      className="min-h-screen bg-[var(--d-canvas)] text-[var(--d-ink)] transition-colors"
    >
      <a
        href="#build"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-[var(--d-teal)] focus:px-4 focus:py-2 focus:text-white dark:focus:text-[#171614]"
      >
        Skip to the build
      </a>

      <header className="sticky top-0 z-40 border-b border-[var(--d-line)] bg-[var(--d-canvas)]/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <a
            href="#top"
            className="flex items-center gap-3"
            aria-label="Second Brain Build Hours, home"
          >
            <img
              src="/brand/pegasus-black.svg"
              alt=""
              className="h-7 w-auto dark:hidden"
            />
            <img
              src="/brand/pegasus-white.svg"
              alt=""
              className="hidden h-7 w-auto dark:block"
            />
            <span className="font-serif text-lg font-semibold tracking-tight">
              Second Brain Build Hours
            </span>
          </a>
          <nav
            aria-label="Sections"
            className="hidden items-center gap-6 font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--d-slate)] md:flex"
          >
            <a
              href="#hosts"
              className="transition hover:text-[var(--d-teal-ink)]"
            >
              Hosts
            </a>
            <a
              href="#rules"
              className="transition hover:text-[var(--d-teal-ink)]"
            >
              Rules
            </a>
            <a
              href="#why"
              className="transition hover:text-[var(--d-teal-ink)]"
            >
              Why
            </a>
            <a
              href="#words"
              className="transition hover:text-[var(--d-teal-ink)]"
            >
              Words
            </a>
            <a
              href="#build"
              className="transition hover:text-[var(--d-teal-ink)]"
            >
              Build
            </a>
            <a
              href="#deeper"
              className="transition hover:text-[var(--d-teal-ink)]"
            >
              Go deeper
            </a>
            <a
              href="#benefits"
              className="transition hover:text-[var(--d-teal-ink)]"
            >
              Outcomes
            </a>
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
                Welcome to Second Brain Build Hours hosted by{" "}
                <strong className="text-[var(--d-ink)]">Jeff Kazzee</strong> and{" "}
                <strong className="text-[var(--d-ink)]">Ethan Davidson</strong>.
                We will guide you step-by-step from ground rules and core
                concepts through building your own AI-readable second brain from
                scratch.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#hosts"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--d-teal)] px-7 py-3 text-base font-medium text-white dark:text-[#171614] shadow-sm transition hover:bg-[var(--d-teal-dark)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--d-amber)]"
                >
                  Meet your hosts
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

        {/* Section 8: Hosts / Plugs */}
        <section
          id="hosts"
          aria-labelledby="hosts-h"
          className="border-b border-[var(--d-line)]"
        >
          <div className="mx-auto max-w-5xl px-5 py-24 sm:px-8 sm:py-32">
            <SectionKicker>Shameless plugs · 5 mins</SectionKicker>
            <h2
              id="hosts-h"
              className="mt-3 font-serif text-3xl font-semibold tracking-tight sm:text-4xl text-balance"
            >
              Your hosts
            </h2>
            <div className="mt-12 grid gap-x-16 gap-y-14 lg:grid-cols-2">
              <article className="border-t border-[var(--d-line)] pt-8 flex flex-col sm:flex-row gap-6 items-start">
                <img
                  src="/images/jeff.jpg"
                  alt="Jeff Kazzee"
                  width={160}
                  height={160}
                  loading="lazy"
                  decoding="async"
                  className="size-20 rounded-full object-cover border border-[var(--d-line)] shadow-sm shrink-0"
                />
                <div>
                  <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-[var(--d-teal-ink)]">
                    Host
                  </p>
                  <h3 className="mt-2 font-serif text-2xl font-semibold">
                    Jeff Kazzee
                  </h3>
                  <p className="mt-3 leading-7 text-[var(--d-slate)]">
                    A second brain is like a garden: worth having, better with a
                    gardener. Jeff builds and maintains personal and company
                    brains — book a 1:1 to talk yours out, or email him with
                    follow-up questions.
                  </p>
                  <div className="mt-5 grid grid-cols-1 gap-3 min-[480px]:grid-cols-2">
                    <a
                      href="https://jeffkazzee.zo.space/work-with-me"
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full bg-[var(--d-teal)] px-4 py-2.5 text-center text-sm font-medium text-white dark:text-[#171614] transition hover:bg-[var(--d-teal-dark)]"
                    >
                      Book a 1:1 with Jeff
                    </a>
                    <a
                      href="https://jeffkazzee.zo.space"
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-[var(--d-line)] px-4 py-2.5 text-center text-sm font-medium text-[var(--d-ink)] transition hover:border-[var(--d-teal)]"
                    >
                      jeffkazzee.zo.space
                    </a>
                  </div>
                </div>
              </article>
              <article className="border-t border-[var(--d-line)] pt-8 flex flex-col sm:flex-row gap-6 items-start">
                <img
                  src="/images/ethan.jpg"
                  alt="Ethan Davidson"
                  width={160}
                  height={160}
                  loading="lazy"
                  decoding="async"
                  className="size-20 rounded-full object-cover border border-[var(--d-line)] shadow-sm shrink-0"
                />
                <div>
                  <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-[var(--d-coral-ink)]">
                    Host
                  </p>
                  <h3 className="mt-2 font-serif text-2xl font-semibold">
                    Ethan Davidson
                  </h3>
                  <p className="mt-3 leading-7 text-[var(--d-slate)]">
                    Ethan builds Wazoo, a workbench for structured, queryable
                    world knowledge — the same idea as your second brain, taken
                    to planetary scale. Sign up to follow the build.
                  </p>
                  <div className="mt-5 grid grid-cols-1 gap-3 min-[480px]:grid-cols-2">
                    <a
                      href="https://wazoo.dev"
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full bg-[var(--d-coral)] px-4 py-2.5 text-center text-sm font-medium text-[#171614] transition hover:bg-[var(--d-coral-ink)]"
                    >
                      Sign up for Wazoo
                    </a>
                    <a
                      href="https://www.linkedin.com/in/etok/"
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-[var(--d-line)] px-4 py-2.5 text-center text-sm font-medium text-[var(--d-ink)] transition hover:border-[var(--d-coral)]"
                    >
                      Ethan on LinkedIn
                    </a>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Section 1: Ground Rules (Tell them what we're gonna tell them) */}
        <section
          id="rules"
          className="border-b border-[var(--d-line)] bg-[var(--d-teal-panel)]"
        >
          <div className="mx-auto max-w-3xl px-5 py-24 sm:px-8 sm:py-32">
            {/* Ground Rules */}
            <div className="space-y-6">
              <SectionKicker>First things first · 5 mins</SectionKicker>
              <h2 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
                Ground Rules &amp; Questions Protocol
              </h2>
              <div className="space-y-5 text-[16px] leading-7 text-[var(--d-slate)]">
                <p>
                  To keep the workshop running smoothly and make sure everyone
                  builds their second brain, please follow our questions
                  protocol:
                </p>
                <ul className="space-y-4">
                  <li className="rounded-xl border border-[var(--d-line)] bg-[var(--d-card)] p-4 shadow-sm">
                    <strong className="block font-mono text-[12px] uppercase tracking-[0.1em] text-[var(--d-coral-ink)]">
                      Wait for Designated Pauses
                    </strong>
                    <span className="mt-1 block text-sm">
                      We have designated spots before the end of sections for
                      you to ask questions. Please hold your questions for those
                      pauses (like at Halftime and the end of Q4).
                    </span>
                  </li>
                  <li className="rounded-xl border border-[var(--d-line)] bg-[var(--d-card)] p-4 shadow-sm">
                    <strong className="block font-mono text-[12px] uppercase tracking-[0.1em] text-[var(--d-teal-ink)]">
                      Raise Your Hand
                    </strong>
                    <span className="mt-1 block text-sm">
                      Raise your hand on Zo if you want to go off mute and ask a
                      question aloud during our pauses.
                    </span>
                  </li>
                  <li className="rounded-xl border border-[var(--d-line)] bg-[var(--d-card)] p-4 shadow-sm">
                    <strong className="block font-mono text-[12px] uppercase tracking-[0.1em] text-[var(--d-slate)]">
                      Overtime &amp; Networking
                    </strong>
                    <span className="mt-1 block text-sm">
                      The Zo team can jump in if we are losing track of
                      time/pace. We will also stay after the 2-hour mark to
                      answer any leftover questions and network.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: What is a Second Brain? (Tell them) */}
        <section id="why" className="border-b border-[var(--d-line)]">
          <div className="mx-auto max-w-5xl px-5 py-24 sm:px-8 sm:py-32">
            <div className="grid gap-12 lg:items-start lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-6">
                <SectionKicker>First principles · 10 mins</SectionKicker>
                <h2 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
                  What is a second brain?
                </h2>
                <div className="space-y-4 text-pretty">
                  <p className="text-xl leading-8 text-[var(--d-slate)]">
                    In Zo, your second brain is an{" "}
                    <strong className="font-semibold text-[var(--d-ink)]">
                      entire workspace folder of plain-text files
                    </strong>{" "}
                    that your AI reads dynamically.
                  </p>
                  <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--d-teal-ink)]">
                    Memory your AI can read
                  </p>
                </div>
              </div>

              {/* Second Brain Infographic */}
              <div className="space-y-4">
                <figure className="relative">
                  <img
                    src="/images/second-brain-infographic.webp"
                    alt="Infographic showing notes collected in an organized second brain, which an AI assistant reads to create a useful, personalized plan."
                    width={1254}
                    height={1254}
                    loading="lazy"
                    decoding="async"
                    className="w-full rounded-2xl border border-[var(--d-line)] shadow-[0_24px_80px_rgba(0,0,0,0.12)]"
                  />
                  <figcaption className="mt-3 text-center font-mono text-[11px] text-[var(--d-slate)]">
                    Notes become organized context your AI can turn into a
                    useful plan.
                  </figcaption>
                </figure>
                <div className="rounded-xl border border-[var(--d-line)] bg-[var(--d-card)] p-5 text-sm leading-6 text-[var(--d-slate)]">
                  <span className="font-mono text-[12px] font-semibold uppercase tracking-[0.1em] text-[var(--d-teal-ink)]">
                    How it connects:
                  </span>
                  <ul className="mt-2 list-disc pl-5 space-y-1">
                    <li>
                      <code className="text-[var(--d-ink)]">AGENTS.md</code>:
                      The cue card directing the AI.
                    </li>
                    <li>
                      <code className="text-[var(--d-ink)]">USER.md</code>:
                      Joanna's personal guidelines and preferences.
                    </li>
                    <li>
                      <code className="text-[var(--d-ink)]">WORK.md</code> &amp;{" "}
                      <code className="text-[var(--d-ink)]">PEOPLE.md</code>:
                      Active projects and client contacts.
                    </li>
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
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-[var(--d-line)] bg-[var(--d-card)] p-5 shadow-sm">
                  <h4 className="font-serif text-lg font-semibold">
                    Remember for you
                  </h4>
                  <p className="mt-2 text-sm leading-6 text-[var(--d-slate)]">
                    Remember projects, people, and plans.
                  </p>
                </div>
                <div className="rounded-xl border border-[var(--d-line)] bg-[var(--d-card)] p-5 shadow-sm">
                  <h4 className="font-serif text-lg font-semibold">
                    Work like you
                  </h4>
                  <p className="mt-2 text-sm leading-6 text-[var(--d-slate)]">
                    Write in your voice and standards.
                  </p>
                </div>
                <div className="rounded-xl border border-[var(--d-line)] bg-[var(--d-card)] p-5 shadow-sm">
                  <h4 className="font-serif text-lg font-semibold">
                    Work while you sleep
                  </h4>
                  <p className="mt-2 text-sm leading-6 text-[var(--d-slate)]">
                    Run maintenance and automation overnight.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Shared Vocabulary (Tell them) */}
        <section
          id="words"
          aria-labelledby="words-h"
          className="border-b border-[var(--d-line)] bg-[var(--d-teal-panel)]"
        >
          <div className="mx-auto max-w-5xl px-5 py-24 sm:px-8 sm:py-32">
            <SectionKicker>Shared vocabulary · Q1 · 10 mins</SectionKicker>
            <h2
              id="words-h"
              className="mt-3 font-serif text-3xl font-semibold tracking-tight sm:text-4xl text-balance"
            >
              Ten words, so we're never confused
            </h2>
            <p className="mt-4 max-w-2xl leading-8 text-[var(--d-slate)]">
              From this point on, the workshop uses these exact words. Skim them
              once; everything after this gets easier. We present them one at a
              time for clarity.
            </p>

            <VocabularyCardDeck />
          </div>
        </section>

        {/* Section 4: Slide concepts */}
        <section
          id="slides"
          aria-labelledby="slides-h"
          className="border-b border-[var(--d-line)]"
        >
          <div className="mx-auto max-w-5xl px-5 py-24 sm:px-8 sm:py-32">
            <SectionKicker>The six ideas · 5 mins</SectionKicker>
            <h2
              id="slides-h"
              className="mt-3 font-serif text-3xl font-semibold tracking-tight sm:text-4xl text-balance"
            >
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
                    <p className="mt-4 leading-8 text-[var(--d-slate)] text-pretty">
                      {c.body}
                    </p>
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
        <section
          id="build"
          aria-labelledby="build-h"
          className="border-b border-[var(--d-line)]"
        >
          <div className="mx-auto max-w-5xl px-5 py-24 sm:px-8 sm:py-32">
            <SectionKicker>The build · Q2 · 25 mins</SectionKicker>
            <h2
              id="build-h"
              className="mt-3 font-serif text-3xl font-semibold tracking-tight sm:text-4xl text-balance"
            >
              Build yours in three steps
            </h2>

            <ol className="mt-14 space-y-16 sm:space-y-20">
              <li className="grid gap-6 lg:grid-cols-[64px_1fr]">
                <div className="flex size-12 items-center justify-center rounded-full border border-[var(--d-line)] bg-[var(--d-card)] font-serif text-xl font-semibold text-[var(--d-teal-ink)]">
                  1
                </div>
                <div>
                  <h3 className="font-serif text-xl font-semibold">
                    Create your Zo account
                  </h3>
                  <p className="mt-2 max-w-2xl leading-7 text-[var(--d-slate)]">
                    You'll need it in a few minutes. Sign up through either
                    host's link — same Zo, pick whoever sent you.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      href="https://zo-computer.cello.so/X9jcdFXqh9Z"
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border-2 border-[var(--d-teal)] px-5 py-2.5 text-sm font-medium text-[var(--d-teal-ink)] transition hover:bg-[var(--d-teal)] hover:text-white dark:hover:text-[#171614]"
                    >
                      Sign up via Jeff
                    </a>
                    <a
                      href="https://etok.me/zo"
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border-2 border-[var(--d-coral)] px-5 py-2.5 text-sm font-medium text-[var(--d-coral-ink)] transition hover:bg-[var(--d-coral)] hover:text-[#171614]"
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
                  <h3 className="font-serif text-xl font-semibold">
                    Seed some context
                  </h3>
                  <p className="mt-2 max-w-2xl leading-7 text-[var(--d-slate)]">
                    Before you paste the prompt, tell Zo a little about
                    yourself. The prompt builds from what's already in the
                    workspace — the more it knows, the less{" "}
                    <span className="font-mono text-[14px]">Unknown</span>{" "}
                    you'll see. Fill out whatever you're comfortable sharing and
                    copy the finished message.
                  </p>
                  <ContextSeed />
                </div>
              </li>

              <li className="grid gap-6 lg:grid-cols-[64px_1fr]">
                <div className="flex size-12 items-center justify-center rounded-full border border-[var(--d-line)] bg-[var(--d-card)] font-serif text-xl font-semibold text-[var(--d-teal-ink)]">
                  3
                </div>
                <div className="min-w-0">
                  <h3 className="font-serif text-xl font-semibold">
                    Paste the prompt
                  </h3>
                  <p className="mt-2 max-w-2xl leading-7 text-[var(--d-slate)]">
                    One message. Five connected files, plus a visual
                    representation of your second brain built on your own Zo
                    Space. Zo drafts them from your context and writes{" "}
                    <span className="font-mono text-[14px]">Unknown</span>{" "}
                    instead of making things up.
                  </p>
                  <div className="mt-6 max-w-3xl">
                    <SetupPrompt />
                  </div>
                </div>
              </li>
            </ol>

            {/* Halftime Q&A Pause */}
            <div className="mt-20 rounded-2xl border-2 border-dashed border-[var(--d-coral)] bg-[var(--d-coral-panel)] p-6 sm:p-8 text-center">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--d-coral-ink)]">
                Half time pause · 10 minutes
              </span>
              <h3 className="mt-2 font-serif text-2xl font-semibold">
                Questions &amp; Troubleshooting Break
              </h3>
              <p className="mt-3 max-w-xl mx-auto leading-7 text-[var(--d-slate)]">
                We have completed the basic build! Raise your hand if you want
                to go off mute. We will take a 10-minute break to clarify
                vocabulary and help anyone who got stuck before we move to
                advanced maintenance patterns.
              </p>
            </div>
          </div>
        </section>

        {/* Section 6: Deeper Dive (Q3) */}
        <section
          id="deeper"
          aria-labelledby="deeper-h"
          className="border-b border-[var(--d-line)] bg-[var(--d-teal-panel)]"
        >
          <div className="mx-auto max-w-5xl px-5 py-24 sm:px-8 sm:py-32">
            <SectionKicker>The deeper dive · Q3 · 15 mins</SectionKicker>
            <h2
              id="deeper-h"
              className="mt-3 font-serif text-3xl font-semibold tracking-tight sm:text-4xl text-balance"
            >
              Keep it alive
            </h2>
            <p className="mt-4 max-w-2xl leading-8 text-[var(--d-slate)]">
              A brain you never touch goes stale. Just like brain plasticity
              (dendritic pruning and pathways that wire together by firing
              together), your digital second brain needs maintenance loops to
              stay healthy.
            </p>

            <DeeperConceptCarousel />

            <div className="mt-12 grid gap-10 lg:gap-14 lg:grid-cols-2">
              <div>
                <h3 className="font-serif text-xl font-semibold">
                  A maintenance loop, from Jeff's real brain
                </h3>
                <p className="mt-2 leading-7 text-[var(--d-slate)]">
                  Schedule this to run while you sleep. One small repair a day
                  compounds.
                </p>
                <pre className="mt-4 overflow-x-hidden whitespace-pre-wrap break-words rounded-2xl border border-[var(--d-line)] bg-[var(--d-terminal)] p-5 font-mono text-[12.5px] leading-6 text-[var(--d-terminal-text)]">
                  <PromptCode text={maintenanceLoop} />
                </pre>
                <div className="mt-4">
                  <CopyChip
                    text={maintenanceLoop}
                    label="Copy the maintenance loop"
                  />
                </div>
              </div>
              <div>
                <h3 className="font-serif text-xl font-semibold">
                  Prefer to be interviewed?
                </h3>
                <p className="mt-2 leading-7 text-[var(--d-slate)]">
                  The advanced pattern: interview, plan, then build — with your
                  approval gating each step.
                </p>
                <pre className="mt-4 overflow-x-hidden whitespace-pre-wrap break-words rounded-2xl border border-[var(--d-line)] bg-[var(--d-terminal)] p-5 font-mono text-[12.5px] leading-6 text-[var(--d-terminal-text)]">
                  <PromptCode text={interviewPrompt} />
                </pre>
                <div className="mt-4">
                  <CopyChip
                    text={interviewPrompt}
                    label="Copy the interview prompt"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6.5: What You Can Get Out of Your Second Brain */}
        <section
          id="benefits"
          className="border-b border-[var(--d-line)] bg-[var(--d-canvas)]"
        >
          <div className="mx-auto max-w-5xl px-5 py-24 sm:px-8 sm:py-32">
            <SectionKicker>Outcomes · 10 mins</SectionKicker>
            <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight sm:text-4xl text-balance">
              What you can get out of your second brain
            </h2>
            <p className="mt-4 max-w-2xl leading-8 text-[var(--d-slate)]">
              A second brain extends your AI's power so you can work faster,
              remember everything, and automate your workflow.
            </p>
            <BenefitsCarousel />
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
              Now it's your turn! We will pick on 2 or 3 volunteers to show
              their new second brains. You have 2-3 minutes to demo your
              workspace setup on Zo.
            </p>
            <div className="mt-8 max-w-xl mx-auto rounded-xl border border-[var(--d-line)] bg-[var(--d-card)] p-6">
              <strong className="font-mono text-[12px] uppercase tracking-[0.1em] text-[var(--d-coral-ink)]">
                Demos Protocol:
              </strong>
              <p className="mt-2 text-sm leading-6 text-[var(--d-slate)]">
                Raise your hand on Zo to volunteer. We'll start with 2 or 3
                people, and then expand to others if time permits!
              </p>
            </div>
          </div>
        </section>

        {/* Section 9: Wrap-up (Tell them what we told them) */}
        <section
          id="wrapup"
          className="border-b border-[var(--d-line)] bg-[var(--d-teal-panel)]"
        >
          <div className="mx-auto max-w-3xl px-5 py-20 text-center sm:px-8">
            <SectionKicker>Summary · 5 mins</SectionKicker>
            <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
              What we accomplished today
            </h2>
            <div className="mt-6 text-left space-y-4 text-[16px] leading-7 text-[var(--d-slate)] font-serif italic">
              <p>
                "We covered the fundamental theory of a second brain—how
                structured digital note-taking prevents your AI from forgetting
                context and restarts from zero."
              </p>
              <p>
                "During the hands-on session, you built a minimalist, five-file
                second brain on Zo. We then explored advanced maintenance
                patterns to prevent it from going stale, and closed with live
                community demos."
              </p>
              <p>
                "Your AI is now equipped with stable memory. Keep building, link
                your files, and add one line tomorrow to keep it growing!"
              </p>
            </div>
          </div>
        </section>

        <footer className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-5 py-12 text-center sm:px-8">
          <img
            src="/brand/wordmark-black.svg"
            alt="Zo"
            className="h-8 w-auto dark:hidden"
          />
          <img
            src="/brand/wordmark-white.svg"
            alt="Zo"
            className="hidden h-8 w-auto dark:block"
          />
          <p className="font-mono text-[12px] text-[var(--d-slate)]">
            Made with Zo Computer · Second Brain Build Hours with Jeff Kazzee
            &amp; Ethan Davidson
          </p>
        </footer>
      </main>
    </div>
  );
}
