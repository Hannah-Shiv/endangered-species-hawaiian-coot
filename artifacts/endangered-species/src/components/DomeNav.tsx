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
  fill:   "#16a34a",
  border: "#22c55e",
  active: "#4ade80",
  gold:   "#d4af37",
  goldLt: "#ffe58f",
  dark:   "#040712",
  white:  "#ffffff",
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
const BTN   = 80;         // hamburger diameter
const HALF  = BTN / 2;    // 40 = hamburger center in wrap-div space
const ITEM  = 84;
const IHLF  = ITEM / 2;   // 42
const R     = 158;        // semicircle radius

// Sub-item pills
const PW    = 224;
const PH    = 52;
const PGAP  = 12;

// The SVG coordinate system has (0,0) at the hamburger center.
// All (x,y) positions below are in that SVG space.
//
// Lowest circle bottom:  y = 152 + 42 = 194  (SVG space)
// Bottom connector rail: y = 208              (below all circles)
// Sub-items top:         y = 224              (a gap below the rail)
// Sub-items in wrap:     top = 224 + HALF = 264

const RAIL_Y  = 208;   // horizontal bottom rail for L-connector
const SUB_SVG = 228;   // sub-items top in SVG space (HALF below = wrap y 268)
const SUB_Y   = SUB_SVG + HALF; // = 268  — CSS top of sub-item container in wrap space

/** Downward semicircle */
function arcPos(i: number) {
  const theta = (i / (GROUPS.length - 1)) * Math.PI;
  return { x: Math.round(-R * Math.cos(theta)), y: Math.round(R * Math.sin(theta)) };
}
const POSITIONS = GROUPS.map((_, i) => arcPos(i));

/**
 * Build the L-shaped connector path (in SVG space, origin = hamburger center).
 *
 * Route: circle bottom → straight down → rounded corner → horizontal along bottom
 *        rail → rounded corner → drop to sub-items center.
 *
 * Circles are z-indexed ABOVE the connector SVG, so where the line geometrically
 * passes through a circle's area the circle button is drawn on top — creating the
 * visual impression that the connector routes "around" them.
 */
function connectorPath(x: number, y: number): string {
  const startY = y + IHLF;
  const railY  = RAIL_Y;
  const endY   = SUB_SVG;
  const r      = 18;

  // Centre circles (i=2/3 at x≈±49): near-straight drop
  if (Math.abs(x) < 55) {
    return `M ${x} ${startY} Q ${x} ${railY} 0 ${endY}`;
  }

  const sign = x < 0 ? 1 : -1;   // +1 → left circle (turns rightward), -1 → right

  // For the deepest circles (y=152), startY=194 may already be past railY-r=190.
  // Skip the explicit vertical leg in that case — go straight to the corner.
  const hasTurn = startY < railY - r;

  if (hasTurn) {
    return [
      `M ${x} ${startY}`,
      `L ${x} ${railY - r}`,
      `Q ${x} ${railY} ${x + sign * r} ${railY}`,
      `L ${-sign * r} ${railY}`,
      `Q 0 ${railY} 0 ${railY + r}`,
      `L 0 ${endY}`,
    ].join(" ");
  } else {
    // Circle bottom is already at/below the turn — shorter path, no upward leg
    return [
      `M ${x} ${startY}`,
      `Q ${x} ${railY} ${x + sign * r} ${railY}`,
      `L ${-sign * r} ${railY}`,
      `Q 0 ${railY} 0 ${railY + r}`,
      `L 0 ${endY}`,
    ].join(" ");
  }
}

