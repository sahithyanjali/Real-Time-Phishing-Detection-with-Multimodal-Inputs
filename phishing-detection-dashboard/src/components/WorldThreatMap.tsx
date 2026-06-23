import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Globe, ShieldAlert, Wifi, Activity, Terminal, Flame, Info, Filter } from "lucide-react";
import { getLogRiskClass } from "../utils/colors";

interface ThreatPoint {
  id: string;
  name: string;
  lat: number; // mapped coordinates for 0-100 grid scale
  lng: number;
  country: string;
  region: string;
  reputationScore: number;
  activeRisk: "Moderate" | "High" | "Critical";
  threatPercent: number;
  topThreatType: string;
  activeIncidents: number;
}

interface ActiveAttack {
  id: string;
  origin: ThreatPoint;
  target: { name: string; lat: number; lng: number };
  duration: number;
  type: string;
}

interface MiniLog {
  id: string;
  time: string;
  origin: string;
  target: string;
  type: string;
  risk: "High" | "Critical" | "Warning";
}

const THREAT_LOCATIONS: ThreatPoint[] = [
  { id: "p1", name: "St. Petersburg Hub", lat: 31, lng: 56, country: "Russia", region: "Eastern Europe", reputationScore: 19, activeRisk: "Critical", threatPercent: 88, topThreatType: "Credential Harvesting", activeIncidents: 142 },
  { id: "p2", name: "Shenzhen Server Farm", lat: 46, lng: 76, country: "China", region: "East Asia", reputationScore: 24, activeRisk: "Critical", threatPercent: 91, topThreatType: "Lookalike Domain Spoofing", activeIncidents: 189 },
  { id: "p3", name: "São Paulo Botnet Base", lat: 79, lng: 32, country: "Brazil", region: "South America", reputationScore: 35, activeRisk: "High", threatPercent: 74, topThreatType: "Fake Invoice Attachments", activeIncidents: 94 },
  { id: "p4", name: "Lagos Phish Nexus", lat: 59, lng: 48, country: "Nigeria", region: "West Africa", reputationScore: 42, activeRisk: "High", threatPercent: 68, topThreatType: "CEO Social Engineering", activeIncidents: 76 },
  { id: "p5", name: "Eastern European Proxy Net", lat: 36, lng: 52, country: "Ukraine", region: "Eastern Europe", reputationScore: 48, activeRisk: "Moderate", threatPercent: 55, topThreatType: "Malicious PDF Vectors", activeIncidents: 41 },
  { id: "p6", name: "Sofia Impersonation Cluster", lat: 38, lng: 51, country: "Bulgaria", region: "Southeast Europe", reputationScore: 52, activeRisk: "Moderate", threatPercent: 49, topThreatType: "SSO Clone Portals", activeIncidents: 33 }
];

const TARGET_DESTINATIONS = [
  { name: "New York, USA", lat: 38, lng: 22 },
  { name: "Frankfurt, Germany", lat: 34, lng: 46 },
  { name: "Singapore Gateway", lat: 58, lng: 75 },
  { name: "Sydney Hub, Australia", lat: 82, lng: 88 }
];

const THREAT_TYPES = [
  "Microsoft SSO Harvesting",
  "Rogue PayPal Login Page",
  "DocuSign Spoof Attachment",
  "Urgent Billing Invoice Scam",
  "Chase Bank Lookalike Redirect",
  "Metaverse Credential Hook"
];

