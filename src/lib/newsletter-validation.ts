import { type Issue, type Section, type IssueMedia } from "@/data/issues";
import { resolveIssueCover } from "@/lib/issue-assets";
import { computeArticleRevisionId } from "@/lib/visual-production/article-revision";
import {
  type NewsletterAccessLevel,
  type NewsletterAssetRef,
  type NewsletterCompatibilityMetadata,
  type NewsletterContentOrigin,
  type NewsletterIssueContent,
  type NewsletterPublicationStatus,
  type NewsletterSection,
  type NewsletterSourceRef,
} from "@/lib/newsletter-content";
import { getPlainSummary } from "@/data/plainSummaries";
import type { Json } from "@/integrations/supabase/types";

export interface SupabaseIssueRow {
  id: string;
  number: number;
  title: string;
  theme: string;
  cover_image: string | null;
  publication_status: string;
  publish_date: string;
  tags: string[];
  sections: Json;
  created_at: string;
  updated_at: string;
  generated_by: string | null;
  quality_notes?: string | null;
  quality_score?: number | null;
}

const createValidationError = (context: string, message: string) => {
  throw new Error(`[newsletter-validation] ${context}: ${message}`);
};

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const isNonEmptyString = (value: unknown): value is string => {
  return typeof value === "string" && value.trim().length > 0;
};

const normalizeStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value.filter(isNonEmptyString).map((item) => item.trim());
};

const normalizeAccessLevel = (value: unknown, context: string): NewsletterAccessLevel => {
  if (value === "public" || value === "professional" || value === "restricted") {
    return value;
  }
  createValidationError(context, `invalid access level "${String(value)}"`);
};

const normalizePublicationStatus = (value: unknown, context: string): NewsletterPublicationStatus => {
  if (value === "published" || value === "draft") {
    return value;
  }
  createValidationError(context, `invalid publication status "${String(value)}"`);
};

const normalizeDate = (value: unknown, context: string): string => {
  if (!isNonEmptyString(value)) {
    createValidationError(context, "missing publication date");
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    createValidationError(context, `invalid publication date "${value}"`);
  }

  return date.toISOString().slice(0, 10);
};

const normalizeIssueNumber = (value: unknown, context: string): number => {
  if (!Number.isInteger(value) || (value as number) <= 0) {
    createValidationError(context, `invalid issue number "${String(value)}"`);
  }
  return value as number;
};

const normalizeAssets = (assets: unknown, context: string): NewsletterAssetRef[] => {
  if (!Array.isArray(assets)) return [];

  const seenIds = new Set<string>();
  return assets.map((asset, index) => normalizeAsset(asset, `${context}.asset[${index}]`)).filter((asset) => {
    if (seenIds.has(asset.id)) {
      createValidationError(context, `duplicate asset id "${asset.id}"`);
    }
    seenIds.add(asset.id);
    return true;
  });
};

const normalizeAsset = (value: unknown, context: string): NewsletterAssetRef => {
  if (!isPlainObject(value)) {
    createValidationError(context, "asset must be an object");
  }

  const id = isNonEmptyString(value.id) ? value.id.trim() : null;
  const source = isNonEmptyString(value.source) ? value.source.trim() : null;
  const alt = isNonEmptyString(value.alt) ? value.alt.trim() : null;

  if (!id) createValidationError(context, "missing asset id");
  if (!source) createValidationError(context, `missing source for asset "${id}"`);
  if (!alt) createValidationError(context, `missing alt text for asset "${id}"`);

  return {
    id,
    kind: value.kind === "cover" || value.kind === "supporting" || value.kind === "inline" ? value.kind : "inline",
    source,
    alt,
    caption: isNonEmptyString(value.caption) ? value.caption.trim() : undefined,
    credit: isNonEmptyString(value.credit) ? value.credit.trim() : undefined,
    aspectRatio:
      value.aspectRatio === "portrait" ||
      value.aspectRatio === "landscape" ||
      value.aspectRatio === "square" ||
      value.aspectRatio === "wide"
        ? value.aspectRatio
        : undefined,
    position: value.position === "before" || value.position === "after" ? value.position : undefined,
    legacyRef: isNonEmptyString(value.legacyRef) ? value.legacyRef.trim() : undefined,
    legacyKind:
      value.legacyKind === "editorial_image" ||
      value.legacyKind === "infographic" ||
      value.legacyKind === "diagram" ||
      value.legacyKind === "timeline" ||
      value.legacyKind === "data_visualization"
        ? value.legacyKind
        : undefined,
  };
};

