const assetUrl = (relativePath: string) => new URL(relativePath, import.meta.url).href;

const issue01Cover = assetUrl("../assets/issues/issue-01/cover.png");
const issue01Support01 = assetUrl("../assets/issues/issue-01/supporting-image-01.svg");
const issue01Support02 = assetUrl("../assets/issues/issue-01/supporting-image-02.svg");
const issue01Support03 = assetUrl("../assets/issues/issue-01/supporting-image-03.svg");
const issue02Support01 = assetUrl("../assets/issues/issue-02/supporting-image-01.svg");
const issue02Support02 = assetUrl("../assets/issues/issue-02/supporting-image-02.svg");
const issue02Support03 = assetUrl("../assets/issues/issue-02/supporting-image-03.svg");
const issue03Support01 = assetUrl("../assets/issues/issue-03/supporting-image-01.svg");
const issue03Support02 = assetUrl("../assets/issues/issue-03/supporting-image-02.svg");
const issue03Support03 = assetUrl("../assets/issues/issue-03/supporting-image-03.svg");
const issue02Cover = assetUrl("../assets/covers/issue-02.png");
const issue03Cover = assetUrl("../assets/covers/issue-03.png");
const issue04Cover = assetUrl("../assets/covers/issue-04.png");
const issue05Cover = assetUrl("../assets/covers/issue-05.png");
const issue06Cover = assetUrl("../assets/covers/issue-06.png");
const issue07Cover = assetUrl("../assets/covers/issue-07.png");
const issue08Cover = assetUrl("../assets/covers/issue-08.png");
const issue09Cover = assetUrl("../assets/covers/issue-09.png");
const issue10Cover = assetUrl("../assets/covers/issue-10.png");
const issue11Cover = assetUrl("../assets/covers/issue-11.png");
const issue21Cover = assetUrl("../assets/covers/issue-21.jpg");
const issue22Cover = assetUrl("../assets/covers/issue-22.jpg");
const issue23Cover = assetUrl("../assets/covers/issue-23.jpg");
const issue24Cover = assetUrl("../assets/covers/issue-24.jpg");
const issue25Cover = assetUrl("../assets/covers/issue-25.jpg");
const issue27Cover = assetUrl("../assets/covers/issue-27-openclaw.jpg");

const issueCoverAssets: Record<string, string> = {
  "issue-01": issue01Cover,
  "issue-02": issue02Cover,
  "issue-03": issue03Cover,
  "issue-04": issue04Cover,
  "issue-05": issue05Cover,
  "issue-06": issue06Cover,
  "issue-07": issue07Cover,
  "issue-08": issue08Cover,
  "issue-09": issue09Cover,
  "issue-10": issue10Cover,
  "issue-11": issue11Cover,
  "issue-21": issue21Cover,
  "issue-22": issue22Cover,
  "issue-23": issue23Cover,
  "issue-24": issue24Cover,
  "issue-25": issue25Cover,
  "issue-27": issue27Cover,
};

export const issue01SupportingMedia = {
  mechanics: issue01Support01,
  numbers: issue01Support02,
  defenses: issue01Support03,
} as const;

export const issue02SupportingMedia = {
  framework: issue02Support01,
  incidents: issue02Support02,
  defenses: issue02Support03,
} as const;

export const issue03SupportingMedia = {
  ecosystem: issue03Support01,
  contrast: issue03Support02,
  workflow: issue03Support03,
} as const;

export const issue01SupportingMediaRefs = {
  mechanics: "issue-01-supporting-mechanics",
  numbers: "issue-01-supporting-numbers",
  defenses: "issue-01-supporting-defenses",
} as const;

export const resolveIssue01SupportingMedia = (assetRef?: string | null): string | null => {
  if (!assetRef) return null;
  switch (assetRef) {
    case issue01SupportingMediaRefs.mechanics:
      return issue01SupportingMedia.mechanics;
    case issue01SupportingMediaRefs.numbers:
      return issue01SupportingMedia.numbers;
    case issue01SupportingMediaRefs.defenses:
      return issue01SupportingMedia.defenses;
    default:
      return null;
  }
};

export const resolveIssueCover = (coverImage?: string | null): string | null => {
  if (!coverImage) return null;
  if (coverImage.startsWith("http")) return coverImage;
  return issueCoverAssets[coverImage] || null;
};
