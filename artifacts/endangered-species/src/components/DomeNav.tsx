/**
 * DomeNav — exact TSA dome-nav pattern, green + gold.
 *
 * STATE 1 – open, no group selected:
 *   Dark semicircular dome backdrop (border-radius 0 0 260px 260px).
 *   6 circles in downward semicircle. NO connector lines.
 *
 * STATE 2 – a group circle clicked:
 *   Backdrop morphs from semicircle → RECTANGLE (border-radius 0, taller).
 *   Single gold L-shaped connector: goes DOWN from clicked circle's bottom,
 *   then curves ACROSS the bottom rail to center. Circles rendered on top
 *   of the connector (z-index), so the line appears to route around them.
 *   2 sub-item pills appear at fixed center-bottom with vertical gold spine.
 *
 * Colors: #16a34a fill, #22c55e border, #d4af37 gold.
 */
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Palette ───────────────────────────────────────────────────────────────────
const C = {
  gold:   "#d4af37",
  goldLt: "#ffe58f",
  dark:   "#040712",
  white:  "#ffffff",
} as const;

// ─── Data ──────────────────────────────────────────────────────────────────────
interface Sub   { key: string; label: string; icon: string; }
interface Group { key: string; num: string; icon: string; label: string[]; color: string; items: Sub[]; }

const GROUPS: Group[] = [
  { key:"the-species", num:"01", icon:"🐦", color:"#22c55e", label:["THE","SPECIES"],
    items:[{key:"Meet the Species",label:"MEET THE SPECIES",icon:"🐦"},{key:"Evolution",label:"EVOLUTION & CLASS.",icon:"🧬"}] },
  { key:"habitat",     num:"02", icon:"🗺", color:"#06b6d4", label:["HABITAT","& FOOD"],
    items:[{key:"Habitat & Location",label:"HABITAT & LOCATION",icon:"🗺"},{key:"Food Web",label:"FOOD WEB",icon:"🦋"}] },
  { key:"climate",     num:"03", icon:"🌧", color:"#0891b2", label:["CLIMATE","CHANGE"],
    items:[{key:"Climate Stressors",label:"CLIMATE STRESSORS",icon:"🌧"},{key:"Patterns of Change",label:"PATTERNS OF CHANGE",icon:"📈"}] },
  { key:"threats",     num:"04", icon:"🏙", color:"#7c3aed", label:["THREATS","& IMPACT"],
    items:[{key:"Human Impact",label:"HUMAN IMPACT",icon:"🏙"},{key:"Predators",label:"PREDATORS",icon:"🦅"}] },
  { key:"survival",    num:"05", icon:"🌱", color:"#f97316", label:["SURVIVAL","& ACTION"],
    items:[{key:"Adaptations",label:"ADAPTATIONS",icon:"🌿"},{key:"Conservation & Solutions",label:"CONSERVATION",icon:"🌱"}] },
  { key:"future",      num:"06", icon:"🛡", color:"#d4af37", label:["FUTURE","& DATA"],
    items:[{key:"Extinction Risk",label:"EXTINCTION RISK",icon:"🛡"},{key:"Sources & Citations",label:"SOURCES & CITATIONS",icon:"📄"}] },
];

// ─── Geometry ──────────────────────────────────────────────────────────────────
const BTN   = 80;         // hamburger diameter
const HALF  = BTN / 2;    // 40 = hamburger center in wrap-div space
const ITEM  = 84;
const IHLF  = ITEM / 2;   // 42
const R     = 158;        // semicircle radius

// Sub-item pills
const PW    = 224;
const PH    = 52;
const PGAP  = 12;

