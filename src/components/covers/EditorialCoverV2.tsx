import { CoverArtworkFrame } from "@/components/covers/CoverArtworkFrame";
import { CoverIssueMetadata } from "@/components/covers/CoverIssueMetadata";
import { CoverMasthead } from "@/components/covers/CoverMasthead";
import { getVisualProfile } from "@/config/visual-profiles";
import type { CoverCompositionInput, CoverValidationResult } from "@/lib/visual-production/cover-types";
import type { VisualProfile } from "@/lib/visual-production/visual-profile";
import { cn } from "@/lib/utils";

interface EditorialCoverV2Props {
  input: CoverCompositionInput;
  artworkUrl?: string | null;
  className?: string;
  validation?: CoverValidationResult;
  profile?: VisualProfile;
  mode?: "preview" | "export";
}

const deriveTitleFontSize = (title: string, profile: VisualProfile, fitStrategy: CoverValidationResult["titleFitStrategy"]) => {
  const length = title.trim().replace(/\s+/g, " ").length;
  const wordCount = title.trim().split(/\s+/).filter(Boolean).length;
  const longestWord = title.split(/\s+/).reduce((max, word) => Math.max(max, word.length), 0);
  let size = profile.maxTitleSize;

  if (length > 60) size -= 6;
  if (length > 90) size -= 8;
  if (length > 120) size -= 10;
  if (wordCount > 8) size -= 4;
  if (wordCount > 10) size -= 6;
  if (longestWord > 14) size -= 4;

  if (fitStrategy === "scale-to-fit") size -= 18;
  if (fitStrategy === "wrap-and-condense") size -= 10;
  if (fitStrategy === "wrap-tight" && length > 80) size -= 4;

  return Math.max(profile.minTitleSize, Math.min(profile.maxTitleSize, size));
};

const boundsStyle = ({ x, y, width, height }: { x: number; y: number; width: number; height: number }) => ({
  left: `${(x / 1600) * 100}%`,
  top: `${(y / 2400) * 100}%`,
  width: `${(width / 1600) * 100}%`,
  height: `${(height / 2400) * 100}%`,
});

export const EditorialCoverV2 = ({ input, artworkUrl, className, validation, profile, mode = "preview" }: EditorialCoverV2Props) => {
  const lockedProfile = profile ?? getVisualProfile(input.visualProfileId);
  if (!lockedProfile) {
    return null;
  }

  const titleFontSize = deriveTitleFontSize(input.canonicalTitle, lockedProfile, validation?.titleFitStrategy ?? "wrap-tight");

  return (
    <div
      className={cn("relative overflow-hidden rounded-[42px] border border-[#ff8b4d]/45 bg-[#050505] text-[#f4eadc]", className)}
      style={{
        width: mode === "export" ? lockedProfile.layout.canvasWidth : "100%",
        height: mode === "export" ? lockedProfile.layout.canvasHeight : "auto",
        aspectRatio: "2 / 3",
        maxWidth: mode === "preview" ? "100%" : undefined,
        background:
          "radial-gradient(circle at 50% 10%, rgba(255, 139, 77, 0.12), transparent 28%), radial-gradient(circle at 15% 20%, rgba(138, 208, 255, 0.08), transparent 28%), linear-gradient(180deg, #070707 0%, #040404 100%)",
        boxShadow: "0 80px 180px rgba(0, 0, 0, 0.55)",
      }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent_20%,transparent_82%,rgba(255,255,255,0.02))]" />
      <div className="absolute inset-[42px] rounded-[28px] border border-[#ff8b4d]/15" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.15)_72%,rgba(0,0,0,0.42)_100%)]" />

      <div className="absolute" style={boundsStyle(lockedProfile.layout.mastheadBounds)}>
        <CoverMasthead
          publicationName={input.publicationName}
          issueNumber={input.issueNumber}
          subtitle={input.subtitle}
          profile={lockedProfile}
        />
      </div>

      <div
        className="absolute text-center"
        style={{
          ...boundsStyle(lockedProfile.layout.issueNumberBounds),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: lockedProfile.typography.metadataFontFamily,
          fontSize: lockedProfile.typography.metadataSize,
          letterSpacing: lockedProfile.typography.metadataTracking,
          color: lockedProfile.palette.accent,
        }}
      >
        Issue #{String(input.issueNumber).padStart(2, "0")}
      </div>

      <div className="absolute" style={boundsStyle(lockedProfile.layout.titleBounds)}>
        <div className="flex h-full w-full items-end">
          <h1
            className="text-balance"
            style={{
              fontFamily: lockedProfile.typography.titleFontFamily,
              fontSize: titleFontSize,
              lineHeight: lockedProfile.typography.titleLineHeight,
              letterSpacing: lockedProfile.typography.titleTracking,
              color: lockedProfile.palette.foreground,
              textShadow: `0 12px 40px ${lockedProfile.palette.shadow}`,
              maxWidth: "100%",
            }}
          >
            {input.canonicalTitle}
          </h1>
        </div>
      </div>

      {input.subtitle && (
        <div className="absolute" style={boundsStyle(lockedProfile.layout.subtitleBounds)}>
          <div
            className="flex h-full items-center"
            style={{
              fontFamily: lockedProfile.typography.metadataFontFamily,
              fontSize: lockedProfile.typography.subtitleSize,
              lineHeight: lockedProfile.typography.subtitleLineHeight,
              letterSpacing: lockedProfile.typography.subtitleTracking,
              color: lockedProfile.palette.cyan,
            }}
          >
            {input.subtitle}
          </div>
        </div>
      )}

      <div className="absolute" style={boundsStyle(lockedProfile.layout.artworkFrameBounds)}>
        <CoverArtworkFrame artworkUrl={artworkUrl} artworkAlt={input.artwork.alt ?? input.canonicalTitle} />
      </div>

      <div className="absolute px-4" style={boundsStyle(lockedProfile.layout.footerBounds)}>
        <CoverIssueMetadata
          issueId={input.issueId}
          articleRevisionId={input.articleRevisionId}
          profileId={input.visualProfileId}
          profileVersion={input.visualProfileVersion}
          generatedAt={input.generatedAt}
          profile={lockedProfile}
        />
      </div>
    </div>
  );
};
