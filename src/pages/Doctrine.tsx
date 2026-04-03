import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";

const doctrineStatements = [
  {
    number: "001",
    title: "On Market Architecture",
    content: "Markets are not discovered—they are engineered. Every trading venue, clearinghouse, and settlement system represents accumulated policy decisions that favor specific actors while obscuring risk transfer to others. The appearance of neutrality conceals designed outcomes.",
  },
  {
    number: "002",
    title: "On Information Asymmetry",
    content: "Information advantage is the fundamental currency of financial power. Those who structure markets also structure the flow of information about those markets. Transparency is selective, revealing what serves and concealing what protects.",
  },
  {
    number: "003",
    title: "On Systemic Opacity",
    content: "Complexity serves power. The labyrinthine structures of modern finance—derivative chains, offshore entities, synthetic instruments—are not accidental. They are designed to fragment accountability and distribute consequence while concentrating benefit.",
  },
  {
    number: "004",
    title: "On Risk Transfer",
    content: "Risk does not disappear; it transfers. Every financial innovation that appears to reduce risk for one party necessarily increases it for another. The question is never whether risk exists, but where it has been hidden and upon whom it will ultimately fall.",
  },
  {
    number: "005",
    title: "On Regulatory Capture",
    content: "Those who write the rules play by different rules. Regulatory frameworks, regardless of stated intent, evolve to serve the interests of the regulated. The distance between rule-maker and rule-taker shrinks until the distinction becomes academic.",
  },
  {
    number: "006",
    title: "On Crisis as Opportunity",
    content: "Crisis is not failure of the system—it is function of the system. Moments of instability enable transfers of wealth, restructuring of power, and implementation of policies that would otherwise face resistance. Preparation for crisis is preparation to benefit from it.",
  },
  {
    number: "007",
    title: "On Technical Convergence",
    content: "The distinction between cyber and financial threat is artificial. Digital infrastructure is financial infrastructure. Those who can manipulate one can manipulate the other. Defense requires understanding both domains as a single surface.",
  },
  {
    number: "008",
    title: "On Narrative Control",
    content: "Markets are moved by stories before they are moved by facts. The power to define what constitutes legitimate analysis, credible sources, and acceptable discourse shapes outcomes as surely as capital flows. Control the narrative, control the market.",
  },
];

const Doctrine = () => {
  return (
    <>
      <SEO
        title="Doctrine — How We Analyze AI Crime & Emerging Threats"
        description="The analytical framework behind BLACKFILES. How we identify, verify, and break down AI-powered fraud, deepfakes, and cybercrime for a general audience."
        path="/doctrine"
      />
      <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <div className="mb-8">
              <span className="classified-stamp">
                FOUNDATIONAL FRAMEWORK
              </span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              The Doctrine
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Core analytical principles guiding BLACKFILES intelligence production. 
              These doctrines represent accumulated insight from systematic analysis 
              of shadow economies and systemic risk.
            </p>
          </motion.header>
          
          {/* Doctrine statements */}
          <div className="max-w-3xl mx-auto">
            {doctrineStatements.map((doctrine, index) => (
              <motion.article
                key={doctrine.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="mb-16 last:mb-0"
              >
                <div className="flex items-center gap-4 mb-6">
                  <span className="font-mono text-sm text-classified">
                    DOCTRINE {doctrine.number}
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>
                
                <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-6">
                  {doctrine.title}
                </h2>
                
                <blockquote className="text-lg text-muted-foreground leading-relaxed pl-6 border-l-2 border-classified">
                  {doctrine.content}
                </blockquote>
              </motion.article>
            ))}
          </div>
          
          {/* Closing */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto mt-24 pt-12 border-t border-border/50 text-center"
          >
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              End of Doctrine — Document Classification: General Distribution
            </span>
          </motion.div>
        </div>
      </main>
      
      <Footer />
      </div>
    </>
  );
};

export default Doctrine;
