import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { landingPages } from "@/data/landingPages";

const IntelIndex = () => {
  const grouped = {
    "Attack Type": landingPages.filter((p) => p.category === "Attack Type"),
    Industry: landingPages.filter((p) => p.category === "Industry"),
    Incident: landingPages.filter((p) => p.category === "Incident"),
  };

  return (
    <>
      <SEO
        title="AI Crime Intel: Attack Types, Industries, Incidents"
        description="Reference pages on every major AI-enabled fraud vector, targeted industry, and landmark incident tracked by BLACKFILES."
        path="/intel"
      />
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-6 max-w-5xl">
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12 max-w-2xl"
            >
              <span className="font-mono text-xs uppercase tracking-widest text-classified mb-2 block">
                Intel Library
              </span>
              <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
                AI Crime Intelligence
              </h1>
              <p className="text-muted-foreground">
                Deep reference pages on the attack types, industries, and named incidents that
                define AI-enabled fraud today.
              </p>
            </motion.header>

            {(Object.keys(grouped) as Array<keyof typeof grouped>).map((cat) => (
              <section key={cat} className="mb-14">
                <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">
                  {cat === "Attack Type"
                    ? "Attack Types"
                    : cat === "Industry"
                    ? "Targeted Industries"
                    : "Landmark Incidents"}
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {grouped[cat].map((page) => (
                    <Link
                      key={page.slug}
                      to={`/intel/${page.slug}`}
                      className="group block p-5 border border-border rounded-sm hover:border-classified transition-colors"
                    >
                      <h3 className="font-serif text-lg font-semibold mb-2 group-hover:text-classified transition-colors">
                        {page.h1}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{page.dek}</p>
                      <span className="inline-flex items-center gap-1 text-xs font-mono text-classified opacity-0 group-hover:opacity-100 transition-opacity">
                        READ <ArrowRight className="w-3 h-3" />
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default IntelIndex;
