/**
 * RadialLanding — matches reference image_1779602064562.png exactly:
 *  - Real Hawaiian wetland + bird background photo (bg-photo.png)
 *  - 10 glowing circles arranged radially, NO portrait frame
 *  - Cyan dashed inner ring + colored outer glow dots per circle
 *  - Left panel: SAVE OUR WILDLIFE + quote
 *  - Right panel: Quick Facts, Where It Lives, Explore/Learn/Protect
 *  - Bottom bar: SCROLL OR CLICK TO EXPLORE
 */
import { useRef } from "react";
import { motion } from "framer-motion";
import bgPhoto    from "../assets/bg-photo.png";
import birdImg    from "../assets/bird-transparent.png";
import circle01 from "../assets/circles/circle01.png";
import circle02 from "../assets/circles/circle02.png";
import circle03 from "../assets/circles/circle03.png";
import circle04 from "../assets/circles/circle04.png";
import circle05 from "../assets/circles/circle05.png";
import circle06 from "../assets/circles/circle06.png";
import circle07 from "../assets/circles/circle07.png";
import circle08 from "../assets/circles/circle08.png";
import circle09 from "../assets/circles/circle09.png";
import circle10 from "../assets/circles/circle10.png";

const CIRCLE_IMGS = [circle01, circle02, circle03, circle04, circle05,
                     circle06, circle07, circle08, circle09, circle10];

// ─── Geometry ──────────────────────────────────────────────────────────────
const CZ = 155;   // circle diameter px
const R  = 285;   // ring radius px

// ─── Data ───────────────────────────────────────────────────────────────────
const ITEMS = [
  { num:"01", key:"Meet the Species",         group:"the-species",
    icon:"🐦", color:"#22c55e",
    title:"MEET\n\u02BBALAE KE\u02BBOKE\u02BBO",
    desc:"5 interesting facts\n& characteristics" },
  { num:"02", key:"Habitat & Location",       group:"habitat",
    icon:"🏝", color:"#06b6d4",
    title:"HABITAT &\nWETLANDS",
    desc:"Where it lives\n& island map" },
  { num:"03", key:"Climate Stressors",        group:"climate",
    icon:"⛈",  color:"#0891b2",
    title:"CLIMATE\nSTRESSORS",
    desc:"Sea level rise, storms,\ndrought & habitat loss" },
  { num:"04", key:"Human Impact",             group:"threats",
    icon:"🏙", color:"#7c3aed",
    title:"HUMAN\nIMPACT",
    desc:"Threats from humans\n& invasive species" },
  { num:"05", key:"Conservation & Solutions", group:"survival",
    icon:"🌱", color:"#f97316",
    title:"CONSERVATION\n& SOLUTIONS",
    desc:"Restoration, protection\n& how we can help" },
  { num:"06", key:"Food Web",                 group:"habitat",
    icon:"🐟", color:"#14b8a6",
    title:"FOOD WEB",
    desc:"Energy flow in the\nwetland ecosystem" },
  { num:"07", key:"Adaptations",              group:"survival",
    icon:"🍃", color:"#22c55e",
    title:"ADAPTATIONS",
    desc:"Floating nests, lobed\nfeet & wetland survival" },
  { num:"08", key:"Evolution",                group:"the-species",
    icon:"🧬", color:"#f97316",
    title:"EVOLUTION &\nCLASSIFICATION",
    desc:"Origins, relatives &\nscientific details" },
  { num:"09", key:"Extinction Risk",          group:"future",
    icon:"🛡", color:"#7c3aed",
    title:"EXTINCTION\nRISK",
    desc:"Status, population\ntrends & future outlook" },
  { num:"10", key:"Sources & Citations",      group:"future",
    icon:"📋", color:"#d4af37",
    title:"SOURCES",
    desc:"References\n& credits" },
] as const;

function pos(i: number) {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / ITEMS.length;
  return { x: Math.round(R * Math.cos(a)), y: Math.round(R * Math.sin(a)) };
}

interface Props {
  onSelect: (sectionKey: string, groupKey: string) => void;
  exiting: boolean;
}

