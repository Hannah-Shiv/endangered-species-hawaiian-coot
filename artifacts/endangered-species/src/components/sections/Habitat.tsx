import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import habitatImg from "@/assets/habitat.png";

const ISLANDS = {
  Oahu: {
    rainfall: "500–1,500",
    rainfallPct: 55,
    temp: "24–32",
    tempPct: 80,
    biome: "Coastal wetlands, fishponds, urban refuges",
    sites: ["James Campbell NWR", "Pearl Harbor NWR", "Hamakua Marsh"],
    wetlandHealth: 62,
    foodAvail: 70,
    nestingCond: 58,
  },
  Maui: {
    rainfall: "500–2,000",
    rainfallPct: 80,
    temp: "22–31",
    tempPct: 70,
    biome: "Coastal ponds, taro fields, brackish lagoons",
    sites: ["Kanaha Pond", "Kealia Pond NWR", "Waiehu Marsh"],
    wetlandHealth: 74,
    foodAvail: 78,
    nestingCond: 72,
  },
  Kauai: {
    rainfall: "1,000–2,000",
    rainfallPct: 95,
    temp: "21–30",
    tempPct: 60,
    biome: "River valleys, taro paddies, lush inland marshes",
    sites: ["Hanalei NWR", "Huleia NWR", "Alakai Swamp edges"],
    wetlandHealth: 88,
    foodAvail: 85,
    nestingCond: 82,
  },
  "Hawaii Island": {
    rainfall: "500–1,800",
    rainfallPct: 72,
    temp: "23–32",
    tempPct: 75,
    biome: "Lowland wetlands, brackish ponds, lava-bordered marshes",
    sites: ["Waipio Valley wetlands", "Keokea Beach ponds", "Hamakua Coast marshes"],
    wetlandHealth: 65,
    foodAvail: 60,
    nestingCond: 63,
  },
};

type IslandKey = keyof typeof ISLANDS;

function RainDrop({ delay, left, duration }: { delay: number; left: number; duration: number }) {
  return (
    <div style={{
      position: "absolute",
      left: `${left}%`,
      top: "-10px",
      width: "2px",
      height: "14px",
      borderRadius: "2px",
      background: "linear-gradient(to bottom, transparent, rgba(59,130,246,0.8))",
      animation: `rain-fall ${duration}s linear ${delay}s infinite`,
    }} />
  );
}

function HeatWave({ delay, top }: { delay: number; top: number }) {
  return (
    <div style={{
      position: "absolute",
      left: "10%",
      top: `${top}%`,
      width: "80%",
      height: "2px",
      borderRadius: "50%",
      background: "linear-gradient(to right, transparent, rgba(239,68,68,0.4), transparent)",
      animation: `heat-wave 1.8s ease-in-out ${delay}s infinite`,
    }} />
  );
}

function ImpactBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ marginBottom: "12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
        <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(212,175,55,0.8)" }}>{label}</span>
        <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: "11px", fontWeight: 700, color }}>{value}%</span>
      </div>
      <div style={{ height: "6px", borderRadius: "3px", background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ height: "100%", borderRadius: "3px", background: `linear-gradient(to right, ${color}88, ${color})` }}
        />
      </div>
    </div>
  );
}

const rainDrops = Array.from({ length: 18 }, (_, i) => ({
  delay: (i * 0.17) % 2,
  left: (i * 23 + 7) % 96,
  duration: 0.8 + (i % 3) * 0.2,
}));

const heatWaves = [
  { delay: 0, top: 30 },
  { delay: 0.6, top: 52 },
  { delay: 1.2, top: 68 },
];

