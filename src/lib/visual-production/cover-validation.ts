import { getVisualProfile, getVisualProfileByVersion } from "@/config/visual-profiles";
import type { CoverCompositionInput, CoverValidationResult } from "@/lib/visual-production/cover-types";

const isNonEmptyString = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;

const estimateTitleFitStrategy = (title: string, boundsWidth: number) => {
  const normalized = title.trim().replace(/\s+/g, " ");
  const charactersPerLine = Math.max(1, Math.floor(boundsWidth / 32));
  const lineCount = Math.max(1, Math.ceil(normalized.length / charactersPerLine));

  if (lineCount <= 3 && normalized.length < 92) {
    return "wrap-tight" as const;
  }

  if (lineCount <= 4 && normalized.length < 140) {
    return "wrap-and-condense" as const;
  }

  return "scale-to-fit" as const;
};

export const validateCoverCompositionInput = (input: CoverCompositionInput): CoverValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!Number.isInteger(input.issueNumber) || input.issueNumber < 1) {
    errors.push("Issue number must be a positive integer.");
  }

  if (!isNonEmptyString(input.canonicalTitle)) {
    errors.push("Canonical title is required.");
  }

  if (!isNonEmptyString(input.publicationName)) {
    errors.push("Publication name is required.");
  }

  if (!isNonEmptyString(input.articleRevisionId)) {
    errors.push("Article revision ID is required.");
  }

  if (!isNonEmptyString(input.visualProfileId)) {
    errors.push("Visual profile ID is required.");
  }

  const profile = getVisualProfileByVersion(input.visualProfileId, input.visualProfileVersion);
  if (!profile) {
    errors.push(`Unsupported visual profile ${input.visualProfileId}@${input.visualProfileVersion}.`);
  }

  if (!input.artwork || !isNonEmptyString(input.artwork.source)) {
    errors.push("Artwork source is required.");
  }

  if (!input.outputDimensions?.width || !input.outputDimensions?.height) {
    errors.push("Output dimensions are required.");
  } else if (input.outputDimensions.width !== 1600 || input.outputDimensions.height !== 2400) {
    errors.push("Only 1600 × 2400 output is supported for deterministic cover rendering.");
  }

  if (input.outputFormat === "webp" && !input.artwork.source) {
    warnings.push("WebP export requested without a resolved artwork source.");
  }

  if (profile) {
    const strategy = estimateTitleFitStrategy(input.canonicalTitle, profile.layout.titleBounds.width);
    if (strategy === "scale-to-fit" && input.canonicalTitle.trim().length > 180) {
      errors.push("Title overflows the locked cover title bounds.");
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    titleFitStrategy: estimateTitleFitStrategy(input.canonicalTitle, profile?.layout.titleBounds.width ?? 720),
  };
};

export const assertValidCoverCompositionInput = (input: CoverCompositionInput) => {
  const validation = validateCoverCompositionInput(input);
  if (!validation.ok) {
    throw new Error(validation.errors.join(" "));
  }
  return validation;
};