// ── Backdrop dimensions ──────────────────────────────────────────────────────
//
// To get UNIFORM spacing from every circle to the dome boundary, the backdrop
// must be a perfect circle centred on the hamburger with radius = R+IHLF+GAP.
//
//   R + IHLF = 158 + 42 = 200   (farthest point of any circle from hamburger)
//   GAP      = 20                (desired uniform gap)
//   DOM_R    = 220               (dome circle radius)
//
// CSS makes a perfect semicircle when border-radius == half the element width.
//   backdrop width  = 2 × DOM_R = 440px
//   border-radius   = "0 0 220px 220px"
//
// The backdrop top aligns exactly with the hamburger top (BACKDROP_TOP = 0)
// so no dark panel peeks above the button.  Height = HALF + DOM_R puts the
// dome arc DOM_R below the hamburger centre; circles bottom at ~232 fits
// inside (232 < 260).
//
const DOM_R          = 220;           // dome radius (uniform spacing from all circles)
const BACKDROP_W     = DOM_R * 2;     // 440px
const BACKDROP_TOP   = 0;             // px — backdrop top flush with hamburger top
const BACKDROP_H_SEMI = HALF + DOM_R; // 260 — arc bottom is DOM_R below hamburger centre

// ── Connector geometry (SVG space — origin at hamburger centre) ───────────────
//
// The L-connector routes:
//   1. From active circle centre → OUT to the circle's outer wall (horizontal)
//   2. DOWN the outer wall to the bottom rail
//   3. ACROSS the bottom rail to centre-x=0
//   4. DOWN to sub-items top
//
// The first segment (centre→outer-wall) is hidden behind the active circle
// (circles are z:10000, connector SVG is z:9999).  Every other segment is
// fully outside all circle areas → the line never crosses any other circle.
//
const RAIL_Y  = 210;                   // SVG: horizontal bottom rail (below circle bottoms at 194)
const SUB_SVG = RAIL_Y + 22;           // SVG: sub-items top (232 = RAIL_Y + 22)
const SUB_Y   = SUB_SVG + HALF;        // wrap: CSS top of pill container (272)

/** Downward semicircle */
function arcPos(i: number) {
  const theta = (i / (GROUPS.length - 1)) * Math.PI;
  return { x: Math.round(-R * Math.cos(theta)), y: Math.round(R * Math.sin(theta)) };
}
const POSITIONS = GROUPS.map((_, i) => arcPos(i));

/**
 * Connector path — starts at the EDGE of the active circle, ends at the top
 * of the sub-item pill container.
 *
 * Outermost circles (i=0, i=5):
 *   Their y=0 means a straight-down leg would clip through the adjacent circles.
 *   Instead, exit from the LEFT (i=0) or RIGHT (i=5) edge of the circle and
 *   route the vertical leg OUTSIDE the entire semicircle before sweeping to
 *   centre.
 *
 * Inner circles (i=1..4):
 *   Start at the BOTTOM edge of the circle (x, y + IHLF) and go straight
 *   down — these legs clear all neighbours.
 */
function connectorPath(x: number, y: number, idx: number): string {
  const r    = 18;
  const rail = RAIL_Y;
  const cr   = IHLF;   // circle radius = 42

  if (idx === 0) {
    // Leftmost: exit left edge, route outward of all circles, sweep right to centre
    const sx = x - cr;               // −200
    return [
      `M ${sx} ${y}`,
      `L ${sx} ${rail - r}`,
      `Q ${sx} ${rail} ${sx + r} ${rail}`,
      `L 0 ${rail}`,
      `L 0 ${SUB_SVG}`,
    ].join(" ");
  }

  if (idx === GROUPS.length - 1) {
    // Rightmost: exit right edge, route outward of all circles, sweep left to centre
    const sx = x + cr;               // +200
    return [
      `M ${sx} ${y}`,
      `L ${sx} ${rail - r}`,
      `Q ${sx} ${rail} ${sx - r} ${rail}`,
      `L 0 ${rail}`,
      `L 0 ${SUB_SVG}`,
    ].join(" ");
  }

  // Inner circles: exit from bottom edge, go straight down, sweep to centre
  const sign = x < 0 ? 1 : -1;
  return [
    `M ${x} ${y + cr}`,
    `L ${x} ${rail - r}`,
    `Q ${x} ${rail} ${x + sign * r} ${rail}`,
    `L 0 ${rail}`,
    `L 0 ${SUB_SVG}`,
  ].join(" ");
}

