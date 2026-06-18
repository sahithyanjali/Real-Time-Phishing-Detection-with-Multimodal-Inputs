export interface ScanIndicator {
  label: string;
  status: 'severe' | 'warning' | 'safe';
  detail: string;
}

export interface ExtractedDetails {
  senderEmail?: string;
  impersonatorBrand?: string;
  domainReputation?: string;
  sslStatus?: string;
  suspiciousKeywords?: string[];
}

export interface ScanResult {
  prediction: "Phishing" | "Legitimate" | "Suspicious";
  confidence: number; // 0.0 to 1.0
  riskLevel: "Low" | "Medium" | "High";
  reasons: string[];
  action: string;
  threatTypes: string[];
  indicators: ScanIndicator[];
  extractedDetails?: ExtractedDetails;
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  type: "url" | "email" | "image" | "combined";
  target: string; // url, filename or email subject preview
  result: ScanResult;
}

export interface QuizQuestion {
  id: string;
  sender: string;
  subjectOrUrl: string;
  bodyPreview: string;
  screenshotUrl?: string;
  type: "email" | "url" | "image";
  isPhishing: boolean;
  explanation: string;
  redFlags: string[];
}