const normalizeSources = (sources: unknown, context: string): NewsletterSourceRef[] => {
  if (!Array.isArray(sources)) return [];

  const seenIds = new Set<string>();
  return sources.map((source, index) => normalizeSource(source, `${context}.source[${index}]`)).filter((source) => {
    if (seenIds.has(source.id)) {
      createValidationError(context, `duplicate source id "${source.id}"`);
    }
    seenIds.add(source.id);
    return true;
  });
};

const normalizeSource = (value: unknown, context: string): NewsletterSourceRef => {
  if (!isPlainObject(value)) {
    createValidationError(context, "source must be an object");
  }

  const id = isNonEmptyString(value.id) ? value.id.trim() : null;
  const label = isNonEmptyString(value.label) ? value.label.trim() : null;
  if (!id) createValidationError(context, "missing source id");
  if (!label) createValidationError(context, `missing source label for "${id}"`);

  return {
    id,
    label,
    citation: isNonEmptyString(value.citation) ? value.citation.trim() : undefined,
    url: isNonEmptyString(value.url) ? value.url.trim() : undefined,
    sourceType: isNonEmptyString(value.sourceType) ? value.sourceType.trim() : undefined,
    note: isNonEmptyString(value.note) ? value.note.trim() : undefined,
  };
};

const normalizeSidebarElements = (elements: unknown): { type: string; content: string }[] => {
  if (!Array.isArray(elements)) return [];
  return elements
    .map((element) => {
      if (!isPlainObject(element) || !isNonEmptyString(element.type) || !isNonEmptyString(element.content)) {
        return null;
      }
      return { type: element.type.trim(), content: element.content.trim() };
    })
    .filter((element): element is { type: string; content: string } => Boolean(element));
};

const normalizeSection = (value: unknown, context: string): NewsletterSection => {
  if (!isPlainObject(value)) {
    createValidationError(context, "section must be an object");
  }

  const id = isNonEmptyString(value.id) ? value.id.trim() : null;
  const type = isNonEmptyString(value.type) ? value.type.trim() : null;
  const content = isNonEmptyString(value.content) ? value.content : null;
  const title = isNonEmptyString(value.title) ? value.title.trim() : undefined;

  if (!id) createValidationError(context, "missing section id");
  if (!type) createValidationError(context, `missing section type for "${id}"`);
  if (!content) createValidationError(context, `missing section content for "${id}"`);

  const accessLevel = normalizeAccessLevel(value.audienceLevel ?? value.accessLevel ?? "public", `${context}.accessLevel`);
  const contentFormat =
    value.contentFormat === "plain_text" ||
    value.contentFormat === "structured" ||
    value.contentFormat === "json"
      ? value.contentFormat
      : "markdown";
  const anchor = isNonEmptyString(value.anchor) ? value.anchor.trim() : id;
  const media = normalizeAssets(value.media, `${context}.media`);
  const sources = normalizeSources(value.sources, `${context}.sources`);

  return {
    id,
    anchor,
    type,
    title,
    accessLevel,
    content,
    contentFormat,
    media,
    sources,
    sidebarElements: normalizeSidebarElements(value.sidebarElements),
  };
};

const validateDuplicateSectionKeys = (sections: NewsletterSection[], context: string) => {
  const ids = new Set<string>();
  const anchors = new Set<string>();

  for (const section of sections) {
    if (ids.has(section.id)) {
      createValidationError(context, `duplicate section id "${section.id}"`);
    }
    if (anchors.has(section.anchor)) {
      createValidationError(context, `duplicate section anchor "${section.anchor}"`);
    }
    ids.add(section.id);
    anchors.add(section.anchor);
  }
};

const deriveIssueAccessLevel = (sections: NewsletterSection[]): NewsletterAccessLevel => {
  if (sections.some((section) => section.accessLevel === "restricted")) return "restricted";
  if (sections.some((section) => section.accessLevel === "professional")) return "professional";
  return "public";
};

