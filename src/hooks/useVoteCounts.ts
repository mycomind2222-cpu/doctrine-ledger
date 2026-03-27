import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useIssueVoteCounts() {
  return useQuery({
    queryKey: ["issue-votes", "all-counts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("issue_votes")
        .select("issue_number, vote_type");
      if (error) throw error;

      const counts: Record<number, { up: number; down: number }> = {};
      for (const row of data || []) {
        if (!counts[row.issue_number]) counts[row.issue_number] = { up: 0, down: 0 };
        if (row.vote_type === "upvote") counts[row.issue_number].up++;
        else counts[row.issue_number].down++;
      }
      return counts;
    },
  });
}
