/**
 * RadialLanding — full-screen infographic radial menu.
 *
 * 10 glowing circles arranged in a ring around the Hawaiian Coot portrait.
 * Matches the reference image layout: title/quote left, facts/explore right,
 * ring of clickable circles in the centre.
 *
 * When `exiting` is true, all circles collapse toward the hamburger position
 * (top-centre of viewport) in a staggered vortex animation.
 */
import { useRef } from "react";
import { motion } from "framer-motion";
import heroBg from "@assets/image_1779593793890.png";
import portrait from "../assets/silhouette.png";

// ─── Geometry ──────────────────────────────────────────────────────────────
const CZ = 106;   // circle diameter
const R  = 270;   // ring radius

// ─── Data ───────────────────────────────────────────────────────────────────
const ITEMS = [
  { num:"01", key:"Meet the Species",         group:"the-species", icon:"🐦", color:"#22c55e",
    lines:["MEET THE","'ALAE KE'OKE'O"],    desc:"5 interesting facts\n& characteristics" },
  { num:"02", key:"Habitat & Location",       group:"habitat",     icon:"🗺", color:"#06b6d4",
    lines:["HABITAT &","WETLANDS"],           desc:"Where it lives\n& island map" },
  { num:"03", key:"Climate Stressors",        group:"climate",     icon:"🌧", color:"#0891b2",
    lines:["CLIMATE","STRESSORS"],            desc:"Sea level rise, storms,\ndrought & habitat loss" },
  { num:"04", key:"Human Impact",             group:"threats",     icon:"🏙", color:"#7c3aed",
    lines:["HUMAN","IMPACT"],                desc:"Threats from humans\n& invasive species" },
  { num:"05", key:"Conservation & Solutions", group:"survival",    icon:"🌱", color:"#f97316",
    lines:["CONSERVATION","& SOLUTIONS"],     desc:"Restoration, protection\n& how we can help" },
  { num:"06", key:"Food Web",                 group:"habitat",     icon:"🦋", color:"#14b8a6",
    lines:["FOOD WEB"],                       desc:"Energy flow in the\nwetland ecosystem" },
  { num:"07", key:"Adaptations",              group:"survival",    icon:"🌿", color:"#22c55e",
    lines:["ADAPTATIONS"],                    desc:"Floating nests, lobed\nfeet & wetland survival" },
  { num:"08", key:"Evolution",                group:"the-species", icon:"🧬", color:"#f97316",
    lines:["EVOLUTION &","CLASSIFICATION"],   desc:"Origins, relatives &\nscientific details" },
  { num:"09", key:"Extinction Risk",          group:"future",      icon:"🛡", color:"#7c3aed",
    lines:["EXTINCTION","RISK"],              desc:"Status, population\ntrends & future outlook" },
  { num:"10", key:"Sources & Citations",      group:"future",      icon:"📄", color:"#d4af37",
    lines:["SOURCES"],                        desc:"References\n& credits" },
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

  const sideFade = (dir: 1 | -1) => ({
    animate: exiting
      ? { opacity: 0, x: dir * 60, transition: { duration: 0.32 } }
      : { opacity: 1, x: 0, transition: { duration: 0.7, delay: 0.12 } },
    initial: { opacity: 0, x: dir * 40 },
  });

  return (
    <div style={{ position:"fixed", inset:0, zIndex:8000, overflow:"hidden" }}>

      {/* ── background ──────────────────────────────────────────────────────── */}
      <img src={heroBg} alt="" style={{
        position:"absolute", inset:0, width:"100%", height:"100%",
        objectFit:"cover", objectPosition:"center",
        filter:"brightness(0.72) saturate(1.25)",
      }}/>
      <div style={{
        position:"absolute", inset:0,
        background:"linear-gradient(135deg,rgba(3,6,16,0.86) 0%,rgba(3,6,16,0.28) 48%,rgba(3,6,16,0.78) 100%)",
      }}/>

      {/* ── decorative ring SVG ──────────────────────────────────────────────── */}
      <motion.svg
        animate={exiting ? { opacity:0, transition:{ duration:0.3 } } : { opacity:1 }}
        initial={{ opacity:0 }}
        transition={{ duration:0.8, delay:0.2 }}
        style={{
          position:"absolute", left:"50%", top:"50%",
          transform:"translate(-50%,-50%)",
          width:(R+CZ)*2, height:(R+CZ)*2,
          overflow:"visible", pointerEvents:"none", zIndex:1,
        }}
        viewBox={`${-(R+CZ/2+12)} ${-(R+CZ/2+12)} ${(R+CZ/2+12)*2} ${(R+CZ/2+12)*2}`}
      >
        {/* Outer soft glow band */}
        <circle r={R} fill="none" stroke="rgba(34,197,94,0.055)" strokeWidth={CZ+18}/>
        {/* Main dashed ring */}
        <circle r={R} fill="none" stroke="rgba(34,197,94,0.28)" strokeWidth="1.5" strokeDasharray="6 11"/>
        {/* Inner dashed ring */}
        <circle r={190} fill="none" stroke="rgba(34,197,94,0.1)" strokeWidth="1" strokeDasharray="3 8"/>
        {/* Node dots */}
        {ITEMS.map((_,i)=>{ const {x,y}=pos(i); return <circle key={i} cx={x} cy={y} r="5" fill="rgba(34,197,94,0.5)"/>; })}
      </motion.svg>

      {/* ── LEFT panel: title + quote ────────────────────────────────────── */}
      <motion.div {...sideFade(-1)} style={{
        position:"absolute", left:"22px", top:"12%",
        zIndex:5, maxWidth:`calc(50% - ${R+CZ/2+28}px)`,
        display:"flex", flexDirection:"column", gap:"18px",
      }}>
        <div>
          <div style={{
            fontFamily:"'Josefin Sans',sans-serif",
            fontSize:"clamp(20px,2.5vw,38px)", fontWeight:900,
            letterSpacing:"0.04em", textTransform:"uppercase",
            color:"#fff", lineHeight:1.08,
            textShadow:"0 2px 18px rgba(0,0,0,0.65)",
          }}>
            Save Our<br/>Wildlife 🌿
          </div>
          <div style={{
            fontFamily:"'Josefin Sans',sans-serif",
            fontSize:"clamp(8px,0.85vw,12px)", fontWeight:700,
            letterSpacing:"0.28em", color:"rgba(34,197,94,0.82)",
            textTransform:"uppercase", marginTop:"7px",
          }}>Every Species Matters</div>
        </div>

        <div style={{ borderLeft:"3px solid rgba(212,175,55,0.55)", paddingLeft:"14px" }}>
          <div style={{ fontSize:"clamp(12px,1.1vw,15px)", color:"rgba(34,197,94,0.7)", fontWeight:700, marginBottom:"6px" }}>❝</div>
          <div style={{
            fontFamily:"'Playfair Display',serif",
            fontSize:"clamp(11px,1.05vw,15px)", fontStyle:"italic",
            color:"rgba(255,255,255,0.78)", lineHeight:1.6,
          }}>
            We don't inherit<br/>the Earth from our<br/>ancestors. We borrow<br/>it from our children.
          </div>
        </div>
      </motion.div>

      {/* ── RIGHT panel: quick facts + where + explore ──────────────────── */}
      <motion.div {...sideFade(1)} style={{
        position:"absolute",
        left:`calc(50% + ${R+CZ/2+28}px)`,
        top:"9%", zIndex:5,
        maxWidth:`calc(50% - ${R+CZ/2+28}px - 22px)`,
        display:"flex", flexDirection:"column", gap:"14px",
      }}>
        {/* Quick Facts */}
        <div style={{
          background:"rgba(4,7,18,0.82)", backdropFilter:"blur(12px)",
          border:"1px solid rgba(34,197,94,0.22)", borderRadius:"10px",
          padding:"13px 17px",
        }}>
          <div style={{
            fontFamily:"'Josefin Sans',sans-serif", fontSize:"9.5px", fontWeight:700,
            letterSpacing:"0.22em", color:"rgba(212,175,55,0.72)",
            textTransform:"uppercase", marginBottom:"9px",
          }}>Quick Facts</div>
          {[
            { icon:"🔴", label:"Status",     val:"Endangered" },
            { icon:"🐦", label:"Population", val:"~2,500–3,500" },
            { icon:"🏝", label:"Habitat",    val:"Hawaiian Wetlands" },
            { icon:"⏱", label:"Lifespan",   val:"10–15 years" },
          ].map(f=>(
            <div key={f.label} style={{ display:"flex", alignItems:"center", gap:"7px", marginBottom:"5px" }}>
              <span style={{ fontSize:"11px" }}>{f.icon}</span>
              <span style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:"9px",
                color:"rgba(255,255,255,0.48)", letterSpacing:"0.07em", textTransform:"uppercase" }}>{f.label}:</span>
              <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"11px",
                color:"rgba(255,255,255,0.88)" }}>{f.val}</span>
            </div>
          ))}
        </div>

        {/* Where it lives */}
        <div style={{
          background:"rgba(4,7,18,0.82)", backdropFilter:"blur(12px)",
          border:"1px solid rgba(34,197,94,0.22)", borderRadius:"10px",
          padding:"13px 17px",
        }}>
          <div style={{
            fontFamily:"'Josefin Sans',sans-serif", fontSize:"9.5px", fontWeight:700,
            letterSpacing:"0.22em", color:"rgba(212,175,55,0.72)",
            textTransform:"uppercase", marginBottom:"8px",
          }}>Where It Lives</div>
          <div style={{
            fontFamily:"'Playfair Display',serif", fontSize:"11.5px",
            color:"rgba(255,255,255,0.76)", lineHeight:1.65,
          }}>
            Found only in the Hawaiian Islands.<br/>
            Native to freshwater wetlands<br/>across the islands.
          </div>
        </div>

        {/* Explore CTA */}
        <div style={{ paddingLeft:"4px" }}>
          <div style={{
            fontFamily:"'Playfair Display',serif",
            fontSize:"clamp(17px,1.7vw,26px)", fontWeight:700, lineHeight:1.38,
            textShadow:"0 0 22px rgba(34,197,94,0.4)",
          }}>
            <span style={{ color:"#22c55e" }}>Explore.</span><br/>
            <span style={{ color:"#14b8a6" }}>Learn.</span>{" "}🌿<br/>
            <span style={{ color:"#f97316" }}>Protect.</span>
          </div>
          <div style={{
            fontFamily:"'Josefin Sans',sans-serif", fontSize:"10.5px",
            color:"rgba(255,255,255,0.5)", letterSpacing:"0.05em",
            marginTop:"8px", lineHeight:1.55,
          }}>
            Click any section to explore<br/>the world of the 'Alae ke'oke'o.
            <span style={{ color:"rgba(249,115,22,0.8)", marginLeft:"4px" }}>→</span>
          </div>
        </div>
      </motion.div>

      {/* ── center: bird portrait ────────────────────────────────────────── */}
      <motion.div
        animate={exiting
          ? { scale:0.55, opacity:0, transition:{ duration:0.4, delay:0.05 } }
          : { scale:1, opacity:1, transition:{ duration:0.85, delay:0.32, ease:[0.16,1,0.3,1] } }
        }
        initial={{ scale:0.78, opacity:0 }}
        style={{
          position:"absolute", left:"50%", top:"50%",
          transform:"translate(-50%,-50%)",
          zIndex:3, textAlign:"center", pointerEvents:"none",
        }}
      >
        <img
          src={portrait}
          alt="Hawaiian Coot"
          style={{
            width:"176px", height:"176px",
            objectFit:"cover", objectPosition:"center top",
            borderRadius:"50%",
            border:"3px solid rgba(34,197,94,0.42)",
            boxShadow:"0 0 0 9px rgba(3,6,16,0.62), 0 0 42px rgba(34,197,94,0.38), 0 0 80px rgba(34,197,94,0.14)",
          }}
        />
        <div style={{
          fontFamily:"'Josefin Sans',sans-serif", fontSize:"17px", fontWeight:900,
          letterSpacing:"0.13em", color:"#fff", textTransform:"uppercase",
          textShadow:"0 2px 14px rgba(0,0,0,0.8)", marginTop:"11px",
        }}>
          'Alae Ke'oke'o
        </div>
        <div style={{
          fontFamily:"'Josefin Sans',sans-serif", fontSize:"9.5px", fontWeight:700,
          letterSpacing:"0.22em", color:"rgba(212,175,55,0.85)",
          textTransform:"uppercase", marginTop:"3px",
        }}>Hawaiian Coot</div>
        <div style={{
          fontFamily:"'Playfair Display',serif", fontSize:"10.5px",
          fontStyle:"italic", color:"rgba(255,255,255,0.5)", marginTop:"2px",
        }}>Fulica alai</div>
        <div style={{
          fontFamily:"'Josefin Sans',sans-serif", fontSize:"8.5px", fontWeight:700,
          letterSpacing:"0.25em", color:"#f97316",
          textTransform:"uppercase", marginTop:"4px",
          textShadow:"0 0 8px rgba(249,115,22,0.6)",
        }}>Endangered</div>
      </motion.div>

      {/* ── 10 radial circles ───────────────────────────────────────────────── */}
      {ITEMS.map((item, i) => {
        const { x, y } = pos(i);
        const HALF = CZ / 2;
        // target: (vw/2, 50px) — hamburger centre in viewport
        const targetX = -x;
        const targetY = 50 - vh / 2 - y;

        return (
          <motion.div
            key={item.key}
            initial={{ scale:0, opacity:0 }}
            animate={exiting
              ? { x:targetX, y:targetY, scale:0, opacity:0,
                  transition:{ duration:0.52, delay:i*0.028, ease:[0.4,0,0.8,1] } }
              : { x:0, y:0, scale:1, opacity:1,
                  transition:{ duration:0.66, delay:0.18+i*0.058, ease:[0.16,1,0.3,1] } }
            }
            whileHover={!exiting ? { scale:1.13, transition:{ duration:0.18 } } : {}}
            style={{
              position:"absolute",
              left:`calc(50% + ${x - HALF}px)`,
              top:`calc(50% + ${y - HALF}px)`,
              width:`${CZ}px`, height:`${CZ}px`,
              cursor:"pointer", zIndex:4,
            }}
            onClick={() => !exiting && onSelect(item.key, item.group)}
          >
            <div style={{
              width:"100%", height:"100%", borderRadius:"50%",
              background:`radial-gradient(circle at 38% 35%,${item.color}2a,${item.color}0a 72%)`,
              border:`2.5px solid ${item.color}`,
              boxShadow:`0 0 14px ${item.color}99,0 0 32px ${item.color}33,inset 0 0 18px ${item.color}11`,
              display:"flex", flexDirection:"column",
              alignItems:"center", justifyContent:"center",
              textAlign:"center", padding:"6px 4px",
            }}>
              <div style={{
                fontFamily:"'Josefin Sans',sans-serif",
                fontSize:"7.5px", fontWeight:700, letterSpacing:"0.1em",
                color:item.color, opacity:0.85, marginBottom:"0px",
              }}>{item.num}</div>
              <div style={{ fontSize:"21px", lineHeight:"1", marginBottom:"2px" }}>{item.icon}</div>
              {item.lines.map((ln,j)=>(
                <div key={j} style={{
                  fontFamily:"'Josefin Sans',sans-serif",
                  fontSize:"7px", fontWeight:700, letterSpacing:"0.07em",
                  color:"#fff", textTransform:"uppercase", lineHeight:1.22,
                }}>{ln}</div>
              ))}
            </div>
          </motion.div>
        );
      })}

      {/* ── bottom CTA ──────────────────────────────────────────────────────── */}
      <motion.div
        animate={exiting
          ? { opacity:0, y:20, transition:{ duration:0.25 } }
          : { opacity:1, y:0, transition:{ duration:0.7, delay:0.85 } }
        }
        initial={{ opacity:0, y:18 }}
        style={{
          position:"absolute", bottom:"22px", left:"50%",
          transform:"translateX(-50%)", zIndex:5, textAlign:"center",
          pointerEvents:"none",
        }}
      >
        <div style={{
          fontFamily:"'Josefin Sans',sans-serif", fontSize:"11px", fontWeight:700,
          letterSpacing:"0.28em", color:"rgba(34,197,94,0.7)",
          textTransform:"uppercase",
          display:"flex", alignItems:"center", gap:"10px",
        }}>
          <span style={{ opacity:0.45 }}>《</span>
          Scroll or Click to Explore
          <span style={{ opacity:0.45 }}>》</span>
        </div>
      </motion.div>

    </div>
  );
}
