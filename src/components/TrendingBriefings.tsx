import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Flame, ThumbsUp, ArrowRight } from "lucide-react";
import { type Issue } from "@/data/issues";
import { useIssueVoteCounts } from "@/hooks/useVoteCounts";

interface TrendingBriefingsProps {
  issues: Issue[];
}

export const TrendingBriefings = ({ issues }: TrendingBriefingsProps) => {
  const { data: voteCounts } = useIssueVoteCounts();
  
  // Sort by upvotes, take top 3
  const trending = [...issues]
    .map(issue => ({
      ...issue,
      upvotes: voteCounts?.[issue.number]?.up || 0,
    }))
    .sort((a, b) => b.upvotes - a.upvotes)
    .filter(i => i.upvotes > 0)
    .slice(0, 3);

  if (trending.length === 0) return null;

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2 mb-8">
            <Flame className="w-5 h-5 text-classified" />
            <span className="font-mono text-xs uppercase tracking-widest text-classified">
              Trending Briefings
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {trending.map((issue, i) => (
              <Link key={issue.number} to={`/issues/${issue.number}`} className="group">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-5 h-full hover:border-classified/30 transition-all duration-300 relative overflow-hidden"
                >
                  {/* Rank badge */}
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full glass flex items-center justify-center">
                    <span className="font-mono text-xs font-bold text-classified">#{i + 1}</span>
                  </div>
                  
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">
                    Issue {String(issue.number).padStart(2, '0')} · {issue.theme}
                  </span>
                  <h3 className="font-serif text-base font-semibold mb-3 group-hover:text-classified transition-colors pr-10 line-clamp-2">
                    {issue.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                    {issue.sections[0]?.content.slice(0, 120)}...
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
                      <ThumbsUp className="w-3 h-3" />
                      {issue.upvotes}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-classified opacity-0 group-hover:opacity-100 transition-opacity">
                      Read <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
