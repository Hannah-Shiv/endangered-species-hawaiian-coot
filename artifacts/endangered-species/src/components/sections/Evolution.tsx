import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import cootImg from "@assets/image_1779671102911.png";

// ─── Geometry ────────────────────────────────────────────────────────────────
const CW = 460, CH = 460;
const CX = CW / 2, CY = CH / 2;   // 230, 230
const RING_R  = 170;
const NODE_R  = 24;
const LABEL_R = 218;
const CTR_D   = 142;

const toRad = (d: number) => d * Math.PI / 180;

// n=12 at 12 o'clock (top), clockwise
function nodeAngle(n: number) { return toRad(n * 30 - 90); }
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
  const cx = Math.cos(a), sy = Math.sin(a);
  const tx = cx < -0.2 ? "-100%" : Math.abs(cx) <= 0.2 ? "-50%" : "0";
  const ty = sy < -0.15 ? "-100%" : "0";
  return `translate(${tx},${ty})`;
}

// ─── Node data ────────────────────────────────────────────────────────────────
const NODES = [
  {
    n: 1, title: "Ancient Rail Ancestors", era: "~65 Million Years Ago",
    color: "#00e5cc",
    why: [
      "Rail family emerges after the dinosaur extinction — the evolutionary foundation of all modern rails.",
      "Ground-dwelling adaptations became the blueprint for wetland specialization.",
      "Without Rallidae divergence, the Hawaiian Coot line would never have begun.",
    ],
    details: [
      "Rallidae diverges after the Cretaceous-Paleogene extinction event (65 MYA).",
      "Early rails spread across every major landmass as ecological niches opened up.",
      "'Thin as a rail' — the compressed body evolved for navigating dense wetland vegetation.",
    ],
  },
  {
    n: 2, title: "Wetland Adaptation", era: "~30 Million Years Ago",
    color: "#22ddff",
    why: [
      "Adapting to marshes was the critical evolutionary step that defined modern coots.",
      "Lobed feet made coots unique among rails — more aquatic than any relative.",
      "Wetland specialization created the niche the Hawaiian Coot would inherit.",
    ],
    details: [
      "Rails begin specializing in shallow freshwater and brackish wetland environments.",
      "Lobed, not webbed, feet evolve — enabling both swimming and walking on mudflats.",
      "Dense reed habitats drive the compressed body form and powerful leg muscles.",
    ],
  },
  {
    n: 3, title: "Pacific Expansion", era: "~10 Million Years Ago",
    color: "#44bbff",
    why: [
      "The Fulica genus becomes a global success — the most widespread rail lineage on Earth.",
      "Continental distribution proves these birds were built for long-distance dispersal.",
      "Pacific expansion laid the groundwork for the oceanic crossing to Hawai'i.",
    ],
    details: [
      "Genus Fulica spreads across the Americas, Europe, Africa, and Australasia.",
      "Distinct species evolve on each major landmass through geographic isolation.",
      "Swimming ability distinguishes Fulica from other rails and enables open-water survival.",
    ],
  },
  {
    n: 4, title: "Oceanic Dispersal", era: "~1 Million Years Ago",
    color: "#6699ff",
    why: [
      "One of the most remarkable overwater colonization events in bird evolution history.",
      "Demonstrates incredible resilience — surviving open ocean to reach isolated islands.",
      "This journey is the sole reason Hawaii has a coot at all.",
    ],
    details: [
      "Storm-assisted dispersal carries ancestral Fulica across the Pacific Ocean.",
      "Birds likely survived on ocean debris during the ~2,500-mile crossing.",
      "Genetic evidence suggests the founding population may have been just a few individuals.",
    ],
  },
  {
    n: 5, title: "Arrival in Hawai'i", era: "~500,000 Years Ago",
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
    n: 6, title: "Island Isolation", era: "~10,000 Years Ago",
    color: "#aa44ff",
    why: [
      "Isolation is the engine of speciation — the Hawaiian Coot becomes uniquely Hawaiian.",
      "Genetic drift in a small island population accelerates evolutionary change.",
      "This period produced the distinctive traits that define Fulica alai today.",
    ],
    details: [
      "Geographic isolation from mainland Fulica populations prevents gene flow.",
      "Natural selection favors traits specific to island wetland conditions.",
      "The white frontal shield — a key diagnostic feature — increases in size.",
    ],
  },
  {
    n: 7, title: "Fulica alai Emerges", era: "Ancient Hawai'i",
    color: "#ff44aa",
    why: [
      "A new endemic species is born — uniquely Hawaiian, found nowhere else on Earth.",
      "The Hawaiian name 'ʻalae keokeo' reflects deep cultural roots in the islands.",
      "Endemism means the world loses something irreplaceable if this species disappears.",
    ],
    details: [
      "Fulica alai is distinguished from American Coot by its larger white frontal shield.",
      "Some individuals show red-tipped shields — a polymorphism unique to Hawaii.",
      "The species appears in Hawaiian oral tradition and mythology (moʻolelo).",
    ],
  },
  {
    n: 8, title: "Native Wetland Ecosystem", era: "Pre-human Hawai'i",
    color: "#ff6644",
    why: [
      "Thriving numbers reflect the health of intact Hawaiian wetland ecosystems.",
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
    n: 9, title: "Human Settlement Impact", era: "1700s – 1900s",
    color: "#ffaa22",
    why: [
      "Human arrival transformed every Hawaiian ecosystem — wetlands suffered most.",
      "Introduced predators changed the survival calculus of ground-nesting birds overnight.",
      "Understanding this impact drives modern conservation strategy.",
    ],
    details: [
      "Western settlement brings large-scale wetland drainage for agriculture and development.",
      "Introduced predators — rats, mongooses, cats, dogs — devastate ground-nesting birds.",
      "Market hunting and the feather trade reduce populations through the late 1800s.",
    ],
  },
  {
    n: 10, title: "Near Extinction", era: "1970s",
    color: "#ffcc00",
    why: [
      "Fewer than 1,000 birds — a grim milestone that triggered federal protection.",
      "Near-extinction creates genetic bottlenecks affecting populations for generations.",
      "This crisis proved endemic island birds cannot recover without human intervention.",
    ],
    details: [
      "Hawaiian Coot populations drop to fewer than 1,000 individuals by the early 1970s.",
      "Listed as Endangered under the U.S. Endangered Species Act in 1970.",
      "Wetland loss, introduced predators, and low genetic diversity compound the crisis.",
    ],
  },
  {
    n: 11, title: "Conservation Efforts", era: "1980s – Present",
    color: "#88dd00",
    why: [
      "Recovery proves that dedicated conservation action can reverse extinction trajectories.",
      "Wetland refuges demonstrate that habitat restoration delivers measurable results.",
      "The coot's comeback became a model for Hawaiian waterbird conservation.",
    ],
    details: [
      "James Campbell and Keālia Pond National Wildlife Refuges established as critical habitat.",
      "Predator control programs using traps and fencing protect nesting sites island-wide.",
      "Population rebounds from ~1,000 to over 2,000 birds by the 1990s.",
    ],
  },
  {
    n: 12, title: "Hope for the Future", era: "Today & Beyond",
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
  const [active,  setActive]  = useState<number | null>(1);
  const [hovered, setHovered] = useState<number | null>(null);

  const curr = active !== null ? NODES[active - 1] : null;
  const goPrev = () => setActive(a => a == null ? 1 : a === 1 ? 12 : a - 1);
  const goNext = () => setActive(a => a == null ? 1 : a === 12 ? 1 : a + 1);

  // A node is visually "lit" when active OR hovered
  const isLit = (n: number) => active === n || hovered === n;

  // Panels: height 400px, vertically centered at 50vh+40px (due to paddingTop:80)
  const PANEL_H = 400;
  const panelTopCSS = `calc(50vh - ${PANEL_H / 2 - 40}px)`;

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "#050e1f",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      paddingTop: "80px",
      boxSizing: "border-box",
      overflow: "hidden",
      fontFamily: "'Josefin Sans', sans-serif",
    }}>

      {/* ── Clock container ──────────────────────────────────────────── */}
      <div style={{
        position: "relative",
        width: CW, height: CH,
        flexShrink: 0,
        overflow: "visible",
      }}>

        {/* Active title + era — floats inside ring, above center circle */}
        <AnimatePresence mode="wait">
          {curr && (
            <motion.div
              key={`title-${curr.n}`}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28 }}
              style={{
                position: "absolute",
                top: CY - CTR_D / 2 - 68,
                left: 0, right: 0,
                textAlign: "center",
                pointerEvents: "none",
                zIndex: 10,
              }}
            >
              <div style={{
                color: "#fff",
                fontFamily: "'Josefin Sans', sans-serif",
                fontSize: "18px", fontWeight: 700,
                letterSpacing: "0.5px",
                textShadow: `0 0 18px rgba(0,0,0,0.8)`,
              }}>
                {curr.title}
              </div>
              <div style={{
                color: curr.color,
                fontFamily: "'Playfair Display', serif",
                fontSize: "15px", fontStyle: "italic",
                marginTop: 3,
                textShadow: `0 0 12px ${curr.color}88`,
              }}>
                {curr.era}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SVG rings + spokes */}
        <svg
          style={{ position: "absolute", inset: 0, overflow: "visible" }}
          width={CW} height={CH}
        >
          {/* Outermost hint ring */}
          <circle cx={CX} cy={CY} r={RING_R + NODE_R + 10}
            stroke="rgba(0,229,204,0.08)" strokeWidth={1.5} fill="none" />
          {/* Dashed main ring */}
          <circle cx={CX} cy={CY} r={RING_R}
            stroke="rgba(0,229,204,0.25)" strokeWidth={1} fill="none"
            strokeDasharray="3 10" />
          {/* Inner ring around medallion */}
          <circle cx={CX} cy={CY} r={CTR_D / 2 + 12}
            stroke="rgba(0,229,204,0.18)" strokeWidth={1} fill="none" />
          {/* Spokes */}
          {NODES.map(({ n }) => {
            const a  = nodeAngle(n);
            const x1 = CX + (CTR_D / 2 + 14) * Math.cos(a);
            const y1 = CY + (CTR_D / 2 + 14) * Math.sin(a);
            const x2 = CX + (RING_R - NODE_R - 3) * Math.cos(a);
            const y2 = CY + (RING_R - NODE_R - 3) * Math.sin(a);
            return (
              <line key={n} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={isLit(n) ? `${NODES[n-1].color}66` : "rgba(0,229,204,0.11)"}
                strokeWidth={isLit(n) ? 2 : 1}
                style={{ transition: "stroke 0.25s, stroke-width 0.25s" }}
              />
            );
          })}
          {/* Active node outer halo ring */}
          {active !== null && (() => {
            const p = nodeXY(active);
            return (
              <circle cx={p.x} cy={p.y} r={NODE_R + 8}
                fill="none"
                stroke={NODES[active - 1].color}
                strokeWidth={2}
                strokeOpacity={0.50}
              />
            );
          })()}
        </svg>

        {/* Center medallion — pure bird photo, NO text */}
        <motion.div
          animate={{
            boxShadow: [
              "0 0 20px rgba(0,229,204,0.35), 0 0 50px rgba(0,229,204,0.10)",
              "0 0 34px rgba(0,229,204,0.55), 0 0 72px rgba(0,229,204,0.18)",
              "0 0 20px rgba(0,229,204,0.35), 0 0 50px rgba(0,229,204,0.10)",
            ],
          }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            left: CX - CTR_D / 2, top: CY - CTR_D / 2,
            width: CTR_D, height: CTR_D,
            borderRadius: "50%",
            overflow: "hidden",
            border: "3px solid rgba(0,229,204,0.45)",
          }}
        >
          <img
            src={cootImg as string}
            alt="Hawaiian Coot"
            style={{
              width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center 58%",
              display: "block",
            }}
          />
          {/* Absolutely nothing else here — no overlay, no text */}
        </motion.div>

        {/* ── Node circles — numbered 1–12 ────────────────────────── */}
        {NODES.map(node => {
          const { x, y } = nodeXY(node.n);
          const isActive = active === node.n;
          const lit = isLit(node.n);
          return (
            <div
              key={node.n}
              onMouseEnter={() => setHovered(node.n)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setActive(isActive ? null : node.n)}
              style={{
                position: "absolute",
                left: x - NODE_R, top: y - NODE_R,
                width: NODE_R * 2, height: NODE_R * 2,
                borderRadius: "50%",
                background: isActive
                  ? node.color
                  : lit
                    ? `${node.color}22`
                    : "rgba(5,14,31,0.92)",
                border: `3px solid ${node.color}`,
                color: isActive ? "#050e1f" : node.color,
                fontSize: "15px", fontWeight: 700,
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: lit
                  ? `0 0 22px ${node.color}dd, 0 0 44px ${node.color}88`
                  : `0 0 8px ${node.color}44`,
                zIndex: 3,
                transform: lit && !isActive ? "scale(1.16)" : "scale(1)",
                transition: "background 0.22s, box-shadow 0.22s, color 0.22s, border-color 0.22s, transform 0.18s",
                outline: "none",
                userSelect: "none",
              }}
            >
              {node.n}
            </div>
          );
        })}

        {/* ── Labels — hoverable, glow with their node ────────────── */}
        {NODES.map(node => {
          const { x, y } = labelXY(node.n);
          const lit = isLit(node.n);
          return (
            <div
              key={`lbl-${node.n}`}
              onMouseEnter={() => setHovered(node.n)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setActive(active === node.n ? null : node.n)}
              style={{
                position: "absolute",
                left: x, top: y,
                transform: labelTX(node.n),
                pointerEvents: "auto",
                maxWidth: 96,
                zIndex: 4,
                cursor: "pointer",
                opacity: active && active !== node.n && hovered !== node.n ? 0.38 : 1,
                transition: "opacity 0.3s",
              }}
            >
              <div style={{
                color: "#fff",
                fontSize: "13px", fontWeight: 700,
                lineHeight: 1.25, letterSpacing: "0.3px",
                textShadow: lit
                  ? `0 0 10px ${node.color}, 0 0 22px ${node.color}99`
                  : "none",
                transition: "text-shadow 0.25s",
              }}>
                {node.title}
              </div>
              <div style={{
                color: lit ? node.color : "rgba(255,255,255,0.55)",
                fontSize: "11px", lineHeight: 1.25, marginTop: 2,
                fontStyle: "italic",
                fontWeight: lit ? 600 : 400,
                textShadow: lit ? `0 0 8px ${node.color}aa` : "none",
                transition: "color 0.25s, text-shadow 0.25s",
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
            transition={{ duration: 0.40, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed",
              left: 0,
              top: panelTopCSS,
              height: PANEL_H,
              width: 268,
              background: "rgba(5,14,31,0.97)",
              borderRight: `1px solid ${curr.color}44`,
              borderTop: `1px solid ${curr.color}22`,
              borderBottom: `1px solid ${curr.color}22`,
              borderRadius: "0 14px 14px 0",
              padding: "28px 24px",
              zIndex: 20,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <motion.div
              key={`lh-${curr.n}`}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.26, delay: 0.08 }}
              style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}
            >
              <div style={{
                width: 30, height: 30, borderRadius: "50%",
                background: curr.color,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#050e1f", fontSize: "14px", fontWeight: 700, flexShrink: 0,
              }}>{curr.n}</div>
              <div style={{
                color: "#FFE87C",
                fontSize: "11px", letterSpacing: "2.5px",
                textTransform: "uppercase", fontWeight: 700,
              }}>Why This Matters</div>
            </motion.div>

            <div style={{ display: "flex", flexDirection: "column", gap: 18, flex: 1 }}>
              {curr.why.map((pt, i) => (
                <motion.div key={`${curr.n}-why-${i}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.26, delay: 0.14 + i * 0.07 }}
                  style={{ display: "flex", gap: 10 }}
                >
                  <div style={{ color: curr.color, fontSize: "16px", flexShrink: 0, lineHeight: 1.55 }}>—</div>
                  <div style={{ color: "rgba(255,255,255,0.90)", fontSize: "14px", lineHeight: 1.65 }}>{pt}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── RIGHT PANEL — Details ────────────────────────────────────── */}
      <AnimatePresence>
        {curr && (
          <motion.div
            key="right-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.40, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed",
              right: 0,
              top: panelTopCSS,
              height: PANEL_H,
              width: 276,
              background: "rgba(5,14,31,0.97)",
              borderLeft: `1px solid ${curr.color}44`,
              borderTop: `1px solid ${curr.color}22`,
              borderBottom: `1px solid ${curr.color}22`,
              borderRadius: "14px 0 0 14px",
              padding: "28px 26px",
              zIndex: 20,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <motion.div
              key={`rh-${curr.n}`}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.26, delay: 0.08 }}
            >
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 10 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: "50%",
                  background: curr.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#050e1f", fontSize: "15px", fontWeight: 700, flexShrink: 0,
                }}>{curr.n}</div>
                <div style={{
                  color: "#fff", fontSize: "15px", fontWeight: 700,
                  letterSpacing: "0.3px", lineHeight: 1.3,
                }}>{curr.title}</div>
              </div>

              <div style={{
                color: curr.color,
                fontFamily: "'Playfair Display', serif",
                fontSize: "21px", fontStyle: "italic",
                marginBottom: 20, lineHeight: 1.3,
                textShadow: `0 0 14px ${curr.color}66`,
              }}>
                {curr.era}
              </div>
            </motion.div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
              {curr.details.map((d, i) => (
                <motion.div key={`${curr.n}-det-${i}`}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.26, delay: 0.16 + i * 0.07 }}
                  style={{ display: "flex", gap: 10 }}
                >
                  <div style={{ color: curr.color, fontSize: "16px", flexShrink: 0, lineHeight: 1.55 }}>—</div>
                  <div style={{ color: "rgba(255,255,255,0.90)", fontSize: "14px", lineHeight: 1.65 }}>{d}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── PREV / NEXT — fixed, just below clock, clear of ✕ button ── */}
      <AnimatePresence>
        {curr && (
          <motion.div
            key="nav-bar"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.32 }}
            style={{
              position: "fixed",
              bottom: "16px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
              gap: 16,
              zIndex: 25,
              background: "rgba(5,14,31,0.92)",
              border: `1px solid ${curr.color}44`,
              borderRadius: 40,
              padding: "9px 20px",
              whiteSpace: "nowrap",
            }}
          >
            <button onClick={goPrev} style={{
              background: "none", border: "none",
              color: curr.color, fontSize: "14px", fontWeight: 700,
              letterSpacing: "1.5px", cursor: "pointer",
              fontFamily: "'Josefin Sans',sans-serif",
              padding: "2px 4px",
            }}>← PREV</button>

            <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
              {NODES.map(n => (
                <button key={n.n} onClick={() => setActive(n.n)} style={{
                  width: active === n.n ? 20 : 6,
                  height: 6, borderRadius: 3,
                  background: active === n.n ? n.color : "rgba(255,255,255,0.22)",
                  border: "none", cursor: "pointer", padding: 0,
                  transition: "all 0.28s",
                  flexShrink: 0,
                }} />
              ))}
            </div>

            <div style={{
              color: "rgba(255,255,255,0.45)",
              fontSize: "13px", minWidth: 34, textAlign: "center",
            }}>
              {curr.n} / 12
            </div>

            <button onClick={goNext} style={{
              background: "none", border: "none",
              color: curr.color, fontSize: "14px", fontWeight: 700,
              letterSpacing: "1.5px", cursor: "pointer",
              fontFamily: "'Josefin Sans',sans-serif",
              padding: "2px 4px",
            }}>NEXT →</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
