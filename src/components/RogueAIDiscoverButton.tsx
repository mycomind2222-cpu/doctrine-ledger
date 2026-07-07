import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export const RogueAIDiscoverButton = () => {
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const qc = useQueryClient();

  if (!isAdmin) return null;

  const run = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("discover-rogue-ai");
      if (error) throw error;
      const inserted = data?.inserted ?? 0;
      toast.success(`Discovered ${inserted} new incident${inserted === 1 ? "" : "s"}`);
      qc.invalidateQueries({ queryKey: ["rogue-ai-incidents"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Discovery failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={run}
      disabled={loading}
      size="sm"
      variant="outline"
      className="gap-2 border-classified/40 text-classified hover:bg-classified/10"
    >
      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
      {loading ? "Scanning…" : "Auto-discover incidents"}
    </Button>
  );
};
