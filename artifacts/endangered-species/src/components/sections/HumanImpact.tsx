import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import wetlandHealthy from "@assets/image_1779819729646.png";
import wetlandStressed from "@assets/image_1779819734890.png";

// ── Palette ──────────────────────────────────────────────────────────────────
const GOLD  = "rgba(212,175,55,1)";
const GOLDF = "rgba(212,175,55,0.22)";
const RED   = "rgba(220,50,30,1)";
const GREEN = "rgba(50,200,100,1)";
const panel: React.CSSProperties = { background: "#000", border: `1px solid ${GOLDF}` };
const spring = { type: "spring" as const, stiffness: 100, damping: 20 };

// ── Data ─────────────────────────────────────────────────────────────────────
const BASE = { wetland: 28, nesting: 31, water: 68, population: 42 };

const harmCards = [
  {
    id: "wetland-drainage", icon: "🌊", title: "Wetland Drainage",
    desc: "Historical draining for agriculture and coastal development has eliminated ~70% of Hawaii's natural wetlands.",
    effect: "Habitat loss destroys nesting grounds",
    delta: { wetland: -18, nesting: -12, water: -22, population: -18 },
  },
  {
    id: "predators", icon: "🦝", title: "Introduced Predators",
    desc: "Mongoose, rats, and feral cats brought by human settlement decimate ground-nesting birds.",
    effect: "Predators threaten chicks",
    delta: { wetland: -6, nesting: -20, water: -4, population: -22 },
  },
  {
    id: "pollution", icon: "🏭", title: "Pollution & Disturbance",
    desc: "Pesticide runoff contaminates food sources, while recreational activities and off-leash dogs disturb critical nesting sites.",
    effect: "Pollution damages food sources",
    delta: { wetland: -10, nesting: -8, water: -36, population: -10 },
  },
];

const hopeCards = [
  {
    id: "refuge", icon: "🌿", title: "Refuge Creation",
    desc: "National Wildlife Refuges protect key remaining habitats, managing water levels to maximize breeding success.",
    effect: "Protected habitats improve survival",
    delta: { wetland: 44, nesting: 28, water: 24, population: 36 },
  },
  {
    id: "taro", icon: "🌾", title: "Taro Farmer Partnerships",
    desc: "Collaborations with traditional taro (loi) farmers help maintain agricultural wetlands as crucial secondary habitat.",
    effect: "Traditional agriculture supports wetlands",
    delta: { wetland: 34, nesting: 18, water: 20, population: 24 },
  },
  {
    id: "predator-control", icon: "🛡️", title: "Predator Control",
    desc: "Active trapping and fencing programs around major refuges provide safe havens for chicks to reach adulthood.",
    effect: "Protection improves nesting success",
    delta: { wetland: 10, nesting: 46, water: 10, population: 34 },
  },
];

// ── Take Action cards with full interactive spec ──────────────────────────────
const helpCards = [
  {
    n: 1, icon: "🏞️",
    title: "Support Wildlife Refuges",
    desc: "Donate or volunteer at local Hawaii wildlife refuges.",
    message: "Protected wildlife refuges provide safe nesting and feeding grounds essential for Hawaiian Coot survival.",
    effect: "🛡️ Habitat Stability +15%",
    color: "rgba(100,200,100,1)",
    delta: { wetland: 15, nesting: 12, water: 5, population: 8 },
  },
  {
    n: 2, icon: "🐾",
    title: "Manage Pets",
    desc: "Keep cats indoors and dogs on leash near wetland areas.",
    message: "Keeping pets controlled near wetlands protects vulnerable chicks and nesting birds.",
    effect: "🐣 Chick Survival +18%",
    color: "rgba(100,160,255,1)",
    delta: { wetland: 2, nesting: 10, water: 2, population: 18 },
  },
  {
    n: 3, icon: "🌱",
    title: "Wetland Restoration",
    desc: "Join community workdays to restore and plant native vegetation.",
    message: "Restoring wetlands rebuilds critical feeding and nesting habitats for future generations.",
    effect: "💧 Wetland Health +20%",
    color: "rgba(50,200,150,1)",
    delta: { wetland: 20, nesting: 8, water: 15, population: 12 },
  },
  {
    n: 4, icon: "🐱",
    title: "Support TNR",
    desc: "Back trap-neuter-return programs for feral cat management.",
    message: "Trap-neuter-return programs help reduce feral predator populations that threaten native birds.",
    effect: "🦝 Predator Pressure −14%",
    color: "rgba(220,160,80,1)",
    delta: { wetland: 3, nesting: 8, water: 3, population: 14 },
  },
  {
    n: 5, icon: "🔭",
    title: "Report Wildlife",
    desc: "Contact Hawaii Wildlife Center if you spot injured waterbirds.",
    message: "Reporting injured wildlife helps conservation teams respond quickly and protect endangered species.",
    effect: "📈 Population Stability +6%",
    color: "rgba(160,120,255,1)",
    delta: { wetland: 2, nesting: 4, water: 2, population: 6 },
  },
];

