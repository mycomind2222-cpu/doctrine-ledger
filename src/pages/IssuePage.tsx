import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Tag, Loader2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AccessBadge } from "@/components/AccessBadge";
import { LockedContentOverlay } from "@/components/LockedContentOverlay";
import { SEO } from "@/components/SEO";
import { ReadingProgressBar } from "@/components/ReadingProgressBar";
import { SocialShareBar } from "@/components/SocialShareBar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useIssue, useAllIssues } from "@/hooks/useIssues";
import { IssueVoting } from "@/components/IssueVoting";
 import { type Section, type AccessLevel as IssueAccessLevel } from "@/data/issues";
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
  const sectionLabels: Record<string, string> = {
    executive_summary: "Executive Summary",
    doctrine_preview: "Doctrine Preview",
    deep_dive: "Deep Dive",
    case_study: "Case Study",
    doctrine_statement: "Doctrine Statement",
    actionable_insight: "Actionable Insight",
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
   const { hasAccess } = useAuth();
   const { data: issue, isLoading } = useIssue(Number(issueNumber));
   const { data: allIssues } = useAllIssues();
   const maxIssueNumber = allIssues?.length ? Math.max(...allIssues.map(i => i.number)) : 10;
 
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
        title={`Issue #${String(issue.number).padStart(2, '0')}: ${issue.title} — ${issue.theme} Analysis`}
        description={issue.sections[0]?.content.slice(0, 155).replace(/\n/g, ' ') + "..." || `BLACKFILES Issue ${issue.number} — ${issue.theme} intelligence briefing on shadow economies and engineered markets.`}
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
          
          {/* Issue content */}
          <div className="max-w-3xl">
            {issue.sections.map((section) => (
              <SectionContent 
                key={section.id} 
                section={section} 
                isLocked={isLocked(section.audienceLevel)}
                requiredLevel={section.audienceLevel}
              />
            ))}
          </div>
          
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
      </div>
    </>
  );
};

export default IssuePage;
