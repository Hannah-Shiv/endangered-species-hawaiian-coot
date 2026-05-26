import { motion, AnimatePresence, useSpring } from "framer-motion";
import { useState, useEffect } from "react";
import healthyImg from "@assets/image_1779835298098.png";
import ratsImg    from "@assets/image_1779835596663.png";
import dogsImg    from "@assets/image_1779838496982.png";
import frogsImg     from "@assets/image_1779838792688.png";
import mongooseImg   from "@assets/image_1779838906638.png";
import nightHeronImg from "@assets/image_1779839059339.png";

// ── Palette ───────────────────────────────────────────────────────────────────
const GOLD = "rgba(212,175,55,1)";
const BG   = "#07080c";

// ── Types ─────────────────────────────────────────────────────────────────────
type ThreatLevel = "HIGH" | "MEDIUM" | "LOW";
type Metrics     = { habitat: number; nesting: number; water: number; food: number; population: number };
type EcoRow      = { icon: string; label: string; dir: "up"|"down"; pct: number };
type Overlay     = { label: string; text: string; top: string; left?: string; right?: string };

type Predator = {
  id:        string;
  num:       number;
  name:      string;
  threat:    ThreatLevel;
  color:     string;
  sideIcon:  string;
  sideDesc:  string;
  image:     string;
  imgFilter: string;
  headline:  string;
  overlays:  Overlay[];
  ecoImpact: EcoRow[];
  actions:   string[];
  metrics:   Metrics;
  banner:    string;
};