const parseSourcesSection = (sections: NewsletterSection[], issueNumber: number): NewsletterSourceRef[] => {
  const sourcesSection = sections.find((section) => section.type === "sources");
  if (!sourcesSection) return [];

  const items = sourcesSection.content
    .split(/;\s*/)
    .map((item) => item.trim())
    .filter(Boolean);

  return items.map((label, index) => ({
    id: `issue-${issueNumber}-source-${String(index + 1).padStart(2, "0")}`,
    label,
    citation: label,
  }));
};

const normalizeCompatibility = (compatibility: unknown, fallbackNotes: string[]): NewsletterCompatibilityMetadata => {
  if (!isPlainObject(compatibility)) {
    return { notes: fallbackNotes };
  }

  return {
    legacyIssueNumber: Number.isInteger(compatibility.legacyIssueNumber) ? Number(compatibility.legacyIssueNumber) : undefined,
    legacyTheme: isNonEmptyString(compatibility.legacyTheme) ? compatibility.legacyTheme.trim() : undefined,
    legacyCoverRef: compatibility.legacyCoverRef === null ? null : isNonEmptyString(compatibility.legacyCoverRef) ? compatibility.legacyCoverRef.trim() : undefined,
    rawPublicationStatus: isNonEmptyString(compatibility.rawPublicationStatus) ? compatibility.rawPublicationStatus.trim() : undefined,
    rawAccessLevel: isNonEmptyString(compatibility.rawAccessLevel) ? compatibility.rawAccessLevel.trim() : undefined,
    rawSource: isNonEmptyString(compatibility.rawSource) ? compatibility.rawSource.trim() : undefined,
    notes: [...fallbackNotes, ...(Array.isArray(compatibility.notes) ? compatibility.notes.filter(isNonEmptyString).map((note) => note.trim()) : [])],
  };
};

const normalizeUpdatedAt = (value: unknown, fallback: string) => {
  if (isNonEmptyString(value)) {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return date.toISOString();
    }
  }

  const fallbackDate = new Date(fallback);
  return Number.isNaN(fallbackDate.getTime()) ? undefined : fallbackDate.toISOString();
};

