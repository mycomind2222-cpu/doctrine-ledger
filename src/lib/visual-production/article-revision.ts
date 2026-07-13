export interface RevisionSourceSection {
  id: string;
  title?: string;
  content: string;
}

export interface RevisionSourceReference {
  id: string;
  label?: string;
  citation?: string;
  url?: string;
}

export interface ArticleRevisionSource {
  title: string;
  subtitle?: string | null;
  summary?: string | null;
  theme?: string | null;
  sections: RevisionSourceSection[];
  sources?: RevisionSourceReference[];
}

export interface MediaPlanCurrentCheck {
  articleRevisionId: string;
}

const normalizeSpaces = (value: string) => value.trim().replace(/\s+/g, " ");

const stableHash = (input: string) => {
  let h1 = 0xdeadbeef ^ input.length;
  let h2 = 0x41c6ce57 ^ input.length;

  for (let index = 0; index < input.length; index += 1) {
    const char = input.charCodeAt(index);
    h1 = Math.imul(h1 ^ char, 2654435761);
    h2 = Math.imul(h2 ^ char, 1597334677);
  }

  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return `${(h2 >>> 0).toString(16)}${(h1 >>> 0).toString(16)}`.padStart(16, "0");
};

export const computeArticleRevisionId = (issue: ArticleRevisionSource) => {
  const fingerprint = {
    title: normalizeSpaces(issue.title),
    subtitle: issue.subtitle ? normalizeSpaces(issue.subtitle) : null,
    summary: issue.summary ? normalizeSpaces(issue.summary) : null,
    theme: issue.theme ? normalizeSpaces(issue.theme) : null,
    sections: issue.sections.map((section) => ({
      id: normalizeSpaces(section.id),
      title: section.title ? normalizeSpaces(section.title) : null,
      content: normalizeSpaces(section.content),
    })),
    sources: (issue.sources ?? []).map((source) => ({
      id: normalizeSpaces(source.id),
      label: source.label ? normalizeSpaces(source.label) : null,
      citation: source.citation ? normalizeSpaces(source.citation) : null,
      url: source.url ? normalizeSpaces(source.url) : null,
    })),
  };

  return `rev-${stableHash(JSON.stringify(fingerprint))}`;
};

export const isMediaPlanCurrent = (
  issue: ArticleRevisionSource,
  mediaPlan: MediaPlanCurrentCheck | null | undefined,
) => {
  if (!mediaPlan) return false;
  return mediaPlan.articleRevisionId === computeArticleRevisionId(issue);
};
