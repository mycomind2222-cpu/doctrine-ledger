import { describe, expect, it } from "vitest";
import { getLatestPublishedIssue, getIssueReadingTime, getIssueSummary } from "@/lib/issue-presentations";
import { issues } from "@/data/issues";

describe("issue presentation helpers", () => {
  it("selects the most recently published issue by date", () => {
    const latest = getLatestPublishedIssue([
      { ...issues[1], publishDate: "2025-01-01" },
      { ...issues[0], publishDate: "2025-02-01" },
    ]);

    expect(latest?.number).toBe(1);
  });

  it("computes a positive reading time", () => {
    const issue = issues.find((item) => item.number === 1);
    expect(issue).toBeTruthy();
    expect(getIssueReadingTime(issue!)).toBeGreaterThan(0);
  });

  it("returns the plain-English summary for an issue", () => {
    const issue = issues.find((item) => item.number === 1);
    expect(getIssueSummary(issue!)).toContain("Synthetic identity fraud combines a real piece of personal information");
  });

  it("returns the rewritten summaries for issues 2 and 3", () => {
    const issue2 = issues.find((item) => item.number === 2);
    const issue3 = issues.find((item) => item.number === 3);

    expect(issue2).toBeTruthy();
    expect(issue3).toBeTruthy();
    expect(getIssueSummary(issue2!)).toContain("Jailbreaking and prompt injection are related but different problems");
    expect(getIssueSummary(issue3!)).toContain("Most serious AI red-teaming is not happening in secret Discords");
  });
});
