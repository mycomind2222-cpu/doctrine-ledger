import { type Issue, type Section, type IssueMedia, type SidebarElementType } from "@/data/issues";
import { issue01SupportingMedia } from "@/lib/issue-assets";
import {
  type NewsletterAssetRef,
  type NewsletterIssueContent,
  type NewsletterSection,
} from "@/lib/newsletter-content";
import {
  type SupabaseIssueRow,
  validateCanonicalIssue,
  validateIssue01Record,
  validateStaticIssueRecord,
  validateSupabaseIssueRow,
} from "@/lib/newsletter-validation";

const toLegacyMedia = (media: NewsletterAssetRef): IssueMedia => ({
  id: media.id,
  kind: media.legacyKind ?? (media.kind === "cover" ? "editorial_image" : "infographic"),
  src: media.source,
  alt: media.alt,
  caption: media.caption,
  credit: media.credit,
  aspectRatio: media.aspectRatio,
  position: media.position,
});

const toLegacySection = (section: NewsletterSection): Section => ({
  id: section.id,
  type: section.type as Section["type"],
  title: section.title,
  audienceLevel: section.accessLevel,
  content: section.content,
  media: section.media.length ? section.media.map(toLegacyMedia) : undefined,
  sidebarElements: section.sidebarElements?.map((element) => ({
    type: element.type as SidebarElementType,
    content: element.content,
  })),
});

export const staticIssueToCanonical = (issue: Issue): NewsletterIssueContent => {
  const canonical = issue.number === 1 ? validateIssue01Record(issue) : validateStaticIssueRecord(issue);

  return validateCanonicalIssue(
    {
      ...canonical,
      coverAsset: canonical.coverAsset
        ? {
            ...canonical.coverAsset,
            legacyRef: canonical.coverAsset.legacyRef ?? issue.coverImage ?? undefined,
            legacyKind: "editorial_image",
          }
        : null,
      supportingAssets: canonical.supportingAssets.length
        ? canonical.supportingAssets
        : issue.number === 1
          ? [
              {
                id: "mechanics-diagram",
                kind: "supporting",
                source: issue01SupportingMedia.mechanics,
                alt: "Four-step diagram showing how a synthetic identity is built from a stolen SSN, fabricated identity details, seasoning, and bust-out fraud.",
                caption: "Synthetic identities are built in stages, not instantly.",
                aspectRatio: "wide",
                position: "after",
                legacyKind: "diagram",
              },
              {
                id: "numbers-chart",
                kind: "supporting",
                source: issue01SupportingMedia.numbers,
                alt: "Dark market chart showing synthetic identity fraud loss trends and survey signals across 2020 through 2026.",
                caption: "Losses are rising faster than most fraud teams can react.",
                aspectRatio: "wide",
                position: "after",
                legacyKind: "data_visualization",
              },
              {
                id: "defenses-panel",
                kind: "supporting",
                source: issue01SupportingMedia.defenses,
                alt: "Editorial defense matrix showing institutional controls and personal protections against synthetic identity fraud.",
                caption: "The best defenses are layered before the file matures.",
                aspectRatio: "wide",
                position: "after",
                legacyKind: "infographic",
              },
            ]
          : canonical.supportingAssets,
    },
    "staticIssueToCanonical"
  );
};

export const issue01ToCanonical = (issue: Issue): NewsletterIssueContent => {
  return validateIssue01Record(issue);
};

export const supabaseRowToCanonical = (row: SupabaseIssueRow): NewsletterIssueContent => {
  return validateSupabaseIssueRow(row);
};

export const canonicalToLegacyIssue = (issue: NewsletterIssueContent): Issue => {
  const coverImage = issue.coverAsset?.legacyRef ?? issue.coverAsset?.id ?? undefined;

  return {
    number: issue.number,
    title: issue.title,
    theme: issue.category ?? issue.subtitle ?? issue.title,
    coverImage,
    publicationStatus: issue.publicationStatus,
    publishDate: issue.publicationDate,
    sections: issue.sections.map(toLegacySection),
    tags: [...issue.tags],
  };
};

export const canonicalIssuesToLegacy = (issues: NewsletterIssueContent[]): Issue[] => {
  return issues.map(canonicalToLegacyIssue);
};

export const legacyIssuesToCanonical = (issues: Issue[]): NewsletterIssueContent[] => {
  return issues.map((issue) => (issue.number === 1 ? issue01ToCanonical(issue) : staticIssueToCanonical(issue)));
};

export const supabaseRowToLegacyIssue = (row: SupabaseIssueRow): Issue => {
  return canonicalToLegacyIssue(supabaseRowToCanonical(row));
};
