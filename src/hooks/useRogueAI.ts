import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type EvidenceTier = 1 | 2 | 3;
export type SourceType = "press" | "court" | "research" | "vendor" | "other";

export interface RogueAIIncident {
  id: string;
  title: string;
  model_or_agent: string;
  summary: string;
  full_writeup: string | null;
  evidence_tier: EvidenceTier;
  law_analog: string[];
  occurred_on: string | null;
  source_url: string | null;
  source_type: SourceType | null;
  related_issue_number: number | null;
  created_at: string;
}

export const useRogueAIIncidents = (limit?: number) => {
  return useQuery({
    queryKey: ["rogue-ai-incidents", limit ?? "all"],
    queryFn: async () => {
      let q = supabase
        .from("rogue_ai_incidents")
        .select("*")
        .order("occurred_on", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false });
      if (limit) q = q.limit(limit);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as RogueAIIncident[];
    },
  });
};

export const TIER_META: Record<EvidenceTier, { label: string; short: string; className: string }> = {
  1: {
    label: "Real-world incident",
    short: "Tier 1",
    className: "bg-classified/15 text-classified border-classified/40",
  },
  2: {
    label: "Lab / red-team finding",
    short: "Tier 2",
    className: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
  },
  3: {
    label: "Agentic near-miss",
    short: "Tier 3",
    className: "bg-amber-500/10 text-amber-300 border-amber-500/30",
  },
};

export interface RogueAIWatchEntry {
  model: string;
  incident: string;
  law_analog: string[];
  evidence_tier: EvidenceTier;
  source_url?: string;
  source_type?: SourceType;
  why_legal_gap?: string;
  occurred_on?: string;
  title?: string;
}

export const parseRogueWatch = (content: string): RogueAIWatchEntry[] | null => {
  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed) && parsed.every((e) => e && typeof e === "object" && "incident" in e)) {
      return parsed as RogueAIWatchEntry[];
    }
  } catch {
    // not JSON, fall through
  }
  return null;
};
