import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Loader2, TriangleAlert } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { issues } from "@/data/issues";
import { resolveIssueCover, resolveIssue01SupportingMedia, issue01SupportingMediaRefs } from "@/lib/issue-assets";
import { computeArticleRevisionId } from "@/lib/visual-production/article-revision";
import { EditorialCoverV2 } from "@/components/covers/EditorialCoverV2";
import { getVisualProfile } from "@/config/visual-profiles";
import { validateCoverCompositionInput } from "@/lib/visual-production/cover-validation";
import { resolveCoverArtworkRef } from "@/lib/visual-production/asset-manifest";
import { getVisualIssueManifest, resolveLegacyAssetRef } from "@/lib/visual-production/asset-repository";
import { getPublicationReadinessReasons } from "@/lib/visual-production/workflow";
import type { CoverArtworkRef } from "@/lib/visual-production/cover-types";
import type { IssueMediaPlan, SupportingAssetPlan } from "@/lib/visual-production/media-plan";

const buildFallbackPlan = (issueNumber: number, articleRevisionId: string): IssueMediaPlan => {
  const issue = issues.find((item) => item.number === issueNumber);
  if (!issue) {
    throw new Error("Issue not found");
  }

  return {
    issueId: `issue-${String(issue.number).padStart(2, "0")}`,
    issueNumber: issue.number,
    articleRevisionId,
    visualProfileId: "editorial-cover-v2",
    visualProfileVersion: 1,
    planStatus: "unplanned",
    approvalStatus: "draft",
    coverPlan: {
      assetKey: `issue-${String(issue.number).padStart(2, "0")}-cover`,
      editorialPurpose: "Preview current public cover.",
      artDirection: "Use the existing issue cover until a new approved asset exists.",
      generationMethod: "editor-upload",
      prohibitedImplications: ["No fabricated statistics"],
      sourceIds: [],
      requiredLabels: [`Issue #${String(issue.number).padStart(2, "0")}`],
      altText: `Issue ${String(issue.number).padStart(2, "0")} cover preview`,
      caption: "Fallback preview based on the current cover.",
      placement: "cover",
      aspectRatio: "2:3",
      approvalStatus: "draft",
      source: {
        sourceKind: "legacy-ref",
        source: issue.coverImage ?? `issue-${String(issue.number).padStart(2, "0")}`,
      },
    },
    supportingAssetPlans: issue.sections
      .filter((section) => section.media && section.media.length > 0)
      .slice(0, 3)
      .map((section, index): SupportingAssetPlan => ({
        assetKey: `issue-${String(issue.number).padStart(2, "0")}-support-${index + 1}`,
        sectionKey: section.id,
        editorialPurpose: section.title ?? section.type,
        kind: index === 0 ? "mechanism" : index === 1 ? "evidence" : "defense",
        generationMethod: "editor-upload",
        prompt: undefined,
        prohibitedImplications: ["No fabricated statistics"],
        sourceIds: section.media?.map((media) => media.id) ?? [],
        requiredLabels: [`Section ${String(index + 1).padStart(2, "0")}`],
        altText: section.media?.[0]?.alt ?? section.title ?? issue.title,
        caption: section.media?.[0]?.caption,
        placement: "body",
        aspectRatio: section.media?.[0]?.aspectRatio ?? "wide",
        approvalStatus: "draft",
        source: {
          sourceKind: "legacy-ref",
          source: section.media?.[0]?.src ?? "",
        },
      })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

const parseArtworkInput = (value: string | null): CoverArtworkRef | null => {
  if (!value) return null;
  if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("data:")) {
    return { sourceKind: "remote-url", source: value };
  }
  if (value.startsWith("/@fs/") || value.startsWith("/Users/") || value.startsWith("/")) {
    return { sourceKind: "local-path", source: value.replace(/^\/@fs/, "") };
  }
  return { sourceKind: "legacy-ref", source: value };
};

const resolveArtworkUrl = (source: CoverArtworkRef, issueNumber: number) => {
  if (source.sourceKind === "legacy-ref") {
    if (source.source === "issue-01") return resolveIssueCover(source.source);
    if (source.source === issue01SupportingMediaRefs.mechanics || source.source === issue01SupportingMediaRefs.numbers || source.source === issue01SupportingMediaRefs.defenses) {
      return resolveIssue01SupportingMedia(source.source);
    }
    const issue = issues.find((item) => item.number === issueNumber);
    return issue?.coverImage ? resolveIssueCover(issue.coverImage) : null;
  }

  return resolveCoverArtworkRef(source, resolveLegacyAssetRef);
};

export const AdminVisualCoverPreview = () => {
  const { issueNumber } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isAdmin, loading } = useAuth();
  const [artworkValue, setArtworkValue] = useState(searchParams.get("artwork") ?? "");
  const allowExportPreview = import.meta.env.DEV && searchParams.get("view") === "export";

  const issue = useMemo(() => issues.find((item) => item.number === Number(issueNumber)), [issueNumber]);
  const manifest = useMemo(() => {
    if (!issue) return null;
    return getVisualIssueManifest(issue.number);
  }, [issue]);

  const baseRevision = issue
    ? computeArticleRevisionId({
        title: issue.title,
        subtitle: issue.theme,
        summary: issue.sections.find((section) => section.type === "executive_summary")?.content,
        theme: issue.theme,
        sections: issue.sections.map((section) => ({
          id: section.id,
          title: section.title,
          content: section.content,
        })),
      })
    : "";

  const activeManifest = useMemo(() => {
    if (!issue) return null;
    return manifest ?? buildFallbackPlan(issue.number, baseRevision);
  }, [baseRevision, issue, manifest]);

  const visualProfile = activeManifest ? getVisualProfile(activeManifest.visualProfileId) : null;
  const artworkSource = useMemo(() => {
    if (!issue || !activeManifest) return null;
    const parsed = parseArtworkInput(artworkValue || searchParams.get("artwork") || null);
    if (parsed) return parsed;
    return activeManifest.coverPlan.source;
  }, [activeManifest, artworkValue, issue, searchParams]);

  const artworkUrl = artworkSource ? resolveArtworkUrl(artworkSource, issue?.number ?? 1) : null;
  const exportMode = searchParams.get("view") === "export";

  const coverInput = useMemo(() => {
    if (!issue || !activeManifest) return null;
    return {
      issueId: activeManifest.issueId,
      issueNumber: issue.number,
      canonicalTitle: issue.title,
      subtitle: issue.theme,
      publicationName: "BLACKFILES",
      visualProfileId: activeManifest.visualProfileId,
      visualProfileVersion: activeManifest.visualProfileVersion,
      artwork: artworkSource ?? activeManifest.coverPlan.source,
      articleRevisionId: activeManifest.articleRevisionId,
      outputFormat: "preview" as const,
      generatedAt: new Date().toISOString(),
      outputDimensions: {
        width: 1600,
        height: 2400,
      },
    };
  }, [activeManifest, artworkSource, issue]);

  const validation = coverInput ? validateCoverCompositionInput(coverInput) : null;
  const readinessReasons = activeManifest ? getPublicationReadinessReasons(activeManifest) : [];

  useEffect(() => {
    if (allowExportPreview) {
      return;
    }
    if (!loading && (!user || !isAdmin)) {
      navigate("/");
    }
  }, [allowExportPreview, isAdmin, loading, navigate, user]);

  if (loading && !allowExportPreview) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!allowExportPreview && (!user || !isAdmin)) {
    return null;
  }

  if (!issue || !activeManifest || !visualProfile || !coverInput || !validation) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-5xl px-4 py-24">
          <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.34em] text-[#ff8b4d]">
              Cover preview unavailable
            </p>
            <h1 className="mt-3 font-serif text-4xl text-[#f3e8da]">Issue manifest not found</h1>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`Cover Preview Issue ${String(issue.number).padStart(2, "0")}`}
        description="Internal cover preview for the deterministic visual production system."
        path={`/admin/visuals/cover-preview/${issue.number}`}
        noindex
      />
      <div className="min-h-screen bg-[#050505] text-[#f2e7d8]">
        {exportMode ? (
          <main className="h-screen w-screen overflow-hidden bg-[#050505]">
            <EditorialCoverV2
              input={coverInput}
              artworkUrl={artworkUrl}
              validation={validation}
              profile={visualProfile}
              className="h-full w-full rounded-none border-0"
              mode="export"
            />
          </main>
        ) : (
          <>
        <Header />
        <main className="mx-auto max-w-[1600px] px-4 pb-16 pt-[96px] sm:px-6 lg:px-8">
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.12fr)_380px]">
            <section className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.34em] text-[#ff8b4d]">
                    Internal preview
                  </p>
                  <h1 className="mt-2 font-serif text-[clamp(2rem,3vw,3rem)] font-semibold leading-none tracking-[-0.04em]">
                    Issue #{String(issue.number).padStart(2, "0")} cover
                  </h1>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="font-mono uppercase tracking-[0.24em]">
                    {activeManifest.planStatus}
                  </Badge>
                  <Badge variant="secondary" className="font-mono uppercase tracking-[0.24em]">
                    {validation.titleFitStrategy}
                  </Badge>
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-4 shadow-[0_40px_120px_rgba(0,0,0,0.36)]">
                <EditorialCoverV2
                  input={coverInput}
                  artworkUrl={artworkUrl}
                  validation={validation}
                  profile={visualProfile}
                  className="w-full h-auto max-w-full"
                />
              </div>
            </section>

            <aside className="space-y-5">
              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#ff8b4d]">
                  Artwork source
                </p>
                <div className="mt-3 flex gap-2">
                  <Input
                    value={artworkValue}
                    onChange={(event) => setArtworkValue(event.target.value)}
                    placeholder="Paste a local /@fs path, absolute file path, or remote URL"
                    className="border-white/10 bg-[#090909] font-mono text-[12px]"
                  />
                  <Button
                    variant="outline"
                    onClick={() => setSearchParams(artworkValue ? { artwork: artworkValue } : {})}
                    className="shrink-0"
                  >
                    Update
                  </Button>
                </div>
                <p className="mt-3 text-[11px] leading-5 text-[#f2e7d8]/62">
                  Absolute local file paths resolve through Vite&apos;s `@fs` dev-server bridge.
                </p>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#ff8b4d]">
                  Validation
                </p>
                {validation.ok ? (
                  <p className="mt-3 text-sm text-[#8ad0ff]">Cover input validates cleanly.</p>
                ) : (
                  <ul className="mt-3 space-y-2 text-sm text-[#ff8b4d]">
                    {validation.errors.map((error) => (
                      <li key={error} className="flex items-start gap-2">
                        <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>{error}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {readinessReasons.length > 0 && (
                  <div className="mt-4 rounded-[18px] border border-[#ff8b4d]/20 bg-[#ff8b4d]/8 p-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#ffb27d]">
                      Readiness gates
                    </p>
                    <ul className="mt-2 space-y-1 text-[12px] leading-5 text-[#f2e7d8]/74">
                      {readinessReasons.map((reason) => (
                        <li key={reason}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#ff8b4d]">
                  Manifest
                </p>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-[#f2e7d8]/60">Profile</dt>
                    <dd className="font-mono text-right text-[#f2e7d8]">
                      {activeManifest.visualProfileId} v{activeManifest.visualProfileVersion}
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-[#f2e7d8]/60">Article revision</dt>
                    <dd className="font-mono text-right text-[11px] text-[#f2e7d8]">{activeManifest.articleRevisionId}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-[#f2e7d8]/60">Cover source</dt>
                    <dd className="font-mono text-right text-[11px] text-[#f2e7d8]">
                      {artworkSource?.sourceKind}:{artworkSource?.source}
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-[#f2e7d8]/60">Dimensions</dt>
                    <dd className="font-mono text-right text-[#f2e7d8]">1600 × 2400</dd>
                  </div>
                </dl>
              </div>
            </aside>
          </div>
        </main>
        <Footer />
          </>
        )}
      </div>
    </>
  );
};

export default AdminVisualCoverPreview;
