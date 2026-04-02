import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Flame } from "lucide-react";
import { type Issue } from "@/data/issues";
import { useIssueVoteCounts } from "@/hooks/useVoteCounts";

interface ReadNextCardsProps {
  currentIssueNumber: number;
  allIssues: Issue[];
}

export const ReadNextCards = ({ currentIssueNumber, allIssues }: ReadNextCardsProps) => {
  const { data: voteCounts } = useIssueVoteCounts();
  
  // Pick 3 related issues: prev, next, and most popular (excluding current)
  const otherIssues = allIssues
    .filter(i => i.number !== currentIssueNumber && i.publicationStatus === 'published');
  
  const prev = otherIssues.find(i => i.number === currentIssueNumber - 1);
  const next = otherIssues.find(i => i.number === currentIssueNumber + 1);
  
  // Most popular by votes, excluding prev/next
  const excludeNumbers = new Set([currentIssueNumber, prev?.number, next?.number].filter(Boolean));
  const popular = [...otherIssues]
    .filter(i => !excludeNumbers.has(i.number))
    .sort((a, b) => ((voteCounts?.[b.number]?.up || 0) - (voteCounts?.[a.number]?.up || 0)))
    [0];
  
  const recommendations = [next, popular, prev].filter(Boolean).slice(0, 3) as Issue[];
  
  if (recommendations.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="max-w-3xl mt-16 mb-8"
    >
      <div className="flex items-center gap-2 mb-6">
        <Flame className="w-4 h-4 text-classified" />
        <span className="font-mono text-xs uppercase tracking-widest text-classified">
          Keep Reading
        </span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {recommendations.map((issue, i) => {
          const upvotes = voteCounts?.[issue.number]?.up || 0;
          return (
            <Link
              key={issue.number}
              to={`/issues/${issue.number}`}
              className="group"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-4 h-full hover:border-classified/30 transition-all duration-300"
              >
                <span className="font-mono text-[10px] text-classified block mb-2">
                  ISSUE {String(issue.number).padStart(2, '0')} · {issue.theme}
                </span>
                <h4 className="font-serif text-sm font-semibold mb-2 group-hover:text-classified transition-colors line-clamp-2">
                  {issue.title}
                </h4>
                <div className="flex items-center justify-between mt-auto pt-2">
                  {upvotes > 0 && (
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {upvotes} upvotes
                    </span>
                  )}
                  <ArrowRight className="w-3 h-3 text-classified opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
};
