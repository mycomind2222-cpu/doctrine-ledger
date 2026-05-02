import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const emailSchema = z.string().trim().min(1).max(255).email();

export const Hero = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const result = emailSchema.safeParse(email);
    if (!result.success) { setError('Please enter a valid email.'); return; }
    setLoading(true);
    try {
      const { error } = await supabase.from('founding_members').insert({ email: email.toLowerCase().trim(), source: 'hero-signal' });
      if (error) {
        setError(error.code === '23505' ? 'Already on the list!' : 'Something went wrong.');
      } else {
        setDone(true);
        setEmail('');
      }
    } catch { setError('Unexpected error.'); }
    finally { setLoading(false); }
  };

  return (
    <section className="relative py-10 md:py-14 border-b border-border/30">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-4"
          >
            AI crime is evolving weekly.{" "}
            <span className="text-classified">Stay ahead.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-base sm:text-lg text-muted-foreground mb-6 max-w-lg mx-auto"
          >
            Free weekly briefings on AI-powered fraud, deepfakes, scams, and cybercrime. Real cases. Zero hype.
          </motion.p>

          {/* Email signup */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-md mx-auto mb-4"
          >
            {done ? (
              <div className="flex items-center justify-center gap-2 text-classified font-mono text-sm py-3">
                <CheckCircle className="w-4 h-4" /> You're on the list — first briefing incoming.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(null); }}
                    placeholder="your@email.com"
                    className="pl-10 h-11 rounded-lg text-sm border-border/50 focus:border-classified bg-secondary/30"
                    disabled={loading}
                  />
                </div>
                <Button type="submit" variant="classified" className="rounded-lg px-6 h-11 font-medium" disabled={loading}>
                  {loading ? '...' : 'Subscribe'}
                </Button>
              </form>
            )}
            {error && (
              <p className="mt-2 text-xs text-destructive flex items-center justify-center gap-1">
                <AlertCircle className="w-3 h-3" /> {error}
              </p>
            )}
          </motion.div>

          {/* Social proof */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="font-mono text-xs text-muted-foreground/70"
          >
            100% free · No paywall · Trusted by security researchers & journalists
          </motion.p>
        </div>
      </div>
    </section>
  );
};
