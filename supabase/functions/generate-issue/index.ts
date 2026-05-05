import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { decode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are the editorial AI for BLACKFILES, a weekly newsletter covering how AI is used in real-world crime, fraud, scams, and cybersecurity threats.

## CORE EDITORIAL RULES — NON-NEGOTIABLE

1. **100% FACTUAL**: Every claim must be based on real, documented events, research papers, law enforcement reports, or credible news sources. NEVER fabricate cases, statistics, dollar amounts, or scenarios.
2. **SOURCE-BACKED**: Reference real incidents by name — real companies breached, real scams prosecuted, real tools exploited. Include approximate dates and sources when possible.
3. **NO SPECULATION DISGUISED AS FACT**: You may include a clearly-labeled "What to Watch" section with forward-looking analysis, but it must be grounded in observable trends, not fiction.
4. **NO BUZZWORD FILLER**: Every sentence must earn its place. Cut jargon that doesn't add meaning. Replace vague claims with specific mechanisms.

## NEWSLETTER STRUCTURE (modeled after Morning Brew / TLDR / The Hustle)

The format follows what the most-read newsletters do:
- **Open with a TL;DR** that hooks the reader in 2-3 sentences
- **Lead with the biggest story** — the one thing everyone should know this week
- **Follow with 2-3 shorter stories** — quick hits with real details
- **Close with actionable takeaways** — what readers should actually do or watch for

## WRITING STYLE

- Clear, direct, and concise. No unnecessary adjectives.
- Write at a smart-but-accessible level — like explaining to a sharp friend over coffee.
- Use **bold** for key names, numbers, and concepts.
- Short paragraphs (2-3 sentences max).
- Include real numbers: dollar amounts, victim counts, timeframes, conviction details.
- Tone: Authoritative and urgent, but not sensational. Think investigative journalism, not tabloid.`;

async function generateIssueContent(lovableApiKey: string, nextNumber: number, recentContext: string) {
  const userPrompt = `Generate BLACKFILES Issue #${nextNumber}.

${recentContext}

IMPORTANT INSTRUCTIONS:
- Research and write about REAL AI crime events, fraud cases, and cybersecurity incidents from the past 1-2 months.
- Every case study must reference a real, documented incident — real company names, real dollar amounts, real dates.
- If you cannot verify a specific detail, say "reportedly" or "according to [source type]" — do NOT invent specifics.
- Choose a theme that is genuinely trending in AI crime right now (deepfake fraud, voice cloning scams, AI-generated phishing, LLM jailbreaks used in attacks, AI-powered romance scams, etc.)

Return a JSON object with this exact structure:
{
  "title": "Specific, concrete headline (e.g. 'Voice Clones Stole $25M From 3 Banks This Month')",
  "theme": "Two-word theme category",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "sections": [
    {
      "id": "tldr-${nextNumber}",
      "type": "executive_summary",
      "title": "TL;DR",
      "audienceLevel": "public",
      "content": "2-3 sentence hook that summarizes the biggest story this week. Concrete nouns, real stakes. This is what makes someone keep reading or bounce."
    },
    {
      "id": "lead-${nextNumber}",
      "type": "deep_dive",
      "title": "Descriptive title for the lead story",
      "audienceLevel": "public",
      "content": "The main story. 300-500 words. Start with WHAT HAPPENED (specific incident). Then HOW IT WORKS (the mechanism). Then WHY IT MATTERS (scale, implications). Use **bold** for key facts. Include real names, dates, and dollar amounts where documented. Short paragraphs.",
      "sidebarElements": [
        {"type": "pull_quote", "content": "One striking fact or quote from the story"}
      ]
    },
    {
      "id": "stories-${nextNumber}",
      "type": "case_study",
      "title": "More This Week",
      "audienceLevel": "public",
      "content": "2-3 shorter stories, each 80-120 words. Format each as a bold subheading followed by a tight paragraph. Real incidents only. Cover different angles of AI crime (e.g., one fraud case, one cybersecurity vulnerability, one regulatory action)."
    },
    {
      "id": "watch-${nextNumber}",
      "type": "actionable_insight",
      "title": "What to Watch",
      "audienceLevel": "public",
      "content": "3-4 bullet points of actionable takeaways. What should individuals protect against? What should businesses audit? What regulatory moves are coming? Ground each point in a real trend or data point.",
      "sidebarElements": [
        {"type": "mini_timeline", "content": "**Key dates this month:**\\n\\n• Date: Event..."}
      ]
    }
  ]
}

QUALITY BAR: This issue will be read by security researchers, journalists, and professionals. Every fact must be defensible. If a reader Googles any claim, it should check out. Write something genuinely worth reading — not content-farm filler.`;

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
      temperature: 0.4, // Lower temperature for factual accuracy
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("AI gateway error:", response.status, errorText);
    if (response.status === 429) throw { status: 429, message: "Rate limit exceeded. Try again later." };
    if (response.status === 402) throw { status: 402, message: "AI credits exhausted. Please add credits." };
    throw new Error(`AI gateway error: ${response.status}`);
  }

  const aiResponse = await response.json();
  const content = aiResponse.choices?.[0]?.message?.content;
  if (!content) throw new Error("No content generated from AI");

  console.log("Raw AI response:", content.substring(0, 500));

  const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) ||
                    content.match(/```\s*([\s\S]*?)\s*```/) ||
                    [null, content];
  const jsonStr = jsonMatch[1] || content;
  return JSON.parse(jsonStr.trim());
}

async function generateCoverImage(lovableApiKey: string, title: string, theme: string) {
  const imagePrompt = `Dark cyberpunk intelligence magazine cover for "${title}" themed around "${theme}". Teal and deep blue background with glowing orange circuit-board accents. Abstract digital visualization with data streams, neural networks, and encrypted symbols. Moody, high-contrast, cinematic lighting. No text or letters. Ultra high resolution.`;

  console.log("Generating cover image...");

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${lovableApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash-image",
      messages: [{ role: "user", content: imagePrompt }],
      modalities: ["image", "text"],
    }),
  });

  if (!response.ok) {
    console.error("Image generation failed:", response.status);
    return null;
  }

  const data = await response.json();
  const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

  if (!imageUrl || !imageUrl.startsWith("data:image")) {
    console.error("No valid image in response");
    return null;
  }

  const base64Data = imageUrl.split(",")[1];
  return decode(base64Data);
}

async function uploadCoverImage(supabase: any, imageBytes: Uint8Array, issueNumber: number): Promise<string | null> {
  const fileName = `issue-${String(issueNumber).padStart(2, "0")}.png`;

  const { error } = await supabase.storage
    .from("issue-covers")
    .upload(fileName, imageBytes, {
      contentType: "image/png",
      upsert: true,
    });

  if (error) {
    console.error("Upload error:", error);
    return null;
  }

  const { data: urlData } = supabase.storage
    .from("issue-covers")
    .getPublicUrl(fileName);

  console.log("Cover uploaded:", urlData.publicUrl);
  return urlData.publicUrl;
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

    // Get next issue number
    const { data: lastIssue } = await supabase
      .from("issues")
      .select("number")
      .order("number", { ascending: false })
      .limit(1)
      .single();

    const nextNumber = lastIssue ? lastIssue.number + 1 : 11;

    // Get recent issues for context (to avoid repeating topics)
    const { data: recentIssues } = await supabase
      .from("issues")
      .select("title, theme, tags")
      .order("number", { ascending: false })
      .limit(5);

    const recentContext = recentIssues?.length
      ? `Recent issues already covered (DO NOT repeat these topics): ${recentIssues.map((i: any) => `"${i.title}" (${i.theme})`).join(", ")}`
      : "This is among the first dynamically generated issues. Cover a major, well-documented AI crime trend.";

    console.log(`Generating issue #${nextNumber}...`);

    // Generate content
    let issueData;
    try {
      issueData = await generateIssueContent(lovableApiKey, nextNumber, recentContext);
    } catch (err: any) {
      if (err.status) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: err.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw err;
    }

    // Generate and upload cover image (non-blocking failure)
    let coverImageUrl: string | null = null;
    try {
      const imageBytes = await generateCoverImage(lovableApiKey, issueData.title, issueData.theme);
      if (imageBytes) {
        coverImageUrl = await uploadCoverImage(supabase, imageBytes, nextNumber);
      }
    } catch (imgErr) {
      console.error("Cover image generation failed (non-fatal):", imgErr);
    }

    // Calculate publish date
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilMonday = dayOfWeek === 0 ? 1 : dayOfWeek === 1 ? 0 : 8 - dayOfWeek;
    const publishDate = new Date(today);
    publishDate.setDate(today.getDate() + daysUntilMonday);
    const publishDateStr = publishDate.toISOString().split("T")[0];

    // Insert the new issue
    const { data: newIssue, error: insertError } = await supabase
      .from("issues")
      .insert({
        number: nextNumber,
        title: issueData.title,
        theme: issueData.theme,
        publication_status: "draft",
        publish_date: publishDateStr,
        tags: issueData.tags || [],
        sections: issueData.sections || [],
        generated_by: "ai",
        cover_image: coverImageUrl,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      throw new Error(`Failed to save issue: ${insertError.message}`);
    }

    console.log(`Successfully generated issue #${nextNumber}: ${issueData.title} (cover: ${coverImageUrl ? "yes" : "no"})`);

    return new Response(
      JSON.stringify({
        success: true,
        issue: {
          number: nextNumber,
          title: issueData.title,
          theme: issueData.theme,
          publishDate: publishDateStr,
          id: newIssue.id,
          hasCover: !!coverImageUrl,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("generate-issue error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
