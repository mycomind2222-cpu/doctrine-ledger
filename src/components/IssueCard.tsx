import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { type Issue } from "@/data/issues";
import { resolveIssueCover } from "@/lib/issue-assets";
import { cn } from "@/lib/utils";
import { getIssueReadingTime, getIssueSummary } from "@/lib/issue-presentations";

interface IssueCardProps {
  issue: Issue;
  index: number;
}

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));

export const IssueCard = forwardRef<HTMLElement, IssueCardProps>(({ issue, index }, ref) => {
  const coverImage = resolveIssueCover(issue.coverImage);
  const readingTime = getIssueReadingTime(issue);
  const summary = getIssueSummary(issue);

  return (
    <article
      ref={ref}
      className={cn(
        "group h-full overflow-hidden rounded-[18px] border border-white/10 bg-white/[0.03] transition-colors duration-300 hover:border-[#ff8b4d]/45 hover:bg-white/[0.05]"
      )}
    >
      <Link to={`/issues/${issue.number}`} className="grid h-full grid-cols-[96px_minmax(0,1fr)] gap-4 p-4 sm:grid-cols-[112px_minmax(0,1fr)]">
        <div className="overflow-hidden rounded-[14px] border border-white/8 bg-[#050505] p-2 shadow-[0_18px_30px_rgba(0,0,0,0.28)]">
          {coverImage ? (
            <img
              src={coverImage}
              alt={`Issue ${String(issue.number).padStart(2, "0")} cover`}
              className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
              loading={index < 2 ? "eager" : "lazy"}
            />
          ) : (
            <div className="flex h-full items-center justify-center rounded-[10px] border border-white/8 bg-black text-white/20">
              <span className="font-serif text-4xl font-semibold">{String(issue.number).padStart(2, "0")}</span>
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-col justify-between gap-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-[#ff8b4d]">
              <span>Issue #{String(issue.number).padStart(2, "0")}</span>
              <span className="truncate">{issue.theme}</span>
            </div>

            <h3 className="font-serif text-[20px] font-semibold leading-[1.02] tracking-[-0.04em] text-[#f3e8da] group-hover:text-[#ffad70]">
              {issue.title}
            </h3>

            <p className="max-w-[34ch] text-[14px] leading-6 text-[#f2e7d8]/72">
              {summary}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.24em] text-[#f2e7d8]/58">
              <span>{formatDate(issue.publishDate)}</span>
              <span>{readingTime} min read</span>
            </div>

            <span className="inline-flex items-center gap-2 rounded-none border border-[#ff8b4d]/55 px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.24em] text-[#f2e7d8] transition-colors group-hover:border-[#ff8b4d] group-hover:text-[#ff8b4d]">
              Read issue
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
});

IssueCard.displayName = "IssueCard";
