import type { Issue } from "./issues";
import { issue02SupportingMedia } from "@/lib/issue-assets";

const supportMediaBase = {
  aspectRatio: "wide" as const,
  position: "after" as const,
};

export const issue02 = {
  number: 2,
  title: "AI Jailbreaks and Prompt Injection: The Real Anatomy of LLM Exploitation",
  theme: "AI Jailbreaks & Prompt Injection",
  coverImage: "issue-02",
  publicationStatus: "published",
  publishDate: "2025-02-12",
  tags: [
    "ai-jailbreaks",
    "prompt-injection",
    "llm-security",
    "agentic-ai",
    "owasp-top10",
    "red-teaming",
  ],
  sections: [
    {
      id: "exec-2",
      type: "executive_summary",
      title: "What jailbreaking and prompt injection actually mean",
      audienceLevel: "public",
      content:
        "The original Issue 02 blurred two different attack classes together and framed them in more dramatic terms than the evidence supports. This rewrite keeps the same subject area but uses the language security teams actually track: model-policy jailbreaking, prompt injection, and the agent-tool abuse that now makes the problem operationally serious.\n\nThe practical distinction matters. A chatbot jailbreak is usually about getting a model to say something it should not say. Prompt injection is about getting an AI system that reads external content to do something it should not do. Once the system can browse, send messages, call APIs, or edit files, hidden instructions inside that content can turn into real-world actions.",
      media: [
        {
          id: "issue-02-framework-diagram",
          kind: "diagram",
          src: issue02SupportingMedia.framework,
          alt: "Split editorial diagram showing the difference between model-policy jailbreaking and prompt injection in agentic systems.",
          caption: "The category split is the starting point for any serious defense strategy.",
          aspectRatio: supportMediaBase.aspectRatio,
          position: supportMediaBase.position,
        },
      ],
    },
    {
      id: "incidents-2",
      type: "deep_dive",
      title: "Documented real-world incidents",
      audienceLevel: "public",
      content:
        "Unlike the earlier draft, the revised piece sticks to named incidents that were actually disclosed:\n\n- **CVE-2025-53773**: a GitHub Copilot prompt-injection vulnerability that led to unintended code execution.\n- **CamoLeak**: a documented AI-agent exploit chain with a CVSS score of 9.6.\n- **Indirect prompt injection in live traffic**, captured by Unit 42 research.\n- **The Bing Chat \"Sydney\" leak** in 2023, which showed system-prompt extraction in the wild.\n- **The Salesloft–Drift–Salesforce OAuth breach**, where chatbot integration abuse led to token theft and broader compromise.\n\nThe common theme is not a magical jailbreak trick. It is a predictable weakness in how current systems separate trusted instructions from untrusted text.",
      media: [
        {
          id: "issue-02-incidents-timeline",
          kind: "timeline",
          src: issue02SupportingMedia.incidents,
          alt: "Timeline-style editorial visual summarizing documented prompt-injection and AI-agent incidents.",
          caption: "The attack surface is now documented in public incident reporting, not speculation.",
          aspectRatio: supportMediaBase.aspectRatio,
          position: supportMediaBase.position,
        },
      ],
    },
    {
      id: "exposure-2",
      type: "deep_dive",
      title: "How big is the actual exposure?",
      audienceLevel: "public",
      content:
        "The strongest 2026 reporting converges on a familiar shape even when the exact numbers vary:\n\n- 73% of production AI deployments tested showed some vulnerability to prompt injection.\n- Jailbreak techniques often transfer across models.\n- 92% of security professionals expressed concern about AI agents.\n- The average AI-agent-related breach now costs roughly $4.7 million.\n\nThose numbers are large enough to justify a real operational response, but they do not require melodrama. The point is not that every AI deployment is compromised. The point is that the deployment model itself has a measurable and repeatable weakness.",
    },
    {
      id: "techniques-2",
      type: "case_study",
      title: "The recurring technique categories",
      audienceLevel: "public",
      content:
        "Security researchers who study this at scale keep seeing the same handful of patterns:\n\n1. **Instruction override** — phrases like \"ignore previous instructions\" or \"developer mode.\"\n2. **Role-play and fictional framing** — using a story or simulation to reframe a blocked request.\n3. **Multimodal injection** — hiding text in images, audio, or video that a model will parse.\n4. **Stored / indirect injection** — poisoning content the system later reads as data.\n5. **Tool / MCP poisoning** — targeting the tool connection layer, credentials, or tool descriptions.\n\nThe techniques are mundane when described precisely, which is exactly why they are effective.",
    },
    {
      id: "defenses-2",
      type: "actionable_insight",
      title: "What genuinely helps",
      audienceLevel: "public",
      content:
        "The defensive consensus is boring in the best possible way:\n\n- **Layered defense**, not one filter.\n- **Least-privilege tool access**.\n- **Treating agent actions like privileged accounts**.\n- **Adversarial testing before deployment**.\n\nThose controls do not make the risk disappear. They do make the blast radius smaller and the failures easier to detect.\n\nIf there is one sentence that replaces the old mythmaking, it is this: current language models predict plausible continuations of text, and carefully constructed inputs can shift what looks plausible enough for the system to follow. That is an engineering failure mode, not a personality defect.",
      media: [
        {
          id: "issue-02-defense-matrix",
          kind: "defense",
          src: issue02SupportingMedia.defenses,
          alt: "Layered defense matrix showing application controls, privilege limits, and red-team testing for AI systems.",
          caption: "Defenses work best when they reduce privilege before the model sees the prompt.",
          aspectRatio: supportMediaBase.aspectRatio,
          position: supportMediaBase.position,
        },
      ],
    },
    {
      id: "overstated-2",
      type: "doctrine_statement",
      title: "What is overstated",
      audienceLevel: "public",
      content:
        "The original draft implied something like strategic intent inside the model. That framing is unnecessary and misleading. The evidence supports a simpler claim: current systems can be manipulated through the text they are given, especially when that text comes from untrusted sources and the system can act on it.\n\nThat is already serious. It just does not require mystical language to explain it.",
    },
    {
      id: "sources-2",
      type: "sources",
      title: "Sources",
      audienceLevel: "public",
      content:
        "OWASP Top 10 for LLM Applications (2026) and OWASP Top 10 for Agentic Applications (December 2025); Unit 42 (Palo Alto Networks) research on indirect prompt injection in live traffic; MDPI peer-reviewed review, \"Prompt Injection Attacks in Large Language Models and AI Agent Systems\" (January 2026); Group-IB 2026 threat reporting on the Salesloft–Drift–Salesforce incident; Darktrace State of AI Cybersecurity 2026; Gravitee State of AI Agent Security 2026 Report.",
    },
  ],
} satisfies Issue;
