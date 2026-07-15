import type { ReactNode } from "react";

function highlightInline(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  const pattern = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = pattern.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("`")) {
      out.push(
        <span key={`${keyBase}-c${i}`} className="text-[var(--code-inline)]">
          {tok}
        </span>,
      );
    } else if (tok.startsWith("**")) {
      out.push(
        <span key={`${keyBase}-b${i}`} className="font-semibold text-[var(--code-bold)]">
          {tok}
        </span>,
      );
    } else {
      out.push(
        <span key={`${keyBase}-l${i}`} className="text-[var(--code-link)]">
          {tok}
        </span>,
      );
    }
    last = m.index + tok.length;
    i++;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export default function PromptCode({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <code>
      {lines.map((line, idx) => {
        let content: ReactNode;
        if (/^#{1,6}\s/.test(line)) {
          content = <span className="font-semibold text-[var(--code-heading)]">{line}</span>;
        } else {
          const listMatch = line.match(/^(\s*(?:[-*]|\d+\.)\s)(.*)$/);
          if (listMatch) {
            content = (
              <>
                <span className="text-[var(--code-marker)]">{listMatch[1]}</span>
                {highlightInline(listMatch[2], `l${idx}`)}
              </>
            );
          } else {
            content = highlightInline(line, `p${idx}`);
          }
        }
        return (
          <span key={idx} className="block">
            {content}
            {line === "" ? "\u00a0" : null}
          </span>
        );
      })}
    </code>
  );
}
