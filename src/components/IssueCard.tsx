import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Lock } from "lucide-react";
import { type Issue } from "@/data/issues";
import { AccessBadge } from "./AccessBadge";

interface IssueCardProps {
  issue: Issue;
  index: number;
}

export const IssueCard = ({ issue, index }: IssueCardProps) => {
  const hasRestricted = issue.sections.some(s => s.audienceLevel === 'restricted');
  const hasProfessional = issue.sections.some(s => s.audienceLevel === 'professional');
  const highestLevel = hasRestricted ? 'restricted' : hasProfessional ? 'professional' : 'public';

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="issue-card group"
    >
      <Link to={`/issues/${issue.number}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/90" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-serif text-8xl font-bold text-muted/20">
              {String(issue.number).padStart(2, '0')}
            </span>
          </div>
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <span className="font-mono text-xs text-muted-foreground">
              ISSUE {String(issue.number).padStart(2, '0')}
            </span>
            <AccessBadge level={highestLevel} />
          </div>
          {issue.publicationStatus === 'draft' && (
            <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-0.5 bg-muted/80 rounded-sm">
              <Lock className="w-3 h-3" />
              <span className="font-mono text-xs">DRAFT</span>
            </div>
          )}
        </div>
        
        <div className="p-6">
          <div className="mb-3">
            <span className="font-mono text-xs uppercase tracking-widest text-classified">
              {issue.theme}
            </span>
          </div>
          
          <h3 className="font-serif text-xl font-semibold mb-3 text-foreground group-hover:text-classified transition-colors">
            {issue.title}
          </h3>
          
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {issue.sections[0]?.content.slice(0, 120)}...
          </p>
          
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-muted-foreground">
              {new Date(issue.publishDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
            <span className="flex items-center gap-1 text-xs font-medium text-classified opacity-0 group-hover:opacity-100 transition-opacity">
              READ <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};
