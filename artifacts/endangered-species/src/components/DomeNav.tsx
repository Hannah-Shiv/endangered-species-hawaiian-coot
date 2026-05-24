/**
 * DomeNav — 6 main circles in a downward semicircle, each expanding to 2 sub-item pills.
 * Adapted directly from TSA dome-nav.js / dome-nav.css:
 *   • Green (#22c55e) accent instead of red
 *   • Hamburger 3-line icon rotates 90° when open (horizontal → vertical)
 *   • Circles scale out from hamburger center via transform-origin animation
 *   • Sub-items scale out from their parent circle center
 *   • SVG stroke-dashoffset connector paths draw in on open
 *   • Intelligence threads (gold bezier arcs + pulsing dots) appear on open
 */
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

// ─── Data ──────────────────────────────────────────────────────────────────────
interface SubItem { key: string; label: string; num: string; }
interface MainGroup {
  key: string; num: string; label: string[]; icon: string;
  items: SubItem[];
}

const MAIN_GROUPS: MainGroup[] = [
  {
    key: "the-species", num: "01", icon: "🐦",
    label: ["THE", "SPECIES"],
    items: [
      { key: "Meet the Species", label: "Meet the Species", num: "01a" },
      { key: "Evolution",        label: "Evolution & Classification", num: "01b" },
    ],
  },
  {
    key: "habitat", num: "02", icon: "🌿",
    label: ["HABITAT", "& FOOD"],
    items: [
      { key: "Habitat & Location", label: "Habitat & Location", num: "02a" },
      { key: "Food Web",           label: "Food Web",           num: "02b" },
    ],
  },
  {
    key: "climate", num: "03", icon: "🌧",
    label: ["CLIMATE", "& CHANGE"],
    items: [
      { key: "Climate Stressors",  label: "Climate Stressors",  num: "03a" },
      { key: "Patterns of Change", label: "Patterns of Change", num: "03b" },
    ],
  },
  {
    key: "threats", num: "04", icon: "⚠",
    label: ["THREATS", "& IMPACT"],
    items: [
      { key: "Human Impact", label: "Human Impact", num: "04a" },
      { key: "Predators",    label: "Predators",    num: "04b" },
    ],
  },
  {
    key: "survival", num: "05", icon: "🌱",
    label: ["SURVIVAL", "& ACTION"],
    items: [
      { key: "Adaptations",              label: "Adaptations",              num: "05a" },
      { key: "Conservation & Solutions", label: "Conservation & Solutions", num: "05b" },
    ],
  },
  {
    key: "future", num: "06", icon: "📊",
    label: ["FUTURE", "& DATA"],
    items: [
      { key: "Extinction Risk",     label: "Extinction Risk",     num: "06a" },
      { key: "Sources & Citations", label: "Sources & Citations", num: "06b" },
    ],
  },
];

// ─── Geometry ──────────────────────────────────────────────────────────────────
const BTN       = 72;   // hamburger diameter
const HALF      = BTN / 2;   // 36 — center of wrap div
const ITEM      = 86;   // main circle diameter
const ITEM_HALF = ITEM / 2;  // 43
const R         = 160;  // semicircle radius

/** Downward semicircle: i=0 → left, i=5 → right, i=2/3 → bottom */
function circlePos(i: number, total: number, radius: number) {
  const theta = (i / (total - 1)) * Math.PI;
  return {
    x: Math.round(-radius * Math.cos(theta)),
    y: Math.round( radius * Math.sin(theta)),
  };
}

const MAIN_POSITIONS = MAIN_GROUPS.map((_, i) =>
  circlePos(i, MAIN_GROUPS.length, R)
);

/**
 * Sub-item pill offsets (dx, dy) from main circle center, in wrap-space pixels.
 * Left-side circles: pills extend rightward; right-side: leftward; center: toward center.
 */
const SUB_OFFSETS: [number, number][][] = [
  [[96, 26], [96, 66]],    // i=0: leftmost  → right & below
  [[82, 18], [82, 54]],    // i=1: left
  [[52, -2], [52, 34]],    // i=2: center-left → slightly right
  [[-52,-2],[-52, 34]],    // i=3: center-right (mirror)
  [[-82, 18],[-82, 54]],   // i=4: right (mirror)
  [[-96, 26],[-96, 66]],   // i=5: rightmost (mirror)
];

// Pill size
const PILL_W = 148;
const PILL_H = 36;

