import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

const emailSchema = z.string().trim().min(1).max(255).email();

export const StickyEmailBar = () => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (dismissed || done) return;
    const onScroll = () => {
      setVisible(window.scrollY > 600);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [dismissed, done]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!emailSchema.safeParse(email).success) { setError('Enter a valid email'); return; }
    setLoading(true);
    try {
      const { error: err } = await supabase.from('founding_members').insert({ email: email.toLowerCase().trim(), source: 'sticky-bar' });
      if (err) { setError(err.code === '23505' ? 'Already subscribed!' : 'Something went wrong.'); }
      else { setDone(true); setEmail(''); }
    } catch { setError('Unexpected error.'); }
    finally { setLoading(false); }
  };

  if (dismissed && !done) return null;

  return (
    <AnimatePresence>
      {(visible || done) && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-border/50"
        >
          <div className="container mx-auto px-4 py-3 flex items-center justify-center gap-3 flex-wrap">
            {done ? (
              <div className="flex items-center gap-2 text-classified font-mono text-sm py-1">
                <CheckCircle className="w-4 h-4" /> You're subscribed — check your inbox!
              </div>
            ) : (
              <>
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  <span className="text-foreground font-medium">Get AI crime briefings free</span> — delivered weekly
                </span>
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <div className="relative">
                    <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(null); }}
                      placeholder="your@email.com"
                      className="pl-8 h-9 text-sm w-48 sm:w-56 glass border-border/50 focus:border-classified rounded-lg"
                      disabled={loading}
                    />
                  </div>
                  <Button type="submit" variant="classified" size="sm" className="h-9 px-4 rounded-lg text-sm" disabled={loading}>
                    {loading ? '...' : 'Subscribe'}
                  </Button>
                </form>
                {error && (
                  <span className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {error}
                  </span>
                )}
                <button onClick={() => setDismissed(true)} className="p-1 text-muted-foreground hover:text-foreground transition-colors ml-1">
                  <X className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
