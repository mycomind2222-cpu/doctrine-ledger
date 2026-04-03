import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  tags?: string[];
  jsonLd?: Record<string, unknown>;
}

const BASE_URL = "https://doctrine-ledger.lovable.app";
const DEFAULT_TITLE = "BLACKFILES | AI Crime Newsletter — Fraud, Deepfakes & Cyber Threats";
const DEFAULT_DESCRIPTION = "Weekly briefings on how AI is used for fraud, scams, deepfakes, market manipulation and cybercrime. Real cases, real threats, zero hype. Free to read.";
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;

export const SEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  image = DEFAULT_IMAGE,
  type = "website",
  publishedTime,
  tags,
  jsonLd,
}: SEOProps) => {
  const fullTitle = title ? `${title} | BLACKFILES` : DEFAULT_TITLE;
  const canonicalUrl = `${BASE_URL}${path}`;
  const imageUrl = image.startsWith("http") ? image : `${BASE_URL}${image}`;

  // Build Article JSON-LD for issue pages
  const articleJsonLd = type === "article" ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title || DEFAULT_TITLE,
    "description": description,
    "url": canonicalUrl,
    "image": imageUrl,
    "datePublished": publishedTime,
    "publisher": {
      "@type": "Organization",
      "name": "BLACKFILES",
      "url": BASE_URL,
    },
    "author": {
      "@type": "Organization",
      "name": "BLACKFILES",
    },
    ...(tags && { "keywords": tags.join(", ") }),
  } : null;

  const ldJson = jsonLd || articleJsonLd;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="BLACKFILES" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:site" content="@BLACKFILES" />

      {/* Article specific */}
      {type === "article" && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === "article" && tags && tags.map((tag) => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      {/* JSON-LD structured data */}
      {ldJson && (
        <script type="application/ld+json">
          {JSON.stringify(ldJson)}
        </script>
      )}
    </Helmet>
  );
};
