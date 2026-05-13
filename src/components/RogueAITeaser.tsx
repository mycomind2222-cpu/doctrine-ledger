import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight, Scale } from "lucide-react";
import { useRogueAIIncidents, TIER_META } from "@/hooks/useRogueAI";
import { cn } from "@/lib/utils";

export const RogueAITeaser = () => {
  const { data, isLoading } = useRogueAIIncidents(3);
  if (isLoading || !data || data.length === 0) return null;

  return (
    <section className="py-8 md:py-12 border-t border-border/30">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-classified" />
            <h2 className="font-serif text-xl sm:text-2xl font-bold">Rogue AI Dossier</h2>
          </div>
          <Link
            to="/rogue-ai"
            className="inline-flex items-center gap-1 text-xs sm:text-sm text-classified hover:text-classified/80"
          >
            Browse all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <p className="text-sm text-muted-foreground mb-5 max-w-2xl">
          Documented cases where AI agents did things that would be crimes if a human did them.
        </p>

        <div className="grid gap-4 md:grid-cols-3">
          {data.map((i, idx) => {
            const tier = TIER_META[i.evidence_tier];
            return (
              <motion.article
                key={i.id}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="glass-card p-5 flex flex-col"
              >
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={cn("px-2 py-0.5 rounded border text-[10px] font-mono uppercase tracking-widest", tier.className)}>
                    {tier.short}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {i.model_or_agent}
                  </span>
                </div>
                <h3 className="font-serif text-base font-semibold text-foreground mb-2 leading-snug">
                  {i.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-3 flex-1">
                  {i.summary}
                </p>
                {i.law_analog.length > 0 && (
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/80 font-mono uppercase tracking-wider">
                    <Scale className="w-3 h-3 text-classified/70" />
                    {i.law_analog.slice(0, 2).join(" · ")}
                  </div>
                )}
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
