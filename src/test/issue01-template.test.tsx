import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { issues } from "@/data/issues";
import { resolveIssueCover } from "@/lib/issue-assets";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { IssueSectionContent } from "@/components/issues/IssueSectionContent";

const issue1 = issues.find((issue) => issue.number === 1);

describe("Issue 01 canonical data", () => {
  it("uses the new title, section order, and sources section", () => {
    expect(issue1?.title).toBe("Synthetic Identity Fraud: The $30 Billion Crime Hiding in Plain Sight");
    expect(issue1?.sections.map((section) => section.id)).toEqual([
      "exec-1",
      "mechanics-1",
      "numbers-1",
      "detection-1",
      "expansion-1",
      "defenses-1",
      "sources-1",
    ]);
    expect(issue1?.sections.some((section) => section.type === "sources")).toBe(true);
  });

  it("keeps every Issue 01 section public", () => {
    expect(issue1?.sections.every((section) => section.audienceLevel === "public")).toBe(true);
  });

  it("removes the old Issue 01 copy", () => {
    const article = issue1?.sections.map((section) => section.content).join(" ");
    expect(article).not.toMatch(/Ghost People & Fake Families/i);
    expect(article).not.toMatch(/The Industrialization of Exploit Fusion/i);
    expect(article).not.toMatch(/\$11M Identity Scam/i);
  });

  it("resolves the Issue 01 cover through the shared resolver", () => {
    expect(resolveIssueCover("issue-01")).toContain("issue-01/cover.png");
    expect(resolveIssueCover("issue-02")).toContain("issue-02");
  });
});

describe("MarkdownRenderer", () => {
  it("renders safe formatting without raw HTML", () => {
    const { container } = render(
      <MarkdownRenderer
        content={"This is **bold** and *italic* with [a link](https://example.com).\n\n- First\n- Second\n\n1. One\n2. Two\n\n<script>alert('x')</script>"}
      />
    );

    expect(screen.getByText("bold")).toBeInTheDocument();
    expect(screen.getByText("italic")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "a link" })).toHaveAttribute("href", "https://example.com");
    expect(container.querySelector("ul")).toBeInTheDocument();
    expect(container.querySelector("ol")).toBeInTheDocument();
    expect(container.querySelector("script")).toBeNull();
    expect(screen.getByText("<script>alert('x')</script>")).toBeInTheDocument();
  });
});

describe("IssueSectionContent", () => {
  it("does not render the body when locked", () => {
    render(
      <IssueSectionContent
        locked
        section={{
          id: "locked",
          type: "deep_dive",
          title: "Locked section",
          audienceLevel: "restricted",
          content: "Secret body",
        }}
      />
    );

    expect(screen.queryByText("Secret body")).toBeNull();
    expect(screen.getByText("Restricted content")).toBeInTheDocument();
  });

  it("renders the body and media when unlocked", () => {
    const { container } = render(
      <IssueSectionContent
        section={{
          id: "open",
          type: "deep_dive",
          title: "Open section",
          audienceLevel: "public",
          content: "Visible **body** text.",
        }}
      />
    );

    expect(container.querySelector("p")?.textContent).toBe("Visible body text.");
  });
});
