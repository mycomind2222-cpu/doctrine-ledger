import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown, Zap } from "lucide-react";
import heroBanner from "@/assets/hero-banner.png";

const Ember = ({ delay, duration, left, size }: { delay: number; duration: number; left: string; size: number }) => (
  <motion.div
    className="absolute rounded-full"
    style={{
      width: size,
      height: size,
      left,
      bottom: -20,
      background: 'radial-gradient(circle, hsl(var(--classified)) 0%, transparent 70%)',
      boxShadow: '0 0 6px 2px hsl(var(--classified) / 0.6)',
    }}
    animate={{
      y: [0, -1000],
      opacity: [0, 1, 0.8, 0],
      scale: [0.5, 1, 0.6],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "linear",
    }}
  />
);

export const Hero = () => {
  const scrollToIssues = () => {
    document.getElementById('issues')?.scrollIntoView({ behavior: 'smooth' });
  };

  const embers = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    delay: Math.random() * 8,
    duration: 6 + Math.random() * 4,
    left: `${5 + Math.random() * 90}%`,
    size: 4 + Math.random() * 6,
  }));

  return (
    <section className="relative min-h-[90vh] flex flex-col overflow-hidden">
      {/* Rising embers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
        {embers.map((ember) => (
          <Ember key={ember.id} {...ember} />
        ))}
      </div>

      {/* Hero Banner Image */}
      <div className="relative w-full">
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="w-full"
        >
          <img 
            src={heroBanner} 
            alt="The Black Files - Emerging Shadow Economies: The Foundation of Exploit Fusion"
            className="w-full h-auto object-cover"
          />
          <div className="absolute inset-0 pointer-events-none bg-background/30" />
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, transparent 40%, hsl(var(--background)) 92%)',
            }}
          />
        </motion.div>
      </div>
      
      {/* Content below banner */}
      <div className="container mx-auto px-4 sm:px-6 relative z-10 flex-1 flex items-center justify-center py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Glowing title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="relative mb-8"
          >
            <motion.div
              className="absolute -inset-12 blur-3xl rounded-full"
              style={{
                background: 'radial-gradient(ellipse at center, hsl(var(--classified) / 0.4) 0%, transparent 70%)',
              }}
              animate={{
                opacity: [0.3, 0.7, 0.3],
                scale: [0.9, 1.15, 0.9],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <h1 className="relative font-serif text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight">
              <span className="text-foreground">BLACK</span>
              <span className="text-classified">FILES</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed px-2"
          >
            Doctrine-driven intelligence analyzing shadow economies, 
            exploit fusion, and systemic financial risk. 
            <span className="text-foreground font-medium"> No advertising. No social features. Content-first.</span>
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button 
              variant="classified" 
              size="lg"
              onClick={scrollToIssues}
              className="group rounded-xl shadow-lg shadow-classified/20 hover:shadow-classified/30 transition-shadow"
            >
              <Zap className="w-4 h-4 mr-2" />
              Access Issues
              <ArrowDown className="w-4 h-4 ml-2 group-hover:translate-y-1 transition-transform" />
            </Button>
            <Button variant="ghost" size="lg" asChild className="rounded-xl glass hover:bg-muted/30">
              <a href="/doctrine">Read Doctrine</a>
            </Button>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
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
