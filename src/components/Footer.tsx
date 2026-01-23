import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-background-secondary">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-classified rounded-full" />
              <span className="font-serif text-lg font-bold">BLACKFILES</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Doctrine-driven intelligence publication analyzing shadow economies, 
              exploit fusion, and systemic financial risk.
            </p>
          </div>
          
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">
              Access Levels
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="badge-public">PUBLIC</span>
                <span className="text-muted-foreground">Open access</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="badge-professional">PROFESSIONAL</span>
                <span className="text-muted-foreground">Verified analysts</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="badge-restricted">RESTRICTED</span>
                <span className="text-muted-foreground">By invitation</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">
              Legal
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">
              Protocol
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              No advertising. No social features. No comments. 
              Content-first intelligence distribution.
            </p>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground font-mono">
            © {new Date().getFullYear()} BLACKFILES. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground font-mono">
            DOCUMENT CLASSIFICATION: GENERAL DISTRIBUTION
          </p>
        </div>
      </div>
    </footer>
  );
};
