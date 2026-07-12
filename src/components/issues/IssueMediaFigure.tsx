import { type IssueMedia } from "@/data/issues";
import { cn } from "@/lib/utils";

interface IssueMediaFigureProps {
  media: IssueMedia;
  className?: string;
}

const aspectClasses: Record<NonNullable<IssueMedia["aspectRatio"]>, string> = {
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  square: "aspect-square",
  wide: "aspect-[16/9]",
};

export const IssueMediaFigure = ({ media, className }: IssueMediaFigureProps) => {
  const aspectClass = media.aspectRatio ? aspectClasses[media.aspectRatio] : "aspect-[16/9]";

  return (
    <figure className={cn("space-y-3", className)}>
      <div className={cn("overflow-hidden rounded-2xl border border-black/10 bg-[#0d1117] p-3 shadow-[0_24px_60px_rgba(0,0,0,0.12)]", aspectClass)}>
        <img
          src={media.src}
          alt={media.alt}
          loading="lazy"
          className="h-full w-full object-contain"
        />
      </div>
      {(media.caption || media.credit) && (
        <figcaption className="space-y-1 text-xs leading-5 text-black/60">
          {media.caption && <p>{media.caption}</p>}
          {media.credit && <p className="font-mono uppercase tracking-widest">{media.credit}</p>}
        </figcaption>
      )}
    </figure>
  );
};