const normalizeCanonicalIssue = (issue: unknown, context: string, source: NewsletterContentOrigin): NewsletterIssueContent => {
  if (!isPlainObject(issue)) {
    createValidationError(context, "issue must be an object");
  }

  const number = normalizeIssueNumber(issue.number, `${context}.number`);
  const title = isNonEmptyString(issue.title) ? issue.title.trim() : null;
  if (!title) createValidationError(context, "missing title");

  const sections = Array.isArray(issue.sections)
    ? issue.sections.map((section, index) => normalizeSection(section, `${context}.sections[${index}]`))
    : [];
  validateDuplicateSectionKeys(sections, `${context}.sections`);

  const publicationStatus = normalizePublicationStatus(issue.publicationStatus, `${context}.publicationStatus`);
  const publicationDate = normalizeDate(issue.publicationDate, `${context}.publicationDate`);
  const tags = normalizeStringArray(issue.tags);
  const summary = isNonEmptyString(issue.summary) ? issue.summary.trim() : undefined;
  const category = isNonEmptyString(issue.category) ? issue.category.trim() : undefined;
  const slug = isNonEmptyString(issue.slug) ? issue.slug.trim() : undefined;
  const subtitle = isNonEmptyString(issue.subtitle) ? issue.subtitle.trim() : undefined;
  const authors = normalizeStringArray(issue.authors);
  const supportingAssets = normalizeAssets(issue.supportingAssets, `${context}.supportingAssets`);
  const coverAsset = issue.coverAsset === null ? null : issue.coverAsset ? normalizeAsset(issue.coverAsset, `${context}.coverAsset`) : null;
  const issueSources = normalizeSources(issue.sources, `${context}.sources`);
  const derivedSources = issueSources.length > 0 ? issueSources : parseSourcesSection(sections, number);
  const issueAccessLevel = normalizeAccessLevel(issue.accessLevel ?? deriveIssueAccessLevel(sections), `${context}.accessLevel`);

  const seoValue = isPlainObject(issue.seo) ? issue.seo : undefined;
  const seo = seoValue
    ? {
        title: isNonEmptyString(seoValue.title) ? seoValue.title.trim() : undefined,
        description: isNonEmptyString(seoValue.description) ? seoValue.description.trim() : undefined,
        tags: normalizeStringArray(seoValue.tags),
        image: seoValue.image === null ? null : seoValue.image ? normalizeAsset(seoValue.image, `${context}.seo.image`) : undefined,
      }
    : undefined;

  const presentationValue = isPlainObject(issue.presentation) ? issue.presentation : undefined;
  const presentation = presentationValue
    ? {
        template: presentationValue.template === "issue01-reference" ? "issue01-reference" : "standard",
        showTableOfContents: presentationValue.showTableOfContents !== false,
        showReadNext: presentationValue.showReadNext,
        heroLayout: presentationValue.heroLayout === "portrait-cover" || presentationValue.heroLayout === "article" ? presentationValue.heroLayout : undefined,
        readNextIssueNumbers: Array.isArray(presentationValue.readNextIssueNumbers)
          ? presentationValue.readNextIssueNumbers.filter((entry) => Number.isInteger(entry) && entry > 0).map((entry) => Number(entry))
          : undefined,
        notes: normalizeStringArray(presentationValue.notes),
      }
    : undefined;

  const compatibility = normalizeCompatibility(issue.compatibility, []);
  const revisionId = computeArticleRevisionId({
    title,
    subtitle,
    summary,
    theme: category,
    sections: sections.map((section) => ({
      id: section.id,
      title: section.title,
      content: section.content,
    })),
    sources: derivedSources.map((source) => ({
      id: source.id,
      label: source.label,
      citation: source.citation,
      url: source.url,
    })),
  });
  const updatedAt = normalizeUpdatedAt((issue as { updatedAt?: unknown }).updatedAt, publicationDate);
  const mediaPlanRevisionId = isNonEmptyString((issue as { mediaPlanRevisionId?: unknown }).mediaPlanRevisionId)
    ? (issue as { mediaPlanRevisionId: string }).mediaPlanRevisionId.trim()
    : undefined;

  const origin = issue.origin === "static" || issue.origin === "canonical-local" || issue.origin === "supabase" ? issue.origin : source;

  return {
    stableId: isNonEmptyString(issue.stableId) ? issue.stableId.trim() : `issue-${String(number).padStart(2, "0")}`,
    number,
    slug,
    title,
    subtitle,
    summary,
    category,
    authors,
    publicationStatus,
    publicationDate,
    accessLevel: issueAccessLevel,
    schemaVersion: Number.isInteger(issue.schemaVersion) && issue.schemaVersion > 0 ? Number(issue.schemaVersion) : 1,
    origin,
    coverAsset,
    supportingAssets,
    sections,
    sources: derivedSources,
    tags,
    revisionId,
    updatedAt,
    mediaPlanRevisionId,
    seo,
    presentation,
    compatibility,
  };
};

