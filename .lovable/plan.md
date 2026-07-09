# SEO Traffic Plan

Right now there are 3 failing findings and, more importantly, Google barely knows the site exists. Here's a concrete, ordered plan to actually generate traffic.

## 1. Get indexed (biggest lever, do first)

Without this, on-page SEO doesn't matter — Google isn't crawling.

- Connect **Google Search Console** via the connector, verify `doctrine-ledger.lovable.app` with the META token, and submit `/sitemap.xml`.
- Trigger `URL Inspection → Request Indexing` for the homepage, `/archive`, `/rogue-ai`, `/intel`, and the top 5 intel landing pages.
- Add a **Bing Webmaster** submission note for the user (manual — I can't OAuth Bing).

## 2. Fix the 2 Lighthouse findings (requires republish)

- **Performance (LCP/CLS)**: hero image gets `width`/`height` + `fetchpriority="high"`, remove `loading="lazy"` on the LCP element, add `font-display: swap` to the Google Fonts link (append `&display=swap` — already present, verify), reserve aspect-ratio on issue cover `<img>` tags to kill layout shift.
- **Accessibility (contrast)**: audit `text-muted-foreground/50`, `/60` and arbitrary grays over dark backgrounds; move to solid `text-muted-foreground` / `text-foreground` tokens so body text hits 4.5:1.

## 3. On-page SEO polish

- Rewrite `<title>` and meta description on every route to lead with a **high-intent keyword + year**, e.g. "Deepfake CEO Fraud: Real 2026 Cases & Defenses | BLACKFILES". Titles ≤60 chars, descriptions ≤155.
- Add a single **H1 per page** (audit `/intel/:slug`, `/rogue-ai`, issue pages).
- Add **FAQPage JSON-LD** to any intel page that has a Q&A section (some already have it — extend to all 20).
- Add **Article JSON-LD** with `datePublished`, `dateModified`, `author`, `image` to every issue page.
- Add **BreadcrumbList JSON-LD** on `/intel/:slug` and `/issues/:id`.

## 4. Internal linking (fastest ranking win once indexed)

- Every issue page: auto-link mentioned attack types / industries to the matching `/intel/:slug` page.
- Every `/intel/:slug`: add a "Recent briefings on this topic" block pulling matching issues by tag.
- Homepage: add a compact "Browse by threat" grid linking to the top 8 intel pages (deepfake, voice cloning, prompt injection, etc.) — helps Google discover them and helps humans stay on-site.
- Footer: add links to `/intel`, `/rogue-ai`, `/archive`, `/doctrine` on every page (verify present).

## 5. Content depth (medium-term, actually moves rankings)

- Expand the 20 intel landing pages from 1,000–1,500 words to **2,000–2,500** with a "How the attack works" step-by-step, "Red flags", "How to defend", and a stats box with sourced numbers.
- Add **10 more landing pages** targeting long-tail queries with real search demand — I'll run Semrush `keyword_research` first to pick winners (candidates: "how to spot a deepfake video", "voice cloning scam examples", "AI-generated phishing email examples", "prompt injection example", etc.).
- Add a `lastmod` date to every sitemap entry and update it when content changes.

## 6. Off-page / distribution

Google rewards sites that get clicked and linked. Cheap wins:
- Submit the newsletter to **Substack-style directories**: Feedspot, Detangle, InboxReads, TheSample.
- Post each new issue to **Hacker News**, **r/cybersecurity**, **r/artificial**, **r/OSINT** — real cases + a stat-heavy headline is exactly what those subs upvote.
- Cross-post the Rogue AI Dossier to **LessWrong / AI Alignment Forum** — that community backlinks aggressively.

## 7. Measurement

After GSC is connected I can pull weekly `seo_trend` + GSC impressions to see what's actually working, then double down on the top-performing pages.

---

## Technical details

**Files I'd touch:**
- `index.html` — verify `display=swap`, preload hero
- `src/components/SEO.tsx` — add BreadcrumbList helper, ensure `dateModified`
- `src/pages/LandingPage.tsx` — expand template, add breadcrumb JSON-LD, add "related issues" section
- `src/pages/IssuePage.tsx` — auto-link entities to `/intel/:slug`, add breadcrumb
- `src/pages/Index.tsx` — "Browse by threat" grid
- `src/data/landingPages.ts` — expand each entry's body; add 10 new entries
- `public/sitemap.xml` (or generator script) — add `lastmod`, include new landing pages
- Contrast audit across `Hero.tsx`, `IssueCard.tsx`, `Footer.tsx`

**Order of execution I'd suggest:**
1. Perf + a11y fixes (small) → republish
2. Connect GSC, verify, submit sitemap
3. Internal linking + JSON-LD (medium)
4. Content expansion + new landing pages (largest)

Want me to start with just #1 + #2 (fastest path to first traffic), or the full plan?
