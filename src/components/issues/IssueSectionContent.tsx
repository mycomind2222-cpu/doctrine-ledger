import { type Section } from "@/data/issues";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { IssueMediaFigure } from "./IssueMediaFigure";

interface IssueSectionContentProps {
  section: Section;
  locked?: boolean;
}

const SourcesList = ({ content }: { content: string }) => {
  const items = content
    .split(/;\s*/)
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <ol className="space-y-3">
      {items.map((item, index) => (
        <li key={index} className="flex gap-3 text-[15px] leading-7 text-black/82">
          <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-black/45 pt-1">{String(index + 1).padStart(2, "0")}</span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  );
};

export const IssueSectionContent = ({ section, locked = false }: IssueSectionContentProps) => {
  const beforeMedia = section.media?.filter((media) => media.position !== "after") ?? [];
  const afterMedia = section.media?.filter((media) => media.position === "after") ?? [];

  if (locked) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white/55 p-5 text-sm leading-7 text-black/70">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-black/45">Restricted content</p>
        <p className="mt-3">
          This section is restricted. The section title remains visible, but the body and media are not rendered for unauthorized readers.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {beforeMedia.length > 0 && (
        <div className="space-y-6">
          {beforeMedia.map((media) => (
            <IssueMediaFigure key={media.id} media={media} />
          ))}
        </div>
      )}

      {section.type === "sources" ? (
        <SourcesList content={section.content} />
      ) : (
        <MarkdownRenderer content={section.content} className="space-y-5 text-[16px] leading-8 text-black/82" />
      )}

      {afterMedia.length > 0 && (
        <div className="space-y-6 pt-2">
          {afterMedia.map((media) => (
            <IssueMediaFigure key={media.id} media={media} />
          ))}
        </div>
      )}
    </div>
  );
};
