import { Twitter } from "lucide-react";
import { motion } from "framer-motion";

interface ClickToTweetProps {
  quote: string;
  issueNumber: number;
}

export const ClickToTweet = ({ quote, issueNumber }: ClickToTweetProps) => {
  const tweetText = `"${quote}"\n\n— BLACKFILES Issue #${String(issueNumber).padStart(2, '0')}`;
  const url = `https://doctrine-ledger.lovable.app/issues/${issueNumber}`;
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(url)}`;

  return (
    <motion.a
      href={tweetUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="group block my-8 p-6 glass-card border-l-2 border-classified hover:border-classified/60 transition-all duration-300 cursor-pointer"
    >
      <p className="font-serif text-lg sm:text-xl text-foreground/90 italic leading-relaxed mb-4">
        "{quote}"
      </p>
      <div className="flex items-center gap-2 text-classified font-mono text-xs uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
        <Twitter className="w-3.5 h-3.5" />
        <span>Click to share on 𝕏</span>
      </div>
    </motion.a>
  );
};
