import { motion, AnimatePresence, useSpring } from "framer-motion";
import { useState, useEffect } from "react";
import healthyImg  from "@assets/image_1779833968892.png";
import ratsImg     from "@assets/image_1779833978256.png";
import dogsImg     from "@assets/image_1779833987765.png";
import frogsImg    from "@assets/image_1779834002262.png";

// ── Palette ───────────────────────────────────────────────────────────────────
const GOLD = "rgba(212,175,55,1)";

// ── Types ─────────────────────────────────────────────────────────────────────
type ThreatLevel = "STABLE" | "NATURAL" | "MEDIUM" | "HIGH";
type Metrics     = { habitat: number; nesting: number; water: number; food: number; population: number };

type Predator = {
  id:          string;
  name:        string;
  emoji:       string;
  threat:      ThreatLevel;
  color:       string;
  image:       string;
  imgFilter:   string;
  desc:        string;
  impact:      string;
  warning:     string;
  metrics:     Metrics;
};

// ── Data ──────────────────────────────────────────────────────────────────────
const PREDATORS: Predator[] = [
  {
    id: "stable", name: "Healthy Habitat", emoji: "🌿", threat: "STABLE", color: "#33ee88",
    image: healthyImg as string, imgFilter: "none",
    desc: "A thriving Hawaiian wetland ecosystem — coots nest and forage in peaceful balance.",
    impact: "Baseline condition. No predator threats detected. All systems stable.",
    warning: "",
    metrics: { habitat: 85, nesting: 80, water: 88, food: 82, population: 78 },
  },
  {
    id: "mongoose", name: "Mongoose", emoji: "🦡", threat: "HIGH", color: "#ff3344",
    image: healthyImg as string, imgFilter: "brightness(0.42) saturate(0.45) sepia(0.5) hue-rotate(-25deg)",
    desc: "Introduced in 1883 to control rats, the mongoose instead became a devastating nest predator of ground-nesting Hawaiian birds.",
    impact: "Chick survival crashes. Ground nests under 1m offer zero protection from mongoose raids.",
    warning: "⚠  NEST RAID DETECTED",
    metrics: { habitat: 55, nesting: 25, water: 72, food: 58, population: 30 },
  },
  {
    id: "rats", name: "Rats & Feral Cats", emoji: "🐀", threat: "HIGH", color: "#ff3344",
    image: ratsImg as string, imgFilter: "brightness(0.5) saturate(0.55)",
    desc: "Nocturnal nest raiders with glowing eyes. Rats consume eggs whole; feral cats take chicks silently in the night.",
    impact: "Nesting success drops 40% from baseline. No nest is safe after dark.",
    warning: "⚠  NOCTURNAL THREAT ACTIVE",
    metrics: { habitat: 62, nesting: 40, water: 78, food: 55, population: 42 },
  },
  {
    id: "dogs", name: "Dogs", emoji: "🐕", threat: "MEDIUM", color: "#ffbb22",
    image: dogsImg as string, imgFilter: "brightness(0.75) saturate(0.85)",
    desc: "Domestic and feral dogs crash through wetlands, flushing nesting birds and trampling vegetation across nesting zones.",
    impact: "Chronic disturbance forces nest abandonment. Repeated stress degrades habitat over time.",
    warning: "⚠  DISTURBANCE DETECTED",
    metrics: { habitat: 68, nesting: 45, water: 70, food: 60, population: 50 },
  },
  {
    id: "frogs", name: "Bullfrogs", emoji: "🐸", threat: "MEDIUM", color: "#ffbb22",
    image: frogsImg as string, imgFilter: "brightness(0.7) saturate(1.35) hue-rotate(18deg)",
    desc: "Invasive bullfrogs dominate the water's edge, consuming insects and invertebrates vital to coot chicks — and may prey on chicks directly.",
    impact: "Food availability collapses 47%. Young chicks face dual threat: starvation and direct predation.",
    warning: "⚠  FOOD CHAIN IMBALANCE",
    metrics: { habitat: 64, nesting: 42, water: 60, food: 35, population: 38 },
  },
  {
    id: "nightheron", name: "Night Heron", emoji: "🌙", threat: "NATURAL", color: "#8899ff",
    image: healthyImg as string, imgFilter: "brightness(0.55) saturate(0.55) hue-rotate(205deg)",
    desc: "The Black-crowned Night Heron is native to Hawaii. As a natural predator it reflects ecological balance — part of the system, not a destroyer of it.",
    impact: "Minimal disruption. Natural predation pressure maintains healthy population dynamics and balance.",
    warning: "",
    metrics: { habitat: 80, nesting: 72, water: 85, food: 78, population: 74 },
  },
];

