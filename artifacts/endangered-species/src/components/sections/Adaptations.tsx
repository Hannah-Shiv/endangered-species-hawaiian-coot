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
    cx: 20, cy: 47,
    image: lobedFeetImg as string,
    headline: "Walking on Water",
    desc: "Unique lobed toes act as paddles for swimming AND spread weight for walking on floating vegetation.",
    benefits: ["Efficient swimming", "Walks on floating plants", "Better balance", "Energy conservation"],
    stats: { mobility: 96, protection: 55, predatorResistance: 60, nestSuccess: 75, overall: 78 },
  },
  {
    id: "frontal-shield", name: "White Frontal Shield", type: "PHYSICAL", icon: "🛡️", color: "#00d4ff",
    cx: 50, cy: 11,
    image: frontalShieldImg as string,
    headline: "Social Signaling",
    desc: "Highly visible white plate used for communication, mate selection, and territorial signaling; unique among Hawaiian birds.",
    benefits: ["Mate attraction", "Territorial display", "Flock coordination", "Status signaling"],
    stats: { mobility: 70, protection: 88, predatorResistance: 65, nestSuccess: 88, overall: 80 },
  },
  {
    id: "plumage", name: "Dense Waterproof Plumage", type: "PHYSICAL", icon: "🪶", color: "#90c8e8",
    cx: 80, cy: 47,
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
      <motion.div
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
        style={{
          flexShrink: 0, paddingTop: 80, paddingBottom: 14,
          borderBottom: "1px solid rgba(212,175,55,0.22)",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.8rem", color: "rgba(212,175,55,1)", letterSpacing: "0.04em", lineHeight: 1.1, margin: 0 }}>
          Endemic Adaptations
        </h1>
        <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 15, color: "rgba(212,175,55,0.88)", marginTop: 6, marginBottom: 0 }}>
          Millions of years of evolution — these survival traits make the Hawaiian Coot unlike any other bird.
        </p>
      </motion.div>

      {/* ── MAIN BODY ──────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>

        {/* LEFT SIDEBAR */}
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

        {/* ── CENTER: left scene | right (top + bottom) ──────────────────── */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>

          {/* LEFT HALF — Scene image + detail overlay */}
          <div style={{ flex: 1, position: "relative", overflow: "hidden", borderRight: "1px solid rgba(0,200,120,0.1)" }}>

            {/* Scene images — all stacked, CSS cross-fade */}
            {SCENES.map((sc, i) => (
              <img
                key={i}
                src={sc.img}
                alt={sc.name}
                style={{
                  position: "absolute", inset: 0, width: "100%", height: "100%",
                  objectFit: "cover", display: "block",
                  opacity: sceneIdx === i ? 1 : 0,
                  transition: "opacity 0.7s ease",
                }}
              />
            ))}

            {/* Bottom gradient */}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0, height: "50%",
              background: "linear-gradient(to top, rgba(3,16,10,0.96) 0%, rgba(3,16,10,0.5) 60%, transparent 100%)",
              pointerEvents: "none",
            }} />

            {/* Default label (nothing selected) */}
            <AnimatePresence>
              {!selected && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ position: "absolute", bottom: 18, left: 18, right: 18 }}
                >
                  <p style={{ fontSize: 9, letterSpacing: "0.18em", color: TEAL, fontWeight: 800, margin: "0 0 4px" }}>CURRENT SCENE</p>
                  <p style={{ fontSize: 17, fontWeight: 800, color: "white", margin: "0 0 5px" }}>{SCENES[sceneIdx].name}</p>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.48)", margin: 0, lineHeight: 1.5 }}>
                    Select an adaptation to see how this coot survives.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Detail overlay (adaptation selected) */}
            <AnimatePresence>
              {selected && (
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" }}
                >
                  {/* Dark tint */}
                  <div style={{ position: "absolute", inset: 0, background: "rgba(3,10,6,0.45)", zIndex: 0 }} />

                  {/* Close button */}
                  <motion.div
                    onClick={() => setSelectedId(null)}
                    whileHover={{ scale: 1.1 }}
                    style={{
                      position: "absolute", top: 12, right: 12, zIndex: 10,
                      width: 28, height: 28, borderRadius: "50%",
                      border: "1px solid rgba(255,255,255,0.2)",
                      background: "rgba(0,0,0,0.55)",
                      color: "rgba(255,255,255,0.65)", cursor: "pointer", fontSize: 13,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >✕</motion.div>

                  {/* Close-up image — upper portion */}
                  <div style={{ flex: 1, position: "relative", overflow: "hidden", minHeight: 0, zIndex: 1 }}>
                    <img
                      src={selected.image} alt={selected.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div style={{
                      position: "absolute", bottom: 0, left: 0, right: 0, height: "55%",
                      background: "linear-gradient(to top, rgba(3,10,6,1) 0%, transparent 100%)",
                    }} />
                    <div style={{ position: "absolute", bottom: 14, left: 16, right: 16 }}>
                      <p style={{ fontSize: 9.5, letterSpacing: "0.18em", color: selected.color, fontWeight: 800, margin: "0 0 3px" }}>
                        {selected.type} ADAPTATION
                      </p>
                      <h3 style={{ fontSize: 21, fontWeight: 800, color: "white", margin: 0, lineHeight: 1.15 }}>
                        {selected.headline}
                      </h3>
                    </div>
                  </div>

                  {/* Text — lower portion */}
                  <div style={{ flexShrink: 0, padding: "14px 16px 16px", background: "rgba(3,10,6,0.98)", zIndex: 1 }}>
                    <p style={{ fontSize: 13, lineHeight: 1.65, color: "rgba(255,255,255,0.78)", margin: "0 0 12px" }}>
                      {selected.desc}
                    </p>
                    <p style={{ fontSize: 10, letterSpacing: "0.14em", color: selected.color, fontWeight: 800, margin: "0 0 7px" }}>
                      KEY BENEFITS
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px 10px" }}>
                      {selected.benefits.map((b, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                          <div style={{
                            width: 15, height: 15, borderRadius: "50%", flexShrink: 0,
                            background: `${selected.color}1a`, border: `1px solid ${selected.color}66`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            <span style={{ fontSize: 8, color: selected.color }}>✓</span>
                          </div>
                          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.72)" }}>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT HALF */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

            {/* TOP — Bird + Physical adaptation image thumbnails */}
            <div style={{
              flex: 1, position: "relative", overflow: "hidden", minHeight: 0,
              background: "radial-gradient(ellipse at 50% 55%, rgba(0,50,35,0.35) 0%, rgba(3,16,10,0.98) 72%)",
            }}>

              {/* Section label */}
              <div style={{ position: "absolute", top: 9, left: 0, right: 0, textAlign: "center", zIndex: 5, pointerEvents: "none" }}>
                <p style={{ fontSize: 9, letterSpacing: "0.18em", color: "rgba(0,200,120,0.5)", fontWeight: 800, margin: 0 }}>
                  PHYSICAL ADAPTATIONS
                </p>
              </div>

              {/* Static SVG lines */}
              <svg
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 1, pointerEvents: "none" }}
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                {PHYSICAL.map(ad => {
                  const isActive = selectedId === ad.id;
                  return (
                    <line
                      key={ad.id}
                      x1="50" y1="52"
                      x2={ad.cx} y2={ad.cy}
                      stroke={ad.color}
                      strokeWidth={isActive ? "0.6" : "0.3"}
                      strokeOpacity={isActive ? 0.9 : 0.35}
                      style={{ filter: isActive ? `drop-shadow(0 0 3px ${ad.color})` : "none" }}
                    />
                  );
                })}
              </svg>

              {/* Coot bird — static */}
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                zIndex: 2, pointerEvents: "none",
              }}>
                <img
                  src={cootBirdImg as string}
                  alt="Hawaiian Coot"
                  style={{
                    width: "60%", maxWidth: 320, objectFit: "contain",
                    filter: "drop-shadow(0 0 28px rgba(0,200,120,0.18)) drop-shadow(0 6px 20px rgba(0,0,0,0.95))",
                  }}
                />
              </div>

              {/* Physical adaptation image nodes */}
              {PHYSICAL.map(ad => {
                const isActive = selectedId === ad.id;
                return (
                  <motion.div
                    key={ad.id}
                    onClick={() => select(ad.id)}
                    whileHover={{ scale: 1.06 }}
                    style={{
                      position: "absolute",
                      left: `${ad.cx}%`,
                      top: `${ad.cy}%`,
                      transform: "translate(-50%, -50%)",
                      zIndex: 10, cursor: "pointer",
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
                    }}
                  >
                    {/* Image thumbnail */}
                    <div style={{
                      width: 112, height: 82,
                      borderRadius: 9,
                      overflow: "hidden",
                      border: `2px solid ${isActive ? ad.color : ad.color + "55"}`,
                      boxShadow: isActive
                        ? `0 0 22px ${ad.color}66, 0 4px 18px rgba(0,0,0,0.85)`
                        : `0 4px 14px rgba(0,0,0,0.75)`,
                      transition: "border-color 0.2s, box-shadow 0.2s",
                    }}>
                      <img
                        src={ad.image} alt={ad.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      />
                    </div>
                    {/* Label */}
                    <p style={{
                      fontSize: 9.5, fontWeight: 800, margin: 0,
                      color: isActive ? ad.color : "rgba(255,255,255,0.7)",
                      textAlign: "center", letterSpacing: "0.05em",
                      lineHeight: 1.2, maxWidth: 112,
                      transition: "color 0.2s",
                    }}>
                      {ad.name}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* DIVIDER */}
            <div style={{ height: 1, background: "rgba(0,200,120,0.12)", flexShrink: 0 }} />

            {/* BOTTOM — Behavioral Adaptations (full-bleed image cards) */}
            <div style={{
              flexShrink: 0, height: "40%",
              display: "flex", overflow: "hidden",
              borderTop: "1px solid rgba(0,200,120,0.12)",
            }}>
              {/* Section label — vertical on far left */}
              <div style={{
                width: 22, flexShrink: 0,
                background: "rgba(3,8,5,0.98)",
                borderRight: "1px solid rgba(255,255,255,0.05)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <p style={{
                  fontSize: 8.5, letterSpacing: "0.18em", color: "rgba(255,140,80,0.75)",
                  fontWeight: 800, margin: 0,
                  writingMode: "vertical-rl", transform: "rotate(180deg)",
                  whiteSpace: "nowrap",
                }}>
                  BEHAVIORAL ADAPTATIONS
                </p>
              </div>

              {/* Two full-bleed image cards */}
              {BEHAVIORAL.map((ad, i) => {
                const isActive = selectedId === ad.id;
                return (
                  <motion.div
                    key={ad.id}
                    onClick={() => select(ad.id)}
                    whileHover={{ filter: "brightness(1.08)" }}
                    style={{
                      flex: 1,
                      position: "relative",
                      overflow: "hidden",
                      cursor: "pointer",
                      borderRight: i === 0 ? "1px solid rgba(255,255,255,0.07)" : "none",
                    }}
                  >
                    {/* Full-bleed image */}
                    <img
                      src={ad.image} alt={ad.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />

                    {/* Gradient overlay */}
                    <div style={{
                      position: "absolute", inset: 0,
                      background: isActive
                        ? `linear-gradient(to top, ${ad.color}cc 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.1) 100%)`
                        : "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.1) 100%)",
                      transition: "background 0.3s",
                    }} />

                    {/* Active border highlight */}
                    {isActive && (
                      <div style={{
                        position: "absolute", inset: 0,
                        border: `2px solid ${ad.color}`,
                        borderRadius: 0, pointerEvents: "none",
                      }} />
                    )}

                    {/* Text overlaid at bottom */}
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "12px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
                        <span style={{ fontSize: 16 }}>{ad.icon}</span>
                        <p style={{
                          fontSize: 13.5, fontWeight: 800, margin: 0,
                          color: isActive ? "white" : "rgba(255,255,255,0.95)",
                          letterSpacing: "0.01em",
                        }}>
                          {ad.name}
                        </p>
                      </div>
                      <p style={{
                        fontSize: 11, lineHeight: 1.45, margin: "0 0 6px",
                        color: isActive ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.62)",
                        transition: "color 0.25s",
                      }}>
                        {ad.headline}
                      </p>
                      <div style={{ display: "flex", gap: 8 }}>
                        {ad.benefits.slice(0, 2).map((b, j) => (
                          <span key={j} style={{
                            fontSize: 9.5, color: isActive ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)",
                            display: "flex", alignItems: "center", gap: 3,
                          }}>
                            <span style={{ color: ad.color, fontSize: 8 }}>✓</span>{b}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

          </div>{/* end right half */}
        </div>{/* end center 2-halves */}
      </div>{/* end main body */}

      {/* ── BOTTOM BAR ─────────────────────────────────────────────────────── */}
      <div style={{
        flexShrink: 0,
        borderTop: "1px solid rgba(0,200,120,0.1)",
        background: "rgba(3,12,8,0.96)",
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

        {/* Scene carousel */}
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