export function Habitat() {
  const [selectedIsland, setSelectedIsland] = useState<IslandKey>("Maui");
  const [tempHover, setTempHover] = useState(false);
  const [rainHover, setRainHover] = useState(false);
  const island = ISLANDS[selectedIsland];

  return (
    <>
      <style>{`
        @keyframes rain-fall {
          0%   { transform: translateY(-10px); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(160px); opacity: 0; }
        }
        @keyframes heat-wave {
          0%   { transform: scaleX(0.3) translateX(-30%); opacity: 0; }
          50%  { transform: scaleX(1) translateX(0%); opacity: 1; }
          100% { transform: scaleX(0.3) translateX(30%); opacity: 0; }
        }
        @keyframes thermo-fill {
          0%   { height: 20%; }
          100% { height: 75%; }
        }
        @keyframes ripple {
          0%   { transform: scale(0.6); opacity: 0.8; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(239,68,68,0.3); }
          50%       { box-shadow: 0 0 40px rgba(239,68,68,0.7), 0 0 80px rgba(239,68,68,0.3); }
        }
        @keyframes pulse-glow-blue {
          0%, 100% { box-shadow: 0 0 20px rgba(59,130,246,0.3); }
          50%       { box-shadow: 0 0 40px rgba(59,130,246,0.7), 0 0 80px rgba(59,130,246,0.3); }
        }
      `}</style>

      <div className="w-full min-h-screen pt-24 pb-12 px-6 md:px-12 bg-background overflow-y-auto">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-12">
            <h1 className="text-5xl uppercase mb-4" style={{ fontFamily: "'Josefin Sans', sans-serif", letterSpacing: "0.1em", color: "rgba(212,175,55,1)" }}>
              Habitat & Location
            </h1>
            <p className="text-xl max-w-3xl mx-auto" style={{ fontFamily: "'Playfair Display', serif", color: "rgba(255,255,255,0.8)" }}>
              The Hawaiian Coot's domain spans the fragile freshwater and brackish wetlands across the Hawaiian Islands.
            </p>
          </motion.div>

          {/* Island selector */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="flex flex-wrap justify-center gap-3 mb-10">
            {(Object.keys(ISLANDS) as IslandKey[]).map(name => (
              <button
                key={name}
                onClick={() => setSelectedIsland(name)}
                style={{
                  fontFamily: "'Josefin Sans', sans-serif",
                  fontSize: "12px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  padding: "8px 20px",
                  borderRadius: "999px",
                  border: `2px solid ${selectedIsland === name ? "rgba(212,175,55,1)" : "rgba(212,175,55,0.3)"}`,
                  background: selectedIsland === name ? "rgba(212,175,55,0.15)" : "rgba(3,5,14,0.8)",
                  color: selectedIsland === name ? "rgba(212,175,55,1)" : "rgba(212,175,55,0.5)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: selectedIsland === name ? "0 0 18px rgba(212,175,55,0.25)" : "none",
                }}
              >{name}</button>
            ))}
          </motion.div>

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">

            {/* Location & Biome card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedIsland}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.4 }}
                className="p-8 rounded-2xl border"
                style={{ background: "rgba(3,5,14,0.95)", borderColor: "rgba(212,175,55,0.3)" }}
              >
                <h2 className="text-2xl font-bold uppercase mb-2" style={{ fontFamily: "'Josefin Sans', sans-serif", letterSpacing: "0.1em", color: "rgba(212,175,55,1)" }}>
                  {selectedIsland}
                </h2>
                <p className="text-sm mb-5" style={{ fontFamily: "'Playfair Display', serif", color: "rgba(255,255,255,0.55)", fontStyle: "italic" }}>{island.biome}</p>

                <p className="text-base mb-1" style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(212,175,55,0.7)" }}>Key Refuge Sites</p>
                <ul className="mb-6">
                  {island.sites.map(site => (
                    <li key={site} style={{ fontFamily: "'Playfair Display', serif", color: "rgba(255,255,255,0.8)", fontSize: "15px", padding: "3px 0", borderBottom: "1px solid rgba(212,175,55,0.08)", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ color: "rgba(193,18,31,0.8)", fontSize: "10px" }}>◆</span>{site}
                    </li>
                  ))}
                </ul>

                <div className="p-4 border rounded-lg" style={{ background: "rgba(193,18,31,0.08)", borderColor: "rgba(193,18,31,0.35)" }}>
                  <p className="font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "rgba(212,175,55,1)", fontSize: "15px" }}>
                    70% of original Hawaiian wetlands have been lost to development.
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Photo */}
            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
              <div className="aspect-video rounded-2xl overflow-hidden border-2 relative" style={{ borderColor: "rgba(193,18,31,0.5)" }}>
                <img src={habitatImg} alt="Hawaiian Wetland Habitat" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-transparent to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-xl font-bold uppercase" style={{ fontFamily: "'Josefin Sans', sans-serif", letterSpacing: "0.1em", color: "rgba(212,175,55,1)" }}>Hawaiian Wetlands</h3>
                  <p className="text-base" style={{ fontFamily: "'Playfair Display', serif", color: "rgba(255,255,255,0.8)" }}>Freshwater ponds, taro fields, and lush tropical vegetation.</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Climate Profile heading */}
          <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-3xl font-bold text-center uppercase mb-8" style={{ fontFamily: "'Josefin Sans', sans-serif", letterSpacing: "0.1em", color: "rgba(212,175,55,1)" }}>
            Climate Profile
          </motion.h2>

          {/* Interactive climate cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-10">

            {/* Temperature Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`temp-${selectedIsland}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                onMouseEnter={() => setTempHover(true)}
                onMouseLeave={() => setTempHover(false)}
                style={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: "16px",
                  border: `2px solid ${tempHover ? "rgba(239,68,68,0.8)" : "rgba(193,18,31,0.5)"}`,
                  background: "rgba(3,5,14,0.95)",
                  padding: "28px 24px",
                  cursor: "default",
                  animation: tempHover ? "pulse-glow 1.5s ease-in-out infinite" : "none",
                  transition: "border-color 0.3s, box-shadow 0.3s",
                  minHeight: "220px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* Heat waves */}
                {tempHover && heatWaves.map((w, i) => <HeatWave key={i} {...w} />)}

                {/* Thermometer SVG */}
                <svg width="36" height="60" viewBox="0 0 36 60" style={{ marginBottom: "12px" }}>
                  <rect x="14" y="4" width="8" height="38" rx="4" fill="rgba(255,255,255,0.08)" stroke="rgba(193,18,31,0.5)" strokeWidth="1.5" />
                  <rect
                    x="15.5" y={tempHover ? "8" : "28"} width="5" rx="2.5"
                    height={tempHover ? "34" : "14"}
                    fill="rgba(239,68,68,0.85)"
                    style={{ transition: "all 0.8s ease" }}
                  />
                  <circle cx="18" cy="48" r="10" fill="rgba(239,68,68,0.9)" />
                  <circle cx="18" cy="48" r="6" fill={tempHover ? "rgba(255,100,100,1)" : "rgba(239,68,68,0.9)"} style={{ transition: "fill 0.3s" }} />
                </svg>

                <div style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: "2.5rem", fontWeight: 700, color: "rgba(239,68,68,1)", lineHeight: 1, marginBottom: "4px", transition: "color 0.3s" }}>
                  {island.temp}°C
                </div>
                <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(212,175,55,0.7)", marginBottom: tempHover ? "12px" : "0", transition: "margin 0.3s" }}>
                  Year-round Temperature
                </p>

                <AnimatePresence>
                  {tempHover && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.3 }}
                      style={{ fontFamily: "'Playfair Display', serif", fontSize: "13px", color: "rgba(255,255,255,0.75)", textAlign: "center", lineHeight: 1.5, marginTop: "8px" }}
                    >
                      Warm tropical temperatures allow wetlands and taro fields to remain active year-round, supporting feeding and nesting habitats.
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>

            {/* Rainfall Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`rain-${selectedIsland}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                onMouseEnter={() => setRainHover(true)}
                onMouseLeave={() => setRainHover(false)}
                style={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: "16px",
                  border: `2px solid ${rainHover ? "rgba(59,130,246,0.8)" : "rgba(212,175,55,0.4)"}`,
                  background: "rgba(3,5,14,0.95)",
                  padding: "28px 24px",
                  cursor: "default",
                  animation: rainHover ? "pulse-glow-blue 1.5s ease-in-out infinite" : "none",
                  transition: "border-color 0.3s, box-shadow 0.3s",
                  minHeight: "220px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* Rain drops */}
                {rainHover && rainDrops.map((d, i) => <RainDrop key={i} {...d} />)}

                {/* Ripple */}
                {rainHover && (
                  <div style={{
                    position: "absolute",
                    bottom: "18px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "60px",
                    height: "20px",
                    borderRadius: "50%",
                    border: "2px solid rgba(59,130,246,0.5)",
                    animation: "ripple 1.4s ease-out infinite",
                  }} />
                )}

                {/* Cloud icon */}
                <svg width="52" height="32" viewBox="0 0 52 32" style={{ marginBottom: "12px" }}>
                  <ellipse cx="26" cy="22" rx="22" ry="10" fill={rainHover ? "rgba(59,130,246,0.25)" : "rgba(59,130,246,0.12)"} stroke="rgba(59,130,246,0.5)" strokeWidth="1.5" style={{ transition: "fill 0.3s" }} />
                  <ellipse cx="18" cy="18" rx="12" ry="9" fill={rainHover ? "rgba(59,130,246,0.3)" : "rgba(59,130,246,0.15)"} stroke="rgba(59,130,246,0.5)" strokeWidth="1.5" style={{ transition: "fill 0.3s" }} />
                  <ellipse cx="32" cy="16" rx="10" ry="9" fill={rainHover ? "rgba(59,130,246,0.3)" : "rgba(59,130,246,0.15)"} stroke="rgba(59,130,246,0.5)" strokeWidth="1.5" style={{ transition: "fill 0.3s" }} />
                  {rainHover && <>
                    <line x1="18" y1="31" x2="16" y2="38" stroke="rgba(59,130,246,0.8)" strokeWidth="2" strokeLinecap="round" />
                    <line x1="26" y1="31" x2="24" y2="38" stroke="rgba(59,130,246,0.8)" strokeWidth="2" strokeLinecap="round" />
                    <line x1="34" y1="31" x2="32" y2="38" stroke="rgba(59,130,246,0.8)" strokeWidth="2" strokeLinecap="round" />
                  </>}
                </svg>

                <div style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: "2.2rem", fontWeight: 700, color: "rgba(212,175,55,1)", lineHeight: 1, marginBottom: "4px" }}>
                  {island.rainfall} mm
                </div>
                <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(212,175,55,0.7)", marginBottom: rainHover ? "12px" : "0", transition: "margin 0.3s" }}>
                  Annual Rainfall
                </p>

                <AnimatePresence>
                  {rainHover && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.3 }}
                      style={{ fontFamily: "'Playfair Display', serif", fontSize: "13px", color: "rgba(255,255,255,0.75)", textAlign: "center", lineHeight: 1.5, marginTop: "8px", position: "relative", zIndex: 2 }}
                    >
                      Heavy rainfall sustains freshwater ponds and marshes used by Hawaiian Coots for nesting and feeding.
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Habitat Impact Meter */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`impact-${selectedIsland}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto p-8 rounded-2xl border"
              style={{ background: "rgba(3,5,14,0.95)", borderColor: "rgba(212,175,55,0.2)" }}
            >
              <h3 className="text-lg font-bold uppercase mb-6 text-center" style={{ fontFamily: "'Josefin Sans', sans-serif", letterSpacing: "0.12em", color: "rgba(212,175,55,1)" }}>
                🌿 Habitat Impact Meter — {selectedIsland}
              </h3>
              <ImpactBar label="Wetland Stability" value={island.wetlandHealth} color="rgba(34,197,94,1)" />
              <ImpactBar label="Food Availability" value={island.foodAvail} color="rgba(212,175,55,1)" />
              <ImpactBar label="Nesting Conditions" value={island.nestingCond} color="rgba(59,130,246,1)" />
            </motion.div>
          </AnimatePresence>

        </div>
      </div>
    </>
  );
}
