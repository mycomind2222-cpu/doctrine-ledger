import { describe, expect, it } from "vitest";
import { issues } from "@/data/issues";
import { staticIssueToCanonical, supabaseRowToCanonical } from "@/lib/newsletter-adapters";
import { validateCanonicalIssue } from "@/lib/newsletter-validation";

const issue1 = issues.find((issue) => issue.number === 1)!;
const issue2 = issues.find((issue) => issue.number === 2)!;
const issue3 = issues.find((issue) => issue.number === 3)!;

describe("newsletter canonical validation", () => {
  it("preserves Issue 01 canonical reference details", () => {
    const canonical = staticIssueToCanonical(issue1);

    expect(canonical.number).toBe(1);
    expect(canonical.title).toBe(issue1.title);
    expect(canonical.summary).toContain("Synthetic identity fraud combines a real piece of personal information");
    expect(canonical.origin).toBe("canonical-local");
    expect(canonical.coverAsset?.legacyRef).toBe("issue-01");
    expect(canonical.supportingAssets).toHaveLength(3);
    expect(canonical.sections).toHaveLength(7);
    expect(canonical.sources.length).toBeGreaterThan(0);
    expect(canonical.accessLevel).toBe("public");
  });

  it("keeps legacy Issue 02 and Issue 03 content intact in canonical form", () => {
    const issue2Canonical = staticIssueToCanonical(issue2);
    const issue3Canonical = staticIssueToCanonical(issue3);

    expect(issue2Canonical.title).toBe(issue2.title);
    expect(issue2Canonical.coverAsset?.legacyRef).toBe("issue-02");
    expect(issue2Canonical.origin).toBe("static");
    expect(issue2Canonical.accessLevel).toBe("restricted");

    expect(issue3Canonical.title).toBe(issue3.title);
    expect(issue3Canonical.coverAsset?.legacyRef).toBe("issue-03");
    expect(issue3Canonical.origin).toBe("static");
    expect(issue3Canonical.accessLevel).toBe("professional");
  });

  it("converts a Supabase-shaped row into canonical form", () => {
    const canonical = supabaseRowToCanonical({
        id: "issue-11",
        number: 11,
        title: "Remote Issue 11",
        theme: "AI Security",
        cover_image: "issue-11",
        publication_status: "published",
        publish_date: "2026-02-02",
        tags: ["remote", "ai-security"],
        sections: [
          {
            id: "exec-11",
            type: "executive_summary",
            title: "Lead",
            audienceLevel: "public",
            content: "Remote summary for the canonical layer.",
          },
        ],
        created_at: "2026-02-02T00:00:00Z",
        updated_at: "2026-02-02T00:00:00Z",
        generated_by: "ai",
      });

    expect(canonical.number).toBe(11);
    expect(canonical.title).toBe("Remote Issue 11");
    expect(canonical.origin).toBe("supabase");
    expect(canonical.publicationStatus).toBe("published");
    expect(canonical.coverAsset?.legacyRef).toBe("issue-11");
    expect(canonical.summary).toContain("Remote summary for the canonical layer");
    expect(canonical.sections).toHaveLength(1);
  });

  it("rejects malformed canonical content", () => {
    expect(() =>
      validateCanonicalIssue({
        number: 0,
        title: "Bad issue",
        publicationStatus: "published",
        publicationDate: "2026-01-01",
        accessLevel: "public",
        schemaVersion: 1,
        origin: "canonical-local",
        coverAsset: null,
        supportingAssets: [],
        sections: [],
        sources: [],
        tags: [],
      })
    ).toThrow(/invalid issue number/i);

    expect(() =>
      validateCanonicalIssue({
        number: 12,
        title: "",
        publicationStatus: "published",
        publicationDate: "2026-01-01",
        accessLevel: "public",
        schemaVersion: 1,
        origin: "canonical-local",
        coverAsset: null,
        supportingAssets: [],
        sections: [],
        sources: [],
        tags: [],
      })
    ).toThrow(/missing title/i);

    expect(() =>
      validateCanonicalIssue({
        number: 12,
        title: "Duplicate anchors",
        publicationStatus: "published",
        publicationDate: "2026-01-01",
        accessLevel: "public",
        schemaVersion: 1,
        origin: "canonical-local",
        coverAsset: null,
        supportingAssets: [],
        sections: [
          { id: "sec-a", anchor: "dup", type: "deep_dive", accessLevel: "public", content: "One", contentFormat: "markdown", media: [], sources: [] },
          { id: "sec-b", anchor: "dup", type: "deep_dive", accessLevel: "public", content: "Two", contentFormat: "markdown", media: [], sources: [] },
        ],
        sources: [],
        tags: [],
      })
    ).toThrow(/duplicate section anchor/i);

    expect(() =>
      validateCanonicalIssue({
        number: 12,
        title: "Bad publication",
        publicationStatus: "archived",
        publicationDate: "2026-01-01",
        accessLevel: "public",
        schemaVersion: 1,
        origin: "canonical-local",
        coverAsset: null,
        supportingAssets: [],
        sections: [],
        sources: [],
        tags: [],
      })
    ).toThrow(/invalid publication status/i);

    expect(() =>
      validateCanonicalIssue({
        number: 12,
        title: "Bad access",
        publicationStatus: "published",
        publicationDate: "2026-01-01",
        accessLevel: "secret",
        schemaVersion: 1,
        origin: "canonical-local",
        coverAsset: null,
        supportingAssets: [],
        sections: [],
        sources: [],
        tags: [],
      })
    ).toThrow(/invalid access level/i);
  });
});
