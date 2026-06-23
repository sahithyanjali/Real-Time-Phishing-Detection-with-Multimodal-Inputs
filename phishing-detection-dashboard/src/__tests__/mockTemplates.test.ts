import { describe, it, expect } from "vitest";
import { SCAN_PRESETS, QUIZ_QUESTIONS } from "../data/mockTemplates";
import type { ScanResult, QuizQuestion, ScanIndicator } from "../types";

describe("SCAN_PRESETS", () => {
  it("contains at least 4 presets", () => {
    expect(SCAN_PRESETS.length).toBeGreaterThanOrEqual(4);
  });

  it("each preset has required fields", () => {
    SCAN_PRESETS.forEach((preset) => {
      expect(preset.id).toBeTruthy();
      expect(preset.name).toBeTruthy();
      expect(["url", "email", "image", "combined"]).toContain(preset.type);
      expect(preset.label).toBeTruthy();
      expect(preset.payload).toBeDefined();
      expect(preset.mockOutput).toBeDefined();
    });
  });

  it("each preset has unique id", () => {
    const ids = SCAN_PRESETS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("email preset has emailText in payload", () => {
    const emailPresets = SCAN_PRESETS.filter((p) => p.type === "email");
    emailPresets.forEach((preset) => {
      expect(preset.payload.emailText).toBeTruthy();
      expect(preset.payload.emailText!.length).toBeGreaterThan(0);
    });
  });

  it("url presets have url in payload", () => {
    const urlPresets = SCAN_PRESETS.filter((p) => p.type === "url");
    urlPresets.forEach((preset) => {
      expect(preset.payload.url).toBeTruthy();
      expect(preset.payload.url!.startsWith("http")).toBe(true);
    });
  });

  it("image preset has imageData and fileName in payload", () => {
    const imagePresets = SCAN_PRESETS.filter((p) => p.type === "image");
    imagePresets.forEach((preset) => {
      expect(preset.payload.imageData).toBeTruthy();
      expect(preset.payload.fileName).toBeTruthy();
    });
  });

  describe("mockOutput ScanResult validation", () => {
    it("each mockOutput has valid prediction value", () => {
      SCAN_PRESETS.forEach((preset) => {
        expect(["Phishing", "Legitimate", "Suspicious"]).toContain(preset.mockOutput.prediction);
      });
    });

    it("each mockOutput has confidence between 0 and 1", () => {
      SCAN_PRESETS.forEach((preset) => {
        expect(preset.mockOutput.confidence).toBeGreaterThanOrEqual(0);
        expect(preset.mockOutput.confidence).toBeLessThanOrEqual(1);
      });
    });

    it("each mockOutput has valid riskLevel", () => {
      SCAN_PRESETS.forEach((preset) => {
        expect(["Low", "Medium", "High"]).toContain(preset.mockOutput.riskLevel);
      });
    });

    it("each mockOutput has at least one reason", () => {
      SCAN_PRESETS.forEach((preset) => {
        expect(preset.mockOutput.reasons.length).toBeGreaterThan(0);
      });
    });

    it("each mockOutput has non-empty action string", () => {
      SCAN_PRESETS.forEach((preset) => {
        expect(preset.mockOutput.action.length).toBeGreaterThan(0);
      });
    });

    it("each mockOutput has at least one threatType", () => {
      SCAN_PRESETS.forEach((preset) => {
        expect(preset.mockOutput.threatTypes.length).toBeGreaterThan(0);
      });
    });

    it("each mockOutput has indicators with valid status", () => {
      SCAN_PRESETS.forEach((preset) => {
        preset.mockOutput.indicators.forEach((indicator: ScanIndicator) => {
          expect(indicator.label).toBeTruthy();
          expect(["severe", "warning", "safe"]).toContain(indicator.status);
          expect(indicator.detail).toBeTruthy();
        });
      });
    });

    it("phishing presets have high confidence (>= 0.9)", () => {
      const phishingPresets = SCAN_PRESETS.filter((p) => p.mockOutput.prediction === "Phishing");
      phishingPresets.forEach((preset) => {
        expect(preset.mockOutput.confidence).toBeGreaterThanOrEqual(0.9);
      });
    });

    it("legitimate presets have high confidence (>= 0.9)", () => {
      const legitPresets = SCAN_PRESETS.filter((p) => p.mockOutput.prediction === "Legitimate");
      legitPresets.forEach((preset) => {
        expect(preset.mockOutput.confidence).toBeGreaterThanOrEqual(0.9);
      });
    });

    it("phishing presets have High riskLevel", () => {
      const phishingPresets = SCAN_PRESETS.filter((p) => p.mockOutput.prediction === "Phishing");
      phishingPresets.forEach((preset) => {
        expect(preset.mockOutput.riskLevel).toBe("High");
      });
    });

    it("legitimate presets have Low riskLevel", () => {
      const legitPresets = SCAN_PRESETS.filter((p) => p.mockOutput.prediction === "Legitimate");
      legitPresets.forEach((preset) => {
        expect(preset.mockOutput.riskLevel).toBe("Low");
      });
    });
  });

  describe("extractedDetails validation", () => {
    it("phishing presets have extractedDetails with suspicious keywords", () => {
      const phishingPresets = SCAN_PRESETS.filter((p) => p.mockOutput.prediction === "Phishing");
      phishingPresets.forEach((preset) => {
        expect(preset.mockOutput.extractedDetails).toBeDefined();
        expect(preset.mockOutput.extractedDetails!.suspiciousKeywords!.length).toBeGreaterThan(0);
      });
    });

    it("legitimate presets have empty suspicious keywords", () => {
      const legitPresets = SCAN_PRESETS.filter((p) => p.mockOutput.prediction === "Legitimate");
      legitPresets.forEach((preset) => {
        expect(preset.mockOutput.extractedDetails).toBeDefined();
        expect(preset.mockOutput.extractedDetails!.suspiciousKeywords).toEqual([]);
      });
    });
  });
});

describe("QUIZ_QUESTIONS", () => {
  it("contains at least 4 questions", () => {
    expect(QUIZ_QUESTIONS.length).toBeGreaterThanOrEqual(4);
  });

  it("each question has required fields", () => {
    QUIZ_QUESTIONS.forEach((q) => {
      expect(q.id).toBeTruthy();
      expect(q.sender).toBeTruthy();
      expect(q.subjectOrUrl).toBeTruthy();
      expect(q.bodyPreview).toBeTruthy();
      expect(["email", "url", "image"]).toContain(q.type);
      expect(typeof q.isPhishing).toBe("boolean");
      expect(q.explanation.length).toBeGreaterThan(0);
      expect(q.redFlags.length).toBeGreaterThan(0);
    });
  });

  it("each question has unique id", () => {
    const ids = QUIZ_QUESTIONS.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("contains a mix of phishing and legitimate questions", () => {
    const phishingCount = QUIZ_QUESTIONS.filter((q) => q.isPhishing).length;
    const legitCount = QUIZ_QUESTIONS.filter((q) => !q.isPhishing).length;
    expect(phishingCount).toBeGreaterThan(0);
    expect(legitCount).toBeGreaterThan(0);
  });

  it("phishing questions have explanations mentioning suspicious elements", () => {
    const phishingQs = QUIZ_QUESTIONS.filter((q) => q.isPhishing);
    phishingQs.forEach((q) => {
      expect(q.explanation.length).toBeGreaterThan(20);
    });
  });

  it("each question has at least 2 red flags", () => {
    QUIZ_QUESTIONS.forEach((q) => {
      expect(q.redFlags.length).toBeGreaterThanOrEqual(2);
    });
  });
});
