export interface SupportingVisualProviderMetadata {
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

export interface SupportingVisualProviderResult {
  url: string;
  metadata: SupportingVisualProviderMetadata;
}

export interface SupportingVisualProvider {
  generateVisual: (args: {
    prompt: string;
    issueNumber: number;
    sectionKey: string;
    profileId: string;
    profileVersion: number;
    outputDimensions: { width: number; height: number };
  }) => Promise<SupportingVisualProviderResult>;
}

export const createDisabledSupportingVisualProvider = (): SupportingVisualProvider => ({
  generateVisual: async (args) => ({
    url: "",
    metadata: {
      provider: "disabled",
      model: "disabled",
      promptVersion: "disabled",
      prompt: args.prompt,
      generatedAt: new Date().toISOString(),
      width: args.outputDimensions.width,
      height: args.outputDimensions.height,
      status: "disabled",
    },
  }),
});
