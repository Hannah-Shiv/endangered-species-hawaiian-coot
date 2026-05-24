/**
 * DomeNav — exact TSA dome-nav pattern, green + gold.
 *
 * OPEN:  6 circles in downward semicircle. NO radial lines between circles and hamburger.
 * CLICK: Active circle gets solid-green fill + outer glow ring.
 *        Sub-items always appear at FIXED CENTER-BOTTOM position (never below the circle).
 *        A single curved bezier sweeps from the active circle center down to the sub-item chain.
 *        (Control point = same y as the circle, at center x — creates the "sweep then drop" arc.)
 *
 * Colors: green #16a34a fill, #22c55e border, gold #d4af37 text & connector.
 */
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Palette ───────────────────────────────────────────────────────────────────
const C = {
  fill:    "#16a34a",  // solid green (hamburger bg, active circle bg)
  border:  "#22c55e",  // bright-green border for inactive circles & pills
  active:  "#4ade80",  // lighter green for active ring glow
  gold:    "#d4af37",  // gold text
  goldLt:  "#ffe58f",  // light gold for connector lines
  dark:    "#040712",  // circle / pill background
  white:   "#ffffff",
} as const;

// ─── Data ──────────────────────────────────────────────────────────────────────
interface Sub   { key: string; label: string; icon: string; }
interface Group { key: string; num: string; icon: string; label: string[]; items: Sub[]; }

const GROUPS: Group[] = [
  { key:"the-species", num:"01", icon:"🐦", label:["THE","SPECIES"],
    items:[{key:"Meet the Species",label:"MEET THE SPECIES",icon:"🐦"},{key:"Evolution",label:"EVOLUTION & CLASS.",icon:"🧬"}] },
  { key:"habitat",     num:"02", icon:"🌿", label:["HABITAT","& FOOD"],
    items:[{key:"Habitat & Location",label:"HABITAT & LOCATION",icon:"🗺"},{key:"Food Web",label:"FOOD WEB",icon:"🔗"}] },
  { key:"climate",     num:"03", icon:"🌧", label:["CLIMATE","& CHANGE"],
    items:[{key:"Climate Stressors",label:"CLIMATE STRESSORS",icon:"🌧"},{key:"Patterns of Change",label:"PATTERNS OF CHANGE",icon:"📈"}] },
  { key:"threats",     num:"04", icon:"⚠",  label:["THREATS","& IMPACT"],
    items:[{key:"Human Impact",label:"HUMAN IMPACT",icon:"🏙"},{key:"Predators",label:"PREDATORS",icon:"🦅"}] },
  { key:"survival",    num:"05", icon:"🌱", label:["SURVIVAL","& ACTION"],
    items:[{key:"Adaptations",label:"ADAPTATIONS",icon:"🦶"},{key:"Conservation & Solutions",label:"CONSERVATION",icon:"🌱"}] },
  { key:"future",      num:"06", icon:"📊", label:["FUTURE","& DATA"],
    items:[{key:"Extinction Risk",label:"EXTINCTION RISK",icon:"⚠"},{key:"Sources & Citations",label:"SOURCES & CITATIONS",icon:"📚"}] },
];

// ─── Geometry ──────────────────────────────────────────────────────────────────
const BTN   = 80;        // hamburger diameter (px)
const HALF  = BTN / 2;   // 40 — hamburger center within wrap div
const ITEM  = 84;        // main circle diameter
const IHLF  = ITEM / 2;  // 42
const R     = 158;       // semicircle radius

// Sub-item pill
const PW    = 220;   // pill width
const PH    = 52;    // pill height
const PGAP  = 10;    // gap between pills
const CGAP  = 20;    // gap from connector end to first pill top

// Fixed Y-position (in wrap-space) where the sub-chain always appears
// Circles reach y ≈ 152 at deepest; add IHLF (42) + some padding = ~220
const SUB_Y = 228;   // top of first pill, measured from wrap top-left

/** Downward semicircle: i=0 → far-left, i=5 → far-right, i=2/3 → bottom */
function arcPos(i: number) {
  const theta = (i / (GROUPS.length - 1)) * Math.PI;
  return { x: Math.round(-R * Math.cos(theta)), y: Math.round(R * Math.sin(theta)) };
}
const POSITIONS = GROUPS.map((_, i) => arcPos(i));