const METERS = [
  { key: "wetland",    label: "Wetland Health",       icon: "💧" },
  { key: "nesting",    label: "Nesting Success",      icon: "🪺" },
  { key: "water",      label: "Water Quality",        icon: "🌊" },
  { key: "population", label: "Population Stability", icon: "🐦" },
] as const;

type HoveredCard = {
  type: "harm" | "hope";
  id: string;
  delta: typeof BASE;
  effect: string;
} | null;

// ── Component ─────────────────────────────────────────────────────────────────
export function HumanImpact() {
  const [hovered,       setHovered]       = useState<HoveredCard>(null);
  const [activated,     setActivated]     = useState<Set<number>>(new Set());
  const [justClicked,   setJustClicked]   = useState<number | null>(null);

  // Sum deltas from all activated help cards
  const helpBoost = Array.from(activated).reduce(
    (acc, n) => {
      const c = helpCards[n - 1];
      return {
        wetland:    acc.wetland    + c.delta.wetland,
        nesting:    acc.nesting    + c.delta.nesting,
        water:      acc.water      + c.delta.water,
        population: acc.population + c.delta.population,
      };
    },
    { wetland: 0, nesting: 0, water: 0, population: 0 }
  );

  const withHelp = {
    wetland:    BASE.wetland    + helpBoost.wetland,
    nesting:    BASE.nesting    + helpBoost.nesting,
    water:      BASE.water      + helpBoost.water,
    population: BASE.population + helpBoost.population,
  };

  const metrics = hovered
    ? {
        wetland:    Math.max(4,  Math.min(95, withHelp.wetland    + hovered.delta.wetland)),
        nesting:    Math.max(4,  Math.min(95, withHelp.nesting    + hovered.delta.nesting)),
        water:      Math.max(10, Math.min(95, withHelp.water      + hovered.delta.water)),
        population: Math.max(4,  Math.min(95, withHelp.population + hovered.delta.population)),
      }
    : {
        wetland:    Math.min(92, withHelp.wetland),
        nesting:    Math.min(92, withHelp.nesting),
        water:      Math.min(92, withHelp.water),
        population: Math.min(92, withHelp.population),
      };

  const dividerPct = hovered ? (hovered.type === "harm" ? 65 : 35) : 50;

  function toggleHelp(n: number) {
    setActivated(prev => {
      const next = new Set(prev);
      next.has(n) ? next.delete(n) : next.add(n);
      return next;
    });
    setJustClicked(n);
    setTimeout(() => setJustClicked(null), 800);
  }

  return (
    <div style={{
      height: "100%", display: "flex", flexDirection: "column",
      padding: "80px 12px 6px", gap: 5, overflow: "hidden",
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
        <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 14, color: "rgba(212,175,55,0.88)", marginTop: 3 }}>
          Our footprint has drastically reduced their habitat, but human intervention is now the only thing keeping them alive.
        </p>
      </motion.div>

      {/* ── Harm | Ecosystem | Hope ── */}
      <div style={{ flex: 3, minHeight: 0, display: "grid", gridTemplateColumns: "1fr 1.7fr 1fr", gap: 5 }}>

        {/* ── Harm ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", ...panel, borderRadius: 8, borderColor: "rgba(220,50,30,0.5)" }}>
            <span style={{ fontSize: 18 }}>⚠️</span>
            <div>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: RED, fontWeight: 700, lineHeight: 1.1 }}>Harm</p>
              <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 9.5, color: "rgba(255,255,255,0.5)", letterSpacing: "0.07em" }}>THREATS THAT DESTROY HABITAT</p>
            </div>
          </div>

          {harmCards.map(card => {
            const active = hovered?.id === card.id;
            return (
              <motion.div key={card.id}
                onHoverStart={() => setHovered({ type: "harm", id: card.id, delta: card.delta, effect: card.effect })}
                onHoverEnd={() => setHovered(null)}
                animate={{
                  borderColor: active ? "rgba(220,50,30,0.95)" : "rgba(220,50,30,0.22)",
                  background:  active ? "rgba(220,50,30,0.13)" : "rgba(0,0,0,1)",
                  boxShadow:   active ? "0 0 22px rgba(220,50,30,0.35), inset 0 0 30px rgba(220,50,30,0.07)" : "none",
                }}
                style={{ flex: 1, minHeight: 0, border: "1px solid rgba(220,50,30,0.22)", borderRadius: 8, padding: "10px 12px", cursor: "default", overflow: "hidden" }}
              >
                <div style={{ display: "flex", gap: 9, height: "100%" }}>
                  <span style={{ fontSize: 24, flexShrink: 0, marginTop: 1 }}>{card.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 14, color: RED, fontWeight: 700, letterSpacing: "0.04em", marginBottom: 4 }}>{card.title}</p>
                    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 12.5, color: "rgba(255,255,255,0.74)", lineHeight: 1.5 }}>{card.desc}</p>
                    <motion.p animate={{ opacity: active ? 1 : 0, y: active ? 0 : 4 }}
                      style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 11, color: RED, letterSpacing: "0.07em", marginTop: 6, fontWeight: 700 }}
                    >↳ {card.effect}</motion.p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Center ecosystem ── */}
        <div style={{ ...panel, borderRadius: 10, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, minHeight: 0, position: "relative", overflow: "hidden" }}>
            <img src={wetlandStressed as string} alt="Damaged wetland"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%" }} />
            <motion.div animate={{ clipPath: `inset(0 0 0 ${dividerPct}%)` }} transition={spring}
              style={{ position: "absolute", inset: 0 }}>
              <img src={wetlandHealthy as string} alt="Healthy wetland"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%" }} />
            </motion.div>
            <motion.div animate={{ opacity: hovered?.type === "harm" ? 0.55 : 0.1 }} transition={{ duration: 0.4 }}
              style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(200,30,10,0.9) 0%, rgba(200,30,10,0.2) 55%, transparent 100%)", pointerEvents: "none" }} />
            <motion.div animate={{ opacity: hovered?.type === "hope" ? 0.45 : 0.07 }} transition={{ duration: 0.4 }}
              style={{ position: "absolute", inset: 0, background: "linear-gradient(to left, rgba(30,180,80,0.85) 0%, rgba(30,180,80,0.15) 55%, transparent 100%)", pointerEvents: "none" }} />
            {/* Help activated glow */}
            <motion.div animate={{ opacity: activated.size > 0 ? Math.min(0.4, activated.size * 0.1) : 0 }} transition={{ duration: 0.6 }}
              style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(50,200,100,0.35) 0%, transparent 70%)", pointerEvents: "none" }} />
            <motion.div animate={{ left: `${dividerPct}%` }} transition={spring}
              style={{ position: "absolute", top: 0, bottom: 0, width: 2, transform: "translateX(-1px)", background: "rgba(255,255,255,0.85)", boxShadow: "0 0 12px rgba(255,255,255,0.7)", zIndex: 5, pointerEvents: "none" }} />
            <motion.div animate={{ left: `${dividerPct}%` }} transition={spring}
              style={{ position: "absolute", top: "50%", transform: "translate(-50%,-50%)", width: 24, height: 24, borderRadius: "50%", background: "rgba(0,0,0,0.85)", border: "2px solid rgba(255,255,255,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 6, pointerEvents: "none" }}>
              <span style={{ fontSize: 11, color: "white" }}>⟷</span>
            </motion.div>
            <div style={{ position: "absolute", top: 9, left: 11, zIndex: 4 }}>
              <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, color: RED, letterSpacing: "0.12em", fontWeight: 700, textShadow: "0 1px 6px rgba(0,0,0,0.95)" }}>HARM</span>
            </div>
            <div style={{ position: "absolute", top: 9, right: 11, zIndex: 4 }}>
              <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, color: GREEN, letterSpacing: "0.12em", fontWeight: 700, textShadow: "0 1px 6px rgba(0,0,0,0.95)" }}>HOPE</span>
            </div>
            <motion.div animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 6 }} transition={{ duration: 0.25 }}
              style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", background: "rgba(0,0,0,0.9)", border: `1.5px solid ${hovered?.type === "harm" ? "rgba(220,50,30,0.8)" : "rgba(50,200,100,0.8)"}`, borderRadius: 6, padding: "5px 16px", whiteSpace: "nowrap", zIndex: 7, pointerEvents: "none" }}>
              <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, color: hovered?.type === "harm" ? RED : GREEN, fontWeight: 700, letterSpacing: "0.07em" }}>{hovered?.effect ?? ""}</span>
            </motion.div>
            <motion.div animate={{ opacity: hovered ? 0 : 1 }} transition={{ duration: 0.2 }}
              style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", background: "rgba(0,0,0,0.75)", border: "1px solid rgba(212,175,55,0.35)", borderRadius: 6, padding: "5px 14px", whiteSpace: "nowrap", zIndex: 7, pointerEvents: "none" }}>
              <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 11, color: "rgba(212,175,55,0.8)", letterSpacing: "0.08em" }}>👆 HOVER ANY CARD TO SEE THE IMPACT</span>
            </motion.div>
          </div>

          {/* Meters */}
          <div style={{ flexShrink: 0, padding: "7px 14px 9px", borderTop: "1px solid rgba(212,175,55,0.15)" }}>
            <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, color: "rgba(212,175,55,0.55)", letterSpacing: "0.14em", textAlign: "center", marginBottom: 6 }}>ECOSYSTEM HEALTH</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 16px" }}>
              {METERS.map(({ key, label, icon }) => {
                const val = metrics[key];
                const barColor = val < 30 ? "#e63333" : val < 55 ? "#ddaa22" : "#44cc88";
                return (
                  <div key={key}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2, alignItems: "center" }}>
                      <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.7)", letterSpacing: "0.04em" }}>{icon} {label}</span>
                      <motion.span animate={{ color: barColor }} style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 11, fontWeight: 900 }}>{val}%</motion.span>
                    </div>
                    <div style={{ height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 3, overflow: "hidden" }}>
                      <motion.div animate={{ width: `${val}%`, backgroundColor: barColor }} transition={spring} style={{ height: "100%", borderRadius: 3 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Hope ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", ...panel, borderRadius: 8, borderColor: "rgba(50,200,100,0.5)" }}>
            <span style={{ fontSize: 18 }}>🌿</span>
            <div>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: GREEN, fontWeight: 700, lineHeight: 1.1 }}>Hope</p>
              <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 9.5, color: "rgba(255,255,255,0.5)", letterSpacing: "0.07em" }}>ACTIONS THAT PROTECT & RESTORE</p>
            </div>
          </div>

          {hopeCards.map(card => {
            const active = hovered?.id === card.id;
            return (
              <motion.div key={card.id}
                onHoverStart={() => setHovered({ type: "hope", id: card.id, delta: card.delta, effect: card.effect })}
                onHoverEnd={() => setHovered(null)}
                animate={{
                  borderColor: active ? "rgba(50,200,100,0.95)" : "rgba(50,200,100,0.22)",
                  background:  active ? "rgba(50,200,100,0.11)" : "rgba(0,0,0,1)",
                  boxShadow:   active ? "0 0 22px rgba(50,200,100,0.3), inset 0 0 30px rgba(50,200,100,0.06)" : "none",
                }}
                style={{ flex: 1, minHeight: 0, border: "1px solid rgba(50,200,100,0.22)", borderRadius: 8, padding: "10px 12px", cursor: "default", overflow: "hidden" }}
              >
                <div style={{ display: "flex", gap: 9, height: "100%" }}>
                  <span style={{ fontSize: 24, flexShrink: 0, marginTop: 1 }}>{card.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 14, color: GREEN, fontWeight: 700, letterSpacing: "0.04em", marginBottom: 4 }}>{card.title}</p>
                    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 12.5, color: "rgba(255,255,255,0.74)", lineHeight: 1.5 }}>{card.desc}</p>
                    <motion.p animate={{ opacity: active ? 1 : 0, y: active ? 0 : 4 }}
                      style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 11, color: GREEN, letterSpacing: "0.07em", marginTop: 6, fontWeight: 700 }}
                    >↳ {card.effect}</motion.p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── How You Can Help ── */}
      <div style={{ flex: 1, minHeight: 0, ...panel, borderRadius: 10, padding: "7px 10px 8px", display: "flex", flexDirection: "column", gap: 5 }}>
        <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ flex: 1, height: 1, background: "rgba(212,175,55,0.22)" }} />
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: GOLD, fontWeight: 700, letterSpacing: "0.05em" }}>
            → How You Can Help ←
          </span>
          {activated.size > 0 && (
            <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, color: GREEN, letterSpacing: "0.06em", fontWeight: 700 }}>
              {activated.size} ACTION{activated.size > 1 ? "S" : ""} TAKEN ✓
            </motion.span>
          )}
          <div style={{ flex: 1, height: 1, background: "rgba(212,175,55,0.22)" }} />
        </div>

        <div style={{ flex: 1, minHeight: 0, display: "flex", gap: 5 }}>
          {helpCards.map(card => {
            const isActive  = activated.has(card.n);
            const isPulsing = justClicked === card.n;
            const c = card.color;
            return (
              <motion.div key={card.n}
                onClick={() => toggleHelp(card.n)}
                animate={{
                  borderColor: isActive ? c.replace("1)", "0.85)") : "rgba(212,175,55,0.22)",
                  background:  isActive ? c.replace("rgba(", "rgba(").replace(",1)", ",0.09)") : "rgba(0,0,0,1)",
                  boxShadow:   isActive ? `0 0 18px ${c.replace(",1)", ",0.25)")}, inset 0 0 20px ${c.replace(",1)", ",0.05)")}` : "none",
                  scale:       isPulsing ? [1, 1.03, 1] : 1,
                }}
                transition={{ scale: { duration: 0.4 }, default: { duration: 0.3 } }}
                style={{ flex: 1, border: "1px solid rgba(212,175,55,0.22)", borderRadius: 9, padding: "8px 10px", cursor: "pointer", display: "flex", flexDirection: "column", overflow: "hidden" }}
              >
                {/* Header row */}
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: isActive ? c.replace(",1)", ",0.25)") : "rgba(212,175,55,0.15)", border: `1.5px solid ${isActive ? c : "rgba(212,175,55,0.5)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.3s" }}>
                    <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, color: isActive ? c : GOLD, fontWeight: 900, lineHeight: 1 }}>{isActive ? "✓" : card.n}</span>
                  </div>
                  <span style={{ fontSize: 19 }}>{card.icon}</span>
                </div>

                {/* Title */}
                <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 12.5, color: isActive ? c : GOLD, fontWeight: 700, letterSpacing: "0.04em", marginBottom: 3, transition: "color 0.3s" }}>{card.title}</p>

                {/* Desc */}
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 11, color: "rgba(255,255,255,0.68)", lineHeight: 1.4, flex: 1 }}>{card.desc}</p>

                {/* Educational message — shown when activated */}
                <AnimatePresence>
                  {isActive && (
                    <motion.p
                      key="msg"
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 4 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      transition={{ duration: 0.35 }}
                      style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 10.5, color: "rgba(255,255,255,0.78)", lineHeight: 1.4, overflow: "hidden" }}
                    >{card.message}</motion.p>
                  )}
                </AnimatePresence>

                {/* Effect badge */}
                <div style={{ marginTop: 5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <motion.span animate={{ color: isActive ? c : "rgba(212,175,55,0.5)", opacity: isActive ? 1 : 0.7 }}
                    style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.05em" }}>
                    {card.effect}
                  </motion.span>
                  <motion.span animate={{ color: isActive ? c : "rgba(212,175,55,0.55)" }}
                    style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, letterSpacing: "0.06em", fontWeight: isActive ? 700 : 400 }}>
                    {isActive ? "ACTIVE ✓" : "Take Action →"}
                  </motion.span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div style={{ flexShrink: 0, textAlign: "center" }}>
        <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 11, color: "rgba(212,175,55,0.45)" }}>
          ℹ️ Every choice matters. Together we can protect Hawaii's wetlands — and the future of the Hawaiian Coot.
        </span>
      </div>
    </div>
  );
}
