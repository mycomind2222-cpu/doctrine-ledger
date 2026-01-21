import { type AccessLevel } from "@/data/issues";
import { cn } from "@/lib/utils";

interface AccessBadgeProps {
  level: AccessLevel;
  className?: string;
}

export const AccessBadge = ({ level, className }: AccessBadgeProps) => {
  const badgeClass = {
    public: "badge-public",
    professional: "badge-professional",
    restricted: "badge-restricted",
  }[level];

  return (
    <span className={cn(badgeClass, className)}>
      {level.toUpperCase()}
    </span>
  );
};
