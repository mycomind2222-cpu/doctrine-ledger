import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "ISSUES", path: "/" },
  { label: "ARCHIVE", path: "/archive" },
  { label: "DOCTRINE", path: "/doctrine" },
];

export const Header = () => {
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-classified rounded-full animate-pulse-glow" />
              <span className="font-serif text-xl font-bold tracking-tight text-foreground">
                BLACKFILES
              </span>
            </div>
            <span className="classified-stamp hidden sm:flex">
              INTELLIGENCE
            </span>
          </Link>

          <div className="flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "nav-link uppercase",
                  location.pathname === link.path && "active"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
};