// ─── Intelligence Threads ──────────────────────────────────────────────────────
function IntelThreads({ visible }: { visible: boolean }) {
  type Arc = { d: string; op: number; dots: { cx: number; cy: number; delay: number }[] };
  const [arcs, setArcs] = useState<Arc[]>([]);
  const [vw,   setVw]   = useState(1280);

  useEffect(() => {
    const W  = window.innerWidth;
    setVw(W);
    const lx = W/2 - HALF, ly = HALF;
    const rx = W/2 + HALF, ry = HALF;
    const rw = W - rx;

    function qb(t: number, x0: number, y0: number, cpx: number, cpy: number, x1: number, y1: number) {
      const m = 1-t; return { x:m*m*x0+2*m*t*cpx+t*t*x1, y:m*m*y0+2*m*t*cpy+t*t*y1 };
    }
    const list: Arc[] = [];
    function arc(ox:number,oy:number,cpx:number,cpy:number,ex:number,ey:number,op:number,dts:[number,number][]) {
      list.push({ d:`M ${ox},${oy} Q ${cpx},${cpy} ${ex},${ey}`, op,
        dots: dts.map(([t,d])=>{ const p=qb(t,ox,oy,cpx,cpy,ex,ey); return {cx:+p.x.toFixed(1),cy:+p.y.toFixed(1),delay:d}; }),
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
      style={{ position:"fixed",top:0,left:0,width:"100%",height:"150px",
               pointerEvents:"none",zIndex:9997,
               opacity:visible?1:0, transition:"opacity 0.45s ease" }}>
      <defs>
        <filter id="dn-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {arcs.map((a,i) => (
        <g key={i}>
          <path d={a.d} stroke={`rgba(212,175,55,${a.op})`} strokeWidth="1.1" fill="none"/>
          {a.dots.map((dot,j) => (
            <circle key={j} cx={dot.cx} cy={dot.cy} r="2.6"
              fill="rgba(255,185,45,0.9)" filter="url(#dn-glow)"
              style={{animation:"dotPulse 2.4s ease-in-out infinite",animationDelay:`${dot.delay}s`}}/>
          ))}
        </g>
      ))}
    </svg>
  );
}

// ─── DomeNav ───────────────────────────────────────────────────────────────────
interface Props {
  onSelect: (key: string) => void;
  activeSection: string | null;
  onCloseSection: () => void;
}

export function DomeNav({ onSelect, activeSection, onCloseSection }: Props) {
  const [open,  setOpen]  = useState(false);
  const [group, setGroup] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close on outside click / Escape
  useEffect(() => {
    const onOut = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false); setGroup(null);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { if (group) setGroup(null); else setOpen(false); }
    };
    document.addEventListener("click", onOut);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("click", onOut); document.removeEventListener("keydown", onKey); };
  }, [group]);

  useEffect(() => { if (activeSection) { setOpen(false); setGroup(null); } }, [activeSection]);

  // Active group data + connector path
  const activeIdx = group ? GROUPS.findIndex(g => g.key === group) : -1;
  const activePosX = activeIdx >= 0 ? POSITIONS[activeIdx].x : 0;
  const activePosY = activeIdx >= 0 ? POSITIONS[activeIdx].y : 0;

  // Connector bezier — from circle center to center-top of sub-chain
  // SVG origin = (HALF, HALF) in wrap space (anchored at hamburger center)
  // Circle center in SVG space: (activePosX, activePosY)
  // Sub-chain top-center in SVG space: (0, SUB_Y - HALF)
  const connEndY  = SUB_Y - HALF;  // = 228 - 40 = 188
  // Control point: same y as circle, at center x → creates "sweep then drop" curve
  const connPath  = activeIdx >= 0
    ? `M ${activePosX} ${activePosY} Q 0 ${activePosY} 0 ${connEndY}`
    : "";

  // Approx path length for dash animation (Pythagorean upper bound)
  const connLen = activeIdx >= 0
    ? Math.hypot(activePosX, activePosY - connEndY) + Math.abs(activePosX)
    : 800;

  return (
    <>
      <IntelThreads visible={open} />

      {/* ── Close button when inside a section panel ── */}
      <AnimatePresence>
        {activeSection && (
          <motion.button key="close" initial={{scale:0}} animate={{scale:1}} exit={{scale:0}}
            onClick={onCloseSection} data-testid="button-back-to-nav"
            style={{
              position:"fixed",bottom:"1.5rem",right:"1.5rem",zIndex:10002,
              width:"56px",height:"56px",borderRadius:"50%",
              background:C.fill, border:`2px solid ${C.active}`,
              color:C.white, fontSize:"18px", cursor:"pointer",
              display:"flex",alignItems:"center",justifyContent:"center",
              boxShadow:`0 0 0 5px rgba(0,0,0,0.8), 0 0 20px rgba(34,197,94,0.4)`,
              fontFamily:"'Josefin Sans',sans-serif",
            }}>✕</motion.button>
        )}
      </AnimatePresence>

      {/* ── Main wrap — fixed top-center ── */}
      <div ref={wrapRef}
        style={{ position:"fixed",top:"10px",left:"50%",transform:"translateX(-50%)",
                 width:`${BTN}px`, zIndex:9999 }}>

        {/* Dome backdrop */}
        <div style={{
          position:"absolute",
          width:"520px", height: group ? "390px" : "300px",
          left:`${-(520/2)+HALF}px`, top:"-10px",
          background:"rgba(3,6,16,0.94)",
          borderRadius:"0 0 260px 260px",
          border:`1px solid rgba(34,197,94,0.11)`,
          borderTop:"none",
          pointerEvents:"none", zIndex:-1,
          opacity: open ? 1 : 0,
          transition:"opacity 0.3s ease, height 0.35s ease",
        }}/>

        {/* ══════════════ HAMBURGER ══════════════ */}
        <button
          onClick={(e) => { e.stopPropagation(); setOpen(v => !v); if (open) setGroup(null); }}
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          data-testid="button-dome-hamburger"
          style={{
            width:`${BTN}px`, height:`${BTN}px`, borderRadius:"50%",
            background: C.fill,
            border:`2.5px solid ${C.active}`,
            display:"flex",alignItems:"center",justifyContent:"center",
            cursor:"pointer", position:"relative", zIndex:10001,
            boxShadow:`0 0 0 7px rgba(3,6,16,0.92), 0 0 0 9px rgba(34,197,94,0.22), 0 0 28px rgba(34,197,94,0.18)`,
            transition:"box-shadow 0.3s",
          }}>
          <motion.div
            animate={{ rotate: open ? 90 : 0 }}
            transition={{ duration:0.35, ease:[0.4,0,0.2,1] }}
            style={{ display:"flex",flexDirection:"column",gap:"5px",alignItems:"center" }}>
            {[0,1,2].map(n => (
              <span key={n} style={{ display:"block",width:"22px",height:"2.5px",borderRadius:"2px",background:C.white }}/>
            ))}
          </motion.div>
        </button>

        {/* ══════════════ CURVED CONNECTOR (active group → sub-chain) ══════════════ */}
        {/* No radial lines when open — only this single dynamic curve when a group is active */}
        <svg aria-hidden
          style={{ position:"absolute",left:`${HALF}px`,top:`${HALF}px`,
                   width:1,height:1,overflow:"visible",pointerEvents:"none",zIndex:9999 }}>
          {activeIdx >= 0 && (
            <path
              d={connPath}
              style={{
                fill:"none",
                stroke: C.goldLt,
                strokeWidth:"2",
                strokeLinecap:"round",
                strokeDasharray: connLen,
                strokeDashoffset: group ? 0 : connLen,
                transition:`stroke-dashoffset 0.45s cubic-bezier(0.4,0,0.2,1)`,
              }}
            />
          )}
        </svg>

        {/* ══════════════ MAIN CIRCLES ══════════════ */}
        {GROUPS.map((grp, i) => {
          const { x, y } = POSITIONS[i];
          const left   = HALF + x - IHLF;
          const top    = HALF + y - IHLF;
          // transform-origin points back to hamburger center so circles radiate outward
          const toX    = IHLF - x;
          const toY    = IHLF - y;
          const isAct  = group === grp.key;
          const isDim  = group !== null && !isAct;

          return (
            <div key={grp.key} style={{
              position:"absolute", left:`${left}px`, top:`${top}px`,
              width:`${ITEM}px`,  height:`${ITEM}px`,
              transformOrigin:`${toX}px ${toY}px`,
              transform: open ? "scale(1)" : "scale(0.12)",
              opacity:   open ? (isDim ? 0.3 : 1) : 0,
              pointerEvents: open ? "auto" : "none",
              transition:[
                `transform 0.42s cubic-bezier(0.16,1,0.3,1) ${open ? 0.06+i*0.042 : 0}s`,
                `opacity 0.28s ease ${open ? 0.05+i*0.038 : 0}s`,
              ].join(","),
              zIndex:10000,
            }}>
              <button
                onClick={(e) => { e.stopPropagation(); setGroup(v => v === grp.key ? null : grp.key); }}
                data-testid={`button-nav-group-${grp.key}`}
                style={{
                  width:"100%", height:"100%", borderRadius:"50%",
                  background: isAct ? C.fill : C.dark,
                  border:`2.5px solid ${isAct ? C.active : C.border}`,
                  color: isAct ? C.white : C.gold,
                  fontFamily:"'Josefin Sans',sans-serif",
                  fontSize:"8.5px", fontWeight:700, letterSpacing:"0.05em", textTransform:"uppercase",
                  display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
                  textAlign:"center", cursor:"pointer", padding:"6px 4px 4px", lineHeight:1.3,
                  boxShadow: isAct
                    ? `0 0 0 5px rgba(3,6,16,0.7), 0 0 22px rgba(34,197,94,0.55), 0 0 44px rgba(34,197,94,0.2)`
                    : "none",
                  transition:"background 0.2s,border-color 0.2s,color 0.2s,box-shadow 0.2s",
                }}
                onMouseOver={e => { if (!isAct) { const b=e.currentTarget; b.style.background=C.fill; b.style.borderColor=C.active; b.style.color=C.white; } }}
                onMouseOut ={e => { if (!isAct) { const b=e.currentTarget; b.style.background=C.dark; b.style.borderColor=C.border; b.style.color=C.gold; } }}
              >
                <span style={{fontSize:"17px",lineHeight:1,marginBottom:"2px"}}>{grp.icon}</span>
                <span style={{fontSize:"7px",opacity:0.5,marginBottom:"2px",letterSpacing:"0.07em"}}>{grp.num}</span>
                {grp.label.map((ln,j) => <span key={j} style={{display:"block"}}>{ln}</span>)}
              </button>
            </div>
          );
        })}

        {/* ══════════════ SUB-ITEM CHAIN — fixed center-bottom ══════════════ */}
        {/* Always at the same position regardless of which circle is active */}
        <div style={{
          position:"absolute",
          left:`${HALF - PW/2}px`,   // centered on hamburger x
          top:`${SUB_Y}px`,           // fixed Y below the circle arc
          width:`${PW}px`,
          pointerEvents: group ? "auto" : "none",
          zIndex:10001,
        }}>
          {/* Vertical gold line running through all pills (drawn behind them) */}
          <svg aria-hidden
            style={{ position:"absolute",left:`${PW/2}px`,top:0,width:1,height:1,overflow:"visible",pointerEvents:"none" }}>
            {group && (() => {
              const totalLine = GROUPS[0].items.length * PH + (GROUPS[0].items.length - 1) * PGAP;
              return (
                <line x1={0} y1={0} x2={0} y2={totalLine}
                  stroke={C.gold} strokeWidth="2"
                  style={{ transition:"stroke-dashoffset 0.3s ease" }}/>
              );
            })()}
          </svg>

          {/* Pills for the currently active group */}
          <AnimatePresence mode="wait">
            {group && (() => {
              const activeGroup = GROUPS.find(g => g.key === group)!;
              return (
                <motion.div key={group}
                  initial="hidden" animate="visible" exit="hidden"
                  variants={{ hidden:{}, visible:{transition:{staggerChildren:0.07}} }}>
                  {activeGroup.items.map((sub, j) => (
                    <motion.div key={sub.key}
                      variants={{
                        hidden:  { opacity:0, scale:0.5, y:-10 },
                        visible: { opacity:1, scale:1,   y:0,
                          transition:{ duration:0.35, ease:[0.16,1,0.3,1] } },
                      }}
                      style={{ marginBottom: j < activeGroup.items.length-1 ? `${PGAP}px` : 0 }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); setOpen(false); setGroup(null); onSelect(sub.key); }}
                        data-testid={`button-nav-sub-${sub.key.toLowerCase().replace(/[^a-z0-9]+/g,"-")}`}
                        style={{
                          width:`${PW}px`, height:`${PH}px`,
                          borderRadius:`${PH/2}px`,
                          background: C.dark,
                          border:`2px solid ${C.border}`,
                          color: C.gold,
                          fontFamily:"'Josefin Sans',sans-serif",
                          fontSize:"11px", fontWeight:700,
                          letterSpacing:"0.06em", textTransform:"uppercase",
                          display:"flex", alignItems:"center", justifyContent:"center",
                          gap:"10px", cursor:"pointer", padding:"0 20px",
                          transition:"background 0.15s,border-color 0.15s,color 0.15s",
                        }}
                        onMouseOver={e => { const b=e.currentTarget; b.style.background=C.fill; b.style.borderColor=C.active; b.style.color=C.white; }}
                        onMouseOut ={e => { const b=e.currentTarget; b.style.background=C.dark; b.style.borderColor=C.border; b.style.color=C.gold; }}
                      >
                        <span style={{fontSize:"16px",lineHeight:1}}>{sub.icon}</span>
                        {sub.label}
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              );
            })()}
          </AnimatePresence>
        </div>

      </div>
    </>
  );
}
