import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { DoctrineIntro } from "@/components/DoctrineIntro";
import { IssueCard } from "@/components/IssueCard";
import { FoundingMemberCampaign } from "@/components/FoundingMemberCampaign";
import { SEO } from "@/components/SEO";
import { issues } from "@/data/issues";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const publishedIssues = issues.filter(i => i.publicationStatus === 'published');

  return (
    <>
      <SEO path="/" />
      <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <Hero />
        
        <DoctrineIntro />
        
        {/* Issue Index */}
        <section id="issues" className="py-24">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-end justify-between mb-12"
            >
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-classified mb-2 block">
                  Publication Archive
                </span>
                <h2 className="font-serif text-3xl md:text-4xl font-bold">
                  Intelligence Briefings
                </h2>
              </div>
              <Link to="/archive">
                <Button variant="ghost" className="hidden sm:flex">
                  View Archive <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </motion.div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {publishedIssues.slice(0, 8).map((issue, index) => (
                <IssueCard key={issue.number} issue={issue} index={index} />
              ))}
            </div>
            
            <div className="mt-12 text-center sm:hidden">
              <Link to="/archive">
                <Button variant="classified-outline">
                  View All Issues <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Founding Member Campaign */}
        <FoundingMemberCampaign />
      </main>
      
      <Footer />
      </div>
    </>
  );
};

export default Index;
