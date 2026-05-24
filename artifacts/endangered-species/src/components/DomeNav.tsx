/**
 * DomeNav — adapted directly from TSA dome-nav.js / dome-nav.css
 * Green color scheme (#22c55e) instead of red, 12 sections in downward semicircle.
 * Hamburger rotates 90° when open (horizontal → vertical lines).
 * Circles fan out from hamburger center via CSS transform-origin animation.
 * SVG connector paths draw in with stroke-dashoffset animation.
 * Intelligence threads (gold bezier arcs + pulsing dots) fade in on open.
 */
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

// ─── Section metadata ──────────────────────────────────────────────────────────
const SECTION_DATA = [
  { key: "Meet the Species",         num: "01", lines: ["MEET THE",   "'ALAE KE'OKE'O"], icon: "🐦" },
  { key: "Habitat & Location",       num: "02", lines: ["HABITAT &",  "WETLANDS"],        icon: "🗺" },
  { key: "Climate Stressors",        num: "03", lines: ["CLIMATE",    "STRESSORS"],       icon: "🌧" },
  { key: "Human Impact",             num: "04", lines: ["HUMAN",      "IMPACT"],          icon: "🏙" },
  { key: "Conservation & Solutions", num: "05", lines: ["CONSERV-",   "ATION"],           icon: "🌱" },
  { key: "Food Web",                 num: "06", lines: ["FOOD",       "WEB"],             icon: "🔗" },
  { key: "Adaptations",              num: "07", lines: ["ADAPTA-",    "TIONS"],           icon: "🦶" },
  { key: "Patterns of Change",       num: "08", lines: ["PATTERNS",   "OF CHANGE"],       icon: "📈" },
  { key: "Evolution",                num: "09", lines: ["EVOLUTION",  "& CLASS."],        icon: "🧬" },
  { key: "Extinction Risk",          num: "10", lines: ["EXTINCTION", "RISK"],            icon: "⚠" },
  { key: "Predators",                num: "11", lines: ["PREDATORS",  "& THREATS"],       icon: "🦅" },
  { key: "Sources & Citations",      num: "12", lines: ["SOURCES &",  "CREDITS"],         icon: "📚" },
];

// ─── Geometry constants ────────────────────────────────────────────────────────
const BTN  = 72;   // hamburger diameter (px)
const HALF = BTN / 2; // 36 — wrap center offset
const ITEM = 76;   // section circle diameter (px)
const ITEM_HALF = ITEM / 2; // 38
const R    = 158;  // semicircle radius

/** Downward semicircle: i=0 → (-R,0) left, i=n-1 → (+R,0) right, mid → (0,+R) bottom */
function pos(i: number, total: number) {
  const theta = (i / (total - 1)) * Math.PI; // 0 → π
  return {
    x: Math.round(-R * Math.cos(theta)), // left→right
    y: Math.round( R * Math.sin(theta)), // 0 at ends, +R in middle
  };
}

const POSITIONS = SECTION_DATA.map((_, i) => pos(i, SECTION_DATA.length));

