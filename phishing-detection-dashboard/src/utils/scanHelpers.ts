import { ScanResult, HistoryItem } from "../types";

export function createHistoryItem(
  scanType: "url" | "email" | "image" | "combined",
  target: string,
  result: ScanResult
): HistoryItem {
  return {
    id: `hist-${Date.now()}`,
    timestamp: new Date().toLocaleString(),
    type: scanType,
    target,
    result,
  };
}

export function getThreatSeverityScore(prediction: string, confidence: number): number {
  switch (prediction) {
    case "Phishing":
      return 55 + confidence * 45;
    case "Suspicious":
      return 35 + confidence * 35;
    default:
      return 5 + confidence * 25;
  }
}

export function cleanBase64Image(imageData: string): string {
  return imageData.replace(/^data:image\/\w+;base64,/, "");
}
