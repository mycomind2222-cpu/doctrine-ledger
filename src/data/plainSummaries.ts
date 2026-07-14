/**
 * Auto-generates a plain-English TL;DR summary from the executive summary section.
 * Strips jargon and makes it accessible to a general audience.
 */

const simpleSummaries: Record<number, string> = {
  1: "Synthetic identity fraud combines a real piece of personal information—usually a Social Security number—with a fake name, birthdate, and address to create a person who does not exist. Criminals build credit for these identities over months or years, then max out multiple accounts and disappear. This issue explains how the process works, why banks struggle to detect it, where the fraud is spreading, and how families and financial institutions can reduce the risk.",
  2: "Jailbreaking and prompt injection are related but different problems. One tries to make a model say something it should not say; the other tries to make an AI system do something it should not do. This issue uses real incidents, actual attack categories, and practical defenses to explain why prompt injection has become the bigger operational risk.",
  3: "Most serious AI red-teaming is not happening in secret Discords. It is happening through bug bounties, benchmarks, standards bodies, and professional security work. This issue separates the public testing ecosystem from the smaller underground layer and explains why agentic AI has changed the stakes.",
  4: "There's a thriving underground marketplace where people buy and sell AI prompts, hacking techniques, and viral content tools. AI-powered meme generators are now used for propaganda and market manipulation. This issue maps out how knowledge itself has become a tradeable commodity.",
  5: "Your personal data — face scans, voice patterns, typing habits — is being harvested and traded on a massive scale. AI deepfakes now cost under $50 to produce, and synthetic identities are sold as complete kits. This issue shows how biometric data has become the new black market currency.",
  6: "Financial regulators are losing the battle against AI-powered fraud. Automated systems now exploit loopholes faster than rules can be written. This issue examines how AI is being weaponized against the financial system, from synthetic credit fraud to autonomous market manipulation.",
  7: "A new model of conflict is emerging: instead of bombs, attackers use financial exploits, AI manipulation, and infrastructure hacking. Nations and criminal groups wage invisible wars through markets and data systems. This issue maps the intersection of cyber warfare and financial warfare.",
  8: "AI systems are starting to make financial decisions without human oversight — trading stocks, moving money, and even creating new financial products autonomously. This raises profound questions about who's actually controlling the global financial system. This issue explores AI autonomy in finance.",
  9: "The line between legitimate finance and organized crime is blurring. Criminal networks now operate like corporations with R&D departments, customer service, and franchise models. This issue examines how shadow economies are becoming professionalized and industrialized.",
  10: "Governments and corporations are building new digital control systems — from CBDCs to AI surveillance — that could reshape who has access to money and markets. This issue analyzes the power structures being built under the banner of financial innovation.",
};

export const getPlainSummary = (issueNumber: number, executiveSummaryContent?: string): string => {
  if (simpleSummaries[issueNumber]) return simpleSummaries[issueNumber];

  // For dynamic issues (11+), create a simplified version from the executive summary
  if (executiveSummaryContent) {
    // Take first 2 sentences and simplify
    const sentences = executiveSummaryContent
      .replace(/\*\*/g, '')
      .split(/(?<=[.!?])\s+/)
      .filter(s => s.length > 10)
      .slice(0, 3);
    return sentences.join(' ');
  }
  
  return "This briefing analyzes emerging threats and hidden patterns in global financial markets and digital systems.";
};