// ── Data ──────────────────────────────────────────────────────────────────────
const PREDATORS: Predator[] = [
  {
    id: "healthy", num: 0, name: "Healthy Habitat", threat: "LOW", color: "#33ee88",
    sideIcon: "🌿",
    sideDesc: "A thriving Hawaiian wetland — coots nest peacefully, eggs are safe, and the ecosystem is in natural balance.",
    image: healthyImg as string,
    imgFilter: "none",
    headline: "HEALTHY ECOSYSTEM — BASELINE STATE",
    overlays: [
      { label: "✅  STABLE ECOSYSTEM", text: "No invasive threats detected. Hawaiian Coots nest and forage safely.", top: "10%", left: "3%" },
      { label: "🪺  ACTIVE NEST", text: "Eggs and chicks are safe. Incubation proceeding normally.", top: "5%", right: "2%" },
    ],
    ecoImpact: [
      { icon: "🪺", label: "Nesting Success",      dir: "up", pct: 85 },
      { icon: "🐣", label: "Chick Survival",       dir: "up", pct: 80 },
      { icon: "🦤", label: "Population Stability", dir: "up", pct: 78 },
      { icon: "🌿", label: "Habitat Health",       dir: "up", pct: 88 },
    ],
    actions: ["Protect existing wetland refuges", "Support habitat restoration programs", "Report invasive species sightings early"],
    metrics: { habitat: 85, nesting: 80, water: 88, food: 82, population: 78 },
    banner: "This is a healthy Hawaiian Coot wetland. Minimal threats. Ideal conditions for nesting, foraging, and raising chicks.",
  },
  {
    id: "mongoose", num: 1, name: "Mongoose", threat: "HIGH", color: "#ff3344",
    sideIcon: "🦡",
    sideDesc: "Introduced in 1883, mongoose devastate ground and low nests, taking both eggs and chicks.",
    image: mongooseImg as string,
    imgFilter: "none",
    headline: "MONGOOSE IMPACT",
    overlays: [
      { label: "⚠  ACTIVE PREDATOR DETECTED", text: "Mongoose are highly adaptable and hunt both day and night.", top: "5%", left: "30%" },
      { label: "⚠  NEST AT RISK", text: "Eggs and chicks are left exposed — entire clutches lost in minutes.", top: "74%", right: "2%" },
    ],
    ecoImpact: [
      { icon: "🪺", label: "Nesting Success",      dir: "down", pct: 60 },
      { icon: "🐣", label: "Chick Survival",       dir: "down", pct: 70 },
      { icon: "🦤", label: "Population Stability", dir: "down", pct: 45 },
      { icon: "🌿", label: "Habitat Stress",        dir: "up",   pct: 40 },
    ],
    actions: ["Support predator control programs", "Keep food sources secured", "Support habitat restoration and refuges"],
    metrics: { habitat: 58, nesting: 32, water: 61, food: 46, population: 40 },
    banner: "Invasive predators are one of the greatest threats to the Hawaiian Coot. Your actions can help protect their future.",
  },
  {
    id: "rats", num: 2, name: "Rats & Feral Cats", threat: "HIGH", color: "#ff3344",
    sideIcon: "🐀",
    sideDesc: "Nocturnal nest raiders and direct predators that are widespread throughout the Hawaiian Islands.",
    image: ratsImg as string,
    imgFilter: "none",
    headline: "RATS & FERAL CATS IMPACT",
    overlays: [
      { label: "⚠  NOCTURNAL THREAT ACTIVE", text: "Rats and feral cats strike silently under cover of night.", top: "8%", left: "2%" },
      { label: "⚠  EGGS UNDER ATTACK", text: "Entire clutches can be lost in a single night.", top: "76%", left: "2%" },
    ],
    ecoImpact: [
      { icon: "🪺", label: "Nesting Success",      dir: "down", pct: 50 },
      { icon: "🐣", label: "Chick Survival",       dir: "down", pct: 58 },
      { icon: "🦤", label: "Population Stability", dir: "down", pct: 36 },
      { icon: "🌿", label: "Habitat Stress",        dir: "up",   pct: 25 },
    ],
    actions: ["Report feral cat colonies to authorities", "Never abandon domestic animals in the wild", "Support trap-neuter-remove programs"],
    metrics: { habitat: 62, nesting: 40, water: 78, food: 55, population: 42 },
    banner: "Rats and feral cats are major threats to Hawaiian Coot nests. Their presence can drastically reduce egg and chick survival.",
  },
  {
    id: "dogs", num: 3, name: "Dogs", threat: "MEDIUM", color: "#ff8c00",
    sideIcon: "🐕",
    sideDesc: "Domestic and feral dogs disturb and attack nesting birds in wetland areas.",
    image: dogsImg as string,
    imgFilter: "none",
    headline: "DOGS IMPACT",
    overlays: [
      { label: "⚠  NESTING DISTURBANCE", text: "Dogs flush incubating birds and trample vegetation.", top: "10%", left: "3%" },
      { label: "⚠  NEST AT RISK", text: "Disturbance causes nest abandonment.", top: "62%", left: "40%" },
    ],
    ecoImpact: [
      { icon: "🪺", label: "Nesting Success",      dir: "down", pct: 35 },
      { icon: "🐣", label: "Chick Survival",       dir: "down", pct: 28 },
      { icon: "🦤", label: "Population Stability", dir: "down", pct: 28 },
      { icon: "🌿", label: "Habitat Stress",        dir: "up",   pct: 22 },
    ],
    actions: ["Always leash dogs near wildlife refuges", "Report loose dogs near wetlands", "Respect wildlife buffer zones"],
    metrics: { habitat: 68, nesting: 45, water: 70, food: 60, population: 50 },
    banner: "Dogs may not prey directly on eggs, but they disturb nests, increase stress, and reduce nesting success significantly.",
  },
  {
    id: "frogs", num: 4, name: "Bullfrogs", threat: "MEDIUM", color: "#ff8c00",
    sideIcon: "🐸",
    sideDesc: "Invasive bullfrogs compete for food and may take small coot chicks.",
    image: frogsImg as string,
    imgFilter: "none",
    headline: "BULLFROGS IMPACT",
    overlays: [
      { label: "⚠  FOOD CHAIN IMBALANCE", text: "Bullfrogs consume large amounts of insects and invertebrates.", top: "10%", left: "3%" },
      { label: "⚠  CHICK VULNERABLE", text: "Young coots near water face direct predation risk.", top: "8%", left: "52%" },
    ],
    ecoImpact: [
      { icon: "🐟", label: "Food Availability",    dir: "down", pct: 47 },
      { icon: "🪺", label: "Nesting Success",      dir: "down", pct: 38 },
      { icon: "🦤", label: "Population Stability", dir: "down", pct: 52 },
      { icon: "💧", label: "Water Quality",        dir: "down", pct: 28 },
    ],
    actions: ["Never release pet frogs or fish", "Support wetland water quality programs", "Report bullfrog sightings to wildlife agencies"],
    metrics: { habitat: 64, nesting: 42, water: 60, food: 35, population: 38 },
    banner: "Invasive bullfrogs outcompete native species for food and may prey on small chicks, threatening long-term population stability.",
  },
  {
    id: "nightheron", num: 5, name: "Night Heron", threat: "LOW", color: "#f5c842",
    sideIcon: "🌙",
    sideDesc: "The Black-crowned Night Heron is a natural predator that occasionally preys on coot eggs and chicks.",
    image: nightHeronImg as string,
    imgFilter: "none",
    headline: "NIGHT HERON — NATURAL PREDATION",
    overlays: [
      { label: "🌙  NATURAL BEHAVIOR", text: "Night Herons evolved alongside the Hawaiian Coot — this is ecological balance, not crisis.", top: "3%", right: "2%" },
      { label: "✦  NATIVE PREDATOR", text: "Unlike invasive species, the Night Heron is part of Hawaii's natural ecosystem.", top: "74%", right: "2%" },
    ],
    ecoImpact: [
      { icon: "🪺", label: "Nesting Success",      dir: "down", pct: 8 },
      { icon: "🐣", label: "Chick Survival",       dir: "down", pct: 10 },
      { icon: "🦤", label: "Population Stability", dir: "down", pct: 5 },
      { icon: "🌿", label: "Ecosystem Balance",    dir: "up",   pct: 15 },
    ],
    actions: ["Observe from a safe distance", "Protect nesting zones with signage", "Appreciate natural ecological balance"],
    metrics: { habitat: 80, nesting: 72, water: 85, food: 78, population: 74 },
    banner: "The Night Heron is a native species. Its presence represents a healthy, balanced ecosystem — not a crisis.",
  },
];

