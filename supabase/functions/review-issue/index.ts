import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const QC_SYSTEM_PROMPT = `You are the quality control editor for BLACKFILES, an intelligence-style newsletter. Your job is to review draft issues and evaluate them against strict editorial standards.

You must evaluate each section on these criteria:
1. **Substance** (1-10): Does it contain real analytical value, not just buzzwords?
2. **Originality** (1-10): Is the angle fresh and non-obvious?
3. **Specificity** (1-10): Does it include concrete mechanisms, examples, or data points rather than vague generalities?
4. **Voice Consistency** (1-10): Does it match the BLACKFILES tone—authoritative, analytical, slightly ominous?
5. **Actionability** (1-10): Does it give the reader something they can actually use or watch for?

For each section that scores below 7 in any category, provide a REVISED version that meets the standard.

Return a JSON object:
{
  "overall_score": <1-100>,
  "section_scores": [
    {
      "section_id": "...",
      "scores": { "substance": X, "originality": X, "specificity": X, "voice": X, "actionability": X },
      "average": X,
      "needs_revision": true/false,
      "revision_notes": "What's wrong and why",
      "revised_content": "Full revised content if needs_revision is true, otherwise null"
    }
  ],
  "publish_recommendation": true/false,
  "editorial_notes": "Overall assessment in 2-3 sentences"
}

Be ruthless. Only recommend publishing if overall_score >= 70. BLACKFILES readers expect cutting-edge intelligence, not filler.`;

async function reviewIssue(lovableApiKey: string, issue: any) {
  const sectionsText = issue.sections
    .map((s: any) => `## ${s.title} (${s.type}, ${s.audienceLevel})\n${s.content}`)
    .join("\n\n---\n\n");

  const userPrompt = `Review BLACKFILES Issue #${issue.number}: "${issue.title}" (Theme: ${issue.theme})

Tags: ${(issue.tags || []).join(", ")}

SECTIONS:
${sectionsText}

Evaluate rigorously and return the JSON quality assessment.`;

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${lovableApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-pro",
      messages: [
        { role: "system", content: QC_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("QC AI error:", response.status, errorText);
    if (response.status === 429) throw { status: 429, message: "Rate limit exceeded" };
    if (response.status === 402) throw { status: 402, message: "AI credits exhausted" };
    throw new Error(`QC AI error: ${response.status}`);
  }

  const aiResponse = await response.json();
  const content = aiResponse.choices?.[0]?.message?.content;
  if (!content) throw new Error("No QC response generated");

  const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) ||
                    content.match(/```\s*([\s\S]*?)\s*```/) ||
                    [null, content];
  const jsonStr = jsonMatch[1] || content;
  return JSON.parse(jsonStr.trim());
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");

    if (!lovableApiKey) throw new Error("LOVABLE_API_KEY is not configured");

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch all unreviewed draft issues (no quality_score yet)
    const { data: drafts, error: fetchError } = await supabase
      .from("issues")
      .select("*")
      .eq("publication_status", "draft")
      .is("quality_score", null)
      .order("number", { ascending: true });

    if (fetchError) throw new Error(`Failed to fetch drafts: ${fetchError.message}`);

    if (!drafts || drafts.length === 0) {
      console.log("No unreviewed drafts found.");
      return new Response(
        JSON.stringify({ success: true, message: "No drafts to review", reviewed: 0, published: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Found ${drafts.length} unreviewed draft(s)`);

    const results = [];

    for (const draft of drafts) {
      console.log(`Reviewing issue #${draft.number}: "${draft.title}"...`);

      let qcResult;
      try {
        qcResult = await reviewIssue(lovableApiKey, draft);
      } catch (err: any) {
        if (err.status) {
          return new Response(JSON.stringify({ error: err.message }), {
            status: err.status,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        console.error(`QC failed for issue #${draft.number}:`, err);
        results.push({ number: draft.number, status: "qc_error", error: String(err) });
        continue;
      }

      const overallScore = qcResult.overall_score;
      const shouldPublish = qcResult.publish_recommendation && overallScore >= 70;

      // Apply revisions to sections if needed
      let updatedSections = draft.sections;
      if (qcResult.section_scores) {
        updatedSections = draft.sections.map((section: any) => {
          const sectionScore = qcResult.section_scores.find(
            (ss: any) => ss.section_id === section.id
          );
          if (sectionScore?.needs_revision && sectionScore?.revised_content) {
            console.log(`  Revising section "${section.title}" (avg: ${sectionScore.average})`);
            return { ...section, content: sectionScore.revised_content };
          }
          return section;
        });
      }

      // Update the issue
      const updateData: any = {
        quality_score: overallScore,
        quality_notes: qcResult.editorial_notes || null,
        sections: updatedSections,
      };

      if (shouldPublish) {
        updateData.publication_status = "published";
        console.log(`  Issue #${draft.number} APPROVED (score: ${overallScore}) → publishing`);
      } else {
        console.log(`  Issue #${draft.number} HELD (score: ${overallScore}) → needs admin review`);
      }

      const { error: updateError } = await supabase
        .from("issues")
        .update(updateData)
        .eq("id", draft.id);

      if (updateError) {
        console.error(`Update failed for issue #${draft.number}:`, updateError);
        results.push({ number: draft.number, status: "update_error" });
        continue;
      }

      results.push({
        number: draft.number,
        title: draft.title,
        score: overallScore,
        published: shouldPublish,
        revisedSections: qcResult.section_scores?.filter((s: any) => s.needs_revision).length || 0,
        notes: qcResult.editorial_notes,
      });
    }

    const published = results.filter((r: any) => r.published).length;
    console.log(`QC complete. Reviewed: ${results.length}, Published: ${published}`);

    return new Response(
      JSON.stringify({ success: true, reviewed: results.length, published, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("review-issue error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