// ─── Intelligence Threads ──────────────────────────────────────────────────────
function IntelThreads({ visible }: { visible: boolean }) {
  type Arc = { d: string; op: number; dots: { cx: number; cy: number; delay: number }[] };
  const [arcs, setArcs] = useState<Arc[]>([]);
  const [vw,   setVw]   = useState(1280);

  useEffect(() => {
    const W  = window.innerWidth; setVw(W);
    const lx = W/2 - HALF, ly = HALF, rx = W/2 + HALF, ry = HALF, rw = W - rx;
    function qb(t:number,x0:number,y0:number,cx:number,cy:number,x1:number,y1:number){const m=1-t;return{x:m*m*x0+2*m*t*cx+t*t*x1,y:m*m*y0+2*m*t*cy+t*t*y1};}
    const list:Arc[]=[];
    function arc(ox:number,oy:number,cpx:number,cpy:number,ex:number,ey:number,op:number,dts:[number,number][]){
      list.push({d:`M ${ox},${oy} Q ${cpx},${cpy} ${ex},${ey}`,op,dots:dts.map(([t,d])=>{const p=qb(t,ox,oy,cpx,cpy,ex,ey);return{cx:+p.x.toFixed(1),cy:+p.y.toFixed(1),delay:d};})});
    }
    arc(lx,ly,lx*0.42,ly,0,36,0.28,[[0.28,0],[0.60,0.42],[0.88,0.80]]);
    arc(lx,ly,lx*0.28,6,4,0,0.20,[[0.30,0.18],[0.65,0.62]]);
    arc(lx,ly,lx*0.36,82,0,124,0.22,[[0.32,0.38],[0.68,0.78]]);
    arc(rx,ry,rx+rw*0.58,ry,W,36,0.28,[[0.28,0.08],[0.60,0.48],[0.88,0.86]]);
    arc(rx,ry,rx+rw*0.72,6,W-4,0,0.20,[[0.30,0.22],[0.65,0.68]]);
    arc(rx,ry,rx+rw*0.64,82,W,124,0.22,[[0.32,0.42],[0.68,0.82]]);
    setArcs(list);
  }, []);

  return (
    <svg aria-hidden viewBox={`0 0 ${vw} 150`} preserveAspectRatio="none"
      style={{position:"fixed",top:0,left:0,width:"100%",height:"150px",pointerEvents:"none",zIndex:9997,opacity:visible?1:0,transition:"opacity 0.45s ease"}}>
      <defs>
        <filter id="dn-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {arcs.map((a,i)=>(
        <g key={i}>
          <path d={a.d} stroke={`rgba(212,175,55,${a.op})`} strokeWidth="1.1" fill="none"/>
          {a.dots.map((dot,j)=>(
            <circle key={j} cx={dot.cx} cy={dot.cy} r="2.6" fill="rgba(255,185,45,0.9)" filter="url(#dn-glow)"
              style={{animation:"dotPulse 2.4s ease-in-out infinite",animationDelay:`${dot.delay}s`}}/>
          ))}
        </g>
      ))}
    </svg>
  );
}

// ─── DomeNav ───────────────────────────────────────────────────────────────────
interface Props {
  onSelect: (key:string) => void;
  activeSection: string | null;
  onCloseSection: () => void;
  autoOpenGroup?: string | null;
  onOpenChange?: (isOpen: boolean) => void;
}

