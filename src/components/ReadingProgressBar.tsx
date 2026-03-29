import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export const ReadingProgressBar = () => {
  const [progress, setProgress] = useState(0);
  const springProgress = useSpring(0, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
      setProgress(scrolled);
      springProgress.set(scrolled);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [springProgress]);

  if (progress < 2) return null;

  return (
    <div className="fixed top-[57px] left-0 right-0 z-50 h-[2px] bg-border/30">
      <motion.div
        className="h-full rounded-r-full"
        style={{
          width: `${progress}%`,
          background: "linear-gradient(90deg, hsl(var(--classified)), hsl(var(--classified) / 0.6))",
        }}
      />
    </div>
  );
};
