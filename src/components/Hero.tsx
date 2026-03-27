import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown, Zap, Activity, TrendingUp, Fingerprint } from "lucide-react";
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

interface GlassPanelProps {
  label: string;
  icon: React.ElementType;
  children: React.ReactNode;
  delay: number;
  className?: string;
}

const GlassPanel = ({ label, icon: Icon, children, delay, className = "" }: GlassPanelProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30, rotateX: 8 }}
    animate={{ opacity: 1, y: 0, rotateX: 0 }}
    transition={{ delay, duration: 0.8, ease: "easeOut" }}
    whileHover={{ 
      scale: 1.03, 
      borderColor: 'hsl(var(--classified) / 0.4)',
      boxShadow: '0 8px 40px hsl(var(--classified) / 0.12), inset 0 1px 0 hsl(0 0% 100% / 0.1)',
    }}
    className={`group/panel glass-card p-4 cursor-default transition-all duration-500 ${className}`}
    style={{ perspective: '800px' }}
  >
    {/* Panel header */}
    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border/30">
      <Icon className="w-3 h-3 text-classified/70 group-hover/panel:text-classified transition-colors duration-300" />
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 group-hover/panel:text-muted-foreground transition-colors duration-300">
        {label}
      </span>
    </div>
    {/* Panel content — revealed on hover */}
    <div className="relative overflow-hidden">
      <div className="opacity-60 group-hover/panel:opacity-100 transition-opacity duration-500">
        {children}
      </div>
      {/* Hover reveal overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-card/60 to-transparent opacity-100 group-hover/panel:opacity-0 transition-opacity duration-500 pointer-events-none" />
    </div>
  </motion.div>
);

export const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Parallax: image moves slower than scroll
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

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
    <section ref={sectionRef} className="relative min-h-[70vh] md:min-h-[80vh] flex flex-col overflow-hidden">
      {/* Rising embers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
        {embers.map((ember) => (
          <Ember key={ember.id} {...ember} />
        ))}
      </div>

      {/* Hero Banner Image — parallax background */}
      <motion.div
        className="absolute inset-0"
        style={{ y: imageY, scale: imageScale }}
      >
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
          <div className="absolute inset-0 bg-background/40" />
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, transparent 20%, hsl(var(--background) / 0.6) 60%, hsl(var(--background)) 88%)',
            }}
          />
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 40%, hsl(var(--background) / 0.7) 100%)',
            }}
          />
        </motion.div>
      </motion.div>
      
      {/* Content overlay — parallax at different speed */}
      <motion.div 
        className="relative z-10 flex-1 flex items-end pb-16 md:pb-24"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-end">
            {/* Left: text content */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4 }}
              className="max-w-2xl flex-1"
            >
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

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.7 }}
                className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground/95 tracking-tight leading-tight mb-4"
              >
                Emerging Shadow Economies
              </motion.h2>

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

            {/* Right: floating glass panels */}
            <div className="hidden lg:flex flex-col gap-3 w-72 xl:w-80">
              <GlassPanel label="Signal Layer" icon={Activity} delay={1.0}>
                <div className="space-y-2">
                  <div className="flex items-end gap-1 h-10">
                    {[40, 65, 30, 80, 55, 70, 45, 90, 35, 60, 75, 50].map((h, i) => (
                      <motion.div
                        key={i}
                        className="flex-1 rounded-sm bg-classified/30 group-hover/panel:bg-classified/50 transition-colors duration-500"
                        style={{ height: `${h}%` }}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: 1.1 + i * 0.04, duration: 0.4 }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono text-[9px] text-muted-foreground/40">Q1</span>
                    <span className="font-mono text-[9px] text-muted-foreground/40">Q4</span>
                  </div>
                </div>
              </GlassPanel>

              <GlassPanel label="Flow Layer" icon={TrendingUp} delay={1.2}>
                <div className="space-y-1.5">
                  {[
                    { w: "85%", label: "Capital Transit" },
                    { w: "62%", label: "Dark Pool Vol." },
                    { w: "40%", label: "OTC Settle" },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between mb-0.5">
                        <span className="font-mono text-[9px] text-muted-foreground/50">{item.label}</span>
                      </div>
                      <div className="h-1 rounded-full bg-muted/30 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: 'linear-gradient(90deg, hsl(var(--classified) / 0.5), hsl(var(--classified) / 0.2))' }}
                          initial={{ width: "0%" }}
                          animate={{ width: item.w }}
                          transition={{ delay: 1.3 + i * 0.15, duration: 0.8, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </GlassPanel>

              <GlassPanel label="Identity Layer" icon={Fingerprint} delay={1.4}>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <motion.div
                      key={n}
                      className="w-8 h-8 rounded-full bg-muted/20 group-hover/panel:bg-muted/30 border border-border/30 group-hover/panel:border-classified/20 transition-all duration-500 flex items-center justify-center"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.5 + n * 0.08, duration: 0.4 }}
                    >
                      <span className="font-mono text-[8px] text-muted-foreground/40 group-hover/panel:text-muted-foreground/70 transition-colors duration-500">
                        N{n}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </GlassPanel>
            </div>
          </div>
        </div>
      </motion.div>
      
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
