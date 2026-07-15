export type Slide = {
  n: string;
  kicker: string;
  headline: string;
  body: string;
  pull: string;
  image: string;
  imageAlt: string;
};

// The six workshop slides, from the beginner recut (slides-copy-recut-option-2.md).
export const slides: Slide[] = [
  {
    n: "01",
    kicker: "What AI can actually see",
    headline: "AI can only help with what it can currently see.",
    body: "In a normal chat, the model works from three things: the instructions it was given, the question you ask, and whatever text or files it can read right now. If your real context is missing, it fills the gap with guesses.",
    pull: "No context in. No context out.",
    image: "/images/recut-01-instructional-cutaway.png",
    imageAlt:
      "A cutaway diagram of an AI reading a small visible stack of information.",
  },
  {
    n: "02",
    kicker: "Prompt versus context",
    headline: "The prompt is the ask. The context is the material.",
    body: "\u201cHelp me plan this trip\u201d is a prompt. Your budget, dates, preferences, and old notes are context. Same prompt, different context, different answer. That is why people keep repeating themselves to chat tools. The model does not know what it cannot see.",
    pull: "Better answers come from better context, not magic wording.",
    image: "/images/recut-05-prompt-vs-context.png",
    imageAlt:
      "A bare speech bubble on one side, and the same bubble fed by a travel note, calendar, and budget note on the other.",
  },
  {
    n: "03",
    kicker: "Why files matter",
    headline: "Files give AI memory that survives the chat.",
    body: "A few simple files beat re-explaining your life every session. Project notes. People notes. Source notes. One working note. The point is not more notes. The point is stable context your AI can read again tomorrow.",
    pull: "Chat fades. Files persist.",
    image: "/images/recut-02-paper-memory-collage.png",
    imageAlt: "A collage of small paper notes forming a stable memory.",
  },
  {
    n: "04",
    kicker: "The one rule",
    headline: "Keep evidence separate from your working note.",
    body: "Raw notes, transcripts, links, and screenshots are evidence. Your working note is the version you trust today. One messy source should not quietly rewrite the note you act from. Keep them separate and the system stays honest.",
    pull: "Do not mix what happened with what you currently believe.",
    image: "/images/recut-03-evidence-vs-working-note.png",
    imageAlt:
      "Raw evidence scraps on one side of a divider, one clean trusted note on the other.",
  },
  {
    n: "05",
    kicker: "The workshop move",
    headline: "Tonight you build the smallest version that works.",
    body: "One folder. Five plain answers. Zo reads them and proposes a file structure sized to your real life, not somebody else's template. You approve the plan. If you get stuck, start with four files. That still counts as a win.",
    pull: "Small is correct.",
    image: "/images/recut-06-smallest-build.png",
    imageAlt:
      "One folder holding five small files, with a checkmark above it.",
  },
  {
    n: "06",
    kicker: "Keep control, then keep it alive",
    headline: "Make it ask before important changes. Then add one line tomorrow.",
    body: "Useful AI is supervised AI. Replacing a trusted note, sending a message, and publishing something should all require approval. After tonight, maintenance stays small: add one source, update one note, close one task, write one log line.",
    pull: "More context. More control. Small upkeep.",
    image: "/images/recut-04-supervised-machine.png",
    imageAlt:
      "A machine running under human supervision, with clear approval points.",
  },
];
