import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, X, MessageCircle, Send, Copy, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ViralSharePromptProps {
  title: string;
  issueNumber: number;
}

export const ViralSharePrompt = ({ title, issueNumber }: ViralSharePromptProps) => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const fullUrl = `https://doctrine-ledger.lovable.app/issues/${issueNumber}`;
  const shareText = `🚨 "${title}" — BLACKFILES Issue #${String(issueNumber).padStart(2, '0')}\n\nAI crime is evolving faster than most people realize.\n\n`;

  useEffect(() => {
    if (dismissed) return;
    const onScroll = () => {
      const scrollPercent = (window.scrollY + window.innerHeight) / document.body.scrollHeight;
      if (scrollPercent > 0.75) setVisible(true);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [dismissed]);

  const copyLink = async () => {
    await navigator.clipboard.writeText(`${shareText}${fullUrl}`);
    setCopied(true);
    toast({ title: "Copied!", description: "Share it anywhere." });
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = [
    {
      label: 'WhatsApp',
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodeURIComponent(shareText + fullUrl)}`,
      color: 'hover:bg-green-500/10 hover:text-green-400 hover:border-green-500/30',
    },
    {
      label: 'Telegram',
      icon: Send,
      href: `https://t.me/share/url?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(shareText)}`,
      color: 'hover:bg-blue-400/10 hover:text-blue-400 hover:border-blue-400/30',
    },
    {
      label: '𝕏',
      icon: Share2,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(fullUrl)}`,
      color: 'hover:bg-foreground/10 hover:text-foreground hover:border-foreground/30',
    },
  ];

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed bottom-6 right-6 z-50 w-72 sm:w-80 glass-strong rounded-xl border border-border/50 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Share2 className="w-4 h-4 text-classified" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-classified rounded-full animate-ping" />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-classified">
                Found this useful?
              </span>
            </div>
            <button onClick={() => setDismissed(true)} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Share this briefing — help others stay ahead of AI threats.
            </p>

            <div className="flex gap-2">
              {shareLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg border border-border/50 text-muted-foreground text-xs font-mono transition-all duration-200 ${link.color}`}
                >
                  <link.icon className="w-3.5 h-3.5" />
                  {link.label}
                </a>
              ))}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={copyLink}
              className="w-full h-9 text-xs font-mono gap-2 glass hover:bg-muted/30 rounded-lg"
            >
              {copied ? <CheckCircle className="w-3.5 h-3.5 text-classified" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy link & text'}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