const normalizeLegacyIssue = (issue: Issue, context: string, origin: NewsletterContentOrigin): NewsletterIssueContent => {
  if (!Number.isInteger(issue.number) || issue.number <= 0) {
    createValidationError(context, `invalid issue number "${String(issue.number)}"`);
  }
  if (!isNonEmptyString(issue.title)) {
    createValidationError(context, "missing title");
  }
  const sections = issue.sections.map((section, index) => normalizeLegacySection(section, `${context}.sections[${index}]`));
  validateDuplicateSectionKeys(sections, `${context}.sections`);
  const sources = parseSourcesSection(sections, issue.number);
  const coverRef = issue.coverImage ?? null;
  const coverSource = coverRef ? resolveIssueCover(coverRef) ?? coverRef : "";

  return normalizeCanonicalIssue(
    {
      stableId: `issue-${String(issue.number).padStart(2, "0")}`,
      number: issue.number,
      slug: `issue-${String(issue.number).padStart(2, "0")}`,
      title: issue.title,
      subtitle: issue.theme,
      summary: getPlainSummary(issue.number, issue.sections.find((section) => section.type === "executive_summary")?.content),
      category: issue.theme,
      publicationStatus: issue.publicationStatus,
      publicationDate: issue.publishDate,
      accessLevel: deriveIssueAccessLevel(sections),
      schemaVersion: 1,
      origin,
      coverAsset: coverRef
        ? {
            id: coverRef,
            kind: "cover",
            source: coverSource,
            alt: `BLACKFILES Issue ${String(issue.number).padStart(2, "0")} cover`,
            legacyRef: coverRef,
            legacyKind: "editorial_image",
          }
        : null,
      supportingAssets: sections.flatMap((section) => section.media),
      sections,
      sources,
      tags: issue.tags,
      updatedAt: new Date(`${issue.publishDate}T00:00:00Z`).toISOString(),
      seo: {
        title: `Issue #${String(issue.number).padStart(2, "0")}: ${issue.title}`,
        description: issue.sections[0]?.content?.slice(0, 155).replace(/\n/g, " ") || issue.title,
        tags: issue.tags,
        image: coverRef
          ? {
              id: coverRef,
              kind: "cover",
              source: coverSource,
              alt: `BLACKFILES Issue ${String(issue.number).padStart(2, "0")} cover`,
              legacyRef: coverRef,
              legacyKind: "editorial_image",
            }
          : null,
      },
      presentation: {
        template: issue.number === 1 ? "issue01-reference" : "standard",
        showTableOfContents: issue.number === 1,
        showReadNext: issue.number === 1,
        heroLayout: issue.number === 1 ? "portrait-cover" : "article",
        readNextIssueNumbers: issue.number === 1 ? [2, 3] : undefined,
        notes: issue.number === 1 ? ["Approved reference implementation"] : [],
      },
      compatibility: {
        legacyIssueNumber: issue.number,
        legacyTheme: issue.theme,
        legacyCoverRef: coverRef,
        rawPublicationStatus: issue.publicationStatus,
        rawAccessLevel: deriveIssueAccessLevel(sections),
        notes: issue.number === 1 ? ["Canonical local Issue 01 reference"] : ["Legacy static issue adapted into canonical form"],
      },
    },
    context,
    origin
  );
};

const normalizeLegacySection = (section: Section, context: string): NewsletterSection => {
  const media = Array.isArray(section.media)
    ? section.media.map((item, index) => normalizeLegacyMedia(item, `${context}.media[${index}]`))
    : [];
  const sourceList = section.type === "sources"
    ? section.content
        .split(/;\s*/)
        .map((item, index) => ({
          id: `source-${section.id}-${String(index + 1).padStart(2, "0")}`,
          label: item.trim(),
          citation: item.trim(),
        }))
        .filter((item) => item.label.length > 0)
    : [];

  return {
    id: section.id,
    anchor: section.id,
    type: section.type,
    title: section.title,
    accessLevel: normalizeAccessLevel(section.audienceLevel ?? "public", `${context}.audienceLevel`),
    content: section.content,
    contentFormat: section.type === "sources" ? "plain_text" : "markdown",
    media,
    sources: sourceList,
    sidebarElements: section.sidebarElements?.map((element) => ({
      type: element.type,
      content: element.content,
    })),
  };
};

const normalizeLegacyMedia = (media: IssueMedia, context: string): NewsletterAssetRef => {
  if (!isNonEmptyString(media.id)) {
    createValidationError(context, "missing media id");
  }
  if (!isNonEmptyString(media.src)) {
    createValidationError(context, `missing source for media "${media.id}"`);
  }
  if (!isNonEmptyString(media.alt)) {
    createValidationError(context, `missing alt text for media "${media.id}"`);
  }

  return {
    id: media.id.trim(),
    kind: "supporting",
    source: media.src.trim(),
    alt: media.alt.trim(),
    caption: isNonEmptyString(media.caption) ? media.caption.trim() : undefined,
    credit: isNonEmptyString(media.credit) ? media.credit.trim() : undefined,
    aspectRatio: media.aspectRatio,
    position: media.position,
    legacyKind: media.kind,
  };
};

export const validateCanonicalIssue = (issue: unknown, context = "canonical issue"): NewsletterIssueContent => {
  return normalizeCanonicalIssue(issue, context, "canonical-local");
};

export const validateStaticIssueRecord = (issue: Issue, context = `static issue #${String(issue.number).padStart(2, "0")}`): NewsletterIssueContent => {
  return normalizeLegacyIssue(issue, context, issue.number === 1 ? "canonical-local" : "static");
};

