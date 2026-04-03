import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowDown, Zap, Activity, TrendingUp, Fingerprint, Mail, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
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

const emailSchema = z.string().trim().min(1).max(255).email();

export const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [signalEmail, setSignalEmail] = useState('');
  const [signalLoading, setSignalLoading] = useState(false);
  const [signalDone, setSignalDone] = useState(false);
  const [signalError, setSignalError] = useState<string | null>(null);

  const handleSignalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignalError(null);
    const result = emailSchema.safeParse(signalEmail);
    if (!result.success) { setSignalError('Please enter a valid email.'); return; }
    setSignalLoading(true);
    try {
      const { error } = await supabase.from('founding_members').insert({ email: signalEmail.toLowerCase().trim(), source: 'hero-signal' });
      if (error) {
        setSignalError(error.code === '23505' ? 'Already on the list!' : 'Something went wrong.');
      } else {
        setSignalDone(true);
        setSignalEmail('');
      }
    } catch { setSignalError('Unexpected error.'); }
    finally { setSignalLoading(false); }
  };

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
        className="relative z-10 flex-1 flex items-end pb-10 md:pb-16"
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
                className="mb-4"
              >
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
                  <span 
                    className="text-foreground/90"
                    style={{ textShadow: '0 0 40px hsl(var(--classified) / 0.3)' }}
                  >
                    BLACKFILES
                  </span>
                  <span className="text-classified/60"> — </span>
                  <span className="text-foreground/70 text-2xl sm:text-3xl md:text-4xl">
                    The AI Crime Newsletter
                  </span>
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.7 }}
                className="text-sm sm:text-base text-muted-foreground max-w-xl mb-5 leading-relaxed"
              >
                Every week we break down how AI is being used for fraud, scams, deepfakes, market manipulation, and crimes you haven't heard of yet.
                <span className="text-foreground/80 font-medium"> Real cases. Real threats. Zero hype.</span>
              </motion.p>

              {/* Value proposition */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="glass px-4 py-3 rounded-lg mb-6 max-w-xl"
              >
                <p className="font-mono text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                  <span className="text-foreground/90 font-medium">100% free — no paywall, no gimmicks.</span>{' '}
                  Join thousands of readers who want to understand AI threats before they hit the headlines.
                </p>
              </motion.div>

              {/* Primary CTA — scroll to issues */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="flex flex-col sm:flex-row items-start gap-3 mb-8"
              >
                <Button 
                  variant="classified" 
                  size="lg"
                  onClick={scrollToIssues}
                  className="group rounded-xl shadow-lg shadow-classified/20 hover:shadow-classified/30 transition-shadow"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Browse Latest Briefings
                  <ArrowDown className="w-4 h-4 ml-2 group-hover:translate-y-1 transition-transform" />
                </Button>
                <Button variant="ghost" size="lg" asChild className="rounded-xl glass hover:bg-muted/30">
                  <a href="/doctrine">Our Methodology</a>
                </Button>
              </motion.div>
              
              {/* Signal Brief email signup — moved lower */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85, duration: 0.6 }}
              >
                <p className="font-mono text-xs text-muted-foreground mb-3 tracking-wide">
                  Get the weekly Signal Brief delivered free →
                </p>
                {signalDone ? (
                  <div className="flex items-center gap-2 text-classified font-mono text-sm">
                    <CheckCircle className="w-4 h-4" /> You're on the list.
                  </div>
                ) : (
                  <form onSubmit={handleSignalSubmit} className="flex gap-2 max-w-md">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="email"
                        value={signalEmail}
                        onChange={(e) => { setSignalEmail(e.target.value); setSignalError(null); }}
                        placeholder="your@email.com"
                        className="pl-10 glass border-border/50 focus:border-classified h-10 rounded-lg text-sm"
                        disabled={signalLoading}
                      />
                    </div>
                    <Button type="submit" variant="classified" size="sm" className="rounded-lg px-5 h-10" disabled={signalLoading}>
                      {signalLoading ? '...' : 'Subscribe'}
                    </Button>
                  </form>
                )}
                {signalError && (
                  <p className="mt-2 text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {signalError}
                  </p>
                )}
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
      
      {/* Scroll indicator — hidden on mobile to save space */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 hidden md:block">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.5 }}
          className="flex flex-col items-center gap-2"
        >
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