// ─── Intelligence Threads ──────────────────────────────────────────────────────
function IntelThreads({ visible }: { visible: boolean }) {
  type Arc = { d: string; opacity: number; dots: { cx: number; cy: number; delay: number }[] };
  const [arcs, setArcs] = useState<Arc[]>([]);
  const [vw, setVw]     = useState(1280);

  useEffect(() => {
    const W  = window.innerWidth;
    const lx = W / 2 - HALF, ly = HALF;
    const rx = W / 2 + HALF, ry = HALF;
    setVw(W);

    function qb(t: number, x0: number, y0: number, cpx: number, cpy: number, x1: number, y1: number) {
      const m = 1 - t;
      return { x: m*m*x0 + 2*m*t*cpx + t*t*x1, y: m*m*y0 + 2*m*t*cpy + t*t*y1 };
    }
    const list: Arc[] = [];
    function arc(ox: number, oy: number, cpx: number, cpy: number, ex: number, ey: number, op: number, dts: [number,number][]) {
      list.push({
        d: `M ${ox},${oy} Q ${cpx},${cpy} ${ex},${ey}`,
        opacity: op,
        dots: dts.map(([t, delay]) => {
          const p = qb(t, ox, oy, cpx, cpy, ex, ey);
          return { cx: +p.x.toFixed(1), cy: +p.y.toFixed(1), delay };
        }),
      });
    }
    const rw = W - rx;
    // Left arcs
    arc(lx,ly, lx*0.42,ly, 0,36, 0.30, [[0.28,0.00],[0.60,0.42],[0.88,0.80]]);
    arc(lx,ly, lx*0.28,6,  4, 0, 0.22, [[0.30,0.18],[0.65,0.62]]);
    arc(lx,ly, lx*0.36,82, 0,124,0.26, [[0.32,0.38],[0.68,0.78]]);
    arc(lx,ly, lx*0.50,56, 0,72, 0.19, [[0.38,0.64]]);
    // Right arcs (mirror)
    arc(rx,ry, rx+rw*0.58,ry, W,36,  0.30, [[0.28,0.08],[0.60,0.48],[0.88,0.86]]);
    arc(rx,ry, rx+rw*0.72, 6, W-4,0, 0.22, [[0.30,0.22],[0.65,0.68]]);
    arc(rx,ry, rx+rw*0.64,82, W,124, 0.26, [[0.32,0.42],[0.68,0.82]]);
    arc(rx,ry, rx+rw*0.50,56, W,72,  0.19, [[0.38,0.68]]);
    setArcs(list);
  }, []);

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${vw} 150`}
      preserveAspectRatio="none"
      style={{
        position: "fixed", top: 0, left: 0, width: "100%", height: "150px",
        pointerEvents: "none", zIndex: 9997,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.45s ease",
      }}
    >
      <defs>
        <filter id="dn-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {arcs.map((a, i) => (
        <g key={i}>
          <path d={a.d} stroke={`rgba(212,175,55,${a.opacity})`} strokeWidth="1.1" fill="none"/>
          {a.dots.map((dot, j) => (
            <circle key={j} cx={dot.cx} cy={dot.cy} r="2.8"
              fill="rgba(255,185,45,0.9)" filter="url(#dn-glow)"
              style={{ animation:"dotPulse 2.4s ease-in-out infinite", animationDelay:`${dot.delay}s` }}
            />
          ))}
        </g>
      ))}
    </svg>
  );
}

// ─── DomeNav ───────────────────────────────────────────────────────────────────
interface DomeNavProps {
  onSelect: (section: string) => void;
  activeSection: string | null;
  onCloseSection: () => void;
}

export function DomeNav({ onSelect, activeSection, onCloseSection }: DomeNavProps) {
  const [open,        setOpen]        = useState(false);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close on outside click / Escape
  useEffect(() => {
    const onClickOut = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false); setActiveGroup(null);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (activeGroup) { setActiveGroup(null); }
        else             { setOpen(false); }
      }
    };
    document.addEventListener("click", onClickOut);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("click", onClickOut); document.removeEventListener("keydown", onKey); };
  }, [activeGroup]);

  useEffect(() => { if (activeSection) { setOpen(false); setActiveGroup(null); } }, [activeSection]);

  const toggleGroup = (key: string) =>
    setActiveGroup(prev => (prev === key ? null : key));

  return (
    <>
      <IntelThreads visible={open} />

      {/* Back / close button shown while inside a section panel */}
      {activeSection && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          onClick={onCloseSection}
          data-testid="button-back-to-nav"
          style={{
            position: "fixed", bottom: "1.5rem", right: "1.5rem", zIndex: 10002,
            width: "54px", height: "54px", borderRadius: "50%",
            background: "rgba(5,8,16,0.92)", border: "2px solid #22c55e",
            color: "#d4af37", fontSize: "18px", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 16px rgba(34,197,94,0.3)",
          }}
        >✕</motion.button>
      )}

      {/* Main wrap — fixed top-center */}
      <div
        ref={wrapRef}
        style={{
          position: "fixed", top: "8px", left: "50%",
          transform: "translateX(-50%)", width: `${BTN}px`, zIndex: 9999,
        }}
      >
        {/* Dome backdrop */}
        <div style={{
          position: "absolute",
          width: "500px",
          left: `${-(500 / 2) + HALF}px`,
          top: "-8px",
          height: "260px",
          background: "rgba(4,7,18,0.93)",
          borderRadius: "0 0 250px 250px",
          border: "1px solid rgba(255,229,143,0.13)",
          borderTop: "none",
          pointerEvents: "none",
          zIndex: -1,
          opacity: open ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}/>

        {/* ── Hamburger ─────────────────────────────────────────────── */}
        <button
          onClick={(e) => { e.stopPropagation(); setOpen(v => !v); if (open) setActiveGroup(null); }}
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          data-testid="button-dome-hamburger"
          style={{
            width: `${BTN}px`, height: `${BTN}px`, borderRadius: "50%",
            background: "#050810",
            border: `2.5px solid ${open ? "#d4af37" : "#22c55e"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", position: "relative", zIndex: 10001,
            boxShadow: open
              ? "0 0 0 1px rgba(212,175,55,0.25), 0 0 24px rgba(34,197,94,0.5), 0 0 48px rgba(34,197,94,0.18)"
              : "0 0 14px rgba(34,197,94,0.28)",
            transition: "border-color 0.3s, box-shadow 0.3s",
          }}
        >
          <motion.div
            animate={{ rotate: open ? 90 : 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            style={{ display: "flex", flexDirection: "column", gap: "5px", alignItems: "center" }}
          >
            {[0,1,2].map(n => (
              <span key={n} style={{
                display: "block", width: "22px", height: "2.5px", borderRadius: "2px",
                background: open ? "#d4af37" : "#22c55e", transition: "background 0.3s",
              }}/>
            ))}
          </motion.div>
        </button>

        {/* ── SVG connector paths from circles to hamburger ─────────── */}
        <svg
          aria-hidden
          style={{ position: "absolute", left: `${HALF}px`, top: `${HALF}px`, width: 1, height: 1, overflow: "visible", pointerEvents: "none", zIndex: 9999 }}
        >
          {MAIN_GROUPS.map((grp, i) => {
            const { x, y } = MAIN_POSITIONS[i];
            const dim = activeGroup !== null && activeGroup !== grp.key;
            return (
              <path
                key={grp.key}
                d={`M ${x} ${y} Q ${x*0.35} ${y*0.35} 0 0`}
                style={{
                  fill: "none",
                  stroke: dim ? "rgba(255,229,143,0.2)" : "#ffe58f",
                  strokeWidth: 1.8,
                  strokeLinecap: "round",
                  strokeDasharray: 600,
                  strokeDashoffset: open ? 0 : 600,
                  transition: [
                    `stroke-dashoffset 0.55s cubic-bezier(0.4,0,0.2,1) ${0.04 + i*0.025}s`,
                    `stroke 0.25s ease`,
                  ].join(", "),
                }}
              />
            );
          })}
        </svg>

        {/* ── Main circles ──────────────────────────────────────────── */}
        {MAIN_GROUPS.map((grp, i) => {
          const { x, y } = MAIN_POSITIONS[i];
          const left = HALF + x - ITEM_HALF;
          const top  = HALF + y - ITEM_HALF;
          const toX  = ITEM_HALF - x; // transform-origin pointing back to hamburger center
          const toY  = ITEM_HALF - y;
          const isActive  = activeGroup === grp.key;
          const isDimmed  = activeGroup !== null && !isActive;

          return (
            <div
              key={grp.key}
              style={{
                position: "absolute",
                left: `${left}px`, top: `${top}px`,
                width: `${ITEM}px`, height: `${ITEM}px`,
                transformOrigin: `${toX}px ${toY}px`,
                transform: open ? "scale(1)" : "scale(0.15)",
                opacity: open ? (isDimmed ? 0.38 : 1) : 0,
                pointerEvents: open ? "auto" : "none",
                transition: [
                  `transform 0.42s cubic-bezier(0.16,1,0.3,1) ${open ? 0.06 + i*0.04 : 0}s`,
                  `opacity 0.28s ease ${open ? 0.05 + i*0.035 : 0}s`,
                ].join(", "),
                zIndex: 10000,
              }}
            >
              <button
                onClick={(e) => { e.stopPropagation(); toggleGroup(grp.key); }}
                data-testid={`button-nav-group-${grp.key}`}
                style={{
                  width: "100%", height: "100%", borderRadius: "50%",
                  background: isActive ? "#14532d" : "#050810",
                  border: `2.5px solid ${isActive ? "#d4af37" : "#22c55e"}`,
                  color: isActive ? "#ffffff" : "#d4af37",
                  fontFamily: "'Josefin Sans', sans-serif",
                  fontSize: "8.5px", fontWeight: 700, letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  textAlign: "center", cursor: "pointer",
                  padding: "6px 4px 4px", lineHeight: 1.3,
                  boxShadow: isActive ? "0 0 20px rgba(34,197,94,0.45)" : "none",
                  transition: "background 0.2s, border-color 0.2s, color 0.2s, box-shadow 0.2s",
                }}
                onMouseOver={e => {
                  if (!isActive) {
                    const b = e.currentTarget;
                    b.style.background = "#166534";
                    b.style.borderColor = "#d4af37";
                    b.style.color = "#ffffff";
                  }
                }}
                onMouseOut={e => {
                  if (!isActive) {
                    const b = e.currentTarget;
                    b.style.background = "#050810";
                    b.style.borderColor = "#22c55e";
                    b.style.color = "#d4af37";
                  }
                }}
              >
                <span style={{ fontSize: "18px", lineHeight: 1, marginBottom: "2px" }}>{grp.icon}</span>
                <span style={{ fontSize: "7px", opacity: 0.55, marginBottom: "1px", letterSpacing: "0.07em" }}>{grp.num}</span>
                {grp.label.map((ln, j) => <span key={j} style={{ display: "block" }}>{ln}</span>)}
              </button>
            </div>
          );
        })}

        {/* ── Sub-item pills ────────────────────────────────────────── */}
        {MAIN_GROUPS.map((grp, i) => {
          const { x, y }    = MAIN_POSITIONS[i];
          const mainCx      = HALF + x;  // main circle center in wrap space
          const mainCy      = HALF + y;
          const isActive    = activeGroup === grp.key;

          return grp.items.map((sub, j) => {
            const [offX, offY] = SUB_OFFSETS[i][j];
            const subCx = mainCx + offX;
            const subCy = mainCy + offY;
            const left  = subCx - PILL_W / 2;
            const top   = subCy - PILL_H / 2;
            // transform-origin: points back to parent circle center
            const toX   = mainCx - left;
            const toY   = mainCy - top;

            return (
              <div
                key={sub.key}
                style={{
                  position: "absolute",
                  left: `${left}px`, top: `${top}px`,
                  width: `${PILL_W}px`, height: `${PILL_H}px`,
                  transformOrigin: `${toX}px ${toY}px`,
                  transform: isActive ? "scale(1)" : "scale(0.1)",
                  opacity: isActive ? 1 : 0,
                  pointerEvents: isActive ? "auto" : "none",
                  transition: [
                    `transform 0.35s cubic-bezier(0.16,1,0.3,1) ${isActive ? 0.04 + j*0.06 : 0}s`,
                    `opacity 0.25s ease ${isActive ? 0.03 + j*0.055 : 0}s`,
                  ].join(", "),
                  zIndex: 10001,
                }}
              >
                {/* Small connector line from main circle to pill */}
                <svg
                  aria-hidden
                  style={{ position: "absolute", left: `${PILL_W/2}px`, top: `${PILL_H/2}px`, width: 1, height: 1, overflow: "visible", pointerEvents: "none" }}
                >
                  <line
                    x1={0} y1={0}
                    x2={-offX} y2={-offY}
                    stroke="rgba(255,229,143,0.35)"
                    strokeWidth="1.2"
                    strokeDasharray="3 3"
                  />
                </svg>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen(false); setActiveGroup(null);
                    onSelect(sub.key);
                  }}
                  data-testid={`button-nav-sub-${sub.key.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                  style={{
                    width: "100%", height: "100%",
                    borderRadius: "18px",
                    background: "#050810",
                    border: "2px solid #22c55e",
                    color: "#d4af37",
                    fontFamily: "'Josefin Sans', sans-serif",
                    fontSize: "9.5px", fontWeight: 700,
                    letterSpacing: "0.04em", textTransform: "uppercase",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    textAlign: "center", cursor: "pointer",
                    padding: "0 10px",
                    transition: "background 0.15s, border-color 0.15s, color 0.15s",
                  }}
                  onMouseOver={e => {
                    const b = e.currentTarget;
                    b.style.background = "#16a34a";
                    b.style.borderColor = "#d4af37";
                    b.style.color = "#ffffff";
                  }}
                  onMouseOut={e => {
                    const b = e.currentTarget;
                    b.style.background = "#050810";
                    b.style.borderColor = "#22c55e";
                    b.style.color = "#d4af37";
                  }}
                >
                  <span style={{ fontSize: "7px", opacity: 0.55, marginRight: "4px" }}>{sub.num}</span>
                  {sub.label}
                </button>
              </div>
            );
          });
        })}
      </div>
    </>
  );
}
