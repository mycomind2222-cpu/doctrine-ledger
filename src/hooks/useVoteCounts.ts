import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useIssueVoteCounts() {
  return useQuery({
    queryKey: ["issue-votes", "all-counts"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_issue_vote_counts");
      if (error) throw error;

      const counts: Record<number, { up: number; down: number }> = {};
      for (const row of data || []) {
        counts[row.issue_number] = {
          up: Number(row.upvotes),
          down: Number(row.downvotes),
        };
      }
      return counts;
    },
  });
}
