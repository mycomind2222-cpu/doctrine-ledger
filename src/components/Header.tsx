import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogIn, LogOut, User, Shield, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { AccessBadge } from "./AccessBadge";

const navLinks = [
  { label: "ISSUES", path: "/" },
  { label: "ARCHIVE", path: "/archive" },
  { label: "DOCTRINE", path: "/doctrine" },
];

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, accessLevel, isAdmin, signOut, loading } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

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

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-8">
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
            
            {/* Auth section */}
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <AccessBadge level={accessLevel} />
                    </div>
                    {isAdmin && (
                      <Link to="/admin">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2 text-primary hover:text-primary"
                        >
                          <Shield className="w-4 h-4" />
                          <span className="hidden sm:inline">Admin</span>
                        </Button>
                      </Link>
                    )}
                    <Link to="/account">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 text-muted-foreground hover:text-foreground"
                      >
                        <Settings className="w-4 h-4" />
                        <span className="hidden sm:inline">Account</span>
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSignOut}
                      className="gap-2 text-muted-foreground hover:text-foreground"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="hidden sm:inline">Sign Out</span>
                    </Button>
                  </div>
                ) : (
                  <Link to="/auth">
                    <Button variant="classified" size="sm" className="gap-2">
                      <LogIn className="w-4 h-4" />
                      <span className="hidden sm:inline">Sign In</span>
                    </Button>
                  </Link>
                )}
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};
