export type NewsletterAccessLevel = "public" | "professional" | "restricted";

export type NewsletterPublicationStatus = "published" | "draft";

export type NewsletterContentOrigin = "static" | "canonical-local" | "supabase";

export type NewsletterSectionContentFormat = "markdown" | "plain_text" | "structured" | "json";

export interface NewsletterAssetRef {
  id: string;
  kind: "cover" | "supporting" | "inline";
  source: string;
  alt: string;
  caption?: string;
  credit?: string;
  aspectRatio?: "portrait" | "landscape" | "square" | "wide";
  position?: "before" | "after";
  legacyRef?: string;
  legacyKind?: "editorial_image" | "infographic" | "diagram" | "timeline" | "data_visualization";
}

export interface NewsletterSourceRef {
  id: string;
  label: string;
  citation?: string;
  url?: string;
  sourceType?: string;
  note?: string;
}

export interface NewsletterSection {
  id: string;
  anchor: string;
  type: string;
  title?: string;
  accessLevel: NewsletterAccessLevel;
  content: string;
  contentFormat: NewsletterSectionContentFormat;
  media: NewsletterAssetRef[];
  sources: NewsletterSourceRef[];
  sidebarElements?: { type: string; content: string }[];
}

export interface NewsletterPresentation {
  template: "standard" | "issue01-reference";
  showTableOfContents: boolean;
  showReadNext?: boolean;
  heroLayout?: "portrait-cover" | "article";
  readNextIssueNumbers?: number[];
  notes?: string[];
}

export interface NewsletterCompatibilityMetadata {
  legacyIssueNumber?: number;
  legacyTheme?: string;
  legacyCoverRef?: string | null;
  rawPublicationStatus?: string;
  rawAccessLevel?: string;
  rawSource?: string;
  notes: string[];
}

export interface NewsletterSeoMetadata {
  title?: string;
  description?: string;
  tags: string[];
  image?: NewsletterAssetRef | null;
}

export interface NewsletterIssueContent {
  stableId: string;
  number: number;
  slug?: string;
  title: string;
  subtitle?: string;
  summary?: string;
  category?: string;
  authors?: string[];
  publicationStatus: NewsletterPublicationStatus;
  publicationDate: string;
  accessLevel: NewsletterAccessLevel;
  schemaVersion: number;
  origin: NewsletterContentOrigin;
  coverAsset: NewsletterAssetRef | null;
  supportingAssets: NewsletterAssetRef[];
  sections: NewsletterSection[];
  sources: NewsletterSourceRef[];
  tags: string[];
  seo?: NewsletterSeoMetadata;
  presentation?: NewsletterPresentation;
  compatibility?: NewsletterCompatibilityMetadata;
}
