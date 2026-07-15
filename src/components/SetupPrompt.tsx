import { useState } from "react";
import promptText from "@/data/second-brain-prompt.md?raw";
import PromptCode from "@/components/PromptCode";

export default function SetupPrompt() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--d-line)] bg-[var(--d-terminal)] shadow-[0_24px_80px_rgba(0,0,0,0.18)]">
      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-3 sm:px-7">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--d-amber)]">
          second-brain-prompt.md
        </p>
        <button
          type="button"
          onClick={copy}
          className="rounded-full bg-[var(--d-teal-action)] px-5 py-2 text-sm font-medium text-white transition hover:bg-[var(--d-teal-dark)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--d-amber)]"
        >
          {copied ? "Copied" : "Copy the setup prompt"}
        </button>
      </div>
      <p aria-live="polite" className="sr-only">
        {copied ? "Setup prompt copied to your clipboard." : ""}
      </p>
      <pre className="max-h-96 overflow-y-auto overflow-x-hidden whitespace-pre-wrap break-words p-5 text-left font-mono text-[13px] leading-7 text-[var(--d-terminal-text)] sm:p-7 sm:text-[13.5px]">
        <PromptCode text={promptText} />
      </pre>
      <p className="border-t border-white/10 px-5 py-4 font-mono text-[12px] leading-5 text-[#b8b4a8] sm:px-7">
        Works in Zo Computer. Your AI reads it, asks the five questions, and waits for your approval
        before it touches anything.
      </p>
    </div>
  );
}
