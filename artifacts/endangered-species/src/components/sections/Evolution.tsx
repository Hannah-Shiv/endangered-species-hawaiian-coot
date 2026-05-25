import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import cootImg from "@assets/image_1779671102911.png";

// ─── Geometry ────────────────────────────────────────────────────────────────
const CW = 560, CH = 560;
const CX = CW / 2, CY = CH / 2;
const RING_R  = 202;
const NODE_R  = 22;
const LABEL_R = 258;
const CTR_D   = 168;

const toRad = (d: number) => d * Math.PI / 180;

function nodeAngle(n: number) {
  return toRad((n - 1) * 30 - 90);
}
function nodeXY(n: number) {
  const a = nodeAngle(n);
  return { x: CX + RING_R * Math.cos(a), y: CY + RING_R * Math.sin(a) };
}
function labelXY(n: number) {
  const a = nodeAngle(n);
  return { x: CX + LABEL_R * Math.cos(a), y: CY + LABEL_R * Math.sin(a) };
}
function labelTX(n: number): string {
  const a = nodeAngle(n);
  const cosA = Math.cos(a), sinA = Math.sin(a);
  const tx = cosA < -0.2 ? "-100%" : Math.abs(cosA) <= 0.2 ? "-50%" : "0";
  const ty = sinA < -0.15 ? "-100%" : "0";
  return `translate(${tx},${ty})`;
}