const METRIC_KEYS: { key: keyof Metrics; label: string; icon: string }[] = [
  { key: "habitat",    label: "Habitat Health",       icon: "🌱" },
  { key: "nesting",    label: "Nesting Success",       icon: "🪺" },
  { key: "water",      label: "Water Quality",         icon: "💧" },
  { key: "food",       label: "Food Availability",     icon: "🐟" },
  { key: "population", label: "Population Stability",  icon: "🦤" },
];

const THREAT_ORDER: ThreatLevel[] = ["STABLE", "NATURAL", "MEDIUM", "HIGH"];
const THREAT_WIDTH: Record<ThreatLevel, string> = { STABLE: "5%", NATURAL: "30%", MEDIUM: "62%", HIGH: "100%" };
const THREAT_LABEL: Record<ThreatLevel, string> = { STABLE: "STABLE", NATURAL: "NATURAL", MEDIUM: "MODERATE", HIGH: "HIGH" };

// ── AnimatedMetricBar ─────────────────────────────────────────────────────────
function AnimatedMetricBar({ value, label, icon }: { value: number; label: string; icon: string }) {
  const [display, setDisplay] = useState(Math.round(value));
  const sp = useSpring(value, { stiffness: 55, damping: 18 });
  useEffect(() => {
    sp.set(value);
    const unsub = sp.on("change", v => setDisplay(Math.round(v)));
    return unsub;
  }, [value, sp]);

  const barColor  = value > 70 ? "#33ee88" : value > 50 ? "#ffbb22" : "#ff4444";
  const glowColor = value > 70 ? "rgba(51,238,136,0.55)" : value > 50 ? "rgba(255,187,34,0.55)" : "rgba(255,68,68,0.55)";

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
        <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 13, color: "#fff", fontWeight: 600, letterSpacing: "0.03em" }}>
          {icon} {label}
        </span>
        <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 15, fontWeight: 900, color: barColor, minWidth: 42, textAlign: "right", transition: "color 0.4s" }}>
          {display}%
        </span>
      </div>
      <div style={{ height: 9, background: "rgba(255,255,255,0.07)", borderRadius: 5, overflow: "visible", position: "relative" }}>
        <motion.div
          animate={{ width: `${value}%`, backgroundColor: barColor, boxShadow: `0 0 9px ${glowColor}` }}
          transition={{ type: "spring", stiffness: 55, damping: 18 }}
          style={{ height: "100%", borderRadius: 5, position: "absolute", top: 0, left: 0 }}
        />
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function Predators() {
  const [selected, setSelected] = useState<Predator>(PREDATORS[0]);

  const p = selected;
  const isHigh   = p.threat === "HIGH";
  const isMedium = p.threat === "MEDIUM";
  const isNatural = p.threat === "NATURAL";

  const overlayColor = isHigh
    ? "rgba(220,40,40,0.22)"
    : isMedium
    ? "rgba(220,140,0,0.18)"
    : isNatural
    ? "rgba(80,100,255,0.14)"
    : "rgba(40,200,100,0.1)";

  const edgeGlow = isHigh
    ? "inset 0 0 80px rgba(220,40,40,0.35)"
    : isMedium
    ? "inset 0 0 60px rgba(220,140,0,0.28)"
    : isNatural
    ? "inset 0 0 60px rgba(80,100,255,0.22)"
    : "inset 0 0 50px rgba(40,200,100,0.12)";

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "#000",
      display: "flex", flexDirection: "column",
      fontFamily: "'Josefin Sans', sans-serif",
      overflow: "hidden",
    }}>

      {/* ── Header bar ────────────────────────────────────────────────────── */}
      <div style={{
        flexShrink: 0, padding: "56px 28px 10px",
        background: "linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 100%)",
        borderBottom: `1px solid ${p.color}44`,
        transition: "border-color 0.4s",
        display: "flex", alignItems: "center", gap: 16, zIndex: 10,
      }}>
        <div>
          <p style={{ fontSize: 11, letterSpacing: "0.22em", color: GOLD, opacity: 0.75, marginBottom: 2 }}>SECTION 05 · ECOSYSTEM THREATS</p>
          <h1 style={{ fontSize: 22, fontWeight: 900, letterSpacing: "0.14em", color: "#fff", textTransform: "uppercase" }}>
            Predators &amp; Invasive Threats
          </h1>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, letterSpacing: "0.12em", color: "rgba(255,255,255,0.45)" }}>SELECT THREAT →</span>
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>

        {/* ── LEFT: Predator selector sidebar ───────────────────────────── */}
        <div style={{
          width: 204, flexShrink: 0,
          display: "flex", flexDirection: "column", gap: 5,
          padding: "14px 10px",
          background: "rgba(0,0,0,0.85)",
          borderRight: "1px solid rgba(212,175,55,0.12)",
          overflowY: "auto",
        }}>
          <p style={{ fontSize: 9.5, letterSpacing: "0.2em", color: "rgba(212,175,55,0.5)", padding: "0 6px 6px", textTransform: "uppercase" }}>
            Predator / State
          </p>
          {PREDATORS.map(pred => {
            const isSel = pred.id === selected.id;
            return (
              <motion.button
                key={pred.id}
                onClick={() => setSelected(pred)}
                whileTap={{ scale: 0.97 }}
                style={{
                  width: "100%", textAlign: "left",
                  background: isSel ? `${pred.color}18` : "transparent",
                  border: `1.5px solid ${isSel ? pred.color : "rgba(255,255,255,0.08)"}`,
                  borderRadius: 10, padding: "10px 12px",
                  cursor: "pointer",
                  transition: "background 0.25s, border-color 0.25s",
                  boxShadow: isSel ? `0 0 16px ${pred.color}44` : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 20 }}>{pred.emoji}</span>
                  <div>
                    <p style={{
                      fontSize: 12.5, fontWeight: 800, letterSpacing: "0.05em",
                      color: isSel ? pred.color : "#fff",
                      transition: "color 0.25s",
                      marginBottom: 2,
                    }}>
                      {pred.name}
                    </p>
                    <span style={{
                      fontSize: 9, letterSpacing: "0.14em", fontWeight: 800,
                      color: pred.color, opacity: isSel ? 1 : 0.65,
                    }}>
                      {THREAT_LABEL[pred.threat]}
                    </span>
                  </div>
                  {isSel && (
                    <motion.div
                      initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
                      style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: pred.color, boxShadow: `0 0 8px ${pred.color}` }}
                    />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* ── RIGHT: Image viewer + dashboard ───────────────────────────── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

          {/* ── Cinematic image panel ─────────────────────────────────── */}
          <div style={{ flex: 1, position: "relative", overflow: "hidden", minHeight: 0 }}>

            {/* Background image — crossfade on change */}
            <AnimatePresence mode="sync">
              <motion.img
                key={p.id + "-img"}
                src={p.image}
                alt={p.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.65 }}
                style={{
                  position: "absolute", inset: 0,
                  width: "100%", height: "100%",
                  objectFit: "cover", objectPosition: "center",
                  filter: p.imgFilter,
                  transition: "filter 0.65s ease",
                }}
              />
            </AnimatePresence>

            {/* Threat color overlay */}
            <motion.div
              animate={{ background: overlayColor }}
              transition={{ duration: 0.7 }}
              style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
            />

            {/* Edge vignette with threat glow */}
            <motion.div
              animate={{ boxShadow: edgeGlow }}
              transition={{ duration: 0.7 }}
              style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
            />

            {/* Pulsing scan lines for HIGH threats */}
            <AnimatePresence>
              {isHigh && (
                <motion.div
                  key="scanlines"
                  initial={{ opacity: 0 }} animate={{ opacity: [0, 0.18, 0] }} exit={{ opacity: 0 }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    position: "absolute", inset: 0, pointerEvents: "none",
                    background: "repeating-linear-gradient(0deg, rgba(255,30,30,0.07) 0px, transparent 2px, transparent 8px)",
                  }}
                />
              )}
            </AnimatePresence>

            {/* Corner HUD brackets */}
            {(["tl","tr","bl","br"] as const).map(corner => (
              <div key={corner} style={{
                position: "absolute", width: 22, height: 22, pointerEvents: "none",
                top: corner.startsWith("t") ? 16 : undefined,
                bottom: corner.startsWith("b") ? 16 : undefined,
                left: corner.endsWith("l") ? 16 : undefined,
                right: corner.endsWith("r") ? 16 : undefined,
                borderTop: corner.startsWith("t") ? `2px solid ${p.color}` : "none",
                borderBottom: corner.startsWith("b") ? `2px solid ${p.color}` : "none",
                borderLeft: corner.endsWith("l") ? `2px solid ${p.color}` : "none",
                borderRight: corner.endsWith("r") ? `2px solid ${p.color}` : "none",
                opacity: 0.6, transition: "border-color 0.4s",
              }}/>
            ))}

            {/* Top-left: predator label */}
            <motion.div
              key={p.id + "-label"}
              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              style={{ position: "absolute", top: 14, left: 50, display: "flex", alignItems: "center", gap: 8 }}
            >
              <span style={{ fontSize: 24 }}>{p.emoji}</span>
              <div>
                <p style={{ fontSize: 16, fontWeight: 900, color: "#fff", letterSpacing: "0.06em", textShadow: "0 2px 12px rgba(0,0,0,0.9)" }}>
                  {p.name.toUpperCase()}
                </p>
                <p style={{ fontSize: 10, letterSpacing: "0.15em", color: p.color, fontWeight: 700, textShadow: "0 1px 8px rgba(0,0,0,0.9)" }}>
                  {THREAT_LABEL[p.threat]} THREAT
                </p>
              </div>
            </motion.div>

            {/* Top-right: threat gauge */}
            <div style={{ position: "absolute", top: 16, right: 50, width: 140 }}>
              <p style={{ fontSize: 9, letterSpacing: "0.16em", color: "rgba(255,255,255,0.5)", marginBottom: 5, textAlign: "right" }}>THREAT LEVEL</p>
              <div style={{ height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 3, overflow: "hidden" }}>
                <motion.div
                  animate={{ width: THREAT_WIDTH[p.threat], backgroundColor: p.color }}
                  transition={{ type: "spring", stiffness: 55, damping: 18 }}
                  style={{ height: "100%", borderRadius: 3, boxShadow: `0 0 8px ${p.color}` }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
                {THREAT_ORDER.map(t => (
                  <span key={t} style={{
                    fontSize: 8, letterSpacing: "0.08em", fontWeight: 700,
                    color: t === p.threat ? p.color : "rgba(255,255,255,0.25)",
                    transition: "color 0.3s",
                  }}>
                    {t === "NATURAL" ? "NAT" : t === "STABLE" ? "OK" : t}
                  </span>
                ))}
              </div>
            </div>

            {/* Warning badge (pulsing for HIGH) */}
            <AnimatePresence>
              {p.warning && (
                <motion.div
                  key={p.id + "-warn"}
                  initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.35 }}
                  style={{ position: "absolute", top: 56, left: "50%", transform: "translateX(-50%)" }}
                >
                  <motion.div
                    animate={isHigh ? { opacity: [1, 0.55, 1] } : { opacity: 1 }}
                    transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                      background: "rgba(0,0,0,0.85)",
                      border: `1.5px solid ${p.color}`,
                      borderRadius: 20, padding: "5px 16px",
                      fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, fontWeight: 800,
                      color: p.color, letterSpacing: "0.12em",
                      boxShadow: `0 0 20px ${p.color}66`,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {p.warning}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom info panel */}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.7) 60%, transparent 100%)",
              padding: "32px 24px 16px",
            }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={p.id + "-info"}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.38 }}
                >
                  <p style={{ fontSize: 13, lineHeight: 1.55, color: "rgba(255,255,255,0.82)", marginBottom: 6, letterSpacing: "0.02em" }}>
                    {p.desc}
                  </p>
                  <p style={{ fontSize: 11.5, color: p.color, letterSpacing: "0.06em", fontWeight: 700 }}>
                    ↳ {p.impact}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ── Ecosystem Health Dashboard ─────────────────────────────── */}
          <div style={{
            flexShrink: 0, background: "rgba(0,0,0,0.96)",
            borderTop: "1px solid rgba(212,175,55,0.2)",
            padding: "12px 22px 14px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <p style={{
                fontSize: 11.5, letterSpacing: "0.2em", fontWeight: 800,
                color: GOLD, textShadow: `0 0 10px ${GOLD}`,
              }}>
                ⬡ ECOSYSTEM HEALTH DASHBOARD
              </p>
              <div style={{ flex: 1, height: 1, background: "rgba(212,175,55,0.15)" }} />
              {/* Overall status badge */}
              <motion.div
                animate={{ backgroundColor: `${p.color}22`, borderColor: p.color }}
                style={{ border: "1.5px solid", borderColor: p.color, borderRadius: 16, padding: "3px 12px", transition: "border-color 0.4s" }}
              >
                <motion.span
                  animate={{ color: p.color }}
                  style={{ fontSize: 11, fontWeight: 900, letterSpacing: "0.12em", transition: "color 0.4s" }}
                >
                  {THREAT_LABEL[p.threat]}
                </motion.span>
              </motion.div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "0 20px" }}>
              {METRIC_KEYS.map(({ key, label, icon }) => (
                <AnimatedMetricBar key={key + p.id} value={p.metrics[key]} label={label} icon={icon} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
