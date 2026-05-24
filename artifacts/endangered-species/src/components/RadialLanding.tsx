/**
 * RadialLanding — matches reference image_1779602064562.png exactly:
 *  - Dramatic dark scene background (blue-shifted) + bird overlay
 *  - 10 glowing circles arranged radially, NO portrait frame
 *  - Cyan/teal dashed ring
 *  - Left panel: SAVE OUR WILDLIFE + quote
 *  - Right panel: Quick Facts, Where It Lives, Explore/Learn/Protect
 *  - Bottom bar: SCROLL OR CLICK TO EXPLORE
 */
import { useRef } from "react";
import { motion } from "framer-motion";
import sceneBg  from "../assets/scene-bg.png";
import birdImg  from "../assets/bird-transparent.png";

// ─── Geometry ──────────────────────────────────────────────────────────────
const CZ = 130;   // circle diameter px
const R  = 258;   // ring radius px

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

      {/* ── BACKGROUND LAYER 1: dramatic scene, blue-shifted, blurred to hide baked text ── */}
      <img src={sceneBg} alt="" style={{
        position:"absolute", inset:0, width:"100%", height:"100%",
        objectFit:"cover", objectPosition:"30% center",
        filter:"blur(9px) brightness(0.33) saturate(1.85) hue-rotate(-18deg) contrast(1.1)",
      }}/>

      {/* ── BACKGROUND LAYER 2: sky gradient + horizon glow ── */}
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none",
        background:"linear-gradient(to bottom, rgba(2,6,32,0.72) 0%, rgba(4,12,42,0.38) 22%, transparent 48%, rgba(2,6,20,0.42) 88%, rgba(1,4,16,0.80) 100%)",
      }}/>
      {/* Cover the baked-text area on the left side */}
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none",
        background:"linear-gradient(to right, rgba(2,6,22,0.78) 0%, rgba(2,6,22,0.5) 10%, transparent 22%)",
      }}/>
      {/* Warm golden glow at horizon (behind bird — matches reference sunset) */}
      <div style={{
        position:"absolute", left:"50%", top:"58%",
        transform:"translate(-52%,-50%)",
        width:"560px", height:"360px",
        background:"radial-gradient(ellipse at center, rgba(255,150,30,0.26) 0%, rgba(255,100,10,0.10) 40%, transparent 72%)",
        pointerEvents:"none", zIndex:1,
      }}/>
      {/* Side vignette for panel contrast */}
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none",
        background:"linear-gradient(to right, transparent 12%, transparent 78%, rgba(2,6,20,0.35) 100%)",
      }}/>

      {/* ── BACKGROUND LAYER 3: bird overlay centered ── */}
      <img src={birdImg} alt="Hawaiian Coot" style={{
        position:"absolute",
        bottom:"4%", left:"50%",
        transform:"translateX(-52%)",
        height:"66%",
        objectFit:"contain",
        zIndex:1,
        filter:"brightness(1.08) contrast(1.12) drop-shadow(0 0 40px rgba(255,140,20,0.35))",
        pointerEvents:"none",
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
        {/* Hidden backdrop discs (r = CZ/2-2 = fully inside circle divs, provides dark base) */}
        {ITEMS.map((_,i)=>{
          const {x,y}=pos(i);
          return <circle key={`bg-${i}`} cx={x} cy={y} r={CZ/2-2} fill="rgba(3,6,24,0.96)"/>;
        })}

        {/* Main glowing dashed ring */}
        <circle r={R} fill="none" stroke="rgba(0,230,205,0.82)" strokeWidth="2.8" strokeDasharray="9 13"/>
        {/* Soft glow spread behind ring */}
        <circle r={R} fill="none" stroke="rgba(0,230,205,0.20)" strokeWidth="14" strokeDasharray="9 13"/>
        {/* Inner concentric rings */}
        <circle r={R-52} fill="none" stroke="rgba(0,210,185,0.22)" strokeWidth="1.5" strokeDasharray="4 10"/>
        <circle r={145}  fill="none" stroke="rgba(0,200,175,0.12)" strokeWidth="1"   strokeDasharray="3 9"/>

        {/* Sparkle node dots at each circle position */}
        {ITEMS.map((_,i)=>{
          const {x,y}=pos(i);
          return (
            <g key={`dot-${i}`}>
              <circle cx={x} cy={y} r="11"  fill="rgba(0,210,190,0.12)"/>
              <circle cx={x} cy={y} r="5.5" fill="rgba(0,225,205,0.70)"/>
              <circle cx={x} cy={y} r="2.5" fill="rgba(255,255,255,0.95)"/>
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
          background:"rgba(3,6,20,0.82)", backdropFilter:"blur(16px)",
          border:"1px solid rgba(255,255,255,0.1)", borderRadius:"10px",
          padding:"14px 16px",
        }}>
          <div style={{
            fontFamily:"'Josefin Sans',sans-serif", fontSize:"9px", fontWeight:700,
            letterSpacing:"0.26em", color:"rgba(212,175,55,0.8)",
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
          background:"rgba(3,6,20,0.82)", backdropFilter:"blur(16px)",
          border:"1px solid rgba(255,255,255,0.1)", borderRadius:"10px",
          padding:"14px 16px",
        }}>
          <div style={{
            fontFamily:"'Josefin Sans',sans-serif", fontSize:"9px", fontWeight:700,
            letterSpacing:"0.26em", color:"rgba(212,175,55,0.8)",
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
            <span style={{ color:"#22c55e", textShadow:"0 0 20px rgba(34,197,94,0.55)" }}>Explore.</span><br/>
            <span style={{ color:"#14b8a6", textShadow:"0 0 20px rgba(20,184,166,0.45)" }}>Learn.</span>{" "}
            <span style={{ fontSize:"0.68em" }}>🌿</span><br/>
            <span style={{ color:"#f97316", textShadow:"0 0 20px rgba(249,115,22,0.45)" }}>Protect.</span>
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

      {/* ── CENTER: floating species name (NO portrait frame) ─────────────────── */}
      <motion.div
        initial={{ opacity:0, y:12 }}
        animate={exiting
          ? { opacity:0, scale:0.9, transition:{ duration:0.3 } }
          : { opacity:1, y:0, transition:{ duration:0.9, delay:0.35, ease:[0.16,1,0.3,1] as const } }
        }
        style={{
          position:"absolute",
          left:0, right:0,
          top:"50%", transform:"translateY(-46%)",
          zIndex:5, textAlign:"center", pointerEvents:"none",
          whiteSpace:"nowrap",
        }}
      >
        {/* Main Hawaiian name — large bold, single line */}
        <div style={{
          fontFamily:"'Josefin Sans',sans-serif",
          fontSize:"clamp(22px,2.95vw,38px)", fontWeight:900,
          letterSpacing:"0.08em", color:"#fff",
          textTransform:"uppercase", lineHeight:1.0,
          textShadow:"0 2px 40px rgba(0,0,0,0.95), 0 0 80px rgba(0,0,0,0.85)",
        }}>
          {"\u02BBAlae Ke\u02BBoke\u02BBo"}
        </div>

        {/* HAWAIIAN COOT */}
        <div style={{
          fontFamily:"'Josefin Sans',sans-serif",
          fontSize:"clamp(10px,1.1vw,15px)", fontWeight:700,
          letterSpacing:"0.3em", color:"rgba(0,210,185,0.92)",
          textTransform:"uppercase", marginTop:"6px",
          textShadow:"0 1px 12px rgba(0,0,0,0.85)",
        }}>
          Hawaiian Coot
        </div>

        {/* — Fulica alai — with rules */}
        <div style={{
          display:"flex", alignItems:"center", justifyContent:"center",
          gap:"8px", marginTop:"6px",
        }}>
          <div style={{ flex:1, height:"1px", background:"rgba(212,175,55,0.45)" }}/>
          <div style={{
            fontFamily:"'Playfair Display',serif",
            fontSize:"clamp(10px,1.0vw,13px)",
            fontStyle:"italic", color:"rgba(255,255,255,0.55)",
            textShadow:"0 1px 8px rgba(0,0,0,0.85)",
          }}>Fulica alai</div>
          <div style={{ flex:1, height:"1px", background:"rgba(212,175,55,0.45)" }}/>
        </div>

        {/* ENDANGERED */}
        <div style={{
          fontFamily:"'Josefin Sans',sans-serif",
          fontSize:"clamp(10px,1.0vw,13px)", fontWeight:700,
          letterSpacing:"0.3em", color:"#f97316",
          textTransform:"uppercase", marginTop:"6px",
          textShadow:"0 0 16px rgba(249,115,22,0.8), 0 1px 8px rgba(0,0,0,0.85)",
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
            <div style={{
              width:"100%", height:"100%", borderRadius:"50%",
              background:`radial-gradient(circle at 38% 34%, ${item.color}52, ${item.color}24 48%, rgba(3,6,24,0.97))`,
              border:`3px solid ${item.color}`,
              boxShadow:[
                `0 0 0 2px ${item.color}55`,
                `0 0 20px ${item.color}ee`,
                `0 0 50px ${item.color}88`,
                `0 0 90px ${item.color}3a`,
                `inset 0 0 32px ${item.color}22`,
              ].join(","),
              display:"flex", flexDirection:"column",
              alignItems:"center", justifyContent:"center",
              textAlign:"center", padding:"7px 6px",
              gap:"1px",
            }}>
              {/* Number */}
              <div style={{
                fontFamily:"'Josefin Sans',sans-serif",
                fontSize:"7.5px", fontWeight:700, letterSpacing:"0.12em",
                color:item.color, lineHeight:1,
              }}>{item.num}</div>

              {/* Icon */}
              <div style={{ fontSize:"22px", lineHeight:"1.15", margin:"1px 0" }}>{item.icon}</div>

              {/* Title */}
              {item.title.split("\n").map((ln,j)=>(
                <div key={j} style={{
                  fontFamily:"'Josefin Sans',sans-serif",
                  fontSize:"7.5px", fontWeight:700, letterSpacing:"0.07em",
                  color:"#fff", textTransform:"uppercase", lineHeight:1.2,
                }}>{ln}</div>
              ))}

              {/* Separator */}
              <div style={{ width:"24px", height:"1px", background:`${item.color}66`, margin:"2px 0" }}/>

              {/* Description */}
              {item.desc.split("\n").map((ln,j)=>(
                <div key={j} style={{
                  fontFamily:"'Playfair Display',serif",
                  fontSize:"6.5px", fontStyle:"italic",
                  color:"rgba(255,255,255,0.62)", lineHeight:1.3,
                }}>{ln}</div>
              ))}
            </div>
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
          letterSpacing:"0.32em", color:"rgba(0,218,195,0.82)",
          textTransform:"uppercase",
          display:"flex", alignItems:"center", gap:"14px",
        }}>
          <span style={{ opacity:0.55, fontSize:"13px" }}>❮❮</span>
          Scroll or Click to Explore
          <span style={{ opacity:0.55, fontSize:"13px" }}>❯❯</span>
        </div>
        <div style={{ fontSize:"18px", color:"rgba(0,218,195,0.5)", lineHeight:1 }}>🖱</div>
      </motion.div>

    </div>
  );
}
