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

  const embers = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    delay: Math.random() * 8,
    duration: 6 + Math.random() * 4,
    left: `${5 + Math.random() * 90}%`,
    size: 3 + Math.random() * 5,
  }));

  return (
    <section className="relative min-h-[95vh] flex flex-col overflow-hidden">
      {/* Rising embers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
        {embers.map((ember) => (
          <Ember key={ember.id} {...ember} />
        ))}
      </div>

      {/* Hero Banner Image — full bleed background */}
      <div className="absolute inset-0">
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="w-full h-full"
        >
          <img 
            src={heroBanner} 
            alt="Glassmorphic intelligence interface over dark city skyline"
            className="w-full h-full object-cover"
            width={1920}
            height={1080}
          />
          {/* Subtle color tint */}
          <div className="absolute inset-0 bg-background/40" />
          {/* Bottom fade into content */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, transparent 20%, hsl(var(--background) / 0.6) 60%, hsl(var(--background)) 88%)',
            }}
          />
          {/* Side vignettes */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 40%, hsl(var(--background) / 0.7) 100%)',
            }}
          />
        </motion.div>
      </div>
      
      {/* Content overlay */}
      <div className="relative z-10 flex-1 flex items-end pb-16 md:pb-24">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="max-w-3xl"
          >
            {/* BLACKFILES title — bold, slight glow, reduced contrast */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="mb-6"
            >
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
                <span 
                  className="text-foreground/90"
                  style={{ textShadow: '0 0 40px hsl(var(--classified) / 0.3)' }}
                >
                  BLACK
                </span>
                <span 
                  className="text-classified/90"
                  style={{ textShadow: '0 0 40px hsl(var(--classified) / 0.4)' }}
                >
                  FILES
                </span>
              </h1>
            </motion.div>

            {/* Issue title — white/off-white, tight tracking */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground/95 tracking-tight leading-tight mb-4"
            >
              Emerging Shadow Economies
            </motion.h2>

            {/* Subline inside a glass panel */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.6 }}
              className="glass px-4 py-2.5 rounded-lg inline-block mb-10"
            >
              <span className="font-mono text-xs sm:text-sm tracking-wider text-muted-foreground">
                The foundation of exploit fusion
              </span>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.6 }}
              className="text-sm sm:text-base text-muted-foreground max-w-xl mb-8 leading-relaxed"
            >
              Doctrine-driven intelligence analyzing shadow economies, 
              exploit fusion, and systemic financial risk. 
              <span className="text-foreground/80 font-medium"> No advertising. No social features. Content-first.</span>
            </motion.p>
            
            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-start gap-3"
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
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.5 }}
          className="flex flex-col items-center gap-2"
        >
          <span className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-widest">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-px h-6 bg-gradient-to-b from-classified/50 to-transparent"
          />
        </motion.div>
      </div>
    </section>
  );
};
