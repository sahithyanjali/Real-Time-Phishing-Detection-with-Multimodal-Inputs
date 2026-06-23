import { describe, it, expect } from "vitest";
import {
  THREAT_DEFINITIONS,
  getRiskColor,
  getStatusColorClass,
  buildTargetDescription,
  computeQuizAnswer,
} from "../utils";

describe("THREAT_DEFINITIONS", () => {
  it("contains all expected threat types", () => {
    const expectedKeys = [
      "brand impersonation",
      "brand cloning",
      "credential harvesting",
      "urgency",
      "social engineering",
      "lookalike",
      "phishing attachment",
      "malicious attachment",
    ];
    expectedKeys.forEach((key) => {
      expect(THREAT_DEFINITIONS).toHaveProperty(key);
    });
  });

  it("each definition has title, danger, and explanation", () => {
    Object.values(THREAT_DEFINITIONS).forEach((def) => {
      expect(def).toHaveProperty("title");
      expect(def).toHaveProperty("danger");
      expect(def).toHaveProperty("explanation");
      expect(def.title.length).toBeGreaterThan(0);
      expect(def.danger.length).toBeGreaterThan(0);
      expect(def.explanation.length).toBeGreaterThan(0);
    });
  });

  it("brand impersonation and brand cloning share the same definition", () => {
    expect(THREAT_DEFINITIONS["brand impersonation"].title).toBe(THREAT_DEFINITIONS["brand cloning"].title);
    expect(THREAT_DEFINITIONS["brand impersonation"].explanation).toBe(THREAT_DEFINITIONS["brand cloning"].explanation);
  });

  it("phishing attachment and malicious attachment share the same definition", () => {
    expect(THREAT_DEFINITIONS["phishing attachment"].title).toBe(THREAT_DEFINITIONS["malicious attachment"].title);
    expect(THREAT_DEFINITIONS["phishing attachment"].explanation).toBe(THREAT_DEFINITIONS["malicious attachment"].explanation);
  });
});

describe("getRiskColor", () => {
  it("returns red classes for high risk", () => {
    const result = getRiskColor("High");
    expect(result).toContain("text-red-500");
    expect(result).toContain("bg-red-500/10");
    expect(result).toContain("border-red-500/20");
  });

  it("returns red classes for case-insensitive 'HIGH'", () => {
    expect(getRiskColor("HIGH")).toContain("text-red-500");
  });

  it("returns amber classes for medium risk", () => {
    const result = getRiskColor("Medium");
    expect(result).toContain("text-amber-500");
    expect(result).toContain("bg-amber-500/10");
  });

  it("returns emerald (safe) classes for low risk", () => {
    const result = getRiskColor("Low");
    expect(result).toContain("text-emerald-500");
    expect(result).toContain("bg-emerald-500/10");
  });

  it("returns emerald classes for unknown risk values", () => {
    expect(getRiskColor("unknown")).toContain("text-emerald-500");
    expect(getRiskColor("")).toContain("text-emerald-500");
  });

  it("handles null/undefined gracefully", () => {
    expect(getRiskColor(null as any)).toContain("text-emerald-500");
    expect(getRiskColor(undefined as any)).toContain("text-emerald-500");
  });
});

describe("getStatusColorClass", () => {
  it("returns red classes for severe status", () => {
    const result = getStatusColorClass("severe");
    expect(result).toContain("bg-red-500/15");
    expect(result).toContain("text-red-400");
  });

  it("returns amber classes for warning status", () => {
    const result = getStatusColorClass("warning");
    expect(result).toContain("bg-amber-500/15");
    expect(result).toContain("text-amber-400");
  });

  it("returns emerald classes for safe status", () => {
    const result = getStatusColorClass("safe");
    expect(result).toContain("bg-emerald-500/15");
    expect(result).toContain("text-emerald-400");
  });

  it("returns emerald classes for unknown status", () => {
    expect(getStatusColorClass("other")).toContain("bg-emerald-500/15");
  });
});

describe("buildTargetDescription", () => {
  it("returns URL input for url scan type", () => {
    expect(buildTargetDescription("url", "https://example.com", "", null)).toBe("https://example.com");
  });

  it("returns default URL when urlInput is empty", () => {
    expect(buildTargetDescription("url", "", "", null)).toBe("http://verified-secure-channel-redirect.net");
  });

  it("truncates long email input to 65 chars with ellipsis", () => {
    const longEmail = "A".repeat(100);
    const result = buildTargetDescription("email", "", longEmail, null);
    expect(result).toBe("A".repeat(65) + "...");
  });

  it("does not add ellipsis for short email input", () => {
    const shortEmail = "Hello there";
    const result = buildTargetDescription("email", "", shortEmail, null);
    expect(result).toBe("Hello there");
  });

  it("returns default text when email input is empty", () => {
    expect(buildTargetDescription("email", "", "", null)).toBe("Raw Email Header Data");
  });

  it("returns image file name for image scan type", () => {
    expect(buildTargetDescription("image", "", "", "screenshot.png")).toBe("screenshot.png");
  });

  it("returns default text when image file name is null", () => {
    expect(buildTargetDescription("image", "", "", null)).toBe("Uploaded Screenshot visual feed");
  });

  it("returns combined description for combined scan type", () => {
    const result = buildTargetDescription("combined", "", "", null);
    expect(result).toBe("Combined context stream (URL + Email Content + Visual Screenshots)");
  });
});

describe("computeQuizAnswer", () => {
  it("returns correct answer when user correctly identifies phishing", () => {
    const result = computeQuizAnswer(true, true);
    expect(result).toEqual({ answered: true, userChoice: true, isCorrect: true });
  });

  it("returns incorrect answer when user misidentifies phishing as legitimate", () => {
    const result = computeQuizAnswer(false, true);
    expect(result).toEqual({ answered: true, userChoice: false, isCorrect: false });
  });

  it("returns correct answer when user correctly identifies legitimate", () => {
    const result = computeQuizAnswer(false, false);
    expect(result).toEqual({ answered: true, userChoice: false, isCorrect: true });
  });

  it("returns incorrect answer when user misidentifies legitimate as phishing", () => {
    const result = computeQuizAnswer(true, false);
    expect(result).toEqual({ answered: true, userChoice: true, isCorrect: false });
  });
});
