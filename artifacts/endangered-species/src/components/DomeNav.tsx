/**
 * DomeNav — exact TSA dome-nav layout, green + gold.
 *
 * CLOSED state  (image_1779595187550.png reference):
 *   Large solid-green filled circle, 3 white horizontal bars, dark outer ring.
 *
 * OPEN state:
 *   6 circles in downward semicircle from hamburger center.
 *   Each circle: dark bg, green border, gold icon + label.
 *
 * ACTIVE circle  (image_1779595177644.png / image_1779595183448.png):
 *   Clicked circle gets solid green fill + white text.
 *   2 sub-item pills appear DIRECTLY BELOW, connected by a single gold vertical line.
 *   Other 5 circles dim.
 */
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

// ─── Palette ───────────────────────────────────────────────────────────────────
const C = {
  fill:         "#16a34a",   // solid green — hamburger bg + active circle fill
  border:       "#22c55e",   // bright green border (inactive circles + pills)
  borderActive: "#4ade80",   // lighter green for active glow
  gold:         "#d4af37",   // gold text / connectors
  goldLight:    "#ffe58f",   // light gold for SVG lines
  dark:         "#040712",   // circle/pill background
  white:        "#ffffff",
};

// ─── Data ──────────────────────────────────────────────────────────────────────
interface SubItem { key: string; label: string; icon: string; }
interface Group   { key: string; num: string; label: string[]; icon: string; items: SubItem[]; }

const GROUPS: Group[] = [
  {
    key: "the-species", num: "01", icon: "🐦", label: ["THE", "SPECIES"],
    items: [
      { key: "Meet the Species", label: "MEET THE SPECIES",          icon: "🐦" },
      { key: "Evolution",        label: "EVOLUTION & CLASS.",         icon: "🧬" },
    ],
  },
  {
    key: "habitat", num: "02", icon: "🌿", label: ["HABITAT", "& FOOD"],
    items: [
      { key: "Habitat & Location", label: "HABITAT & LOCATION",      icon: "🗺" },
      { key: "Food Web",           label: "FOOD WEB",                icon: "🔗" },
    ],
  },
  {
    key: "climate", num: "03", icon: "🌧", label: ["CLIMATE", "& CHANGE"],
    items: [
      { key: "Climate Stressors",  label: "CLIMATE STRESSORS",       icon: "🌧" },
      { key: "Patterns of Change", label: "PATTERNS OF CHANGE",      icon: "📈" },
    ],
  },
  {
    key: "threats", num: "04", icon: "⚠", label: ["THREATS", "& IMPACT"],
    items: [
      { key: "Human Impact", label: "HUMAN IMPACT",                  icon: "🏙" },
      { key: "Predators",    label: "PREDATORS",                     icon: "🦅" },
    ],
  },
  {
    key: "survival", num: "05", icon: "🌱", label: ["SURVIVAL", "& ACTION"],
    items: [
      { key: "Adaptations",              label: "ADAPTATIONS",       icon: "🦶" },
      { key: "Conservation & Solutions", label: "CONSERVATION",      icon: "🌱" },
    ],
  },
  {
    key: "future", num: "06", icon: "📊", label: ["FUTURE", "& DATA"],
    items: [
      { key: "Extinction Risk",     label: "EXTINCTION RISK",        icon: "⚠" },
      { key: "Sources & Citations", label: "SOURCES & CITATIONS",    icon: "📚" },
    ],
  },
];

// ─── Geometry ──────────────────────────────────────────────────────────────────
const BTN   = 80;   // hamburger diameter
const HALF  = BTN / 2;  // 40
const ITEM  = 84;   // main circle diameter
const IHLF  = ITEM / 2; // 42
const R     = 158;  // semicircle radius

// Pill dimensions
const PW    = 196;  // pill width
const PH    = 50;   // pill height
const PGAP  = 10;   // gap between pills
const CGAP  = 16;   // gap from circle bottom to first pill top

/** i=0→left, i=5→right, i=2/3→bottom */
function arcPos(i: number) {
  const t = i / (GROUPS.length - 1);
  const theta = t * Math.PI;
  return { x: Math.round(-R * Math.cos(theta)), y: Math.round(R * Math.sin(theta)) };
}
const POSITIONS = GROUPS.map((_, i) => arcPos(i));

