import type { IssueMediaPlan } from "@/lib/visual-production/media-plan";

export type VisualWorkflowState =
  | "ARTICLE_APPROVED"
  | "MEDIA_PLAN_REQUIRED"
  | "MEDIA_PLAN_VALIDATED"
  | "ARTWORK_REQUIRED"
  | "COVER_RENDER_REQUIRED"
  | "SUPPORTING_VISUALS_REQUIRED"
  | "VISUAL_QA_REQUIRED"
  | "VISUALS_APPROVED"
  | "PUBLICATION_READY";

export type VisualWorkflowFailureReason =
  | "manifest-stale"
  | "cover-missing"
  | "profile-version-missing"
  | "insufficient-supporting-assets"
  | "approved-assets-missing"
  | "alt-text-missing"
  | "factual-visual-missing-source-ids"
  | "cover-validation-failed";

const transitions: Record<VisualWorkflowState, VisualWorkflowState[]> = {
  ARTICLE_APPROVED: ["MEDIA_PLAN_REQUIRED"],
  MEDIA_PLAN_REQUIRED: ["MEDIA_PLAN_VALIDATED"],
  MEDIA_PLAN_VALIDATED: ["ARTWORK_REQUIRED"],
  ARTWORK_REQUIRED: ["COVER_RENDER_REQUIRED"],
  COVER_RENDER_REQUIRED: ["SUPPORTING_VISUALS_REQUIRED"],
  SUPPORTING_VISUALS_REQUIRED: ["VISUAL_QA_REQUIRED"],
  VISUAL_QA_REQUIRED: ["VISUALS_APPROVED"],
  VISUALS_APPROVED: ["PUBLICATION_READY"],
  PUBLICATION_READY: [],
};

export const validateWorkflowTransition = (from: VisualWorkflowState, to: VisualWorkflowState) => {
  const allowed = transitions[from] ?? [];
  return allowed.includes(to);
};

export const getPublicationReadinessReasons = (plan: IssueMediaPlan) => {
  const failures: VisualWorkflowFailureReason[] = [];

  if (plan.articleRevisionId.length === 0) failures.push("manifest-stale");
  if (!plan.coverPlan) failures.push("cover-missing");
  if (!plan.visualProfileVersion) failures.push("profile-version-missing");
  if (plan.supportingAssetPlans.length < 3) failures.push("insufficient-supporting-assets");
  if (plan.approvalStatus !== "approved") failures.push("approved-assets-missing");

  if (!plan.coverPlan.altText.trim()) failures.push("alt-text-missing");

  if (plan.supportingAssetPlans.some((asset) => (asset.kind === "data" || asset.kind === "evidence" || asset.kind === "timeline") && asset.sourceIds.length === 0)) {
    failures.push("factual-visual-missing-source-ids");
  }

  if (plan.coverPlan.approvalStatus !== "approved") {
    failures.push("cover-validation-failed");
  }

  return failures;
};

export const isPublicationReady = (plan: IssueMediaPlan) => getPublicationReadinessReasons(plan).length === 0;
