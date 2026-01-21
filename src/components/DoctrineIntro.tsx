import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const DoctrineIntro = () => {
  return (
    <section className="py-24 border-y border-border/50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border" />
            <span className="font-mono text-xs uppercase tracking-widest text-classified">
              Core Doctrine
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border" />
          </div>
          
          <blockquote className="font-serif text-2xl md:text-3xl text-foreground leading-relaxed mb-8 text-center">
            "Markets are not discovered—they are engineered. Every trading venue, 
            clearinghouse, and settlement system represents accumulated policy decisions 
            that favor specific actors while obscuring risk transfer to others."
          </blockquote>
          
          <div className="text-center">
            <Link 
              to="/doctrine" 
              className="inline-flex items-center gap-2 text-sm font-medium text-classified hover:underline underline-offset-4"
            >
              Read full doctrine <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
