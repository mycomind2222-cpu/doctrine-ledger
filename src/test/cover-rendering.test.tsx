import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { IssueCard } from "@/components/IssueCard";
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
});
