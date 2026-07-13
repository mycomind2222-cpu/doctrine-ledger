import { describe, expect, it } from "vitest";
import { issues } from "@/data/issues";
import { createNewsletterRepository } from "@/lib/newsletter-repository";
import { type SupabaseIssueRow } from "@/lib/newsletter-validation";

const issue1 = issues.find((issue) => issue.number === 1)!;
const issue2 = issues.find((issue) => issue.number === 2)!;
const issue3 = issues.find((issue) => issue.number === 3)!;

const createRemoteIssue = (overrides: Partial<SupabaseIssueRow> & Pick<SupabaseIssueRow, "number" | "title" | "theme" | "publication_status" | "publish_date" | "sections" | "tags">): SupabaseIssueRow => ({
  id: `remote-${overrides.number}`,
  cover_image: null,
  created_at: "2026-02-01T00:00:00Z",
  updated_at: "2026-02-01T00:00:00Z",
  generated_by: "ai",
  quality_notes: null,
  quality_score: null,
  ...overrides,
});

describe("newsletter repository", () => {
  it("deduplicates by issue number and keeps local precedence", async () => {
    const repository = createNewsletterRepository({
      localIssues: [issue1, issue2, issue3],
      fetchPublishedRemoteIssues: async () => [
        createRemoteIssue({
          number: 2,
          title: "Remote override should lose",
          theme: issue2.theme,
          publication_status: "published",
          publish_date: "2026-03-01",
          tags: [],
          sections: [
            {
              id: "exec-2",
              type: "executive_summary",
              title: "Remote",
              audienceLevel: "public",
              content: "This remote copy should be ignored in the merged result.",
            },
          ],
        }),
        createRemoteIssue({
          number: 11,
          title: "Remote Issue 11",
          theme: "AI Security",
          publication_status: "published",
          publish_date: "2026-04-01",
          tags: ["remote"],
          sections: [
            {
              id: "exec-11",
              type: "executive_summary",
              title: "Lead",
              audienceLevel: "public",
              content: "Remote 11 summary.",
            },
          ],
        }),
      ],
      fetchRemoteIssueByNumber: async () =>
        createRemoteIssue({
          number: 11,
          title: "Remote Issue 11",
          theme: "AI Security",
          publication_status: "published",
          publish_date: "2026-04-01",
          tags: ["remote"],
          sections: [
            {
              id: "exec-11",
              type: "executive_summary",
              title: "Lead",
              audienceLevel: "public",
              content: "Remote 11 summary.",
            },
          ],
        }),
    });

    const published = await repository.listPublishedIssues();

    expect(published.map((issue) => issue.number)).toEqual([11, 3, 2, 1]);
    expect(published.find((issue) => issue.number === 2)?.title).toBe(issue2.title);
    expect(await repository.getIssueByNumber(2)).toMatchObject({ number: 2, title: issue2.title });
    expect(await repository.getIssueByNumber(11)).toMatchObject({ number: 11, title: "Remote Issue 11" });
  });

  it("falls back to local content when remote published issues fail", async () => {
    const repository = createNewsletterRepository({
      localIssues: [issue1, issue2],
      fetchPublishedRemoteIssues: async () => {
        throw new Error("network unavailable");
      },
      fetchRemoteIssueByNumber: async () => null,
    });

    const published = await repository.listPublishedIssues();

    expect(published.map((issue) => issue.number)).toEqual([2, 1]);
  });

  it("selects the latest issue by publication date", async () => {
    const repository = createNewsletterRepository({
      localIssues: [
        { ...issue1, publishDate: "2026-01-01" },
        { ...issue2, publishDate: "2026-02-01" },
      ],
      fetchPublishedRemoteIssues: async () => [],
      fetchRemoteIssueByNumber: async () => null,
    });

    const latest = await repository.getLatestPublishedIssue();

    expect(latest?.number).toBe(2);
  });

  it("returns null for invalid issue numbers", async () => {
    const repository = createNewsletterRepository();

    await expect(repository.getIssueByNumber(0)).resolves.toBeNull();
  });
});
