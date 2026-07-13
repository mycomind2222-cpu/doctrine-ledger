import type { IssueMediaPlan, SupportingAssetPlan } from "@/lib/visual-production/media-plan";

export interface MediaPlanValidationResult {
  ok: boolean;
  errors: string[];
  warnings: string[];
}

const isNonEmptyString = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;

const validateAssetPlan = (asset: SupportingAssetPlan, index: number, errors: string[]) => {
  const prefix = `Supporting asset #${index + 1}`;

  if (!isNonEmptyString(asset.assetKey)) errors.push(`${prefix} is missing an asset key.`);
  if (!isNonEmptyString(asset.sectionKey)) errors.push(`${prefix} is missing a section key.`);
  if (!isNonEmptyString(asset.altText)) errors.push(`${prefix} is missing alt text.`);
  if (!isNonEmptyString(asset.caption)) {
    // captions are optional, no-op
  }
  if ((asset.kind === "data" || asset.kind === "evidence" || asset.kind === "timeline") && asset.sourceIds.length === 0) {
    errors.push(`${prefix} with factual content must include source IDs.`);
  }
};

export const validateIssueMediaPlan = (plan: IssueMediaPlan): MediaPlanValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!Number.isInteger(plan.issueNumber) || plan.issueNumber < 1) {
    errors.push("Issue number must be a positive integer.");
  }

  if (!isNonEmptyString(plan.issueId)) {
    errors.push("Issue ID is required.");
  }

  if (!isNonEmptyString(plan.articleRevisionId)) {
    errors.push("Article revision ID is required.");
  }

  if (!isNonEmptyString(plan.visualProfileId)) {
    errors.push("Visual profile ID is required.");
  }

  if (!Number.isInteger(plan.visualProfileVersion) || plan.visualProfileVersion < 1) {
    errors.push("Visual profile version is required.");
  }

  if (!plan.coverPlan) {
    errors.push("Cover plan is required.");
  } else {
    if (!isNonEmptyString(plan.coverPlan.assetKey)) errors.push("Cover plan is missing an asset key.");
    if (!isNonEmptyString(plan.coverPlan.altText)) errors.push("Cover plan is missing alt text.");
    if (plan.coverPlan.aspectRatio !== "2:3") errors.push("Cover plan must use a 2:3 aspect ratio.");
  }

  if (plan.supportingAssetPlans.length < 3) {
    errors.push("Publication-ready manifests must include at least three supporting asset plans.");
  }

  const seen = new Set<string>();
  plan.supportingAssetPlans.forEach((asset, index) => {
    if (seen.has(asset.assetKey)) {
      errors.push(`Duplicate supporting asset key "${asset.assetKey}" detected.`);
    }
    seen.add(asset.assetKey);
    validateAssetPlan(asset, index, errors);
  });

  if (plan.approvalStatus === "approved" && plan.planStatus !== "approved") {
    warnings.push("Approval status is approved but plan status is not approved.");
  }

  if (plan.planStatus === "approved" && plan.supportingAssetPlans.length < 3) {
    errors.push("Approved plans require at least three supporting assets.");
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
  };
};

export const isPublicationReady = (plan: IssueMediaPlan) => {
  const validation = validateIssueMediaPlan(plan);
  return validation.ok && plan.planStatus === "approved" && plan.approvalStatus === "approved";
};
