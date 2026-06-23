// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";
import { generateWithRetryAndFallback } from "../../server";

describe("generateWithRetryAndFallback", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns response on first model success", async () => {
    const mockAi = {
      models: {
        generateContent: vi.fn().mockResolvedValueOnce({ text: '{"prediction":"Phishing"}' }),
      },
    };

    const result = await generateWithRetryAndFallback(mockAi as any, { parts: [] }, {});
    expect(result.text).toBe('{"prediction":"Phishing"}');
    expect(mockAi.models.generateContent).toHaveBeenCalledTimes(1);
  });

  it("retries on transient 503 errors then succeeds", async () => {
    const mockAi = {
      models: {
        generateContent: vi
          .fn()
          .mockRejectedValueOnce(new Error("503 Service Unavailable"))
          .mockResolvedValueOnce({ text: '{"prediction":"Legitimate"}' }),
      },
    };

    const result = await generateWithRetryAndFallback(mockAi as any, { parts: [] }, {});
    expect(result.text).toBe('{"prediction":"Legitimate"}');
    expect(mockAi.models.generateContent).toHaveBeenCalledTimes(2);
  });

  it("cascades to next model after exhausting retries on first model", async () => {
    const mockAi = {
      models: {
        generateContent: vi
          .fn()
          // First model: all 3 attempts fail with transient error
          .mockRejectedValueOnce(new Error("503 Service Unavailable"))
          .mockRejectedValueOnce(new Error("503 Service Unavailable"))
          .mockRejectedValueOnce(new Error("503 Service Unavailable"))
          // Second model: succeeds
          .mockResolvedValueOnce({ text: '{"prediction":"Suspicious"}' }),
      },
    };

    const result = await generateWithRetryAndFallback(mockAi as any, { parts: [] }, {});
    expect(result.text).toBe('{"prediction":"Suspicious"}');
    // 3 retries on first model + 1 success on second = 4
    expect(mockAi.models.generateContent).toHaveBeenCalledTimes(4);
  });

  it("cascades immediately on non-transient errors", async () => {
    const mockAi = {
      models: {
        generateContent: vi
          .fn()
          .mockRejectedValueOnce(new Error("Invalid API key"))
          .mockResolvedValueOnce({ text: '{"prediction":"Legitimate"}' }),
      },
    };

    const result = await generateWithRetryAndFallback(mockAi as any, { parts: [] }, {});
    expect(result.text).toBe('{"prediction":"Legitimate"}');
    // Immediately cascades: 1 failure on model1 + 1 success on model2
    expect(mockAi.models.generateContent).toHaveBeenCalledTimes(2);
  });

  it("falls back to heuristic classifier when all models fail", async () => {
    const mockAi = {
      models: {
        generateContent: vi.fn().mockRejectedValue(new Error("All models broken")),
      },
    };

    const contents = { parts: [{ text: "Check this paypal login page" }] };
    const result = await generateWithRetryAndFallback(mockAi as any, contents, {});

    const parsed = JSON.parse(result.text);
    expect(parsed.prediction).toBe("Phishing");
    expect(parsed.confidence).toBe(0.88);
    expect(parsed.riskLevel).toBe("High");
    expect(parsed.reasons).toBeInstanceOf(Array);
    expect(parsed.reasons.length).toBeGreaterThan(0);
    expect(parsed.threatTypes).toContain("Brand Impersonation");
  });

  it("heuristic fallback classifies clean content as Legitimate", async () => {
    const mockAi = {
      models: {
        generateContent: vi.fn().mockRejectedValue(new Error("Total failure")),
      },
    };

    const contents = { parts: [{ text: "Hello world, this is a normal message." }] };
    const result = await generateWithRetryAndFallback(mockAi as any, contents, {});

    const parsed = JSON.parse(result.text);
    expect(parsed.prediction).toBe("Legitimate");
    expect(parsed.confidence).toBe(0.94);
    expect(parsed.riskLevel).toBe("Low");
    expect(parsed.threatTypes).toContain("None");
    expect(parsed.extractedDetails.suspiciousKeywords).toEqual([]);
  });

  it("heuristic detects phishing keywords in email text", async () => {
    const mockAi = {
      models: {
        generateContent: vi.fn().mockRejectedValue(new Error("unavailable")),
      },
    };

    const keywords = ["verify", "suspended", "password", "login", "invoice", ".xyz", ".top", ".cc"];
    for (const kw of keywords) {
      const contents = { parts: [{ text: `Please ${kw} your account now.` }] };
      const result = await generateWithRetryAndFallback(mockAi as any, contents, {});
      const parsed = JSON.parse(result.text);
      expect(parsed.prediction).toBe("Phishing");
    }
  });

  it("retries on 429 rate limit errors", async () => {
    const mockAi = {
      models: {
        generateContent: vi
          .fn()
          .mockRejectedValueOnce(new Error("429 RESOURCE_EXHAUSTED"))
          .mockResolvedValueOnce({ text: '{"ok":true}' }),
      },
    };

    const result = await generateWithRetryAndFallback(mockAi as any, { parts: [] }, {});
    expect(result.text).toBe('{"ok":true}');
  });

  it("throws empty response and retries", async () => {
    const mockAi = {
      models: {
        generateContent: vi
          .fn()
          .mockResolvedValueOnce({ text: null }) // empty response triggers error
          .mockResolvedValueOnce({ text: '{"ok":true}' }),
      },
    };

    const result = await generateWithRetryAndFallback(mockAi as any, { parts: [] }, {});
    expect(result.text).toBe('{"ok":true}');
  });
});
