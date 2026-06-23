import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import ThreatTrendChart from "../components/ThreatTrendChart";
import type { HistoryItem, ScanResult } from "../types";

// Mock recharts to avoid canvas rendering issues in jsdom
vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  AreaChart: ({ children, data }: any) => <div data-testid="area-chart" data-length={data?.length}>{children}</div>,
  Area: ({ dataKey }: any) => <div data-testid={`area-${dataKey}`} />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
}));

function createMockHistoryItem(overrides: Partial<HistoryItem> = {}): HistoryItem {
  const defaultResult: ScanResult = {
    prediction: "Phishing",
    confidence: 0.98,
    riskLevel: "High",
    reasons: ["Test reason"],
    action: "Block",
    threatTypes: ["Brand Impersonation"],
    indicators: [{ label: "Test", status: "severe", detail: "Test detail" }],
  };

  return {
    id: `hist-${Date.now()}`,
    timestamp: new Date().toLocaleString(),
    type: "url",
    target: "https://example.com",
    result: defaultResult,
    ...overrides,
  };
}

describe("ThreatTrendChart", () => {
  it("renders without crashing with empty history", () => {
    const { container } = render(<ThreatTrendChart history={[]} />);
    expect(container.querySelector("#threat-trend-chart-component")).toBeTruthy();
  });

  it("displays the chart title", () => {
    render(<ThreatTrendChart history={[]} />);
    expect(screen.getByText("Vulnerability Trends over Time")).toBeTruthy();
  });

  it("displays Live Sync badge", () => {
    render(<ThreatTrendChart history={[]} />);
    expect(screen.getByText("Live Sync")).toBeTruthy();
  });

  it("renders KPI labels", () => {
    render(<ThreatTrendChart history={[]} />);
    expect(screen.getByText("Phishing Blocker")).toBeTruthy();
    expect(screen.getByText("Suspicious Flag")).toBeTruthy();
    expect(screen.getByText("Legitimate Safe")).toBeTruthy();
  });

  it("renders recharts components", () => {
    render(<ThreatTrendChart history={[]} />);
    expect(screen.getByTestId("responsive-container")).toBeTruthy();
    expect(screen.getByTestId("area-chart")).toBeTruthy();
    expect(screen.getByTestId("area-Phishing")).toBeTruthy();
    expect(screen.getByTestId("area-Suspicious")).toBeTruthy();
    expect(screen.getByTestId("area-Legitimate")).toBeTruthy();
  });

  it("chart has 7 days of data", () => {
    render(<ThreatTrendChart history={[]} />);
    const chart = screen.getByTestId("area-chart");
    expect(chart.getAttribute("data-length")).toBe("7");
  });

  it("renders with phishing history items", () => {
    const history = [
      createMockHistoryItem({ result: { ...createMockHistoryItem().result, prediction: "Phishing" } }),
    ];
    const { container } = render(<ThreatTrendChart history={history} />);
    expect(container.querySelector("#threat-trend-chart-component")).toBeTruthy();
  });

  it("renders with mixed prediction history", () => {
    const history = [
      createMockHistoryItem({ result: { ...createMockHistoryItem().result, prediction: "Phishing" } }),
      createMockHistoryItem({ result: { ...createMockHistoryItem().result, prediction: "Legitimate" } }),
      createMockHistoryItem({ result: { ...createMockHistoryItem().result, prediction: "Suspicious" } }),
    ];
    const { container } = render(<ThreatTrendChart history={history} />);
    expect(container.querySelector("#threat-trend-chart-component")).toBeTruthy();
  });

  it("handles invalid timestamps gracefully", () => {
    const history = [
      createMockHistoryItem({ timestamp: "invalid-date" }),
    ];
    const { container } = render(<ThreatTrendChart history={history} />);
    expect(container.querySelector("#threat-trend-chart-component")).toBeTruthy();
  });

  it("displays footer text about active scan rate", () => {
    render(<ThreatTrendChart history={[]} />);
    expect(screen.getByText(/Data updates immediately/)).toBeTruthy();
  });
});
