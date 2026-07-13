import type { VisualProfile } from "@/lib/visual-production/visual-profile";

interface CoverMastheadProps {
  publicationName: string;
  issueNumber: number;
  subtitle?: string | null;
  profile: VisualProfile;
}

export const CoverMasthead = ({ publicationName, issueNumber, subtitle, profile }: CoverMastheadProps) => {
  return (
    <header className="text-center">
      <div
        className="font-serif font-semibold uppercase leading-none text-[#f4eadc]"
        style={{
          fontFamily: profile.typography.mastheadFontFamily,
          fontSize: profile.typography.mastheadSize,
          letterSpacing: profile.typography.mastheadTracking,
        }}
      >
        {publicationName}
      </div>
      <div className="mt-3 flex items-center justify-center gap-5">
        <span className="h-px w-24 bg-[#ff8b4d]/60" />
        <span
          className="font-mono text-[#ffb27d]"
          style={{
            fontSize: profile.typography.metadataSize,
            letterSpacing: profile.typography.metadataTracking,
          }}
        >
          Issue #{String(issueNumber).padStart(2, "0")}
        </span>
        <span className="h-px w-24 bg-[#ff8b4d]/60" />
      </div>
      {subtitle && (
        <p
          className="mx-auto mt-4 max-w-[20ch] text-[#8ad0ff]"
          style={{
            fontFamily: profile.typography.metadataFontFamily,
            fontSize: profile.typography.subtitleSize,
            lineHeight: profile.typography.subtitleLineHeight,
            letterSpacing: profile.typography.subtitleTracking,
          }}
        >
          {subtitle}
        </p>
      )}
    </header>
  );
};
