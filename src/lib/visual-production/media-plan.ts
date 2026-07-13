import type { CoverArtworkRef } from "@/lib/visual-production/cover-types";

export type MediaPlanStatus = "unplanned" | "draft" | "template" | "ready" | "approved" | "published";

export type AssetGenerationMethod =
  | "ai-artwork"
  | "svg-template"
  | "html-render"
  | "programmatic-chart"
  | "editor-upload";

export type AssetPlacement = "cover" | "hero" | "body" | "sidebar" | "inline" | "footer" | "preview";

export type AssetApprovalStatus = "draft" | "pending" | "approved" | "rejected" | "stale";

export interface CoverPlan {
  assetKey: string;
  editorialPurpose: string;
  artDirection: string;
  generationMethod: AssetGenerationMethod;
  prompt?: string;
  prohibitedImplications: string[];
  sourceIds: string[];
  requiredLabels: string[];
  altText: string;
  caption?: string;
  placement: AssetPlacement;
  aspectRatio: "2:3";
  approvalStatus: AssetApprovalStatus;
  source: CoverArtworkRef;
}

export interface SupportingAssetPlan {
  assetKey: string;
  sectionKey: string;
  editorialPurpose: string;
  kind: "mechanism" | "evidence" | "timeline" | "data" | "comparison" | "consequence" | "defense" | "action";
  generationMethod: AssetGenerationMethod;
  prompt?: string;
  prohibitedImplications: string[];
  sourceIds: string[];
  requiredLabels: string[];
  altText: string;
  caption?: string;
  placement: AssetPlacement;
  aspectRatio: "wide" | "landscape" | "square" | "portrait";
  approvalStatus: AssetApprovalStatus;
  source: CoverArtworkRef;
}

export interface IssueMediaPlan {
  issueId: string;
  issueNumber: number;
  articleRevisionId: string;
  visualProfileId: string;
  visualProfileVersion: number;
  planStatus: MediaPlanStatus;
  approvalStatus: AssetApprovalStatus;
  coverPlan: CoverPlan;
  supportingAssetPlans: SupportingAssetPlan[];
  createdAt: string;
  updatedAt: string;
  notes?: string[];
}