// Approximate path length for stroke-dasharray animation
function pathLen(x: number, y: number): number {
  const startY  = y + IHLF;
  const vertLen = Math.max(0, RAIL_Y - startY);
  const horizLen = Math.abs(x);
  return vertLen + horizLen + (SUB_SVG - RAIL_Y) + 80;
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
interface Props { onSelect:(key:string)=>void; activeSection:string|null; onCloseSection:()=>void; }

export function DomeNav({ onSelect, activeSection, onCloseSection }: Props) {
  const [open,  setOpen]  = useState(false);
  const [group, setGroup] = useState<string|null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onOut=(e:MouseEvent)=>{if(wrapRef.current&&!wrapRef.current.contains(e.target as Node)){setOpen(false);setGroup(null);}};
    const onKey=(e:KeyboardEvent)=>{if(e.key==="Escape"){if(group)setGroup(null);else setOpen(false);}};
    document.addEventListener("click",onOut); document.addEventListener("keydown",onKey);
    return ()=>{document.removeEventListener("click",onOut);document.removeEventListener("keydown",onKey);};
  },[group]);
  useEffect(()=>{if(activeSection){setOpen(false);setGroup(null);}},[activeSection]);

  const activeIdx = group ? GROUPS.findIndex(g=>g.key===group) : -1;
  const ax = activeIdx>=0 ? POSITIONS[activeIdx].x : 0;
  const ay = activeIdx>=0 ? POSITIONS[activeIdx].y : 0;
  const cPath = activeIdx>=0 ? connectorPath(ax, ay) : "";
  const cLen  = activeIdx>=0 ? pathLen(ax, ay) : 800;

  return (
    <>
      <IntelThreads visible={open}/>

      {/* Back button when inside a section */}
      <AnimatePresence>
        {activeSection && (
          <motion.button key="close" initial={{scale:0}} animate={{scale:1}} exit={{scale:0}}
            onClick={onCloseSection} data-testid="button-back-to-nav"
            style={{position:"fixed",bottom:"1.5rem",right:"1.5rem",zIndex:10002,
              width:"56px",height:"56px",borderRadius:"50%",background:C.fill,
              border:`2px solid ${C.active}`,color:C.white,fontSize:"18px",cursor:"pointer",
              display:"flex",alignItems:"center",justifyContent:"center",
              boxShadow:`0 0 0 5px rgba(0,0,0,0.8), 0 0 20px rgba(34,197,94,0.4)`,
              fontFamily:"'Josefin Sans',sans-serif"}}>✕</motion.button>
        )}
      </AnimatePresence>

      {/* ══ Wrap ══════════════════════════════════════════════════════════════ */}
      <div ref={wrapRef}
        style={{position:"fixed",top:"10px",left:"50%",transform:"translateX(-50%)",width:`${BTN}px`,zIndex:9999}}>

        {/* ── Dome backdrop: SEMICIRCLE when open, RECTANGLE when group active ── */}
        <div style={{
          position:"absolute",
          width:"520px",
          left:`${-(520/2)+HALF}px`,
          top:"-10px",
          // Height grows to contain sub-items when a group is active
          height: group ? `${SUB_Y + PH*2 + PGAP + 30}px` : "242px",
          background:"rgba(3,6,16,0.94)",
          // KEY: morph from semicircle to flat-bottomed rectangle
          borderRadius: group ? "0 0 0 0" : "0 0 260px 260px",
          borderLeft:`1px solid rgba(34,197,94,0.11)`,
          borderRight:`1px solid rgba(34,197,94,0.11)`,
          borderBottom:`1px solid rgba(34,197,94,0.11)`,
          borderTop:"none",
          pointerEvents:"none", zIndex:-1,
          opacity: open ? 1 : 0,
          transition:"opacity 0.3s ease, height 0.4s cubic-bezier(0.16,1,0.3,1), border-radius 0.35s ease",
        }}/>

        {/* ── Hamburger ─────────────────────────────────────────────────────── */}
        <button
          onClick={(e)=>{e.stopPropagation();setOpen(v=>!v);if(open)setGroup(null);}}
          aria-label={open?"Close navigation":"Open navigation"} aria-expanded={open}
          data-testid="button-dome-hamburger"
          style={{width:`${BTN}px`,height:`${BTN}px`,borderRadius:"50%",background:C.fill,
            border:`2.5px solid ${C.active}`,display:"flex",alignItems:"center",justifyContent:"center",
            cursor:"pointer",position:"relative",zIndex:10001,
            boxShadow:`0 0 0 7px rgba(3,6,16,0.92), 0 0 0 9px rgba(34,197,94,0.22), 0 0 28px rgba(34,197,94,0.18)`,
            transition:"box-shadow 0.3s"}}>
          <motion.div animate={{rotate:open?90:0}} transition={{duration:0.35,ease:[0.4,0,0.2,1]}}
            style={{display:"flex",flexDirection:"column",gap:"5px",alignItems:"center"}}>
            {[0,1,2].map(n=>(
              <span key={n} style={{display:"block",width:"22px",height:"2.5px",borderRadius:"2px",background:C.white}}/>
            ))}
          </motion.div>
        </button>

        {/* ── L-shaped connector SVG — rendered BELOW circles (z 9999 vs circles z 10000) ── */}
        <svg aria-hidden
          style={{position:"absolute",left:`${HALF}px`,top:`${HALF}px`,
                  width:1,height:1,overflow:"visible",pointerEvents:"none",zIndex:9999}}>
          {activeIdx>=0 && (
            <path d={cPath}
              style={{fill:"none",stroke:C.goldLt,strokeWidth:"2.5",strokeLinecap:"round",
                strokeLinejoin:"round",
                strokeDasharray:cLen,
                strokeDashoffset:group?0:cLen,
                transition:`stroke-dashoffset 0.5s cubic-bezier(0.4,0,0.2,1) 0.05s`}}/>
          )}
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
                style={{
                  width:"100%",height:"100%",borderRadius:"50%",
                  background:isAct?C.fill:C.dark,
                  border:`2.5px solid ${isAct?C.active:C.border}`,
                  color:isAct?C.white:C.gold,
                  fontFamily:"'Josefin Sans',sans-serif",fontSize:"8.5px",fontWeight:700,
                  letterSpacing:"0.05em",textTransform:"uppercase",
                  display:"flex",flexDirection:"column",alignItems:"center",
                  justifyContent:"center",textAlign:"center",cursor:"pointer",
                  padding:"6px 4px 4px",lineHeight:1.3,
                  boxShadow:isAct?`0 0 0 5px rgba(3,6,16,0.7),0 0 22px rgba(34,197,94,0.55),0 0 44px rgba(34,197,94,0.2)`:"none",
                  transition:"background 0.2s,border-color 0.2s,color 0.2s,box-shadow 0.2s",
                }}
                onMouseOver={e=>{if(!isAct){const b=e.currentTarget;b.style.background=C.fill;b.style.borderColor=C.active;b.style.color=C.white;}}}
                onMouseOut ={e=>{if(!isAct){const b=e.currentTarget;b.style.background=C.dark;b.style.borderColor=C.border;b.style.color=C.gold;}}}
              >
                <span style={{fontSize:"17px",lineHeight:1,marginBottom:"2px"}}>{grp.icon}</span>
                <span style={{fontSize:"7px",opacity:0.5,marginBottom:"2px",letterSpacing:"0.07em"}}>{grp.num}</span>
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
          {/* Vertical gold spine through pills */}
          <svg aria-hidden style={{position:"absolute",left:`${PW/2}px`,top:0,width:1,height:1,overflow:"visible",pointerEvents:"none"}}>
            {group && (
              <line x1={0} y1={0} x2={0} y2={PH*2+PGAP}
                stroke={C.gold} strokeWidth="2.5"/>
            )}
          </svg>

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
                      style={{marginBottom:j<ag.items.length-1?`${PGAP}px`:0}}>
                      <button
                        onClick={(e)=>{e.stopPropagation();setOpen(false);setGroup(null);onSelect(sub.key);}}
                        data-testid={`button-nav-sub-${sub.key.toLowerCase().replace(/[^a-z0-9]+/g,"-")}`}
                        style={{
                          width:`${PW}px`,height:`${PH}px`,
                          borderRadius:`${PH/2}px`,
                          background:C.dark,
                          border:`2px solid ${C.border}`,
                          color:C.gold,
                          fontFamily:"'Josefin Sans',sans-serif",
                          fontSize:"11px",fontWeight:700,
                          letterSpacing:"0.06em",textTransform:"uppercase",
                          display:"flex",alignItems:"center",justifyContent:"center",
                          gap:"10px",cursor:"pointer",padding:"0 20px",
                          transition:"background 0.15s,border-color 0.15s,color 0.15s",
                        }}
                        onMouseOver={e=>{const b=e.currentTarget;b.style.background=C.fill;b.style.borderColor=C.active;b.style.color=C.white;}}
                        onMouseOut ={e=>{const b=e.currentTarget;b.style.background=C.dark;b.style.borderColor=C.border;b.style.color=C.gold;}}
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
