import { Link } from "react-router-dom";
import { ExternalLink, Scale, ArrowRight } from "lucide-react";
import { parseRogueWatch, TIER_META } from "@/hooks/useRogueAI";

interface RogueAIWatchProps {
  content: string;
}

export const RogueAIWatch = ({ content }: RogueAIWatchProps) => {
  const entries = parseRogueWatch(content);

  if (!entries || entries.length === 0) {
    // Fallback to plain text rendering if AI didn't return JSON
    return (
      <div className="prose-blackfiles">
        {content.split("\n\n").map((p, i) => (
          <p key={i} className="mb-4">{p}</p>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((e, i) => {
        const tier = TIER_META[e.evidence_tier] ?? TIER_META[1];
        return (
          <article
            key={i}
            className="glass-card p-5 sm:p-6 border-l-2 border-classified/60"
          >
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`px-2 py-0.5 rounded border text-[10px] font-mono uppercase tracking-widest ${tier.className}`}>
                {tier.short}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {e.model}
              </span>
              {e.occurred_on && (
                <span className="font-mono text-[10px] text-muted-foreground/70">
                  {new Date(e.occurred_on).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                </span>
              )}
            </div>

            {e.title && (
              <h4 className="font-serif text-lg font-semibold text-foreground mb-2">{e.title}</h4>
            )}

            <p className="text-foreground/90 leading-relaxed mb-3">{e.incident}</p>

            {e.law_analog?.length > 0 && (
              <div className="flex items-start gap-2 text-sm text-muted-foreground mb-2">
                <Scale className="w-4 h-4 mt-0.5 shrink-0 text-classified/80" />
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-classified/80 mr-2">Human-law analog:</span>
                  {e.law_analog.join(" · ")}
                </div>
              </div>
            )}

            {e.why_legal_gap && (
              <p className="text-xs text-muted-foreground/80 italic mb-3">
                Why it isn't (yet) a crime: {e.why_legal_gap}
              </p>
            )}

            {e.source_url && (
              <a
                href={e.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-classified hover:text-classified/80 transition-colors"
              >
                Source <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </article>
        );
      })}

      <Link
        to="/rogue-ai"
        className="inline-flex items-center gap-1 text-sm text-classified hover:text-classified/80 transition-colors mt-2"
      >
        See full Rogue AI Dossier <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
};
