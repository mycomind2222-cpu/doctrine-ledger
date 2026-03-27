import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { DoctrineIntro } from "@/components/DoctrineIntro";
import { IssueCard } from "@/components/IssueCard";
import { FoundingMemberCampaign } from "@/components/FoundingMemberCampaign";
import { SEO } from "@/components/SEO";
import { useAllIssues } from "@/hooks/useIssues";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, TrendingUp, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const { data: allIssues, isLoading } = useAllIssues();
  const publishedIssues = (allIssues || []).filter(i => i.publicationStatus === 'published');
  const latestIssue = publishedIssues[0];

  return (
    <>
      <SEO path="/" />
      <div className="min-h-screen bg-background relative z-10">
        <Header />
        
        <main className="pt-14">
          <Hero />
          
          {/* Quick stats bar — social proof */}
          <section className="py-6 border-y border-border/30">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-classified" />
                  <span className="font-mono text-sm text-muted-foreground">
                    <span className="text-foreground font-semibold">{publishedIssues.length}</span> Intelligence Briefings
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-classified" />
                  <span className="font-mono text-sm text-muted-foreground">
                    Updated <span className="text-foreground font-semibold">Weekly</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-classified" />
                  <span className="font-mono text-sm text-muted-foreground">
                    <span className="text-foreground font-semibold">Free</span> Public Access
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Featured Latest Issue */}
          {latestIssue && !isLoading && (
            <section className="py-12 md:py-16">
              <div className="container mx-auto px-4 sm:px-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="font-mono text-xs uppercase tracking-widest text-classified mb-4 block">
                    Latest Briefing
                  </span>
                  <Link to={`/issues/${latestIssue.number}`} className="block group">
                    <div className="glass-card p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center hover:border-classified/30 transition-colors duration-300">
                      {latestIssue.coverImage && (
                        <div className="w-full sm:w-48 aspect-[3/4] sm:aspect-auto sm:h-48 rounded-lg overflow-hidden shrink-0">
                          <img
                            src={latestIssue.coverImage.startsWith("http") ? latestIssue.coverImage : undefined}
                            alt={`Issue ${latestIssue.number}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="flex-1 text-center sm:text-left">
                        <span className="font-mono text-[11px] uppercase tracking-widest text-classified mb-1 block">
                          Issue {String(latestIssue.number).padStart(2, '0')} · {latestIssue.theme}
                        </span>
                        <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-3 group-hover:text-classified transition-colors">
                          {latestIssue.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
                          {latestIssue.sections[0]?.content.slice(0, 200)}...
                        </p>
                        <span className="inline-flex items-center gap-2 text-sm font-medium text-classified">
                          Read Full Briefing <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </div>
            </section>
          )}
          
          <DoctrineIntro />
          
          {/* Issue Index */}
          <section id="issues" className="py-16 md:py-24">
            <div className="container mx-auto px-4 sm:px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex items-end justify-between mb-10 sm:mb-14"
              >
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-classified mb-2 block">
                    Publication Archive
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold">
                    Intelligence Briefings
                  </h2>
                </div>
                <Link to="/archive">
                  <Button variant="ghost" className="hidden sm:flex gap-2 rounded-xl glass hover:bg-muted/30">
                    View Archive <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
                {isLoading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="glass-card p-3 space-y-3">
                      <Skeleton className="aspect-[3/4] w-full rounded-lg" />
                      <Skeleton className="h-4 w-3/4 rounded-md" />
                      <Skeleton className="h-3 w-1/2 rounded-md" />
                    </div>
                  ))
                ) : (
                  publishedIssues.slice(0, 8).map((issue, index) => (
                    <IssueCard key={issue.number} issue={issue} index={index} />
                  ))
                )}
              </div>
              
              <div className="mt-10 text-center sm:hidden">
                <Link to="/archive">
                  <Button variant="classified-outline" className="rounded-xl">
                    View All Issues <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
          
          <FoundingMemberCampaign />
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Index;
