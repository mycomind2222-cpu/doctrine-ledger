import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Quote } from "lucide-react";

export const DoctrineIntro = () => {
  return (
    <section className="py-20 md:py-28 relative">
      {/* Subtle glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 50% 50%, hsl(var(--classified) / 0.04) 0%, transparent 60%)',
      }} />
      
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <div className="flex items-center gap-3 mb-10">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
            <span className="font-mono text-xs uppercase tracking-widest text-classified flex items-center gap-2">
              <Quote className="w-3 h-3" /> Why This Matters
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>
          
          <div className="glass-card p-8 sm:p-12">
            <blockquote className="font-serif text-xl sm:text-2xl md:text-3xl text-foreground leading-relaxed text-center text-balance">
              "AI doesn't just automate work—it automates crime. Deepfake CEOs ordering wire transfers. 
              AI-generated phishing that's indistinguishable from real email. Voice clones that fool your bank. 
              This is happening now, and most people have no idea."
            </blockquote>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center mt-8"
          >
            <Link 
              to="/doctrine" 
              className="inline-flex items-center gap-2 text-sm font-medium text-classified hover:underline underline-offset-4 transition-all group"
            >
              Read our analytical framework <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
