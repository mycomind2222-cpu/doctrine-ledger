import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { useAllIssues, useIssue } from "@/hooks/useIssues";
import { Issue01Template } from "@/components/issues/Issue01Template";
import { IssueArticleTemplate } from "@/components/issues/IssueArticleTemplate";

const IssuePage = () => {
  const { issueNumber } = useParams();
  const navigate = useNavigate();
  const issueId = Number(issueNumber);
  const { data: issue, isLoading } = useIssue(issueId);
  const { data: allIssues } = useAllIssues();
  const publishedIssues = (allIssues || []).filter((item) => item.publicationStatus === "published");
  const maxIssueNumber = publishedIssues.length ? Math.max(...publishedIssues.map((item) => item.number)) : 10;

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      if (!Number.isInteger(issueId)) return;

      if (event.key === "ArrowLeft" && issueId > 1) {
        navigate(`/issues/${issueId - 1}`);
      }

      if (event.key === "ArrowRight" && issueId < maxIssueNumber) {
        navigate(`/issues/${issueId + 1}`);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [issueId, maxIssueNumber, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-4xl font-bold mb-4">Issue Not Found</h1>
          <Link to="/">
            <Button variant="classified">Return to Index</Button>
          </Link>
        </div>
      </div>
    );
  }

  const article = issue.number === 1 ? (
    <Issue01Template issue={issue} allIssues={publishedIssues} />
  ) : (
    <IssueArticleTemplate issue={issue} allIssues={publishedIssues} />
  );

  return (
    <>
      <SEO
        title={`Issue #${String(issue.number).padStart(2, "0")}: ${issue.title}`}
        description={issue.sections[0]?.content.slice(0, 155).replace(/\n/g, " ") + "..." || `BLACKFILES Issue ${issue.number} — AI crime briefing on ${issue.theme.toLowerCase()}.`}
        path={`/issues/${issue.number}`}
        type="article"
        publishedTime={issue.publishDate}
        tags={issue.tags}
      />
      {article}
    </>
  );
};

export default IssuePage;
