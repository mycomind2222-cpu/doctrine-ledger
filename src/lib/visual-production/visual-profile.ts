export type VisualProfileVersion = number;

export interface VisualBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CoverPalette {
  background: string;
  surface: string;
  foreground: string;
  muted: string;
  accent: string;
  cyan: string;
  border: string;
  glow: string;
  shadow: string;
}

export interface CoverTypographyProfile {
  mastheadFontFamily: string;
  titleFontFamily: string;
  metadataFontFamily: string;
  mastheadSize: number;
  titleMinSize: number;
  titleMaxSize: number;
  subtitleSize: number;
  metadataSize: number;
  mastheadTracking: string;
  titleTracking: string;
  subtitleTracking: string;
  metadataTracking: string;
  titleLineHeight: number;
  subtitleLineHeight: number;
}

export interface CoverLayoutProfile {
  canvasWidth: number;
  canvasHeight: number;
  aspectRatio: "2:3";
  safeMargin: number;
  mastheadBounds: VisualBounds;
  issueNumberBounds: VisualBounds;
  titleBounds: VisualBounds;
  subtitleBounds: VisualBounds;
  artworkFrameBounds: VisualBounds;
  footerBounds: VisualBounds;
}

export interface ArtworkDoctrine {
  promptVersion: string;
  prompt: string;
  supportingVisualDoctrine: string[];
  prohibitedVisualPatterns: string[];
}

export interface VisualProfile {
  id: string;
  version: VisualProfileVersion;
  label: string;
  description: string;
  layout: CoverLayoutProfile;
  palette: CoverPalette;
  typography: CoverTypographyProfile;
  titleFitBehavior: "scale-to-fit" | "wrap-tight" | "wrap-and-condense";
  minTitleSize: number;
  maxTitleSize: number;
  artworkDoctrine: ArtworkDoctrine;
}

export interface VisualProfileRegistry {
  profiles: VisualProfile[];
  getVisualProfile: (profileId: string) => VisualProfile | undefined;
  getVisualProfileByVersion: (profileId: string, version: number) => VisualProfile | undefined;
}

export const createVisualProfileRegistry = (profiles: VisualProfile[]): VisualProfileRegistry => {
  const byId = new Map<string, VisualProfile[]>();
  for (const profile of profiles) {
    const existing = byId.get(profile.id) ?? [];
    existing.push(profile);
    existing.sort((left, right) => left.version - right.version);
    byId.set(profile.id, existing);
  }

  return {
    profiles,
    getVisualProfile: (profileId) => byId.get(profileId)?.at(-1),
    getVisualProfileByVersion: (profileId, version) =>
      byId.get(profileId)?.find((profile) => profile.version === version),
  };
};
