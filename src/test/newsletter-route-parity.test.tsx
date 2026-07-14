import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "@/pages/Index";
import Archive from "@/pages/Archive";
import IssuePage from "@/pages/IssuePage";
import { issues } from "@/data/issues";
import { staticIssueToCanonical } from "@/lib/newsletter-adapters";
import { newsletterRepository } from "@/lib/newsletter-repository";

vi.mock("@/lib/newsletter-repository", () => {
  const repository = {
    listPublishedIssues: vi.fn(),
    getIssueByNumber: vi.fn(),
    getLatestPublishedIssue: vi.fn(),
  };

  return { newsletterRepository: repository };
});

const issue1 = staticIssueToCanonical(issues.find((issue) => issue.number === 1)!);
const issue2 = staticIssueToCanonical(issues.find((issue) => issue.number === 2)!);
const issue3 = staticIssueToCanonical(issues.find((issue) => issue.number === 3)!);

const createTestClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

const renderRoute = (path: string) =>
  render(
    <QueryClientProvider client={createTestClient()}>
      <HelmetProvider>
        <AuthProvider>
          <MemoryRouter initialEntries={[path]}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/archive" element={<Archive />} />
              <Route path="/issues/:issueNumber" element={<IssuePage />} />
            </Routes>
          </MemoryRouter>
        </AuthProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );

beforeEach(() => {
  vi.mocked(newsletterRepository.listPublishedIssues).mockResolvedValue([issue3, issue2, issue1]);
  vi.mocked(newsletterRepository.getLatestPublishedIssue).mockResolvedValue(issue3);
  vi.mocked(newsletterRepository.getIssueByNumber).mockImplementation(async (issueNumber: number) => {
    if (issueNumber === 1) return issue1;
    if (issueNumber === 2) return issue2;
    if (issueNumber === 3) return issue3;
    return null;
  });
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("newsletter route parity", () => {
  it("keeps the homepage latest issue selection intact", async () => {
    renderRoute("/");

    expect(await screen.findByText(issue3.title)).toBeInTheDocument();
    expect(screen.getByAltText("Issue 03 cover")).toBeInTheDocument();
  });

  it("keeps archive ordering intact", async () => {
    renderRoute("/archive");

    const issue3Title = await screen.findByText(issue3.title);
    const issue2Title = screen.getByText(issue2.title);
    const issue1Title = screen.getByText(issue1.title);

    expect(issue3Title.compareDocumentPosition(issue2Title) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(issue2Title.compareDocumentPosition(issue1Title) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("resolves /issues/1 with the approved Issue 01 template", async () => {
    renderRoute("/issues/1");

    expect(await screen.findByText("Plain-English summary")).toBeInTheDocument();
    expect(screen.getByAltText("BLACKFILES Issue 01 cover")).toBeInTheDocument();
    expect(screen.getByText(issue1.title)).toBeInTheDocument();
  });

  it("resolves /issues/2 with the shared editorial article template", async () => {
    renderRoute("/issues/2");

    expect(await screen.findByText(issue2.title)).toBeInTheDocument();
    expect(screen.getByAltText("BLACKFILES Issue 02 cover")).toBeInTheDocument();
    expect(screen.getByText("Plain-English summary")).toBeInTheDocument();
  });

  it("keeps missing issue behavior compatible", async () => {
    vi.mocked(newsletterRepository.getIssueByNumber).mockResolvedValueOnce(null);

    renderRoute("/issues/99");

    expect(await screen.findByText("Issue Not Found")).toBeInTheDocument();
  });
});
