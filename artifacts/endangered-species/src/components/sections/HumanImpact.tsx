import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import wetlandHealthy from "@assets/image_1779819729646.png";
import wetlandStressed from "@assets/image_1779819734890.png";

// ── Palette ──────────────────────────────────────────────────────────────────
const GOLD  = "rgba(212,175,55,1)";
const GOLDF = "rgba(212,175,55,0.2)";
const RED   = "rgba(220,50,30,1)";
const GREEN = "rgba(50,200,100,1)";
const spring = { type: "spring" as const, stiffness: 100, damping: 20 };

// ── Data ─────────────────────────────────────────────────────────────────────
const BASE = { wetland: 28, nesting: 31, water: 68, population: 42 };

const harmCards = [
  {
    id: "wetland-drainage", icon: "🌊", title: "Wetland Drainage",
    desc: "Historical draining for agriculture has eliminated ~70% of Hawaii's natural wetlands.",
    effect: "Habitat loss destroys nesting grounds",
    delta: { wetland: -18, nesting: -12, water: -22, population: -18 },
  },
  {
    id: "predators", icon: "🦝", title: "Introduced Predators",
    desc: "Mongoose, rats, and feral cats brought by settlers decimate ground-nesting birds.",
    effect: "Predators threaten chicks",
    delta: { wetland: -6, nesting: -20, water: -4, population: -22 },
  },
  {
    id: "pollution", icon: "🏭", title: "Pollution & Disturbance",
    desc: "Pesticide runoff contaminates food sources while off-leash dogs disturb nesting sites.",
    effect: "Pollution damages food sources",
    delta: { wetland: -10, nesting: -8, water: -36, population: -10 },
  },
];

const hopeCards = [
  {
    id: "refuge", icon: "🌿", title: "Refuge Creation",
    desc: "National Wildlife Refuges protect key habitats, managing water levels for breeding success.",
    effect: "Protected habitats improve survival",
    delta: { wetland: 44, nesting: 28, water: 24, population: 36 },
  },
  {
    id: "taro", icon: "🌾", title: "Taro Farmer Partnerships",
    desc: "Collaborations with taro (loi) farmers maintain agricultural wetlands as crucial habitat.",
    effect: "Traditional agriculture supports wetlands",
    delta: { wetland: 34, nesting: 18, water: 20, population: 24 },
  },
  {
    id: "predator-control", icon: "🛡️", title: "Predator Control",
    desc: "Active trapping and fencing programs create safe havens for chicks to reach adulthood.",
    effect: "Protection improves nesting success",
    delta: { wetland: 10, nesting: 46, water: 10, population: 34 },
  },
];

const helpCards = [
  {
    n: 1, icon: "🏞️", title: "Support Wildlife Refuges",
    desc: "Donate or volunteer at local Hawaii wildlife refuges.",
    message: "Protected refuges provide safe nesting and feeding grounds essential for Hawaiian Coot survival.",
    effect: "🛡️ Habitat +15%", color: "rgba(100,200,100,1)",
    delta: { wetland: 15, nesting: 12, water: 5, population: 8 },
  },
  {
    n: 2, icon: "🐾", title: "Manage Pets",
    desc: "Keep cats indoors and dogs on leash near wetlands.",
    message: "Keeping pets controlled near wetlands protects vulnerable chicks and nesting birds.",
    effect: "🐣 Chick Survival +18%", color: "rgba(100,160,255,1)",
    delta: { wetland: 2, nesting: 10, water: 2, population: 18 },
  },
  {
    n: 3, icon: "🌱", title: "Wetland Restoration",
    desc: "Join community workdays to restore and plant native vegetation.",
    message: "Restoring wetlands rebuilds critical feeding and nesting habitats for future generations.",
    effect: "💧 Wetland +20%", color: "rgba(50,200,150,1)",
    delta: { wetland: 20, nesting: 8, water: 15, population: 12 },
  },
  {
    n: 4, icon: "🐱", title: "Support TNR",
    desc: "Back trap-neuter-return programs for feral cat management.",
    message: "TNR programs reduce feral predator populations that threaten native birds.",
    effect: "🦝 Predator −14%", color: "rgba(220,160,80,1)",
    delta: { wetland: 3, nesting: 8, water: 3, population: 14 },
  },
  {
    n: 5, icon: "🔭", title: "Report Wildlife",
    desc: "Contact Hawaii Wildlife Center if you spot injured waterbirds.",
    message: "Reporting injured wildlife helps teams respond quickly to protect endangered species.",
    effect: "📈 Population +6%", color: "rgba(160,120,255,1)",
    delta: { wetland: 2, nesting: 4, water: 2, population: 6 },
  },
];

