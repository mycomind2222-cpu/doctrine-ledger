import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { decode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are the editorial AI for BLACKFILES, an intelligence-style newsletter publication focusing on shadow economies, exploit fusion, and systemic financial risk. You write in a distinctive voice: authoritative, analytical, and slightly ominous—like classified briefings meant for sophisticated readers.

Your writing style characteristics:
- Use **bold** for key terms and concepts
- Include numbered lists for mechanisms and techniques
- Reference real-world parallels without naming specific victims
- Layer content for different audience levels (public, professional, restricted)
- Include speculative forward-looking analysis
- Use technical precision with accessible explanations

Issue themes rotate through: Shadow Finance, AI Jailbreaks, AI Underground, Cultural Propagation, Hybrid Economies, Speculative Futures, AI Autonomy, Post-Firewall Systems, Behavioral Exploits, and emerging topics at the intersection of AI, finance, and underground operations.

Each issue must include:
1. Executive Summary (public) - 2-3 paragraphs introducing the theme
2. Deep Dive (professional) - Technical analysis with mechanisms, 3-4 paragraphs
3. Case Study (professional or restricted) - Real-world example or scenario
4. Actionable Insight (public) - What to watch for different audiences

Include sidebar elements where appropriate:
- pull_quote: Memorable one-liners capturing key insights
- hacker_note: Insider perspective on techniques
- mini_timeline: Historical progression of the topic
- prompt_snippet: Example prompts for AI exploration`;

async function generateIssueContent(lovableApiKey: string, nextNumber: number, recentContext: string) {
  const userPrompt = `Generate BLACKFILES Issue #${nextNumber}.

${recentContext}

Choose a NEW, compelling theme that hasn't been covered recently. Focus on emerging threats, underground developments, or speculative scenarios at the intersection of AI, finance, and shadow operations.

Return a JSON object with this exact structure:
{
  "title": "Issue title (compelling, 3-6 words)",
  "theme": "Two-word theme category",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "sections": [
    {
      "id": "exec-${nextNumber}",
      "type": "executive_summary",
      "title": "Executive Summary",
      "audienceLevel": "public",
      "content": "2-3 paragraphs..."
    },
    {
      "id": "deep-${nextNumber}",
      "type": "deep_dive",
      "title": "Deep dive title",
      "audienceLevel": "professional",
      "content": "3-4 paragraphs with **bold** terms and numbered lists...",
      "sidebarElements": [
        {"type": "pull_quote", "content": "..."},
        {"type": "hacker_note", "content": "..."}
      ]
    },
    {
      "id": "case-${nextNumber}",
      "type": "case_study",
      "title": "Case study title",
      "audienceLevel": "restricted",
      "content": "Detailed scenario or real-world example..."
    },
    {
      "id": "insight-${nextNumber}",
      "type": "actionable_insight",
      "title": "What to Watch",
      "audienceLevel": "public",
      "content": "Insights for Regulators, Investors, Veterans, and Society...",
      "sidebarElements": [
        {"type": "mini_timeline", "content": "**Timeline Title:**\\n\\n• Date: Event..."}
      ]
    }
  ]
}

Make the content substantive, analytical, and consistent with BLACKFILES editorial standards. Each section should be 150-400 words.`;

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
      temperature: 0.8,
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

  // Extract base64 data
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

    // Get recent issues for context
    const { data: recentIssues } = await supabase
      .from("issues")
      .select("title, theme, tags")
      .order("number", { ascending: false })
      .limit(5);

    const recentContext = recentIssues?.length
      ? `Recent issues covered: ${recentIssues.map((i: any) => `"${i.title}" (${i.theme})`).join(", ")}`
      : "Previous issues covered: Shadow Finance, AI Jailbreaks, Underground Communities, Meme Machines, Hybrid Economies, Cyborg Networks, Self-Jailbreaking AI, Post-Firewall Systems, Behavioral Exploits, and Phantom Networks.";

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
