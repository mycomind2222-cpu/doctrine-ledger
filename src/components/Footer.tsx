import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { Mail, Linkedin, Twitter } from "lucide-react";

export const Footer = forwardRef<HTMLElement>((_, ref) => {
  return (
    <footer ref={ref} className="border-t border-white/8 bg-[#050505] text-[#f1e5d6]">
      <div className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)_minmax(0,0.7fr)] lg:items-start">
          <div className="space-y-4">
            <div>
              <div className="font-serif text-[28px] font-semibold leading-none tracking-[-0.04em] sm:text-[30px]">
                BLACKFILES
              </div>
              <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.4em] text-[#f1e5d6]/65">
                Truth. Verified. First.
              </div>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-[#f1e5d6]/72">
              Independent investigative briefings on AI-powered fraud, deepfakes, scams, and the systems criminals use to hide in plain sight.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.32em] text-[#ff8b4d]">
                Navigation
              </p>
              <div className="flex flex-col gap-2 text-sm text-[#f1e5d6]/82">
                <Link to="/" className="transition-colors hover:text-[#ff8b4d]">Issues</Link>
                <Link to="/archive" className="transition-colors hover:text-[#ff8b4d]">Archive</Link>
                <Link to="/intel" className="transition-colors hover:text-[#ff8b4d]">Dossiers</Link>
                <Link to="/doctrine" className="transition-colors hover:text-[#ff8b4d]">About</Link>
              </div>
            </div>

            <div>
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.32em] text-[#ff8b4d]">
                Membership
              </p>
              <div className="space-y-2 text-sm text-[#f1e5d6]/72">
                <p>Membership coming soon.</p>
                <Link to="/auth" className="inline-flex text-[#f1e5d6]/84 transition-colors hover:text-[#ff8b4d]">
                  Join the waitlist
                </Link>
              </div>
            </div>
          </div>

          <div>
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.32em] text-[#ff8b4d]">
              Reach
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="/auth" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-[#f1e5d6]/80 transition-colors hover:border-[#ff8b4d]/45 hover:text-[#ff8b4d]" aria-label="Membership">
                <Mail className="h-4 w-4" />
              </a>
              <a href="/intel" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-[#f1e5d6]/80 transition-colors hover:border-[#ff8b4d]/45 hover:text-[#ff8b4d]" aria-label="Intelligence">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="/archive" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-[#f1e5d6]/80 transition-colors hover:border-[#ff8b4d]/45 hover:text-[#ff8b4d]" aria-label="Archive">
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/8 pt-6 text-[11px] uppercase tracking-[0.28em] text-[#f1e5d6]/55 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} BLACKFILES. All rights reserved.</span>
          <div className="flex flex-wrap gap-4">
            <Link to="/privacy" className="transition-colors hover:text-[#ff8b4d]">Privacy</Link>
            <Link to="/terms" className="transition-colors hover:text-[#ff8b4d]">Terms</Link>
            <Link to="/doctrine" className="transition-colors hover:text-[#ff8b4d]">About</Link>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";