export function RadialLanding({ onSelect, exiting }: Props) {
  const vh = useRef(window.innerHeight).current;

  const panelAnim = (dir: 1 | -1, delay = 0.1) => ({
    initial: { opacity: 0, x: dir * 50 },
    animate: exiting
      ? { opacity: 0, x: dir * 70, transition: { duration: 0.28 } }
      : { opacity: 1, x: 0,        transition: { duration: 0.65, delay, ease: [0.16,1,0.3,1] as const } },
  });

  return (
    <div style={{ position:"fixed", inset:0, zIndex:8000, overflow:"hidden" }}>

      {/* ── BACKGROUND: real wetland + bird photo ──
           height > 100% so the cover image shows a wider vertical slice
           (bird appears smaller), top negative shifts the slice upward    */}
      <img src={bgPhoto} alt="" style={{
        position:"absolute",
        left:0, right:0,
        top:"-18%",
        width:"100%",
        height:"145%",
        objectFit:"cover", objectPosition:"50% 60%",
        filter:"brightness(0.80) contrast(1.05) saturate(1.08)",
      }}/>

      {/* Dark overlay: top (sky) — heavy so panels stay readable */}
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none",
        background:"linear-gradient(to bottom, rgba(1,5,20,0.82) 0%, rgba(2,8,28,0.55) 18%, rgba(3,10,30,0.18) 42%, transparent 60%, rgba(1,4,16,0.30) 85%, rgba(1,3,12,0.62) 100%)",
      }}/>

      {/* Dark vignette: left side for Save Our Wildlife panel */}
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none",
        background:"linear-gradient(to right, rgba(1,4,18,0.88) 0%, rgba(1,4,18,0.65) 8%, rgba(1,4,18,0.20) 18%, transparent 28%)",
      }}/>

      {/* Dark vignette: right side for info panels */}
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none",
        background:"linear-gradient(to left, rgba(1,4,18,0.88) 0%, rgba(1,4,18,0.65) 8%, rgba(1,4,18,0.20) 18%, transparent 28%)",
      }}/>

      {/* ── DECORATIVE RING ─────────────────────────────────────────────────── */}
      <motion.svg
        initial={{ opacity:0 }}
        animate={exiting ? { opacity:0, transition:{ duration:0.3 } } : { opacity:1, transition:{ duration:1, delay:0.4 } }}
        style={{
          position:"absolute", left:"50%", top:"50%",
          transform:"translate(-50%,-50%)",
          overflow:"visible", pointerEvents:"none", zIndex:2,
          width:2, height:2,
        }}
        viewBox="-1 -1 2 2"
      >
        {/* ── OUTER connecting ring at circle-center radius ── */}
        {/* Wide glow layer */}
        <circle r={R} fill="none" stroke="rgba(0,240,215,0.12)" strokeWidth="22"/>
        {/* Main ring line */}
        <circle r={R} fill="none" stroke="rgba(0,240,215,0.60)" strokeWidth="1.8"/>

        {/* ── INNER cyan glow ring — no dots, sits inside the circle arrangement ── */}
        {/* Outer glow halo */}
        <circle r={R-58} fill="none" stroke="rgba(0,230,205,0.14)" strokeWidth="22"/>
        {/* Main bright line */}
        <circle r={R-58} fill="none" stroke="rgba(0,238,212,0.80)" strokeWidth="2.4"/>
        {/* Inner bright specular */}
        <circle r={R-58} fill="none" stroke="rgba(200,255,248,0.35)" strokeWidth="0.9"/>

        {/* ── 20 rainbow dots evenly around the outer ring ── */}
        {Array.from({length:20},(_,i)=>{
          const angle = (i / 20) * Math.PI * 2 - Math.PI / 2;
          const dx = Math.cos(angle) * R;
          const dy = Math.sin(angle) * R;
          const hue = (i / 20) * 360;
          const col = `hsl(${hue},100%,62%)`;
          const colA = `hsla(${hue},100%,62%,`;
          return (
            <g key={`rdot-${i}`}>
              <circle cx={dx} cy={dy} r="18"  fill={`${colA}0.18)`}/>
              <circle cx={dx} cy={dy} r="10"  fill={`${colA}0.50)`}/>
              <circle cx={dx} cy={dy} r="5"   fill={col}/>
              <circle cx={dx} cy={dy} r="2.2" fill="rgba(255,255,255,0.95)"/>
            </g>
          );
        })}
      </motion.svg>

      {/* ── LEFT PANEL ───────────────────────────────────────────────────────── */}
      <motion.div {...panelAnim(-1, 0.1)} style={{
        position:"absolute", left:"18px", top:"9%",
        zIndex:6, width:`calc(50% - ${R + CZ/2 + 22}px)`,
        display:"flex", flexDirection:"column", gap:"14px",
      }}>
        {/* SAVE OUR WILDLIFE */}
        <div>
          <div style={{
            fontFamily:"'Josefin Sans',sans-serif",
            fontSize:"clamp(20px,2.5vw,38px)", fontWeight:900,
            letterSpacing:"0.03em", textTransform:"uppercase",
            color:"#fff", lineHeight:1.04,
            textShadow:"0 2px 24px rgba(0,0,0,0.75)",
          }}>
            Save Our<br/>Wildlife&nbsp;🌿
          </div>
          <div style={{
            fontFamily:"'Josefin Sans',sans-serif",
            fontSize:"clamp(7px,0.75vw,10.5px)", fontWeight:700,
            letterSpacing:"0.34em", color:"rgba(34,197,94,0.88)",
            textTransform:"uppercase", marginTop:"6px",
          }}>Every Species Matters</div>
          <div style={{ display:"flex", alignItems:"center", gap:"8px", marginTop:"10px" }}>
            <span style={{ fontSize:"12px", color:"rgba(34,197,94,0.5)" }}>✦</span>
            <div style={{ flex:1, height:"1px", background:"linear-gradient(to right,rgba(34,197,94,0.55),transparent)" }}/>
          </div>
        </div>

        {/* Quote */}
        <div style={{ paddingLeft:"2px" }}>
          <div style={{
            fontFamily:"'Playfair Display',serif", fontSize:"clamp(20px,2.0vw,30px)",
            color:"rgba(34,197,94,0.65)", lineHeight:1, marginBottom:"8px",
          }}>❝</div>
          <div style={{
            fontFamily:"'Playfair Display',serif",
            fontSize:"clamp(10.5px,0.97vw,14.5px)", fontStyle:"italic",
            color:"rgba(255,255,255,0.80)", lineHeight:1.7,
          }}>
            We don't inherit<br/>the Earth from our<br/>ancestors. We borrow<br/>it from our children.
          </div>
          <div style={{ width:"30px", height:"2px", background:"rgba(34,197,94,0.55)", marginTop:"10px" }}/>
        </div>
      </motion.div>

      {/* ── RIGHT PANEL ──────────────────────────────────────────────────────── */}
      <motion.div {...panelAnim(1, 0.14)} style={{
        position:"absolute",
        left:`calc(50% + ${R + CZ/2 + 22}px)`,
        top:"7%", zIndex:6,
        width:`calc(50% - ${R + CZ/2 + 22}px - 18px)`,
        display:"flex", flexDirection:"column", gap:"11px",
      }}>

        {/* Quick Facts */}
        <div style={{
          background:"rgba(2,5,18,0.82)", backdropFilter:"blur(18px)",
          border:"1px solid rgba(255,255,255,0.10)", borderRadius:"10px",
          padding:"14px 16px",
        }}>
          <div style={{
            fontFamily:"'Josefin Sans',sans-serif", fontSize:"9px", fontWeight:700,
            letterSpacing:"0.26em", color:"rgba(212,175,55,0.85)",
            textTransform:"uppercase", marginBottom:"11px",
          }}>Quick Facts</div>
          {[
            { icon:"🛡", iconColor:"#f97316", text:"Status: Endangered" },
            { icon:"👥", iconColor:"#06b6d4", text:"Population: ~2,500\u20133,500" },
            { icon:"🏔", iconColor:"#22c55e", text:"Habitat: Hawaiian Wetlands" },
            { icon:"⌛", iconColor:"#d4af37", text:"Lifespan: 10\u201315 years" },
          ].map(f=>(
            <div key={f.text} style={{
              display:"flex", alignItems:"center", gap:"9px", marginBottom:"8px",
            }}>
              <span style={{ fontSize:"14px", filter:`drop-shadow(0 0 4px ${f.iconColor}88)`, flexShrink:0 }}>{f.icon}</span>
              <span style={{
                fontFamily:"'Josefin Sans',sans-serif", fontSize:"10.5px",
                color:"rgba(255,255,255,0.88)", letterSpacing:"0.02em",
              }}>{f.text}</span>
            </div>
          ))}
        </div>

        {/* Where It Lives */}
        <div style={{
          background:"rgba(2,5,18,0.82)", backdropFilter:"blur(18px)",
          border:"1px solid rgba(255,255,255,0.10)", borderRadius:"10px",
          padding:"14px 16px",
        }}>
          <div style={{
            fontFamily:"'Josefin Sans',sans-serif", fontSize:"9px", fontWeight:700,
            letterSpacing:"0.26em", color:"rgba(212,175,55,0.85)",
            textTransform:"uppercase", marginBottom:"9px",
          }}>Where It Lives</div>
          <div style={{ fontSize:"24px", marginBottom:"7px", opacity:0.55 }}>🗺️</div>
          <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.55)", marginBottom:"6px" }}>🏝 Hawaii Islands</div>
          <div style={{
            fontFamily:"'Playfair Display',serif", fontSize:"11.5px",
            color:"rgba(255,255,255,0.78)", lineHeight:1.65,
          }}>
            Found only in the Hawaiian Islands<br/>
            Native to freshwater wetlands<br/>across the islands.
          </div>
        </div>

        {/* Explore / CTA */}
        <div>
          <div style={{
            fontFamily:"'Playfair Display',serif",
            fontSize:"clamp(18px,1.85vw,28px)", fontWeight:700, lineHeight:1.35,
          }}>
            <span style={{ color:"#22c55e", textShadow:"0 0 20px rgba(34,197,94,0.65)" }}>Explore.</span><br/>
            <span style={{ color:"#14b8a6", textShadow:"0 0 20px rgba(20,184,166,0.55)" }}>Learn.</span>{" "}
            <span style={{ fontSize:"0.68em" }}>🌿</span><br/>
            <span style={{ color:"#f97316", textShadow:"0 0 20px rgba(249,115,22,0.55)" }}>Protect.</span>
          </div>
          <div style={{
            fontFamily:"'Josefin Sans',sans-serif", fontSize:"10px",
            color:"rgba(255,255,255,0.5)", letterSpacing:"0.04em",
            marginTop:"9px", lineHeight:1.6,
          }}>
            Click any section to explore<br/>the world of the {"\u02BBalae ke\u02BBoke\u02BBo"}.
          </div>
          <div style={{ color:"rgba(249,115,22,0.75)", fontSize:"14px", marginTop:"7px" }}>→</div>
        </div>
      </motion.div>


      {/* ── CENTER: floating species name — below the bird's body ───────────── */}
      <motion.div
        initial={{ opacity:0, y:12 }}
        animate={exiting
          ? { opacity:0, scale:0.9, transition:{ duration:0.3 } }
          : { opacity:1, y:0, transition:{ duration:0.9, delay:0.4, ease:[0.16,1,0.3,1] as const } }
        }
        style={{
          position:"absolute",
          left:0, right:0,
          top:"54%",
          zIndex:5, textAlign:"center", pointerEvents:"none",
          whiteSpace:"nowrap",
        }}
      >
        {/* Main Hawaiian name */}
        <div style={{
          fontFamily:"'Josefin Sans',sans-serif",
          fontSize:"clamp(24px,3.1vw,42px)", fontWeight:900,
          letterSpacing:"0.06em", color:"#fff",
          textTransform:"uppercase", lineHeight:1.0,
          textShadow:"0 2px 32px rgba(0,0,0,0.95), 0 0 60px rgba(0,0,0,0.85)",
        }}>
          {"\u02BBAlae Ke\u02BBoke\u02BBo"}
        </div>

        {/* HAWAIIAN COOT */}
        <div style={{
          fontFamily:"'Josefin Sans',sans-serif",
          fontSize:"clamp(10px,1.15vw,15px)", fontWeight:700,
          letterSpacing:"0.36em", color:"rgba(0,218,195,0.95)",
          textTransform:"uppercase", marginTop:"7px",
          textShadow:"0 1px 12px rgba(0,0,0,0.9)",
        }}>
          Hawaiian Coot
        </div>

        {/* — Fulica alai — with decorative rules */}
        <div style={{
          display:"flex", alignItems:"center", justifyContent:"center",
          gap:"10px", marginTop:"7px",
        }}>
          <div style={{ width:"55px", height:"1px", background:"rgba(212,175,55,0.60)" }}/>
          <div style={{
            fontFamily:"'Playfair Display',serif",
            fontSize:"clamp(10px,1.05vw,14px)",
            fontStyle:"italic", color:"rgba(255,255,255,0.68)",
            textShadow:"0 1px 8px rgba(0,0,0,0.9)",
          }}>Fulica alai</div>
          <div style={{ width:"55px", height:"1px", background:"rgba(212,175,55,0.60)" }}/>
        </div>

        {/* ENDANGERED */}
        <div style={{
          fontFamily:"'Josefin Sans',sans-serif",
          fontSize:"clamp(10px,1.05vw,14px)", fontWeight:700,
          letterSpacing:"0.36em", color:"#f97316",
          textTransform:"uppercase", marginTop:"7px",
          textShadow:"0 0 18px rgba(249,115,22,0.90), 0 1px 8px rgba(0,0,0,0.9)",
        }}>
          Endangered
        </div>
      </motion.div>

      {/* ── 10 RADIAL CIRCLES ───────────────────────────────────────────────── */}
      {ITEMS.map((item, i) => {
        const { x, y } = pos(i);
        const HALF = CZ / 2;
        const targetX = -x;
        const targetY = 50 - vh / 2 - y;

        return (
          <motion.div
            key={item.key}
            initial={{ scale:0, opacity:0 }}
            animate={exiting
              ? { x:targetX, y:targetY, scale:0, opacity:0,
                  transition:{ duration:0.5, delay:i*0.025, ease:[0.4,0,0.8,1] as const } }
              : { x:0, y:0, scale:1, opacity:1,
                  transition:{ duration:0.6, delay:0.1+i*0.045, ease:[0.16,1,0.3,1] as const } }
            }
            whileHover={!exiting ? { scale:1.1, transition:{ duration:0.16 } } : {}}
            style={{
              position:"absolute",
              left:`calc(50% + ${x - HALF}px)`,
              top:`calc(50% + ${y - HALF}px)`,
              width:`${CZ}px`, height:`${CZ}px`,
              cursor:"pointer", zIndex:10,
            }}
            onClick={() => !exiting && onSelect(item.key, item.group)}
          >
            {/* Pre-rendered circle PNG — transparent corners, glow from the PNG itself */}
            <img
              src={CIRCLE_IMGS[i]}
              alt={item.key}
              style={{
                width:"100%", height:"100%",
                objectFit:"contain", display:"block",
                filter:`drop-shadow(0 0 8px ${item.color}99)`,
              }}
            />
          </motion.div>
        );
      })}

      {/* ── BOTTOM BAR: SCROLL OR CLICK TO EXPLORE ──────────────────────────── */}
      <motion.div
        initial={{ opacity:0, y:16 }}
        animate={exiting
          ? { opacity:0, y:16, transition:{ duration:0.22 } }
          : { opacity:1, y:0,  transition:{ duration:0.6, delay:0.55 } }
        }
        style={{
          position:"absolute", bottom:"16px", left:"50%",
          transform:"translateX(-50%)", zIndex:7,
          textAlign:"center", pointerEvents:"none", userSelect:"none",
          display:"flex", flexDirection:"column", alignItems:"center", gap:"5px",
        }}
      >
        <div style={{
          fontFamily:"'Josefin Sans',sans-serif", fontSize:"11px", fontWeight:700,
          letterSpacing:"0.32em", color:"rgba(0,218,195,0.88)",
          textTransform:"uppercase",
          display:"flex", alignItems:"center", gap:"14px",
        }}>
          <span style={{ opacity:0.55, fontSize:"13px" }}>❮❮</span>
          Scroll or Click to Explore
          <span style={{ opacity:0.55, fontSize:"13px" }}>❯❯</span>
        </div>
        <div style={{ fontSize:"18px", color:"rgba(0,218,195,0.55)", lineHeight:1 }}>🖱</div>
      </motion.div>

    </div>
  );
}
