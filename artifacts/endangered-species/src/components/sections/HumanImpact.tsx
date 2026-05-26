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
    n: 1, icon: "🏞️",
    title: "Support Wildlife Refuges",
    desc: "Donate or volunteer at local Hawaii wildlife refuges.",
    message: "Protected refuges provide safe nesting and feeding grounds essential for Hawaiian Coot survival.",
    effect: "🛡️ Habitat +15%",
    color: "rgba(100,200,100,1)",
    delta: { wetland: 15, nesting: 12, water: 5, population: 8 },
  },
  {
    n: 2, icon: "🐾",
    title: "Manage Pets",
    desc: "Keep cats indoors and dogs on leash near wetlands.",
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
    effect: "💧 Wetland +20%",
    color: "rgba(50,200,150,1)",
    delta: { wetland: 20, nesting: 8, water: 15, population: 12 },
  },
  {
    n: 4, icon: "🐱",
    title: "Support TNR",
    desc: "Back trap-neuter-return programs for feral cat management.",
    message: "TNR programs reduce feral predator populations that threaten native birds.",
    effect: "🦝 Predator −14%",
    color: "rgba(220,160,80,1)",
    delta: { wetland: 3, nesting: 8, water: 3, population: 14 },
  },
  {
    n: 5, icon: "🔭",
    title: "Report Wildlife",
    desc: "Contact Hawaii Wildlife Center if you spot injured waterbirds.",
    message: "Reporting injured wildlife helps teams respond quickly to protect endangered species.",
    effect: "📈 Population +6%",
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

type SideCardData = {
  type: "harm" | "hope";
  id: string;
  delta: typeof BASE;
  effect: string;
};

// ── SideCard component ────────────────────────────────────────────────────────
function SideCard({
  color, hovered, selected, onEnter, onLeave, onClick, children,
}: {
  color: string; hovered: boolean; selected: boolean;
  onEnter: () => void; onLeave: () => void; onClick: () => void;
  children: React.ReactNode;
}) {
  const lit = hovered || selected;
  return (
    <motion.div
      onHoverStart={onEnter} onHoverEnd={onLeave} onClick={onClick}
      animate={{
        borderColor: lit
          ? (selected ? color.replace("1)", "1)") : color.replace("1)", "0.8)"))
          : color.replace("1)", "0.2)"),
        background: lit ? color.replace("1)", "0.11)") : "rgba(0,0,0,1)",
        boxShadow: selected
          ? `0 0 32px ${color.replace("1)", "0.45)")}, inset 0 0 40px ${color.replace("1)", "0.08)")}`
          : hovered
          ? `0 0 20px ${color.replace("1)", "0.25)")}`
          : "none",
      }}
      style={{
        flex: 1, minHeight: 0,
        border: `1.5px solid ${color.replace("1)", "0.2)")}`,
        borderRadius: 10, padding: "12px 14px",
        cursor: "pointer", overflow: "hidden",
        display: "flex", flexDirection: "column", position: "relative",
      }}
    >
      {/* Pinned indicator */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key="pin"
            initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}
            style={{
              position: "absolute", top: 8, right: 8,
              background: color.replace(",1)", ",0.2)"),
              border: `1px solid ${color.replace(",1)", ",0.7)")}`,
              borderRadius: 6, padding: "2px 7px",
              fontFamily: "'Josefin Sans', sans-serif", fontSize: 9,
              color: color, fontWeight: 700, letterSpacing: "0.08em",
            }}
          >
            LOCKED
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </motion.div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function HumanImpact() {
  const [hoveredSide,  setHoveredSide]  = useState<SideCardData | null>(null);
  const [selectedSide, setSelectedSide] = useState<SideCardData | null>(null);
  const [activated,    setActivated]    = useState<Set<number>>(new Set());
  const [justClicked,  setJustClicked]  = useState<number | null>(null);

  // Effective side card = hovered (preview) overrides selected (locked)
  const activeSide = hoveredSide ?? selectedSide;

  function toggleSide(card: SideCardData) {
    setSelectedSide(prev => (prev?.id === card.id ? null : card));
  }

  // Help boost from activated action cards
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

  const metrics = activeSide
    ? {
        wetland:    Math.max(4,  Math.min(95, withHelp.wetland    + activeSide.delta.wetland)),
        nesting:    Math.max(4,  Math.min(95, withHelp.nesting    + activeSide.delta.nesting)),
        water:      Math.max(10, Math.min(95, withHelp.water      + activeSide.delta.water)),
        population: Math.max(4,  Math.min(95, withHelp.population + activeSide.delta.population)),
      }
    : {
        wetland:    Math.min(92, withHelp.wetland),
        nesting:    Math.min(92, withHelp.nesting),
        water:      Math.min(92, withHelp.water),
        population: Math.min(92, withHelp.population),
      };

  const dividerPct = activeSide ? (activeSide.type === "harm" ? 65 : 35) : 50;
  const showTooltip = !!activeSide;
  const tooltipColor = activeSide?.type === "harm" ? RED : GREEN;

  function toggleHelp(n: number) {
    setActivated(prev => {
      const next = new Set(prev);
      next.has(n) ? next.delete(n) : next.add(n);
      return next;
    });
    setJustClicked(n);
    setTimeout(() => setJustClicked(null), 700);
  }

  const hasSelection = !!selectedSide;
  const hintText = hasSelection
    ? `📌 CLICK AGAIN TO UNLOCK — ${selectedSide!.effect.toUpperCase()}`
    : "HOVER TO PREVIEW · CLICK TO LOCK";

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

      {/* ── Harm | Ecosystem | Hope  (flex: 2 → gives more room to bottom) ── */}
      <div style={{ flex: 2, minHeight: 0, display: "grid", gridTemplateColumns: "1fr 1.65fr 1fr", gap: 6 }}>

        {/* ── HARM ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{
            flexShrink: 0, display: "flex", alignItems: "center", gap: 10,
            padding: "8px 14px", borderRadius: 10,
            background: "rgba(220,50,30,0.1)", border: "1px solid rgba(220,50,30,0.55)",
            boxShadow: "0 0 18px rgba(220,50,30,0.15)",
          }}>
            <span style={{ fontSize: 22 }}>⚠️</span>
            <div>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: RED, fontWeight: 700, lineHeight: 1 }}>Harm</p>
              <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: "0.09em", marginTop: 2 }}>THREATS THAT DESTROY HABITAT</p>
            </div>
          </div>

          {harmCards.map(card => {
            const isHovered  = hoveredSide?.id  === card.id;
            const isSelected = selectedSide?.id === card.id;
            const lit = isHovered || isSelected;
            return (
              <SideCard key={card.id} color={RED}
                hovered={isHovered} selected={isSelected}
                onEnter={() => setHoveredSide({ type: "harm", id: card.id, delta: card.delta, effect: card.effect })}
                onLeave={() => setHoveredSide(null)}
                onClick={() => toggleSide({ type: "harm", id: card.id, delta: card.delta, effect: card.effect })}
              >
                <div style={{ display: "flex", gap: 10 }}>
                  <span style={{ fontSize: 28, flexShrink: 0 }}>{card.icon}</span>
                  <div style={{ flex: 1, minWidth: 0, paddingRight: isSelected ? 40 : 0 }}>
                    <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 17, color: RED, fontWeight: 700, letterSpacing: "0.03em", marginBottom: 5 }}>{card.title}</p>
                    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, color: "rgba(255,255,255,0.8)", lineHeight: 1.55 }}>{card.desc}</p>
                    <motion.p
                      animate={{ opacity: lit ? 1 : 0, y: lit ? 0 : 5 }}
                      style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 13, color: RED, letterSpacing: "0.07em", marginTop: 7, fontWeight: 700 }}
                    >↳ {card.effect}</motion.p>
                  </div>
                </div>
              </SideCard>
            );
          })}
        </div>

        {/* ── CENTER ── */}
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
              animate={{ opacity: activeSide?.type === "harm" ? 0.55 : 0.1 }} transition={{ duration: 0.4 }}
              style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(200,30,10,0.9) 0%, rgba(200,30,10,0.2) 55%, transparent 100%)", pointerEvents: "none" }} />
            <motion.div
              animate={{ opacity: activeSide?.type === "hope" ? 0.45 : 0.07 }} transition={{ duration: 0.4 }}
              style={{ position: "absolute", inset: 0, background: "linear-gradient(to left, rgba(30,180,80,0.85) 0%, rgba(30,180,80,0.15) 55%, transparent 100%)", pointerEvents: "none" }} />
            <motion.div
              animate={{ opacity: activated.size > 0 ? Math.min(0.38, activated.size * 0.1) : 0 }} transition={{ duration: 0.7 }}
              style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(50,200,100,0.4) 0%, transparent 70%)", pointerEvents: "none" }} />

            {/* Divider */}
            <motion.div animate={{ left: `${dividerPct}%` }} transition={spring}
              style={{ position: "absolute", top: 0, bottom: 0, width: 2, transform: "translateX(-1px)", background: "rgba(255,255,255,0.9)", boxShadow: "0 0 14px rgba(255,255,255,0.8)", zIndex: 5, pointerEvents: "none" }} />
            <motion.div animate={{ left: `${dividerPct}%` }} transition={spring}
              style={{ position: "absolute", top: "50%", transform: "translate(-50%,-50%)", width: 28, height: 28, borderRadius: "50%", background: "rgba(0,0,0,0.9)", border: "2px solid rgba(255,255,255,0.9)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 6, pointerEvents: "none" }}>
              <span style={{ fontSize: 12, color: "white" }}>⟷</span>
            </motion.div>

            {/* Corner labels */}
            <div style={{ position: "absolute", top: 10, left: 12, zIndex: 4 }}>
              <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 13, color: RED, letterSpacing: "0.14em", fontWeight: 700, textShadow: "0 2px 8px rgba(0,0,0,1)" }}>HARM</span>
            </div>
            <div style={{ position: "absolute", top: 10, right: 12, zIndex: 4 }}>
              <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 13, color: GREEN, letterSpacing: "0.14em", fontWeight: 700, textShadow: "0 2px 8px rgba(0,0,0,1)" }}>HOPE</span>
            </div>

            {/* Effect tooltip */}
            <motion.div animate={{ opacity: showTooltip ? 1 : 0, y: showTooltip ? 0 : 6 }} transition={{ duration: 0.25 }}
              style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", background: "rgba(0,0,0,0.92)", border: `1.5px solid ${tooltipColor === RED ? "rgba(220,50,30,0.85)" : "rgba(50,200,100,0.85)"}`, borderRadius: 7, padding: "6px 18px", whiteSpace: "nowrap", zIndex: 7, pointerEvents: "none" }}>
              <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 13, color: tooltipColor, fontWeight: 700, letterSpacing: "0.07em" }}>
                {activeSide?.effect ?? ""}
              </span>
            </motion.div>

            {/* Default hint */}
            <motion.div animate={{ opacity: showTooltip ? 0 : 1 }} transition={{ duration: 0.2 }}
              style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", background: "rgba(0,0,0,0.8)", border: "1px solid rgba(212,175,55,0.4)", borderRadius: 7, padding: "6px 16px", whiteSpace: "nowrap", zIndex: 7, pointerEvents: "none" }}>
              <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 11.5, color: "rgba(212,175,55,0.85)", letterSpacing: "0.07em" }}>
                {hintText}
              </span>
            </motion.div>
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

        {/* ── HOPE ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{
            flexShrink: 0, display: "flex", alignItems: "center", gap: 10,
            padding: "8px 14px", borderRadius: 10,
            background: "rgba(50,200,100,0.1)", border: "1px solid rgba(50,200,100,0.55)",
            boxShadow: "0 0 18px rgba(50,200,100,0.15)",
          }}>
            <span style={{ fontSize: 22 }}>🌿</span>
            <div>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: GREEN, fontWeight: 700, lineHeight: 1 }}>Hope</p>
              <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: "0.09em", marginTop: 2 }}>ACTIONS THAT PROTECT & RESTORE</p>
            </div>
          </div>

          {hopeCards.map(card => {
            const isHovered  = hoveredSide?.id  === card.id;
            const isSelected = selectedSide?.id === card.id;
            const lit = isHovered || isSelected;
            return (
              <SideCard key={card.id} color={GREEN}
                hovered={isHovered} selected={isSelected}
                onEnter={() => setHoveredSide({ type: "hope", id: card.id, delta: card.delta, effect: card.effect })}
                onLeave={() => setHoveredSide(null)}
                onClick={() => toggleSide({ type: "hope", id: card.id, delta: card.delta, effect: card.effect })}
              >
                <div style={{ display: "flex", gap: 10 }}>
                  <span style={{ fontSize: 28, flexShrink: 0 }}>{card.icon}</span>
                  <div style={{ flex: 1, minWidth: 0, paddingRight: isSelected ? 40 : 0 }}>
                    <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 17, color: GREEN, fontWeight: 700, letterSpacing: "0.03em", marginBottom: 5 }}>{card.title}</p>
                    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, color: "rgba(255,255,255,0.8)", lineHeight: 1.55 }}>{card.desc}</p>
                    <motion.p
                      animate={{ opacity: lit ? 1 : 0, y: lit ? 0 : 5 }}
                      style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 13, color: GREEN, letterSpacing: "0.07em", marginTop: 7, fontWeight: 700 }}
                    >↳ {card.effect}</motion.p>
                  </div>
                </div>
              </SideCard>
            );
          })}
        </div>
      </div>

      {/* ── HOW YOU CAN HELP  (flex: 1.5 → was flex: 1, more visible now) ── */}
      <div style={{
        flex: 1.5, minHeight: 0,
        border: "1px solid rgba(212,175,55,0.22)", borderRadius: 12,
        padding: "8px 12px 10px", display: "flex", flexDirection: "column", gap: 6,
        background: "rgba(212,175,55,0.02)", boxShadow: "0 0 24px rgba(212,175,55,0.06)",
      }}>
        {/* Header */}
        <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ flex: 1, height: 1, background: "rgba(212,175,55,0.25)" }} />
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: GOLD, fontWeight: 700, letterSpacing: "0.06em" }}>
            → How You Can Help ←
          </span>
          <AnimatePresence>
            {activated.size > 0 && (
              <motion.span
                initial={{ opacity: 0, scale: 0.75 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.75 }}
                style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, color: GREEN, letterSpacing: "0.07em", fontWeight: 700 }}
              >
                {activated.size}/{helpCards.length} ACTIONS TAKEN ✓
              </motion.span>
            )}
          </AnimatePresence>
          <div style={{ flex: 1, height: 1, background: "rgba(212,175,55,0.25)" }} />
        </div>

        {/* Cards */}
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
                  boxShadow:   isActive
                    ? `0 0 22px ${cGlow}, inset 0 0 28px ${c.replace(",1)", ",0.06)")}`
                    : "none",
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

                <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 15, color: isActive ? c : GOLD, fontWeight: 700, letterSpacing: "0.04em", marginBottom: 4, lineHeight: 1.2 }}>
                  {card.title}
                </p>

                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, color: "rgba(255,255,255,0.72)", lineHeight: 1.45, flex: 1 }}>
                  {card.desc}
                </p>

                <AnimatePresence>
                  {isActive && (
                    <motion.p key="edu"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 12, color: "rgba(255,255,255,0.82)", lineHeight: 1.42, marginTop: 5, overflow: "hidden" }}
                    >
                      {card.message}
                    </motion.p>
                  )}
                </AnimatePresence>

                <p style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, color: isActive ? c : "rgba(212,175,55,0.45)", fontWeight: 700, letterSpacing: "0.05em", marginTop: 6, marginBottom: 8 }}>
                  {card.effect}
                </p>

                {/* ── Circular Take Action button ── */}
                <motion.div
                  animate={{
                    background:  isActive ? c : "rgba(0,0,0,0)",
                    borderColor: isActive ? cBorder : "rgba(212,175,55,0.5)",
                    boxShadow:   isActive ? `0 0 22px ${cGlow}, 0 0 8px ${cMid}` : "none",
                    scale:       isPulsing ? [1, 1.2, 1] : 1,
                  }}
                  transition={{ scale: { duration: 0.4 }, default: { duration: 0.35 } }}
                  style={{
                    width: 56, height: 56, borderRadius: "50%",
                    border: "2px solid rgba(212,175,55,0.5)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <AnimatePresence mode="wait">
                    {isActive ? (
                      <motion.span key="tick"
                        initial={{ scale: 0, opacity: 0, rotate: -30 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 280, damping: 18 }}
                        style={{ fontSize: 26, color: "#000", fontWeight: 900, lineHeight: 1 }}
                      >✓</motion.span>
                    ) : (
                      <motion.span key="label"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 9, color: "rgba(212,175,55,0.75)", fontWeight: 700, letterSpacing: "0.07em", lineHeight: 1.3, textAlign: "center" }}
                      >TAKE<br/>ACTION</motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.span
                  animate={{ opacity: isActive ? 1 : 0 }}
                  style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, color: c, fontWeight: 700, letterSpacing: "0.1em", marginTop: 5 }}
                >
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
