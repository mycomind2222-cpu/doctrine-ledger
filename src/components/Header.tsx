import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogIn, LogOut, User, Shield, Settings, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { AccessBadge } from "./AccessBadge";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "ISSUES", path: "/" },
  { label: "ARCHIVE", path: "/archive" },
  { label: "DOCTRINE", path: "/doctrine" },
];

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, accessLevel, isAdmin, signOut, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass-strong">
        <div className="container mx-auto px-4 sm:px-6 py-3">
          <nav className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-3 h-3 bg-classified rounded-full" />
                  <div className="absolute inset-0 w-3 h-3 bg-classified rounded-full animate-ping opacity-30" />
                </div>
                <span className="font-serif text-xl font-bold tracking-tight text-foreground">
                  BLACKFILES
                </span>
              </div>
              <span className="classified-stamp hidden sm:flex">
                INTELLIGENCE
              </span>
            </Link>

            <div className="flex items-center gap-4">
              {/* Desktop nav */}
              <div className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      "nav-link uppercase px-4 py-2 rounded-lg transition-all",
                      location.pathname === link.path && "active bg-primary/10"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              
              {/* Auth section */}
              {!loading && (
                <>
                  {user ? (
                    <div className="flex items-center gap-2">
                      <div className="hidden lg:flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <AccessBadge level={accessLevel} />
                      </div>
                      {isAdmin && (
                        <Link to="/admin">
                          <Button variant="ghost" size="sm" className="gap-2 text-primary hover:text-primary hover:bg-primary/10 rounded-lg">
                            <Shield className="w-4 h-4" />
                            <span className="hidden sm:inline">Admin</span>
                          </Button>
                        </Link>
                      )}
                      <Link to="/account">
                        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg">
                          <Settings className="w-4 h-4" />
                          <span className="hidden lg:inline">Account</span>
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg">
                        <LogOut className="w-4 h-4" />
                        <span className="hidden lg:inline">Sign Out</span>
                      </Button>
                    </div>
                  ) : (
                    <Link to="/auth">
                      <Button variant="classified" size="sm" className="gap-2 rounded-lg">
                        <LogIn className="w-4 h-4" />
                        <span className="hidden sm:inline">Sign In</span>
                      </Button>
                    </Link>
                  )}
                </>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile nav overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[57px] left-0 right-0 z-40 glass-strong p-4 md:hidden"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "nav-link uppercase px-4 py-3 rounded-lg text-base",
                    location.pathname === link.path && "active bg-primary/10"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
