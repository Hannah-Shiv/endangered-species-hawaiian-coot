import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

import cootBirdImg       from "@assets/image_1779846181334.png";
import lobedFeetImg      from "@assets/image_1779846190761.png";
import frontalShieldImg  from "@assets/image_1779846195414.png";
import plumageImg        from "@assets/image_1779846200254.png";
import nestDefenseImg    from "@assets/image_1779846204806.png";
import floatingNestImg   from "@assets/image_1779846210272.png";
import calmMorningImg    from "@assets/image_1779846221350.png";
import rainySeasonImg    from "@assets/image_1779846225398.png";
import risingWatersImg   from "@assets/image_1779846229721.png";
import predatorThreatImg from "@assets/image_1779846233298.png";
import nestingTimeImg    from "@assets/image_1779846238254.png";

const TEAL = "#00cc88";
const BG   = "#03100a";

type StatKey = "mobility" | "protection" | "predatorResistance" | "nestSuccess" | "overall";
type Stats   = Record<StatKey, number>;

type Adaptation = {
  id:       string;
  name:     string;
  type:     "PHYSICAL" | "BEHAVIORAL";
  icon:     string;
  color:    string;
  cx:       number;
  cy:       number;
  image:    string;
  headline: string;
  desc:     string;
  benefits: string[];
  stats:    Stats;
  envTint:  string;
};

const DEFAULT_STATS: Stats = {
  mobility: 85, protection: 78, predatorResistance: 72, nestSuccess: 90, overall: 82,
};

const STAT_LABELS: Array<{ key: StatKey; label: string }> = [
  { key: "mobility",           label: "MOBILITY"            },
  { key: "protection",         label: "PROTECTION"          },
  { key: "predatorResistance", label: "PREDATOR RESISTANCE" },
  { key: "nestSuccess",        label: "NEST SUCCESS"        },
  { key: "overall",            label: "OVERALL SURVIVAL"    },
];

const ADAPTATIONS: Adaptation[] = [
  {
    id: "lobed-feet", name: "Lobed Feet", type: "PHYSICAL", icon: "🦆", color: "#00e88a",
    cx: 18, cy: 44,
    image: lobedFeetImg as string,
    headline: "Walking on Water",
    desc: "Unique lobed toes act as paddles for swimming AND spread weight for walking on floating vegetation.",
    benefits: ["Efficient swimming", "Walks on floating plants", "Better balance", "Energy conservation"],
    stats: { mobility: 96, protection: 55, predatorResistance: 60, nestSuccess: 75, overall: 78 },
    envTint: "rgba(0,130,80,0.18)",
  },
  {
    id: "frontal-shield", name: "White Frontal Shield", type: "PHYSICAL", icon: "🛡️", color: "#00d4ff",
    cx: 50, cy: 6,
    image: frontalShieldImg as string,
    headline: "Social Signaling",
    desc: "Highly visible white plate used for communication, mate selection, and territorial signaling; unique among Hawaiian birds.",
    benefits: ["Mate attraction", "Territorial display", "Flock coordination", "Status signaling"],
    stats: { mobility: 70, protection: 88, predatorResistance: 65, nestSuccess: 88, overall: 80 },
    envTint: "rgba(0,140,200,0.18)",
  },
  {
    id: "plumage", name: "Dense Waterproof Plumage", type: "PHYSICAL", icon: "🪶", color: "#90c8e8",
    cx: 82, cy: 44,
    image: plumageImg as string,
    headline: "Storm Survival",
    desc: "Oil gland preening keeps feathers water-repellent, enabling all-weather survival even in heavy storms.",
    benefits: ["Stays dry in heavy rain", "Thermal insulation", "Brief diving ability", "All-weather survival"],
    stats: { mobility: 75, protection: 92, predatorResistance: 72, nestSuccess: 72, overall: 85 },
    envTint: "rgba(10,20,50,0.40)",
  },
  {
    id: "nest-defense", name: "Aggressive Nest Defense", type: "BEHAVIORAL", icon: "⚔️", color: "#ff5533",
    cx: 27, cy: 82,
    image: nestDefenseImg as string,
    headline: "Fearless Guardian",
    desc: "Attacks intruders far larger than itself — documented confronting dogs, herons, and even humans near nests.",
    benefits: ["Deters all predators", "Protects eggs & chicks", "Territory control", "Intimidation displays"],
    stats: { mobility: 65, protection: 70, predatorResistance: 90, nestSuccess: 93, overall: 82 },
    envTint: "rgba(120,0,0,0.22)",
  },
  {
    id: "floating-nest", name: "Floating Nest Building", type: "BEHAVIORAL", icon: "🪹", color: "#d4af37",
    cx: 73, cy: 82,
    image: floatingNestImg as string,
    headline: "Nature's Float",
    desc: "Builds floating reed platforms that rise with water levels, protecting eggs from flooding and ground predators.",
    benefits: ["Flood resistant", "Safe from ground threats", "Temperature regulated", "Reusable structure"],
    stats: { mobility: 60, protection: 78, predatorResistance: 84, nestSuccess: 96, overall: 80 },
    envTint: "rgba(120,80,0,0.22)",
  },
];