export const validateIssue01Record = (issue: Issue, context = "Issue 01 reference issue"): NewsletterIssueContent => {
  const canonical = validateStaticIssueRecord(issue, context);

  if (canonical.number !== 1) {
    createValidationError(context, "Issue 01 record must have number 1");
  }
  if (canonical.presentation?.template !== "issue01-reference") {
    createValidationError(context, "Issue 01 record must use the approved reference template");
  }
  if (canonical.coverAsset?.legacyRef !== "issue-01") {
    createValidationError(context, "Issue 01 record must use the approved issue-01 cover");
  }
  if (canonical.supportingAssets.length < 3) {
    createValidationError(context, "Issue 01 record must preserve the approved supporting assets");
  }

  return canonical;
};

export const validateSupabaseIssueRow = (row: SupabaseIssueRow, context = `supabase issue #${String(row.number).padStart(2, "0")}`): NewsletterIssueContent => {
  const issue = normalizeIssueNumber(row.number, `${context}.number`);
  const title = isNonEmptyString(row.title) ? row.title.trim() : null;
  if (!title) createValidationError(context, "missing title");

  const sectionsValue = Array.isArray(row.sections) ? row.sections : [];
  const sections = sectionsValue.map((section, index) => normalizeSection(section, `${context}.sections[${index}]`));
  validateDuplicateSectionKeys(sections, `${context}.sections`);

  const coverRef = isNonEmptyString(row.cover_image) ? row.cover_image.trim() : null;
  const coverSource = coverRef ? resolveIssueCover(coverRef) ?? coverRef : "";
  const sourceNotes = row.generated_by ? [`Generated by ${row.generated_by}`] : [];

  return normalizeCanonicalIssue(
    {
      stableId: `issue-${String(issue).padStart(2, "0")}`,
      number: issue,
      slug: `issue-${String(issue).padStart(2, "0")}`,
      title,
      subtitle: row.theme,
      summary: getPlainSummary(issue, sections.find((section) => section.type === "executive_summary")?.content),
      category: row.theme,
      publicationStatus: normalizePublicationStatus(row.publication_status, `${context}.publication_status`),
      publicationDate: normalizeDate(row.publish_date, `${context}.publish_date`),
      accessLevel: deriveIssueAccessLevel(sections),
      schemaVersion: 1,
      origin: "supabase",
      coverAsset: coverRef
        ? {
            id: coverRef,
            kind: "cover",
            source: coverSource,
            alt: `Issue ${String(issue).padStart(2, "0")} cover`,
            legacyRef: coverRef,
            legacyKind: "editorial_image",
          }
        : null,
      supportingAssets: sections.flatMap((section) => section.media),
      sections,
      sources: parseSourcesSection(sections, issue),
      tags: normalizeStringArray(row.tags),
      updatedAt: normalizeUpdatedAt(row.updated_at, row.publish_date),
      seo: {
        title: `Issue #${String(issue).padStart(2, "0")}: ${title}`,
        description: sections[0]?.content?.slice(0, 155).replace(/\n/g, " ") || title,
        tags: normalizeStringArray(row.tags),
        image: coverRef
          ? {
              id: coverRef,
              kind: "cover",
              source: coverSource,
              alt: `Issue ${String(issue).padStart(2, "0")} cover`,
              legacyRef: coverRef,
              legacyKind: "editorial_image",
            }
          : null,
      },
      presentation: {
        template: issue === 1 ? "issue01-reference" : "standard",
        showTableOfContents: issue === 1,
        showReadNext: issue === 1,
        heroLayout: issue === 1 ? "portrait-cover" : "article",
        readNextIssueNumbers: issue === 1 ? [2, 3] : undefined,
        notes: sourceNotes,
      },
      compatibility: {
        legacyIssueNumber: issue,
        legacyTheme: row.theme,
        legacyCoverRef: coverRef,
        rawPublicationStatus: row.publication_status,
        rawAccessLevel: deriveIssueAccessLevel(sections),
        rawSource: row.generated_by ?? undefined,
        notes: [...sourceNotes, "Supabase row adapted into canonical form"],
      },
    },
    context,
    "supabase"
  );
};
