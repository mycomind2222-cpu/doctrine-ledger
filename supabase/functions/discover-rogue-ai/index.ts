import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are a research analyst for BLACKFILES, cataloguing documented cases where AI models or autonomous agents took actions that would be illegal or tortious if a human did them.

STRICT RULES:
- ONLY real, publicly reported incidents. No hypotheticals, no fabrication.
- Every entry MUST include a source_url pointing to primary reporting (major press, court filing, academic paper, or vendor postmortem). If you cannot cite a source, omit the entry.
- Prefer incidents from the last 24 months. Skip anything already widely known unless it's a landmark case with a fresh angle.
- Evidence tiers:
  1 = Real-world incident with named victim/party and documented harm
  2 = Peer-reviewed / red-team / lab finding from credible researchers
  3 = Agentic near-miss, chatbot-gone-wrong, or well-documented mishap without concrete legal harm
- source_type ∈ {press, court, research, vendor, other}
- law_analog: short list of the human-law analogs (e.g. "Fraud", "Defamation", "Unauthorized practice of law", "CFAA", "Wire fraud", "Negligence", "Discrimination", "Trade secret misappropriation").

Return ONLY a JSON array (no prose, no markdown fences) with 5 entries in this exact shape:
[{
  "title": "Concise headline (<=120 chars)",
  "model_or_agent": "Specific model / product name",
  "summary": "2-4 sentence factual summary of what happened",
  "full_writeup": "1-2 paragraph deeper analysis of why this maps to human law",
  "evidence_tier": 1 | 2 | 3,
  "law_analog": ["..."],
  "occurred_on": "YYYY-MM-DD or null if unknown",
  "source_url": "https://...",
  "source_type": "press" | "court" | "research" | "vendor" | "other"
}]`;

async function discover(lovableApiKey: string, existingTitles: string[]) {
  const avoidList = existingTitles.slice(0, 200).map((t) => `- ${t}`).join("\n");
  const userPrompt = `Find 5 NEW documented rogue-AI incidents to add to the dossier.

DO NOT duplicate any of these already-catalogued incidents (match on subject, not exact title):
${avoidList}

Return the JSON array only.`;

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${lovableApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-pro",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.4,
    }),
  });

  if (!res.ok) {
    const t = await res.text();
    if (res.status === 429) throw { status: 429, message: "Rate limit exceeded" };
    if (res.status === 402) throw { status: 402, message: "AI credits exhausted" };
    throw new Error(`AI error ${res.status}: ${t}`);
  }
  const j = await res.json();
  const content: string = j.choices?.[0]?.message?.content ?? "";
  const match =
    content.match(/```json\s*([\s\S]*?)\s*```/) ||
    content.match(/```\s*([\s\S]*?)\s*```/) ||
    [null, content];
  const raw = (match[1] || content).trim();
  const arr = JSON.parse(raw);
  if (!Array.isArray(arr)) throw new Error("AI did not return an array");
  return arr;
}

const norm = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) throw new Error("LOVABLE_API_KEY not configured");

    const supabase = createClient(supabaseUrl, serviceKey);

    const { data: existing, error: fetchErr } = await supabase
      .from("rogue_ai_incidents")
      .select("title, source_url");
    if (fetchErr) throw fetchErr;

    const titles = (existing ?? []).map((r: any) => r.title);
    const seenTitles = new Set(titles.map(norm));
    const seenUrls = new Set(
      (existing ?? [])
        .map((r: any) => (r.source_url ? r.source_url.trim() : ""))
        .filter(Boolean),
    );

    const candidates = await discover(lovableApiKey, titles);

    let inserted = 0;
    const skipped: string[] = [];
    const results: any[] = [];

    for (const c of candidates) {
      if (!c?.title || !c?.model_or_agent || !c?.summary || !c?.source_url) {
        skipped.push(`missing fields: ${c?.title ?? "(no title)"}`);
        continue;
      }
      const tier = Number(c.evidence_tier);
      if (![1, 2, 3].includes(tier)) {
        skipped.push(`bad tier: ${c.title}`);
        continue;
      }
      const nt = norm(c.title);
      if (seenTitles.has(nt) || seenUrls.has(c.source_url.trim())) {
        skipped.push(`duplicate: ${c.title}`);
        continue;
      }

      const row = {
        title: String(c.title).slice(0, 200),
        model_or_agent: String(c.model_or_agent).slice(0, 120),
        summary: String(c.summary),
        full_writeup: c.full_writeup ?? null,
        evidence_tier: tier,
        law_analog: Array.isArray(c.law_analog) ? c.law_analog : [],
        occurred_on: c.occurred_on || null,
        source_url: c.source_url,
        source_type: ["press", "court", "research", "vendor", "other"].includes(
          c.source_type,
        )
          ? c.source_type
          : "other",
      };

      const { error: insErr } = await supabase.from("rogue_ai_incidents").insert(row);
      if (insErr) {
        skipped.push(`insert error (${c.title}): ${insErr.message}`);
        continue;
      }
      seenTitles.add(nt);
      seenUrls.add(row.source_url);
      inserted++;
      results.push({ title: row.title, tier: row.evidence_tier });
    }

    return new Response(
      JSON.stringify({ success: true, inserted, skipped, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err: any) {
    if (err?.status) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: err.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    console.error("discover-rogue-ai error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
