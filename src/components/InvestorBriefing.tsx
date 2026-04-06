import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, AlertTriangle, DollarSign, Shield, BarChart3 } from "lucide-react";

interface InvestorBriefingProps {
  content: string;
}

const riskColors: Record<string, string> = {
  LOW: "text-green-400 bg-green-400/10 border-green-400/30",
  MEDIUM: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  HIGH: "text-classified bg-classified/10 border-classified/30",
  CRITICAL: "text-red-500 bg-red-500/10 border-red-500/30",
};

export const InvestorBriefing = ({ content }: InvestorBriefingProps) => {
  // Parse structured content blocks separated by ---
  const blocks = content.split("---").map(b => b.trim()).filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mb-12"
    >
      <div className="flex items-center gap-3 mb-4">
        <DollarSign className="w-5 h-5 text-classified" />
        <span className="font-mono text-xs uppercase tracking-widest text-classified">
          Investor Briefing
        </span>
        <div className="h-px flex-1 bg-classified/20" />
      </div>

      <div className="glass-card border border-classified/20 overflow-hidden">
        {/* Header bar */}
        <div className="bg-classified/5 border-b border-classified/20 px-5 py-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-classified" />
          <span className="font-mono text-xs font-bold text-classified uppercase tracking-wider">
            Market Intelligence
          </span>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          {blocks.map((block, i) => {
            // Risk Level block
            if (block.startsWith("RISK:")) {
              const level = block.replace("RISK:", "").trim().toUpperCase();
              const colorClass = riskColors[level] || riskColors.MEDIUM;
              return (
                <div key={i} className="flex items-center gap-3">
                  <AlertTriangle className="w-4 h-4 text-classified" />
                  <span className="font-mono text-xs text-muted-foreground">Risk Level:</span>
                  <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded border ${colorClass}`}>
                    {level}
                  </span>
                </div>
              );
            }

            // Tickers block
            if (block.startsWith("TICKERS:")) {
              const tickers = block.replace("TICKERS:", "").trim().split(",").map(t => t.trim());
              return (
                <div key={i}>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-classified" />
                    <span className="font-mono text-xs text-muted-foreground">Tickers to Watch</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tickers.map((ticker, j) => (
                      <span
                        key={j}
                        className="font-mono text-xs font-bold bg-foreground/5 border border-border/50 px-2.5 py-1 rounded-md text-foreground/80"
                      >
                        {ticker}
                      </span>
                    ))}
                  </div>
                </div>
              );
            }

            // Sectors block
            if (block.startsWith("SECTORS:")) {
              const sectors = block.replace("SECTORS:", "").trim().split(",").map(s => s.trim());
              return (
                <div key={i}>
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-classified" />
                    <span className="font-mono text-xs text-muted-foreground">Sectors Affected</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sectors.map((sector, j) => (
                      <span
                        key={j}
                        className="text-xs bg-secondary/50 border border-border/30 px-2.5 py-1 rounded-md text-muted-foreground"
                      >
                        {sector}
                      </span>
                    ))}
                  </div>
                </div>
              );
            }

            // Thesis block
            if (block.startsWith("THESIS:")) {
              const thesis = block.replace("THESIS:", "").trim();
              return (
                <div key={i} className="border-l-2 border-classified/40 pl-4">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-classified block mb-1.5">
                    Investment Thesis
                  </span>
                  <p className="text-sm text-foreground/90 leading-relaxed">{thesis}</p>
                </div>
              );
            }

            // Winners/Losers blocks
            if (block.startsWith("WINNERS:") || block.startsWith("LOSERS:")) {
              const isWinners = block.startsWith("WINNERS:");
              const items = block.replace(/^(WINNERS|LOSERS):/, "").trim().split("\n").filter(Boolean);
              const Icon = isWinners ? TrendingUp : TrendingDown;
              return (
                <div key={i}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={`w-4 h-4 ${isWinners ? 'text-green-400' : 'text-red-400'}`} />
                    <span className="font-mono text-xs text-muted-foreground">
                      {isWinners ? "Potential Winners" : "Potential Losers"}
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {items.map((item, j) => (
                      <li key={j} className="text-sm text-foreground/80 flex items-start gap-2">
                        <span className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${isWinners ? 'bg-green-400' : 'bg-red-400'}`} />
                        {item.replace(/^[•\-]\s*/, '')}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }

            // Default paragraph
            return (
              <p key={i} className="text-sm text-muted-foreground leading-relaxed">
                {block}
              </p>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
