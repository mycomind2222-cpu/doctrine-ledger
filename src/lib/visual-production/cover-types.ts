import type { VisualBounds } from "@/lib/visual-production/visual-profile";

export type CoverOutputFormat = "preview" | "png" | "webp";

export interface CoverArtworkRef {
  sourceKind: "remote-url" | "local-path" | "legacy-ref" | "data-url";
  source: string;
  mimeType?: string;
  alt?: string;
}

export interface CoverCompositionInput {
  issueId: string;
  issueNumber: number;
  canonicalTitle: string;
  subtitle?: string | null;
  publicationName: string;
  visualProfileId: string;
  visualProfileVersion: number;
  artwork: CoverArtworkRef;
  articleRevisionId: string;
  outputFormat: CoverOutputFormat;
  generatedAt: string;
  outputDimensions: {
    width: number;
    height: number;
  };
}

export interface CoverValidationResult {
  ok: boolean;
  errors: string[];
  warnings: string[];
  titleFitStrategy: "scale-to-fit" | "wrap-tight" | "wrap-and-condense";
}

export interface CoverCompositionResult {
  input: CoverCompositionInput;
  validation: CoverValidationResult;
  renderedAt: string;
  titleFitStrategy: CoverValidationResult["titleFitStrategy"];
  previewDimensions: {
    width: number;
    height: number;
  };
}

export interface CoverRenderManifest {
  issueId: string;
  issueNumber: number;
  visualProfileId: string;
  visualProfileVersion: number;
  articleRevisionId: string;
  publicationName: string;
  canonicalTitle: string;
  subtitle?: string | null;
  outputFormat: CoverOutputFormat;
  outputDimensions: {
    width: number;
    height: number;
  };
  artwork: CoverArtworkRef;
  titleFitStrategy: CoverValidationResult["titleFitStrategy"];
  generatedAt: string;
  renderedAt: string;
  renderedAssetPaths: {
    png?: string;
    webp?: string;
    thumbnail?: string;
  };
  profileBounds: VisualBounds;
  warnings: string[];
}
