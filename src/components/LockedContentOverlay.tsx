import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth, AccessLevel } from "@/contexts/AuthContext";

interface LockedContentOverlayProps {
  requiredLevel: AccessLevel;
}

export const LockedContentOverlay = ({ requiredLevel }: LockedContentOverlayProps) => {
  const { user } = useAuth();
  
  const levelLabels: Record<AccessLevel, string> = {
    public: 'Public',
    professional: 'Professional',
    restricted: 'Restricted',
  };

  return (
    <div className="content-restricted-overlay">
      <Lock className="w-8 h-8 text-classified" />
      <span className="font-mono text-sm uppercase tracking-widest">
        {levelLabels[requiredLevel]} Access Required
      </span>
      {user ? (
        <p className="text-sm text-muted-foreground text-center max-w-xs">
          Your current access level does not include this content.
          Contact administration to upgrade.
        </p>
      ) : (
        <Link to="/auth">
          <Button variant="classified" size="sm">
            Sign In to Access
          </Button>
        </Link>
      )}
    </div>
  );
};
