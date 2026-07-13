import type { AssetApprovalStatus, AssetPlacement } from "@/lib/visual-production/media-plan";
import type { CoverArtworkRef } from "@/lib/visual-production/cover-types";

export type VisualAssetSourceKind = "approved-manifest" | "approved-remote-url" | "legacy-local-asset" | "local-development" | "placeholder";

export interface VisualAssetSource {
  kind: VisualAssetSourceKind;
  value: string;
}

export interface ProviderRenderMetadata {
  provider: string;
  model: string;
  promptVersion: string;
  prompt: string;
  generatedAt: string;
  latencyMs?: number;
  width: number;
  height: number;
  contentHash?: string;
  status: "disabled" | "queued" | "generated" | "failed";
}

export interface VisualAssetRecord {
  assetKey: string;
  issueId: string;
  issueNumber: number;
  role: "cover" | "supporting";
  sectionKey?: string;
  profileId: string;
  profileVersion: number;
  articleRevisionId: string;
  approvalStatus: AssetApprovalStatus;
  placement: AssetPlacement;
  source: VisualAssetSource;
  sourceUrl?: string;
  localPath?: string;
  mimeType: string;
  altText: string;
  caption?: string;
  labels: string[];
  dimensions: {
    width: number;
    height: number;
  };
  provider?: ProviderRenderMetadata;
  updatedAt: string;
}

export const resolveCoverArtworkRef = (ref: CoverArtworkRef, resolver?: (source: string) => string | null) => {
  if (ref.sourceKind === "remote-url" || ref.sourceKind === "data-url") {
    return ref.source;
  }

  if (ref.sourceKind === "local-path") {
    return `/@fs${ref.source.startsWith("/") ? ref.source : `/${ref.source}`}`;
  }

  if (ref.sourceKind === "legacy-ref") {
    return resolver?.(ref.source) ?? null;
  }

  return null;
};
