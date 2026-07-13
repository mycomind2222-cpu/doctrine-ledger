import { Fragment, ReactNode } from "react";
import { cn } from "@/lib/utils";

type MarkdownRendererProps = {
  content: string;
  className?: string;
};

const inlinePattern = /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;

const isValidHref = (href: string) => /^(https?:\/\/|\/|#)/i.test(href);

const renderInline = (text: string): ReactNode[] => {
  const parts = text.split(inlinePattern).filter(Boolean);

  return parts.map((part, index) => {
    if (part.startsWith("[") && part.includes("](") && part.endsWith(")")) {
      const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (match) {
        const [, label, href] = match;
        if (!isValidHref(href)) return <Fragment key={index}>{label}</Fragment>;
        const external = /^https?:\/\//i.test(href);
        return (
          <a
            key={index}
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noreferrer noopener" : undefined}
            className="underline decoration-current underline-offset-2 hover:opacity-80"
          >
            {label}
          </a>
        );
      }
    }

    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }

    if (part.startsWith("*") && part.endsWith("*") && !part.startsWith("**")) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }

    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={index} className="rounded bg-black/5 px-1 py-0.5 font-mono text-[0.92em]">{part.slice(1, -1)}</code>;
    }

    return <Fragment key={index}>{part}</Fragment>;
  });
};

const isBulletLine = (line: string) => /^(\s*[-•]\s+)/.test(line);
const isOrderedLine = (line: string) => /^\s*\d+[.)]\s+/.test(line);

export const MarkdownRenderer = ({ content, className }: MarkdownRendererProps) => {
  const blocks = content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <div className={cn("space-y-5", className)}>
      {blocks.map((block, blockIndex) => {
        const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);

        if (/^(-{3,}|_{3,}|\*{3,})$/.test(block)) {
          return <hr key={blockIndex} className="my-8 border-black/10" />;
        }

        if (/^#{1,3}\s+/.test(block)) {
          const level = block.match(/^#{1,3}/)?.[0].length ?? 2;
          const text = block.replace(/^#{1,3}\s+/, "");
          const HeadingTag = (`h${Math.min(level + 1, 3)}` as "h2" | "h3");
          return (
            <HeadingTag
              key={blockIndex}
              className={cn(
                "font-serif font-semibold tracking-[-0.03em] text-black",
                level === 1 ? "text-3xl" : "text-2xl"
              )}
            >
              {renderInline(text)}
            </HeadingTag>
          );
        }

        if (lines.length > 1 && lines.every(isBulletLine)) {
          return (
            <ul key={blockIndex} className="space-y-3 pl-6 list-disc marker:text-black/45">
              {lines.map((line, lineIndex) => (
                <li key={lineIndex} className="leading-[1.75]">
                  {renderInline(line.replace(/^(\s*[-•]\s+)/, ""))}
                </li>
              ))}
            </ul>
          );
        }

        if (lines.length > 1 && lines.every(isOrderedLine)) {
          return (
            <ol key={blockIndex} className="space-y-3 pl-6 list-decimal marker:text-black/45">
              {lines.map((line, lineIndex) => (
                <li key={lineIndex} className="leading-[1.75]">
                  {renderInline(line.replace(/^\s*\d+[.)]\s+/, ""))}
                </li>
              ))}
            </ol>
          );
        }

        return (
          <p key={blockIndex} className="leading-[1.82]">
            {renderInline(lines.join(" "))}
          </p>
        );
      })}
    </div>
  );
};
