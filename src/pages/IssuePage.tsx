import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Tag, Loader2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AccessBadge } from "@/components/AccessBadge";
import { LockedContentOverlay } from "@/components/LockedContentOverlay";
import { SEO } from "@/components/SEO";
import { ReadingProgressBar } from "@/components/ReadingProgressBar";
import { SocialShareBar } from "@/components/SocialShareBar";
import { ReadNextCards } from "@/components/ReadNextCards";
import { ClickToTweet } from "@/components/ClickToTweet";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useIssue, useAllIssues } from "@/hooks/useIssues";
import { IssueVoting } from "@/components/IssueVoting";
import { ViralSharePrompt } from "@/components/ViralSharePrompt";
import { InvestorBriefing } from "@/components/InvestorBriefing";
import { type Section, type AccessLevel as IssueAccessLevel } from "@/data/issues";
import { useCopyAttribution } from "@/hooks/useCopyAttribution";
import { getPlainSummary } from "@/data/plainSummaries";
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
};

const renderContent = (content: string) => {
  return content.split('\n\n').map((paragraph, i) => {
    // Handle bold headers like **Title:**
    if (paragraph.startsWith('**') && paragraph.includes(':**')) {
      const parts = paragraph.split(':**');
      const title = parts[0].replace(/\*\*/g, '');
      const rest = parts.slice(1).join(':**');
      return (
        <div key={i} className="mb-4">
          <h4 className="font-semibold text-foreground mb-2">{title}:</h4>
          <p>{rest}</p>
        </div>
      );
    }
    
    // Handle numbered lists
    if (/^\d+\.\s\*\*/.test(paragraph)) {
      const items = paragraph.split(/\n/).filter(Boolean);
      return (
        <ol key={i} className="list-decimal list-inside space-y-2 mb-4">
          {items.map((item, j) => {
            const cleaned = item.replace(/^\d+\.\s/, '').replace(/\*\*/g, '');
            const [title, ...rest] = cleaned.split(':');
            return (
              <li key={j}>
                <strong className="text-foreground">{title}:</strong>
                {rest.join(':')}
              </li>
            );
          })}
        </ol>
      );
    }
    
    // Handle inline bold
    if (paragraph.includes('**')) {
      const parts = paragraph.split(/(\*\*[^*]+\*\*)/);
      return (
        <p key={i} className="mb-4">
          {parts.map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={j} className="text-foreground">{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </p>
      );
    }
    
    return <p key={i} className="mb-4">{paragraph}</p>;
  });
};

const SectionContent = ({ section, isLocked, requiredLevel }: { section: Section; isLocked: boolean; requiredLevel: IssueAccessLevel }) => {
  // Render investor briefing with dedicated component
  if (section.type === 'investor_briefing') {
    return <InvestorBriefing content={section.content} />;
  }

  const sectionLabels: Record<string, string> = {
    executive_summary: "Executive Summary",
    doctrine_preview: "Doctrine Preview",
    deep_dive: "Deep Dive",
    case_study: "Case Study",
    doctrine_statement: "Doctrine Statement",
    actionable_insight: "Actionable Insight",
    investor_briefing: "Investor Briefing",
    sidebar: "Sidebar",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mb-12"
    >
      <div className="flex items-center gap-4 mb-4">
        <span className="font-mono text-xs uppercase tracking-widest text-classified">
          {sectionLabels[section.type] || section.type}
        </span>
        <AccessBadge level={section.audienceLevel} />
      </div>
      
      {section.title && (
        <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">
          {section.title}
        </h2>
      )}
      
      <div className={`relative ${isLocked ? 'content-restricted' : ''}`}>
        <div className="prose-blackfiles">
          {renderContent(section.content)}
        </div>
        
        {section.sidebarElements && section.sidebarElements.length > 0 && !isLocked && (
          <div className="mt-8 space-y-4">
            {section.sidebarElements.map((el, i) => (
              <div key={i} className="sidebar-element">
                <span className="font-mono text-xs uppercase tracking-widest text-classified block mb-2">
                  {el.type.replace('_', ' ')}
                </span>
                {el.type === 'pull_quote' ? (
                  <p className="pull-quote">{el.content}</p>
                ) : el.type === 'mini_timeline' ? (
                  <div className="text-sm text-muted-foreground">
                    {el.content.split('\n').map((line, j) => {
                      if (line.startsWith('**') && line.endsWith('**')) {
                        return <p key={j} className="font-semibold text-foreground mb-2">{line.replace(/\*\*/g, '')}</p>;
                      }
                      if (line.startsWith('•')) {
                        return <p key={j} className="ml-2 mb-1">{line}</p>;
                      }
                      return <p key={j}>{line}</p>;
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground font-mono">{el.content}</p>
                )}
              </div>
            ))}
          </div>
        )}
        
        {isLocked && (
          <LockedContentOverlay requiredLevel={requiredLevel} />
        )}
      </div>
    </motion.div>
  );
};

 const IssuePage = () => {
   const { issueNumber } = useParams();
   const navigate = useNavigate();
   const { hasAccess } = useAuth();
   useCopyAttribution();
   const { data: issue, isLoading } = useIssue(Number(issueNumber));
   const { data: allIssues } = useAllIssues();
   const publishedIssues = (allIssues || []).filter(i => i.publicationStatus === 'published');
   const maxIssueNumber = publishedIssues.length ? Math.max(...publishedIssues.map(i => i.number)) : 10;
 
   // Keyboard navigation: ← → between issues
   useEffect(() => {
     const handleKey = (e: KeyboardEvent) => {
       if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
       const num = Number(issueNumber);
       if (e.key === 'ArrowLeft' && num > 1) navigate(`/issues/${num - 1}`);
       if (e.key === 'ArrowRight' && num < maxIssueNumber) navigate(`/issues/${num + 1}`);
     };
     window.addEventListener('keydown', handleKey);
     return () => window.removeEventListener('keydown', handleKey);
   }, [issueNumber, maxIssueNumber, navigate]);
 
   if (isLoading) {
     return (
       <div className="min-h-screen bg-background flex items-center justify-center">
         <Loader2 className="h-8 w-8 animate-spin text-primary" />
       </div>
     );
   }

  if (!issue) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-4xl font-bold mb-4">Issue Not Found</h1>
          <Link to="/">
            <Button variant="classified">Return to Index</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isLocked = (_sectionLevel: IssueAccessLevel) => {
    // Temporarily unlocked for all users
    return false;
  };

  // Support both static imports (e.g. "issue-01") and full URLs from storage
  const coverImage = issue.coverImage
    ? issue.coverImage.startsWith("http") ? issue.coverImage : coverImages[issue.coverImage] || null
    : null;

  return (
    <>
      <SEO
        title={`Issue #${String(issue.number).padStart(2, '0')}: ${issue.title} — AI Crime Briefing`}
        description={issue.sections[0]?.content.slice(0, 155).replace(/\n/g, ' ') + "..." || `BLACKFILES Issue ${issue.number} — AI crime briefing on ${issue.theme.toLowerCase()}.`}
        path={`/issues/${issue.number}`}
        type="article"
        publishedTime={issue.publishDate}
        tags={issue.tags}
      />
      <div className="min-h-screen bg-background">
      <Header />
      <ReadingProgressBar />
      
      <main className="pt-16">
        {/* Hero with cover image */}
        {coverImage && (
          <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
            <img 
              src={coverImage} 
              alt={`Issue ${issue.number} cover`}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
          </div>
        )}
        
        <article className={`container mx-auto px-6 ${coverImage ? '-mt-32 relative z-10' : 'pt-8'}`}>
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Issues
            </Link>
          </motion.div>
          
          {/* Issue header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-3xl mb-16"
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="font-mono text-sm text-classified">
                ISSUE {String(issue.number).padStart(2, '0')}
              </span>
              <span className="w-px h-4 bg-border" />
              <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                {issue.theme}
              </span>
              <span className="classified-stamp ml-auto hidden sm:flex">
                DOCTRINE EDITION
              </span>
            </div>
            
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
              {issue.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <IssueVoting issueNumber={issue.number} />
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <time dateTime={issue.publishDate}>
                  {new Date(issue.publishDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <div className="flex gap-2 flex-wrap">
                  {issue.tags.map(tag => (
                    <span key={tag} className="font-mono text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <SocialShareBar 
                title={`BLACKFILES Issue #${String(issue.number).padStart(2, '0')}: ${issue.title}`}
                url={`/issues/${issue.number}`}
              />
            </div>
          </motion.header>
          
          {/* Plain English TL;DR */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="max-w-3xl mb-12"
          >
            <div className="glass-card p-6 sm:p-8 border-l-2 border-classified">
              <div className="flex items-center gap-2 mb-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-classified">TL;DR — Plain English</span>
              </div>
              <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
                {getPlainSummary(issue.number, issue.sections.find(s => s.type === 'executive_summary')?.content)}
              </p>
            </div>
          </motion.div>

          {/* Issue content */}
          <div className="max-w-3xl">
            {issue.sections.map((section, sIdx) => (
              <div key={section.id}>
                <SectionContent 
                  section={section} 
                  isLocked={isLocked(section.audienceLevel)}
                  requiredLevel={section.audienceLevel}
                />
                {/* Add a shareable quote after the first section */}
                {sIdx === 0 && section.content.length > 100 && (() => {
                  // Extract a punchy sentence for sharing
                  const sentences = section.content.replace(/\*\*/g, '').split(/(?<=[.!?])\s+/).filter(s => s.length > 30 && s.length < 200);
                  const bestQuote = sentences[1] || sentences[0];
                  return bestQuote ? <ClickToTweet quote={bestQuote} issueNumber={issue.number} /> : null;
                })()}
              </div>
            ))}
          </div>
          
          {/* Read Next recommendations */}
          {publishedIssues.length > 1 && (
            <ReadNextCards currentIssueNumber={issue.number} allIssues={publishedIssues} />
          )}
          
          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mt-16 pt-8 border-t border-border/50"
          >
            <div className="flex items-center justify-between">
              {issue.number > 1 && (
                <Link to={`/issues/${issue.number - 1}`}>
                  <Button variant="ghost" className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Previous Issue
                  </Button>
                </Link>
              )}
               {issue.number < maxIssueNumber && (
                <Link to={`/issues/${issue.number + 1}`} className="ml-auto">
                  <Button variant="ghost" className="gap-2">
                    Next Issue
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
      </article>
      </main>
      
      <Footer />
      <ViralSharePrompt title={issue.title} issueNumber={issue.number} />
      </div>
    </>
  );
};

export default IssuePage;