// ─── Intelligence Threads ──────────────────────────────────────────────────────
function IntelThreads({ visible }: { visible: boolean }) {
  type Arc = { d: string; opacity: number; dots: { cx: number; cy: number; delay: number }[] };
  const [arcs, setArcs] = useState<Arc[]>([]);
  const [vw, setVw] = useState(1280);

  useEffect(() => {
    const W  = window.innerWidth;
    const H  = 150;
    const cx = W / 2;
    const lx = cx - HALF, ly = HALF;
    const rx = cx + HALF, ry = HALF;
    setVw(W);

    function qb(t: number, x0: number, y0: number, cpx: number, cpy: number, x1: number, y1: number) {
      const m = 1 - t;
      return { x: m*m*x0 + 2*m*t*cpx + t*t*x1, y: m*m*y0 + 2*m*t*cpy + t*t*y1 };
    }

    const list: Arc[] = [];
    function arc(ox: number, oy: number, cpx: number, cpy: number, ex: number, ey: number, op: number, dotTs: [number,number][]) {
      list.push({
        d: `M ${ox},${oy} Q ${cpx},${cpy} ${ex},${ey}`,
        opacity: op,
        dots: dotTs.map(([t, delay]) => {
          const pt = qb(t, ox, oy, cpx, cpy, ex, ey);
          return { cx: +pt.x.toFixed(1), cy: +pt.y.toFixed(1), delay };
        }),
      });
    }

    // Left arcs (exact from TSA dome-nav.js)
    arc(lx,ly, lx*0.42,ly,         0, 36,  0.30, [[0.28,0.00],[0.60,0.42],[0.88,0.80]]);
    arc(lx,ly, lx*0.28, 6,         4,  0,  0.22, [[0.30,0.18],[0.65,0.62]]);
    arc(lx,ly, lx*0.36,82,         0,124,  0.26, [[0.32,0.38],[0.68,0.78]]);
    arc(lx,ly, cx*0.38, 4,   cx*0.20,  0,  0.18, [[0.40,0.52],[0.76,1.02]]);
    arc(lx,ly, lx*0.18,96,         0,H,   0.14, [[0.50,1.18]]);
    arc(lx,ly, lx*0.50,56,         0, 72,  0.19, [[0.38,0.64]]);

    // Right arcs (mirror)
    const rw = W - rx;
    arc(rx,ry, rx+rw*0.58,ry,       W, 36,  0.30, [[0.28,0.08],[0.60,0.48],[0.88,0.86]]);
    arc(rx,ry, rx+rw*0.72, 6,     W-4,  0,  0.22, [[0.30,0.22],[0.65,0.68]]);
    arc(rx,ry, rx+rw*0.64,82,       W,124,  0.26, [[0.32,0.42],[0.68,0.82]]);
    arc(rx,ry, cx*1.62,  4,   cx*1.80,  0,  0.18, [[0.40,0.56],[0.76,1.06]]);
    arc(rx,ry, rx+rw*0.82,96,       W,H,   0.14, [[0.50,1.22]]);
    arc(rx,ry, rx+rw*0.50,56,       W, 72,  0.19, [[0.38,0.68]]);

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
        transition: "opacity 0.48s ease",
      }}
    >
      <defs>
        <filter id="thr-glow-dn" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {arcs.map((a, i) => (
        <g key={i}>
          <path d={a.d} stroke={`rgba(212,175,55,${a.opacity})`} strokeWidth="1.1" fill="none"/>
          {a.dots.map((dot, j) => (
            <circle
              key={j} cx={dot.cx} cy={dot.cy} r="2.8"
              fill="rgba(255,185,45,0.9)" filter="url(#thr-glow-dn)"
              style={{ animation: "dotPulse 2.4s ease-in-out infinite", animationDelay: `${dot.delay}s` }}
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
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close on outside click / Escape
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("click", onClick); document.removeEventListener("keydown", onKey); };
  }, []);

  // If a section panel opened, close the dome menu
  useEffect(() => { if (activeSection) setOpen(false); }, [activeSection]);

  return (
    <>
      <IntelThreads visible={open} />

      {/* Back button when a section is open */}
      {activeSection && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          onClick={onCloseSection}
          data-testid="button-back-to-nav"
          style={{
            position: "fixed", bottom: "1.5rem", right: "1.5rem", zIndex: 10002,
            width: "56px", height: "56px", borderRadius: "50%",
            background: "rgba(5,8,16,0.9)", border: "2px solid #22c55e",
            color: "#d4af37", fontSize: "20px", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 16px rgba(34,197,94,0.3)",
            fontFamily: "'Josefin Sans', sans-serif",
          }}
        >
          ✕
        </motion.button>
      )}

      {/* Main wrap — fixed top-center */}
      <div
        ref={wrapRef}
        style={{ position: "fixed", top: "8px", left: "50%", transform: "translateX(-50%)", width: `${BTN}px`, zIndex: 9999 }}
      >
        {/* Dome backdrop — dark semi-ellipse that appears behind circles */}
        <div style={{
          position: "absolute",
          width: "420px",
          height: "270px",
          left: `${-(420 / 2) + HALF}px`,
          top: "-8px",
          background: "rgba(4,7,18,0.93)",
          borderRadius: "0 0 210px 210px",
          border: "1px solid rgba(255,229,143,0.14)",
          borderTop: "none",
          pointerEvents: "none",
          zIndex: -1,
          opacity: open ? 1 : 0,
          transition: "opacity 0.3s ease",
        }} />

        {/* ── Hamburger button ──────────────────────────────────────────── */}
        <button
          onClick={(e) => { e.stopPropagation(); setOpen(v => !v); }}
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          data-testid="button-dome-hamburger"
          style={{
            width: `${BTN}px`, height: `${BTN}px`, borderRadius: "50%",
            background: "#050810",
            border: `2.5px solid ${open ? "#d4af37" : "#22c55e"}`,
            color: "#d4af37",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", position: "relative", zIndex: 10001,
            boxShadow: open
              ? "0 0 0 1px rgba(212,175,55,0.3), 0 0 24px rgba(34,197,94,0.5), 0 0 48px rgba(34,197,94,0.2)"
              : "0 0 12px rgba(34,197,94,0.25), 0 0 4px rgba(34,197,94,0.15)",
            transition: "border-color 0.3s, box-shadow 0.3s",
          }}
        >
          <motion.div
            animate={{ rotate: open ? 90 : 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            style={{ display: "flex", flexDirection: "column", gap: "5px", alignItems: "center" }}
          >
            {[0, 1, 2].map(n => (
              <span key={n} style={{
                display: "block", width: "22px", height: "2.5px", borderRadius: "2px",
                background: open ? "#d4af37" : "#22c55e",
                transition: "background 0.3s",
              }} />
            ))}
          </motion.div>
        </button>

        {/* ── SVG connector paths (stroke-dashoffset draw animation) ────── */}
        {/* Positioned so (0,0) = hamburger center */}
        <svg
          aria-hidden
          style={{
            position: "absolute",
            left: `${HALF}px`, top: `${HALF}px`,
            width: 1, height: 1, overflow: "visible",
            pointerEvents: "none", zIndex: 9999,
          }}
        >
          {SECTION_DATA.map((sec, i) => {
            const { x, y } = POSITIONS[i];
            // Quadratic bezier: circle center → hamburger center
            // Control point pulled 35% toward center for a gentle curve
            const cpx = x * 0.35;
            const cpy = y * 0.35;
            return (
              <path
                key={sec.key}
                d={`M ${x} ${y} Q ${cpx} ${cpy} 0 0`}
                style={{
                  fill: "none",
                  stroke: "#ffe58f",
                  strokeWidth: 1.8,
                  strokeLinecap: "round",
                  strokeDasharray: 600,
                  strokeDashoffset: open ? 0 : 600,
                  transition: `stroke-dashoffset 0.55s cubic-bezier(0.4,0,0.2,1) ${0.03 + i * 0.022}s`,
                }}
              />
            );
          })}
        </svg>

        {/* ── Section circles ───────────────────────────────────────────── */}
        {SECTION_DATA.map((sec, i) => {
          const { x, y } = POSITIONS[i];
          // CSS left/top position the item so its CENTER aligns with (x,y) from hamburger center
          // Hamburger center is at (HALF, HALF) within the wrap div
          // Item center should be at (HALF + x, HALF + y) → item top-left = (HALF + x - ITEM_HALF, HALF + y - ITEM_HALF)
          const left = HALF + x - ITEM_HALF;
          const top  = HALF + y - ITEM_HALF;
          // transform-origin: points back to hamburger center in item-local coordinates
          const toX  = ITEM_HALF - x; // hamburger_center_x_in_wrap(HALF) - item_left_in_wrap(HALF+x-ITEM_HALF) - ... simplified
          const toY  = ITEM_HALF - y;

          return (
            <div
              key={sec.key}
              style={{
                position: "absolute",
                left: `${left}px`,
                top: `${top}px`,
                width: `${ITEM}px`,
                height: `${ITEM}px`,
                transformOrigin: `${toX}px ${toY}px`,
                transform: open ? "scale(1)" : "scale(0.15)",
                opacity: open ? 1 : 0,
                pointerEvents: open ? "auto" : "none",
                transition: [
                  `transform 0.42s cubic-bezier(0.16,1,0.3,1) ${open ? 0.05 + i * 0.028 : 0}s`,
                  `opacity 0.3s ease ${open ? 0.04 + i * 0.025 : 0}s`,
                ].join(", "),
                zIndex: 10000,
              }}
            >
              <button
                onClick={(e) => { e.stopPropagation(); setOpen(false); onSelect(sec.key); }}
                data-testid={`button-nav-${sec.key.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                style={{
                  width: "100%", height: "100%", borderRadius: "50%",
                  background: "#050810",
                  border: "2.5px solid #22c55e",
                  color: "#d4af37",
                  fontFamily: "'Josefin Sans', sans-serif",
                  fontSize: "8px", fontWeight: 700, letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  textAlign: "center",
                  cursor: "pointer",
                  padding: "6px 4px 4px",
                  lineHeight: 1.25,
                  transition: "background 0.18s, border-color 0.18s, color 0.18s, box-shadow 0.18s",
                }}
                onMouseOver={e => {
                  const b = e.currentTarget;
                  b.style.background = "#16a34a";
                  b.style.borderColor = "#d4af37";
                  b.style.color = "#ffffff";
                  b.style.boxShadow = "0 0 16px rgba(34,197,94,0.5)";
                }}
                onMouseOut={e => {
                  const b = e.currentTarget;
                  b.style.background = "#050810";
                  b.style.borderColor = "#22c55e";
                  b.style.color = "#d4af37";
                  b.style.boxShadow = "none";
                }}
              >
                <span style={{ fontSize: "15px", lineHeight: 1, marginBottom: "2px" }}>
                  {sec.icon}
                </span>
                <span style={{ fontSize: "7px", opacity: 0.6, marginBottom: "1px", letterSpacing: "0.06em" }}>
                  {sec.num}
                </span>
                {sec.lines.map((ln, j) => (
                  <span key={j} style={{ display: "block" }}>{ln}</span>
                ))}
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}
