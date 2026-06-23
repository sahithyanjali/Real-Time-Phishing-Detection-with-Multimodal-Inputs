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

export function getPredictionBgClass(prediction: string): string {
  switch (prediction) {
    case "Phishing":
      return "bg-red-500/10";
    case "Suspicious":
      return "bg-amber-500/10";
    default:
      return "bg-emerald-500/10";
  }
}

export function getPredictionBadgeClass(prediction: string): string {
  switch (prediction) {
    case "Phishing":
      return "bg-red-500/15 text-red-400 border border-red-500/20";
    case "Suspicious":
      return "bg-amber-500/15 text-amber-400 border border-amber-500/20";
    default:
      return "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20";
  }
}

export function getPredictionStrokeColor(prediction: string): string {
  switch (prediction) {
    case "Phishing":
      return "#ef4444";
    case "Suspicious":
      return "#f59e0b";
    default:
      return "#10b981";
  }
}

export function getRiskBadgeClass(riskLevel: string): string {
  switch (riskLevel) {
    case "High":
      return "text-red-400 bg-red-500/10";
    case "Medium":
      return "text-amber-400 bg-amber-500/10";
    default:
      return "text-emerald-400 bg-emerald-500/10";
  }
}

export function getLogRiskClass(risk: string): string {
  switch (risk) {
    case "Critical":
      return "bg-red-500/15 text-red-400";
    case "High":
      return "bg-amber-500/15 text-amber-400";
    default:
      return "bg-yellow-500/15 text-yellow-500";
  }
}
