import { forwardRef } from "react";
import { type AccessLevel } from "@/data/issues";
import { cn } from "@/lib/utils";

interface AccessBadgeProps {
  level: AccessLevel;
  className?: string;
}

export const AccessBadge = forwardRef<HTMLSpanElement, AccessBadgeProps>(
  ({ level, className }, ref) => {
    const badgeClass = {
      public: "badge-public",
      professional: "badge-professional",
      restricted: "badge-restricted",
    }[level];

    return (
      <span ref={ref} className={cn(badgeClass, className)}>
        {level.toUpperCase()}
      </span>
    );
  }
);

AccessBadge.displayName = 'AccessBadge';
