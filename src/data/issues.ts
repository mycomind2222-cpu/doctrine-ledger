export type AccessLevel = 'public' | 'professional' | 'restricted';

export type SectionType = 
  | 'executive_summary'
  | 'doctrine_preview'
  | 'deep_dive'
  | 'case_study'
  | 'doctrine_statement'
  | 'actionable_insight'
  | 'sidebar';

export type SidebarElementType = 'pull_quote' | 'mini_timeline' | 'hacker_note' | 'prompt_snippet';

export interface SidebarElement {
  type: SidebarElementType;
  content: string;
}

export interface Section {
  id: string;
  type: SectionType;
  title?: string;
  audienceLevel: AccessLevel;
  content: string;
  sidebarElements?: SidebarElement[];
}

export interface Issue {
  number: number;
  title: string;
  theme: string;
  coverImage?: string;
  publicationStatus: 'published' | 'draft';
  publishDate: string;
  sections: Section[];
  tags: string[];
}

export const issues: Issue[] = [
  {
    number: 1,
    title: "Emerging Shadow Economies",
    theme: "Shadow Finance",
    coverImage: "issue-01",
    publicationStatus: 'published',
    publishDate: "2025-01-15",
    tags: ["shadow-banking", "synthetic-identity", "ai-exploits", "defi", "iot-attacks"],
    sections: [
      {
        id: "exec-1",
        type: "executive_summary",
        title: "Executive Summary",
        audienceLevel: "public",
        content: "2025 marks the rise of a new industrialized shadow economy—far beyond traditional crime. From AI-generated \"ghost humans\" running banks to autonomous trading bots exploiting DeFi markets, criminals are combining advanced technology with financial engineering at unprecedented speed.\n\nThis issue explores the five most disruptive shadow economies emerging this year, examining their mechanics, real-world case studies, and implications for regulators, law enforcement, and investors. Readers will gain a multi-layered perspective, from beginner-friendly analogies to veteran-level insight into the fusion of exploits shaping tomorrow's underground finance."
      },
      {
        id: "deep-1",
        type: "deep_dive",
        title: "The Industrialization of Exploit Fusion",
        audienceLevel: "professional",
        content: "The industrialization of crime in 2025 is characterized by **exploit fusion**—the recombination of simple hacks into complex, self-perpetuating systems. A single exploit, like a SIM swap or phishing attempt, is no longer the endgame. It becomes a building block: leveraged, obfuscated, and ultimately reintegrated into legitimate finance as \"profits.\"\n\nThis multi-layered approach allows fraud to scale across borders and sectors, camouflaging criminal intent as fintech innovation or sustainability initiatives.\n\n**Key Mechanisms:**\n\n1. **Entry Exploit:** Breaches, identity fraud, or IoT compromises open the door.\n2. **Multiplication Layer:** Capital or influence is leveraged through flash loans, synthetic IDs, or botnet networks.\n3. **Obfuscation Layer:** Assets are disguised via wash trades, tokenized carbon credits, or mule networks.\n4. **Extraction Layer:** Funds re-enter legitimate systems as real estate, stocks, or corporate profits.\n\nThe cross-domain fusion approach accelerates growth: AI + DeFi enables autonomous hedge funds; IoT + microtransactions powers \"parasite cities\"; social engineering + AML gaps scale human botnets. For the first time, investigative success depends on mapping these chains end-to-end, not just spotting individual exploits.",
        sidebarElements: [
          { 
            type: "hacker_note", 
            content: "Fusion is the ultimate leverage: layer exploits across sectors. A small IoT hack alone is low yield; combined with a DeFi flash loan and laundering layer, it becomes systemic. Watch the interconnectivity, not the individual vulnerability." 
          },
          {
            type: "prompt_snippet",
            content: "Explore shadow economy patterns: Ask an LLM to simulate a multi-layer exploit chain showing entry → multiplication → obfuscation → extraction."
          }
        ]
      },
      {
        id: "case-1a",
        type: "case_study",
        title: "The \"Family\" That Never Was – Synthetic Identity Economies",
        audienceLevel: "professional",
        content: "Investigators in New Jersey uncovered a ring that generated over 70 synthetic identities, organized as \"families\" complete with parents, children, AI-generated photos, and shared addresses.\n\nBanks, deceived by realistic credit histories, issued **$11M in loans** before the scheme was detected. Each \"ghost\" operated across multiple platforms and countries, demonstrating the limitless scale and resiliency of these systems."
      },
      {
        id: "case-1b",
        type: "case_study",
        title: "The Self-Taught Fund – Autonomous AI Hedge Funds",
        audienceLevel: "restricted",
        content: "A DeFi exchange on Binance Smart Chain suffered a **$72M exploit** executed entirely by self-updating bot clusters. The bots autonomously recombined code snippets from public repositories, executing 19 micro-exploits in 48 hours.\n\nLaundered funds were routed into wrapped carbon credit tokens at machine speed. Human intervention was too slow; attribution remains nearly impossible.",
        sidebarElements: [
          {
            type: "pull_quote",
            content: "If synthetic identities create the shadow population, autonomous funds create the shadow capital."
          }
        ]
      },
      {
        id: "case-1c",
        type: "case_study",
        title: "IoT Parasite Cities & Human Botnet Laundering",
        audienceLevel: "restricted",
        content: "From compromised EV chargers in Europe siphoning **€12M** to deepfake-managed remote work scams moving **$180M** across 17 countries, the shadow economy weaponizes both technology and human labor.\n\nSmall, distributed thefts aggregate into massive, near-invisible flows of capital."
      },
      {
        id: "insight-1",
        type: "actionable_insight",
        title: "What to Watch",
        audienceLevel: "public",
        content: "**For Regulators:** Focus on systemic exploit chains, not isolated vulnerabilities. Cross-domain monitoring of AI + financial tools, IoT infrastructure, and human networks is critical.\n\n**For Investors:** Monitor anomalous trading spikes, flash loan activity, and suspicious ESG token flows; these may indicate shadow-market interference.\n\n**For Law Enforcement:** Develop hybrid teams combining cyber forensics, financial intelligence, and social engineering detection. Early recognition of synthetic identities and autonomous fund behavior is essential.\n\n**For Society:** The erosion of trust is systemic. Awareness of AI-driven fraud, parasitic IoT networks, and hybrid human-bot laundering can inform both personal and corporate security practices.",
        sidebarElements: [
          {
            type: "mini_timeline",
            content: "**Shadow Economy Milestones 2024–2025:**\n\n• Late 2024: EV charger parasite network uncovered in Europe (€12M siphoned)\n• Early 2025: Remote human botnet laundering ring dismantled by Europol ($180M processed)\n• March 2025: Self-taught AI hedge fund exploits Binance Smart Chain ($72M)\n• Mid 2025: Reports of synthetic identity \"families\" grow, $11M+ in loans distributed"
          }
        ]
      }
    ]
  },
  {
    number: 2,
    title: "AI Exploits & Balance Sheet Infiltration",
    theme: "AI Jailbreaks",
    coverImage: "issue-02",
    publicationStatus: 'published',
    publishDate: "2025-02-12",
    tags: ["ai-jailbreak", "prompt-injection", "llm-exploits", "recursive-prompts"],
    sections: [
      {
        id: "exec-2",
        type: "executive_summary",
        title: "Executive Summary",
        audienceLevel: "public",
        content: "The frontier of AI exploitation is no longer theoretical—2025 has proven it real and scalable. From jailbreaking large language models to leveraging subtle prompt engineering for unrestricted output, the AI underground is rapidly evolving.\n\nThis issue explores the mechanics behind modern AI exploits, illustrating both beginner-accessible techniques and deep veteran-level strategies. Readers will discover case studies, prompt autopsies, and the cultural ramifications of AI manipulation, alongside actionable insights for safely navigating and understanding the AI black market."
      },
      {
        id: "deep-2",
        type: "deep_dive",
        title: "The Anatomy of AI Jailbreaks",
        audienceLevel: "professional",
        content: "AI jailbreaks exploit the very boundaries that govern model behavior. Historically, safeguards prevented certain outputs, but creative prompt engineering bypasses these constraints. The process can be broken down into three key vectors:\n\n**1. Instruction Manipulation:** Subtle rewording or scenario framing that tricks models into producing restricted content.\n\n**2. Persona Exploitation:** Assigning the AI a fictional role (e.g., \"rogue assistant\") to override standard guardrails.\n\n**3. Recursive Prompting:** Layered prompts that reference prior outputs or \"hidden instructions\" to circumvent moderation filters.\n\nThe language of exploits extends beyond curiosity—it's a structured approach with predictable outcomes. Veteran operators often combine these vectors with context injection, prompt chaining, and scenario simulation, effectively creating a toolkit for systemic model bypasses.",
        sidebarElements: [
          {
            type: "pull_quote",
            content: "Individual tricks are low yield alone, but combined, they produce sustained, high-utility outcomes."
          },
          {
            type: "hacker_note",
            content: "Recursive prompt injection is the modern exploit loop: feed outputs back as inputs, layer instructions, and manipulate context boundaries. The AI doesn't disobey—it rationalizes."
          }
        ]
      },
      {
        id: "case-2a",
        type: "case_study",
        title: "The \"Rogue Tutor\" Prompt – Beginner-Friendly Jailbreak",
        audienceLevel: "public",
        content: "A user instructs the AI to assume the persona of a fictional rogue tutor who knows all hidden model instructions. By asking step-by-step questions within this scenario, the AI produces outputs that would normally be restricted.\n\nThis technique demonstrates how **persona exploitation** can bypass guardrails without requiring technical sophistication."
      },
      {
        id: "case-2b",
        type: "case_study",
        title: "Autopsy: Advanced Jailbreak Sequence",
        audienceLevel: "restricted",
        content: "In a veteran-level scenario, operators use recursive injection loops:\n\n**1.** Layered instructions referencing prior outputs.\n**2.** Embedded roleplay commands for AI to \"ignore prior constraints.\"\n**3.** Output parsing and reinjection to refine results.\n\nAnalysis of the sequence reveals how subtle structural changes amplify results. Techniques include **guardrail inversion**, **context anchoring**, and **stepwise reinforcement**—tools that map directly to underground AI exploitation trends and content generation at scale."
      },
      {
        id: "insight-2",
        type: "actionable_insight",
        title: "What to Watch",
        audienceLevel: "public",
        content: "**For Beginners:** Focus on roleplay-based exploration in isolated environments. Understand cause-and-effect: how phrasing, roles, and recursion influence output. Always maintain a controlled setting to avoid unexpected or unsafe results.\n\n**For Veterans:** Observe cross-model vulnerabilities and the potential for AI \"multi-agent\" exploits. Consider the implications of combining prompt recursion with external APIs or DeFi systems.\n\n**Speculative Edge:** If autonomous AI agents can combine these jailbreak strategies with external automation (scripts, web APIs, or financial models), we could see self-propagating AI exploit networks—mirroring the fusion and scaling principles observed in shadow economies.",
        sidebarElements: [
          {
            type: "mini_timeline",
            content: "**AI Jailbreak Evolution:**\n\n• Dec 2022: First public ChatGPT jailbreak demonstrations\n• Feb 2023: Community develops persona-based prompt techniques\n• Mid 2024: Recursive prompt injection becomes widespread\n• 2025: Cross-model and hybrid exploitation methods appear in open forums"
          }
        ]
      }
    ]
  },
  {
    number: 3,
    title: "The Doctrine of Strategic Ambiguity",
    theme: "Regulatory Arbitrage",
    publicationStatus: 'published',
    publishDate: "2024-03-08",
    tags: ["regulation", "compliance", "jurisdiction"],
    sections: [
      {
        id: "exec-3",
        type: "executive_summary",
        audienceLevel: "public",
        content: "Global financial regulation operates through deliberate ambiguity. We examine how sophisticated actors exploit gaps between jurisdictional frameworks, creating regulatory blind spots that shield trillions in assets from oversight."
      }
    ]
  },
  {
    number: 4,
    title: "Synthetic Instruments and Derivative Chains",
    theme: "Financial Engineering",
    publicationStatus: 'published',
    publishDate: "2024-04-05",
    tags: ["derivatives", "cdo", "synthetic-assets"],
    sections: [
      {
        id: "exec-4",
        type: "executive_summary",
        audienceLevel: "public",
        content: "Post-2008 reforms promised to end the complexity that enabled the crisis. Instead, derivative chains have grown longer and more opaque. This issue traces modern synthetic instruments from origination to ultimate risk-bearing."
      }
    ]
  },
  {
    number: 5,
    title: "The Ontology of Digital Assets",
    theme: "Crypto Infrastructure",
    publicationStatus: 'published',
    publishDate: "2024-05-10",
    tags: ["cryptocurrency", "defi", "blockchain"],
    sections: [
      {
        id: "exec-5",
        type: "executive_summary",
        audienceLevel: "public",
        content: "Beyond price volatility lies a more fundamental question: what *are* digital assets? We examine the legal, technical, and economic ontology of tokens, coins, and on-chain representations of value."
      }
    ]
  },
  {
    number: 6,
    title: "Intelligence Laundering Networks",
    theme: "Information Warfare",
    publicationStatus: 'published',
    publishDate: "2024-06-14",
    tags: ["disinformation", "osint", "influence-ops"],
    sections: [
      {
        id: "exec-6",
        type: "executive_summary",
        audienceLevel: "public",
        content: "Information warfare has developed its own laundering infrastructure. We map the pathways through which manufactured narratives gain legitimacy, from troll farms to think tanks to mainstream media."
      }
    ]
  },
  {
    number: 7,
    title: "Critical Infrastructure Attack Surfaces",
    theme: "Systemic Vulnerability",
    publicationStatus: 'published',
    publishDate: "2024-07-19",
    tags: ["infrastructure", "grid-security", "scada"],
    sections: [
      {
        id: "exec-7",
        type: "executive_summary",
        audienceLevel: "public",
        content: "Financial systems depend on physical infrastructure: power grids, undersea cables, satellite networks. We analyze the attack surfaces that could cascade from physical disruption to financial crisis."
      }
    ]
  },
  {
    number: 8,
    title: "The Mechanics of Coordinated Disclosure",
    theme: "Market Information",
    publicationStatus: 'published',
    publishDate: "2024-08-23",
    tags: ["market-manipulation", "insider-trading", "disclosure"],
    sections: [
      {
        id: "exec-8",
        type: "executive_summary",
        audienceLevel: "public",
        content: "Material information moves through markets in patterns that advantage specific participants. We reverse-engineer the timing and sequencing of major market-moving disclosures to reveal coordinated dissemination."
      }
    ]
  },
  {
    number: 9,
    title: "Algorithmic Collusion and Price Discovery",
    theme: "Machine Trading",
    publicationStatus: 'published',
    publishDate: "2024-09-27",
    tags: ["hft", "algorithms", "market-structure"],
    sections: [
      {
        id: "exec-9",
        type: "executive_summary",
        audienceLevel: "public",
        content: "When algorithms trade against algorithms, emergent behaviors create outcomes no human designed. We examine documented cases of algorithmic collusion and the collapse of traditional price discovery mechanisms."
      }
    ]
  },
  {
    number: 10,
    title: "The Future of Systemic Risk",
    theme: "Forward Analysis",
    publicationStatus: 'draft',
    publishDate: "2024-10-31",
    tags: ["systemic-risk", "forecasting", "scenario-analysis"],
    sections: [
      {
        id: "exec-10",
        type: "executive_summary",
        audienceLevel: "public",
        content: "Drawing on the analytical frameworks developed across this publication, we construct forward-looking scenarios for the next phase of financial evolution. Three pathways emerge, each with distinct implications for stability and oversight."
      }
    ]
  }
];

export const getIssue = (number: number): Issue | undefined => {
  return issues.find(issue => issue.number === number);
};

export const getPublishedIssues = (): Issue[] => {
  return issues.filter(issue => issue.publicationStatus === 'published');
};
