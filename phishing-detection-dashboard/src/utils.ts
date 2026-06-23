import { ScanResult } from "./types";

export const THREAT_DEFINITIONS: Record<string, { title: string; danger: string; explanation: string }> = {
  "brand impersonation": {
    title: "Brand Cloning / Impersonation",
    danger: "Exploitation of Trust",
    explanation: "Replicates authentic logos, colors, custom typography, and corporate design systems to make malicious payloads look legitimate."
  },
  "brand cloning": {
    title: "Brand Cloning / Impersonation",
    danger: "Exploitation of Trust",
    explanation: "Replicates authentic logos, colors, custom typography, and corporate design systems to make malicious payloads look legitimate."
  },
  "credential harvesting": {
    title: "Credential Harvesting Forms",
    danger: "Account Takeover Hazard",
    explanation: "Fraudulent forms, prompts, and fields engineered to capture passwords, MFA keys, or pins and save them directly to attacker log files."
  },
  "urgency": {
    title: "Urgent Social Engineering Call to Action",
    danger: "Psychological Manipulation",
    explanation: "Enforces artificial deadlines or warnings ('Suspended in 2 hours') to trigger panic, causing users to bypass safety controls."
  },
  "social engineering": {
    title: "Social Engineering Tactics",
    danger: "High Human Deception Risk",
    explanation: "Exploits standard behavior patterns, helpfulness, or fear of penalty or compliance notifications to procure user compliance."
  },
  "lookalike": {
    title: "Lookalike / Typosquatted Domain",
    danger: "Deceptive Spoofed Routing",
    explanation: "Utilizes misleading domain spelling variants or deceptive subdomains (e.g. chase.com-security-server.top) to mimic trusted endpoints."
  },
  "phishing attachment": {
    title: "Phishing Attachments & Exploits",
    danger: "Device Compromise & Malware Risk",
    explanation: "Disguises harmful payloads or visual links inside document attachment lookalikes to infect host computers with ransomware or hijackers."
  },
  "malicious attachment": {
    title: "Phishing Attachments & Exploits",
    danger: "Device Compromise & Malware Risk",
    explanation: "Disguises harmful payloads or visual links inside document attachment lookalikes to infect host computers with ransomware or hijackers."
  }
};

export function getRiskColor(risk: string): string {
  switch (risk?.toLowerCase()) {
    case "high":
      return "text-red-500 bg-red-500/10 border-red-500/20";
    case "medium":
      return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    default:
      return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
  }
}

export function getStatusColorClass(status: string): string {
  switch (status) {
    case "severe":
      return "bg-red-500/15 border-red-500/30 text-red-400";
    case "warning":
      return "bg-amber-500/15 border-amber-500/30 text-amber-400";
    default:
      return "bg-emerald-500/15 border-emerald-500/30 text-emerald-400";
  }
}

export function buildTargetDescription(
  scanType: "url" | "email" | "image" | "combined",
  urlInput: string,
  emailInput: string,
  imageFileName: string | null
): string {
  if (scanType === "url") {
    return urlInput || "http://verified-secure-channel-redirect.net";
  } else if (scanType === "email") {
    return emailInput ? (emailInput.substring(0, 65) + (emailInput.length > 65 ? "..." : "")) : "Raw Email Header Data";
  } else if (scanType === "image") {
    return imageFileName || "Uploaded Screenshot visual feed";
  }
  return "Combined context stream (URL + Email Content + Visual Screenshots)";
}

export function computeQuizAnswer(
  userChoice: boolean,
  isPhishing: boolean
): { answered: boolean; userChoice: boolean; isCorrect: boolean } {
  return {
    answered: true,
    userChoice,
    isCorrect: userChoice === isPhishing
  };
}
