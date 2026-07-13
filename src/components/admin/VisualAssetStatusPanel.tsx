import { Link } from "react-router-dom";
import { Copy, Loader2, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { issues, type Issue } from "@/data/issues";
import { computeArticleRevisionId } from "@/lib/visual-production/article-revision";
import { getVisualIssueManifest, resolveIssueAssetRecord } from "@/lib/visual-production/asset-repository";
import { validateIssueMediaPlan } from "@/lib/visual-production/media-plan-validation";
import type { IssueMediaPlan } from "@/lib/visual-production/media-plan";

const issueIdFor = (issueNumber: number) => `issue-${String(issueNumber).padStart(2, "0")}`;

const buildFallbackPlan = (issue: Issue): IssueMediaPlan => {
  const articleRevisionId = computeArticleRevisionId({
    title: issue.title,
    subtitle: issue.theme,
    summary: issue.sections.find((section) => section.type === "executive_summary")?.content,
    theme: issue.theme,
    sections: issue.sections.map((section) => ({
      id: section.id,
      title: section.title,
      content: section.content,
    })),
  });

  return {
    issueId: issueIdFor(issue.number),
    issueNumber: issue.number,
    articleRevisionId,
    visualProfileId: "editorial-cover-v2",
    visualProfileVersion: 1,
    planStatus: "unplanned",
    approvalStatus: "draft",
    coverPlan: {
      assetKey: `${issueIdFor(issue.number)}-cover`,
      editorialPurpose: "Preview the current issue cover.",
      artDirection: "Use the currently published cover as the preview baseline.",
      generationMethod: "editor-upload",
      prohibitedImplications: ["No fabricated statistics", "No unapproved public replacement"],
      sourceIds: [],
      requiredLabels: [`Issue #${String(issue.number).padStart(2, "0")}`],
      altText: `Issue ${String(issue.number).padStart(2, "0")} cover preview`,
      caption: "Preview baseline generated from the current public cover.",
      placement: "cover",
      aspectRatio: "2:3",
      approvalStatus: "draft",
      source: {
        sourceKind: "legacy-ref",
        source: issue.coverImage ?? issueIdFor(issue.number),
      },
    },
    supportingAssetPlans: issue.sections
      .filter((section) => section.media && section.media.length > 0)
      .slice(0, 3)
      .map((section, index) => ({
        assetKey: `${issueIdFor(issue.number)}-support-${index + 1}`,
        sectionKey: section.id,
        editorialPurpose: section.title ?? section.type,
        kind: index === 0 ? "mechanism" : index === 1 ? "evidence" : "defense",
        generationMethod: "editor-upload",
        prohibitedImplications: ["No fabricated statistics", "No unsupported claims"],
        sourceIds: section.media?.map((media) => media.id) ?? [],
        requiredLabels: [`Section ${String(index + 1).padStart(2, "0")}`],
        altText: section.media?.[0]?.alt ?? `${issue.title} supporting visual`,
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

export const VisualAssetStatusPanel = () => {
  const rows = issues.map((issue) => {
    const manifest = getVisualIssueManifest(issue.number) ?? buildFallbackPlan(issue);
    const validation = validateIssueMediaPlan(manifest);
    const fallbackAsset = resolveIssueAssetRecord(issue, manifest);
    const approvedCount = [manifest.coverPlan, ...manifest.supportingAssetPlans].filter(
      (asset) => asset.approvalStatus === "approved"
    ).length;
    const currentRevision = computeArticleRevisionId({
      title: issue.title,
      subtitle: issue.theme,
      summary: issue.sections.find((section) => section.type === "executive_summary")?.content,
      theme: issue.theme,
      sections: issue.sections.map((section) => ({
        id: section.id,
        title: section.title,
        content: section.content,
      })),
    });

    return {
      issue,
      manifest,
      validation,
      fallbackAsset,
      approvedCount,
      currentRevision,
      stale: manifest.articleRevisionId !== currentRevision,
      previewPath: `/admin/visuals/cover-preview/${issue.number}`,
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.34em] text-[#ff8b4d]">
            Visual system
          </p>
          <h2 className="mt-2 font-serif text-[clamp(1.8rem,2.4vw,2.6rem)] font-semibold leading-none tracking-[-0.04em] text-[#f3e8da]">
            Issue visual manifests and readiness
          </h2>
        </div>
        <span className="rounded-full border border-white/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.24em] text-[#f2e7d8]/70">
          {rows.length} issues
        </span>
      </div>

      <div className="overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.03]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Issue</TableHead>
              <TableHead>Revision</TableHead>
              <TableHead>Profile</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assets</TableHead>
              <TableHead>Validation</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(({ issue, manifest, validation, approvedCount, stale, previewPath, currentRevision }) => (
              <TableRow key={issue.number}>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-serif text-lg text-[#f3e8da]">
                      Issue #{String(issue.number).padStart(2, "0")}
                    </div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#ff8b4d]/76">
                      {issue.theme}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-[10px] leading-5 text-[#f2e7d8]/70">
                  <div>Current: {currentRevision}</div>
                  <div>Manifest: {manifest.articleRevisionId}</div>
                  {stale && <div className="text-[#ff8b4d]">Stale</div>}
                </TableCell>
                <TableCell className="font-mono text-[10px] leading-5 text-[#f2e7d8]/70">
                  <div>{manifest.visualProfileId}</div>
                  <div>v{manifest.visualProfileVersion}</div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={manifest.planStatus === "approved" ? "default" : "outline"} className="font-mono uppercase tracking-[0.22em]">
                      {manifest.planStatus}
                    </Badge>
                    <Badge variant={manifest.approvalStatus === "approved" ? "default" : "secondary"} className="font-mono uppercase tracking-[0.22em]">
                      {manifest.approvalStatus}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-[10px] leading-5 text-[#f2e7d8]/70">
                  <div>Cover: {manifest.coverPlan.approvalStatus}</div>
                  <div>Supporting: {manifest.supportingAssetPlans.length}</div>
                  <div>Approved: {approvedCount}</div>
                </TableCell>
                <TableCell className="text-[11px] leading-5 text-[#f2e7d8]/70">
                  {validation.ok ? (
                    <span className="text-[#8ad0ff]">Ready for preview</span>
                  ) : (
                    <div className="space-y-1 text-[#ff8b4d]">
                      {validation.errors.slice(0, 3).map((error) => (
                        <div key={error} className="flex items-start gap-2">
                          <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                          <span>{error}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-wrap justify-end gap-2">
                    <Button asChild size="sm" variant="outline" className="gap-2">
                      <Link to={previewPath}>Preview</Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="gap-2"
                      onClick={async () => {
                        await navigator.clipboard.writeText(`npm run visuals:scaffold -- --issue=${issue.number}`);
                      }}
                    >
                      <Copy className="h-3.5 w-3.5" />
                      Scaffold cmd
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
