import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { type Issue } from "@/data/issues";
import type { Json } from "@/integrations/supabase/types";
import { newsletterRepository } from "@/lib/newsletter-repository";
import { canonicalToLegacyIssue } from "@/lib/newsletter-adapters";

interface DbIssue {
  id: string;
  number: number;
  title: string;
  theme: string;
  cover_image: string | null;
  publication_status: string;
  publish_date: string;
  tags: string[];
  sections: Json;
  created_at: string;
  updated_at: string;
  generated_by: string | null;
}

export function useAllIssues() {
  return useQuery({
    queryKey: ["issues", "all"],
    queryFn: async () => {
      const canonicalIssues = await newsletterRepository.listPublishedIssues();
      return canonicalIssues.map((issue) => canonicalToLegacyIssue(issue));
    },
  });
}

export function useIssue(issueNumber: number) {
  return useQuery({
    queryKey: ["issues", issueNumber],
    queryFn: async () => {
      const canonicalIssue = await newsletterRepository.getIssueByNumber(issueNumber);
      return canonicalIssue ? canonicalToLegacyIssue(canonicalIssue) : null;
    },
  });
}

// Admin hooks for managing issues
export function useAdminIssues() {
  return useQuery({
    queryKey: ["admin", "issues"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("issues")
        .select("*")
        .order("number", { ascending: false });

      if (error) throw error;
      return (data || []) as unknown as DbIssue[];
    },
  });
}

export function usePublishIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (issueId: string) => {
      const { error } = await supabase
        .from("issues")
        .update({ publication_status: "published" })
        .eq("id", issueId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "issues"] });
    },
  });
}

export function useUnpublishIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (issueId: string) => {
      const { error } = await supabase
        .from("issues")
        .update({ publication_status: "draft" })
        .eq("id", issueId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "issues"] });
    },
  });
}

export function useDeleteIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (issueId: string) => {
      const { error } = await supabase
        .from("issues")
        .delete()
        .eq("id", issueId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "issues"] });
    },
  });
}

export function useGenerateIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke("generate-issue");

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "issues"] });
    },
  });
}
