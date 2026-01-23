import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { Mail, Shield, Clock, Users, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';

// Enhanced email validation with length limits and sanitization
const emailSchema = z.string()
  .trim()
  .min(1, 'Email is required')
  .max(255, 'Email must be less than 255 characters')
  .email('Invalid email address')
  .refine(
    (email) => !/<|>|script|javascript:/i.test(email),
    'Invalid characters in email'
  );

// Launch date - set to 30 days from now for demo
const LAUNCH_DATE = new Date('2026-02-20T00:00:00Z');

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const calculateTimeLeft = (): TimeLeft => {
  const difference = LAUNCH_DATE.getTime() - new Date().getTime();
  
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
};

const CountdownUnit = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <div className="relative">
      <div className="absolute -inset-1 bg-classified/20 blur-md rounded-sm" />
      <div className="relative w-16 h-16 md:w-20 md:h-20 bg-secondary border border-border flex items-center justify-center rounded-sm">
        <span className="font-mono text-2xl md:text-3xl font-bold text-foreground">
          {value.toString().padStart(2, '0')}
        </span>
      </div>
    </div>
    <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground mt-2">
      {label}
    </span>
  </div>
);

export const FoundingMemberCampaign = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate email
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setIsLoading(true);

    try {
      const { error: insertError } = await supabase
        .from('founding_members')
        .insert({ email: email.toLowerCase().trim() });

      if (insertError) {
        if (insertError.code === '23505') {
          // Unique constraint violation
          setError('This email is already registered for early access.');
        } else {
          setError('Failed to register. Please try again.');
          if (import.meta.env.DEV) console.error('Subscription error:', insertError);
        }
      } else {
        setIsSubscribed(true);
        setEmail('');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      if (import.meta.env.DEV) console.error('Unexpected error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-background" />
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(ellipse at 50% 0%, hsl(var(--classified) / 0.15) 0%, transparent 50%)`,
        }}
      />
      
      <div className="container mx-auto px-6 relative z-10">
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
            className="inline-flex items-center gap-2 px-4 py-2 bg-classified/10 border border-classified/30 rounded-sm mb-8"
          >
            <Shield className="w-4 h-4 text-classified" />
            <span className="font-mono text-xs uppercase tracking-widest text-classified">
              Founding Member Access
            </span>
          </motion.div>

          {/* Headline */}
          <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6">
            Join the <span className="text-classified">Inner Circle</span>
          </h2>
          
          <p className="text-lg text-muted-foreground mb-12 max-w-xl mx-auto">
            Be among the first to access classified intelligence briefings. 
            Founding members receive <span className="text-foreground font-medium">lifetime priority access</span> and 
            <span className="text-foreground font-medium"> exclusive founding rates</span>.
          </p>

          {/* Countdown Timer */}
          <div className="mb-12">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Clock className="w-4 h-4 text-classified" />
              <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Launch Countdown
              </span>
            </div>
            <div className="flex items-center justify-center gap-4 md:gap-6">
              <CountdownUnit value={timeLeft.days} label="Days" />
              <span className="text-2xl text-muted-foreground font-mono">:</span>
              <CountdownUnit value={timeLeft.hours} label="Hours" />
              <span className="text-2xl text-muted-foreground font-mono">:</span>
              <CountdownUnit value={timeLeft.minutes} label="Min" />
              <span className="text-2xl text-muted-foreground font-mono">:</span>
              <CountdownUnit value={timeLeft.seconds} label="Sec" />
            </div>
          </div>

          {/* Email Form */}
          {isSubscribed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 bg-secondary/50 border border-classified/30 rounded-sm"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-classified" />
                <span className="font-mono text-sm uppercase tracking-widest text-classified">
                  Access Granted
                </span>
              </div>
              <h3 className="font-serif text-xl font-bold mb-2">
                Welcome to the Inner Circle
              </h3>
              <p className="text-muted-foreground">
                You'll receive priority notification when BLACKFILES launches. 
                Your founding member status is confirmed.
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
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError(null);
                    }}
                    placeholder="Enter your email"
                    className="pl-10 bg-secondary border-border focus:border-classified h-12"
                    disabled={isLoading}
                  />
                </div>
                <Button
                  type="submit"
                  variant="classified"
                  className="h-12 px-8"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Processing
                    </span>
                  ) : (
                    'Request Access'
                  )}
                </Button>
              </div>
              
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 text-sm text-destructive flex items-center justify-center gap-1"
                >
                  <AlertCircle className="w-3 h-3" />
                  {error}
                </motion.p>
              )}
            </form>
          )}

          {/* Benefits */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: 'Lifetime Priority',
                description: 'First access to all new intelligence briefings',
              },
              {
                icon: Users,
                title: 'Founding Rates',
                description: 'Exclusive pricing locked for life',
              },
              {
                icon: Clock,
                title: 'Early Archive',
                description: 'Access to pre-launch classified content',
              },
            ].map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index }}
                className="p-6 bg-secondary/30 border border-border rounded-sm"
              >
                <benefit.icon className="w-6 h-6 text-classified mb-4 mx-auto" />
                <h4 className="font-mono text-sm uppercase tracking-widest mb-2">
                  {benefit.title}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