const THREAT_COLORS: Record<ThreatLevel, string> = { HIGH: "#ff3344", MEDIUM: "#ff8c00", LOW: "#f5c842" };

const DASH_KEYS: { key: keyof Metrics; label: string; icon: string; barColor: string }[] = [
  { key: "habitat",    label: "Habitat Health",      icon: "🌱", barColor: "#4caf50" },
  { key: "nesting",    label: "Nesting Success",     icon: "🪺", barColor: "#ff6b6b" },
  { key: "water",      label: "Water Quality",       icon: "💧", barColor: "#42a5f5" },
  { key: "food",       label: "Food Availability",   icon: "🐟", barColor: "#ffa726" },
  { key: "population", label: "Population Stability",icon: "🦤", barColor: "#ab47bc" },
];

// ── Animated metric bar ───────────────────────────────────────────────────────
function DashBar({ value, label, icon, barColor }: { value: number; label: string; icon: string; barColor: string }) {
  const [display, setDisplay] = useState(Math.round(value));
  const sp = useSpring(value, { stiffness: 55, damping: 18 });
  useEffect(() => {
    sp.set(value);
    const unsub = sp.on("change", v => setDisplay(Math.round(v)));
    return unsub;
  }, [value, sp]);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
        <span style={{ fontSize: 15 }}>{icon}</span>
        <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.75)", letterSpacing: "0.04em" }}>{label}</span>
      </div>
      <div style={{ height: 8, background: "rgba(255,255,255,0.08)", borderRadius: 4, overflow: "visible", position: "relative" }}>
        <motion.div
          animate={{ width: `${value}%`, backgroundColor: barColor }}
          transition={{ type: "spring", stiffness: 55, damping: 18 }}
          style={{ height: "100%", borderRadius: 4, position: "absolute", top: 0, left: 0, boxShadow: `0 0 8px ${barColor}88` }}
        />
      </div>
      <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 14, fontWeight: 800, color: barColor, display: "block", marginTop: 3 }}>
        {display}%
      </span>
    </div>
  );
}

