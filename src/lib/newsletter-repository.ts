import { issues as localIssues } from "@/data/issues";
import { supabase } from "@/integrations/supabase/client";
import { type NewsletterIssueContent } from "@/lib/newsletter-content";
import {
  canonicalIssuesToLegacy,
  legacyIssuesToCanonical,
  supabaseRowToCanonical,
} from "@/lib/newsletter-adapters";
import { type SupabaseIssueRow } from "@/lib/newsletter-validation";

export interface NewsletterRepository {
  getIssueByNumber(issueNumber: number): Promise<NewsletterIssueContent | null>;
  listPublishedIssues(): Promise<NewsletterIssueContent[]>;
  getLatestPublishedIssue(): Promise<NewsletterIssueContent | null>;
}

export interface NewsletterRepositoryDependencies {
  localIssues?: typeof localIssues;
  fetchPublishedRemoteIssues?: () => Promise<SupabaseIssueRow[]>;
  fetchRemoteIssueByNumber?: (issueNumber: number) => Promise<SupabaseIssueRow | null>;
}

const sortPublishedIssues = (issues: NewsletterIssueContent[]) => {
  return [...issues].sort((a, b) => {
    const dateDelta = new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime();
    if (dateDelta !== 0) return dateDelta;
    return b.number - a.number;
  });
};

const sortNumberDescending = (issues: NewsletterIssueContent[]) => {
  return [...issues].sort((a, b) => b.number - a.number);
};

const mergeByIssueNumber = (primary: NewsletterIssueContent[], secondary: NewsletterIssueContent[]) => {
  const map = new Map<number, NewsletterIssueContent>();
  for (const issue of primary) map.set(issue.number, issue);
  for (const issue of secondary) {
    if (!map.has(issue.number)) {
      map.set(issue.number, issue);
    }
  }
  return [...map.values()];
};

const createDefaultRemotePublishedIssueFetcher = async (): Promise<SupabaseIssueRow[]> => {
  const { data, error } = await supabase
    .from("issues")
    .select("*")
    .eq("publication_status", "published")
    .order("number", { ascending: false });

  if (error) {
    throw error;
  }

  return (data || []) as SupabaseIssueRow[];
};

const createDefaultRemoteIssueFetcher = async (issueNumber: number): Promise<SupabaseIssueRow | null> => {
  const { data, error } = await supabase
    .from("issues")
    .select("*")
    .eq("number", issueNumber)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data || null) as SupabaseIssueRow | null;
};

export const createNewsletterRepository = (dependencies: NewsletterRepositoryDependencies = {}): NewsletterRepository => {
  const resolvedLocalIssues = dependencies.localIssues ?? localIssues;
  const fetchPublishedRemoteIssues = dependencies.fetchPublishedRemoteIssues ?? createDefaultRemotePublishedIssueFetcher;
  const fetchRemoteIssueByNumber = dependencies.fetchRemoteIssueByNumber ?? createDefaultRemoteIssueFetcher;
  const canonicalLocalIssues = legacyIssuesToCanonical(resolvedLocalIssues);
  const listPublishedIssues = async () => {
    try {
      const remotePublishedIssues = (await fetchPublishedRemoteIssues()).map(supabaseRowToCanonical);
      const merged = mergeByIssueNumber(
        canonicalLocalIssues.filter((issue) => issue.publicationStatus === "published"),
        remotePublishedIssues.filter((issue) => issue.publicationStatus === "published")
      );
      return sortNumberDescending(merged);
    } catch (error) {
      console.error("Error fetching remote issues, falling back to local content:", error);
      return sortNumberDescending(canonicalLocalIssues.filter((issue) => issue.publicationStatus === "published"));
    }
  };

  return {
    listPublishedIssues,

    async getIssueByNumber(issueNumber: number) {
      if (!Number.isInteger(issueNumber) || issueNumber <= 0) {
        return null;
      }

      const localIssue = canonicalLocalIssues.find((issue) => issue.number === issueNumber);
      if (localIssue) return localIssue;

      try {
        const remoteIssue = await fetchRemoteIssueByNumber(issueNumber);
        return remoteIssue ? supabaseRowToCanonical(remoteIssue) : null;
      } catch (error) {
        console.error(`Error fetching issue #${issueNumber}, falling back to local content:`, error);
        return localIssue ?? null;
      }
    },

    async getLatestPublishedIssue() {
      const publishedIssues = await listPublishedIssues();
      return sortPublishedIssues(publishedIssues)[0] ?? null;
    },
  };
};

export const newsletterRepository = createNewsletterRepository();

export const toLegacyIssues = canonicalIssuesToLegacy;
