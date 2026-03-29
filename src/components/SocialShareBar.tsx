import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface SocialShareBarProps {
  title: string;
  url: string;
}

export const SocialShareBar = ({ title, url }: SocialShareBarProps) => {
  const { toast } = useToast();
  const fullUrl = url.startsWith("http") ? url : `https://doctrine-ledger.lovable.app${url}`;
  const encodedUrl = encodeURIComponent(fullUrl);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    { label: "𝕏", href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}` },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` },
    { label: "Reddit", href: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}` },
  ];

  const copyLink = async () => {
    await navigator.clipboard.writeText(fullUrl);
    toast({ title: "Link copied", description: "Share it anywhere." });
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mr-1">Share</span>
      {shareLinks.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="px-2.5 py-1 text-xs font-mono glass rounded-md text-muted-foreground hover:text-foreground hover:border-classified/30 border border-border/50 transition-colors"
        >
          {link.label}
        </a>
      ))}
      <Button
        variant="ghost"
        size="sm"
        onClick={copyLink}
        className="h-7 px-2.5 text-xs font-mono text-muted-foreground hover:text-foreground gap-1"
      >
        <Share2 className="w-3 h-3" /> Copy
      </Button>
    </div>
  );
};