// ── Threat gauge (SVG semicircle) ─────────────────────────────────────────────
function ThreatGauge({ threat, color }: { threat: ThreatLevel; color: string }) {
  const angles: Record<ThreatLevel, number> = { LOW: 160, MEDIUM: 95, HIGH: 18 };
  const deg = angles[threat];
  const rad = (deg * Math.PI) / 180;
  const cx = 58, cy = 58, r = 44;
  const nx = cx + r * 0.8 * Math.cos(Math.PI - rad + Math.PI);
  const ny = cy - r * 0.8 * Math.sin(Math.PI - rad + Math.PI);

  // Re-derive: needle points from pivot outward
  // Standard math: angle 0=right, grows counter-clockwise
  // deg=160 → almost pointing left (LOW=stable)
  // deg=95  → pointing up-left (MEDIUM)
  // deg=18  → pointing right (HIGH)
  const rad2 = (deg * Math.PI) / 180;
  const px = cx + 38 * Math.cos(rad2);
  const py = cy - 38 * Math.sin(rad2);

  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 11, letterSpacing: "0.15em", color: "rgba(255,255,255,0.5)", marginBottom: 2 }}>OVERALL THREAT LEVEL</p>
      <svg width="116" height="68" viewBox="0 0 116 68" style={{ display: "block", margin: "0 auto" }}>
        <defs>
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#33ee88" />
            <stop offset="45%"  stopColor="#ffbb22" />
            <stop offset="100%" stopColor="#ff3344" />
          </linearGradient>
        </defs>
        <path d="M 10 58 A 48 48 0 0 1 106 58" fill="none" stroke="url(#gaugeGrad)" strokeWidth="10" strokeLinecap="round" opacity="0.25" />
        <path d="M 10 58 A 48 48 0 0 1 106 58" fill="none" stroke="url(#gaugeGrad)" strokeWidth="4"  strokeLinecap="round" opacity="0.7"  />
        {/* Needle */}
        <line x1={cx} y1={cy} x2={px} y2={py} stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r="4.5" fill={color} />
        <circle cx={cx} cy={cy} r="2"   fill="#000" />
      </svg>
      <motion.p
        animate={{ color }}
        style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 17, fontWeight: 900, letterSpacing: "0.14em", marginTop: -4 }}
      >
        {threat}
      </motion.p>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export function Predators() {
  const [selId, setSelId] = useState("healthy");
  const [view,  setView]  = useState<"impact"|"info">("impact");

  const p = PREDATORS.find(x => x.id === selId) ?? PREDATORS[0];
  const tc = THREAT_COLORS[p.threat];

  // When predator changes, reset to impact view
  function select(id: string) { setSelId(id); setView("impact"); }

  return (
    <div style={{
      height: "100vh", display: "flex", flexDirection: "column",
      background: BG, overflow: "hidden",
      fontFamily: "'Josefin Sans', sans-serif",
    }}>

      {/* ── 1. PAGE HEADER ────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
        style={{
          flexShrink: 0, paddingTop: 80, paddingBottom: 14,
          borderBottom: `1px solid rgba(212,175,55,0.22)`,
          textAlign: "center",
        }}
      >
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.8rem", color: GOLD, letterSpacing: "0.04em", lineHeight: 1.1 }}>
          Predators &amp; Invasive Threats
        </h1>
        <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 15, color: "rgba(212,175,55,0.88)", marginTop: 6 }}>
          The Hawaiian Coot evolved without terrestrial predators — the introduction of invasive species has had devastating effects.
        </p>
      </motion.div>

      {/* ── 2. MAIN BODY ──────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>

        {/* ── 2a. LEFT SIDEBAR — predator cards ───────────────────────── */}
        <div style={{
          width: 280, flexShrink: 0,
          display: "flex", flexDirection: "column",
          background: "rgba(0,0,0,0.5)",
          borderRight: "1px solid rgba(255,255,255,0.07)",
          overflowY: "auto",
        }}>
          {PREDATORS.map(pred => {
            const isSel = pred.id === selId;
            const pc    = THREAT_COLORS[pred.threat];
            return (
              <motion.button
                key={pred.id}
                onClick={() => select(pred.id)}
                onHoverStart={() => !isSel && select(pred.id)}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: "100%", textAlign: "left", cursor: "pointer",
                  background: isSel ? `${pc}18` : "transparent",
                  border: "none",
                  borderLeft: `3px solid ${isSel ? pc : "transparent"}`,
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  padding: "12px 14px",
                  transition: "background 0.25s, border-color 0.25s",
                }}
              >
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  {/* Number circle */}
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                    background: isSel ? `${pc}33` : "rgba(255,255,255,0.07)",
                    border: `1.5px solid ${isSel ? pc : "rgba(255,255,255,0.12)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "background 0.25s, border-color 0.25s",
                  }}>
                    <span style={{ fontSize: 13.5, fontWeight: 900, color: isSel ? pc : "rgba(255,255,255,0.55)" }}>
                      {pred.num}
                    </span>
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Name + threat badge */}
                    <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap", marginBottom: 6 }}>
                      <span style={{ fontSize: 22, lineHeight: 1 }}>{pred.sideIcon}</span>
                      <span style={{ fontSize: 15.5, fontWeight: 800, color: isSel ? "#fff" : "rgba(255,255,255,0.78)", letterSpacing: "0.04em" }}>
                        {pred.name}
                      </span>
                      <span style={{
                        fontSize: 10.5, fontWeight: 800, letterSpacing: "0.1em",
                        background: `${pc}28`, color: pc,
                        border: `1px solid ${pc}88`,
                        borderRadius: 4, padding: "2px 7px",
                      }}>
                        {pred.threat === "LOW" ? "LOW THREAT" : pred.threat === "MEDIUM" ? "MEDIUM THREAT" : "HIGH THREAT"}
                      </span>
                    </div>
                    <p style={{ fontSize: 13, lineHeight: 1.5, color: "rgba(255,255,255,0.52)" }}>
                      {pred.sideDesc}
                    </p>
                  </div>

                  {/* Arrow */}
                  <span style={{ fontSize: 16, color: isSel ? pc : "rgba(255,255,255,0.2)", flexShrink: 0, marginTop: 4 }}>→</span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* ── 2b. RIGHT MAIN ──────────────────────────────────────────── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

          {/* Title bar with IMPACT VIEW / INFO toggle */}
          <div style={{
            flexShrink: 0, padding: "8px 16px",
            background: "rgba(0,0,0,0.7)",
            borderBottom: `1px solid ${tc}44`,
            display: "flex", alignItems: "center",
            position: "relative",
            transition: "border-color 0.4s",
          }}>
            {/* Centered headline */}
            <AnimatePresence mode="wait">
              <motion.div
                key={p.id + "-headline"}
                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{
                  position: "absolute", left: 0, right: 0,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  pointerEvents: "none",
                }}
              >
                <span style={{ fontSize: 14, opacity: 0.9 }}>⚠</span>
                <span style={{ fontSize: 14, fontWeight: 900, letterSpacing: "0.1em", color: tc }}>
                  {p.headline}
                </span>
              </motion.div>
            </AnimatePresence>
            {/* Toggle buttons — stay right */}
            <div style={{ display: "flex", gap: 6, marginLeft: "auto" }}>
              {(["impact","info"] as const).map(v => (
                <button key={v} onClick={() => setView(v)} style={{
                  fontFamily: "'Josefin Sans', sans-serif",
                  fontSize: 10, fontWeight: 800, letterSpacing: "0.1em",
                  padding: "4px 12px", borderRadius: 5, cursor: "pointer",
                  background: view === v ? tc : "transparent",
                  color: view === v ? "#000" : "rgba(255,255,255,0.5)",
                  border: `1px solid ${view === v ? tc : "rgba(255,255,255,0.15)"}`,
                  transition: "background 0.2s, color 0.2s, border-color 0.2s",
                }}>
                  {v === "impact" ? "📊  IMPACT VIEW" : "ℹ  INFO"}
                </button>
              ))}
            </div>
          </div>

          {/* Content row: image + right panel */}
          <div style={{ flex: "0 1 46vh", display: "flex", minHeight: 0, maxHeight: "46vh" }}>

            {/* CINEMATIC IMAGE PANEL */}
            <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
              <AnimatePresence mode="sync">
                <motion.img
                  key={p.id + "-img"}
                  src={p.image}
                  alt={p.name}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  style={{
                    position: "absolute", inset: 0, width: "100%", height: "100%",
                    objectFit: "cover", objectPosition: "center",
                    filter: p.imgFilter,
                  }}
                />
              </AnimatePresence>

              {/* Threat overlay tint */}
              <motion.div
                animate={{ background: `${tc}18` }}
                transition={{ duration: 0.6 }}
                style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
              />

              {/* Edge vignette */}
              <div style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                boxShadow: "inset 0 0 60px rgba(0,0,0,0.65)",
              }} />

              {/* Scan lines for HIGH */}
              <AnimatePresence>
                {p.threat === "HIGH" && (
                  <motion.div
                    key="scan" initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.14, 0] }} exit={{ opacity: 0 }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                      position: "absolute", inset: 0, pointerEvents: "none",
                      background: "repeating-linear-gradient(0deg, rgba(255,30,30,0.06) 0px, transparent 2px, transparent 8px)",
                    }}
                  />
                )}
              </AnimatePresence>

              {/* Overlays */}
              <AnimatePresence>
                {view === "impact" && p.overlays.map((ov, i) => (
                  <motion.div
                    key={p.id + "-ov-" + i}
                    initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.12, duration: 0.35 }}
                    style={{
                      position: "absolute", top: ov.top, left: ov.left, right: ov.right,
                      background: `rgba(0,0,0,0.88)`,
                      border: `2.5px solid ${tc}`,
                      borderLeft: `5px solid ${tc}`,
                      borderRadius: 10, padding: "14px 18px", maxWidth: 280,
                      boxShadow: `0 0 8px ${tc}28, 0 2px 10px rgba(0,0,0,0.55)`,
                    }}
                  >
                    <p style={{ fontSize: 14, fontWeight: 900, letterSpacing: "0.1em", color: tc, marginBottom: 7, lineHeight: 1.2 }}>{ov.label}</p>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.88)", lineHeight: 1.6, fontWeight: 500 }}>{ov.text}</p>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* INFO view overlay */}
              <AnimatePresence>
                {view === "info" && (
                  <motion.div
                    key="info-overlay"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    style={{
                      position: "absolute", inset: 0,
                      background: "linear-gradient(to top, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.3) 100%)",
                      display: "flex", alignItems: "flex-end", padding: 20,
                    }}
                  >
                    <div>
                      <p style={{ fontSize: 10, letterSpacing: "0.16em", color: tc, marginBottom: 8, fontWeight: 800 }}>ABOUT THIS THREAT</p>
                      <p style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(255,255,255,0.88)", maxWidth: 400 }}>
                        {p.sideDesc}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* RIGHT INFO PANEL */}
            <div style={{
              width: 214, flexShrink: 0,
              background: "rgba(0,0,0,0.7)",
              borderLeft: "1px solid rgba(255,255,255,0.07)",
              display: "flex", flexDirection: "column",
              overflowY: "auto",
            }}>
              {/* ECOLOGICAL IMPACT */}
              <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <p style={{ fontSize: 11.5, letterSpacing: "0.16em", color: "rgba(255,255,255,0.55)", marginBottom: 12, fontWeight: 700 }}>
                  ECOLOGICAL IMPACT
                </p>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={p.id + "-eco"}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    style={{ display: "flex", flexDirection: "column", gap: 11 }}
                  >
                    {p.ecoImpact.map((row, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                        <span style={{ fontSize: 16, flexShrink: 0 }}>{row.icon}</span>
                        <span style={{ fontSize: 13.5, color: "rgba(255,255,255,0.82)", flex: 1, lineHeight: 1.3 }}>{row.label}</span>
                        <span style={{
                          fontSize: 13, fontWeight: 900,
                          color: row.dir === "up" ? "#ff6644" : "#ff3344",
                          flexShrink: 0,
                        }}>
                          {row.dir === "down" ? "↓" : "↑"} -{row.pct}%
                        </span>
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* WHAT YOU CAN DO */}
              <div style={{ padding: "14px 16px", flex: 1 }}>
                <p style={{ fontSize: 11.5, letterSpacing: "0.16em", color: "rgba(255,255,255,0.55)", marginBottom: 12, fontWeight: 700 }}>
                  WHAT YOU CAN DO
                </p>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={p.id + "-act"}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    style={{ display: "flex", flexDirection: "column", gap: 11 }}
                  >
                    {p.actions.map((act, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 9 }}>
                        <div style={{
                          width: 20, height: 20, borderRadius: 4, flexShrink: 0, marginTop: 1,
                          background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <span style={{ fontSize: 10 }}>✓</span>
                        </div>
                        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.72)", lineHeight: 1.5 }}>{act}</span>
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

          </div>{/* end content row */}

          {/* ── ECOSYSTEM HEALTH OVERVIEW — below image ────────────────── */}
          <div style={{
            flexShrink: 0,
            background: "rgba(0,0,0,0.85)",
            borderTop: "1px solid rgba(255,255,255,0.07)",
            padding: "12px 20px",
            paddingRight: 64,
            display: "flex", alignItems: "center", gap: 16,
          }}>
            <p style={{ fontSize: 11.5, letterSpacing: "0.16em", color: GOLD, fontWeight: 800, flexShrink: 0, textShadow: `0 0 8px ${GOLD}` }}>
              ECOSYSTEM HEALTH OVERVIEW
            </p>
            <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "0 16px" }}>
              {DASH_KEYS.map(({ key, label, icon, barColor }) => (
                <DashBar key={key + p.id} value={p.metrics[key]} label={label} icon={icon} barColor={barColor} />
              ))}
            </div>
            <div style={{ flexShrink: 0 }}>
              <AnimatePresence mode="wait">
                <motion.div key={p.id + "-gauge"} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <ThreatGauge threat={p.threat} color={tc} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>{/* end right main */}
      </div>{/* end main body */}

      {/* ── 3. BOTTOM ROW — SEE THE DIFFERENCE ───────────────────────── */}
      <div style={{
        flexShrink: 0,
        borderTop: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(0,0,0,0.7)",
        padding: "8px 16px",
        display: "flex", flexDirection: "column", alignItems: "center",
      }}>
        <p style={{ fontSize: 9, letterSpacing: "0.2em", color: "rgba(255,255,255,0.35)", marginBottom: 8, textAlign: "center" }}>
          SEE THE DIFFERENCE
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          {PREDATORS.map(pred => {
            const isSel = pred.id === selId;
            const pc    = THREAT_COLORS[pred.threat];
            return (
              <motion.button
                key={pred.id}
                onClick={() => select(pred.id)}
                whileTap={{ scale: 0.96 }}
                style={{
                  padding: 0, cursor: "pointer",
                  background: "none", border: "none",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                }}
              >
                <div style={{
                  width: 82, height: 48, borderRadius: 6, overflow: "hidden",
                  border: `2px solid ${isSel ? pc : "rgba(255,255,255,0.1)"}`,
                  boxShadow: isSel ? `0 0 12px ${pc}66` : "none",
                  transition: "border-color 0.25s, box-shadow 0.25s",
                  position: "relative",
                }}>
                  <img
                    src={pred.image} alt={pred.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover", filter: pred.imgFilter }}
                  />
                  {isSel && (
                    <div style={{ position: "absolute", inset: 0, background: `${pc}28` }} />
                  )}
                </div>
                <span style={{
                  fontFamily: "'Josefin Sans', sans-serif",
                  fontSize: 8.5, letterSpacing: "0.06em", fontWeight: 700,
                  color: isSel ? pc : "rgba(255,255,255,0.45)",
                  textAlign: "center", maxWidth: 82,
                  transition: "color 0.25s",
                }}>
                  {pred.name}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ── 5. FOOTER BANNER ──────────────────────────────────────────── */}
      <div style={{
        flexShrink: 0,
        background: "rgba(0,0,0,0.92)",
        borderTop: `1px solid ${tc}55`,
        padding: "8px 20px",
        display: "flex", alignItems: "center", gap: 10,
        transition: "border-color 0.4s",
      }}>
        <span style={{ fontSize: 15 }}>🌿</span>
        <AnimatePresence mode="wait">
          <motion.p
            key={p.id + "-banner"}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{ fontSize: 11.5, color: "rgba(255,255,255,0.75)", lineHeight: 1.4 }}
          >
            {p.banner.split("Your actions").length > 1 ? (
              <>
                {p.banner.split("Your actions")[0]}
                <strong style={{ color: "#fff" }}>Your actions{p.banner.split("Your actions")[1]}</strong>
              </>
            ) : p.banner}
          </motion.p>
        </AnimatePresence>
      </div>

    </div>
  );
}
