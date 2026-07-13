import type { VisualProfile } from "@/lib/visual-production/visual-profile";

interface CoverIssueMetadataProps {
  issueId: string;
  articleRevisionId: string;
  profileId: string;
  profileVersion: number;
  generatedAt: string;
  profile: VisualProfile;
}

export const CoverIssueMetadata = ({
  issueId,
  articleRevisionId,
  profileId,
  profileVersion,
  generatedAt,
  profile,
}: CoverIssueMetadataProps) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#ff8b4d]/25 pt-4">
      <div className="flex flex-wrap items-center gap-2 font-mono text-[#f4eadc]/78">
        <span
          className="rounded-full border border-[#ff8b4d]/35 bg-white/5 px-3 py-1"
          style={{ letterSpacing: profile.typography.metadataTracking, fontSize: profile.typography.metadataSize - 2 }}
        >
          {issueId}
        </span>
        <span
          className="rounded-full border border-[#ff8b4d]/20 bg-white/5 px-3 py-1 text-[#8ad0ff]"
          style={{ letterSpacing: profile.typography.metadataTracking, fontSize: profile.typography.metadataSize - 2 }}
        >
          {articleRevisionId}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2 font-mono text-[#f4eadc]/66">
        <span style={{ letterSpacing: profile.typography.metadataTracking, fontSize: profile.typography.metadataSize - 3 }}>
          {profileId}@{profileVersion}
        </span>
        <span className="text-[#ff8b4d]">•</span>
        <span style={{ letterSpacing: profile.typography.metadataTracking, fontSize: profile.typography.metadataSize - 3 }}>
          {new Date(generatedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
            timeZone: "UTC",
          })}
        </span>
      </div>
    </div>
  );
};
