import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, Clock, Tag } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AccessBadge } from "@/components/AccessBadge";
import { Button } from "@/components/ui/button";
import { getIssue, type Section, type AccessLevel } from "@/data/issues";

const SectionContent = ({ section, isLocked }: { section: Section; isLocked: boolean }) => {
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
      
      <div className={`relative ${isLocked ? 'content-restricted' : ''}`}>
        <div className="prose-blackfiles">
          {section.content.split('\n\n').map((paragraph, i) => {
            if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
              return (
                <h3 key={i} className="font-serif text-xl font-semibold text-foreground mb-4">
                  {paragraph.replace(/\*\*/g, '')}
                </h3>
              );
            }
            if (paragraph.startsWith('**')) {
              const parts = paragraph.split('**');
              return (
                <p key={i}>
                  <strong className="text-foreground">{parts[1]}</strong>
                  {parts[2]}
                </p>
              );
            }
            return <p key={i}>{paragraph}</p>;
          })}
        </div>
        
        {section.sidebarElements && section.sidebarElements.length > 0 && (
          <div className="mt-8 space-y-4">
            {section.sidebarElements.map((el, i) => (
              <div key={i} className="sidebar-element">
                <span className="font-mono text-xs uppercase tracking-widest text-classified block mb-2">
                  {el.type.replace('_', ' ')}
                </span>
                <p className={el.type === 'pull_quote' ? 'pull-quote' : 'text-sm text-muted-foreground font-mono'}>
                  {el.content}
                </p>
              </div>
            ))}
          </div>
        )}
        
        {isLocked && (
          <div className="content-restricted-overlay">
            <Lock className="w-8 h-8 text-classified" />
            <span className="font-mono text-sm uppercase tracking-widest">
              Restricted Content
            </span>
            <Button variant="classified" size="sm">
              Request Access
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const IssuePage = () => {
  const { issueNumber } = useParams();
  const issue = getIssue(Number(issueNumber));

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

  // Simulate access level - in real app this would come from auth
  const userAccessLevel: AccessLevel = 'public';
  
  const isLocked = (sectionLevel: AccessLevel) => {
    const levels: AccessLevel[] = ['public', 'professional', 'restricted'];
    return levels.indexOf(sectionLevel) > levels.indexOf(userAccessLevel);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <article className="container mx-auto px-6">
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
            </div>
            
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
              {issue.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <time>
                  {new Date(issue.publishDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <div className="flex gap-2">
                  {issue.tags.map(tag => (
                    <span key={tag} className="font-mono text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.header>
          
          {/* Issue content */}
          <div className="max-w-3xl">
            {issue.sections.map((section) => (
              <SectionContent 
                key={section.id} 
                section={section} 
                isLocked={isLocked(section.audienceLevel)}
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
              {issue.number < 10 && (
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
  );
};

export default IssuePage;
