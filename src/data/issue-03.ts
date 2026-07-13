import type { Issue } from "./issues";
import { issue03SupportingMedia } from "@/lib/issue-assets";

const supportMediaBase = {
  aspectRatio: "wide" as const,
  position: "after" as const,
};

export const issue03 = {
  number: 3,
  title: "Inside AI Red-Teaming: Who Actually Tests the Limits, and Why It's Mostly Not a Secret",
  theme: "AI Red-Teaming",
  coverImage: "issue-03",
  publicationStatus: "published",
  publishDate: "2025-03-08",
  tags: [
    "ai-red-teaming",
    "jailbreak-benchmarks",
    "model-safety",
    "bug-bounties",
    "agentic-ai",
    "moderation",
  ],
  sections: [
    {
      id: "exec-3",
      type: "executive_summary",
      title: "What the rewrite changes",
      audienceLevel: "public",
      content:
        "The old version turned AI red-teaming into a secret-war story. The rewrite keeps the same topic but replaces the mythology with the documented reality: most serious AI limit testing happens in public, through bug bounties, benchmarks, standards bodies, and professional security work.\n\nThere is still an underground layer, but it is not the main event. The main event is a growing field of disclosed testing, shared tools, and repeatable benchmarks that make model weakness easier to measure and fix.",
      media: [
        {
          id: "issue-03-ecosystem-map",
          kind: "comparison",
          src: issue03SupportingMedia.ecosystem,
          alt: "Editorial map of the public red-teaming ecosystem across bug bounties, benchmarks, standards bodies, and CTFs.",
          caption: "The real red-teaming market is mostly open, paid, and measurable.",
          aspectRatio: supportMediaBase.aspectRatio,
          position: supportMediaBase.position,
        },
      ],
    },
    {
      id: "worlds-3",
      type: "deep_dive",
      title: "The two red-teaming worlds, and why conflating them is misleading",
      audienceLevel: "public",
      content:
        "Private communities that share jailbreak prompts do exist. The rewrite just stops pretending they are the whole story. In practice, the volume, funding, and sophistication of legitimate red-teaming dwarfs the underground hobbyist layer.\n\nThat does not make the private layer irrelevant. It makes it smaller than the original draft claimed, and much less central to how AI safety work is actually done.",
    },
    {
      id: "legitimate-3",
      type: "deep_dive",
      title: "The legitimate side: bug bounties, academic benchmarks, and standards bodies",
      audienceLevel: "public",
      content:
        "The mainstream side of AI testing looks a lot like conventional security work:\n\n- Public bug bounty programs pay researchers to report safety and security flaws.\n- Benchmarks like JailbreakBench compare models in a reproducible way.\n- Open-source scanners like garak help teams probe for known failure patterns.\n- OWASP and similar bodies maintain shared taxonomies that teams can actually use.\n- AI CTFs now exist as structured training grounds rather than underground hangouts.\n\nThat ecosystem is where most serious AI limit testing now happens.",
      media: [
        {
          id: "issue-03-contrast-board",
          kind: "comparison",
          src: issue03SupportingMedia.contrast,
          alt: "Split board comparing legitimate public red-teaming with the smaller underground prompt-sharing layer.",
          caption: "The public side is bigger, more disciplined, and easier to audit.",
          aspectRatio: supportMediaBase.aspectRatio,
          position: supportMediaBase.position,
        },
      ],
    },
    {
      id: "underground-3",
      type: "case_study",
      title: "The underground layer that does exist",
      audienceLevel: "public",
      content:
        "Private jailbreak-sharing communities are real, and they usually work the way the original issue described: reputation systems, tiered access, and iterative probing of model boundaries. But the techniques they trade are not magical secrets. They are the same categories documented in the legitimate literature: instruction override, role-play framing, and context erosion.\n\nThe more consequential underground layer is the commercialized dark-LLM market: purpose-built malicious AI tools sold as subscription products for cybercrime.",
    },
    {
      id: "stakes-3",
      type: "actionable_insight",
      title: "Why this matters more now: agentic AI changes the stakes",
      audienceLevel: "public",
      content:
        "When AI can browse, call tools, and take actions, a successful jailbreak or injection stops being a weird text trick and becomes a real operational risk: unauthorized access, credential theft, or data exfiltration.\n\nThat is why security teams now think in terms of non-human identities, least privilege, and controlled action boundaries. The moderation war metaphor is less useful than the access-control model.",
      media: [
        {
          id: "issue-03-workflow-map",
          kind: "mechanism",
          src: issue03SupportingMedia.workflow,
          alt: "Agentic AI workflow visual showing how tools, approvals, and monitoring reduce blast radius.",
          caption: "Agentic systems increase the stakes because they can do something after they read the prompt.",
          aspectRatio: supportMediaBase.aspectRatio,
          position: supportMediaBase.position,
        },
      ],
    },
    {
      id: "help-3",
      type: "doctrine_statement",
      title: "What actually helps",
      audienceLevel: "public",
      content:
        "For organizations, the useful moves are practical rather than flashy:\n\n- Run structured red-team exercises before deployment.\n- Treat public disclosures and CVEs as core intelligence.\n- Monitor published benchmarks instead of marketing claims.\n- Give agents only the minimum permissions they need.\n\nFor individuals, the legitimate path into the field is a public bug bounty, a benchmark, or a CTF. That is where the best work is, and it is a better use of time than a private prompt-trading Discord.",
    },
    {
      id: "sources-3",
      type: "sources",
      title: "Sources",
      audienceLevel: "public",
      content:
        "OWASP Top 10 for LLM Applications and Top 10 for Agentic Applications (2025–2026); JailbreakBench (academic benchmark); NVIDIA-maintained garak scanner documentation; MDPI peer-reviewed review of prompt injection literature (January 2026); Dark Reading 2026 security professional poll; Darktrace State of AI Cybersecurity 2026.",
    },
  ],
} satisfies Issue;
