import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "ISSUES", path: "/" },
  { label: "ARCHIVE", path: "/archive" },
  { label: "DOSSIERS", path: "/intel" },
  { label: "ABOUT", path: "/doctrine" },
  { label: "MEMBERSHIP", path: "/auth" },
];

export const Header = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/" ) return location.pathname === "/";
    return location.pathname === path;
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/8 bg-[#070707]/96 text-[#f2e7d8] backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-start gap-3">
            <div className="space-y-1">
              <div className="font-serif text-[30px] font-semibold leading-none tracking-[-0.04em] text-[#f2e7d8] sm:text-[34px]">
                BLACKFILES
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.42em] text-[#f2e7d8]/68">
                Truth. Verified. First.
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className={cn(
                  "font-mono text-[12px] uppercase tracking-[0.32em] text-[#f2e7d8]/86 transition-colors hover:text-[#ff8b4d]",
                  isActive(item.path) && "text-[#ff8b4d]"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/archive"
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/10 text-[#f2e7d8]/78 transition-colors hover:border-[#ff8b4d]/50 hover:text-[#ff8b4d] sm:inline-flex"
              aria-label="Search archive"
            >
              <Search className="h-4 w-4" />
            </Link>
            <Link
              to="/auth"
              className="hidden font-mono text-[12px] uppercase tracking-[0.3em] text-[#f2e7d8]/82 transition-colors hover:text-[#f2e7d8] sm:inline-flex"
            >
              Sign In
            </Link>
            <Link
              to="/auth"
              className="inline-flex rounded-sm border border-[#ff8b4d]/70 px-4 py-2 font-mono text-[12px] uppercase tracking-[0.24em] text-[#f2e7d8] transition-colors hover:bg-[#ff8b4d]/10"
            >
              Join Blackfiles
            </Link>

            <button
              onClick={() => setMobileOpen((open) => !open)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-[#f2e7d8]/82 transition-colors hover:border-[#ff8b4d]/45 hover:text-[#ff8b4d] lg:hidden"
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-x-0 top-20 z-40 border-b border-white/8 bg-[#070707]/98 px-4 py-4 text-[#f2e7d8] backdrop-blur-md lg:hidden"
          >
            <div className="mx-auto flex max-w-[1600px] flex-col gap-2">
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "rounded-lg px-4 py-3 font-mono text-[12px] uppercase tracking-[0.32em] transition-colors hover:bg-white/5 hover:text-[#ff8b4d]",
                    isActive(item.path) ? "text-[#ff8b4d]" : "text-[#f2e7d8]/86"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
