import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Zap } from "lucide-react";
import { type Issue } from "@/data/issues";

interface QuickTakesProps {
  issues: Issue[];
}

export const QuickTakes = ({ issues }: QuickTakesProps) => {
  // Extract the first sentence from the executive summary of each issue
  const takes = issues.slice(0, 5).map(issue => {
    const execSummary = issue.sections.find(s => s.type === 'executive_summary');
    const content = execSummary?.content || issue.sections[0]?.content || '';
    const firstSentence = content.split(/(?<=[.!?])\s+/)[0] || content.slice(0, 120);
    return {
      number: issue.number,
      title: issue.title,
      theme: issue.theme,
      take: firstSentence,
    };
  });

  if (takes.length === 0) return null;

  return (
    <section className="py-8 md:py-10 border-t border-border/30">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-2 mb-6">
          <Zap className="w-4 h-4 text-classified" />
          <h2 className="font-serif text-xl sm:text-2xl font-bold">Quick Takes</h2>
        </div>

        <div className="space-y-4">
          {takes.map((take, i) => (
            <motion.div
              key={take.number}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <Link
                to={`/issues/${take.number}`}
                className="group flex gap-4 p-4 rounded-xl bg-secondary/20 hover:bg-secondary/40 border border-border/20 hover:border-classified/30 transition-all duration-300"
              >
                <span className="font-mono text-classified text-sm font-bold mt-0.5 shrink-0">
                  #{String(take.number).padStart(2, '0')}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-classified/70 block mb-1">
                    {take.theme}
                  </span>
                  <p className="text-sm text-foreground/90 leading-relaxed">
                    {take.take}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
