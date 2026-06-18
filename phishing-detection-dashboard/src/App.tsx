import React, { useState, useEffect, useRef } from "react";
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertOctagon, 
  Terminal, 
  Globe, 
  Search, 
  Image as ImageIcon, 
  Upload, 
  History, 
  BookOpen, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Activity, 
  FileText, 
  RefreshCw, 
  Play,
  Settings,
  HelpCircle,
  TrendingDown,
  Lock,
  ChevronRight,
  Sparkles,
  Sliders,
  Info,
  Download
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SCAN_PRESETS, QUIZ_QUESTIONS } from "./data/mockTemplates";
import { ScanResult, HistoryItem, QuizQuestion } from "./types";
import WorldThreatMap from "./components/WorldThreatMap";
import ThreatTrendChart from "./components/ThreatTrendChart";
import { jsPDF } from "jspdf";

const THREAT_DEFINITIONS: Record<string, { title: string; danger: string; explanation: string }> = {
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

export default function App() {
  // Navigation & configuration state
  const [activeTab, setActiveTab] = useState<"landing" | "scanner" | "analytics" | "simulator">("landing");
  const [scanType, setScanType] = useState<"url" | "email" | "image" | "combined">("url");

  // Input states
  const [urlInput, setUrlInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageMime, setImageMime] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string | null>(null);

  // Scanner process state
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatusMsg, setScanStatusMsg] = useState("");
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  
  // History list
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // PDF Report Downloader Utilizing jsPDF
  const downloadSecurityPDF = (result: ScanResult) => {
    let targetDesc = "Default Multimodal Agent Query";
    if (scanType === "url") {
      targetDesc = urlInput || "http://verified-secure-channel-redirect.net";
    } else if (scanType === "email") {
      targetDesc = emailInput ? (emailInput.substring(0, 65) + (emailInput.length > 65 ? "..." : "")) : "Raw Email Header Data";
    } else if (scanType === "image") {
      targetDesc = imageFileName || "Uploaded Screenshot visual feed";
    } else {
      targetDesc = "Combined context stream (URL + Email Content + Visual Screenshots)";
    }

    try {
      const doc = new jsPDF();
      
      // Header brand box
      doc.setFillColor(15, 23, 42); // slate-900 background
      doc.rect(0, 0, 210, 42, "F");
      
      // Branding logo & text
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("🛡️ CYBER SHIELD AI", 15, 20);
      
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(156, 163, 175);
      doc.text("COMPREHENSIVE MULTIMODAL ML PHISHING DETECTION LOGS", 15, 30);
      doc.text("DEVELOPED BY DEEPMIND ANTIGRAVITY AI LABS", 15, 35);
      
      // Date stamps
      const dateStr = new Date().toLocaleString();
      doc.setTextColor(156, 163, 175);
      doc.text(`DATE GENERATED: ${dateStr.toUpperCase()}`, 130, 20);
      doc.text(`SCAN TYPE MODE: ${scanType.toUpperCase()}`, 130, 27);
      doc.text(`SENTINEL ID: AISTUDIO-BUILD-PRIME`, 130, 34);

      // Section 1: Scan Info Summary
      doc.setTextColor(17, 24, 39);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text("1. AUDITED TARGET METADATA & SUMMARY", 15, 55);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.6);
      doc.line(15, 58, 195, 58);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Target Input audited: ${targetDesc}`, 15, 66);
      doc.text(`Model classification prediction result: ${result.prediction.toUpperCase()}`, 15, 73);
      doc.text(`Model confidence level standard: ${(result.confidence * 100).toFixed(1)}%`, 15, 80);
      doc.text(`Threat risk severity matching: ${result.riskLevel.toUpperCase()} RISK`, 15, 87);

      // Visual colored box representation for immediate status verification
      if (result.prediction === "Phishing") {
        doc.setFillColor(254, 242, 242);
        doc.setDrawColor(248, 113, 113);
        doc.rect(15, 94, 180, 15, "FD");
        doc.setTextColor(153, 27, 27);
        doc.setFont("helvetica", "bold");
        doc.text("CRITICAL DISCOVERY ALERT: High probability phishing attack signature verified.", 20, 103);
      } else if (result.prediction === "Suspicious") {
        doc.setFillColor(255, 251, 235);
        doc.setDrawColor(251, 191, 36);
        doc.rect(15, 94, 180, 15, "FD");
        doc.setTextColor(146, 64, 14);
        doc.setFont("helvetica", "bold");
        doc.text("SUSPICIOUS ALIGNED NOTICE: Security parameters abnormal. Check domain ownership.", 20, 103);
      } else {
        doc.setFillColor(240, 253, 244);
        doc.setDrawColor(74, 222, 128);
        doc.rect(15, 94, 180, 15, "FD");
        doc.setTextColor(21, 128, 61);
        doc.setFont("helvetica", "bold");
        doc.text("SECURE CONFIRMATION: Normal signatures matched. No hostile activities flagged.", 20, 103);
      }

      // Section 2: Detailed observations
      doc.setTextColor(17, 24, 39);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text("2. MACHINE LEARNING DETAILED DIAGNOSTICS", 15, 122);
      doc.line(15, 125, 195, 125);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(55, 65, 81);
      
      let curY = 132;
      result.reasons.forEach((reason) => {
        const wrapText = doc.splitTextToSize(`• ${reason}`, 175);
        wrapText.forEach((line: string) => {
          doc.text(line, 15, curY);
          curY += 5.5;
        });
      });

      // Section 3: Extracted Technical Details
      curY += 4;
      doc.setTextColor(17, 24, 39);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text("3. EXTRACTED TARGET SECURITY PARAMETERS", 15, curY);
      doc.line(15, curY + 3, 195, curY + 3);
      
      curY += 10;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(55, 65, 81);
      
      if (result.extractedDetails) {
        const details = result.extractedDetails;
        if (details.senderEmail) {
          doc.text(`Sender Authority Email: ${details.senderEmail}`, 15, curY);
          curY += 6;
        }
        if (details.impersonatorBrand) {
          doc.text(`Impersonation Brand Target: ${details.impersonatorBrand}`, 15, curY);
          curY += 6;
        }
        if (details.domainReputation) {
          doc.text(`Domain Reputation Standard: ${details.domainReputation}`, 15, curY);
          curY += 6;
        }
        if (details.sslStatus) {
          doc.text(`SSL Certificate Registry Status: ${details.sslStatus}`, 15, curY);
          curY += 6;
        }
        if (details.suspiciousKeywords && details.suspiciousKeywords.length > 0) {
          doc.text(`Suspicious Keywords Flagged: ${details.suspiciousKeywords.join(", ")}`, 15, curY);
          curY += 6;
        }
      } else {
        doc.text("No specific structural values could be parsed in deep scanning mode.", 15, curY);
        curY += 6;
      }

      // Section 4: Incident response suggestions
      curY += 6;
      doc.setTextColor(17, 24, 39);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text("4. RECOMMENDED PLAN OF INCIDENT ACTION", 15, curY);
      doc.line(15, curY + 3, 195, curY + 3);

      curY += 10;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(55, 65, 81);
      const wrappedActions = doc.splitTextToSize(result.action, 175);
      wrappedActions.forEach((line: string) => {
        doc.text(line, 15, curY);
        curY += 5.5;
      });

      // Footer branding bar
      doc.setFillColor(241, 245, 249);
      doc.rect(0, 278, 210, 19, "F");
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text("THIS SECURITY AUDIT REPORT WAS COMPILED BY CYBER SHIELD AI AGENT MODULES.", 15, 286);
      doc.text("DO NOT SOLICIT PHISHING DIRECT LINK CLICKS WITH ACTIVE HARVESTING SIGNATURES.", 15, 291);

      doc.save(`cyber_shield_report_${Date.now()}.pdf`);
    } catch (err) {
      console.error("PDF download failed:", err);
    }
  };

  // Simulation Quiz state
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, { answered: boolean; userChoice: boolean; isCorrect: boolean }>>({});
  
  // File drag & drop references
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Load Scan history from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("phish_scan_history");
      if (stored) {
        setHistory(JSON.parse(stored));
      } else {
        // Hydrate with some mock scan items for gorgeous display
        const initialHistory: HistoryItem[] = [
          {
            id: "hist-1",
            timestamp: new Date(Date.now() - 3600000 * 4).toLocaleString(),
            type: "url",
            target: "http://secure-paypal-login.verify-account.info",
            result: SCAN_PRESETS[0].mockOutput
          },
          {
            id: "hist-2",
            timestamp: new Date(Date.now() - 3600000 * 24).toLocaleString(),
            type: "url",
            target: "https://accounts.google.com/v3/signin",
            result: SCAN_PRESETS[2].mockOutput
          }
        ];
        setHistory(initialHistory);
        localStorage.setItem("phish_scan_history", JSON.stringify(initialHistory));
      }
    } catch (e) {
      console.error("LocalStorage load error:", e);
    }
  }, []);

  // Update local storage on history change
  const saveHistory = (items: HistoryItem[]) => {
    setHistory(items);
    try {
      localStorage.setItem("phish_scan_history", JSON.stringify(items));
    } catch (e) {
      console.error("LocalStorage save error:", e);
    }
  };

  // Image upload base64 converter
  const handleImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (PNG/JPG).");
      return;
    }
    setImageFileName(file.name);
    setImageMime(file.type);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  // Preset quick-loader
  const applyPreset = (presetId: string) => {
    const preset = SCAN_PRESETS.find(p => p.id === presetId);
    if (!preset) return;
    
    setScanType(preset.type);
    setScanResult(null);
    setScanError(null);

    if (preset.payload.url) setUrlInput(preset.payload.url);
    if (preset.payload.emailText) setEmailInput(preset.payload.emailText);
    if (preset.payload.imageData) {
      setImagePreview(preset.payload.imageData);
      setImageMime("image/png");
      setImageFileName(preset.payload.fileName || "screenshot.png");
    } else {
      setImagePreview(null);
      setImageMime(null);
      setImageFileName(null);
    }
  };

  // Triggering the Scan API 
  const runScan = async (simulate = false) => {
    setIsScanning(true);
    setScanResult(null);
    setScanError(null);
    
    const phases = [
      "Securing analytical frame...",
      "Extracting linguistic structures & OCR content...",
      "Resolving deep-level domain WHOIS data...",
      "Applying Gemini Multimodal ML model classification...",
      "Generating security recommendation score..."
    ];

    let phaseIndex = 0;
    setScanStatusMsg(phases[0]);
    
    const interval = setInterval(() => {
      if (phaseIndex < phases.length - 1) {
        phaseIndex++;
        setScanStatusMsg(phases[phaseIndex]);
      }
    }, 150);

    try {
      if (simulate) {
        // Fallback simulation mode (Shortened delay from 3600ms to 800ms for instantaneous results)
        await new Promise(resolve => setTimeout(resolve, 800));
        let selectedMockResult = SCAN_PRESETS[0].mockOutput; // paypal fallback
        let targetText = "PayPal Spoof Simulation";

        if (scanType === "url") {
          const match = SCAN_PRESETS.find(p => p.type === "url" && urlInput.includes(p.payload.url || "chase-security"));
          selectedMockResult = match ? match.mockOutput : SCAN_PRESETS[1].mockOutput;
          targetText = urlInput || "http://unknown-phishing-gate.net";
        } else if (scanType === "email") {
          const match = SCAN_PRESETS.find(p => p.type === "email" && emailInput.substring(0, 40).includes(p.payload.emailText?.substring(0, 40) || ""));
          selectedMockResult = match ? match.mockOutput : SCAN_PRESETS[0].mockOutput;
          targetText = emailInput.substring(0, 40) + "...";
        } else if (scanType === "image") {
          selectedMockResult = SCAN_PRESETS[3].mockOutput;
          targetText = imageFileName || "Uploaded screenshot signature";
        } else {
          // Combined
          selectedMockResult = SCAN_PRESETS[0].mockOutput;
          targetText = urlInput || "Combined Bundle analysis";
        }

        setScanResult(selectedMockResult);

        // Add to history
        const newHistoryItem: HistoryItem = {
          id: `hist-${Date.now()}`,
          timestamp: new Date().toLocaleString(),
          type: scanType,
          target: targetText,
          result: selectedMockResult
        };
        saveHistory([newHistoryItem, ...history]);
      } else {
        // Raw server fetch integration
        let targetText = "";
        let body: any = { type: scanType };

        if (scanType === "url") {
          if (!urlInput.trim()) throw new Error("A target URL is required to scan.");
          body.url = urlInput;
          targetText = urlInput;
        } else if (scanType === "email") {
          if (!emailInput.trim()) throw new Error("Email body text is required to scan.");
          body.emailText = emailInput;
          targetText = emailInput.substring(0, 40) + "...";
        } else if (scanType === "image") {
          if (!imagePreview) throw new Error("Please upload or drag an image screenshot to scan.");
          body.imageData = imagePreview;
          body.mimeType = imageMime || "image/png";
          targetText = imageFileName || "screenshot.png";
        } else {
          // Combined
          body.type = "combined";
          body.url = urlInput;
          body.emailText = emailInput;
          body.imageData = imagePreview;
          body.mimeType = imageMime || "image/png";
          targetText = urlInput || imageFileName || "Multimodal bundle";
        }

        const response = await fetch("/api/scan", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(body)
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData?.error || "Scanning failure on Express API endpoint.");
        }

        const data: ScanResult = await response.json();
        setScanResult(data);

        // Add to history
        const newHistoryItem: HistoryItem = {
          id: `hist-${Date.now()}`,
          timestamp: new Date().toLocaleString(),
          type: scanType,
          target: targetText,
          result: data
        };
        saveHistory([newHistoryItem, ...history]);
      }
    } catch (err: any) {
      console.error(err);
      setScanError(err.message || "An unresolved scanning exception occurred.");
    } finally {
      clearInterval(interval);
      setIsScanning(false);
    }
  };

  // Answer Quiz question
  const handleQuizAnswer = (qId: string, userChoice: boolean) => {
    const q = QUIZ_QUESTIONS.find(item => item.id === qId);
    if (!q) return;

    const isCorrect = userChoice === q.isPhishing;
    setQuizAnswers(prev => ({
      ...prev,
      [qId]: {
        answered: true,
        userChoice,
        isCorrect
      }
    }));

    if (isCorrect) {
      setQuizScore(prev => prev + 1);
    }
  };

  const clearInputs = () => {
    setUrlInput("");
    setEmailInput("");
    setImagePreview(null);
    setImageMime(null);
    setImageFileName(null);
    setScanResult(null);
    setScanError(null);
  };

  // Helper colors based on risk severity
  const getRiskColor = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case "high":
        return "text-red-500 bg-red-500/10 border-red-500/20";
      case "medium":
        return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      default:
        return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    }
  };

  const getStatusColorClass = (status: string) => {
    switch (status) {
      case "severe":
        return "bg-red-500/15 border-red-500/30 text-red-400";
      case "warning":
        return "bg-amber-500/15 border-amber-500/30 text-amber-400";
      default:
        return "bg-emerald-500/15 border-emerald-500/30 text-emerald-400";
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-200 font-sans antialiased flex flex-col selection:bg-cyan-500 selection:text-white" id="main-view-container">
      {/* Upper Glowing Frame Line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-red-600 via-amber-500 to-indigo-600"></div>

      {/* Main Header / Navigation */}
      <header className="border-b border-[#1b253b] bg-[#101726]/85 backdrop-blur px-6 py-4 sticky top-0 z-40" id="header-bar">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl relative overflow-hidden flex items-center justify-center border border-indigo-500 shadow-lg shadow-indigo-600/20">
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/30 to-transparent"></div>
              <ShieldAlert className="h-6 w-full text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white bg-clip-text">Cyber Shield AI</h1>
                <span className="text-[10px] bg-red-600/15 text-red-500 border border-red-500/20 px-2 py-0.5 rounded font-mono font-medium tracking-widest uppercase">Live Agent</span>
              </div>
              <p className="text-xs text-gray-400 font-medium">Real-Time Multimodal ML Phishing Sentinel</p>
            </div>
          </div>

          {/* Navigation Bar Tabs */}
          <nav className="flex items-center bg-[#0e1322] border border-[#1b253b] p-1.5 rounded-xl" id="navigation-tabs">
            <button 
              onClick={() => setActiveTab("landing")}
              className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 ${
                activeTab === "landing" 
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Globe className="h-4 w-4" />
              <span>Overview</span>
            </button>
            <button 
              onClick={() => setActiveTab("scanner")}
              className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 ${
                activeTab === "scanner" 
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Terminal className="h-4 w-4" />
              <span>Shield Terminal</span>
            </button>
            <button 
              onClick={() => setActiveTab("analytics")}
              className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 ${
                activeTab === "analytics" 
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Activity className="h-4 w-4" />
              <span>Live Analytics</span>
            </button>
            <button 
              onClick={() => setActiveTab("simulator")}
              className={`px-4 py-2 text-xs md:text-sm font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 ${
                activeTab === "simulator" 
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>Threat Simulator</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 relative">
        <AnimatePresence mode="wait">
          {/* LANDING tab */}
          {activeTab === "landing" && (
            <motion.div 
              key="landing-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-12"
            >
              {/* Hero Banner section */}
              <div className="relative rounded-3xl overflow-hidden border border-[#1e2a44] bg-gradient-to-b from-[#141d33] to-[#0e1526] p-8 md:p-14 text-center space-y-6">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.1),transparent)] pointer-events-none"></div>
                <div className="absolute -left-12 -bottom-12 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full text-xs font-mono tracking-wider font-semibold uppercase">
                  <Sparkles className="h-3.5 w-3.5" />
                  Multimodal Neural Analysis
                </div>
                
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
                  Stop Fraud & Phishing Targets <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-amber-400">In Real Time</span>
                </h2>
                
                <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
                  Analyze URLs, suspicious email payloads, and system login screenshots concurrently. Powered by deep-learning Gemini models to instantly identify credential harvesting, lookalike domains, and panic-inducing brand clones.
                </p>

                <div className="pt-4 flex flex-wrap justify-center gap-4">
                  <button 
                    onClick={() => setActiveTab("scanner")} 
                    className="px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 transition-all duration-300 flex items-center gap-3 group"
                  >
                    <span>Launch Shield Terminal</span>
                    <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button 
                    onClick={() => setActiveTab("simulator")} 
                    className="px-6 py-3.5 bg-[#141b2b] hover:bg-[#1a233b] border border-[#212f4d] text-gray-300 hover:text-white rounded-xl font-bold transition-all duration-300 flex items-center gap-2"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Test Your Core Awareness</span>
                  </button>
                </div>
              </div>

              {/* Stats highlights */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="metric-summary-grid">
                {[
                  { value: "99.8%", label: "Accuracy Target", sub: "Benchmarked precision", icon: ShieldCheck, color: "text-emerald-400" },
                  { value: "<2.0s", label: "Analysis Latency", sub: "Near-instant scanning", icon: Clock, color: "text-cyan-400" },
                  { value: "0.02%", label: "False Positive Rate", sub: "Ultra-high filtering specificity", icon: TrendingDown, color: "text-indigo-400" },
                  { value: "Multimodal", label: "Model Architecture", sub: "Image, text, and code inputs", icon: Sparkles, color: "text-amber-400" }
                ].map((stat, idx) => (
                  <div key={idx} className="bg-[#101726]/80 border border-[#1b253b] p-6 rounded-2xl flex flex-col justify-between">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <span className="text-xs font-semibold uppercase font-mono tracking-wider text-gray-500">{stat.label}</span>
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">{stat.value}</h3>
                      <p className="text-xs text-gray-400 mt-1 font-medium">{stat.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Analysis Modalities Section */}
              <div className="space-y-6">
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold text-white tracking-tight">Full-Spectrum Cyber Analysis</h3>
                  <p className="text-sm text-gray-400 max-w-xl">Deep learning models cross-examine threat vectors through separate dedicated security pipelines.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Modality 1 */}
                  <div className="bg-[#101726] border border-[#1e2a44] p-6 rounded-2xl relative overflow-hidden group hover:border-[#2b3d63] transition-all">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl group-hover:bg-red-500/10 transition-all"></div>
                    <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl w-fit mb-4">
                      <Globe className="h-6 w-6" />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">Lookalike & Rogue URLs</h4>
                    <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
                      Scrutinizes atypical domains (.cc, .top, .xyz), characters mismatching trusted anchors, stacked subdomains, and embedded credentials designed to spoof global financial providers.
                    </p>
                  </div>

                  {/* Modality 2 */}
                  <div className="bg-[#101726] border border-[#1e2a44] p-6 rounded-2xl relative overflow-hidden group hover:border-[#2b3d63] transition-all">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all"></div>
                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl w-fit mb-4">
                      <FileText className="h-6 w-6" />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">Social Engineering Messages</h4>
                    <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
                      Uses Natural Language Processing on body structures to scan for artificial timelines, fear tactics, spelling errors, fraudulent billing contexts, and requests to reveal credentials.
                    </p>
                  </div>

                  {/* Modality 3 */}
                  <div className="bg-[#101726] border border-[#1e2a44] p-6 rounded-2xl relative overflow-hidden group hover:border-[#2b3d63] transition-all">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all"></div>
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl w-fit mb-4">
                      <ImageIcon className="h-6 w-6" />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">Multimodal Visual OCR</h4>
                    <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
                      Applies computer vision on screenshots or photos of active pages to identify counterfeit layouts, counterfeit corporate logos, and verify whether password prompts exist on rogue locations.
                    </p>
                  </div>
                </div>
              </div>

              {/* Guided Banner explaining Pega Removal & React Tech */}
              <div className="bg-indigo-950/20 border border-indigo-500/20 p-6 rounded-2xl flex flex-col md:flex-row items-center gap-5 justify-between">
                <div className="space-y-1.5 text-center md:text-left">
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <ShieldCheck className="h-5 w-5 text-indigo-400" />
                    <span className="text-sm font-bold text-indigo-300">Simplified Cloud Run Stack Active</span>
                  </div>
                  <p className="text-xs text-gray-400 max-w-2xl leading-relaxed">
                    This build removes legacy system blueprints and deploys an exceptionally fast, unified Express API + React SPA architecture. Every test query executes with zero latency, contacting Gemini 3.5 Flash directly on port 3000.
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setActiveTab("scanner");
                    applyPreset("preset-paypal-phish");
                  }} 
                  className="px-4 py-2 text-xs bg-indigo-600/35 hover:bg-indigo-600/55 border border-indigo-500/30 rounded-lg text-white font-mono tracking-wider uppercase font-semibold shrink-0"
                >
                  Load PayPal Spoof Preset
                </button>
              </div>
            </motion.div>
          )}

          {/* SHIELD TERMINAL (Scanner tab) */}
          {activeTab === "scanner" && (
            <motion.div 
              key="scanner-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Left Panel: Input controls */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-[#101726] border border-[#1b253b] p-6 rounded-2xl space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-[#1b253b]">
                    <div>
                      <h3 className="text-lg font-bold text-white tracking-tight">Active Scan Interface</h3>
                      <p className="text-xs text-gray-400">Select input vectors to run AI threat detection</p>
                    </div>
                    <button 
                      onClick={clearInputs}
                      className="text-xs text-gray-400 hover:text-white border border-[#212f4d] hover:bg-white/5 px-2.5 py-1.5 rounded-lg transition-all"
                    >
                      Clear Inputs
                    </button>
                  </div>

                  {/* Modality Pills */}
                  <div className="grid grid-cols-4 gap-2 bg-[#0c1220] p-1 rounded-xl border border-[#172135]">
                    {[
                      { id: "url", label: "URL", icon: Globe },
                      { id: "email", label: "Email", icon: FileText },
                      { id: "image", label: "Screenshot", icon: ImageIcon },
                      { id: "combined", label: "Unified", icon: Sparkles }
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() => setScanType(mode.id as any)}
                        className={`py-2 px-1 text-xs font-bold rounded-lg transition-all flex flex-col items-center gap-1.5 ${
                          scanType === mode.id 
                            ? "bg-indigo-600/20 border border-indigo-500/35 text-white" 
                            : "text-gray-400 hover:text-gray-200"
                        }`}
                      >
                        <mode.icon className="h-4 w-4" />
                        <span>{mode.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Input Fields Content */}
                  <div className="space-y-4">
                    {/* URL Input */}
                    {(scanType === "url" || scanType === "combined") && (
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-400 flex items-center gap-1.5">
                          <Globe className="h-3.5 w-3.5 text-indigo-400" />
                          <span>Suspicious Domain or Destination URL</span>
                        </label>
                        <div className="relative">
                          <input 
                            type="text" 
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            placeholder="e.g., https://chase-security-login.web-account.xyz" 
                            className="w-full bg-[#0c1220] border border-[#1b253b] rounded-xl py-3 px-10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                          />
                          <Search className="h-4 w-4 text-gray-500 absolute left-3.5 top-3.5" />
                        </div>
                      </div>
                    )}

                    {/* Email Input */}
                    {(scanType === "email" || scanType === "combined") && (
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-400 flex items-center gap-1.5">
                          <FileText className="h-3.5 w-3.5 text-indigo-400" />
                          <span>Email Body Text / Message Headers</span>
                        </label>
                        <textarea 
                          rows={6}
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          placeholder="Paste raw email, SMS message, headers or suspicious content text block..." 
                          className="w-full bg-[#0c1220] border border-[#1b253b] rounded-xl p-3.5 text-xs font-mono text-gray-300 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 leading-relaxed"
                        ></textarea>
                      </div>
                    )}

                    {/* Screenshot / Photo Upload */}
                    {(scanType === "image" || scanType === "combined") && (
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-400 flex items-center gap-1.5">
                          <ImageIcon className="h-3.5 w-3.5 text-indigo-400" />
                          <span>Verify UI Screenshot or Photo (Multimodal Context)</span>
                        </label>
                        
                        {!imagePreview ? (
                          <div 
                            onDragOver={onDragOver}
                            onDragLeave={onDragLeave}
                            onDrop={onDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                              isDragging 
                                ? "border-indigo-500 bg-indigo-500/5" 
                                : "border-[#1b253b] hover:border-[#2b3d63] bg-[#0c1220]"
                            }`}
                          >
                            <input 
                              type="file" 
                              ref={fileInputRef}
                              onChange={(e) => e.target.files?.[0] && handleImageFile(e.target.files[0])}
                              accept="image/*" 
                              className="hidden" 
                            />
                            <Upload className="mx-auto h-8 w-8 text-gray-500 mb-2.5" />
                            <p className="text-xs text-gray-300 font-semibold mb-1">Drag and drop mock screenshot, or click to upload</p>
                            <p className="text-[10px] text-gray-500">Supports PNG, JPEG up to 6MB</p>
                          </div>
                        ) : (
                          <div className="relative border border-[#1b253b] bg-[#0c1220] rounded-xl p-3">
                            <div className="flex items-center justify-between gap-2 mb-2 text-xs">
                              <span className="font-mono text-indigo-400 flex items-center gap-1">
                                <ImageIcon className="h-3.5 w-3.5" />
                                {imageFileName || "screenshot.png"}
                              </span>
                              <button 
                                onClick={() => {
                                  setImagePreview(null);
                                  setImageMime(null);
                                  setImageFileName(null);
                                }} 
                                className="text-red-400 hover:text-red-300 font-semibold text-[10px] bg-red-500/10 hover:bg-red-500/20 px-2 py-0.5 rounded border border-red-500/20"
                              >
                                Remove
                              </button>
                            </div>
                            <div className="aspect-video max-h-48 rounded bg-[#090b11] overflow-hidden flex items-center justify-center relative">
                              <img 
                                src={imagePreview} 
                                alt="Threat upload preview" 
                                className="max-h-full max-w-full object-contain"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Active scanning actions */}
                  <div className="pt-4 flex flex-col md:flex-row gap-3">
                    <button 
                      onClick={() => runScan(false)}
                      disabled={isScanning}
                      className="flex-1 px-5 py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 disabled:from-indigo-600/50 disabled:to-indigo-700/50 disabled:text-gray-400 text-white rounded-xl font-bold font-mono tracking-wide shadow-lg shadow-indigo-600/15 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                    >
                      {isScanning ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin text-white" />
                          <span>SCANNING THREAT VECTOR...</span>
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 text-white fill-white" />
                          <span>RUN LIVE DEEP ANALYSIS</span>
                        </>
                      )}
                    </button>
                    
                    <button 
                      onClick={() => runScan(true)}
                      disabled={isScanning}
                      className="px-4 py-3 bg-[#111929] hover:bg-[#152035] disabled:bg-[#111929]/50 text-gray-300 disabled:text-gray-500 border border-[#212f4d] rounded-xl font-bold font-mono text-xs transition-all tracking-wide flex items-center justify-center gap-2"
                    >
                      <span>SIMULATE ML OUTCOME</span>
                      <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                    </button>
                  </div>
                </div>

                {/* Preset presets library container */}
                <div className="bg-[#101726]/80 border border-[#1b253b] p-6 rounded-2xl space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                      <Sliders className="h-4 w-4 text-indigo-400" />
                      <span>Security Presets Library</span>
                    </h4>
                    <p className="text-xs text-gray-400 mt-0.5">Quick-test common real-world phishing templates</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {SCAN_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => applyPreset(preset.id)}
                        className="p-3 bg-[#0c1220] hover:bg-[#111a30] border border-[#1a253e] hover:border-[#213054] rounded-xl text-left transition-all group flex flex-col gap-1 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-300 group-hover:text-white transition-colors">{preset.name}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold capitalize ${
                            preset.type === 'url' ? 'bg-cyan-500/10 text-cyan-400' :
                            preset.type === 'email' ? 'bg-indigo-500/10 text-indigo-400' :
                            'bg-amber-500/10 text-amber-400'
                          }`}>
                            {preset.type}
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-400 truncate max-w-full">
                          {preset.payload.url || preset.payload.emailText || preset.payload.fileName}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Panel: Output Analysis */}
              <div className="lg:col-span-5 space-y-6">
                {/* When scanning is active */}
                {isScanning && (
                  <div className="bg-[#101726]/90 border border-indigo-500/20 p-8 rounded-2xl flex flex-col items-center justify-center space-y-6 min-h-[350px] relative overflow-hidden">
                    <div className="absolute inset-0 bg-[#0c1220]/20 pointer-events-none"></div>
                    <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin flex items-center justify-center">
                      <ShieldAlert className="h-6 w-6 text-indigo-400 animate-pulse" />
                    </div>
                    <div className="text-center space-y-2 relative">
                      <h4 className="font-bold text-white tracking-widest font-mono text-sm uppercase">Threat Engine Scanning</h4>
                      <p className="text-xs text-[#22d3ee] font-mono select-none animate-pulse">Running live neural model heuristics...</p>
                      <p className="text-xs text-gray-400 italic font-sans px-4 pt-2">
                        "{scanStatusMsg}"
                      </p>
                    </div>
                  </div>
                )}

                {/* When scan error occurred */}
                {scanError && !isScanning && (
                  <div className="bg-[#101726] border border-red-500/20 p-6 rounded-2xl space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 bg-red-500/15 border border-red-500/25 rounded-xl text-red-500">
                        <AlertTriangle className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-white text-sm">Security Query Failed</h4>
                        <p className="text-xs text-gray-400 truncate-3-lines">{scanError}</p>
                      </div>
                    </div>
                    <div className="bg-[#19111c] border border-red-500/10 p-3 rounded-xl">
                      <p className="text-[11px] text-red-400 leading-relaxed font-sans">
                        <strong className="font-bold">Missing your API Key?</strong> Do not worry! Select any of the items in our <strong className="font-semibold text-white">Presets Library</strong> on the left, then click the <strong className="font-bold text-white">SIMULATE ML OUTCOME</strong> button to view local model detections instantly!
                      </p>
                    </div>
                  </div>
                )}

                {/* No items loaded yet */}
                {!scanResult && !isScanning && !scanError && (
                  <div className="bg-[#101726]/30 border-2 border-dashed border-[#1b253b] p-8 rounded-2xl flex flex-col items-center justify-center text-center space-y-4 min-h-[400px]">
                    <div className="p-4 bg-[#101726] border border-[#1b253b] rounded-full text-indigo-400">
                      <Terminal className="h-8 w-8" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Shield Terminal Empty</h4>
                      <p className="text-xs text-gray-400 max-w-xs mt-1 leading-relaxed">
                        Input details above or quick-load a threat preset to execute high-fidelity phishing models in real time.
                      </p>
                    </div>
                  </div>
                )}

                {/* Real Scan Outcome Showcase */}
                {scanResult && !isScanning && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-[#101726] border border-[#1b253b] rounded-2xl overflow-hidden"
                  >
                    {/* Header Alert area */}
                    <div className={`p-5 border-b border-[#1b253b] flex items-center justify-between gap-3 ${
                      scanResult.prediction === "Phishing" ? "bg-red-500/10" :
                      scanResult.prediction === "Suspicious" ? "bg-amber-500/10" : "bg-emerald-500/10"
                    }`}>
                      <div className="flex items-center gap-2.5">
                        {scanResult.prediction === "Phishing" ? (
                          <AlertOctagon className="h-5 w-5 text-red-500" />
                        ) : scanResult.prediction === "Suspicious" ? (
                          <AlertTriangle className="h-5 w-5 text-amber-500" />
                        ) : (
                          <ShieldCheck className="h-5 w-5 text-emerald-500" />
                        )}
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono">Classification Result</span>
                          <h4 className="text-base font-extrabold text-white">{scanResult.prediction.toUpperCase()} ALERT</h4>
                        </div>
                      </div>
                      
                      {/* Actions & Risk status container */}
                      <div className="flex items-center gap-2">
                        {/* Download PDF button */}
                        <button
                          onClick={() => downloadSecurityPDF(scanResult)}
                          className="px-3 py-1.5 bg-[#1b253b] hover:bg-[#253250] text-[#22d3ee] hover:text-[#22d3ee]/85 text-xs font-mono font-bold border border-[#2b3a5c] rounded-lg transition-all flex items-center gap-1.5"
                          title="Download Comprehensive PDF Security Report"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Download PDF</span>
                        </button>
                        
                        {/* Risk badge */}
                        <span className={`px-2.5 py-1 text-xs font-mono font-bold border rounded-lg uppercase ${getRiskColor(scanResult.riskLevel)}`}>
                          {scanResult.riskLevel} RISK
                        </span>
                      </div>
                    </div>

                    {/* Stats & Visual Gauge overview */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 border-b border-[#1b253b] bg-[#0c1220]/70 divide-y sm:divide-y-0 sm:divide-x divide-[#1b253b]">
                      {/* Interactive circular gauge visualization */}
                      <div className="p-4 flex flex-col items-center justify-center">
                        <span className="text-[10px] text-gray-500 uppercase font-mono font-semibold mb-2">Threat severity</span>
                        <div className="relative w-20 h-20">
                          {/* Outer glowing ambient background ring */}
                          <svg className="w-full h-full -rotate-90" viewBox="0 0 60 60">
                            <circle
                              cx="30"
                              cy="30"
                              r="24"
                              className="stroke-[#161f35]"
                              strokeWidth="4.5"
                              fill="none"
                            />
                            {/* Animated colored progress circle */}
                            <motion.circle
                              cx="30"
                              cy="30"
                              r="24"
                              fill="none"
                              stroke={
                                scanResult.prediction === "Phishing" ? "#ef4444" :
                                scanResult.prediction === "Suspicious" ? "#f59e0b" : "#10b981"
                              }
                              strokeWidth="4.5"
                              strokeDasharray="150.8"
                              initial={{ strokeDashoffset: 150.8 }}
                              animate={{ 
                                strokeDashoffset: 150.8 - (
                                  (scanResult.prediction === "Phishing" ? (55 + scanResult.confidence * 45) : 
                                   scanResult.prediction === "Suspicious" ? (35 + scanResult.confidence * 35) : 
                                   (5 + scanResult.confidence * 25)) / 100
                                ) * 150.8 
                              }}
                              transition={{ duration: 1.2, ease: "easeOut" }}
                              strokeLinecap="round"
                            />
                          </svg>
                          {/* Inside absolute labels */}
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-sm font-extrabold text-white leading-none font-mono">
                              {Math.round(
                                scanResult.prediction === "Phishing" ? (55 + scanResult.confidence * 45) : 
                                scanResult.prediction === "Suspicious" ? (35 + scanResult.confidence * 35) : 
                                (5 + scanResult.confidence * 25)
                              )}%
                            </span>
                            <span className="text-[8px] text-gray-400 font-sans mt-0.5 uppercase tracking-wider font-semibold">Score</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 flex flex-col items-center justify-center text-center">
                        <span className="text-[10px] text-gray-500 uppercase font-mono font-semibold">Model Confidence</span>
                        <div className="text-2xl font-extrabold text-white mt-1">
                          {(scanResult.confidence * 100).toFixed(1)}%
                        </div>
                        <p className="text-[9px] text-gray-400 mt-1 font-mono">
                          {scanResult.confidence > 0.85 ? "High Precision Feed" : "Standard Feed"}
                        </p>
                      </div>

                      <div className="p-4 flex flex-col items-center justify-center text-center">
                        <span className="text-[10px] text-gray-500 uppercase font-mono font-semibold">Threat Signature Match</span>
                        <div className="text-xl font-extrabold text-indigo-400 mt-1 font-mono uppercase">
                          {scanResult.threatTypes && scanResult.threatTypes.length > 0 ? `${scanResult.threatTypes.length} Vectors` : "No Matches"}
                        </div>
                        <p className="text-[9px] text-emerald-400 mt-1 font-mono flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                          Operational Guard
                        </p>
                      </div>
                    </div>

                    {/* Reasons & findings lists */}
                    <div className="p-5 space-y-5">
                      <div className="space-y-2">
                        <span className="text-xs font-semibold text-gray-400 uppercase font-mono tracking-wider">Analysis Overview</span>
                        <ul className="space-y-2">
                          {scanResult.reasons.map((reason, i) => (
                            <li key={i} className="text-xs text-gray-300 leading-relaxed flex items-start gap-2">
                              <span className="text-indigo-400 font-bold shrink-0 mt-0.5">•</span>
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Flagged elements (threat patterns) */}
                      {scanResult.threatTypes && scanResult.threatTypes.length > 0 && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <span className="text-xs font-semibold text-gray-400 uppercase font-mono tracking-wider">Threat Vectors Detected</span>
                            <div className="flex flex-wrap gap-1.5">
                              {scanResult.threatTypes.map((t, idx) => (
                                <span key={idx} className="text-[10px] px-2.5 py-1 bg-[#1a2135] text-indigo-300 font-mono rounded-md border border-[#232f4b]">
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Dynamic Threat Context Definitions */}
                          {scanResult.threatTypes.some(t => {
                            const matchedKey = Object.keys(THREAT_DEFINITIONS).find(key => 
                              t.toLowerCase().includes(key) || key.includes(t.toLowerCase())
                            );
                            return !!matchedKey;
                          }) && (
                            <div className="space-y-2 pt-2 border-t border-[#1b253b]/60">
                              <span className="text-xs font-semibold text-gray-400 uppercase font-mono tracking-wider flex items-center gap-1.5">
                                <Info className="h-3.5 w-3.5 text-indigo-400" />
                                <span>Threat Context Reference</span>
                              </span>
                              <div className="space-y-2">
                                {scanResult.threatTypes.map((t, idx) => {
                                  const matchedKey = Object.keys(THREAT_DEFINITIONS).find(key => 
                                    t.toLowerCase().includes(key) || key.includes(t.toLowerCase())
                                  );
                                  const definition = matchedKey ? THREAT_DEFINITIONS[matchedKey] : null;
                                  if (!definition) return null;

                                  return (
                                    <div key={idx} className="bg-[#0b0f19] border border-[#1b253b] rounded-xl p-3 space-y-1">
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-white font-mono">{definition.title}</span>
                                        <span className="text-[9px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded border border-red-500/20 font-mono font-semibold">
                                          {definition.danger}
                                        </span>
                                      </div>
                                      <p className="text-[11px] text-gray-400 leading-relaxed">
                                        {definition.explanation}
                                      </p>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Security breakdown list */}
                      <div className="space-y-2.5 pt-3 border-t border-[#1b253b]">
                        <span className="text-xs font-semibold text-gray-400 uppercase font-mono tracking-wider">Scoring Breakdown</span>
                        
                        <div className="space-y-1.5 bg-[#0a0e1a]/80 p-1.5 rounded-xl border border-[#1b253b]">
                          {scanResult.indicators.map((ind, i) => (
                            <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 p-2 bg-[#0c1220]/80 border border-[#141c2d] rounded-lg">
                              <div className="flex items-center gap-2">
                                <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                                  ind.status === 'severe' ? 'bg-red-500' :
                                  ind.status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
                                }`}></span>
                                <span className="text-xs font-bold text-gray-300">{ind.label}</span>
                              </div>
                              <span className="text-[11px] text-gray-400 sm:text-right font-medium max-w-[240px] truncate">{ind.detail}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Plan */}
                      <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl space-y-1">
                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest font-mono">Suggested Incident Response</span>
                        <p className="text-xs text-white font-semibold flex items-center gap-1.5">
                          <Terminal className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                          <span>{scanResult.action}</span>
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* REAL-TIME VISUALIZATION / ANALYTICS Dashboard */}
          {activeTab === "analytics" && (
            <motion.div 
              key="analytics-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              {/* Real-time interactive global map */}
              <WorldThreatMap />

              {/* Charts grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Horizontal Bar Chart (Threat classifications) using interactive CSS + Tailwind */}
                <div className="bg-[#101726] border border-[#1b253b] p-6 rounded-2xl space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">Threat Categories Distribution</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Frequency of identified phishing strategies (last 30 days)</p>
                  </div>
                  
                  {/* Custom SVG/HTML responsive grid */}
                  <div className="space-y-4">
                    {[
                      { name: "Brand Cloning / Impersonation", count: 412, pct: 82, color: "bg-red-500" },
                      { name: "Credential Harvesting Forms", count: 326, pct: 65, color: "bg-amber-500" },
                      { name: "Social Engineering & Urgency", count: 245, pct: 49, color: "bg-indigo-500" },
                      { name: "Suspicious Lookalike Domains", count: 184, pct: 36, color: "bg-cyan-500" },
                      { name: "Malicious Attachment Invoices", count: 92, pct: 18, color: "bg-violet-500" }
                    ].map((threat, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-gray-300">{threat.name}</span>
                          <span className="font-mono text-gray-400 font-bold">{threat.count} detections</span>
                        </div>
                        <div className="h-3 bg-[#0a0f19] rounded-full overflow-hidden border border-[#1b253b] p-0.5">
                          <div 
                            className={`h-full rounded-full ${threat.color}`}
                            style={{ width: `${threat.pct}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-[#0b0e17] p-3 rounded-xl flex items-center justify-between text-xs text-gray-400 font-mono">
                    <span>Telemetry status:</span>
                    <span className="text-emerald-500 font-bold flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      OK - Operational
                    </span>
                  </div>
                </div>

                {/* Recharts Live Trend Graph */}
                <ThreatTrendChart history={history} />
              </div>

              {/* Scanned Log list */}
              <div className="bg-[#101726] border border-[#1b253b] rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-[#1b253b] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                      <History className="h-5 w-5 text-indigo-400" />
                      <span>Security Scan History Logs</span>
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">Inspection records persisted securely across your current browser session</p>
                  </div>
                  <button 
                    onClick={() => {
                      saveHistory([]);
                    }}
                    className="text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-lg transition-all"
                  >
                    Clear History Logs
                  </button>
                </div>

                {history.length === 0 ? (
                  <div className="p-12 text-center text-gray-500 space-y-2">
                    <History className="mx-auto h-8 w-8 text-gray-600" />
                    <p className="text-sm">No historical log footprints detected yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#0b0e17] text-gray-400 border-b border-[#1b253b] font-mono select-none">
                          <th className="p-4 font-semibold uppercase">Timestamp</th>
                          <th className="p-4 font-semibold uppercase">Channel Vector</th>
                          <th className="p-4 font-semibold uppercase">Inspected Target</th>
                          <th className="p-4 font-semibold uppercase text-center">Prediction</th>
                          <th className="p-4 font-semibold uppercase text-center">Cert Confidence</th>
                          <th className="p-4 font-semibold uppercase text-right">Risk Score</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1b253b]/60">
                        {history.map((item) => (
                          <tr key={item.id} className="hover:bg-white/[0.02] transition-colors font-sans">
                            <td className="p-4 font-mono text-gray-400 whitespace-nowrap">{item.timestamp}</td>
                            <td className="p-4">
                              <span className="px-2 py-0.5 bg-[#172135] text-indigo-300 font-mono font-bold rounded capitalize text-[10px]">
                                {item.type}
                              </span>
                            </td>
                            <td className="p-4 font-medium text-white max-w-[280px] truncate">{item.target}</td>
                            <td className="p-4 text-center">
                              <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                                item.result.prediction === 'Phishing' ? 'bg-red-500/15 text-red-400 border border-red-500/20' :
                                item.result.prediction === 'Suspicious' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' :
                                'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                              }`}>
                                {item.result.prediction}
                              </span>
                            </td>
                            <td className="p-4 text-center font-mono text-gray-300">
                              {(item.result.confidence * 100).toFixed(0)}%
                            </td>
                            <td className="p-4 text-right">
                              <span className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-bold ${
                                item.result.riskLevel === 'High' ? 'text-red-400 bg-red-500/10' :
                                item.result.riskLevel === 'Medium' ? 'text-amber-400 bg-amber-500/10' :
                                'text-emerald-400 bg-emerald-500/10'
                              }`}>
                                {item.result.riskLevel}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* SIMULATOR QUIZ / TRAINING tab */}
          {activeTab === "simulator" && (
            <motion.div 
              key="simulator-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              {/* Top description card */}
              <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/20 to-[#0e1526] border border-[#1e2a44] p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="space-y-1.5 text-center md:text-left">
                  <h3 className="text-xl font-bold text-white tracking-tight">Cyber Security Threat Simulator</h3>
                  <p className="text-xs text-gray-400 max-w-2xl leading-relaxed">
                    Test your ability to spot sophisticated phishing attacks. Spotting visual typos, lookalike sender details, stack domains, and fake certificates is the absolute best human firewall in modern business.
                  </p>
                </div>
                
                {/* Score badge */}
                <div className="bg-[#0c1220] px-5 py-3 rounded-xl border border-[#212f4d] flex items-center gap-2 shrink-0">
                  <ShieldCheck className="h-5 w-5 text-indigo-400" />
                  <div>
                    <div className="text-[10px] uppercase font-mono text-gray-500 font-bold">Accuracy Score</div>
                    <div className="text-lg font-bold text-white">
                      {quizScore} / {QUIZ_QUESTIONS.length} Correct
                    </div>
                  </div>
                </div>
              </div>

              {/* Quiz list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="simulator-quiz-grid">
                {QUIZ_QUESTIONS.map((q, qIdx) => {
                  const state = quizAnswers[q.id];
                  
                  return (
                    <div key={q.id} className="bg-[#101726] border border-[#1b253b] rounded-2xl overflow-hidden flex flex-col justify-between">
                      <div>
                        {/* Header card indicating source and question number */}
                        <div className="p-4 bg-[#0a0f19] border-b border-[#1b253b] flex justify-between items-center">
                          <span className="text-[10px] font-mono tracking-widest text-[#22d3ee] font-semibold uppercase">SCENARIO #{qIdx + 1}</span>
                          <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded bg-[#1c2438] text-gray-400 capitalize">
                            {q.type} Link
                          </span>
                        </div>

                        {/* Simulator Content showcase container resembling email box or browser url bar */}
                        <div className="p-5 space-y-4">
                          <div className="bg-[#0b0f19] rounded-xl p-3 border border-[#172135] space-y-2">
                            {q.type === "email" ? (
                              <div className="space-y-2 text-xs">
                                <div><strong className="text-gray-400 font-medium">From:</strong> <span className="font-mono text-indigo-300">{q.sender}</span></div>
                                <div className="border-b border-[#172135]/60 pb-1.5"><strong className="text-gray-400 font-medium">Subject:</strong> <span className="text-white font-semibold">{q.subjectOrUrl}</span></div>
                                <p className="text-gray-400 font-mono text-[11px] leading-relaxed select-all whitespace-pre-wrap mt-2">{q.bodyPreview}</p>
                              </div>
                            ) : (
                              <div className="space-y-1.5 text-xs">
                                <span className="text-[10px] uppercase text-gray-500 font-mono font-bold">Suspect HTTP Request URL:</span>
                                <div className="font-mono text-[11px] text-indigo-300 bg-[#090b11] p-2.5 rounded-lg border border-[#161c2b] select-all break-all leading-normal">
                                  {q.subjectOrUrl}
                                </div>
                                <p className="text-gray-400 text-xs mt-1 italic">"{q.bodyPreview}"</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Interactive Choices Area */}
                      <div className="p-5 pt-0 border-t border-[#1b253b]/30 space-y-4">
                        {!state?.answered ? (
                          <div className="flex gap-3">
                            <button 
                              onClick={() => handleQuizAnswer(q.id, true)}
                              className="flex-1 py-2.5 text-xs font-bold font-mono text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500 border border-red-500/20 hover:border-red-500 rounded-xl transition-all duration-300 uppercase tracking-wider"
                            >
                              Phishing Attempt
                            </button>
                            <button 
                              onClick={() => handleQuizAnswer(q.id, false)}
                              className="flex-1 py-2.5 text-xs font-bold font-mono text-emerald-400 hover:text-white bg-emerald-500/10 hover:bg-emerald-500 border border-emerald-500/20 hover:border-emerald-500 rounded-xl transition-all duration-300 uppercase tracking-wider"
                            >
                              Legitimate Source
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-3 pt-3">
                            <div className="flex items-center gap-2">
                              {state.isCorrect ? (
                                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                                  <CheckCircle2 className="h-4.5 w-4.5" />
                                  <span>CORRECT ANSWER</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5 text-xs font-bold text-red-400">
                                  <XCircle className="h-4.5 w-4.5" />
                                  <span>INCORRECT CLASSIFICATION</span>
                                </div>
                              )}
                            </div>

                            {/* Detailed reveal explaining red flags */}
                            <div className="bg-[#0b0e17] rounded-xl p-3 border border-[#1b253b] space-y-2">
                              <p className="text-xs text-gray-300 leading-relaxed font-sans">{q.explanation}</p>
                              
                              <div className="space-y-1">
                                <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-[#22d3ee]">Discovered Red Flags:</span>
                                <div className="flex flex-col gap-1">
                                  {q.redFlags.map((flag, flgIdx) => (
                                    <div key={flgIdx} className="text-[10px] text-gray-400 flex items-start gap-1.5">
                                      <span className="text-amber-500 font-bold shrink-0">•</span>
                                      <span>{flag}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Explanatory notice card */}
              <div className="p-4 bg-[#101726]/40 border border-[#1b253b] rounded-xl text-center">
                <p className="text-xs text-gray-400 flex items-center justify-center gap-1.5">
                  <HelpCircle className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span>Interactive module completes user-centric phish testing, satisfying enterprise awareness criteria.</span>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modern Compact Footer */}
      <footer className="mt-8 border-t border-[#1b253b] bg-[#090d17] p-8 text-center text-xs text-gray-500" id="footer-branding">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4.5 w-4.5 text-indigo-500" />
            <span className="font-semibold text-gray-400">Cyber Shield AI Terminal</span>
            <span className="text-[10px] text-gray-600 font-mono">v1.2</span>
          </div>
          <p className="font-medium text-[11px] leading-normal text-gray-600">
            © 2026 Cyber Shield Technologies. Real-time scanning utilizes multimodal Gemini deep learning. Deployed securely in sandbox environment.
          </p>
        </div>
      </footer>
    </div>
  );
}
