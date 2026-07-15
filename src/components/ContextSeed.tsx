import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";

type Field = {
  key: string;
  label: string;
  placeholder: string;
  lead: string;
};

const fields: Field[] = [
  {
    key: "name",
    label: "Name",
    placeholder: "Ada Lovelace",
    lead: "My name is",
  },
  {
    key: "work",
    label: "What you do",
    placeholder: "freelance photographer, nursing student, run a bakery…",
    lead: "What I do:",
  },
  {
    key: "links",
    label: "Links",
    placeholder: "your site, LinkedIn, Instagram, GitHub…",
    lead: "Links to me:",
  },
  {
    key: "project",
    label: "Current project",
    placeholder: "the thing you're working on right now",
    lead: "Right now I'm working on:",
  },
  {
    key: "people",
    label: "People who matter",
    placeholder: "collaborators, clients, family you mention often",
    lead: "People who come up a lot:",
  },
  {
    key: "extra",
    label: "Anything else",
    placeholder: "goals, quirks, how you like to work (optional)",
    lead: "Worth knowing:",
  },
];

export default function ContextSeed() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  const message = useMemo(() => {
    const lines = fields
      .map((f) => {
        const v = (values[f.key] ?? "").trim();
        return v ? `${f.lead} ${v}` : null;
      })
      .filter(Boolean);
    if (lines.length === 0) return "";
    return `Here's some context about me before I set up my second brain.\n\n${lines.join("\n")}\n\nRemember this — I'm about to paste a setup prompt.`;
  }, [values]);

  const copy = async () => {
    if (!message) return;
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
      setShowFallback(true);
    }
  };

  return (
    <div className="mt-6 max-w-3xl border-t border-[var(--d-line)] pt-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--d-teal-ink)]">
        Fill this out, copy it, paste it into Zo chat
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <label key={f.key} className="block">
            <span className="font-mono text-[12px] text-[var(--d-slate)]">{f.label}</span>
            <input
              type="text"
              value={values[f.key] ?? ""}
              onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
              placeholder={f.placeholder}
              className="mt-1.5 w-full border-b border-[var(--d-line)] bg-transparent pb-2 text-[15px] text-[var(--d-ink)] placeholder:text-[var(--d-slate)]/50 focus:border-[var(--d-teal)] focus:outline-none"
            />
          </label>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={copy}
          disabled={!message}
          className="inline-flex items-center gap-2 rounded-full bg-[var(--d-teal-action)] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--d-teal-dark)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {copied ? (
            <Check className="size-4" aria-hidden="true" />
          ) : (
            <Copy className="size-4" aria-hidden="true" />
          )}
          {copied ? "Copied" : "Copy my context"}
        </button>
        <p className="font-mono text-[12px] text-[var(--d-slate)]">
          {message ? "Paste it into Zo chat, then move to step 3." : "Fill in at least one field."}
        </p>
      </div>
      <p aria-live="polite" className="sr-only">
        {copied ? "Context message copied to your clipboard." : ""}
      </p>
      {showFallback && message && (
        <div className="mt-4 max-w-2xl">
          <p className="font-mono text-[12px] text-[var(--d-coral-ink)]">
            Couldn't reach your clipboard — select and copy this instead:
          </p>
          <pre className="mt-2 whitespace-pre-wrap break-words rounded-xl border border-[var(--d-line)] bg-[var(--d-card)] p-4 text-left font-mono text-[12.5px] leading-6 text-[var(--d-ink)]">
            {message}
          </pre>
        </div>
      )}
      <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--d-slate)]">
        Everything is optional and nothing leaves this page — the button just builds a message on
        your clipboard.
      </p>
    </div>
  );
}
