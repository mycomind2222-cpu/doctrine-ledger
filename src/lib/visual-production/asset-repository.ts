import { resolveIssue01SupportingMedia, resolveIssueCover } from "@/lib/issue-assets";
import type { Issue } from "@/data/issues";
import { validateIssueMediaPlan } from "@/lib/visual-production/media-plan-validation";
import type { IssueMediaPlan } from "@/lib/visual-production/media-plan";
import type { VisualAssetRecord } from "@/lib/visual-production/asset-manifest";
import { resolveCoverArtworkRef } from "@/lib/visual-production/asset-manifest";

const globImporter = (import.meta as ImportMeta & {
  glob?: (pattern: string, options: { eager: true; import: "default" }) => Record<string, unknown>;
}).glob;

const manifestModules = globImporter
  ? globImporter("../../../content/visuals/*.json", { eager: true, import: "default" })
  : ({} as Record<string, unknown>);

const toManifest = (value: unknown): IssueMediaPlan | null => {
  if (!value || typeof value !== "object") return null;
  return value as IssueMediaPlan;
};

const manifestPathForIssue = (issueNumber: number) => `/content/visuals/issue-${String(issueNumber).padStart(2, "0")}.json`;

export const listVisualIssueManifests = (): IssueMediaPlan[] => {
  return Object.values(manifestModules)
    .map(toManifest)
    .filter((manifest): manifest is IssueMediaPlan => Boolean(manifest))
    .sort((left, right) => left.issueNumber - right.issueNumber);
};

export const getVisualIssueManifest = (issueNumber: number): IssueMediaPlan | null => {
  return toManifest(manifestModules[manifestPathForIssue(issueNumber)] ?? null);
};

export const validateLoadedManifest = (manifest: IssueMediaPlan) => validateIssueMediaPlan(manifest);

export const resolveLegacyAssetRef = (ref: string) => {
  const cover = resolveIssueCover(ref);
  if (cover) return cover;

  const supporting = resolveIssue01SupportingMedia(ref);
  if (supporting) return supporting;

  return null;
};

export const resolveManifestArtwork = (sourceKind: string, sourceValue: string) => {
  if (sourceKind === "approved-remote-url" || sourceKind === "local-development") {
    return sourceValue;
  }

  if (sourceKind === "approved-manifest") {
    return sourceValue;
  }

  if (sourceKind === "legacy-local-asset") {
    return resolveLegacyAssetRef(sourceValue) ?? sourceValue;
  }

  return null;
};

export const resolveIssueAssetRecord = (issue: Issue, manifest?: IssueMediaPlan | null): VisualAssetRecord => {
  const coverRef = manifest?.coverPlan.source ?? {
    sourceKind: "legacy-ref",
    source: issue.coverImage ?? `issue-${String(issue.number).padStart(2, "0")}`,
  };
  const coverUrl = resolveCoverArtworkRef(coverRef, resolveLegacyAssetRef) ?? resolveIssueCover(issue.coverImage) ?? "";

  return {
    assetKey: `issue-${String(issue.number).padStart(2, "0")}-cover`,
    issueId: `issue-${String(issue.number).padStart(2, "0")}`,
    issueNumber: issue.number,
    role: "cover",
    profileId: manifest?.visualProfileId ?? "editorial-cover-v2",
    profileVersion: manifest?.visualProfileVersion ?? 1,
    articleRevisionId: manifest?.articleRevisionId ?? issue.revisionId ?? "",
    approvalStatus: manifest?.coverPlan.approvalStatus ?? "draft",
    placement: "cover",
    source: {
      kind: manifest?.coverPlan.approvalStatus === "approved" ? "approved-manifest" : "legacy-local-asset",
      value: coverRef.source,
    },
    sourceUrl: coverUrl || undefined,
    mimeType: coverUrl.endsWith(".svg") ? "image/svg+xml" : "image/png",
    altText: manifest?.coverPlan.altText ?? `Issue ${String(issue.number).padStart(2, "0")} cover`,
    caption: manifest?.coverPlan.caption,
    labels: manifest?.coverPlan.requiredLabels ?? [],
    dimensions: {
      width: 1600,
      height: 2400,
    },
    updatedAt: manifest?.updatedAt ?? issue.updatedAt ?? issue.publishDate,
  };
};

export const selectPublicVisualAsset = (
  approvedCurrentManifest: VisualAssetRecord | null,
  approvedRemoteUrl: string | null,
  existingLocalAsset: VisualAssetRecord | null,
  placeholder: VisualAssetRecord,
) => {
  if (approvedCurrentManifest?.approvalStatus === "approved" && approvedCurrentManifest.sourceUrl) {
    return approvedCurrentManifest;
  }

  if (approvedRemoteUrl) {
    return {
      ...placeholder,
      approvalStatus: "approved",
      source: {
        kind: "approved-remote-url",
        value: approvedRemoteUrl,
      },
      sourceUrl: approvedRemoteUrl,
    } satisfies VisualAssetRecord;
  }

  if (existingLocalAsset) {
    return existingLocalAsset;
  }

  return placeholder;
};

export const createPlaceholderAssetRecord = (issueNumber: number, title: string): VisualAssetRecord => ({
  assetKey: `placeholder-${String(issueNumber).padStart(2, "0")}`,
  issueId: `issue-${String(issueNumber).padStart(2, "0")}`,
  issueNumber,
  role: "cover",
  profileId: "editorial-cover-v2",
  profileVersion: 1,
  articleRevisionId: "",
  approvalStatus: "draft",
  placement: "preview",
  source: {
    kind: "placeholder",
    value: "",
  },
  mimeType: "image/png",
  altText: title,
  labels: [],
  dimensions: {
    width: 1600,
    height: 2400,
  },
  updatedAt: new Date().toISOString(),
});