const SCENES = [
  { name: "Calm Morning",    img: calmMorningImg    as string },
  { name: "Rainy Season",    img: rainySeasonImg    as string },
  { name: "Rising Waters",   img: risingWatersImg   as string },
  { name: "Predator Threat", img: predatorThreatImg as string },
  { name: "Nesting Time",    img: nestingTimeImg    as string },
];

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 9.5, letterSpacing: "0.1em", color: "rgba(255,255,255,0.5)", fontWeight: 700 }}>
          {label}
        </span>
        <span style={{ fontSize: 11, color, fontWeight: 800 }}>{value}%</span>
      </div>
      <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
        <motion.div
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{
            height: "100%", borderRadius: 2,
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            boxShadow: `0 0 6px ${color}66`,
          }}
        />
      </div>
    </div>
  );
}

export function Adaptations() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId,  setHoveredId]  = useState<string | null>(null);
  const [sceneIdx,   setSceneIdx]   = useState(0);

  const selected   = ADAPTATIONS.find(a => a.id === selectedId) ?? null;
  const stats      = selected?.stats ?? DEFAULT_STATS;
  const statColor  = selected?.color ?? TEAL;
  const envTint    = selected?.envTint ?? "rgba(0,80,40,0.10)";

  return (
    <div style={{
      position: "relative",
      height: "100%",
      background: BG,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      fontFamily: "'Josefin Sans', sans-serif",
    }}>

      {/* Scene background */}
      <AnimatePresence>
        <motion.img
          key={sceneIdx}
          src={SCENES[sceneIdx].img}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.14 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4 }}
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover",
            filter: "blur(3px)",
            zIndex: 0,
          }}
        />
      </AnimatePresence>

      {/* Environment tint */}
      <motion.div
        animate={{ background: envTint }}
        transition={{ duration: 0.8 }}
        style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1 }}
      />

      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <div style={{
        position: "relative", zIndex: 2, flexShrink: 0,
        padding: "13px 24px 11px",
        borderBottom: "1px solid rgba(0,200,120,0.12)",
        background: "rgba(3,16,10,0.85)",
        display: "flex", alignItems: "center", gap: 14,
      }}>
        <div>
          <h1 style={{ fontSize: 25, fontWeight: 800, color: "white", margin: 0, letterSpacing: "-0.02em" }}>
            Endemic Adaptations
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.42)", margin: "3px 0 0", letterSpacing: "0.02em" }}>
            Discover how the Hawaiian Coot survives and thrives in Hawai'i's diverse wetlands.
          </p>
        </div>
      </div>

      {/* ── MAIN BODY ─────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative", zIndex: 2, minHeight: 0 }}>

        {/* LEFT SIDEBAR — Adaptation Library */}
        <div style={{
          width: 232, flexShrink: 0,
          borderRight: "1px solid rgba(0,200,120,0.1)",
          background: "rgba(3,12,8,0.90)",
          padding: "14px 12px",
          display: "flex", flexDirection: "column", gap: 4,
          overflowY: "auto",
        }}>
          <p style={{ fontSize: 10, letterSpacing: "0.18em", color: TEAL, fontWeight: 800, margin: "0 0 2px" }}>
            ADAPTATION LIBRARY
          </p>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.32)", margin: "0 0 10px" }}>
            Click a trait to explore
          </p>

          {ADAPTATIONS.map(ad => {
            const isActive = selectedId === ad.id;
            return (
              <motion.div
                key={ad.id}
                onClick={() => setSelectedId(isActive ? null : ad.id)}
                whileHover={{ x: 3 }}
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  cursor: "pointer",
                  background: isActive ? `${ad.color}18` : "rgba(255,255,255,0.02)",
                  border: `1px solid ${isActive ? ad.color + "55" : "rgba(255,255,255,0.06)"}`,
                  transition: "background 0.25s, border-color 0.25s",
                  marginBottom: 3,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 20 }}>{ad.icon}</span>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: isActive ? ad.color : "rgba(255,255,255,0.88)", margin: 0 }}>
                      {ad.name}
                    </p>
                    <p style={{ fontSize: 10, color: "rgba(255,255,255,0.32)", margin: "2px 0 0", letterSpacing: "0.1em" }}>
                      {ad.type}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}

          <div style={{
            marginTop: "auto",
            padding: 11,
            borderRadius: 8,
            background: "rgba(0,200,120,0.06)",
            border: "1px solid rgba(0,200,120,0.13)",
          }}>
            <p style={{ fontSize: 11, color: "rgba(0,200,120,0.7)", lineHeight: 1.55, margin: 0 }}>
              Each adaptation plays a vital role in survival. Click any trait to see how!
            </p>
          </div>
        </div>

        {/* CENTER — Bird + Nodes + Detail Panel */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>

          {/* SVG connecting lines */}
          <svg
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              overflow: "visible", zIndex: 1,
              pointerEvents: "none",
            }}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {ADAPTATIONS.map((ad, i) => {
              const isActive  = selectedId === ad.id;
              const isHovered = hoveredId === ad.id;
              return (
                <motion.line
                  key={ad.id}
                  x1="50" y1="46"
                  x2={ad.cx} y2={ad.cy}
                  stroke={ad.color}
                  strokeWidth={isActive ? "0.55" : "0.28"}
                  pathLength={1}
                  strokeDasharray="1"
                  initial={{ strokeDashoffset: 1, strokeOpacity: 0 }}
                  animate={{
                    strokeDashoffset: 0,
                    strokeOpacity: isActive ? 0.9 : isHovered ? 0.65 : 0.32,
                  }}
                  transition={{ duration: 1.3, delay: i * 0.14, ease: "easeOut" }}
                  style={{ filter: isActive ? `drop-shadow(0 0 2px ${ad.color})` : "none" }}
                />
              );
            })}
          </svg>

          {/* Hawaiian Coot — breathing centerpiece */}
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 2, pointerEvents: "none",
          }}>
            <motion.img
              src={cootBirdImg as string}
              alt="Hawaiian Coot"
              animate={{ scale: [1, 1.014, 1], y: [0, -4, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              style={{
                width: "60%",
                maxWidth: 460,
                objectFit: "contain",
                filter: `drop-shadow(0 0 40px rgba(0,200,120,0.18)) drop-shadow(0 8px 30px rgba(0,0,0,0.9))`,
              }}
            />
          </div>

          {/* Adaptation Nodes */}
          {ADAPTATIONS.map((ad, i) => {
            const isActive  = selectedId === ad.id;
            const isHovered = hoveredId === ad.id;
            return (
              <motion.div
                key={ad.id}
                style={{
                  position: "absolute",
                  left: `${ad.cx}%`,
                  top: `${ad.cy}%`,
                  transform: "translate(-50%, -50%)",
                  zIndex: 10,
                  cursor: "pointer",
                }}
                animate={{ scale: isActive ? 1.18 : 1 }}
                whileHover={{ scale: isActive ? 1.22 : 1.1 }}
                onClick={() => setSelectedId(isActive ? null : ad.id)}
                onHoverStart={() => setHoveredId(ad.id)}
                onHoverEnd={() => setHoveredId(null)}
              >
                {/* Pulsing outer ring */}
                <motion.div
                  animate={{ scale: [1, 1.65, 1], opacity: [0.55, 0, 0.55] }}
                  transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.42, ease: "easeInOut" }}
                  style={{
                    position: "absolute",
                    inset: -7,
                    borderRadius: "50%",
                    border: `1.5px solid ${ad.color}`,
                    pointerEvents: "none",
                  }}
                />
                {/* Node circle */}
                <div style={{
                  width:   isActive ? 74 : 62,
                  height:  isActive ? 74 : 62,
                  borderRadius: "50%",
                  background: isActive ? `${ad.color}22` : "rgba(3,16,10,0.88)",
                  border: `2px solid ${isActive ? ad.color : ad.color + "88"}`,
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", gap: 2,
                  padding: 6,
                  boxShadow: isActive
                    ? `0 0 24px ${ad.color}66, 0 0 8px ${ad.color}33 inset`
                    : `0 0 10px ${ad.color}22`,
                  backdropFilter: "blur(10px)",
                  transition: "all 0.25s ease",
                }}>
                  <span style={{ fontSize: 17 }}>{ad.icon}</span>
                  <p style={{
                    fontSize: 7.5,
                    fontWeight: 800,
                    color: isActive ? ad.color : "rgba(255,255,255,0.7)",
                    textAlign: "center",
                    letterSpacing: "0.04em",
                    lineHeight: 1.25,
                    margin: 0,
                    maxWidth: 54,
                  }}>
                    {ad.name}
                  </p>
                </div>
              </motion.div>
            );
          })}

          {/* Detail Panel */}
          <AnimatePresence>
            {selected && (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, x: 32 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 32 }}
                transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: "absolute",
                  right: 14, top: 12,
                  width: 268,
                  background: "rgba(3,14,10,0.97)",
                  border: `1px solid ${selected.color}44`,
                  borderRadius: 12,
                  padding: 18,
                  zIndex: 20,
                  boxShadow: `0 0 32px ${selected.color}22, 0 10px 40px rgba(0,0,0,0.75)`,
                  backdropFilter: "blur(14px)",
                }}
              >
                {/* Header row */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 11 }}>
                  <div>
                    <p style={{ fontSize: 10, letterSpacing: "0.16em", color: selected.color, fontWeight: 800, margin: "0 0 4px" }}>
                      {selected.type} ADAPTATION
                    </p>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: "white", margin: 0, lineHeight: 1.2 }}>
                      {selected.headline}
                    </h3>
                  </div>
                  <motion.div
                    onClick={() => setSelectedId(null)}
                    whileHover={{ scale: 1.1 }}
                    style={{
                      width: 26, height: 26, borderRadius: "50%",
                      border: "1px solid rgba(255,255,255,0.18)",
                      background: "rgba(255,255,255,0.05)",
                      color: "rgba(255,255,255,0.55)",
                      cursor: "pointer",
                      fontSize: 12,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    ✕
                  </motion.div>
                </div>

                {/* Image */}
                <div style={{ borderRadius: 8, overflow: "hidden", marginBottom: 12, height: 108 }}>
                  <img
                    src={selected.image}
                    alt={selected.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>

                {/* Description */}
                <p style={{ fontSize: 12.5, lineHeight: 1.6, color: "rgba(255,255,255,0.74)", margin: "0 0 12px" }}>
                  {selected.desc}
                </p>

                {/* Key Benefits */}
                <p style={{ fontSize: 10, letterSpacing: "0.14em", color: selected.color, fontWeight: 800, margin: "0 0 8px" }}>
                  KEY BENEFITS
                </p>
                {selected.benefits.map((b, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <div style={{
                      width: 17, height: 17, borderRadius: "50%",
                      background: `${selected.color}1a`,
                      border: `1px solid ${selected.color}66`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <span style={{ fontSize: 9, color: selected.color }}>✓</span>
                    </div>
                    <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.72)" }}>{b}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

      {/* ── BOTTOM BAR ────────────────────────────────────────────────────── */}
      <div style={{
        flexShrink: 0,
        borderTop: "1px solid rgba(0,200,120,0.1)",
        background: "rgba(3,12,8,0.93)",
        display: "flex",
        position: "relative", zIndex: 2,
      }}>

        {/* Survival stats */}
        <div style={{ flex: 2, padding: "11px 20px 13px", borderRight: "1px solid rgba(255,255,255,0.05)" }}>
          <p style={{ fontSize: 10, letterSpacing: "0.18em", color: TEAL, fontWeight: 800, margin: "0 0 9px", textAlign: "center" }}>
            SURVIVAL ADVANTAGE
          </p>
          <div style={{ display: "flex", gap: 14 }}>
            <AnimatePresence mode="wait">
              {STAT_LABELS.map(s => (
                <StatBar key={s.key + statColor} label={s.label} value={stats[s.key]} color={statColor} />
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Explore the Wetland carousel */}
        <div style={{ flex: 1.3, padding: "11px 14px 13px", borderRight: "1px solid rgba(255,255,255,0.05)" }}>
          <p style={{ fontSize: 10, letterSpacing: "0.18em", color: TEAL, fontWeight: 800, margin: "0 0 9px", textAlign: "center" }}>
            EXPLORE THE WETLAND
          </p>
          <div style={{ display: "flex", gap: 7, alignItems: "center", justifyContent: "center" }}>
            {SCENES.map((sc, i) => (
              <motion.div
                key={i}
                onClick={() => setSceneIdx(i)}
                whileHover={{ scale: 1.08, y: -2 }}
                style={{ cursor: "pointer", textAlign: "center" }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: "50%", overflow: "hidden",
                  border: `2px solid ${sceneIdx === i ? TEAL : "rgba(255,255,255,0.1)"}`,
                  boxShadow: sceneIdx === i ? `0 0 14px ${TEAL}55` : "none",
                  marginBottom: 4,
                  transition: "border-color 0.25s, box-shadow 0.25s",
                }}>
                  <img src={sc.img} alt={sc.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <p style={{
                  fontSize: 8.5,
                  color: sceneIdx === i ? TEAL : "rgba(255,255,255,0.35)",
                  letterSpacing: "0.06em", fontWeight: 700, margin: 0,
                }}>
                  {sc.name.toUpperCase()}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Ecosystem health */}
        <div style={{
          width: 108, flexShrink: 0,
          padding: "11px 12px 13px",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4,
        }}>
          <p style={{ fontSize: 9, letterSpacing: "0.13em", color: "rgba(255,255,255,0.38)", fontWeight: 700, margin: 0 }}>
            ECOSYSTEM HEALTH
          </p>
          <p style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", margin: 0 }}>Wetland Health</p>
          <div style={{ display: "flex", gap: 2, margin: "2px 0" }}>
            {[...Array(4)].map((_, i) => (
              <span key={i} style={{ fontSize: 13 }}>🌿</span>
            ))}
          </div>
          <p style={{ fontSize: 12, color: TEAL, fontWeight: 800, margin: 0 }}>Healthy</p>
        </div>

      </div>
    </div>
  );
}
