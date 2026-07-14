import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { IssueCard } from "@/components/IssueCard";
import { IssueArticleTemplate } from "@/components/issues/IssueArticleTemplate";
import { Issue01Template } from "@/components/issues/Issue01Template";
import { issues } from "@/data/issues";

describe("cover rendering", () => {
  it("keeps issue cards on object-contain", () => {
    const issue = issues.find((item) => item.number === 1);
    expect(issue).toBeTruthy();

    render(
      <MemoryRouter>
        <IssueCard issue={issue!} index={0} />
      </MemoryRouter>
    );

    const image = screen.getByAltText("Issue 01 cover");
    expect(image).toHaveClass("object-contain");
    expect(image).not.toHaveClass("object-cover");
  });

  it("keeps the Issue 01 hero cover on object-contain", () => {
    const issue = issues.find((item) => item.number === 1);
    expect(issue).toBeTruthy();

    render(
      <MemoryRouter>
        <Issue01Template issue={issue!} allIssues={issues} />
      </MemoryRouter>
    );

    const image = screen.getByAltText("BLACKFILES Issue 01 cover");
    expect(image).toHaveClass("object-contain");
    expect(image).not.toHaveClass("object-cover");
  });

  it("renders the Issue 02 and 03 hero covers and supporting media", () => {
    const issue2 = issues.find((item) => item.number === 2);
    const issue3 = issues.find((item) => item.number === 3);
    expect(issue2).toBeTruthy();
    expect(issue3).toBeTruthy();

    render(
      <MemoryRouter>
        <IssueArticleTemplate issue={issue2!} allIssues={issues} />
        <IssueArticleTemplate issue={issue3!} allIssues={issues} />
      </MemoryRouter>
    );

    expect(screen.getByAltText("BLACKFILES Issue 02 cover")).toHaveClass("object-contain");
    expect(screen.getByAltText("BLACKFILES Issue 03 cover")).toHaveClass("object-contain");
    expect(screen.getByAltText("Split editorial diagram showing the difference between model-policy jailbreaking and prompt injection in agentic systems.")).toBeInTheDocument();
    expect(screen.getByAltText("Editorial map of the public red-teaming ecosystem across bug bounties, benchmarks, standards bodies, and CTFs.")).toBeInTheDocument();
  });
});
