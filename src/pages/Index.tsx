import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Clock, Shield, Sparkles, AlertCircle, Mail, Lock, Eye } from "lucide-react";
import { z } from "zod";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { IssueCard } from "@/components/IssueCard";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAllIssues } from "@/hooks/useIssues";
import { supabase } from "@/integrations/supabase/client";
import { resolveIssueCover } from "@/lib/issue-assets";
import { getIssueReadingTime, getIssueSummary, getLatestPublishedIssue } from "@/lib/issue-presentations";

const emailSchema = z.string().trim().min(1).max(255).email();

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));

const trustItems = [
  { label: "Independent", detail: "Reader-funded and ad-free." },
  { label: "No corporate sponsors", detail: "Editorial control stays with the newsroom." },
  { label: "Sources checked", detail: "Claims are tied back to primary reporting." },
  { label: "Privacy by design", detail: "Minimal capture, no dark patterns." },
];

const HomepageStat = ({ icon: Icon, title, body }: { icon: typeof Shield; title: string; body: string }) => (
  <div className="rounded-[18px] border border-white/10 bg-white/[0.03] p-4">
    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-[#ff8b4d]/35 bg-[#ff8b4d]/10 text-[#ff8b4d]">
      <Icon className="h-4 w-4" />
    </div>
    <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#ff8b4d]">{title}</div>
    <p className="mt-2 text-sm leading-6 text-[#f2e7d8]/74">{body}</p>
  </div>
);

const Homepage = () => {
  const { data: allIssues, isLoading } = useAllIssues();
  const publishedIssues = useMemo(
    () => (allIssues || []).filter((issue) => issue.publicationStatus === "published"),
    [allIssues]
  );
  const latestIssue = useMemo(() => getLatestPublishedIssue(publishedIssues), [publishedIssues]);
  const latestIssueCover = resolveIssueCover(latestIssue?.coverImage);
  const latestSummary = latestIssue ? getIssueSummary(latestIssue) : "";
  const latestReadingTime = latestIssue ? getIssueReadingTime(latestIssue) : 0;
  const issueCards = useMemo(
    () => publishedIssues.filter((issue) => issue.number !== latestIssue?.number).slice(0, 4),
    [publishedIssues, latestIssue?.number]
  );

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!emailSchema.safeParse(email).success) {
      setError("Please enter a valid email.");
      return;
    }

    setLoading(true);
    try {
      const { error: insertError } = await supabase
        .from("founding_members")
        .insert({ email: email.toLowerCase().trim(), source: "homepage-membership" });

      if (insertError) {
        setError(insertError.code === "23505" ? "Already on the list." : "Something went wrong.");
        return;
      }

      setDone(true);
      setEmail("");
    } catch {
      setError("Unexpected error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        path="/"
        title="BLACKFILES — Independent intelligence briefings"
        description="BLACKFILES publishes research-driven investigations into AI crime, fraud, deepfakes, and the systems criminals use to hide in plain sight."
      />

      <div className="relative min-h-screen overflow-x-hidden bg-[#050505] text-[#f2e7d8]">
        <Header />

        <main className="relative z-10 pt-24">
          <section className="border-b border-white/8 bg-[radial-gradient(circle_at_top_left,_rgba(255,140,77,0.1),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(255,255,255,0.06),_transparent_24%)]">
            <div className="mx-auto max-w-[1600px] px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[10px] uppercase tracking-[0.34em] text-[#f2e7d8]/64">
                {trustItems.map((item, index) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#ff8b4d]" />
                      {item.label}
                    </span>
                    <span className="hidden text-[#f2e7d8]/35 sm:inline">•</span>
                    <span className="hidden text-[#f2e7d8]/56 sm:inline">{item.detail}</span>
                    {index < trustItems.length - 1 && <span className="hidden text-[#f2e7d8]/30 lg:inline">•</span>}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(420px,0.92fr)] lg:items-start">
              <div className="space-y-8">
                <div className="space-y-5">
                  <p className="font-mono text-[13px] uppercase tracking-[0.36em] text-[#ff8b4d]">
                    Intelligence briefings
                  </p>
                  <h1 className="max-w-[12ch] font-sans text-[clamp(4rem,8vw,7.35rem)] font-black uppercase leading-[0.84] tracking-[-0.08em] text-[#f3e8da]">
                    We dig deeper. So you see what others miss.
                  </h1>
                  <div className="h-px w-14 bg-[#ff8b4d]" />
                  <p className="max-w-xl text-[17px] leading-8 text-[#f2e7d8]/76">
                    Blackfiles delivers research-driven investigations on the systems, threats, and power structures shaping the AI crime landscape.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/archive"
                    className="inline-flex items-center gap-2 rounded-none bg-[#ff8b4d] px-5 py-3 font-mono text-[12px] uppercase tracking-[0.26em] text-[#111111] transition-colors hover:bg-[#ff9b65]"
                  >
                    Browse all issues
                  </Link>
                  <Link
                    to="/doctrine"
                    className="inline-flex items-center gap-2 rounded-none border border-[#ff8b4d]/75 px-5 py-3 font-mono text-[12px] uppercase tracking-[0.26em] text-[#f2e7d8] transition-colors hover:border-[#ff8b4d] hover:text-[#ff8b4d]"
                  >
                    How it works
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <HomepageStat icon={Shield} title="Rigorous research" body="Primary documents, data, and expert analysis." />
                  <HomepageStat icon={Sparkles} title="Systems thinking" body="We connect the dots others treat as unrelated." />
                  <HomepageStat icon={Lock} title="No sponsors" body="Independent. Unbiased. Reader-supported." />
                  <HomepageStat icon={Eye} title="Archive forever" body="Our dossiers remain available for all time." />
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-[24px] border border-[#ff8b4d]/45 bg-[#090909] p-4 shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-[#ff8b4d]">
                      Latest issue
                    </div>
                    {latestIssue && (
                      <div className="rounded-sm border border-[#ff8b4d]/35 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.24em] text-[#f2e7d8]/82">
                        #{String(latestIssue.number).padStart(2, "0")}
                      </div>
                    )}
                  </div>

                  {latestIssue ? (
                    <Link to={`/issues/${latestIssue.number}`} className="group block">
                      <div className="rounded-[18px] border border-white/8 bg-black p-3">
                        <div className="aspect-[2/3] overflow-hidden rounded-[12px] bg-[#070707]">
                          {latestIssueCover ? (
                            <img
                              src={latestIssueCover}
                              alt={`Issue ${String(latestIssue.number).padStart(2, "0")} cover`}
                              className="h-full w-full object-contain"
                              loading="eager"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-white/25">
                              <span className="font-serif text-6xl font-semibold">
                                {String(latestIssue.number).padStart(2, "0")}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4 px-1 pt-4">
                        <div className="space-y-2">
                          <p className="font-mono text-[10px] uppercase tracking-[0.34em] text-[#ff8b4d]">
                            {latestIssue.theme}
                          </p>
                          <h2 className="max-w-[14ch] font-serif text-[clamp(2.4rem,4.1vw,4.8rem)] font-semibold leading-[0.92] tracking-[-0.05em] text-[#f3e8da]">
                            {latestIssue.title}
                          </h2>
                        </div>

                        <p className="max-w-xl text-[15px] leading-7 text-[#f2e7d8]/74">
                          {latestSummary}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {latestIssue.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-[#f2e7d8]/72"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 border-t border-white/8 pt-4 font-mono text-[11px] uppercase tracking-[0.24em] text-[#f2e7d8]/62">
                          <span className="inline-flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {latestReadingTime} min read
                          </span>
                          <span>Public</span>
                          <span>Published {formatDate(latestIssue.publishDate)}</span>
                        </div>

                        <span className="inline-flex items-center gap-2 rounded-none border border-[#ff8b4d]/75 px-5 py-3 font-mono text-[12px] uppercase tracking-[0.26em] text-[#f2e7d8] transition-colors group-hover:border-[#ff8b4d] group-hover:text-[#ff8b4d]">
                          Read issue
                          <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </Link>
                  ) : (
                    <div className="grid place-items-center rounded-[18px] border border-white/10 bg-white/[0.03] p-10 text-center">
                      <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#ff8b4d]">Latest issue</p>
                      <p className="mt-3 text-sm text-[#f2e7d8]/72">Loading issue data.</p>
                    </div>
                  )}
                </div>

                <div className="grid gap-4 rounded-[22px] border border-white/8 bg-white/[0.03] p-4 sm:grid-cols-3">
                  <div className="rounded-[16px] border border-white/8 bg-black/30 p-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#ff8b4d]">Latest issue</p>
                    <p className="mt-2 text-sm leading-6 text-[#f2e7d8]/74">
                      Portrait cover, issue number, title, summary, tags, reading time, access level, date, and actions.
                    </p>
                  </div>
                  <div className="rounded-[16px] border border-white/8 bg-black/30 p-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#ff8b4d]">Table of contents</p>
                    <p className="mt-2 text-sm leading-6 text-[#f2e7d8]/74">
                      Desktop TOC stays visible at the side; mobile TOC collapses beneath the summary.
                    </p>
                  </div>
                  <div className="rounded-[16px] border border-white/8 bg-black/30 p-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#ff8b4d]">Navigation</p>
                    <p className="mt-2 text-sm leading-6 text-[#f2e7d8]/74">
                      Sign in, archive, dossiers, doctrine, and membership links all route to real pages.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="border-y border-white/8 bg-[#070707]">
            <div className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.34em] text-[#ff8b4d]">
                    Explore our latest intelligence
                  </p>
                  <h2 className="mt-2 font-serif text-[clamp(1.8rem,2.6vw,2.4rem)] font-semibold leading-none tracking-[-0.04em] text-[#f3e8da]">
                    More stories
                  </h2>
                </div>
                <Link to="/archive" className="hidden font-mono text-[11px] uppercase tracking-[0.3em] text-[#f2e7d8]/72 transition-colors hover:text-[#ff8b4d] sm:inline-flex">
                  View all issues <ArrowRight className="ml-2 h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="space-y-3 rounded-[18px] border border-white/10 bg-white/[0.03] p-4">
                      <Skeleton className="aspect-[2/3] w-full rounded-[12px]" />
                      <Skeleton className="h-4 w-3/4 rounded-md" />
                      <Skeleton className="h-3 w-full rounded-md" />
                      <Skeleton className="h-3 w-5/6 rounded-md" />
                    </div>
                  ))
                ) : (
                  issueCards.map((issue, index) => <IssueCard key={issue.number} issue={issue} index={index} />)
                )}
              </div>
            </div>
          </section>

          <section id="membership" className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-8">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-6 lg:p-8">
                <p className="font-mono text-[10px] uppercase tracking-[0.34em] text-[#ff8b4d]">
                  About Blackfiles
                </p>
                <h2 className="mt-3 max-w-xl font-serif text-[clamp(2rem,3vw,2.8rem)] font-semibold leading-[1.03] tracking-[-0.04em] text-[#f3e8da]">
                  Independent intelligence for readers who want the signal, not the noise.
                </h2>
                <p className="mt-4 max-w-2xl text-[16px] leading-8 text-[#f2e7d8]/74">
                  Blackfiles is an independent publication exposing the hidden systems, emerging threats, and power structures shaping the future of AI crime and fraud.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-[18px] border border-white/10 bg-black/30 p-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#ff8b4d]">Independent</p>
                    <p className="mt-2 text-sm leading-6 text-[#f2e7d8]/72">Reader-supported editorial model.</p>
                  </div>
                  <div className="rounded-[18px] border border-white/10 bg-black/30 p-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#ff8b4d]">Verified</p>
                    <p className="mt-2 text-sm leading-6 text-[#f2e7d8]/72">Sources checked against primary reporting.</p>
                  </div>
                  <div className="rounded-[18px] border border-white/10 bg-black/30 p-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#ff8b4d]">Privacy by design</p>
                    <p className="mt-2 text-sm leading-6 text-[#f2e7d8]/72">Minimal capture, no paywall prompts.</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-6 lg:p-8">
                <p className="font-mono text-[10px] uppercase tracking-[0.34em] text-[#ff8b4d]">
                  Stay informed
                </p>
                <h2 className="mt-3 font-serif text-[clamp(1.8rem,2.6vw,2.4rem)] font-semibold leading-tight tracking-[-0.04em] text-[#f3e8da]">
                  Membership coming soon.
                </h2>
                <p className="mt-3 max-w-lg text-[16px] leading-7 text-[#f2e7d8]/72">
                  Get notified when new issues drop. No spam, no live checkout, just a clean waitlist for the next phase.
                </p>

                {done ? (
                  <div className="mt-6 rounded-[18px] border border-[#ff8b4d]/30 bg-[#ff8b4d]/8 p-5 text-[#f2e7d8]">
                    <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-[#ff8b4d]">
                      <CheckCircle className="h-4 w-4" />
                      You're on the list
                    </div>
                    <p className="mt-3 text-sm leading-7 text-[#f2e7d8]/78">
                      You'll be notified when membership opens.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="mt-6 space-y-3">
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <div className="relative flex-1">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#f2e7d8]/40" />
                        <Input
                          type="email"
                          value={email}
                          onChange={(event) => {
                            setEmail(event.target.value);
                            setError(null);
                          }}
                          placeholder="Enter your email"
                          className="h-12 border-white/10 bg-black/35 pl-10 text-[#f2e7d8] placeholder:text-[#f2e7d8]/35 focus:border-[#ff8b4d]/70"
                          disabled={loading}
                        />
                      </div>
                      <Button
                        type="submit"
                        className="h-12 rounded-none bg-[#ff8b4d] px-5 font-mono text-[12px] uppercase tracking-[0.26em] text-[#111111] hover:bg-[#ff9b65]"
                        disabled={loading}
                      >
                        Notify me
                      </Button>
                    </div>
                    {error && (
                      <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-[#ff6a3d]">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {error}
                      </p>
                    )}
                  </form>
                )}

                <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-[#f2e7d8]/42">
                  Membership is not live yet. This is a waitlist only.
                </p>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Homepage;
