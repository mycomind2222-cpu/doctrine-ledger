import { cn } from "@/lib/utils";

interface CoverArtworkFrameProps {
  artworkUrl?: string | null;
  artworkAlt: string;
  className?: string;
}

export const CoverArtworkFrame = ({ artworkUrl, artworkAlt, className }: CoverArtworkFrameProps) => {
  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden border border-[#ff8b4d]/30 bg-[#050505] shadow-[0_36px_100px_rgba(0,0,0,0.58)]",
        className,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,139,77,0.12),transparent_40%),radial-gradient(circle_at_50%_100%,rgba(138,208,255,0.08),transparent_36%)]" />
      <div className="absolute inset-0 border border-white/5" />
      {artworkUrl ? (
        <img
          src={artworkUrl}
          alt={artworkAlt}
          className="relative z-10 h-full w-full object-contain"
          loading="eager"
        />
      ) : (
        <div className="relative z-10 flex h-full w-full items-center justify-center text-[#f4eadc]/20">
          <div className="text-center">
            <div className="font-serif text-[86px] leading-none tracking-[-0.08em]">—</div>
            <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.32em]">Artwork pending</div>
          </div>
        </div>
      )}
    </div>
  );
};
