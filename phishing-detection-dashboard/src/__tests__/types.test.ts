import { describe, it, expect } from "vitest";
import type {
  ScanIndicator,
  ExtractedDetails,
  ScanResult,
  HistoryItem,
  QuizQuestion,
} from "../types";

describe("Type interfaces structural validation", () => {
  it("ScanIndicator can be constructed with valid data", () => {
    const indicator: ScanIndicator = {
      label: "SSL Validity",
      status: "severe",
      detail: "Self-signed certificate detected",
    };
    expect(indicator.label).toBe("SSL Validity");
    expect(indicator.status).toBe("severe");
    expect(indicator.detail).toBe("Self-signed certificate detected");
  });

  it("ScanIndicator supports all status values", () => {
    const statuses: ScanIndicator["status"][] = ["severe", "warning", "safe"];
    statuses.forEach((status) => {
      const indicator: ScanIndicator = { label: "Test", status, detail: "Detail" };
      expect(indicator.status).toBe(status);
    });
  });

  it("ExtractedDetails can be partially populated", () => {
    const details: ExtractedDetails = {
      senderEmail: "test@example.com",
    };
    expect(details.senderEmail).toBe("test@example.com");
    expect(details.impersonatorBrand).toBeUndefined();
    expect(details.domainReputation).toBeUndefined();
    expect(details.sslStatus).toBeUndefined();
    expect(details.suspiciousKeywords).toBeUndefined();
  });

  it("ExtractedDetails can be fully populated", () => {
    const details: ExtractedDetails = {
      senderEmail: "fake@phishing.com",
      impersonatorBrand: "PayPal",
      domainReputation: "Malicious",
      sslStatus: "Self-signed",
      suspiciousKeywords: ["urgent", "verify", "password"],
    };
    expect(details.suspiciousKeywords).toHaveLength(3);
    expect(details.impersonatorBrand).toBe("PayPal");
  });

  it("ScanResult can be constructed with all required fields", () => {
    const result: ScanResult = {
      prediction: "Phishing",
      confidence: 0.98,
      riskLevel: "High",
      reasons: ["Suspicious domain", "Urgency language"],
      action: "Block immediately",
      threatTypes: ["Brand Impersonation"],
      indicators: [{ label: "Test", status: "severe", detail: "Critical" }],
    };
    expect(result.prediction).toBe("Phishing");
    expect(result.confidence).toBe(0.98);
    expect(result.extractedDetails).toBeUndefined();
  });

  it("ScanResult supports all prediction values", () => {
    const predictions: ScanResult["prediction"][] = ["Phishing", "Legitimate", "Suspicious"];
    predictions.forEach((pred) => {
      const result: ScanResult = {
        prediction: pred,
        confidence: 0.5,
        riskLevel: "Low",
        reasons: [],
        action: "Test",
        threatTypes: [],
        indicators: [],
      };
      expect(result.prediction).toBe(pred);
    });
  });

  it("HistoryItem can be constructed", () => {
    const item: HistoryItem = {
      id: "hist-123",
      timestamp: new Date().toLocaleString(),
      type: "url",
      target: "https://example.com",
      result: {
        prediction: "Legitimate",
        confidence: 0.99,
        riskLevel: "Low",
        reasons: ["Safe domain"],
        action: "Allow",
        threatTypes: ["None"],
        indicators: [],
      },
    };
    expect(item.id).toBe("hist-123");
    expect(item.type).toBe("url");
  });

  it("HistoryItem supports all type values", () => {
    const types: HistoryItem["type"][] = ["url", "email", "image", "combined"];
    types.forEach((type) => {
      const item: HistoryItem = {
        id: "test",
        timestamp: "now",
        type,
        target: "test",
        result: {
          prediction: "Legitimate",
          confidence: 0.5,
          riskLevel: "Low",
          reasons: [],
          action: "",
          threatTypes: [],
          indicators: [],
        },
      };
      expect(item.type).toBe(type);
    });
  });

  it("QuizQuestion can be constructed", () => {
    const q: QuizQuestion = {
      id: "q-test",
      sender: "Test Sender",
      subjectOrUrl: "Test Subject",
      bodyPreview: "Test body",
      type: "email",
      isPhishing: true,
      explanation: "This is a test phishing question",
      redFlags: ["Red flag 1", "Red flag 2"],
    };
    expect(q.isPhishing).toBe(true);
    expect(q.redFlags).toHaveLength(2);
    expect(q.screenshotUrl).toBeUndefined();
  });

  it("QuizQuestion supports optional screenshotUrl", () => {
    const q: QuizQuestion = {
      id: "q-test",
      sender: "Test",
      subjectOrUrl: "Test",
      bodyPreview: "Test",
      type: "image",
      isPhishing: false,
      explanation: "Safe",
      redFlags: [],
      screenshotUrl: "https://example.com/screenshot.png",
    };
    expect(q.screenshotUrl).toBe("https://example.com/screenshot.png");
  });
});
