import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { IssueCard } from "@/components/IssueCard";
import { ExitIntentPopup } from "@/components/ExitIntentPopup";
import { SEO } from "@/components/SEO";
import { useAllIssues } from "@/hooks/useIssues";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Mail, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const emailSchema = z.string().trim().min(1).max(255).email();

const Index = () => {
  const { data: allIssues, isLoading } = useAllIssues();
  const publishedIssues = (allIssues || []).filter(i => i.publicationStatus === 'published');
  const latestIssue = publishedIssues[0];
  const restIssues = publishedIssues.slice(1, 7);

  // Bottom email signup state
  const [btmEmail, setBtmEmail] = useState('');
  const [btmLoading, setBtmLoading] = useState(false);
  const [btmDone, setBtmDone] = useState(false);
  const [btmError, setBtmError] = useState<string | null>(null);

  const handleBtmSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBtmError(null);
    if (!emailSchema.safeParse(btmEmail).success) { setBtmError('Enter a valid email'); return; }
    setBtmLoading(true);
    try {
      const { error } = await supabase.from('founding_members').insert({ email: btmEmail.toLowerCase().trim(), source: 'bottom-cta' });
      if (error) { setBtmError(error.code === '23505' ? 'Already subscribed!' : 'Something went wrong.'); }
      else { setBtmDone(true); setBtmEmail(''); }
    } catch { setBtmError('Unexpected error.'); }
    finally { setBtmLoading(false); }
  };

  // Compute reading time for featured issue
  const featuredWords = latestIssue?.sections.reduce((sum, s) => sum + s.content.split(/\s+/).length, 0) || 0;
  const featuredReadTime = Math.max(1, Math.round(featuredWords / 200));

  return (
    <>
      <SEO 
        path="/" 
        title="AI Crime Newsletter — Fraud, Deepfakes & Cyber Threats Weekly"
        description="BLACKFILES breaks down how AI is used for fraud, scams, deepfakes, and cybercrime every week. Real cases, real threats. 100% free to read."
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "BLACKFILES — The AI Crime Newsletter",
          "description": "Weekly briefings on AI-powered fraud, deepfakes, scams, and cybercrime. Real cases, real threats, zero hype.",
          "url": "https://doctrine-ledger.lovable.app/",
          "publisher": { "@type": "Organization", "name": "BLACKFILES" },
        }}
      />
      <div className="min-h-screen bg-background relative z-10">
        <Header />
        
        <main className="pt-14">
          <Hero />

          {/* Content immediately after hero */}
          <section className="py-8 md:py-12">
            <div className="container mx-auto px-4 sm:px-6">
              
              {/* Featured latest issue — Morning Brew style */}
              {latestIssue && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="mb-10 md:mb-14"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-serif text-xl sm:text-2xl font-bold">Latest</h2>
                    <Link to="/archive" className="text-sm text-classified font-mono hover:underline flex items-center gap-1">
                      All Stories <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                  
                  <Link to={`/issues/${latestIssue.number}`} className="block group">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                      {/* Image */}
                      <div className="aspect-[4/3] rounded-xl overflow-hidden bg-secondary/30">
                        {latestIssue.coverImage && (
                          <img
                            src={latestIssue.coverImage.startsWith("http") ? latestIssue.coverImage : undefined}
                            alt={`Issue ${latestIssue.number}: ${latestIssue.title}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )}
                      </div>
                      {/* Text */}
                      <div>
                        <span className="font-mono text-[11px] uppercase tracking-widest text-classified mb-2 block">
                          {latestIssue.theme}
                        </span>
                        <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-3 group-hover:text-classified transition-colors duration-300 leading-tight">
                          {latestIssue.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                          {latestIssue.sections[0]?.content.slice(0, 250)}...
                        </p>
                        <div className="flex items-center gap-4">
                          <span className="font-mono text-xs text-muted-foreground">{featuredReadTime} min read</span>
                          <span className="text-sm font-medium text-classified flex items-center gap-1 group-hover:gap-2 transition-all">
                            Read <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )}

              {/* Divider */}
              <div className="border-t border-border/30 mb-8 md:mb-10" />

              {/* Issue grid — Top Stories style */}
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-serif text-xl sm:text-2xl font-bold">Top Stories</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="glass-card p-3 space-y-3">
                      <Skeleton className="aspect-[3/4] w-full rounded-lg" />
                      <Skeleton className="h-4 w-3/4 rounded-md" />
                      <Skeleton className="h-3 w-1/2 rounded-md" />
                    </div>
                  ))
                ) : (
                  restIssues.map((issue, index) => (
                    <IssueCard key={issue.number} issue={issue} index={index} />
                  ))
                )}
              </div>
              
              {publishedIssues.length > 7 && (
                <div className="mt-8 text-center">
                  <Link to="/archive">
                    <Button variant="ghost" className="gap-2 rounded-xl glass hover:bg-muted/30 font-mono text-sm">
                      View All {publishedIssues.length} Briefings <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </section>

          {/* Bottom email CTA */}
          <section className="py-12 md:py-16 border-t border-border/30">
            <div className="container mx-auto px-4 sm:px-6 max-w-lg text-center">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-3">
                Get smarter about AI crime
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                Free weekly briefings delivered to your inbox. No spam, no paywall — just the cases that matter.
              </p>
              {btmDone ? (
                <div className="flex items-center justify-center gap-2 text-classified font-mono text-sm">
                  <CheckCircle className="w-4 h-4" /> You're subscribed!
                </div>
              ) : (
                <form onSubmit={handleBtmSubmit} className="flex gap-2 max-w-md mx-auto">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      value={btmEmail}
                      onChange={(e) => { setBtmEmail(e.target.value); setBtmError(null); }}
                      placeholder="your@email.com"
                      className="pl-10 h-11 rounded-lg text-sm border-border/50 focus:border-classified bg-secondary/30"
                      disabled={btmLoading}
                    />
                  </div>
                  <Button type="submit" variant="classified" className="rounded-lg px-6 h-11" disabled={btmLoading}>
                    {btmLoading ? '...' : 'Subscribe'}
                  </Button>
                </form>
              )}
              {btmError && (
                <p className="mt-2 text-xs text-destructive flex items-center justify-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {btmError}
                </p>
              )}
            </div>
          </section>
        </main>
        
        <Footer />
        <ExitIntentPopup />
      </div>
    </>
  );
};

export default Index;
