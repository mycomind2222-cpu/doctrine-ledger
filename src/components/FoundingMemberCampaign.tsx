import { useState } from 'react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { Mail, Shield, Users, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';

const emailSchema = z.string()
  .trim()
  .min(1, 'Email is required')
  .max(255, 'Email must be less than 255 characters')
  .email('Invalid email address')
  .refine(
    (email) => !/<|>|script|javascript:/i.test(email),
    'Invalid characters in email'
  );

export const FoundingMemberCampaign = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const result = emailSchema.safeParse(email);
    if (!result.success) { setError(result.error.errors[0].message); return; }
    setIsLoading(true);
    try {
      const { error: insertError } = await supabase
        .from('founding_members')
        .insert({ email: email.toLowerCase().trim() });
      if (insertError) {
        setError(insertError.code === '23505' ? 'This email is already registered.' : 'Failed to register. Please try again.');
      } else {
        setIsSubscribed(true);
        setEmail('');
      }
    } catch {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 50% 0%, hsl(var(--classified) / 0.08) 0%, transparent 50%)',
      }} />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 glass-accent px-4 py-2 rounded-lg mb-8"
          >
            <Shield className="w-4 h-4 text-classified" />
            <span className="font-mono text-xs uppercase tracking-widest text-classified">
              Founding Member Access
            </span>
          </motion.div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Never Miss a <span className="text-classified">Briefing</span>
          </h2>
          
          <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-xl mx-auto px-2">
            Join the free Signal List — get every new AI crime briefing
            <span className="text-foreground font-medium"> delivered straight to your inbox</span>.
          </p>

          {/* Email Form */}
          {isSubscribed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-accent p-8 rounded-xl"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-classified" />
                <span className="font-mono text-sm uppercase tracking-widest text-classified">
                  Access Granted
                </span>
              </div>
              <h3 className="font-serif text-xl font-bold mb-2">Welcome to the Inner Circle</h3>
              <p className="text-muted-foreground">
                You'll receive priority notification when BLACKFILES launches.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(null); }}
                    placeholder="Enter your email"
                    className="pl-10 glass border-border/50 focus:border-classified h-12 rounded-xl"
                    disabled={isLoading}
                  />
                </div>
                <Button
                  type="submit"
                  variant="classified"
                  className="h-12 px-8 rounded-xl shadow-lg shadow-classified/20"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Processing
                    </span>
                  ) : 'Request Access'}
                </Button>
              </div>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 text-sm text-destructive flex items-center justify-center gap-1"
                >
                  <AlertCircle className="w-3 h-3" /> {error}
                </motion.p>
              )}
            </form>
          )}

          {/* Benefits */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {[
              { icon: Shield, title: 'Stay Ahead', description: 'Know about AI threats before they hit the news' },
              { icon: Users, title: 'Plain English', description: 'No jargon — written so anyone can understand' },
              { icon: Clock, title: 'Every Week', description: 'New briefings delivered straight to your inbox' },
            ].map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index }}
                className="glass-card p-6 text-center"
              >
                <benefit.icon className="w-6 h-6 text-classified mb-4 mx-auto" />
                <h4 className="font-mono text-sm uppercase tracking-widest mb-2">{benefit.title}</h4>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