// ─── Intelligence Threads ──────────────────────────────────────────────────────
function IntelThreads({ visible }: { visible: boolean }) {
  type Arc = { d: string; op: number; dots: { cx: number; cy: number; delay: number }[] };
  const [arcs, setArcs] = useState<Arc[]>([]);
  const [vw, setVw]     = useState(1280);

  useEffect(() => {
    const W  = window.innerWidth;
    setVw(W);
    const lx = W / 2 - HALF, ly = HALF;
    const rx = W / 2 + HALF, ry = HALF;
    const rw = W - rx;

    function qb(t: number, x0: number, y0: number, cpx: number, cpy: number, x1: number, y1: number) {
      const m = 1 - t;
      return { x: m*m*x0 + 2*m*t*cpx + t*t*x1, y: m*m*y0 + 2*m*t*cpy + t*t*y1 };
    }
    const list: Arc[] = [];
    function arc(ox: number, oy: number, cpx: number, cpy: number, ex: number, ey: number, op: number, dts: [number,number][]) {
      list.push({ d: `M ${ox},${oy} Q ${cpx},${cpy} ${ex},${ey}`, op,
        dots: dts.map(([t, d]) => { const p = qb(t, ox, oy, cpx, cpy, ex, ey); return { cx: +p.x.toFixed(1), cy: +p.y.toFixed(1), delay: d }; }),
      });
    }
    arc(lx,ly, lx*0.42,ly, 0,36, 0.28, [[0.28,0.00],[0.60,0.42],[0.88,0.80]]);
    arc(lx,ly, lx*0.28, 6, 4, 0, 0.20, [[0.30,0.18],[0.65,0.62]]);
    arc(lx,ly, lx*0.36,82, 0,124,0.22, [[0.32,0.38],[0.68,0.78]]);
    arc(rx,ry, rx+rw*0.58,ry, W,36, 0.28, [[0.28,0.08],[0.60,0.48],[0.88,0.86]]);
    arc(rx,ry, rx+rw*0.72, 6, W-4,0, 0.20, [[0.30,0.22],[0.65,0.68]]);
    arc(rx,ry, rx+rw*0.64,82, W,124,0.22, [[0.32,0.42],[0.68,0.82]]);
    setArcs(list);
  }, []);

  return (
    <svg aria-hidden viewBox={`0 0 ${vw} 150`} preserveAspectRatio="none"
      style={{ position:"fixed", top:0, left:0, width:"100%", height:"150px",
        pointerEvents:"none", zIndex:9997, opacity: visible ? 1 : 0, transition:"opacity 0.45s ease" }}>
      <defs>
        <filter id="dn-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {arcs.map((a, i) => (
        <g key={i}>
          <path d={a.d} stroke={`rgba(212,175,55,${a.op})`} strokeWidth="1.1" fill="none"/>
          {a.dots.map((dot, j) => (
            <circle key={j} cx={dot.cx} cy={dot.cy} r="2.6" fill="rgba(255,185,45,0.9)" filter="url(#dn-glow)"
              style={{ animation:"dotPulse 2.4s ease-in-out infinite", animationDelay:`${dot.delay}s` }}/>
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

  useEffect(() => {
    const onOut = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) { setOpen(false); setActiveGroup(null); }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { if (activeGroup) setActiveGroup(null); else setOpen(false); }
    };
    document.addEventListener("click", onOut);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("click", onOut); document.removeEventListener("keydown", onKey); };
  }, [activeGroup]);

  useEffect(() => { if (activeSection) { setOpen(false); setActiveGroup(null); } }, [activeSection]);

  const toggleGroup = (key: string) => setActiveGroup(p => p === key ? null : key);

  return (
    <>
      <IntelThreads visible={open} />

      {/* ── Close / back button shown when inside a section ── */}
      {activeSection && (
        <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
          onClick={onCloseSection} data-testid="button-back-to-nav"
          style={{
            position:"fixed", bottom:"1.5rem", right:"1.5rem", zIndex:10002,
            width:"56px", height:"56px", borderRadius:"50%",
            background: C.fill, border:`2px solid ${C.borderActive}`,
            color: C.white, fontSize:"18px", cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:`0 0 0 5px rgba(0,0,0,0.8), 0 0 20px rgba(34,197,94,0.4)`,
            fontFamily:"'Josefin Sans', sans-serif",
          }}>✕</motion.button>
      )}

      {/* ── Wrap — fixed top-center ── */}
      <div ref={wrapRef}
        style={{ position:"fixed", top:"10px", left:"50%", transform:"translateX(-50%)", width:`${BTN}px`, zIndex:9999 }}>

        {/* Dome backdrop — appears when open */}
        <div style={{
          position:"absolute",
          width:"520px", height:"310px",
          left:`${-(520/2) + HALF}px`,
          top:"-10px",
          background:"rgba(3,6,16,0.94)",
          borderRadius:"0 0 260px 260px",
          border:`1px solid rgba(34,197,94,0.12)`,
          borderTop:"none",
          pointerEvents:"none", zIndex:-1,
          opacity: open ? 1 : 0, transition:"opacity 0.3s ease",
        }}/>

        {/* ── Hamburger ─────────────────────────────────────────────────── */}
        <button
          onClick={(e) => { e.stopPropagation(); setOpen(v => !v); if (open) setActiveGroup(null); }}
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          data-testid="button-dome-hamburger"
          style={{
            width:`${BTN}px`, height:`${BTN}px`, borderRadius:"50%",
            // Solid fill like the TSA reference — always green
            background: C.fill,
            border:`2.5px solid ${C.borderActive}`,
            display:"flex", alignItems:"center", justifyContent:"center",
            cursor:"pointer", position:"relative", zIndex:10001,
            // Dark outer ring + subtle green glow (matches image_1779595187550.png)
            boxShadow:`0 0 0 7px rgba(3,6,16,0.92), 0 0 0 9px rgba(34,197,94,0.22), 0 0 28px rgba(34,197,94,0.18)`,
            transition:"box-shadow 0.3s",
          }}
        >
          <motion.div
            animate={{ rotate: open ? 90 : 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            style={{ display:"flex", flexDirection:"column", gap:"5px", alignItems:"center" }}
          >
            {[0,1,2].map(n => (
              <span key={n} style={{
                display:"block", width:"22px", height:"2.5px", borderRadius:"2px",
                background: C.white,
              }}/>
            ))}
          </motion.div>
        </button>

        {/* ── SVG arcs from circles to hamburger center ─────────────────── */}
        <svg aria-hidden
          style={{ position:"absolute", left:`${HALF}px`, top:`${HALF}px`, width:1, height:1, overflow:"visible", pointerEvents:"none", zIndex:9999 }}>
          {GROUPS.map((grp, i) => {
            const { x, y } = POSITIONS[i];
            const dimmed = activeGroup !== null && activeGroup !== grp.key;
            return (
              <path key={grp.key}
                d={`M ${x} ${y} Q ${x*0.35} ${y*0.35} 0 0`}
                style={{
                  fill:"none",
                  stroke: dimmed ? "rgba(255,229,143,0.15)" : C.goldLight,
                  strokeWidth:1.8, strokeLinecap:"round",
                  strokeDasharray:600,
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

        {/* ── Main circles ──────────────────────────────────────────────── */}
        {GROUPS.map((grp, i) => {
          const { x, y } = POSITIONS[i];
          const left   = HALF + x - IHLF;
          const top    = HALF + y - IHLF;
          const toX    = IHLF - x;
          const toY    = IHLF - y;
          const active = activeGroup === grp.key;
          const dimmed = activeGroup !== null && !active;

          return (
            <div key={grp.key} style={{
              position:"absolute", left:`${left}px`, top:`${top}px`,
              width:`${ITEM}px`, height:`${ITEM}px`,
              transformOrigin:`${toX}px ${toY}px`,
              transform: open ? "scale(1)" : "scale(0.12)",
              opacity: open ? (dimmed ? 0.3 : 1) : 0,
              pointerEvents: open ? "auto" : "none",
              transition:[
                `transform 0.42s cubic-bezier(0.16,1,0.3,1) ${open ? 0.06+i*0.042 : 0}s`,
                `opacity 0.28s ease ${open ? 0.05+i*0.038 : 0}s`,
              ].join(", "),
              zIndex:10000,
            }}>
              <button
                onClick={(e) => { e.stopPropagation(); toggleGroup(grp.key); }}
                data-testid={`button-nav-group-${grp.key}`}
                style={{
                  width:"100%", height:"100%", borderRadius:"50%",
                  background: active ? C.fill : C.dark,
                  border:`2.5px solid ${active ? C.borderActive : C.border}`,
                  color: active ? C.white : C.gold,
                  fontFamily:"'Josefin Sans', sans-serif",
                  fontSize:"8.5px", fontWeight:700, letterSpacing:"0.05em",
                  textTransform:"uppercase",
                  display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                  textAlign:"center", cursor:"pointer", padding:"6px 4px 4px", lineHeight:1.3,
                  boxShadow: active ? `0 0 0 5px rgba(3,6,16,0.7), 0 0 22px rgba(34,197,94,0.55), 0 0 44px rgba(34,197,94,0.2)` : "none",
                  transition:"background 0.2s, border-color 0.2s, color 0.2s, box-shadow 0.2s",
                }}
                onMouseOver={e => { if (!active) { const b=e.currentTarget; b.style.background=C.fill; b.style.borderColor=C.borderActive; b.style.color=C.white; } }}
                onMouseOut ={e => { if (!active) { const b=e.currentTarget; b.style.background=C.dark; b.style.borderColor=C.border; b.style.color=C.gold; } }}
              >
                <span style={{ fontSize:"17px", lineHeight:1, marginBottom:"2px" }}>{grp.icon}</span>
                <span style={{ fontSize:"7px", opacity:0.55, marginBottom:"2px", letterSpacing:"0.07em" }}>{grp.num}</span>
                {grp.label.map((ln,j) => <span key={j} style={{ display:"block" }}>{ln}</span>)}
              </button>
            </div>
          );
        })}

        {/* ── Sub-item vertical chains ───────────────────────────────────── */}
        {GROUPS.map((grp, i) => {
          const { x, y } = POSITIONS[i];
          const active   = activeGroup === grp.key;

          // Circle bottom-center in wrap space (origin for the chain)
          const chainX   = HALF + x;          // x center of chain in wrap-space
          const chainTop = HALF + y + IHLF;   // y of circle's bottom edge

          // Total height of chain (for the vertical gold line)
          const totalH   = CGAP + grp.items.length * PH + (grp.items.length - 1) * PGAP;

          return (
            <div key={`sub-${grp.key}`} style={{
              position:"absolute",
              // Position the chain group so it's centered on the circle
              left:`${chainX - PW/2}px`,
              top:`${chainTop}px`,
              width:`${PW}px`,
              height:`${totalH}px`,
              pointerEvents: active ? "auto" : "none",
              zIndex:10001,
            }}>
              {/* Gold vertical line running through the full chain */}
              <svg aria-hidden style={{
                position:"absolute", left:`${PW/2}px`, top:0, width:1, height:1, overflow:"visible", pointerEvents:"none",
              }}>
                <line
                  x1={0} y1={0} x2={0} y2={CGAP + totalH}
                  stroke={C.gold}
                  strokeWidth="2"
                  strokeDasharray={active ? "none" : `${CGAP + totalH}`}
                  strokeDashoffset={active ? 0 : CGAP + totalH}
                  style={{ transition:`stroke-dashoffset 0.4s ease ${active ? 0.05 : 0}s` }}
                />
              </svg>

              {/* Pills */}
              {grp.items.map((sub, j) => {
                const pillTop = CGAP + j * (PH + PGAP);
                // transform-origin: points back up to circle center from this pill
                const toXp = PW / 2;
                const toYp = -(chainTop - (HALF + y)) - IHLF;

                return (
                  <div key={sub.key} style={{
                    position:"absolute",
                    left:0, top:`${pillTop}px`,
                    width:`${PW}px`, height:`${PH}px`,
                    transformOrigin:`${toXp}px ${toYp}px`,
                    transform: active ? "scale(1)" : "scale(0.08)",
                    opacity: active ? 1 : 0,
                    transition:[
                      `transform 0.36s cubic-bezier(0.16,1,0.3,1) ${active ? 0.06 + j*0.07 : 0}s`,
                      `opacity 0.25s ease ${active ? 0.05 + j*0.065 : 0}s`,
                    ].join(", "),
                  }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); setOpen(false); setActiveGroup(null); onSelect(sub.key); }}
                      data-testid={`button-nav-sub-${sub.key.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                      style={{
                        width:"100%", height:"100%",
                        borderRadius:`${PH/2}px`,
                        background: C.dark,
                        border:`2px solid ${C.border}`,
                        color: C.gold,
                        fontFamily:"'Josefin Sans', sans-serif",
                        fontSize:"10px", fontWeight:700,
                        letterSpacing:"0.06em", textTransform:"uppercase",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        gap:"8px",
                        cursor:"pointer", padding:"0 16px",
                        transition:"background 0.16s, border-color 0.16s, color 0.16s",
                      }}
                      onMouseOver={e => { const b=e.currentTarget; b.style.background=C.fill; b.style.borderColor=C.borderActive; b.style.color=C.white; }}
                      onMouseOut ={e => { const b=e.currentTarget; b.style.background=C.dark; b.style.borderColor=C.border; b.style.color=C.gold; }}
                    >
                      <span style={{ fontSize:"14px", lineHeight:1 }}>{sub.icon}</span>
                      {sub.label}
                    </button>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
}
