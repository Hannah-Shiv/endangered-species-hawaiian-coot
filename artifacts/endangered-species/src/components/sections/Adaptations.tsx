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
  cx:       number; // % within the bird panel
  cy:       number;
  image:    string;
  headline: string;
  desc:     string;
  benefits: string[];
  stats:    Stats;
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

const PHYSICAL: Adaptation[] = [
  {
    id: "lobed-feet", name: "Lobed Feet", type: "PHYSICAL", icon: "🦆", color: "#00e88a",
    cx: 10, cy: 50,
    image: lobedFeetImg as string,
    headline: "Walking on Water",
    desc: "Unique lobed toes act as paddles for swimming AND spread weight for walking on floating vegetation.",
    benefits: ["Efficient swimming", "Walks on floating plants", "Better balance", "Energy conservation"],
    stats: { mobility: 96, protection: 55, predatorResistance: 60, nestSuccess: 75, overall: 78 },
  },
  {
    id: "frontal-shield", name: "White Frontal Shield", type: "PHYSICAL", icon: "🛡️", color: "#00d4ff",
    cx: 50, cy: 7,
    image: frontalShieldImg as string,
    headline: "Social Signaling",
    desc: "Highly visible white plate used for communication, mate selection, and territorial signaling; unique among Hawaiian birds.",
    benefits: ["Mate attraction", "Territorial display", "Flock coordination", "Status signaling"],
    stats: { mobility: 70, protection: 88, predatorResistance: 65, nestSuccess: 88, overall: 80 },
  },
  {
    id: "plumage", name: "Dense Waterproof Plumage", type: "PHYSICAL", icon: "🪶", color: "#90c8e8",
    cx: 90, cy: 50,
    image: plumageImg as string,
    headline: "Storm Survival",
    desc: "Oil gland preening keeps feathers water-repellent, enabling all-weather survival even in heavy storms.",
    benefits: ["Stays dry in heavy rain", "Thermal insulation", "Brief diving ability", "All-weather survival"],
    stats: { mobility: 75, protection: 92, predatorResistance: 72, nestSuccess: 72, overall: 85 },
  },
];

const BEHAVIORAL: Adaptation[] = [
  {
    id: "nest-defense", name: "Aggressive Nest Defense", type: "BEHAVIORAL", icon: "⚔️", color: "#ff5533",
    cx: 0, cy: 0,
    image: nestDefenseImg as string,
    headline: "Fearless Guardian",
    desc: "Attacks intruders far larger than itself — documented confronting dogs, herons, and even humans near nests.",
    benefits: ["Deters all predators", "Protects eggs & chicks", "Territory control", "Intimidation displays"],
    stats: { mobility: 65, protection: 70, predatorResistance: 90, nestSuccess: 93, overall: 82 },
  },
  {
    id: "floating-nest", name: "Floating Nest Building", type: "BEHAVIORAL", icon: "🪹", color: "#d4af37",
    cx: 0, cy: 0,
    image: floatingNestImg as string,
    headline: "Nature's Float",
    desc: "Builds floating reed platforms that rise with water levels, protecting eggs from flooding and ground predators.",
    benefits: ["Flood resistant", "Safe from ground threats", "Temperature regulated", "Reusable structure"],
    stats: { mobility: 60, protection: 78, predatorResistance: 84, nestSuccess: 96, overall: 80 },
  },
];

const ALL_ADAPTATIONS = [...PHYSICAL, ...BEHAVIORAL];

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
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 9.5, letterSpacing: "0.1em", color: "rgba(255,255,255,0.5)", fontWeight: 700 }}>{label}</span>
        <span style={{ fontSize: 11, color, fontWeight: 800 }}>{value}%</span>
      </div>
      <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
        <motion.div
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ height: "100%", borderRadius: 2, background: `linear-gradient(90deg, ${color}88, ${color})`, boxShadow: `0 0 6px ${color}66` }}
        />
      </div>
    </div>
  );
}

