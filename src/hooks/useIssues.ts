 import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
 import { supabase } from "@/integrations/supabase/client";
 import { issues as staticIssues, type Issue, type Section } from "@/data/issues";
 import type { Json } from "@/integrations/supabase/types";
 
 export interface DbIssue {
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
 
 // Transform database issue to app format
 const transformDbIssue = (dbIssue: DbIssue): Issue => ({
   number: dbIssue.number,
   title: dbIssue.title,
   theme: dbIssue.theme,
   coverImage: dbIssue.cover_image || undefined,
   publicationStatus: dbIssue.publication_status as 'published' | 'draft',
   publishDate: dbIssue.publish_date,
   sections: dbIssue.sections as unknown as Section[],
   tags: dbIssue.tags,
 });
 
 export function useAllIssues() {
   return useQuery({
     queryKey: ["issues", "all"],
     queryFn: async () => {
       // Fetch published issues from database
       const { data: dbIssues, error } = await supabase
         .from("issues")
         .select("*")
         .eq("publication_status", "published")
         .order("number", { ascending: false });
 
       if (error) {
         console.error("Error fetching issues:", error);
         // Fall back to static issues on error
         return staticIssues;
       }
 
       // Combine static issues with database issues
       // Static issues are 1-10, database starts at 11+
       const dynamicIssues = (dbIssues || []).map((issue) => transformDbIssue(issue as unknown as DbIssue));
       
       // Merge: use static for 1-10, database for the rest
       const allIssues = [
         ...staticIssues,
         ...dynamicIssues.filter(di => di.number > 10),
       ].sort((a, b) => b.number - a.number);
 
       return allIssues;
     },
   });
 }
 
 export function useIssue(issueNumber: number) {
   return useQuery({
     queryKey: ["issues", issueNumber],
     queryFn: async () => {
       // For issues 1-10, use static data
       if (issueNumber <= 10) {
         return staticIssues.find(i => i.number === issueNumber) || null;
       }
 
       // For dynamic issues, fetch from database
       const { data, error } = await supabase
         .from("issues")
         .select("*")
         .eq("number", issueNumber)
         .maybeSingle();
 
       if (error) {
         console.error("Error fetching issue:", error);
         return null;
       }
 
       return data ? transformDbIssue(data as unknown as DbIssue) : null;
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