export function DomeNav({ onSelect, activeSection, onCloseSection, autoOpenGroup, onOpenChange }: Props) {
  const [open,  setOpen]  = useState(false);
  const [group, setGroup] = useState<string|null>(null);
  const [hoveredGroup, setHoveredGroup] = useState<string|null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => { onOpenChange?.(open); }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const onOut=(e:MouseEvent)=>{if(wrapRef.current&&!wrapRef.current.contains(e.target as Node)){setOpen(false);setGroup(null);}};
    const onKey=(e:KeyboardEvent)=>{if(e.key==="Escape"){if(group)setGroup(null);else setOpen(false);}};
    document.addEventListener("click",onOut); document.addEventListener("keydown",onKey);
    return ()=>{document.removeEventListener("click",onOut);document.removeEventListener("keydown",onKey);};
  },[group]);
  useEffect(()=>{if(activeSection){setOpen(false);setGroup(null);}},[activeSection]);

  // Auto-open a group when DomeNav first mounts after landing → nav transition.
  const autoOpenGroupRef = useRef(autoOpenGroup ?? null);
  useEffect(()=>{
    if(autoOpenGroupRef.current){setOpen(true);setGroup(autoOpenGroupRef.current);}
  },[]); // eslint-disable-line react-hooks/exhaustive-deps

  const activeIdx = group ? GROUPS.findIndex(g=>g.key===group) : -1;
  const ax = activeIdx>=0 ? POSITIONS[activeIdx].x : 0;
  const ay = activeIdx>=0 ? POSITIONS[activeIdx].y : 0;
  const cPath = activeIdx>=0 ? connectorPath(ax, ay, activeIdx) : "";

  return (
    <>

      {/* Back button when inside a section */}
      <AnimatePresence>
        {activeSection && (
          <motion.button key="close" initial={{scale:0}} animate={{scale:1}} exit={{scale:0}}
            onClick={onCloseSection} data-testid="button-back-to-nav"
            style={{position:"fixed",bottom:"1.5rem",right:"1.5rem",zIndex:10002,
              width:"56px",height:"56px",borderRadius:"50%",background:"rgba(20,20,40,0.92)",
              border:`2px solid ${C.gold}`,color:C.white,fontSize:"18px",cursor:"pointer",
              display:"flex",alignItems:"center",justifyContent:"center",
              boxShadow:`0 0 0 5px rgba(0,0,0,0.8), 0 0 20px rgba(212,175,55,0.4)`,
              fontFamily:"'Josefin Sans',sans-serif"}}>✕</motion.button>
        )}
      </AnimatePresence>

      {/* ══ Wrap ══════════════════════════════════════════════════════════════ */}
      <div ref={wrapRef}
        style={{position:"fixed",top:"0px",left:"50%",transform:"translateX(-50%)",width:`${BTN}px`,zIndex:9999}}>

        {/* ── Dome backdrop ─────────────────────────────────────────────────────
             SEMICIRCLE when open (no active group):
               width=440, border-radius="0 0 220px 220px" → perfect semicircle
               with radius 220 centred exactly on the hamburger; every circle
               is 20px from the edge (R+IHLF+20 = 200+20 = 220 = DOM_R).
             RECTANGLE when a group is active:
               Same width, flat-bottomed with rounded corners (0 0 20px 20px),
               height grows to contain the sub-item pills.
        ── */}
        <div style={{
          position:"absolute",
          width:`${BACKDROP_W}px`,                       // 440
          left:`${HALF - BACKDROP_W/2}px`,               // −180
          top:`${BACKDROP_TOP}px`,                       // −22
          height: !open
            ? 0
            : group
              ? `${SUB_Y + PH*2 + PGAP + 38 - BACKDROP_TOP}px`  // ~446
              : `${BACKDROP_H_SEMI}px`,                           // ~282
          overflow:"hidden",
          background:"rgba(3,6,16,0.94)",
          borderRadius: group ? "0 0 20px 20px" : `0 0 ${DOM_R}px ${DOM_R}px`,
          borderLeft:`1px solid rgba(180,180,255,0.10)`,
          borderRight:`1px solid rgba(180,180,255,0.10)`,
          borderBottom: open ? `1px solid rgba(180,180,255,0.10)` : "none",
          borderTop:"none",
          pointerEvents:"none", zIndex:-1,
          opacity:1,
          transition:"height 0.45s cubic-bezier(0.16,1,0.3,1), border-radius 0.38s ease",
        }}/>

        {/* ── Hamburger ─────────────────────────────────────────────────────── */}
        <button
          onClick={(e)=>{e.stopPropagation();setOpen(v=>!v);if(open)setGroup(null);}}
          aria-label={open?"Close navigation":"Open navigation"} aria-expanded={open}
          data-testid="button-dome-hamburger"
          style={{width:`${BTN}px`,height:`${BTN}px`,borderRadius:"50%",background:"#8b0000",
            border:`2px solid #FFE87C`,display:"flex",alignItems:"center",justifyContent:"center",
            cursor:"pointer",position:"relative",zIndex:10001,
            boxShadow:`0 0 0 1px rgba(255,232,124,0.4), 0 0 24px rgba(139,0,0,0.65)`,
            transition:"box-shadow 0.3s"}}>
          <motion.div animate={{rotate:open?90:0}} transition={{duration:0.35,ease:[0.4,0,0.2,1]}}
            style={{display:"flex",flexDirection:"column",gap:"5px",alignItems:"center"}}>
            {[0,1,2].map(n=>(
              <span key={n} style={{display:"block",width:"28px",height:"2px",borderRadius:"1px",background:"#FFE87C"}}/>
            ))}
          </motion.div>
        </button>

        {/* ── Connector SVG — z 9999, circles z 10000 render ON TOP naturally ─── */}
        {/* Animation: new line draws in first (pathLength 0→1, 0.45 s),           */}
        {/*            then the exiting line erases (pathLength 1→0, 0.35 s delay). */}
        <svg aria-hidden
          style={{position:"absolute",left:`${HALF}px`,top:`${HALF}px`,
                  width:1,height:1,overflow:"visible",pointerEvents:"none",zIndex:9999}}>
          <AnimatePresence>
            {activeIdx >= 0 && (
              <motion.path
                key={group}
                d={cPath}
                fill="none"
                stroke={C.goldLt}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1, transition: { duration: 0.45, ease: [0.4,0,0.2,1] } }}
                exit={{ pathLength: 0, transition: { duration: 0.35, delay: 0.45, ease: [0.4,0,0.2,1] } }}
              />
            )}
          </AnimatePresence>
        </svg>


        {/* ── Main circles — z 10000, render ON TOP of connector line ────────── */}
        {GROUPS.map((grp,i)=>{
          const {x,y}=POSITIONS[i];
          const left=HALF+x-IHLF, top=HALF+y-IHLF;
          const toX=IHLF-x, toY=IHLF-y;
          const isAct=group===grp.key, isDim=group!==null&&!isAct;
          return (
            <div key={grp.key} style={{
              position:"absolute",left:`${left}px`,top:`${top}px`,
              width:`${ITEM}px`,height:`${ITEM}px`,
              transformOrigin:`${toX}px ${toY}px`,
              transform:open?"scale(1)":"scale(0.12)",
              opacity:open?(isDim?0.32:1):0,
              pointerEvents:open?"auto":"none",
              transition:[
                `transform 0.42s cubic-bezier(0.16,1,0.3,1) ${open?0.06+i*0.042:0}s`,
                `opacity 0.28s ease ${open?0.05+i*0.038:0}s`,
              ].join(","),
              zIndex:10000,
            }}>
              <button
                onClick={(e)=>{e.stopPropagation();setGroup(v=>v===grp.key?null:grp.key);}}
                data-testid={`button-nav-group-${grp.key}`}
                onMouseOver={()=>setHoveredGroup(grp.key)}
                onMouseOut={()=>setHoveredGroup(null)}
                style={{
                  width:"100%",height:"100%",borderRadius:"50%",
                  background: hoveredGroup===grp.key
                    ? `radial-gradient(circle at 42% 38%, ${grp.color}ff 0%, ${grp.color}cc 40%, ${grp.color}66 70%, transparent 100%)`
                    : isAct
                      ? `radial-gradient(circle at 42% 38%, ${grp.color}cc 0%, ${grp.color}88 40%, ${grp.color}44 70%, transparent 100%)`
                      : `radial-gradient(circle at 42% 38%, ${grp.color}88 0%, ${grp.color}55 50%, ${grp.color}22 80%)`,
                  border:`2.5px solid ${grp.color}`,
                  color:"#ffffff",
                  fontFamily:"'Josefin Sans',sans-serif",fontSize:"11.5px",fontWeight:700,
                  letterSpacing:"0.04em",textTransform:"uppercase",
                  display:"flex",flexDirection:"column",alignItems:"center",
                  justifyContent:"flex-start",textAlign:"center",cursor:"pointer",
                  paddingTop:"10px",paddingBottom:"0px",paddingLeft:"3px",paddingRight:"3px",
                  lineHeight:1.25,
                  textShadow: hoveredGroup===grp.key
                    ? `0 0 12px #fff, 0 0 24px ${grp.color}`
                    : `0 0 8px ${grp.color}bb`,
                  boxShadow: hoveredGroup===grp.key
                    ? `0 0 0 3px rgba(3,6,16,0.5), 0 0 28px ${grp.color}, 0 0 50px ${grp.color}88`
                    : isAct
                      ? `0 0 0 4px rgba(3,6,16,0.6),0 0 22px ${grp.color}cc,0 0 44px ${grp.color}66`
                      : `0 0 14px ${grp.color}88, inset 0 0 12px ${grp.color}22`,
                  transition:"background 0.2s,box-shadow 0.2s,text-shadow 0.2s",
                }}
              >
                <span style={{fontSize:"20px",lineHeight:1,marginBottom:"1px"}}>{grp.icon}</span>
                <span style={{fontSize:"7px",opacity:0.6,marginBottom:"1px",letterSpacing:"0.1em"}}>{grp.num}</span>
                {grp.label.map((ln,j)=><span key={j} style={{display:"block"}}>{ln}</span>)}
              </button>
            </div>
          );
        })}

        {/* ── Sub-item pills — fixed center-bottom ─────────────────────────── */}
        <div style={{
          position:"absolute",
          left:`${HALF-PW/2}px`,
          top:`${SUB_Y}px`,
          width:`${PW}px`,
          pointerEvents:group?"auto":"none",
          zIndex:10001,
        }}>
          <AnimatePresence mode="wait">
            {group && (()=>{
              const ag=GROUPS.find(g=>g.key===group)!;
              return (
                <motion.div key={group}
                  initial="h" animate="v" exit="h"
                  variants={{h:{},v:{transition:{staggerChildren:0.08}}}}>
                  {ag.items.map((sub,j)=>(
                    <motion.div key={sub.key}
                      variants={{
                        h:{opacity:0,scale:0.6,y:-8},
                        v:{opacity:1,scale:1,y:0,transition:{duration:0.38,ease:[0.16,1,0.3,1]}},
                      }}
                      style={{marginBottom:j<ag.items.length-1?`${PGAP}px`:0,
                              position:"relative",zIndex:1}}>
                      {/* Vertical bridge to next pill */}
                      {j<ag.items.length-1&&(
                        <div style={{
                          position:"absolute",
                          bottom:`-${PGAP}px`,
                          left:"50%",
                          transform:"translateX(-50%)",
                          width:"2px",
                          height:`${PGAP}px`,
                          background:`linear-gradient(to bottom, ${C.gold}, ${C.gold})`,
                          opacity:0.75,
                          zIndex:0,
                        }}/>
                      )}
                      <button
                        onClick={(e)=>{e.stopPropagation();setOpen(false);setGroup(null);onSelect(sub.key);}}
                        data-testid={`button-nav-sub-${sub.key.toLowerCase().replace(/[^a-z0-9]+/g,"-")}`}
                        style={{
                          width:`${PW}px`,height:`${PH}px`,
                          borderRadius:`${PH/2}px`,
                          background:C.dark,
                          border:`2px solid ${C.gold}`,
                          color:C.gold,
                          fontFamily:"'Josefin Sans',sans-serif",
                          fontSize:"11px",fontWeight:700,
                          letterSpacing:"0.06em",textTransform:"uppercase",
                          display:"flex",alignItems:"center",justifyContent:"center",
                          gap:"10px",cursor:"pointer",padding:"0 20px",
                          transition:"background 0.15s,border-color 0.15s,color 0.15s",
                        }}
                        onMouseOver={e=>{const ag2=GROUPS.find(g=>g.key===group)!;const b=e.currentTarget;b.style.background=`radial-gradient(circle at 42% 38%, ${ag2.color}66 0%, ${ag2.color}33 60%, transparent 100%)`;b.style.borderColor=ag2.color;b.style.color=C.white;}}
                        onMouseOut ={e=>{const b=e.currentTarget;b.style.background=C.dark;b.style.borderColor=C.gold;b.style.color=C.gold;}}
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
