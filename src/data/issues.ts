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
    title: "The Architecture of Invisible Markets",
    theme: "Shadow Finance",
    publicationStatus: 'published',
    publishDate: "2024-01-15",
    tags: ["shadow-banking", "offshore", "systemic-risk"],
    sections: [
      {
        id: "exec-1",
        type: "executive_summary",
        audienceLevel: "public",
        content: "A comprehensive analysis of the $67 trillion shadow banking system and its interconnections with regulated financial infrastructure. This issue maps the topology of off-balance-sheet vehicles, repo markets, and the hidden leverage that amplifies systemic fragility."
      },
      {
        id: "doctrine-1",
        type: "doctrine_statement",
        audienceLevel: "professional",
        content: "**DOCTRINE 001**: Markets are not discovered—they are engineered. Every trading venue, clearinghouse, and settlement system represents accumulated policy decisions that favor specific actors while obscuring risk transfer to others."
      },
      {
        id: "deep-1",
        type: "deep_dive",
        audienceLevel: "restricted",
        content: "The structural mechanics of rehypothecation chains reveal how a single Treasury bond can serve as collateral in seven simultaneous transactions. We trace specific pathways through prime brokerage operations at three major banks.",
        sidebarElements: [
          { type: "pull_quote", content: "The velocity of collateral is the hidden heartbeat of modern finance." },
          { type: "hacker_note", content: "Cross-reference DTCC daily settlement data with European SFTR reporting for arbitrage detection." }
        ]
      }
    ]
  },
  {
    number: 2,
    title: "Exploit Fusion: When Cyber Meets Capital",
    theme: "Technical Convergence",
    publicationStatus: 'published',
    publishDate: "2024-02-12",
    tags: ["cybersecurity", "financial-crime", "exploit-chains"],
    sections: [
      {
        id: "exec-2",
        type: "executive_summary",
        audienceLevel: "public",
        content: "The convergence of technical exploitation and financial manipulation creates hybrid attack vectors that neither cybersecurity teams nor compliance departments are equipped to detect. We analyze three recent incidents where zero-days enabled market manipulation."
      },
      {
        id: "case-2",
        type: "case_study",
        audienceLevel: "professional",
        content: "**CASE FILE: OPERATION PHANTOM LEDGER** — In Q3 2023, threat actors deployed a novel attack combining smart contract vulnerabilities with traditional forex settlement timing. The operation extracted $340M before detection."
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