export default function WorldThreatMap() {
  const [selectedPoint, setSelectedPoint] = useState<ThreatPoint | null>(THREAT_LOCATIONS[0]);
  const [activeAttacks, setActiveAttacks] = useState<ActiveAttack[]>([]);
  const [logs, setLogs] = useState<MiniLog[]>([]);
  const [totalIntercepts, setTotalIntercepts] = useState(14820);
  const [threatIntensity, setThreatIntensity] = useState<"Heavy" | "Normal" | "Elevated">("Elevated");

  // Keep generating real-time animated attacks and logs
  useEffect(() => {
    // Generate initial sample logs
    const initialLogs: MiniLog[] = Array.from({ length: 6 }).map((_, i) => {
      const origin = THREAT_LOCATIONS[Math.floor(Math.random() * THREAT_LOCATIONS.length)];
      const target = TARGET_DESTINATIONS[Math.floor(Math.random() * TARGET_DESTINATIONS.length)];
      const type = THREAT_TYPES[Math.floor(Math.random() * THREAT_TYPES.length)];
      const date = new Date(Date.now() - (i + 1) * 45000);
      const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      return {
        id: `log-init-${i}`,
        time: timeStr,
        origin: origin.name,
        target: target.name,
        type,
        risk: origin.activeRisk === "Critical" ? "Critical" : (Math.random() > 0.5 ? "High" : "Warning")
      };
    });
    setLogs(initialLogs);

    const interval = setInterval(() => {
      // 1. Randomly pick an origin location and a target
      const originPt = THREAT_LOCATIONS[Math.floor(Math.random() * THREAT_LOCATIONS.length)];
      const targetPt = TARGET_DESTINATIONS[Math.floor(Math.random() * TARGET_DESTINATIONS.length)];
      const type = THREAT_TYPES[Math.floor(Math.random() * THREAT_TYPES.length)];

      const attackId = `attack-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
      const newAttack: ActiveAttack = {
        id: attackId,
        origin: originPt,
        target: targetPt,
        duration: 3.5, // seconds for animation
        type
      };

      // 2. Add attack vector
      setActiveAttacks(prev => [...prev.slice(-10), newAttack]); // constrain array size

      // 3. Increment counters
      setTotalIntercepts(prev => prev + 1 + Math.floor(Math.random() * 2));

      // 4. Append live event monitor stream log
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const newLog: MiniLog = {
        id: `log-${Date.now()}`,
        time: timeStr,
        origin: originPt.name,
        target: targetPt.name,
        type,
        risk: originPt.activeRisk === "Critical" ? "Critical" : (Math.random() > 0.4 ? "High" : "Warning")
      };

      setLogs(prev => [newLog, ...prev.slice(0, 14)]);

      // Adjust threat intensity metric slightly dynamically
      const hour = new Date().getMinutes();
      if (hour % 3 === 0) setThreatIntensity("Elevated");
      else if (hour % 5 === 0) setThreatIntensity("Heavy");
      else setThreatIntensity("Normal");

    }, 2800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#101726] border border-[#1b253b] rounded-2xl overflow-hidden shadow-2xl p-5 md:p-6 space-y-6" id="world-threat-container">
      {/* Upper Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1b253b]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-red-600/10 text-red-500 rounded-lg flex items-center justify-center">
              <Flame className="h-4 w-4 animate-pulse" />
            </span>
            <h3 className="text-lg font-bold text-white tracking-tight">Real-Time Global Phishing Telemetry</h3>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">Live neural monitoring of credential harvesting portals & rogue DNS origination clusters</p>
        </div>

        {/* Counter Widget */}
        <div className="flex items-center gap-4">
          <div className="bg-[#0b0e17] px-4 py-2 rounded-xl border border-[#1a253e] text-right">
            <span className="text-[9px] font-mono font-bold text-gray-500 block uppercase tracking-wider">Total Scans Intercepted</span>
            <div className="text-lg font-extrabold text-indigo-400 font-mono tracking-tight flex items-center justify-end gap-1.5">
              <span className="h-2 w-2 rounded-full bg-indigo-500 animate-ping"></span>
              {totalIntercepts.toLocaleString()}
            </div>
          </div>

          <div className="bg-[#0b0e17] px-4 py-2 rounded-xl border border-[#1a253e] text-right">
            <span className="text-[9px] font-mono font-bold text-gray-500 block uppercase tracking-wider">Threat Load Intensity</span>
            <div className={`text-sm font-extrabold font-mono tracking-wider uppercase ${
              threatIntensity === "Heavy" ? "text-red-500" :
              threatIntensity === "Elevated" ? "text-amber-500" : "text-emerald-500"
            }`}>
              {threatIntensity}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive SVG Map and Live Incident Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Interactive SVG Map Column */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative aspect-[2/1] bg-[#090d19] border border-[#1b253b] rounded-2xl overflow-hidden p-2 group shadow-inner">
            
            {/* Ambient Background Grid pattern overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(27,37,59,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(27,37,59,0.08)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>
            
            {/* Stylized high-tech world vector shapes painted with pure high-fidelity coordinates */}
            <svg className="w-full h-full select-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Simplified world representation - Continents as paths */}
              {/* North America */}
              <path
                d="M 5,20 L 15,20 Q 20,12 25,10 Q 30,12 35,24 L 32,35 Q 24,42 18,44 L 14,35 Z"
                className="fill-[#131d36]/90 stroke-[#1f2e54]/50"
                strokeWidth="0.4"
              />
              <path
                d="M 24,12 L 28,14 L 27,18 L 22,17 Z"
                className="fill-[#131d36]/90 stroke-[#1f2e54]/30"
                strokeWidth="0.3"
              />
              {/* South America */}
              <path
                d="M 22,48 Q 28,51 32,58 L 34,72 L 31,85 L 28,82 L 20,62 L 18,52 Z"
                className="fill-[#131d36]/90 stroke-[#1f2e54]/50"
                strokeWidth="0.4"
              />
              {/* Eurasia / Africa */}
              {/* Greenland */}
              <path
                d="M 32,5 L 38,4 L 34,13 L 29,10 Z"
                className="fill-[#131d36]/90 stroke-[#1f2e54]/40"
                strokeWidth="0.3"
              />
              {/* Europe & Asia combined */}
              <path
                d="M 38,20 Q 42,12 48,15 Q 52,8 60,10 L 72,12 Q 80,11 86,18 L 92,26 L 88,44 L 84,48 L 74,40 L 71,46 L 68,36 Q 64,48 58,48 L 52,38 L 47,40 Q 44,28 38,20 Z"
                className="fill-[#131d36]/95 stroke-[#1f2e54]/50"
                strokeWidth="0.4"
              />
              {/* Japan / Islands */}
              <path
                d="M 88,20 L 90,19 L 91,24 L 89,26 Z"
                className="fill-[#131d36]/90 stroke-[#1f2e54]/30"
                strokeWidth="0.3"
              />
              {/* Africa */}
              <path
                d="M 40,43 L 48,42 Q 52,44 56,52 L 56,64 L 51,74 L 48,70 L 43,56 Z"
                className="fill-[#131d36]/95 stroke-[#1f2e54]/50"
                strokeWidth="0.4"
              />
              {/* Australia */}
              <path
                d="M 75,68 Q 80,66 86,72 L 88,80 L 80,82 L 72,78 Z"
                className="fill-[#131d36]/90 stroke-[#1f2e54]/50"
                strokeWidth="0.4"
              />

              {/* Secure Targets Points (White nodes with glowing range) */}
              {TARGET_DESTINATIONS.map((target, idx) => (
                <g key={`target-${idx}`}>
                  <circle
                    cx={target.lng}
                    cy={target.lat}
                    r="1.2"
                    className="fill-[#22d3ee] shadow-sm animate-pulse"
                  />
                  <circle
                    cx={target.lng}
                    cy={target.lat}
                    r="4"
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="0.15"
                    strokeDasharray="1 1"
                    className="animate-[spin_10s_linear_infinite]"
                  />
                </g>
              ))}

              {/* Dynamic Animated Attack Routes (Bezier Curves with traveling sparks) */}
              {activeAttacks.map((attack) => {
                const x1 = attack.origin.lng;
                const y1 = attack.origin.lat;
                const x2 = attack.target.lng;
                const y2 = attack.target.lat;
                
                // Calculate beautiful curve midpoints
                const mx = (x1 + x2) / 2;
                const my = Math.min(y1, y2) - 15; // arch up

                return (
                  <g key={attack.id}>
                    {/* Background faint path line */}
                    <path
                      d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
                      fill="none"
                      stroke={attack.origin.activeRisk === "Critical" ? "#f43f5e" : "#fbbf24"}
                      strokeWidth="0.5"
                      strokeOpacity="0.25"
                    />

                    {/* Traveling spark element along path using motion */}
                    <motion.circle
                      r="1"
                      fill={attack.origin.activeRisk === "Critical" ? "#ef4444" : "#f59e0b"}
                      style={{ opacity: 0.9 }}
                      animate={{
                        cx: [x1, mx, x2],
                        cy: [y1, my, y2]
                      }}
                      transition={{
                        duration: attack.duration,
                        ease: "easeInOut",
                        repeat: 0
                      }}
                    />
                  </g>
                );
              })}

              {/* Threat Locations Points (Interactive buttons on SVG) */}
              {THREAT_LOCATIONS.map((pt) => {
                const isSelected = selectedPoint?.id === pt.id;
                const isCritical = pt.activeRisk === "Critical";
                
                return (
                  <g
                    key={pt.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedPoint(pt)}
                  >
                    {/* Faint pulsing halo */}
                    <circle
                      cx={pt.lng}
                      cy={pt.lat}
                      r={isSelected ? "5" : "3.5"}
                      fill="none"
                      stroke={isCritical ? "#ef4444" : "#f59e0b"}
                      strokeWidth="0.3"
                      className="animate-ping"
                      style={{ animationDuration: isSelected ? "1.5s" : "3s" }}
                    />
                    
                    {/* Hard Point Core */}
                    <circle
                      cx={pt.lng}
                      cy={pt.lat}
                      r={isSelected ? "2.5" : "1.8"}
                      fill={isCritical ? "#ef4444" : "#f59e0b"}
                      stroke="#090d19"
                      strokeWidth="0.5"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Label overlays directly inside canvas */}
            <div className="absolute top-3 left-4 flex items-center gap-1.5 bg-[#090d19]/90 border border-[#1b253b] px-2.5 py-1 rounded-lg text-[10px] font-mono text-gray-400">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400"></span>
              <span>Secure Systems Gateways</span>
              <span className="ml-2 h-1.5 w-1.5 rounded-full bg-red-500"></span>
              <span>Threat DNS Origins</span>
            </div>

            <div className="absolute bottom-3 right-4 bg-[#090d19]/90 border border-[#1b253b] px-2.5 py-1 rounded-lg text-[9px] font-mono text-gray-500">
              Click individual server pins to audit threat profiles
            </div>
          </div>

          {/* Point Analysis Details (Displays metadata for selected origin point) */}
          <AnimatePresence mode="wait">
            {selectedPoint && (
              <motion.div
                key={selectedPoint.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-[#0b101c] border border-[#1e2a44] p-4 rounded-xl space-y-4 relative"
              >
                <div className="absolute top-3 right-3 text-[10px] bg-red-600/10 text-red-500 px-2 py-0.5 rounded border border-red-500/15 font-mono">
                  {selectedPoint.activeRisk} Threat Level
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Globe className="h-4 w-4 text-indigo-400" />
                      <span>Geo Audit: {selectedPoint.name}</span>
                    </h4>
                    <p className="text-xs text-gray-400">Origination country: {selectedPoint.country} ({selectedPoint.region})</p>
                  </div>
                  
                  {/* Performance Indicators */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[9px] text-gray-500 block uppercase font-mono font-bold">Reputation Index</span>
                      <span className="text-xs font-mono font-extrabold text-red-400">{selectedPoint.reputationScore}/100</span>
                    </div>
                    <div className="h-8 w-px bg-gray-800"></div>
                    <div className="text-right">
                      <span className="text-[9px] text-gray-500 block uppercase font-mono font-bold">Botnet Density</span>
                      <span className="text-xs font-mono font-extrabold text-amber-500">{selectedPoint.threatPercent}% High Risk</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-[#161f33] text-xs">
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-gray-500 uppercase font-mono font-bold">Signature Tactics</span>
                    <div className="bg-[#101726] p-2 rounded-lg border border-[#1b253b] font-medium text-gray-300">
                      {selectedPoint.topThreatType}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-gray-500 uppercase font-mono font-bold">Active Phishing campaigns (L30)</span>
                    <div className="bg-[#101726] p-2 rounded-lg border border-[#1b253b] font-mono text-indigo-300 font-bold flex items-center justify-between">
                      <span>{selectedPoint.activeIncidents} server fingerprints</span>
                      <span className="bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded text-[10px] font-sans font-bold animate-pulse">CRITICAL DISCOVERY</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Live Attack Incident Feed Log Column */}
        <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
          <div className="bg-[#0b101c]/60 border border-[#1c273e] rounded-2xl flex-1 flex flex-col min-h-[380px] overflow-hidden">
            
            {/* Log Header */}
            <div className="p-4 bg-[#0a0f19] border-b border-[#1b253b] flex items-center justify-between">
              <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                <Terminal className="h-4 w-4 text-red-500" />
                <span>Live Sentinel Incident Feed</span>
              </span>
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
            </div>

            {/* Scrollable event listings */}
            <div className="p-3 overflow-y-auto max-h-[340px] space-y-2 flex-1 font-mono text-[10px]">
              <AnimatePresence initial={false}>
                {logs.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-2 border border-[#1b253b] bg-[#0d1222] hover:bg-[#11192e] rounded-lg space-y-1 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-indigo-400 font-semibold">{log.time}</span>
                      <span className={`px-1.5 py-0.2 rounded font-extrabold uppercase text-[8px] ${getLogRiskClass(log.risk)}`}>
                        {log.risk}
                      </span>
                    </div>
                    
                    <div className="text-gray-300">
                      Intercepted <span className="text-red-400 font-bold">{log.type}</span> originating from <span className="text-white underline">{log.origin}</span>.
                    </div>
                    
                    <div className="text-gray-500 text-[9px] flex items-center justify-between">
                      <span>Targeting: {log.target}</span>
                      <span className="text-[#22d3ee] font-bold">BLOCKED 🛡️</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Quick Informational disclaimer */}
          <div className="bg-[#12192b] border border-[#1e2c46] p-4 rounded-2xl flex items-start gap-2.5">
            <Info className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-gray-400 leading-normal">
              Attack sequences represent real-time DNS queries, telemetry matching templates, and OCR validations routed via our fast neural API. Simulated activity reflects current global phishing waves.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
