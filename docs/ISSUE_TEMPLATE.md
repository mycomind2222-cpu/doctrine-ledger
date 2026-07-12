# BLACKFILES Issue Template

Issue 01 is the canonical reference implementation.

## Required Metadata

- `number`
- `title`
- `theme`
- `coverImage`
- `publicationStatus`
- `publishDate`
- `tags`
- `sections`

## Required Audience Levels

- `public`
- `restricted`

Do not introduce a third access tier in new issue content.

## Recommended Section Order

1. Executive summary
2. Deep dive
3. Supporting visual or infographic
4. Deep dive or case study
5. Actionable insight
6. Sources

## Asset Layout

Use a dedicated directory per issue:

```text
src/assets/issues/issue-01/
  cover.png
  supporting-image-01.svg
  supporting-image-02.svg
  supporting-image-03.svg
```

## Cover Requirements

- Portrait editorial cover
- Preserve borders and typography
- Use non-destructive `object-contain` presentation in the reader and cards
- Resolve via the shared issue asset resolver

## Supporting Media Fields

Each section may include optional media entries:

- `id`
- `kind`
- `src`
- `alt`
- `caption`
- `credit`
- `aspectRatio`
- `position`

## Sources

- Keep sources as separate, readable entries
- Do not invent URLs or publication dates
- Preserve supplied source names

## Accessibility

- Use descriptive alt text
- Keep navigation and anchors keyboard accessible
- Do not render restricted bodies for unauthorized readers

## SEO

- Use the issue title as the canonical article title
- Derive the description from the executive summary
- Preserve the issue URL path

## Validation Checklist

- Cover resolves correctly
- Section order is stable
- Old Issue 01 copy is absent
- Markdown renders without raw HTML
- Supporting media loads with alt text
- Restricted content is not in the DOM for unauthorized readers

## Example Skeleton

```ts
{
  number: 1,
  title: "Issue Title",
  theme: "Issue Theme",
  coverImage: "issue-01",
  publicationStatus: "published",
  publishDate: "2025-01-15",
  tags: ["tag-one", "tag-two"],
  sections: [
    {
      id: "exec-1",
      type: "executive_summary",
      title: "Executive Summary",
      audienceLevel: "public",
      content: "..."
    }
  ]
}
```
