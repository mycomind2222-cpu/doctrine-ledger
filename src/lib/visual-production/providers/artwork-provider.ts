export interface ArtworkProviderMetadata {
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

export interface ArtworkProviderResult {
  url: string;
  metadata: ArtworkProviderMetadata;
}

export interface ArtworkProvider {
  generateArtwork: (args: {
    prompt: string;
    issueNumber: number;
    issueTitle: string;
    profileId: string;
    profileVersion: number;
    outputDimensions: { width: number; height: number };
  }) => Promise<ArtworkProviderResult>;
}

export const createDisabledArtworkProvider = (): ArtworkProvider => ({
  generateArtwork: async (args) => ({
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
