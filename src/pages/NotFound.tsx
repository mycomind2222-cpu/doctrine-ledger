import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <SEO
        title="Page Not Found"
        description="The page you're looking for doesn't exist or has been moved."
        path={location.pathname}
      />
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center px-6">
          <span className="classified-stamp mb-6 inline-flex">ACCESS DENIED</span>
          <h1 className="font-serif text-6xl md:text-8xl font-bold mb-4 text-classified">404</h1>
          <p className="text-xl text-muted-foreground mb-8">
            This document has been redacted or does not exist.
          </p>
          <Link to="/">
            <Button variant="classified" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Return to Index
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFound;
