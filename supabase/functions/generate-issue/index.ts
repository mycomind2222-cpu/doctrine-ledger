 import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
 import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
 
 const corsHeaders = {
   "Access-Control-Allow-Origin": "*",
   "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
 };
 
 // BLACKFILES editorial voice and structure
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
 
 serve(async (req) => {
   if (req.method === "OPTIONS") {
     return new Response(null, { headers: corsHeaders });
   }
 
   try {
     const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
     const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
     const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
 
     if (!lovableApiKey) {
       throw new Error("LOVABLE_API_KEY is not configured");
     }
 
     const supabase = createClient(supabaseUrl, supabaseServiceKey);
 
     // Get the next issue number
     const { data: lastIssue } = await supabase
       .from("issues")
       .select("number")
       .order("number", { ascending: false })
       .limit(1)
       .single();
 
     const nextNumber = lastIssue ? lastIssue.number + 1 : 11; // Start after existing static issues
 
     // Get recent issues for context
     const { data: recentIssues } = await supabase
       .from("issues")
       .select("title, theme, tags")
       .order("number", { ascending: false })
       .limit(5);
 
     const recentContext = recentIssues?.length 
       ? `Recent issues covered: ${recentIssues.map(i => `"${i.title}" (${i.theme})`).join(", ")}`
       : "Previous issues covered: Shadow Finance, AI Jailbreaks, Underground Communities, Meme Machines, Hybrid Economies, Cyborg Networks, Self-Jailbreaking AI, Post-Firewall Systems, Behavioral Exploits, and Phantom Networks.";
 
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
 
     console.log(`Generating issue #${nextNumber}...`);
 
     // Call Lovable AI
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
       
       if (response.status === 429) {
         return new Response(JSON.stringify({ error: "Rate limit exceeded. Try again later." }), {
           status: 429,
           headers: { ...corsHeaders, "Content-Type": "application/json" },
         });
       }
       if (response.status === 402) {
         return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
           status: 402,
           headers: { ...corsHeaders, "Content-Type": "application/json" },
         });
       }
       throw new Error(`AI gateway error: ${response.status}`);
     }
 
     const aiResponse = await response.json();
     const content = aiResponse.choices?.[0]?.message?.content;
 
     if (!content) {
       throw new Error("No content generated from AI");
     }
 
     console.log("Raw AI response:", content.substring(0, 500));
 
     // Parse JSON from response (handle markdown code blocks)
     let issueData;
     try {
       const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || 
                         content.match(/```\s*([\s\S]*?)\s*```/) ||
                         [null, content];
       const jsonStr = jsonMatch[1] || content;
       issueData = JSON.parse(jsonStr.trim());
     } catch (parseError) {
       console.error("Failed to parse AI response:", parseError);
       throw new Error("Failed to parse generated issue content");
     }
 
     // Calculate publish date (next Monday if today isn't Monday, otherwise today)
     const today = new Date();
     const dayOfWeek = today.getDay();
     const daysUntilMonday = dayOfWeek === 0 ? 1 : dayOfWeek === 1 ? 0 : 8 - dayOfWeek;
     const publishDate = new Date(today);
     publishDate.setDate(today.getDate() + daysUntilMonday);
     const publishDateStr = publishDate.toISOString().split('T')[0];
 
     // Insert the new issue
     const { data: newIssue, error: insertError } = await supabase
       .from("issues")
       .insert({
         number: nextNumber,
         title: issueData.title,
         theme: issueData.theme,
         publication_status: "draft", // Start as draft, admin can publish
         publish_date: publishDateStr,
         tags: issueData.tags || [],
         sections: issueData.sections || [],
         generated_by: "ai",
       })
       .select()
       .single();
 
     if (insertError) {
       console.error("Insert error:", insertError);
       throw new Error(`Failed to save issue: ${insertError.message}`);
     }
 
     console.log(`Successfully generated issue #${nextNumber}: ${issueData.title}`);
 
     return new Response(
       JSON.stringify({
         success: true,
         issue: {
           number: nextNumber,
           title: issueData.title,
           theme: issueData.theme,
           publishDate: publishDateStr,
           id: newIssue.id,
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