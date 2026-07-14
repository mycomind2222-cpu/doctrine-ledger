import { type Issue } from "@/data/issues";
import { IssueArticleTemplate } from "./IssueArticleTemplate";

interface Issue01TemplateProps {
  issue: Issue;
  allIssues: Issue[];
}

export const Issue01Template = ({ issue, allIssues }: Issue01TemplateProps) => {
  return <IssueArticleTemplate issue={issue} allIssues={allIssues} issueLabel="Issue 01" />;
};
