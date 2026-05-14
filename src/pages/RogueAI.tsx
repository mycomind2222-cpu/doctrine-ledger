import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ExternalLink, Scale, Loader2, AlertTriangle } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { useRogueAIIncidents, TIER_META, type EvidenceTier } from "@/hooks/useRogueAI";
import { cn } from "@/lib/utils";

type TierFilter = "all" | EvidenceTier;

const RogueAI = () => {
  const { data: incidents, isLoading } = useRogueAIIncidents();
  const [tierFilter, setTierFilter] = useState<TierFilter>("all");
  const [lawFilter, setLawFilter] = useState<string | "all">("all");

  const allLawAnalogs = useMemo(() => {
    const set = new Set<string>();
    (incidents ?? []).forEach((i) => i.law_analog.forEach((l) => set.add(l)));
    return Array.from(set).sort();
  }, [incidents]);

  const filtered = useMemo(() => {
    return (incidents ?? []).filter((i) => {
      if (tierFilter !== "all" && i.evidence_tier !== tierFilter) return false;
      if (lawFilter !== "all" && !i.law_analog.includes(lawFilter)) return false;
      return true;
    });
  }, [incidents, tierFilter, lawFilter]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Rogue AI Dossier — Documented AI Lawbreaking",
    description:
      "Catalog of documented incidents where AI agents and LLMs took actions that would be illegal if a human did them.",
    url: "https://doctrine-ledger.lovable.app/rogue-ai",
  };

  return (
    <>
      <SEO
        title="Rogue AI Dossier — When AI Agents Break the Law"
        description="Documented cases where LLMs and AI agents acted in ways that would be criminal if a human did them — fraud, sabotage, market manipulation."
        path="/rogue-ai"
        jsonLd={jsonLd}
      />
      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-20 pb-16">
          {/* Hero */}
          <section className="container mx-auto px-4 sm:px-6 py-10 md:py-16">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl"
            >
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 text-classified" />
                <span className="font-mono text-[11px] uppercase tracking-widest text-classified">
                  Rogue AI Dossier
                </span>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-5">
                When AI agents do things that would be crimes
              </h1>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                A growing catalog of documented cases where LLMs and autonomous agents took actions that would be illegal if a human did them. Real incidents, lab findings, and agentic near-misses — every entry tagged with its evidence tier and the human-law analog it would map to.
              </p>
            </motion.div>
          </section>

          {/* Filters */}
          <section className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mr-1">Tier:</span>
              {(["all", 1, 2, 3] as TierFilter[]).map((t) => (
                <button
                  key={String(t)}
                  onClick={() => setTierFilter(t)}
                  className={cn(
                    "px-3 py-1 rounded-full border text-xs font-mono uppercase tracking-wider transition-colors",
                    tierFilter === t
                      ? "bg-classified/15 border-classified/50 text-classified"
                      : "bg-transparent border-border/50 text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t === "all" ? "All" : TIER_META[t].short}
                </button>
              ))}
            </div>

            {allLawAnalogs.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-8">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mr-1">Law analog:</span>
                <button
                  onClick={() => setLawFilter("all")}
                  className={cn(
                    "px-3 py-1 rounded-full border text-xs transition-colors",
                    lawFilter === "all"
                      ? "bg-foreground/10 border-foreground/30 text-foreground"
                      : "bg-transparent border-border/50 text-muted-foreground hover:text-foreground"
                  )}
                >
                  All
                </button>
                {allLawAnalogs.map((l) => (
                  <button
                    key={l}
                    onClick={() => setLawFilter(l)}
                    className={cn(
                      "px-3 py-1 rounded-full border text-xs transition-colors",
                      lawFilter === l
                        ? "bg-foreground/10 border-foreground/30 text-foreground"
                        : "bg-transparent border-border/50 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {l}
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Grid */}
          <section className="container mx-auto px-4 sm:px-6">
            {isLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-classified" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="glass-card p-8 text-center text-muted-foreground">
                <p className="font-mono text-sm uppercase tracking-widest mb-2">// No matching incidents</p>
                <p className="text-sm">
                  The dossier is still building. New entries are added with every weekly issue.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
                {filtered.map((i, idx) => {
                  const tier = TIER_META[i.evidence_tier];
                  return (
                    <motion.article
                      key={i.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: Math.min(idx * 0.03, 0.3) }}
                      className="glass-card p-5 sm:p-6 flex flex-col"
                    >
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className={cn("px-2 py-0.5 rounded border text-[10px] font-mono uppercase tracking-widest", tier.className)}>
                          {tier.short}
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                          {i.model_or_agent}
                        </span>
                        {i.occurred_on && (
                          <span className="font-mono text-[10px] text-muted-foreground/70 ml-auto">
                            {new Date(i.occurred_on).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                          </span>
                        )}
                      </div>

                      <h3 className="font-serif text-lg font-semibold text-foreground mb-2 leading-snug">
                        {i.title}
                      </h3>
                      <p className="text-sm text-foreground/85 leading-relaxed mb-4 flex-1">
                        {i.summary}
                      </p>

                      {i.law_analog.length > 0 && (
                        <div className="flex items-start gap-2 text-xs text-muted-foreground mb-3">
                          <Scale className="w-3.5 h-3.5 mt-0.5 shrink-0 text-classified/80" />
                          <div className="flex flex-wrap gap-1">
                            {i.law_analog.map((l) => (
                              <span key={l} className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                                {l}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/30">
                        {i.source_url ? (
                          <a
                            href={i.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-classified hover:text-classified/80"
                          >
                            Source <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : <span />}
                        {i.related_issue_number && (
                          <Link
                            to={`/issues/${i.related_issue_number}`}
                            className="text-xs text-muted-foreground hover:text-foreground"
                          >
                            Issue #{String(i.related_issue_number).padStart(2, "0")} →
                          </Link>
                        )}
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            )}
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default RogueAI;
