import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

interface IssueVotingProps {
  issueNumber: number;
}

export const IssueVoting = ({ issueNumber }: IssueVotingProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get aggregated vote counts via RPC (no user_id exposed)
  const { data: voteCounts } = useQuery({
    queryKey: ["issue-votes", "counts", issueNumber],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_issue_vote_counts");
      if (error) throw error;
      const row = (data || []).find((r: any) => r.issue_number === issueNumber);
      return { up: Number(row?.upvotes ?? 0), down: Number(row?.downvotes ?? 0) };
    },
  });

  // Get current user's vote via secure RPC
  const { data: userVote } = useQuery({
    queryKey: ["issue-votes", "user-vote", issueNumber],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_user_vote", {
        p_issue_number: issueNumber,
      });
      if (error) throw error;
      return data as string | null;
    },
  });

  const upvotes = voteCounts?.up ?? 0;
  const downvotes = voteCounts?.down ?? 0;

  const voteMutation = useMutation({
    mutationFn: async (voteType: "upvote" | "downvote") => {
      if (!user) throw new Error("Must be logged in");

      if (userVote === voteType) {
        const { error } = await supabase
          .from("issue_votes")
          .delete()
          .eq("user_id", user.id)
          .eq("issue_number", issueNumber);
        if (error) throw error;
      } else if (userVote) {
        const { error } = await supabase
          .from("issue_votes")
          .update({ vote_type: voteType })
          .eq("user_id", user.id)
          .eq("issue_number", issueNumber);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("issue_votes")
          .insert({ user_id: user.id, issue_number: issueNumber, vote_type: voteType });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issue-votes"] });
    },
    onError: () => {
      toast({ title: "Failed to vote", description: "Please try again.", variant: "destructive" });
    },
  });

  const handleVote = (type: "upvote" | "downvote") => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "You need to sign in to vote on issues.",
      });
      return;
    }
    voteMutation.mutate(type);
  };

  return (
    <div className="flex items-center gap-1">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => handleVote("upvote")}
        className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-200 text-sm font-mono ${
          userVote === "upvote"
            ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
            : "border-border/50 bg-card/50 text-muted-foreground hover:border-emerald-500/30 hover:text-emerald-400"
        }`}
        disabled={voteMutation.isPending}
      >
        <ThumbsUp className="w-3.5 h-3.5" />
        <AnimatePresence mode="wait">
          <motion.span
            key={upvotes}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {upvotes}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => handleVote("downvote")}
        className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-200 text-sm font-mono ${
          userVote === "downvote"
            ? "border-red-500/50 bg-red-500/10 text-red-400"
            : "border-border/50 bg-card/50 text-muted-foreground hover:border-red-500/30 hover:text-red-400"
        }`}
        disabled={voteMutation.isPending}
      >
        <ThumbsDown className="w-3.5 h-3.5" />
        <AnimatePresence mode="wait">
          <motion.span
            key={downvotes}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {downvotes}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  );
};
