import { editorialCoverV2 } from "@/config/visual-profiles/editorial-cover-v2";
import { createVisualProfileRegistry } from "@/lib/visual-production/visual-profile";

export const visualProfileRegistry = createVisualProfileRegistry([editorialCoverV2]);

export const listVisualProfiles = () => visualProfileRegistry.profiles;

export const getVisualProfile = (profileId: string) => visualProfileRegistry.getVisualProfile(profileId);

export const getVisualProfileByVersion = (profileId: string, version: number) =>
  visualProfileRegistry.getVisualProfileByVersion(profileId, version);
