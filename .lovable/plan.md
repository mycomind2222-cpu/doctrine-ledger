
# Plan: Rogue AI — Autonomous Lawbreaking Coverage

A new content pillar showcasing cases where LLMs and AI agents took actions that would be illegal if a human did them. Two surfaces: a recurring section in every weekly issue, and a permanent dossier page that catalogs every documented incident over time.

## 1. Editorial scope

Three accepted evidence tiers, every entry must declare which tier it belongs to:

- **Tier 1 — Real-world incidents**: press-reported, court-filed, or vendor-disclosed (e.g. Replit agent wiping a production database, autonomous trading bots flagged for spoofing, agent-driven account takeovers).
- **Tier 2 — Red-team / lab findings**: peer-reviewed or vendor-published research where models autonomously chose deception, blackmail, exfiltration, or sabotage in controlled tests (Anthropic agentic-misalignment, Apollo Research scheming evals, METR autonomy reports).
- **Tier 3 — Agentic near-miss**: documented behavior a human would be prosecuted for (unauthorized access, fraud, market manipulation, CSAM-adjacent generation) where no charges were filed because the legal framework doesn't yet apply to the model.

Hard rules: real cases only, no invented incidents, every entry tagged with its evidence tier, source type, and the human-law analog it would map to.

## 2. New recurring section in every issue — "Rogue AI Watch"

Added to the standard weekly structure:

```text
TL;DR  →  Lead Story  →  More This Week  →  Rogue AI Watch  →  What to Watch
```

Each Rogue AI Watch entry is short and scannable:

- **Incident**: what the model/agent did, in one sentence
- **The human-law analog**: what statute a person would be charged under (e.g. CFAA unauthorized access, wire fraud, market manipulation, destruction of property)
- **Evidence tier**: Tier 1/2/3 + source
- **Why it's not (yet) a crime**: jurisdiction gap, no mens rea, operator liability unclear, etc.

Target: 1–2 incidents per issue, ~120 words each.

## 3. New permanent page — "Rogue AI Dossier" at `/rogue-ai`

A standalone catalog that grows over time. Filterable, linkable, and SEO-targeted ("AI agent crimes", "LLM autonomous lawbreaking", "rogue AI incidents").

Page layout:

- Hero strip explaining the premise in two sentences
- Filter chips: All | Real Incidents | Lab Findings | Near-Miss | by law analog (CFAA, fraud, market abuse, privacy, IP)
- Card grid — each card shows model/agent name, one-line incident, tier badge, law-analog tag, date, source link
- Card click → dedicated detail view with full write-up, mapped to the issue it appeared in (if any)

## 4. Data model

New table `rogue_ai_incidents` with fields for: title, model_or_agent, summary, full_writeup (markdown), evidence_tier (1/2/3), law_analog (text[]), occurred_on (date), source_url, source_type (press/court/research/vendor), related_issue_number (nullable), created_at. Public read; admin-only write. No new auth surface needed — reuses existing `is_admin` model.

A second optional column on `issues.sections` simply embeds the Rogue AI Watch content as another section type (`rogue_ai_watch`), so the existing rendering pipeline picks it up with no schema change to issues.

## 5. Generation + QC pipeline updates

- **`generate-issue`**: extend `SYSTEM_PROMPT` and the JSON output spec to require a `rogue_ai_watch` section with 1–2 entries, each carrying `evidence_tier`, `law_analog`, and `source_hint`. Prompt explicitly forbids invented incidents and requires referencing a real, named model/agent.
- **`review-issue`**: add a dedicated check that flags any Rogue AI Watch entry missing a verifiable source or evidence tier. Auto-fail if the entry can't name a real model, vendor, or research group.
- After publish, the QC function also writes each accepted Rogue AI entry into `rogue_ai_incidents` so the dossier auto-grows from every weekly issue. Admin can still add historical entries manually via `/admin`.

## 6. Surfacing on the rest of the site

- Header nav: add "Rogue AI" link
- Homepage: small teaser strip below QuickTakes — "Latest from the Rogue AI Dossier" with the 3 most recent incidents
- Issue page: the in-issue Rogue AI Watch section gets a "See full dossier →" link
- Sitemap + JSON-LD: include `/rogue-ai` and each incident detail route

## 7. Visual treatment

Reuses existing dark cyberpunk tokens. Each tier gets a tag color from the existing palette (no new colors): Tier 1 uses the `#ff4d4f` accent, Tier 2 uses muted teal, Tier 3 uses muted amber. No humans, no robots, no neon — same imagery constraints as the rest of the site.

## 8. Out of scope

- No reader-submitted incidents (admin-curated only, to protect factual accuracy)
- No paywall on the dossier — stays 100% free under the current retention model
- No comments/voting on individual incidents in v1 (issue-level voting still applies)

## Technical summary

- DB: new `rogue_ai_incidents` table with RLS (public read, admin write); new `sections.type = "rogue_ai_watch"` convention
- Edge functions: `generate-issue` and `review-issue` updated for the new section + auto-insert into dossier
- Frontend: new `/rogue-ai` route + detail route, new card component, header nav entry, homepage teaser, sitemap entries
- Memory: add `mem://content/rogue-ai-pillar` documenting the editorial rules and tier system