// ─── Node data ────────────────────────────────────────────────────────────────
const NODES = [
  {
    n: 1,
    title: "Ancient Rail Ancestors",
    era: "~65 Million Years Ago",
    color: "#00e5cc",
    why: [
      "Rail family emerges after the dinosaur extinction — the evolutionary foundation of all modern rails.",
      "Ground-dwelling adaptations became the blueprint for wetland specialization.",
      "Without Rallidae divergence, the Hawaiian Coot line would never have begun.",
    ],
    details: [
      "Rallidae diverges after the Cretaceous-Paleogene extinction event (65 MYA).",
      "Early rails spread across every major landmass as ecological niches opened up.",
      "Compressed body shape — 'thin as a rail' — evolved for navigating dense wetland vegetation.",
    ],
  },
  {
    n: 2,
    title: "Wetland Adaptation",
    era: "~30 Million Years Ago",
    color: "#22ddff",
    why: [
      "Adapting to marshes was the critical evolutionary step that defined modern coots.",
      "Lobed feet made coots unique among rails — more aquatic than any relative.",
      "Wetland specialization created the ecological niche the Hawaiian Coot would inherit.",
    ],
    details: [
      "Rails begin specializing in shallow freshwater and brackish wetland environments.",
      "Lobed, not webbed, feet evolve — enabling both swimming and walking on mudflats.",
      "Dense reed habitats drive the compressed body form and powerful leg muscles.",
    ],
  },
  {
    n: 3,
    title: "Pacific Expansion",
    era: "~10 Million Years Ago",
    color: "#44bbff",
    why: [
      "The Fulica genus becomes a global success — the most widespread rail lineage on Earth.",
      "Continental distribution proves these birds were built for long-distance dispersal.",
      "Pacific expansion laid the groundwork for the ultimate oceanic crossing to Hawai'i.",
    ],
    details: [
      "Genus Fulica spreads across the Americas, Europe, Africa, and Australasia.",
      "Distinct species evolve on each major landmass through geographic isolation.",
      "Swimming ability distinguishes Fulica from other rails and enables open-water survival.",
    ],
  },
  {
    n: 4,
    title: "Oceanic Dispersal",
    era: "~1 Million Years Ago",
    color: "#6699ff",
    why: [
      "One of the most remarkable overwater colonization events in bird evolution history.",
      "Demonstrates incredible resilience — surviving open ocean to reach isolated islands.",
      "This journey is the sole reason Hawaii has a coot at all.",
    ],
    details: [
      "Storm-assisted dispersal carries ancestral Fulica across the Pacific Ocean.",
      "Birds likely survived on ocean debris during the ~2,500-mile crossing from the Americas.",
      "Genetic evidence suggests the founding population may have been just a few individuals.",
    ],
  },
  {
    n: 5,
    title: "Arrival in Hawai'i",
    era: "~500,000 Years Ago",
    color: "#8866ff",
    why: [
      "Hawaii's rich freshwater wetlands provide a perfect new ecological niche.",
      "Arrival marks the beginning of a uniquely Hawaiian evolutionary story.",
      "These founders carry all the genetic diversity of today's Hawaiian Coot.",
    ],
    details: [
      "Early Fulica populations establish in Hawaiian freshwater marshes and coastal wetlands.",
      "Volcanic island origin creates diverse, nutrient-rich wetland habitats.",
      "Fish ponds (loko iʻa) and taro fields (lo'i) provide abundant food resources.",
    ],
  },
  {
    n: 6,
    title: "Island Isolation",
    era: "~10,000 Years Ago",
    color: "#aa44ff",
    why: [
      "Isolation is the engine of speciation — the Hawaiian Coot becomes uniquely Hawaiian.",
      "Genetic drift in a small island population accelerates evolutionary change.",
      "This period produced the distinctive traits that define Fulica alai today.",
    ],
    details: [
      "Geographic isolation from mainland Fulica populations prevents gene flow.",
      "Natural selection favors traits specific to island wetland conditions.",
      "The white frontal shield — a key diagnostic feature — increases in size and prominence.",
    ],
  },
  {
    n: 7,
    title: "Fulica alai Emerges",
    era: "Ancient Hawai'i",
    color: "#ff44aa",
    why: [
      "A new endemic species is born — uniquely Hawaiian, found nowhere else on Earth.",
      "The Hawaiian name 'ʻalae keokeo' (white-fronted mudhen) reflects deep cultural roots.",
      "Endemism means the world loses something irreplaceable if this species disappears.",
    ],
    details: [
      "Fulica alai is distinguished from American Coot (F. americana) by its larger white frontal shield.",
      "Some individuals show red-tipped shields — a color polymorphism unique to the Hawaiian population.",
      "The species appears in Hawaiian oral tradition and mythology (moʻolelo).",
    ],
  },
  {
    n: 8,
    title: "Native Wetland Ecosystem",
    era: "Pre-human Hawai'i",
    color: "#ff6644",
    why: [
      "Thriving coot numbers reflect the health of intact Hawaiian wetland ecosystems.",
      "Balance between species created a resilient, interconnected food web.",
      "Understanding pre-human abundance sets realistic recovery targets for today.",
    ],
    details: [
      "Hawaiian Coot populations thrive across all major Hawaiian Islands.",
      "Freshwater wetlands, brackish ponds, and coastal lagoons provide diverse habitats.",
      "No mammalian predators in pre-human Hawai'i — ground nests were completely safe.",
    ],
  },
  {
    n: 9,
    title: "Human Settlement Impact",
    era: "1700s – 1900s",
    color: "#ffaa22",
    why: [
      "Human arrival transformed every Hawaiian ecosystem — wetlands suffered most.",
      "Introduced predators changed the survival calculus of ground-nesting birds overnight.",
      "Understanding this impact drives modern conservation strategy and priorities.",
    ],
    details: [
      "Western settlement brings large-scale wetland drainage for agriculture and development.",
      "Introduced predators — rats, mongooses, cats, and dogs — devastate ground-nesting birds.",
      "Market hunting and the feather trade reduce populations further through the late 1800s.",
    ],
  },
  {
    n: 10,
    title: "Near Extinction",
    era: "1970s",
    color: "#ffcc00",
    why: [
      "Fewer than 1,000 birds — a grim milestone that triggered federal protection.",
      "Near-extinction creates genetic bottlenecks that affect populations for generations.",
      "This crisis proved that endemic island birds cannot recover without human intervention.",
    ],
    details: [
      "Hawaiian Coot populations drop to fewer than 1,000 individuals by the early 1970s.",
      "Listed as Endangered under the U.S. Endangered Species Act in 1970.",
      "Combined pressures of wetland loss, introduced predators, and low genetic diversity compound the crisis.",
    ],
  },
  {
    n: 11,
    title: "Conservation Efforts",
    era: "1980s – Present",
    color: "#88dd00",
    why: [
      "Recovery proves that dedicated conservation action can reverse extinction trajectories.",
      "Wetland refuges demonstrate that habitat restoration delivers measurable results.",
      "The coot's comeback became a model for Hawaiian waterbird conservation programs.",
    ],
    details: [
      "James Campbell and Keālia Pond National Wildlife Refuges established as critical habitat.",
      "Predator control programs using traps and fencing protect nesting sites island-wide.",
      "Population rebounds from ~1,000 to over 2,000 birds by the 1990s.",
    ],
  },
  {
    n: 12,
    title: "Hope for the Future",
    era: "Today & Beyond",
    color: "#22ee88",
    why: [
      "Current populations exceed 2,000 birds — a genuine conservation success story.",
      "Student science projects like this one sustain the education pipeline for future conservation.",
      "The Hawaiian Coot proves humanity can choose a different path for endangered species.",
    ],
    details: [
      "Current population: 2,000–2,500+ Hawaiian Coots across the main Hawaiian Islands.",
      "Climate change threatens wetland habitats through sea-level rise and increased drought.",
      "Community education, school programs, and citizen science are vital to long-term survival.",
    ],
  },
];

