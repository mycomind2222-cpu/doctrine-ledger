import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Clock, Mail, Share2, Linkedin, Facebook, Twitter } from "lucide-react";
import { type Issue } from "@/data/issues";
import { resolveIssueCover } from "@/lib/issue-assets";
import { IssueSectionContent } from "./IssueSectionContent";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getIssueReadingTime, getIssueSummary } from "@/lib/issue-presentations";

interface IssueArticleTemplateProps {
  issue: Issue;
  allIssues: Issue[];
  issueLabel?: string;
}

const shareLinks = (issueNumber: number, title: string) => {
  const url = `${window.location.origin}/issues/${issueNumber}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  return [
    { label: "X", href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`, icon: Twitter },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, icon: Linkedin },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, icon: Facebook },
    { label: "Email", href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`, icon: Mail },
  ];
};

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));

const StoryCard = ({ issue }: { issue: Issue }) => {
  const cover = resolveIssueCover(issue.coverImage);
  return (
    <Link
      to={`/issues/${issue.number}`}
      className="group grid grid-cols-[84px_minmax(0,1fr)] gap-3 rounded-[20px] border border-black/10 bg-white/75 p-3 transition-colors hover:border-[#ff8b4d]/50"
    >
      <div className="aspect-[2/3] overflow-hidden rounded-[14px] bg-black/85">
        {cover ? (
          <img src={cover} alt={`Issue ${issue.number} cover`} className="h-full w-full object-contain" loading="lazy" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-black/90 text-white/30">
            <span className="font-mono text-sm">{String(issue.number).padStart(2, "0")}</span>
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#ff8b4d]">
          Issue #{String(issue.number).padStart(2, "0")}
        </p>
        <h3 className="text-sm font-semibold leading-5 text-[#111111] group-hover:text-[#ff6a3d]">
          {issue.title}
        </h3>
        <span className="inline-flex rounded-full border border-black/10 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-black/55">
          Read issue
        </span>
      </div>
    </Link>
  );
};

export const IssueArticleTemplate = ({ issue, allIssues, issueLabel }: IssueArticleTemplateProps) => {
  const coverImage = resolveIssueCover(issue.coverImage);
  const readingTime = getIssueReadingTime(issue);
  const summary = getIssueSummary(issue);
  const issueTag = issueLabel ?? `Issue ${String(issue.number).padStart(2, "0")}`;
  const shareTargets = shareLinks(issue.number, `BLACKFILES Issue #${String(issue.number).padStart(2, "0")}: ${issue.title}`);
  const issueSections = issue.sections.filter((section) => section.audienceLevel !== "restricted");
  const tocSections = issueSections;
  const readNext = [issue.number - 1, issue.number + 1]
    .map((number) => allIssues.find((candidate) => candidate.number === number))
    .filter((candidate): candidate is Issue => Boolean(candidate));
  const previousIssue = allIssues.find((candidate) => candidate.number === issue.number - 1);
  const nextIssue = allIssues.find((candidate) => candidate.number === issue.number + 1);

  return (
    <div className="min-h-screen bg-[#f4efe4] text-[#151311]">
      <Header />

      <main className="mx-auto max-w-[1520px] px-4 pb-16 pt-[72px] sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[72px_minmax(0,1fr)_340px]">
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <div className="rounded-[20px] border border-black/10 bg-white/65 p-4 text-center shadow-[0_18px_36px_rgba(0,0,0,0.05)]">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#a56b3b]">
                  {issueTag}
                </p>
                <div className="mt-2 font-serif text-[48px] leading-none tracking-[-0.08em] text-[#111111]">
                  {String(issue.number).padStart(2, "0")}
                </div>
                <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.28em] text-black/48">
                  Published issue
                </p>
              </div>

              <div className="rounded-[20px] border border-black/10 bg-white/65 p-4 shadow-[0_18px_36px_rgba(0,0,0,0.05)]">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#a56b3b]">
                  Reading
                </p>
                <div className="mt-3 font-serif text-[34px] leading-none tracking-[-0.06em] text-[#111111]">
                  {readingTime}
                </div>
                <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.28em] text-black/48">
                  min read
                </p>
                <p className="mt-3 text-[11px] leading-5 text-black/56">
                  Published {formatDate(issue.publishDate)}
                </p>
              </div>
            </div>
          </aside>

          <div className="min-w-0 space-y-10">
            <section className="grid gap-8 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
              <div className="space-y-4">
                <div className="overflow-hidden rounded-[26px] border border-black/10 bg-black p-4 shadow-[0_26px_60px_rgba(0,0,0,0.14)]">
                  {coverImage ? (
                    <img
                      src={coverImage}
                      alt={`BLACKFILES Issue ${String(issue.number).padStart(2, "0")} cover`}
                      className="w-full object-contain"
                      loading="eager"
                    />
                  ) : (
                    <div className="flex aspect-[2/3] items-center justify-center bg-black/80 text-white/30">
                      <span className="font-mono text-3xl">{String(issue.number).padStart(2, "0")}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6 pt-2">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3 font-mono text-[12px] uppercase tracking-[0.28em] text-black/62">
                    <span>Issue #{String(issue.number).padStart(2, "0")}</span>
                    <span className="text-black/25">•</span>
                    <span>Published {formatDate(issue.publishDate)}</span>
                  </div>
                  <h1 className="max-w-3xl font-serif text-[clamp(2.75rem,4.8vw,5.25rem)] font-semibold leading-[0.92] tracking-[-0.04em] text-[#101010]">
                    {issue.title}
                  </h1>
                  <div className="h-px w-12 bg-[#ff8b4d]" />
                </div>

                <div className="space-y-4">
                  <p className="font-mono text-[12px] uppercase tracking-[0.32em] text-[#c74b2f]">
                    {issue.theme}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {issue.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded border border-black/10 bg-white/55 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-black/70"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-5 border-b border-black/10 pb-5 text-[12px] uppercase tracking-[0.24em] text-black/62">
                  <span className="inline-flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {readingTime} min read
                  </span>
                  <span className="inline-flex items-center gap-2">Public</span>
                  <span className="inline-flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    Share
                  </span>
                </div>

                <div className="rounded-2xl border border-[#d8cdb8] bg-[#f0e6d4] p-5 shadow-[0_20px_40px_rgba(0,0,0,0.06)]">
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[#a56b3b]">
                    Plain-English summary
                  </p>
                  <p className="max-w-3xl text-[15px] leading-7 text-[#2a241b]">
                    {summary}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  {shareTargets.map(({ label, href, icon: Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.24em] text-black/70 transition-colors hover:border-[#ff8b4d]/45 hover:text-[#ff6a3d]"
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            </section>

            <section className="lg:hidden">
              <div className="rounded-[20px] border border-black/10 bg-white/60 p-4 shadow-[0_18px_36px_rgba(0,0,0,0.05)]">
                <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-black/45">
                  On this page
                </p>
                <div className="flex flex-wrap gap-2">
                  {tocSections.map((section, index) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="rounded-full border border-black/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-black/65 transition-colors hover:border-[#ff8b4d]/40 hover:text-[#ff6a3d]"
                    >
                      {String(index + 1).padStart(2, "0")} {section.title}
                    </a>
                  ))}
                </div>
              </div>
            </section>

            <section className="space-y-10">
              {issueSections.map((section, index) => (
                <article key={section.id} id={section.id} className="scroll-mt-28 border-t border-black/10 pt-8">
                  <div className="mb-4 flex items-center gap-4">
                    <span className="font-mono text-[12px] uppercase tracking-[0.28em] text-[#ff6a3d]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h2 className="font-serif text-[clamp(1.8rem,3vw,2.8rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-[#111111]">
                      {section.title}
                    </h2>
                  </div>
                  <IssueSectionContent section={section} />
                </article>
              ))}
            </section>

            <section className="border-t border-black/10 pt-10">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#ff6a3d]">Previous / next</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                {previousIssue && (
                  <Link
                    to={`/issues/${previousIssue.number}`}
                    className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/65 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.24em] text-black/75 transition-colors hover:border-[#ff8b4d]/45 hover:text-[#ff6a3d]"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Previous issue
                  </Link>
                )}
                {nextIssue && (
                  <Link
                    to={`/issues/${nextIssue.number}`}
                    className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/65 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.24em] text-black/75 transition-colors hover:border-[#ff8b4d]/45 hover:text-[#ff6a3d]"
                  >
                    Next issue
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
            </section>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] space-y-5 overflow-y-auto pr-1">
              <section className="rounded-[22px] bg-[#111111] p-5 text-[#f2e8d8] shadow-[0_30px_60px_rgba(0,0,0,0.18)]">
                <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-white/55">
                  In this issue
                </p>
                <ol className="mt-5 space-y-4">
                  {tocSections.map((section, index) => (
                    <li key={section.id} className="border-b border-white/10 pb-3 last:border-0">
                      <a href={`#${section.id}`} className="flex items-start gap-3">
                        <span className="min-w-6 font-mono text-[15px] text-[#ff6a3d]">{index + 1}</span>
                        <span className="text-[15px] leading-6 text-white/88">{section.title}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </section>

              <section className="rounded-[22px] border border-black/10 bg-white/60 p-5 shadow-[0_20px_48px_rgba(0,0,0,0.06)]">
                <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-black/45">
                  About this issue
                </p>
                <p className="mt-4 text-[15px] leading-7 text-black/78">
                  {summary}
                </p>
                <div className="mt-5 flex items-center justify-between border-t border-black/10 pt-4 text-[11px] uppercase tracking-[0.24em] text-black/48">
                  <span>{issue.theme}</span>
                  <span>{readingTime} min read</span>
                </div>
              </section>

              <section className="rounded-[22px] border border-black/10 bg-white/60 p-5 shadow-[0_20px_48px_rgba(0,0,0,0.06)]">
                <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-black/45">
                  Related reading
                </p>
                <div className="mt-4 space-y-3">
                  {readNext.slice(0, 2).map((related) => (
                    <StoryCard key={related.number} issue={related} />
                  ))}
                </div>
              </section>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
};