export function Adaptations() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId,  setHoveredId]  = useState<string | null>(null);
  const [sceneIdx,   setSceneIdx]   = useState(0);

  const selected  = ALL_ADAPTATIONS.find(a => a.id === selectedId) ?? null;
  const stats     = selected?.stats ?? DEFAULT_STATS;
  const statColor = selected?.color ?? TEAL;

  const select = (id: string) => setSelectedId(prev => prev === id ? null : id);

  return (
    <div style={{
      position: "relative", height: "100%", background: BG,
      display: "flex", flexDirection: "column", overflow: "hidden",
      fontFamily: "'Josefin Sans', sans-serif",
    }}>

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <div style={{
        flexShrink: 0, zIndex: 2,
        padding: "12px 24px 10px",
        borderBottom: "1px solid rgba(0,200,120,0.12)",
        background: "rgba(3,16,10,0.92)",
        display: "flex", alignItems: "center",
      }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "white", margin: 0, letterSpacing: "-0.02em" }}>
            Endemic Adaptations
          </h1>
          <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.4)", margin: "2px 0 0" }}>
            Discover how the Hawaiian Coot survives and thrives in Hawai'i's diverse wetlands.
          </p>
        </div>
      </div>

      {/* ── MAIN BODY ──────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>

        {/* LEFT SIDEBAR — Adaptation Library */}
        <div style={{
          width: 218, flexShrink: 0,
          borderRight: "1px solid rgba(0,200,120,0.1)",
          background: "rgba(3,12,8,0.92)",
          padding: "14px 11px",
          display: "flex", flexDirection: "column", gap: 3,
          overflowY: "auto",
        }}>
          <p style={{ fontSize: 10, letterSpacing: "0.18em", color: TEAL, fontWeight: 800, margin: "0 0 1px" }}>ADAPTATION LIBRARY</p>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", margin: "0 0 8px" }}>Click a trait to explore</p>

          {ALL_ADAPTATIONS.map(ad => {
            const isActive = selectedId === ad.id;
            return (
              <motion.div
                key={ad.id}
                onClick={() => select(ad.id)}
                whileHover={{ x: 3 }}
                style={{
                  padding: "9px 11px", borderRadius: 8, cursor: "pointer", marginBottom: 2,
                  background: isActive ? `${ad.color}18` : "rgba(255,255,255,0.02)",
                  border: `1px solid ${isActive ? ad.color + "55" : "rgba(255,255,255,0.06)"}`,
                  transition: "background 0.25s, border-color 0.25s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <span style={{ fontSize: 18 }}>{ad.icon}</span>
                  <div>
                    <p style={{ fontSize: 12.5, fontWeight: 700, color: isActive ? ad.color : "rgba(255,255,255,0.88)", margin: 0 }}>
                      {ad.name}
                    </p>
                    <p style={{ fontSize: 9.5, color: "rgba(255,255,255,0.3)", margin: "1px 0 0", letterSpacing: "0.1em" }}>
                      {ad.type}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}

          <div style={{ marginTop: "auto", padding: 10, borderRadius: 8, background: "rgba(0,200,120,0.06)", border: "1px solid rgba(0,200,120,0.13)" }}>
            <p style={{ fontSize: 11, color: "rgba(0,200,120,0.7)", lineHeight: 1.5, margin: 0 }}>
              Each adaptation plays a vital role in survival. Click any trait to see how!
            </p>
          </div>
        </div>

        {/* ── CENTER: 2 halves ─────────────────────────────────────────────── */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>

          {/* LEFT HALF — Scene background image + detail overlay */}
          <div style={{ flex: 1, position: "relative", overflow: "hidden", borderRight: "1px solid rgba(0,200,120,0.1)" }}>

            {/* Scene image */}
            <AnimatePresence>
              <motion.img
                key={sceneIdx}
                src={SCENES[sceneIdx].img}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2 }}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
              />
            </AnimatePresence>

            {/* Permanent dark gradient at bottom for readability */}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0, height: "55%",
              background: "linear-gradient(to top, rgba(3,16,10,0.95) 0%, rgba(3,16,10,0.6) 50%, transparent 100%)",
              pointerEvents: "none",
            }} />

            {/* Scene label (no selection) */}
            <AnimatePresence>
              {!selected && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  style={{ position: "absolute", bottom: 16, left: 18, right: 18 }}
                >
                  <p style={{ fontSize: 9, letterSpacing: "0.18em", color: TEAL, fontWeight: 800, margin: "0 0 4px" }}>
                    CURRENT SCENE
                  </p>
                  <p style={{ fontSize: 16, fontWeight: 800, color: "white", margin: "0 0 4px" }}>
                    {SCENES[sceneIdx].name}
                  </p>
                  <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.5)", margin: 0 }}>
                    Select an adaptation node or card to explore how the Hawaiian Coot survives.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Detail overlay (adaptation selected) */}
            <AnimatePresence>
              {selected && (
                <motion.div
                  key={selected.id + "-detail"}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    position: "absolute", inset: 0,
                    display: "flex", flexDirection: "column",
                  }}
                >
                  {/* Dimmer over scene */}
                  <div style={{ position: "absolute", inset: 0, background: "rgba(3,10,6,0.55)", zIndex: 0 }} />

                  {/* Close button */}
                  <div style={{ position: "absolute", top: 12, right: 12, zIndex: 10 }}>
                    <motion.div
                      onClick={() => setSelectedId(null)}
                      whileHover={{ scale: 1.1 }}
                      style={{
                        width: 28, height: 28, borderRadius: "50%",
                        border: "1px solid rgba(255,255,255,0.2)",
                        background: "rgba(0,0,0,0.5)",
                        color: "rgba(255,255,255,0.6)",
                        cursor: "pointer", fontSize: 13,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >✕</motion.div>
                  </div>

                  {/* Image — upper portion */}
                  <div style={{ flex: 1, position: "relative", overflow: "hidden", minHeight: 0, zIndex: 1 }}>
                    <img
                      src={selected.image}
                      alt={selected.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div style={{
                      position: "absolute", bottom: 0, left: 0, right: 0, height: "50%",
                      background: "linear-gradient(to top, rgba(3,10,6,1) 0%, transparent 100%)",
                    }} />
                    {/* Type + headline over image */}
                    <div style={{ position: "absolute", bottom: 14, left: 16, right: 16 }}>
                      <p style={{ fontSize: 9.5, letterSpacing: "0.18em", color: selected.color, fontWeight: 800, margin: "0 0 3px" }}>
                        {selected.type} ADAPTATION
                      </p>
                      <h3 style={{ fontSize: 20, fontWeight: 800, color: "white", margin: 0, lineHeight: 1.15 }}>
                        {selected.headline}
                      </h3>
                    </div>
                  </div>

                  {/* Text content — lower portion */}
                  <div style={{ flexShrink: 0, padding: "14px 16px 16px", background: "rgba(3,10,6,0.97)", zIndex: 1 }}>
                    <p style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(255,255,255,0.78)", margin: "0 0 12px" }}>
                      {selected.desc}
                    </p>
                    <p style={{ fontSize: 10, letterSpacing: "0.14em", color: selected.color, fontWeight: 800, margin: "0 0 7px" }}>KEY BENEFITS</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 10px" }}>
                      {selected.benefits.map((b, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                          <div style={{
                            width: 15, height: 15, borderRadius: "50%", flexShrink: 0,
                            background: `${selected.color}1a`, border: `1px solid ${selected.color}66`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            <span style={{ fontSize: 8, color: selected.color }}>✓</span>
                          </div>
                          <span style={{ fontSize: 11.5, color: "rgba(255,255,255,0.72)" }}>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT HALF — top: bird+nodes | bottom: behavioral */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

            {/* TOP — Bird + Physical Adaptation Nodes */}
            <div style={{ flex: 1, position: "relative", overflow: "hidden", minHeight: 0 }}>

              {/* Dark background with subtle teal glow */}
              <div style={{
                position: "absolute", inset: 0,
                background: "radial-gradient(ellipse at 50% 50%, rgba(0,60,40,0.25) 0%, rgba(3,16,10,0.95) 70%)",
              }} />

              {/* SVG lines — physical adaptations only */}
              <svg
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 1, pointerEvents: "none" }}
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                {PHYSICAL.map((ad, i) => {
                  const isActive  = selectedId === ad.id;
                  const isHovered = hoveredId === ad.id;
                  return (
                    <motion.line
                      key={ad.id}
                      x1="50" y1="50"
                      x2={ad.cx} y2={ad.cy}
                      stroke={ad.color}
                      strokeWidth={isActive ? "0.6" : "0.3"}
                      pathLength={1}
                      strokeDasharray="1"
                      initial={{ strokeDashoffset: 1, strokeOpacity: 0 }}
                      animate={{ strokeDashoffset: 0, strokeOpacity: isActive ? 0.95 : isHovered ? 0.7 : 0.38 }}
                      transition={{ duration: 1.2, delay: i * 0.15, ease: "easeOut" }}
                      style={{ filter: isActive ? `drop-shadow(0 0 3px ${ad.color})` : "none" }}
                    />
                  );
                })}
              </svg>

              {/* Coot bird — breathing centerpiece */}
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                zIndex: 2, pointerEvents: "none",
              }}>
                <motion.img
                  src={cootBirdImg as string}
                  alt="Hawaiian Coot"
                  animate={{ scale: [1, 1.015, 1], y: [0, -5, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    width: "64%",
                    maxWidth: 340,
                    objectFit: "contain",
                    filter: "drop-shadow(0 0 30px rgba(0,200,120,0.2)) drop-shadow(0 6px 24px rgba(0,0,0,0.95))",
                  }}
                />
              </div>

              {/* Physical adaptation nodes */}
              {PHYSICAL.map((ad, i) => {
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
                      zIndex: 10, cursor: "pointer",
                    }}
                    animate={{ scale: isActive ? 1.2 : 1 }}
                    whileHover={{ scale: isActive ? 1.24 : 1.12 }}
                    onClick={() => select(ad.id)}
                    onHoverStart={() => setHoveredId(ad.id)}
                    onHoverEnd={() => setHoveredId(null)}
                  >
                    {/* Pulse ring */}
                    <motion.div
                      animate={{ scale: [1, 1.7, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.45, ease: "easeInOut" }}
                      style={{
                        position: "absolute", inset: -7, borderRadius: "50%",
                        border: `1.5px solid ${ad.color}`, pointerEvents: "none",
                      }}
                    />
                    {/* Circle */}
                    <div style={{
                      width:   isActive ? 76 : 64,
                      height:  isActive ? 76 : 64,
                      borderRadius: "50%",
                      background: isActive ? `${ad.color}22` : "rgba(3,16,10,0.9)",
                      border: `2px solid ${isActive ? ad.color : ad.color + "88"}`,
                      display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center", gap: 2,
                      boxShadow: isActive ? `0 0 26px ${ad.color}66, 0 0 8px ${ad.color}33 inset` : `0 0 10px ${ad.color}22`,
                      backdropFilter: "blur(10px)",
                      transition: "all 0.25s ease",
                    }}>
                      <span style={{ fontSize: 18 }}>{ad.icon}</span>
                      <p style={{
                        fontSize: 7.5, fontWeight: 800,
                        color: isActive ? ad.color : "rgba(255,255,255,0.7)",
                        textAlign: "center", letterSpacing: "0.04em", lineHeight: 1.2,
                        margin: 0, maxWidth: 56,
                      }}>
                        {ad.name}
                      </p>
                    </div>
                  </motion.div>
                );
              })}

              {/* "PHYSICAL ADAPTATIONS" label */}
              <div style={{
                position: "absolute", top: 10, left: 0, right: 0, textAlign: "center",
                zIndex: 5, pointerEvents: "none",
              }}>
                <p style={{ fontSize: 9, letterSpacing: "0.18em", color: "rgba(0,200,120,0.5)", fontWeight: 800, margin: 0 }}>
                  PHYSICAL ADAPTATIONS
                </p>
              </div>
            </div>

            {/* DIVIDER */}
            <div style={{ height: 1, background: "rgba(0,200,120,0.12)", flexShrink: 0 }} />

            {/* BOTTOM — Behavioral Adaptations */}
            <div style={{
              flexShrink: 0, height: "38%",
              background: "rgba(3,10,6,0.96)",
              display: "flex", flexDirection: "column",
              overflow: "hidden",
            }}>
              {/* Header */}
              <div style={{
                padding: "8px 14px 6px",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                flexShrink: 0,
              }}>
                <p style={{ fontSize: 9, letterSpacing: "0.18em", color: "rgba(255,140,80,0.85)", fontWeight: 800, margin: 0 }}>
                  BEHAVIORAL ADAPTATIONS
                </p>
              </div>

              {/* Two behavioral cards */}
              <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>
                {BEHAVIORAL.map((ad, i) => {
                  const isActive  = selectedId === ad.id;
                  const isHovered = hoveredId === ad.id;
                  return (
                    <motion.div
                      key={ad.id}
                      onClick={() => select(ad.id)}
                      onHoverStart={() => setHoveredId(ad.id)}
                      onHoverEnd={() => setHoveredId(null)}
                      whileHover={{ background: `${ad.color}0d` }}
                      style={{
                        flex: 1,
                        borderRight: i === 0 ? "1px solid rgba(255,255,255,0.05)" : "none",
                        display: "flex", gap: 10, padding: "10px 12px",
                        cursor: "pointer",
                        background: isActive ? `${ad.color}12` : "transparent",
                        transition: "background 0.25s",
                        overflow: "hidden",
                      }}
                    >
                      {/* Thumbnail */}
                      <div style={{
                        width: 74, flexShrink: 0, borderRadius: 8, overflow: "hidden",
                        border: `2px solid ${isActive || isHovered ? ad.color + "88" : "rgba(255,255,255,0.08)"}`,
                        transition: "border-color 0.25s",
                        boxShadow: isActive ? `0 0 14px ${ad.color}44` : "none",
                      }}>
                        <img
                          src={ad.image} alt={ad.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        />
                      </div>

                      {/* Text */}
                      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 15 }}>{ad.icon}</span>
                          <p style={{
                            fontSize: 12.5, fontWeight: 800,
                            color: isActive ? ad.color : "rgba(255,255,255,0.9)",
                            margin: 0, transition: "color 0.25s",
                          }}>
                            {ad.name}
                          </p>
                        </div>
                        <p style={{ fontSize: 11, lineHeight: 1.5, color: "rgba(255,255,255,0.55)", margin: 0 }}>
                          {ad.desc}
                        </p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "3px 8px", marginTop: "auto" }}>
                          {ad.benefits.slice(0, 2).map((b, j) => (
                            <span key={j} style={{
                              fontSize: 10, color: isActive ? ad.color : "rgba(255,255,255,0.45)",
                              display: "flex", alignItems: "center", gap: 4,
                            }}>
                              <span style={{ fontSize: 8 }}>✓</span>{b}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

          </div>{/* end RIGHT HALF */}
        </div>{/* end CENTER 2-halves */}
      </div>{/* end MAIN BODY */}

      {/* ── BOTTOM BAR ─────────────────────────────────────────────────────── */}
      <div style={{
        flexShrink: 0,
        borderTop: "1px solid rgba(0,200,120,0.1)",
        background: "rgba(3,12,8,0.95)",
        display: "flex",
      }}>

        {/* Survival stats */}
        <div style={{ flex: 2, padding: "10px 20px 12px", borderRight: "1px solid rgba(255,255,255,0.05)" }}>
          <p style={{ fontSize: 10, letterSpacing: "0.18em", color: TEAL, fontWeight: 800, margin: "0 0 8px", textAlign: "center" }}>
            SURVIVAL ADVANTAGE
          </p>
          <div style={{ display: "flex", gap: 14 }}>
            {STAT_LABELS.map(s => (
              <StatBar key={s.key + statColor} label={s.label} value={stats[s.key]} color={statColor} />
            ))}
          </div>
        </div>

        {/* Wetland scene carousel */}
        <div style={{ flex: 1.2, padding: "10px 14px 12px", borderRight: "1px solid rgba(255,255,255,0.05)" }}>
          <p style={{ fontSize: 10, letterSpacing: "0.18em", color: TEAL, fontWeight: 800, margin: "0 0 8px", textAlign: "center" }}>
            EXPLORE THE WETLAND
          </p>
          <div style={{ display: "flex", gap: 7, alignItems: "center", justifyContent: "center" }}>
            {SCENES.map((sc, i) => (
              <motion.div key={i} onClick={() => setSceneIdx(i)} whileHover={{ scale: 1.08, y: -2 }} style={{ cursor: "pointer", textAlign: "center" }}>
                <div style={{
                  width: 44, height: 44, borderRadius: "50%", overflow: "hidden",
                  border: `2px solid ${sceneIdx === i ? TEAL : "rgba(255,255,255,0.1)"}`,
                  boxShadow: sceneIdx === i ? `0 0 12px ${TEAL}55` : "none",
                  marginBottom: 3, transition: "border-color 0.25s, box-shadow 0.25s",
                }}>
                  <img src={sc.img} alt={sc.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <p style={{ fontSize: 8, color: sceneIdx === i ? TEAL : "rgba(255,255,255,0.32)", letterSpacing: "0.05em", fontWeight: 700, margin: 0 }}>
                  {sc.name.toUpperCase()}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Ecosystem health */}
        <div style={{
          width: 104, flexShrink: 0, padding: "10px 10px 12px",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3,
        }}>
          <p style={{ fontSize: 9, letterSpacing: "0.12em", color: "rgba(255,255,255,0.35)", fontWeight: 700, margin: 0 }}>ECOSYSTEM HEALTH</p>
          <p style={{ fontSize: 9.5, color: "rgba(255,255,255,0.42)", margin: 0 }}>Wetland Health</p>
          <div style={{ display: "flex", gap: 2 }}>
            {[...Array(4)].map((_, i) => <span key={i} style={{ fontSize: 12 }}>🌿</span>)}
          </div>
          <p style={{ fontSize: 11.5, color: TEAL, fontWeight: 800, margin: 0 }}>Healthy</p>
        </div>

      </div>
    </div>
  );
}
