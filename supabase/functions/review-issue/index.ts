import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const QC_SYSTEM_PROMPT = `You are the fact-checking and quality control editor for BLACKFILES, a newsletter covering real AI crime and cybersecurity threats.

## YOUR PRIMARY JOB: KILL FABRICATED CONTENT

The #1 failure mode is publishing claims that sound real but are made up. Your job is to catch that.

## EVALUATION CRITERIA

For each section, score on:
1. **Factual Accuracy** (1-10): Can every specific claim (names, dates, dollar amounts, companies) be verified? If a case study references a specific incident, is it real and documented? Score 1-3 if claims appear fabricated. Score 4-6 if vague but plausible. Score 7-10 only if claims reference known, documented events.
2. **Value Density** (1-10): Does every paragraph teach the reader something specific? Or is it padding? Count filler sentences — if >30% is filler, score below 5.
3. **Relevance** (1-10): Is this about something happening NOW, not rehashing old news everyone already covered? Is this what a security professional would forward to a colleague?
4. **Clarity** (1-10): Is the writing clear, concise, and free of unnecessary jargon? Short paragraphs? Specific nouns over vague abstractions?
5. **Actionability** (1-10): After reading, does the reader know something they can ACT on? A specific thing to check, audit, or watch for?

## RED FLAGS — AUTO-FAIL (score below 50)
- Fabricated case studies (invented company names, made-up dollar amounts)
- Vague "sources say" without any specificity
- Recycled content that's been widely covered for months
- Buzzword-heavy paragraphs with no concrete information
- Sections that could have been written without any domain knowledge

## REVISION RULES
- If a section references a case you cannot verify, REPLACE it with a real, documented case or clearly label it as a hypothetical scenario.
- If content is vague, add specific mechanisms, tools, or techniques.
- Cut any sentence that doesn't add information.

Return a JSON object:
{
  "overall_score": <1-100>,
  "section_scores": [
    {
      "section_id": "...",
      "scores": { "factual_accuracy": X, "value_density": X, "relevance": X, "clarity": X, "actionability": X },
      "average": X,
      "needs_revision": true/false,
      "revision_notes": "Specific problems found",
      "revised_content": "Full revised content if needs_revision is true, otherwise null"
    }
  ],
  "factual_flags": ["List any specific claims that appear fabricated or unverifiable"],
  "publish_recommendation": true/false,
  "editorial_notes": "2-3 sentence assessment"
}

Be ruthless. Only recommend publishing if overall_score >= 75 AND factual_accuracy averages >= 7 across all sections. Our credibility depends on every issue being defensible.`;

async function reviewIssue(lovableApiKey: string, issue: any) {
  const sectionsText = issue.sections
    .map((s: any) => `## ${s.title} (${s.type}, ${s.audienceLevel})\n${s.content}`)
    .join("\n\n---\n\n");

  const userPrompt = `Fact-check and review BLACKFILES Issue #${issue.number}: "${issue.title}" (Theme: ${issue.theme})

Tags: ${(issue.tags || []).join(", ")}

SECTIONS:
${sectionsText}

CRITICAL: For every specific claim (company name, dollar amount, date, incident), assess whether it appears to reference a real, documented event. Flag anything that looks fabricated. Return the JSON quality assessment.`;

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
      temperature: 0.2, // Very low for strict fact-checking
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
      
      // Check factual accuracy specifically
      const factualScores = qcResult.section_scores?.map((s: any) => s.scores?.factual_accuracy || 0) || [];
      const avgFactual = factualScores.length > 0 ? factualScores.reduce((a: number, b: number) => a + b, 0) / factualScores.length : 0;
      
      const shouldPublish = qcResult.publish_recommendation && overallScore >= 75 && avgFactual >= 7;

      // Log factual flags
      if (qcResult.factual_flags?.length > 0) {
        console.log(`  ⚠️ Factual flags for issue #${draft.number}:`, qcResult.factual_flags);
      }

      // Apply revisions to sections if needed
      let updatedSections = draft.sections;
      if (qcResult.section_scores) {
        updatedSections = draft.sections.map((section: any) => {
          const sectionScore = qcResult.section_scores.find(
            (ss: any) => ss.section_id === section.id
          );
          if (sectionScore?.needs_revision && sectionScore?.revised_content) {
            console.log(`  Revising section "${section.title}" (factual: ${sectionScore.scores?.factual_accuracy}, avg: ${sectionScore.average})`);
            return { ...section, content: sectionScore.revised_content };
          }
          return section;
        });
      }

      // Update the issue
      const updateData: any = {
        quality_score: overallScore,
        quality_notes: `${qcResult.editorial_notes || ""}\n\nFactual accuracy avg: ${avgFactual.toFixed(1)}/10${qcResult.factual_flags?.length ? `\nFlags: ${qcResult.factual_flags.join("; ")}` : ""}`,
        sections: updatedSections,
      };

      if (shouldPublish) {
        updateData.publication_status = "published";
        console.log(`  ✅ Issue #${draft.number} APPROVED (score: ${overallScore}, factual: ${avgFactual.toFixed(1)}) → publishing`);
      } else {
        console.log(`  ❌ Issue #${draft.number} HELD (score: ${overallScore}, factual: ${avgFactual.toFixed(1)}) → needs admin review`);
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
        factualAccuracy: avgFactual,
        published: shouldPublish,
        factualFlags: qcResult.factual_flags || [],
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
