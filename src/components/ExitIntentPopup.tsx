import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, AlertCircle, CheckCircle, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

const emailSchema = z.string().trim().min(1).max(255).email();

export const ExitIntentPopup = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMouseLeave = useCallback((e: MouseEvent) => {
    if (e.clientY <= 5 && !sessionStorage.getItem('bf_exit_shown')) {
      setShow(true);
      sessionStorage.setItem('bf_exit_shown', '1');
    }
  }, []);

  useEffect(() => {
    // Only trigger after 30s on page
    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
    }, 30000);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseLeave]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!emailSchema.safeParse(email).success) { setError('Enter a valid email.'); return; }
    setLoading(true);
    try {
      const { error: err } = await supabase.from('founding_members').insert({ email: email.toLowerCase().trim(), source: 'exit-intent' });
      if (err) { setError(err.code === '23505' ? 'Already subscribed!' : 'Something went wrong.'); }
      else { setDone(true); setEmail(''); }
    } catch { setError('Unexpected error.'); }
    finally { setLoading(false); }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShow(false)} />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative glass-strong rounded-2xl border border-border/50 shadow-2xl max-w-md w-full overflow-hidden"
          >
            {/* Close */}
            <button onClick={() => setShow(false)} className="absolute top-4 right-4 p-1 text-muted-foreground hover:text-foreground transition-colors z-10">
              <X className="w-5 h-5" />
            </button>

            {/* Top accent */}
            <div className="h-1 w-full bg-gradient-to-r from-classified/50 via-classified to-classified/50" />

            <div className="p-8 text-center">
              {done ? (
                <div className="py-4">
                  <CheckCircle className="w-10 h-10 text-classified mx-auto mb-4" />
                  <h3 className="font-serif text-2xl font-bold mb-2">You're in.</h3>
                  <p className="text-muted-foreground text-sm">Your first briefing is on the way.</p>
                </div>
              ) : (
                <>
                  <div className="inline-flex items-center gap-2 glass-accent px-3 py-1.5 rounded-lg mb-6">
                    <Zap className="w-3.5 h-3.5 text-classified" />
                    <span className="font-mono text-[10px] uppercase tracking-widest text-classified">Before you go</span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-3">
                    Don't miss the next briefing
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                    AI crime evolves weekly. Get each new case study delivered free — no spam, no paywall.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError(null); }}
                        placeholder="your@email.com"
                        className="pl-10 glass border-border/50 focus:border-classified h-12 rounded-xl text-sm"
                        disabled={loading}
                      />
                    </div>
                    <Button type="submit" variant="classified" className="w-full h-12 rounded-xl text-sm" disabled={loading}>
                      {loading ? '...' : 'Get Free Briefings →'}
                    </Button>
                    {error && (
                      <p className="text-xs text-destructive flex items-center justify-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {error}
                      </p>
                    )}
                  </form>

                  <p className="mt-4 text-[10px] text-muted-foreground/50 font-mono">
                    Join 500+ readers · Unsubscribe anytime
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