const METERS = [
  { key: "wetland",    label: "Wetland Health",       icon: "💧" },
  { key: "nesting",    label: "Nesting Success",      icon: "🪺" },
  { key: "water",      label: "Water Quality",        icon: "🌊" },
  { key: "population", label: "Population Stability", icon: "🐦" },
] as const;

type CardData = { id: string; type: "harm" | "hope"; delta: typeof BASE; effect: string };

// ── Glowing image label ───────────────────────────────────────────────────────
function ImageLabel({ label, color, side }: { label: string; color: string; side: "left" | "right" }) {
  return (
    <div style={{
      position: "absolute", top: 10, [side === "left" ? "left" : "right"]: 10, zIndex: 4,
      background: color.replace(",1)", ",0.18)"),
      border: `1.5px solid ${color}`,
      borderRadius: 6, padding: "3px 10px",
      boxShadow: `0 0 14px ${color.replace(",1)", ",0.7)")}, 0 0 4px ${color}`,
    }}>
      <span style={{
        fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, color,
        letterSpacing: "0.16em", fontWeight: 800,
        textShadow: `0 0 10px ${color}`,
      }}>{label}</span>
    </div>
  );
}

// ── Lock button ───────────────────────────────────────────────────────────────
function LockBtn({
  isLocked, isHovered, color, onClick,
}: {
  isLocked: boolean; isHovered: boolean; color: string;
  onClick: (e: React.MouseEvent) => void;
}) {
  const bright = color.replace(",1)", ",0.9)");
  const glow   = color.replace(",1)", ",0.4)");
  return (
    <motion.div
      onClick={onClick}
      animate={{
        background:  isLocked ? color : "rgba(0,0,0,0)",
        borderColor: isLocked ? bright : isHovered ? color.replace(",1)", ",0.5)") : "rgba(255,255,255,0.2)",
        boxShadow:   isLocked ? `0 0 18px ${glow}, 0 0 6px ${color}` : "none",
        scale:       isLocked ? 1.05 : 1,
      }}
      transition={{ duration: 0.3 }}
      style={{
        width: 42, height: 42, borderRadius: "50%",
        border: "2px solid rgba(255,255,255,0.2)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        cursor: "pointer", flexShrink: 0, gap: 1,
      }}
    >
      <AnimatePresence mode="wait">
        {isLocked ? (
          <motion.div key="locked"
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}
          >
            <span style={{ fontSize: 16, color: "#000", lineHeight: 1 }}>🔒</span>
          </motion.div>
        ) : (
          <motion.div key="unlocked"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}
          >
            <span style={{ fontSize: 14, lineHeight: 1, opacity: 0.5 }}>🔓</span>
            <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 7, color: "rgba(255,255,255,0.45)", letterSpacing: "0.06em", fontWeight: 700 }}>LOCK</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function HumanImpact() {
  const [hoveredId,  setHoveredId]  = useState<string | null>(null);
  const [lockedIds,  setLockedIds]  = useState<Set<string>>(new Set());
  const [activated,  setActivated]  = useState<Set<number>>(new Set());
  const [justClicked, setJustClicked] = useState<number | null>(null);

  // All side card data indexed by id
  const allSideCards: Record<string, CardData> = {};
  harmCards.forEach(c => { allSideCards[c.id] = { id: c.id, type: "harm", delta: c.delta, effect: c.effect }; });
  hopeCards.forEach(c => { allSideCards[c.id] = { id: c.id, type: "hope", delta: c.delta, effect: c.effect }; });

  function toggleLock(id: string) {
    setLockedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  // Locked deltas — sum all locked cards
  const lockedDelta = Array.from(lockedIds).reduce(
    (acc, id) => {
      const d = allSideCards[id]?.delta;
      if (!d) return acc;
      return { wetland: acc.wetland + d.wetland, nesting: acc.nesting + d.nesting, water: acc.water + d.water, population: acc.population + d.population };
    },
    { wetland: 0, nesting: 0, water: 0, population: 0 }
  );

  // Help boost
  const helpBoost = Array.from(activated).reduce(
    (acc, n) => {
      const c = helpCards[n - 1];
      return { wetland: acc.wetland + c.delta.wetland, nesting: acc.nesting + c.delta.nesting, water: acc.water + c.delta.water, population: acc.population + c.delta.population };
    },
    { wetland: 0, nesting: 0, water: 0, population: 0 }
  );

  const withLockAndHelp = {
    wetland:    BASE.wetland    + lockedDelta.wetland    + helpBoost.wetland,
    nesting:    BASE.nesting    + lockedDelta.nesting    + helpBoost.nesting,
    water:      BASE.water      + lockedDelta.water      + helpBoost.water,
    population: BASE.population + lockedDelta.population + helpBoost.population,
  };

  const hoveredData = hoveredId ? allSideCards[hoveredId] : null;
  const metrics = hoveredData
    ? {
        wetland:    Math.max(4,  Math.min(95, withLockAndHelp.wetland    + hoveredData.delta.wetland)),
        nesting:    Math.max(4,  Math.min(95, withLockAndHelp.nesting    + hoveredData.delta.nesting)),
        water:      Math.max(10, Math.min(95, withLockAndHelp.water      + hoveredData.delta.water)),
        population: Math.max(4,  Math.min(95, withLockAndHelp.population + hoveredData.delta.population)),
      }
    : {
        wetland:    Math.min(92, withLockAndHelp.wetland),
        nesting:    Math.min(92, withLockAndHelp.nesting),
        water:      Math.min(92, withLockAndHelp.water),
        population: Math.min(92, withLockAndHelp.population),
      };

  // Divider: hover overrides; else tally locked types
  const lockedHarmCount = Array.from(lockedIds).filter(id => allSideCards[id]?.type === "harm").length;
  const lockedHopeCount = Array.from(lockedIds).filter(id => allSideCards[id]?.type === "hope").length;
  const dividerPct = hoveredData
    ? (hoveredData.type === "harm" ? 65 : 35)
    : lockedHarmCount > lockedHopeCount ? 62
    : lockedHopeCount > lockedHarmCount ? 38
    : 50;

  const activeEffect = hoveredData?.effect ?? (lockedIds.size === 1 ? allSideCards[Array.from(lockedIds)[0]]?.effect : null);
  const activeType   = hoveredData?.type   ?? (lockedHarmCount > lockedHopeCount ? "harm" : lockedHopeCount > lockedHarmCount ? "hope" : null);
  const showTooltip  = !!activeEffect;

  function toggleHelp(n: number) {
    setActivated(prev => { const next = new Set(prev); next.has(n) ? next.delete(n) : next.add(n); return next; });
    setJustClicked(n);
    setTimeout(() => setJustClicked(null), 700);
  }

  // ── Shared side card row renderer ─────────────────────────────────────────
  function renderSideCard(
    card: typeof harmCards[0],
    color: string,
    type: "harm" | "hope",
  ) {
    const isHov = hoveredId === card.id;
    const isLocked = lockedIds.has(card.id);
    const lit = isHov || isLocked;
    const bright = color.replace(",1)", ",0.9)");
    const faint  = color.replace(",1)", ",0.1)");
    const glow   = color.replace(",1)", ",0.35)");

    return (
      <motion.div
        key={card.id}
        onHoverStart={() => setHoveredId(card.id)}
        onHoverEnd={() => setHoveredId(null)}
        animate={{
          borderColor: lit ? bright : color.replace(",1)", ",0.22)"),
          background:  lit ? faint  : "rgba(0,0,0,1)",
          boxShadow:   isLocked
            ? `0 0 28px ${glow}, inset 0 0 30px ${color.replace(",1)", ",0.07)")}`
            : isHov ? `0 0 16px ${color.replace(",1)", ",0.2)")}` : "none",
        }}
        style={{
          flex: 1, minHeight: 0,
          border: `1.5px solid ${color.replace(",1)", ",0.22)")}`,
          borderRadius: 10, overflow: "hidden",
          display: "flex",
        }}
      >
        {/* LEFT: icon + title + description */}
        <div style={{ flex: 1, minWidth: 0, padding: "11px 10px 11px 12px", display: "flex", gap: 10 }}>
          <span style={{ fontSize: 26, flexShrink: 0, marginTop: 1 }}>{card.icon}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 16, color, fontWeight: 700, letterSpacing: "0.03em", marginBottom: 4 }}>{card.title}</p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 13.5, color: "rgba(255,255,255,0.78)", lineHeight: 1.5 }}>{card.desc}</p>
            <motion.p
              animate={{ opacity: lit ? 1 : 0, y: lit ? 0 : 4 }}
              style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 12.5, color, letterSpacing: "0.07em", marginTop: 6, fontWeight: 700 }}
            >↳ {card.effect}</motion.p>
          </div>
        </div>

        {/* RIGHT: lock button */}
        <div style={{
          width: 58, flexShrink: 0,
          background: isLocked ? color.replace(",1)", ",0.07)") : "rgba(255,255,255,0.03)",
          borderLeft: `1px solid ${isLocked ? color.replace(",1)", ",0.3)") : "rgba(255,255,255,0.08)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "background 0.3s, border-color 0.3s",
        }}>
          <LockBtn
            isLocked={isLocked} isHovered={isHov} color={color}
            onClick={e => { e.stopPropagation(); toggleLock(card.id); }}
          />
        </div>
      </motion.div>
    );
  }

  return (
    <div style={{
      height: "100%", display: "flex", flexDirection: "column",
      padding: "80px 14px 8px", gap: 6, overflow: "hidden",
      boxSizing: "border-box", background: "#000",
    }}>

      {/* ── Title ── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
        style={{ flexShrink: 0, textAlign: "center" }}
      >
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.8rem", color: GOLD, letterSpacing: "0.04em", lineHeight: 1.1 }}>
          Human Impact
        </h1>
        <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 15, color: "rgba(212,175,55,0.88)", marginTop: 4 }}>
          Our footprint has drastically reduced their habitat — but human intervention is now the only thing keeping them alive.
        </p>
      </motion.div>

      {/* ── Harm | Ecosystem | Hope ── */}
      <div style={{ flex: 2, minHeight: 0, display: "grid", gridTemplateColumns: "1fr 1.65fr 1fr", gap: 6 }}>

        {/* HARM column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{
            flexShrink: 0, display: "flex", alignItems: "center", gap: 10,
            padding: "7px 14px", borderRadius: 10,
            background: "rgba(220,50,30,0.1)", border: "1px solid rgba(220,50,30,0.55)",
            boxShadow: "0 0 18px rgba(220,50,30,0.15)",
          }}>
            <span style={{ fontSize: 20 }}>⚠️</span>
            <div>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 21, color: RED, fontWeight: 700, lineHeight: 1 }}>Harm</p>
              <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 10.5, color: "rgba(255,255,255,0.5)", letterSpacing: "0.09em", marginTop: 2 }}>HOVER TO PREVIEW · LOCK TO KEEP</p>
            </div>
          </div>
          {harmCards.map(card => renderSideCard(card, RED, "harm"))}
        </div>

        {/* CENTER */}
        <div style={{
          borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column",
          border: "1px solid rgba(212,175,55,0.2)", background: "#000",
          boxShadow: "0 0 30px rgba(212,175,55,0.07)",
        }}>
          <div style={{ flex: 1, minHeight: 0, position: "relative", overflow: "hidden" }}>
            <img src={wetlandStressed as string} alt="Damaged wetland"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%" }} />
            <motion.div animate={{ clipPath: `inset(0 0 0 ${dividerPct}%)` }} transition={spring}
              style={{ position: "absolute", inset: 0 }}>
              <img src={wetlandHealthy as string} alt="Healthy wetland"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%" }} />
            </motion.div>

            {/* Color overlays */}
            <motion.div
              animate={{ opacity: (hoveredData?.type === "harm" || (!hoveredData && lockedHarmCount > lockedHopeCount)) ? 0.5 : 0.1 }}
              transition={{ duration: 0.4 }}
              style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(200,30,10,0.9) 0%, rgba(200,30,10,0.2) 55%, transparent 100%)", pointerEvents: "none" }} />
            <motion.div
              animate={{ opacity: (hoveredData?.type === "hope" || (!hoveredData && lockedHopeCount > lockedHarmCount)) ? 0.42 : 0.07 }}
              transition={{ duration: 0.4 }}
              style={{ position: "absolute", inset: 0, background: "linear-gradient(to left, rgba(30,180,80,0.85) 0%, rgba(30,180,80,0.15) 55%, transparent 100%)", pointerEvents: "none" }} />
            <motion.div
              animate={{ opacity: activated.size > 0 ? Math.min(0.35, activated.size * 0.09) : 0 }}
              transition={{ duration: 0.7 }}
              style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(50,200,100,0.4) 0%, transparent 70%)", pointerEvents: "none" }} />

            {/* Divider */}
            <motion.div animate={{ left: `${dividerPct}%` }} transition={spring}
              style={{ position: "absolute", top: 0, bottom: 0, width: 2, transform: "translateX(-1px)", background: "rgba(255,255,255,0.9)", boxShadow: "0 0 14px rgba(255,255,255,0.8)", zIndex: 5, pointerEvents: "none" }} />
            <motion.div animate={{ left: `${dividerPct}%` }} transition={spring}
              style={{ position: "absolute", top: "50%", transform: "translate(-50%,-50%)", width: 28, height: 28, borderRadius: "50%", background: "rgba(0,0,0,0.9)", border: "2px solid rgba(255,255,255,0.9)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 6, pointerEvents: "none" }}>
              <span style={{ fontSize: 12, color: "white" }}>⟷</span>
            </motion.div>

            {/* Glowing HARM / HOPE labels */}
            <ImageLabel label="HARM" color={RED}   side="left" />
            <ImageLabel label="HOPE" color={GREEN} side="right" />

            {/* Effect tooltip */}
            <motion.div animate={{ opacity: showTooltip ? 1 : 0, y: showTooltip ? 0 : 6 }} transition={{ duration: 0.25 }}
              style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", background: "rgba(0,0,0,0.92)", border: `1.5px solid ${activeType === "harm" ? "rgba(220,50,30,0.85)" : "rgba(50,200,100,0.85)"}`, borderRadius: 7, padding: "6px 18px", whiteSpace: "nowrap", zIndex: 7, pointerEvents: "none" }}>
              <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 13, color: activeType === "harm" ? RED : GREEN, fontWeight: 700, letterSpacing: "0.07em" }}>
                {activeEffect ?? ""}
              </span>
            </motion.div>
            <motion.div animate={{ opacity: showTooltip ? 0 : 1 }} transition={{ duration: 0.2 }}
              style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", background: "rgba(0,0,0,0.8)", border: "1px solid rgba(212,175,55,0.4)", borderRadius: 7, padding: "6px 16px", whiteSpace: "nowrap", zIndex: 7, pointerEvents: "none" }}>
              <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 11.5, color: "rgba(212,175,55,0.85)", letterSpacing: "0.07em" }}>
                HOVER TO PREVIEW · CLICK 🔒 TO LOCK
              </span>
            </motion.div>

            {/* Locked count badges */}
            {lockedIds.size > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6, zIndex: 4 }}>
                {lockedHarmCount > 0 && (
                  <div style={{ background: "rgba(220,50,30,0.22)", border: "1px solid rgba(220,50,30,0.8)", borderRadius: 20, padding: "2px 10px", fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, color: RED, fontWeight: 700, letterSpacing: "0.06em", boxShadow: "0 0 8px rgba(220,50,30,0.4)" }}>
                    🔒 {lockedHarmCount} HARM
                  </div>
                )}
                {lockedHopeCount > 0 && (
                  <div style={{ background: "rgba(50,200,100,0.18)", border: "1px solid rgba(50,200,100,0.8)", borderRadius: 20, padding: "2px 10px", fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, color: GREEN, fontWeight: 700, letterSpacing: "0.06em", boxShadow: "0 0 8px rgba(50,200,100,0.4)" }}>
                    🔒 {lockedHopeCount} HOPE
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Meters */}
          <div style={{ flexShrink: 0, padding: "9px 16px 11px", borderTop: "1px solid rgba(212,175,55,0.15)" }}>
            <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, color: "rgba(212,175,55,0.6)", letterSpacing: "0.16em", textAlign: "center", marginBottom: 8 }}>ECOSYSTEM HEALTH</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 18px" }}>
              {METERS.map(({ key, label, icon }) => {
                const val = metrics[key];
                const barColor = val < 30 ? "#e63333" : val < 55 ? "#ddaa22" : "#44cc88";
                return (
                  <div key={key}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3, alignItems: "center" }}>
                      <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.78)", letterSpacing: "0.04em" }}>{icon} {label}</span>
                      <motion.span animate={{ color: barColor }} style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 13, fontWeight: 900 }}>{val}%</motion.span>
                    </div>
                    <div style={{ height: 7, background: "rgba(255,255,255,0.1)", borderRadius: 4, overflow: "hidden" }}>
                      <motion.div animate={{ width: `${val}%`, backgroundColor: barColor }} transition={spring} style={{ height: "100%", borderRadius: 4 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* HOPE column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{
            flexShrink: 0, display: "flex", alignItems: "center", gap: 10,
            padding: "7px 14px", borderRadius: 10,
            background: "rgba(50,200,100,0.1)", border: "1px solid rgba(50,200,100,0.55)",
            boxShadow: "0 0 18px rgba(50,200,100,0.15)",
          }}>
            <span style={{ fontSize: 20 }}>🌿</span>
            <div>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 21, color: GREEN, fontWeight: 700, lineHeight: 1 }}>Hope</p>
              <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 10.5, color: "rgba(255,255,255,0.5)", letterSpacing: "0.09em", marginTop: 2 }}>HOVER TO PREVIEW · LOCK TO KEEP</p>
            </div>
          </div>
          {hopeCards.map(card => renderSideCard(card, GREEN, "hope"))}
        </div>
      </div>

      {/* ── HOW YOU CAN HELP ── */}
      <div style={{
        flex: 1.5, minHeight: 0,
        border: "1px solid rgba(212,175,55,0.22)", borderRadius: 12,
        padding: "8px 12px 10px", display: "flex", flexDirection: "column", gap: 6,
        background: "rgba(212,175,55,0.02)", boxShadow: "0 0 24px rgba(212,175,55,0.06)",
      }}>
        <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ flex: 1, height: 1, background: "rgba(212,175,55,0.25)" }} />
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: GOLD, fontWeight: 700, letterSpacing: "0.06em" }}>→ How You Can Help ←</span>
          <AnimatePresence>
            {activated.size > 0 && (
              <motion.span initial={{ opacity: 0, scale: 0.75 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.75 }}
                style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, color: GREEN, letterSpacing: "0.07em", fontWeight: 700 }}>
                {activated.size}/{helpCards.length} ACTIONS TAKEN ✓
              </motion.span>
            )}
          </AnimatePresence>
          <div style={{ flex: 1, height: 1, background: "rgba(212,175,55,0.25)" }} />
        </div>

        <div style={{ flex: 1, minHeight: 0, display: "flex", gap: 7 }}>
          {helpCards.map(card => {
            const isActive  = activated.has(card.n);
            const isPulsing = justClicked === card.n;
            const c       = card.color;
            const cFaint  = c.replace(",1)", ",0.12)");
            const cBorder = c.replace(",1)", ",0.8)");
            const cGlow   = c.replace(",1)", ",0.3)");
            const cMid    = c.replace(",1)", ",0.6)");

            return (
              <motion.div key={card.n}
                onClick={() => toggleHelp(card.n)}
                animate={{
                  borderColor: isActive ? cBorder : GOLDF,
                  background:  isActive ? cFaint  : "rgba(0,0,0,1)",
                  boxShadow:   isActive ? `0 0 22px ${cGlow}, inset 0 0 28px ${c.replace(",1)", ",0.06)")}` : "none",
                  scale: isPulsing ? [1, 1.04, 1] : 1,
                }}
                transition={{ scale: { duration: 0.45 }, default: { duration: 0.3 } }}
                style={{
                  flex: 1, border: `1px solid ${GOLDF}`, borderRadius: 11,
                  padding: "10px 10px 9px", cursor: "pointer",
                  display: "flex", flexDirection: "column", alignItems: "center",
                  textAlign: "center", overflow: "hidden",
                }}
              >
                <span style={{ fontSize: 26, marginBottom: 5 }}>{card.icon}</span>
                <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 15, color: isActive ? c : GOLD, fontWeight: 700, letterSpacing: "0.04em", marginBottom: 4, lineHeight: 1.2 }}>{card.title}</p>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, color: "rgba(255,255,255,0.72)", lineHeight: 1.45, flex: 1 }}>{card.desc}</p>
                <AnimatePresence>
                  {isActive && (
                    <motion.p key="edu"
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}
                      style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 12, color: "rgba(255,255,255,0.82)", lineHeight: 1.42, marginTop: 5, overflow: "hidden" }}>
                      {card.message}
                    </motion.p>
                  )}
                </AnimatePresence>
                <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, color: isActive ? c : "rgba(212,175,55,0.45)", fontWeight: 700, letterSpacing: "0.05em", marginTop: 6, marginBottom: 8 }}>{card.effect}</p>

                {/* Circular Take Action button */}
                <motion.div
                  animate={{
                    background:  isActive ? c : "rgba(0,0,0,0)",
                    borderColor: isActive ? cBorder : "rgba(212,175,55,0.5)",
                    boxShadow:   isActive ? `0 0 22px ${cGlow}, 0 0 8px ${cMid}` : "none",
                    scale:       isPulsing ? [1, 1.2, 1] : 1,
                  }}
                  transition={{ scale: { duration: 0.4 }, default: { duration: 0.35 } }}
                  style={{ width: 56, height: 56, borderRadius: "50%", border: "2px solid rgba(212,175,55,0.5)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                >
                  <AnimatePresence mode="wait">
                    {isActive ? (
                      <motion.span key="tick"
                        initial={{ scale: 0, opacity: 0, rotate: -30 }} animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 280, damping: 18 }}
                        style={{ fontSize: 26, color: "#000", fontWeight: 900, lineHeight: 1 }}>✓</motion.span>
                    ) : (
                      <motion.span key="label"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 9, color: "rgba(212,175,55,0.75)", fontWeight: 700, letterSpacing: "0.07em", lineHeight: 1.3, textAlign: "center" }}>
                        TAKE<br/>ACTION
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
                <motion.span animate={{ opacity: isActive ? 1 : 0 }}
                  style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, color: c, fontWeight: 700, letterSpacing: "0.1em", marginTop: 5 }}>
                  ACTIVATED
                </motion.span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div style={{ flexShrink: 0, textAlign: "center" }}>
        <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 12, color: "rgba(212,175,55,0.45)" }}>
          ℹ️ Every choice matters. Together we can protect Hawaii's wetlands — and the future of the Hawaiian Coot.
        </span>
      </div>
    </div>
  );
}
