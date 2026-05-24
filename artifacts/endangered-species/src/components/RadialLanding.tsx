/**
 * RadialLanding — full-screen infographic radial menu.
 * Matches the reference image exactly:
 *  - 10 glowing circles arranged radially around the bird (which lives in the BG)
 *  - No portrait frame — center is floating text only
 *  - Cyan/teal dashed ring with sparkle nodes
 *  - Left panel: SAVE OUR WILDLIFE + snowflake + quote
 *  - Right panel: Quick Facts (shield/people/hourglass icons), Where It Lives, Explore/Learn/Protect
 */
import { useRef } from "react";
import { motion } from "framer-motion";
import heroBg from "../assets/hero-bg.png";

// ─── Geometry ──────────────────────────────────────────────────────────────
const CZ = 128;   // circle diameter (larger → fits title + description)
const R  = 262;   // ring radius

// ─── Data ───────────────────────────────────────────────────────────────────
// Each item: exact labels from reference image
const ITEMS = [
  { num:"01", key:"Meet the Species",         group:"the-species",
    icon:"🐦", color:"#22c55e",
    title:"MEET\n\u2018ALAE KE\u02BCOKE\u02BCO",
    desc:"5 interesting facts\n& characteristics" },
  { num:"02", key:"Habitat & Location",       group:"habitat",
    icon:"🏝", color:"#06b6d4",
    title:"HABITAT &\nWETLANDS",
    desc:"Where it lives\n& island map" },
  { num:"03", key:"Climate Stressors",        group:"climate",
    icon:"⛈", color:"#0891b2",
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

  // ── shared animation helpers ────────────────────────────────────────────
  const panelAnim = (dir: 1 | -1, delay = 0.1) => ({
    initial: { opacity: 0, x: dir * 50 },
    animate: exiting
      ? { opacity: 0, x: dir * 70, transition: { duration: 0.28 } }
      : { opacity: 1, x: 0,        transition: { duration: 0.65, delay, ease: [0.16,1,0.3,1] as const } },
  });

  return (
    <div style={{ position:"fixed", inset:0, zIndex:8000, overflow:"hidden" }}>

      {/* ── BACKGROUND ──────────────────────────────────────────────────────── */}
      {/*
        The hero image has text baked in (from previous hero overlay). We apply
        blur(2.5px) so the baked text is illegible while the bird+landscape
        silhouette still reads clearly. Brightness is reduced to match the dark,
        cinematic tone of the reference image.
      */}
      <img src={heroBg} alt="" style={{
        position:"absolute", inset:0, width:"100%", height:"100%",
        objectFit:"cover", objectPosition:"center 58%",
        filter:"brightness(0.52) saturate(1.5) hue-rotate(-15deg) contrast(1.15)",
      }}/>
      {/* Corner vignette — dark corners only, ring area stays open */}
      <div style={{
        position:"absolute", inset:0,
        background:"radial-gradient(ellipse 94% 100% at 50% 50%, transparent 0%, transparent 58%, rgba(2,5,14,0.55) 78%, rgba(2,5,14,0.92) 100%)",
      }}/>
      {/* Top strip for title contrast */}
      <div style={{
        position:"absolute", inset:0,
        background:"linear-gradient(to bottom, rgba(2,5,14,0.65) 0%, transparent 11%, transparent 80%, rgba(2,5,14,0.75) 100%)",
      }}/>
      {/* Gentle side darkening for panels */}
      <div style={{
        position:"absolute", inset:0,
        background:"linear-gradient(to right, rgba(2,5,14,0.28) 0%, transparent 12%, transparent 84%, rgba(2,5,14,0.28) 100%)",
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
        {/*
          Dark backdrop discs behind each circle — ensures all 10 circles
          are visible regardless of what the background image shows.
          These render at zIndex:2 (SVG layer), behind the circle divs at zIndex:4.
        */}
        {ITEMS.map((_,i)=>{
          const {x,y}=pos(i);
          return <circle key={`bg-${i}`} cx={x} cy={y} r={CZ/2+8} fill="rgba(2,5,22,0.88)"/>;
        })}
        {/* Main glowing dashed ring — cyan/teal, more visible */}
        <circle r={R} fill="none" stroke="rgba(0,230,205,0.80)" strokeWidth="3" strokeDasharray="9 13"/>
        <circle r={R} fill="none" stroke="rgba(0,230,205,0.22)" strokeWidth="12" strokeDasharray="9 13"/>
        {/* Inner concentric rings */}
        <circle r={R-55} fill="none" stroke="rgba(0,210,185,0.25)" strokeWidth="1.5" strokeDasharray="4 10"/>
        <circle r={148}  fill="none" stroke="rgba(0,200,175,0.14)" strokeWidth="1" strokeDasharray="3 9"/>
        {/* Sparkle node dots */}
        {ITEMS.map((_,i)=>{
          const {x,y}=pos(i);
          return (
            <g key={`dot-${i}`}>
              <circle cx={x} cy={y} r="10"  fill="rgba(0,210,190,0.14)"/>
              <circle cx={x} cy={y} r="5"   fill="rgba(0,220,200,0.72)"/>
              <circle cx={x} cy={y} r="2.5" fill="rgba(255,255,255,0.95)"/>
            </g>
          );
        })}
      </motion.svg>

      {/* ── LEFT PANEL: title + quote ────────────────────────────────────────── */}
      <motion.div {...panelAnim(-1, 0.1)} style={{
        position:"absolute", left:"18px", top:"11%",
        zIndex:6, width:`calc(50% - ${R + CZ/2 + 20}px)`,
        display:"flex", flexDirection:"column", gap:"16px",
      }}>
        {/* Title */}
        <div>
          <div style={{
            fontFamily:"'Josefin Sans',sans-serif",
            fontSize:"clamp(22px,2.6vw,40px)", fontWeight:900,
            letterSpacing:"0.03em", textTransform:"uppercase",
            color:"#fff", lineHeight:1.05,
            textShadow:"0 2px 20px rgba(0,0,0,0.7)",
          }}>
            Save Our<br/>Wildlife&nbsp;🌿
          </div>
          <div style={{
            fontFamily:"'Josefin Sans',sans-serif",
            fontSize:"clamp(7.5px,0.78vw,11px)", fontWeight:700,
            letterSpacing:"0.32em", color:"rgba(34,197,94,0.85)",
            textTransform:"uppercase", marginTop:"6px",
          }}>Every Species Matters</div>
          {/* Decorative snowflake + separator */}
          <div style={{ display:"flex", alignItems:"center", gap:"8px", marginTop:"10px" }}>
            <span style={{ fontSize:"13px", color:"rgba(34,197,94,0.55)" }}>✦</span>
            <div style={{ flex:1, height:"1px", background:"linear-gradient(to right,rgba(34,197,94,0.5),transparent)" }}/>
          </div>
        </div>

        {/* Quote */}
        <div style={{ paddingLeft:"2px" }}>
          <div style={{
            fontFamily:"'Playfair Display',serif", fontSize:"clamp(22px,2.2vw,32px)",
            color:"rgba(34,197,94,0.7)", lineHeight:1, marginBottom:"8px",
          }}>❝</div>
          <div style={{
            fontFamily:"'Playfair Display',serif",
            fontSize:"clamp(11px,1.0vw,15px)", fontStyle:"italic",
            color:"rgba(255,255,255,0.78)", lineHeight:1.65,
          }}>
            We don't inherit<br/>the Earth from our<br/>ancestors. We borrow<br/>it from our children.
          </div>
          <div style={{ width:"28px", height:"2px", background:"rgba(34,197,94,0.5)", marginTop:"10px" }}/>
        </div>
      </motion.div>

      {/* ── RIGHT PANEL ─────────────────────────────────────────────────────── */}
      <motion.div {...panelAnim(1, 0.14)} style={{
        position:"absolute",
        left:`calc(50% + ${R + CZ/2 + 20}px)`,
        top:"8%", zIndex:6,
        width:`calc(50% - ${R + CZ/2 + 20}px - 18px)`,
        display:"flex", flexDirection:"column", gap:"12px",
      }}>

        {/* Quick Facts */}
        <div style={{
          background:"rgba(3,6,18,0.84)", backdropFilter:"blur(14px)",
          border:"1px solid rgba(255,255,255,0.1)", borderRadius:"10px",
          padding:"13px 15px",
        }}>
          <div style={{
            fontFamily:"'Josefin Sans',sans-serif", fontSize:"9px", fontWeight:700,
            letterSpacing:"0.25em", color:"rgba(212,175,55,0.75)",
            textTransform:"uppercase", marginBottom:"10px",
          }}>Quick Facts</div>
          {[
            { icon:"🛡", iconColor:"#f97316", label:"Status",     val:"Endangered" },
            { icon:"👥", iconColor:"#06b6d4", label:"Population", val:"~2,500\u20133,500" },
            { icon:"🏔", iconColor:"#22c55e", label:"Habitat",    val:"Hawaiian Wetlands" },
            { icon:"⌛", iconColor:"#d4af37", label:"Lifespan",   val:"10\u201315 years" },
          ].map(f=>(
            <div key={f.label} style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"6px" }}>
              <span style={{ fontSize:"12px", filter:`drop-shadow(0 0 4px ${f.iconColor}88)` }}>{f.icon}</span>
              <span style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:"8.5px",
                color:"rgba(255,255,255,0.45)", letterSpacing:"0.07em", textTransform:"uppercase",
                minWidth:"60px" }}>{f.label}:</span>
              <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"11px",
                color:"rgba(255,255,255,0.9)" }}>{f.val}</span>
            </div>
          ))}
        </div>

        {/* Where It Lives */}
        <div style={{
          background:"rgba(3,6,18,0.84)", backdropFilter:"blur(14px)",
          border:"1px solid rgba(255,255,255,0.1)", borderRadius:"10px",
          padding:"13px 15px",
        }}>
          <div style={{
            fontFamily:"'Josefin Sans',sans-serif", fontSize:"9px", fontWeight:700,
            letterSpacing:"0.25em", color:"rgba(212,175,55,0.75)",
            textTransform:"uppercase", marginBottom:"8px",
          }}>Where It Lives</div>
          {/* Mini world map decoration */}
          <div style={{ fontSize:"22px", marginBottom:"6px", opacity:0.6 }}>🗺️</div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"11.5px",
            color:"rgba(255,255,255,0.75)", lineHeight:1.65 }}>
            Found only in the Hawaiian Islands<br/>
            Native to freshwater wetlands<br/>across the islands.
          </div>
        </div>

        {/* Explore / CTA */}
        <div>
          <div style={{
            fontFamily:"'Playfair Display',serif",
            fontSize:"clamp(18px,1.8vw,27px)", fontWeight:700, lineHeight:1.35,
          }}>
            <span style={{ color:"#22c55e", textShadow:"0 0 18px rgba(34,197,94,0.5)" }}>Explore.</span><br/>
            <span style={{ color:"#14b8a6", textShadow:"0 0 18px rgba(20,184,166,0.4)" }}>Learn.</span>{" "}
            <span style={{ fontSize:"0.7em" }}>🌿</span><br/>
            <span style={{ color:"#f97316", textShadow:"0 0 18px rgba(249,115,22,0.4)" }}>Protect.</span>
          </div>
          <div style={{
            fontFamily:"'Josefin Sans',sans-serif", fontSize:"10px",
            color:"rgba(255,255,255,0.48)", letterSpacing:"0.04em",
            marginTop:"8px", lineHeight:1.6,
          }}>
            Click any section to explore<br/>the world of the 'Alae ke'oke'o.
          </div>
          <div style={{ color:"rgba(249,115,22,0.7)", fontSize:"13px", marginTop:"6px" }}>→</div>
        </div>
      </motion.div>

      {/* ── CENTER: floating text over background bird (NO portrait frame) ────── */}
      <motion.div
        initial={{ opacity:0, y:10 }}
        animate={exiting
          ? { opacity:0, scale:0.92, transition:{ duration:0.3 } }
          : { opacity:1, y:0, transition:{ duration:0.9, delay:0.35, ease:[0.16,1,0.3,1] as const } }
        }
        style={{
          position:"absolute", left:"50%",
          top:"50%", transform:"translate(-50%,-50%)",
          zIndex:3, textAlign:"center", pointerEvents:"none",
          width:"260px",
        }}
      >
        <div style={{
          fontFamily:"'Josefin Sans',sans-serif",
          fontSize:"clamp(22px,2.8vw,38px)", fontWeight:900,
          letterSpacing:"0.1em", color:"#fff",
          textTransform:"uppercase", lineHeight:1.05,
          textShadow:"0 2px 30px rgba(0,0,0,0.9), 0 0 60px rgba(0,0,0,0.8)",
        }}>
          'Alae Ke'oke'o
        </div>
        <div style={{
          fontFamily:"'Josefin Sans',sans-serif",
          fontSize:"clamp(9px,0.95vw,13px)", fontWeight:700,
          letterSpacing:"0.26em", color:"rgba(212,175,55,0.9)",
          textTransform:"uppercase", marginTop:"5px",
          textShadow:"0 1px 10px rgba(0,0,0,0.8)",
        }}>
          Hawaiian Coot
        </div>
        <div style={{
          display:"flex", alignItems:"center", justifyContent:"center",
          gap:"6px", marginTop:"5px",
        }}>
          <div style={{ flex:1, height:"1px", background:"rgba(212,175,55,0.4)" }}/>
          <div style={{
            fontFamily:"'Playfair Display',serif", fontSize:"clamp(9px,0.9vw,12px)",
            fontStyle:"italic", color:"rgba(255,255,255,0.5)",
            textShadow:"0 1px 8px rgba(0,0,0,0.8)",
          }}>Fulica alai</div>
          <div style={{ flex:1, height:"1px", background:"rgba(212,175,55,0.4)" }}/>
        </div>
        <div style={{
          fontFamily:"'Josefin Sans',sans-serif",
          fontSize:"clamp(8px,0.8vw,11px)", fontWeight:700,
          letterSpacing:"0.28em", color:"#f97316",
          textTransform:"uppercase", marginTop:"5px",
          textShadow:"0 0 12px rgba(249,115,22,0.7), 0 1px 6px rgba(0,0,0,0.8)",
        }}>
          Endangered
        </div>
      </motion.div>

      {/* ── 10 RADIAL CIRCLES ───────────────────────────────────────────────── */}
      {ITEMS.map((item, i) => {
        const { x, y } = pos(i);
        const HALF = CZ / 2;
        // Fly all circles to hamburger centre at (vw/2, 50px) in viewport
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
            {/* Circle shell — solid dark background so circles stand out on ANY bg */}
            <div style={{
              width:"100%", height:"100%", borderRadius:"50%",
              background:`radial-gradient(circle at 38% 34%, ${item.color}55, ${item.color}28 45%, rgba(3,6,24,0.97))`,
              border:`3px solid ${item.color}`,
              boxShadow:[
                `0 0 0 2px ${item.color}66`,
                `0 0 22px ${item.color}ff`,
                `0 0 55px ${item.color}99`,
                `0 0 100px ${item.color}44`,
                `inset 0 0 36px ${item.color}28`,
              ].join(","),
              display:"flex", flexDirection:"column",
              alignItems:"center", justifyContent:"center",
              textAlign:"center", padding:"7px 5px",
              gap:"1px",
            }}>
              {/* Number */}
              <div style={{
                fontFamily:"'Josefin Sans',sans-serif",
                fontSize:"7.5px", fontWeight:700, letterSpacing:"0.12em",
                color:item.color, lineHeight:1,
              }}>{item.num}</div>

              {/* Icon */}
              <div style={{ fontSize:"22px", lineHeight:"1.1", margin:"1px 0" }}>{item.icon}</div>

              {/* Title — bold caps */}
              {item.title.split("\n").map((ln,j)=>(
                <div key={j} style={{
                  fontFamily:"'Josefin Sans',sans-serif",
                  fontSize:"7.5px", fontWeight:700, letterSpacing:"0.07em",
                  color:"#fff", textTransform:"uppercase", lineHeight:1.2,
                }}>{ln}</div>
              ))}

              {/* Separator */}
              <div style={{ width:"24px", height:"1px", background:`${item.color}66`, margin:"2px 0" }}/>

              {/* Description — small italic */}
              {item.desc.split("\n").map((ln,j)=>(
                <div key={j} style={{
                  fontFamily:"'Playfair Display',serif",
                  fontSize:"6.5px", fontStyle:"italic",
                  color:"rgba(255,255,255,0.6)", lineHeight:1.3,
                }}>{ln}</div>
              ))}
            </div>
          </motion.div>
        );
      })}

      {/* ── BOTTOM CTA ──────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity:0, y:16 }}
        animate={exiting
          ? { opacity:0, y:16, transition:{ duration:0.22 } }
          : { opacity:1, y:0,  transition:{ duration:0.7, delay:0.9 } }
        }
        style={{
          position:"absolute", bottom:"18px", left:"50%",
          transform:"translateX(-50%)", zIndex:6, textAlign:"center",
          pointerEvents:"none", userSelect:"none",
        }}
      >
        <div style={{
          fontFamily:"'Josefin Sans',sans-serif", fontSize:"10.5px", fontWeight:700,
          letterSpacing:"0.3em", color:"rgba(0,210,185,0.75)",
          textTransform:"uppercase",
          display:"flex", alignItems:"center", gap:"12px",
        }}>
          <span style={{ opacity:0.5, fontSize:"14px" }}>❮❮</span>
          Scroll or Click to Explore
          <span style={{ opacity:0.5, fontSize:"14px" }}>❯❯</span>
        </div>
        <div style={{ fontSize:"16px", marginTop:"5px", color:"rgba(0,210,185,0.55)" }}>⬇</div>
      </motion.div>

    </div>
  );
}
