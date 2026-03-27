import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Lock, ThumbsUp } from "lucide-react";
import { type Issue } from "@/data/issues";
import { useIssueVoteCounts } from "@/hooks/useVoteCounts";
import { AccessBadge } from "./AccessBadge";
import issue01Cover from "@/assets/covers/issue-01.png";
import issue02Cover from "@/assets/covers/issue-02.png";
import issue03Cover from "@/assets/covers/issue-03.png";
import issue04Cover from "@/assets/covers/issue-04.png";
import issue05Cover from "@/assets/covers/issue-05.png";
import issue06Cover from "@/assets/covers/issue-06.png";
import issue07Cover from "@/assets/covers/issue-07.png";
import issue08Cover from "@/assets/covers/issue-08.png";
import issue09Cover from "@/assets/covers/issue-09.png";
import issue10Cover from "@/assets/covers/issue-10.png";
import issue11Cover from "@/assets/covers/issue-11.png";

const coverImages: Record<string, string> = {
  "issue-01": issue01Cover,
  "issue-02": issue02Cover,
  "issue-03": issue03Cover,
  "issue-04": issue04Cover,
  "issue-05": issue05Cover,
  "issue-06": issue06Cover,
  "issue-07": issue07Cover,
  "issue-08": issue08Cover,
  "issue-09": issue09Cover,
  "issue-10": issue10Cover,
  "issue-11": issue11Cover,
};

interface IssueCardProps {
  issue: Issue;
  index: number;
}

export const IssueCard = forwardRef<HTMLElement, IssueCardProps>(({ issue, index }, ref) => {
  const { data: voteCounts } = useIssueVoteCounts();
  const upvotes = voteCounts?.[issue.number]?.up || 0;
  const totalWords = issue.sections.reduce((sum, s) => sum + s.content.split(/\s+/).length, 0);
  const readingTime = Math.max(1, Math.round(totalWords / 200));
  const hasRestricted = issue.sections.some(s => s.audienceLevel === 'restricted');
  const hasProfessional = issue.sections.some(s => s.audienceLevel === 'professional');
  const highestLevel = hasRestricted ? 'restricted' : hasProfessional ? 'professional' : 'public';
  
  const coverImage = issue.coverImage
    ? issue.coverImage.startsWith("http") ? issue.coverImage : coverImages[issue.coverImage] || null
    : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: "easeOut" }}
      className="issue-card group"
    >
      <Link to={`/issues/${issue.number}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-t-xl">
          {coverImage ? (
            <img 
              src={coverImage} 
              alt={`Issue ${issue.number} cover`}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-secondary/50">
              <span className="font-serif text-8xl font-bold text-muted/20">
                {String(issue.number).padStart(2, '0')}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/95" />
          
          {/* Top bar with glass effect */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <span className="glass px-2.5 py-1 rounded-md font-mono text-xs text-foreground/90">
              ISSUE {String(issue.number).padStart(2, '0')}
            </span>
            <AccessBadge level={highestLevel} />
          </div>
          
          {issue.publicationStatus === 'draft' && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1 glass-accent px-2.5 py-1 rounded-md">
              <Lock className="w-3 h-3" />
              <span className="font-mono text-xs">DRAFT</span>
            </div>
          )}
        </div>
        
        <div className="p-5 sm:p-6">
          <div className="mb-2">
            <span className="font-mono text-[11px] uppercase tracking-widest text-classified">
              {issue.theme}
            </span>
          </div>
          
          <h3 className="font-serif text-lg sm:text-xl font-semibold mb-3 text-foreground group-hover:text-classified transition-colors duration-300 line-clamp-2">
            {issue.title}
          </h3>
          
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
            {issue.sections[0]?.content.slice(0, 120)}...
          </p>
          
          <div className="flex items-center justify-between pt-3 border-t border-border/50">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-muted-foreground">
                {readingTime} min read
              </span>
              {upvotes > 0 && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
                  <ThumbsUp className="w-3 h-3" />
                  {upvotes}
                </span>
              )}
            </div>
            <span className="flex items-center gap-1 text-xs font-medium text-classified opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-4px] group-hover:translate-x-0">
              READ <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
});

IssueCard.displayName = 'IssueCard';
