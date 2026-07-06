import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Shield } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { getLandingPage } from "@/data/landingPages";
import { issues as staticIssues } from "@/data/issues";

// Simple inline formatter: **bold** and paragraph breaks on \n\n
const renderBody = (body: string) => {
  return body.split(/\n\n+/).map((para, i) => {
    const parts = para.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p key={i} className="mb-4 text-foreground/85 leading-relaxed">
        {parts.map((p, j) =>
          p.startsWith("**") && p.endsWith("**") ? (
            <strong key={j} className="text-foreground font-semibold">
              {p.slice(2, -2)}
            </strong>
          ) : (
            <span key={j}>{p}</span>
          )
        )}
      </p>
    );
  });
};

const LandingPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const page = slug ? getLandingPage(slug) : undefined;

  if (!page) {
    return <Navigate to="/intel" replace />;
  }

  const relatedIssues = (page.relatedIssueNumbers || [])
    .map((n) => staticIssues.find((i) => i.number === n))
    .filter(Boolean);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <SEO
        title={page.title}
        description={page.description}
        path={`/intel/${page.slug}`}
        type="article"
        tags={page.keywords}
        jsonLd={faqJsonLd}
      />
      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-24 pb-16">
          <div className="container mx-auto px-6 max-w-4xl">
            {/* Breadcrumb */}
            <nav className="mb-8 flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <Link to="/" className="hover:text-classified transition-colors">
                HOME
              </Link>
              <span>/</span>
              <Link to="/intel" className="hover:text-classified transition-colors">
                INTEL
              </Link>
              <span>/</span>
              <span className="text-foreground/70 uppercase truncate">{page.category}</span>
            </nav>

            {/* Hero */}
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <span className="inline-block font-mono text-[11px] uppercase tracking-widest text-classified mb-3">
                {page.category} Intelligence
              </span>
              <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 leading-tight">
                {page.h1}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">{page.dek}</p>
            </motion.header>

            {/* TL;DR */}
            <motion.aside
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass border-l-2 border-classified p-6 mb-12 rounded-sm"
            >
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-classified" />
                <span className="font-mono text-xs uppercase tracking-widest text-classified">
                  TL;DR
                </span>
              </div>
              <p className="text-foreground/90 leading-relaxed">{page.tldr}</p>
            </motion.aside>

            {/* Sections */}
            <article className="prose-invert max-w-none">
              {page.sections.map((section, idx) => (
                <motion.section
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.4 }}
                  className="mb-10"
                >
                  <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-4 text-foreground">
                    {section.h2}
                  </h2>
                  {renderBody(section.body)}
                </motion.section>
              ))}
            </article>

            {/* FAQ */}
            <section className="mt-16 mb-12">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-6">
                Frequently asked
              </h2>
              <div className="space-y-4">
                {page.faq.map((f, i) => (
                  <div key={i} className="glass p-5 rounded-sm">
                    <h3 className="font-semibold mb-2 text-foreground">{f.q}</h3>
                    <p className="text-muted-foreground leading-relaxed">{f.a}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Related briefings */}
            {relatedIssues.length > 0 && (
              <section className="mb-12 border-t border-border pt-12">
                <span className="font-mono text-xs uppercase tracking-widest text-classified mb-4 block">
                  Related briefings
                </span>
                <h2 className="font-serif text-2xl font-semibold mb-6">
                  Read the full case files
                </h2>
                <div className="grid gap-3">
                  {relatedIssues.map((issue) => issue && (
                    <Link
                      key={issue.number}
                      to={`/issues/${issue.number}`}
                      className="group flex items-center justify-between gap-4 p-4 border border-border rounded-sm hover:border-classified transition-colors"
                    >
                      <div className="min-w-0">
                        <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-widest">
                          Issue {String(issue.number).padStart(2, "0")} · {issue.theme}
                        </span>
                        <p className="font-serif text-lg font-medium mt-1 group-hover:text-classified transition-colors truncate">
                          {issue.title}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-classified group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* CTA */}
            <section className="glass-accent p-8 rounded-sm text-center">
              <h2 className="font-serif text-2xl font-semibold mb-3">
                Every week, one new case file.
              </h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                BLACKFILES tracks how AI is used to commit fraud, run scams, and defeat identity
                systems. Real cases, cited sources, no hype.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button asChild size="lg">
                  <Link to="/archive">
                    Browse all briefings <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/intel">
                    <ArrowLeft className="w-4 h-4 mr-2" /> More intel pages
                  </Link>
                </Button>
              </div>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default LandingPage;