// ─── Component ───────────────────────────────────────────────────────────────
export function Evolution() {
  const [active, setActive] = useState<number | null>(null);

  const curr = active !== null ? NODES[active - 1] : null;
  const goPrev = () => setActive(a => a == null ? null : a === 1 ? 12 : a - 1);
  const goNext = () => setActive(a => a == null ? null : a === 12 ? 1 : a + 1);

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "#030810",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      fontFamily: "'Josefin Sans', sans-serif",
    }}>

      {/* ── Page header ─────────────────────────────────────────────── */}
      <div style={{
        position: "absolute", top: 16, left: 0, right: 0,
        textAlign: "center", pointerEvents: "none", zIndex: 5,
      }}>
        <div style={{ color: "rgba(0,229,204,0.6)", fontSize: "9.5px", letterSpacing: "4px", textTransform: "uppercase" }}>
          Hawaiian Coot · Fulica alai
        </div>
        <div style={{ color: "#fff", fontFamily: "'Playfair Display', serif", fontSize: "17px", marginTop: 3 }}>
          Evolutionary Journey
        </div>
        <AnimatePresence mode="wait">
          {!active ? (
            <motion.div
              key="hint"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ color: "rgba(255,255,255,0.32)", fontSize: "9.5px", letterSpacing: "2px", marginTop: 4 }}
            >
              Select any milestone to explore its story
            </motion.div>
          ) : (
            <motion.div
              key="active-title"
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ color: curr!.color, fontSize: "11px", letterSpacing: "1.5px", marginTop: 4, fontWeight: 700 }}
            >
              {curr!.title.toUpperCase()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Clock container ─────────────────────────────────────────── */}
      <div style={{ position: "relative", width: CW, height: CH, flexShrink: 0 }}>

        {/* SVG rings + spokes */}
        <svg
          style={{ position: "absolute", inset: 0, overflow: "visible" }}
          width={CW} height={CH}
        >
          {/* Outer hint ring */}
          <circle cx={CX} cy={CY} r={RING_R + NODE_R + 10}
            stroke="rgba(0,229,204,0.09)" strokeWidth={1.5} fill="none" />
          {/* Dashed main ring */}
          <circle cx={CX} cy={CY} r={RING_R}
            stroke="rgba(0,229,204,0.30)" strokeWidth={1} fill="none"
            strokeDasharray="3 9" />
          {/* Inner ring around medallion */}
          <circle cx={CX} cy={CY} r={CTR_D / 2 + 14}
            stroke="rgba(0,229,204,0.22)" strokeWidth={1} fill="none" />
          {/* Spokes */}
          {NODES.map(({ n }) => {
            const a = nodeAngle(n);
            const x1 = CX + (CTR_D / 2 + 16) * Math.cos(a);
            const y1 = CY + (CTR_D / 2 + 16) * Math.sin(a);
            const x2 = CX + (RING_R - NODE_R - 3) * Math.cos(a);
            const y2 = CY + (RING_R - NODE_R - 3) * Math.sin(a);
            return (
              <line key={n} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={active === n ? `${NODES[n-1].color}55` : "rgba(0,229,204,0.13)"}
                strokeWidth={active === n ? 1.5 : 1}
                style={{ transition: "stroke 0.3s" }}
              />
            );
          })}
          {/* Active node outer glow ring */}
          {active !== null && (() => {
            const p = nodeXY(active);
            return (
              <circle cx={p.x} cy={p.y} r={NODE_R + 9}
                fill="none"
                stroke={NODES[active - 1].color}
                strokeWidth={1.5}
                strokeOpacity={0.35}
              />
            );
          })()}
        </svg>

        {/* Center medallion */}
        <motion.div
          animate={{
            boxShadow: [
              "0 0 24px rgba(0,229,204,0.40), 0 0 56px rgba(0,229,204,0.14)",
              "0 0 38px rgba(0,229,204,0.60), 0 0 80px rgba(0,229,204,0.22)",
              "0 0 24px rgba(0,229,204,0.40), 0 0 56px rgba(0,229,204,0.14)",
            ],
          }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            left: CX - CTR_D / 2, top: CY - CTR_D / 2,
            width: CTR_D, height: CTR_D,
            borderRadius: "50%",
            overflow: "hidden",
            border: "2.5px solid rgba(0,229,204,0.50)",
          }}
        >
          <img
            src={cootImg as string}
            alt="Hawaiian Coot"
            style={{
              width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center 58%",
            }}
          />
          {/* Overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: "rgba(3,8,16,0.35)",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
          }}>
            <AnimatePresence mode="wait">
              {active ? (
                <motion.div
                  key={`ctr-${active}`}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.25 }}
                  style={{
                    color: curr!.color,
                    fontSize: "32px", fontWeight: 700,
                    textShadow: `0 0 24px ${curr!.color}`,
                  }}
                >
                  {active}
                </motion.div>
              ) : (
                <motion.div
                  key="ctr-idle"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ textAlign: "center" }}
                >
                  <div style={{ color: "#00e5cc", fontSize: "9px", letterSpacing: "3px" }}>CLICK A</div>
                  <div style={{ color: "#fff", fontFamily: "'Playfair Display',serif", fontSize: "12px", marginTop: 2 }}>milestone</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Node circles */}
        {NODES.map(node => {
          const { x, y } = nodeXY(node.n);
          const isActive = active === node.n;
          return (
            <motion.button
              key={node.n}
              whileHover={{ scale: 1.18 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setActive(isActive ? null : node.n)}
              style={{
                position: "absolute",
                left: x - NODE_R, top: y - NODE_R,
                width: NODE_R * 2, height: NODE_R * 2,
                borderRadius: "50%",
                background: isActive ? node.color : "rgba(3,8,16,0.88)",
                border: `2.5px solid ${node.color}`,
                color: isActive ? "#030810" : node.color,
                fontSize: "12px", fontWeight: 700,
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: isActive
                  ? `0 0 18px ${node.color}cc, 0 0 38px ${node.color}66`
                  : `0 0 8px ${node.color}44`,
                zIndex: 3,
                transition: "background 0.2s, color 0.2s, box-shadow 0.2s",
                outline: "none",
                padding: 0,
              }}
            >
              {node.n}
            </motion.button>
          );
        })}

        {/* Labels */}
        {NODES.map(node => {
          const { x, y } = labelXY(node.n);
          return (
            <div
              key={`lbl-${node.n}`}
              style={{
                position: "absolute",
                left: x, top: y,
                transform: labelTX(node.n),
                pointerEvents: "none",
                maxWidth: 88,
                zIndex: 2,
                opacity: active && active !== node.n ? 0.35 : 1,
                transition: "opacity 0.3s",
              }}
            >
              <div style={{
                color: node.color,
                fontSize: "9.5px", fontWeight: 700,
                lineHeight: 1.25, letterSpacing: "0.3px",
              }}>
                {node.title}
              </div>
              <div style={{
                color: "rgba(255,255,255,0.42)",
                fontSize: "8.5px", lineHeight: 1.25, marginTop: 1,
              }}>
                {node.era}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── LEFT PANEL — Why This Matters ───────────────────────────── */}
      <AnimatePresence>
        {curr && (
          <motion.div
            key="left-panel"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed",
              left: 0, top: 0, bottom: 0,
              width: 262,
              background: "rgba(3,8,16,0.97)",
              borderRight: `1px solid ${curr.color}33`,
              padding: "70px 22px 28px",
              zIndex: 20,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header badge */}
            <motion.div
              key={`lh-${curr.n}`}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}
            >
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: curr.color,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#030810", fontSize: "12px", fontWeight: 700, flexShrink: 0,
              }}>{curr.n}</div>
              <div style={{
                color: "#FFE87C",
                fontSize: "10px", letterSpacing: "2.5px",
                textTransform: "uppercase", fontWeight: 700,
              }}>Why This Matters</div>
            </motion.div>

            {/* Bullets */}
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {curr.why.map((pt, i) => (
                <motion.div
                  key={`${curr.n}-why-${i}`}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.15 + i * 0.07 }}
                  style={{ display: "flex", gap: 10 }}
                >
                  <div style={{ color: curr.color, fontSize: "13px", flexShrink: 0, lineHeight: 1.6 }}>—</div>
                  <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "12.5px", lineHeight: 1.62 }}>{pt}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── RIGHT PANEL — Details + Prev/Next ───────────────────────── */}
      <AnimatePresence>
        {curr && (
          <motion.div
            key="right-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed",
              right: 0, top: 0, bottom: 0,
              width: 278,
              background: "rgba(3,8,16,0.97)",
              borderLeft: `1px solid ${curr.color}33`,
              padding: "70px 24px 28px",
              zIndex: 20,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Badge + title */}
            <motion.div
              key={`rh-${curr.n}`}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: "50%",
                  background: curr.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#030810", fontSize: "15px", fontWeight: 700, flexShrink: 0,
                }}>{curr.n}</div>
                <div style={{
                  color: "#fff", fontSize: "13px", fontWeight: 700,
                  letterSpacing: "0.4px", lineHeight: 1.3,
                }}>{curr.title}</div>
              </div>

              {/* Era */}
              <div style={{
                color: curr.color,
                fontFamily: "'Playfair Display', serif",
                fontSize: "19px", fontStyle: "italic",
                marginBottom: 20, lineHeight: 1.3,
              }}>
                {curr.era}
              </div>
            </motion.div>

            {/* Details */}
            <div style={{ display: "flex", flexDirection: "column", gap: 15, flex: 1 }}>
              {curr.details.map((d, i) => (
                <motion.div
                  key={`${curr.n}-det-${i}`}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.18 + i * 0.07 }}
                  style={{ display: "flex", gap: 10 }}
                >
                  <div style={{ color: curr.color, fontSize: "13px", flexShrink: 0, lineHeight: 1.6 }}>—</div>
                  <div style={{ color: "rgba(255,255,255,0.85)", fontSize: "12.5px", lineHeight: 1.62 }}>{d}</div>
                </motion.div>
              ))}
            </div>

            {/* Prev / Next */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginTop: "auto", paddingTop: 18,
              borderTop: `1px solid ${curr.color}28`,
            }}>
              <button
                onClick={goPrev}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: `1px solid ${curr.color}66`,
                  color: "#fff",
                  padding: "7px 14px", borderRadius: 5,
                  cursor: "pointer", fontSize: "11px",
                  letterSpacing: "1px", fontFamily: "'Josefin Sans',sans-serif",
                }}
              >← PREV</button>
              <div style={{ color: "rgba(255,255,255,0.36)", fontSize: "11px" }}>
                {curr.n} / 12
              </div>
              <button
                onClick={goNext}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: `1px solid ${curr.color}66`,
                  color: "#fff",
                  padding: "7px 14px", borderRadius: 5,
                  cursor: "pointer", fontSize: "11px",
                  letterSpacing: "1px", fontFamily: "'Josefin Sans',sans-serif",
                }}
              >NEXT →</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
