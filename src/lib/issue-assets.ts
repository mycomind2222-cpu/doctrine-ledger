import issue01Cover from "@/assets/issues/issue-01/cover.png";
import issue01Support01 from "@/assets/issues/issue-01/supporting-image-01.svg";
import issue01Support02 from "@/assets/issues/issue-01/supporting-image-02.svg";
import issue01Support03 from "@/assets/issues/issue-01/supporting-image-03.svg";
import issue02Cover from "@/assets/covers/issue-02.png";
import issue03Cover from "@/assets/covers/issue-03.png";
import issue04Cover from "@/assets/covers/issue-04.png";
import issue05Cover from "@/assets/covers/issue-05.png";
import issue06Cover from "@/assets/covers/issue-06.png";
import issue07Cover from "@/assets/covers/issue-07.png";
import issue08Cover from "@/assets/covers/issue-08.png";
import issue09Cover from "@/assets/covers/issue-09.png";
import issue10Cover from "@/assets/covers/issue-10.png";
import issue11Cover from "@/assets/covers/issue-11.png";
import issue21Cover from "@/assets/covers/issue-21.jpg";
import issue22Cover from "@/assets/covers/issue-22.jpg";
import issue23Cover from "@/assets/covers/issue-23.jpg";
import issue24Cover from "@/assets/covers/issue-24.jpg";
import issue25Cover from "@/assets/covers/issue-25.jpg";
import issue27Cover from "@/assets/covers/issue-27-openclaw.jpg";

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

export const resolveIssueCover = (coverImage?: string | null): string | null => {
  if (!coverImage) return null;
  if (coverImage.startsWith("http")) return coverImage;
  return issueCoverAssets[coverImage] || null;
};
