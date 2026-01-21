import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import heroBanner from "@/assets/hero-banner.png";

export const Hero = () => {
  const scrollToIssues = () => {
    document.getElementById('issues')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col overflow-hidden">
      {/* Hero Banner Image */}
      <div className="relative w-full">
        <motion.div
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="w-full"
        >
          <img 
            src={heroBanner} 
            alt="The Black Files - Emerging Shadow Economies: The Foundation of Exploit Fusion"
            className="w-full h-auto object-cover"
          />
          {/* Dark moody overlay */}
          <div 
            className="absolute inset-0 pointer-events-none bg-background/40"
          />
          {/* Gradient fade at bottom */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, transparent 50%, hsl(var(--background)) 95%)',
            }}
          />
        </motion.div>
      </div>
      
      {/* Content below banner */}
      <div className="container mx-auto px-6 relative z-10 flex-1 flex items-center justify-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Doctrine-driven intelligence analyzing shadow economies, 
            exploit fusion, and systemic financial risk. 
            <span className="text-foreground"> No advertising. No social features. Content-first.</span>
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button 
              variant="classified" 
              size="lg"
              onClick={scrollToIssues}
              className="group"
            >
              Access Issues
              <ArrowDown className="w-4 h-4 ml-2 group-hover:translate-y-1 transition-transform" />
            </Button>
            <Button variant="ghost" size="lg" asChild>
              <a href="/doctrine">Read Doctrine</a>
            </Button>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="flex flex-col items-center gap-2"
        >
          <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-px h-8 bg-gradient-to-b from-classified to-transparent"
          />
        </motion.div>
      </div>
    </section>
  );
};
