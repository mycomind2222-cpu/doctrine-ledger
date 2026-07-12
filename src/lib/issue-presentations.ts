import { type Issue } from "@/data/issues";
import { getPlainSummary } from "@/data/plainSummaries";

export const getIssueReadingTime = (issue: Issue) => {
  const words = issue.sections.reduce((sum, section) => sum + section.content.split(/\s+/).length, 0);
  return Math.max(1, Math.round(words / 200));
};

export const getLatestPublishedIssue = (issues: Issue[]) => {
  return [...issues]
    .filter((issue) => issue.publicationStatus === "published")
    .sort((a, b) => {
      const dateDelta = new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
      if (dateDelta !== 0) return dateDelta;
      return b.number - a.number;
    })[0] ?? null;
};

export const getIssueSummary = (issue: Issue) => {
  const executiveSummary = issue.sections.find((section) => section.type === "executive_summary")?.content;
  return getPlainSummary(issue.number, executiveSummary);
};

export const getIssueSectionList = (issue: Issue) => {
  return issue.sections.filter((section) => section.audienceLevel !== "restricted");
};
