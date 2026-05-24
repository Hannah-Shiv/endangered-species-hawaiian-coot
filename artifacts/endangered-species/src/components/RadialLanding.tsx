/**
 * RadialLanding — matches reference image_1779602064562.png exactly:
 *  - Real Hawaiian wetland + bird background photo (bg-photo.png)
 *  - 10 glowing circles arranged radially, NO portrait frame
 *  - Cyan dashed inner ring + colored outer glow dots per circle
 *  - Left panel: SAVE OUR WILDLIFE + quote
 *  - Right panel: Quick Facts, Where It Lives, Explore/Learn/Protect
 *  - Bottom bar: SCROLL OR CLICK TO EXPLORE
 */
import { useRef, useState, useEffect } from "react";
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
const CZ = 192;   // circle diameter px
const R  = 330;   // ring radius px — gap = 2×330×sin18°−192 ≈ 12px ✓

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

// ─── Mobile layout — scrollable 2-col grid ───────────────────────────────────
function MobileRadialLanding({ onSelect, exiting }: Props) {
  return (
    <div style={{ position:"fixed", inset:0, zIndex:8000, background:"#030810", overflowY:"auto" }}>

      {/* Ambient glows */}
      <div style={{
        position:"fixed", inset:0, pointerEvents:"none", zIndex:0,
        background:[
          "radial-gradient(ellipse 60% 40% at 15% 10%, rgba(0,180,140,0.10) 0%, transparent 70%)",
          "radial-gradient(ellipse 60% 40% at 85% 10%, rgba(34,100,180,0.09) 0%, transparent 70%)",
          "radial-gradient(ellipse 50% 35% at 15% 90%, rgba(60,20,120,0.09) 0%, transparent 70%)",
          "radial-gradient(ellipse 50% 35% at 85% 90%, rgba(20,80,60,0.08) 0%, transparent 70%)",
        ].join(","),
      }}/>

      {/* Header — bird photo + species name */}
      <div style={{ textAlign:"center", padding:"32px 20px 18px", position:"relative", zIndex:2 }}>
        <div style={{
          width:118, height:118, borderRadius:"50%", overflow:"hidden",
          margin:"0 auto 14px",
          boxShadow:"0 0 0 2px rgba(0,238,212,0.65), 0 0 28px rgba(0,238,212,0.22)",
        }}>
          <img src={bgPhoto} alt="Hawaiian Coot"
            style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"50% 42%" }}/>
        </div>
        <div style={{
          fontFamily:"'Josefin Sans',sans-serif", fontSize:22, fontWeight:900,
          letterSpacing:"0.06em", color:"#fff", textTransform:"uppercase",
          textShadow:"0 2px 24px rgba(0,0,0,0.90)",
        }}>{"\u02BBAlae Ke\u02BBoke\u02BBo"}</div>
        <div style={{
          fontFamily:"'Josefin Sans',sans-serif", fontSize:11, fontWeight:700,
          letterSpacing:"0.28em", color:"rgba(0,218,195,0.90)",
          textTransform:"uppercase", marginTop:5,
        }}>Hawaiian Coot</div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, marginTop:7 }}>
          <div style={{ width:36, height:1, background:"rgba(212,175,55,0.50)" }}/>
          <div style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontSize:11, color:"rgba(255,255,255,0.60)" }}>
            Fulica alai
          </div>
          <div style={{ width:36, height:1, background:"rgba(212,175,55,0.50)" }}/>
        </div>
        <div style={{
          fontFamily:"'Josefin Sans',sans-serif", fontSize:10, fontWeight:700,
          letterSpacing:"0.26em", color:"#f97316", textTransform:"uppercase", marginTop:7,
          textShadow:"0 0 14px rgba(249,115,22,0.80)",
        }}>⚠ Endangered</div>
      </div>

      {/* Topic grid */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, padding:"0 14px 24px", position:"relative", zIndex:2 }}>
        {ITEMS.map((item) => (
          <motion.div
            key={item.key}
            whileTap={{ scale:0.95 }}
            onClick={() => !exiting && onSelect(item.key, item.group)}
            style={{
              background:"rgba(2,8,20,0.88)",
              border:`1px solid ${item.color}40`,
              borderRadius:10, padding:"14px 12px",
              cursor:"pointer", position:"relative", overflow:"hidden",
              WebkitTapHighlightColor:"transparent",
            }}
          >
            <div style={{
              position:"absolute", top:0, left:0, right:0, height:2,
              background:`linear-gradient(to right, ${item.color}99, ${item.color}22)`,
            }}/>
            <div style={{ fontSize:24, marginBottom:6, filter:`drop-shadow(0 0 5px ${item.color}88)` }}>{item.icon}</div>
            <div style={{
              fontFamily:"'Josefin Sans',sans-serif", fontSize:8, fontWeight:700,
              letterSpacing:"0.22em", color:item.color, marginBottom:3,
            }}>{item.num}</div>
            <div style={{
              fontFamily:"'Josefin Sans',sans-serif", fontSize:11, fontWeight:700,
              letterSpacing:"0.04em", color:"#fff", lineHeight:1.3, whiteSpace:"pre-line",
            }}>{item.title}</div>
            <div style={{
              fontFamily:"'Playfair Display',serif", fontStyle:"italic",
              fontSize:9, color:"rgba(255,255,255,0.52)", marginTop:5, lineHeight:1.5,
            }}>{item.desc.replace('\n',' ')}</div>
          </motion.div>
        ))}
      </div>

      <div style={{
        textAlign:"center", padding:"4px 20px 36px",
        fontFamily:"'Josefin Sans',sans-serif", fontSize:9, fontWeight:700,
        letterSpacing:"0.28em", color:"rgba(0,218,195,0.55)", textTransform:"uppercase",
        position:"relative", zIndex:2,
      }}>Tap any card to explore</div>
    </div>
  );
}

export function RadialLanding({ onSelect, exiting }: Props) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const vh = useRef(window.innerHeight).current;

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  if (isMobile) return <MobileRadialLanding onSelect={onSelect} exiting={exiting}/>;

  const panelAnim = (dir: 1 | -1, delay = 0.1) => ({
    initial: { opacity: 0, x: dir * 50 },
    animate: exiting
      ? { opacity: 0, x: dir * 70, transition: { duration: 0.28 } }
      : { opacity: 1, x: 0,        transition: { duration: 0.65, delay, ease: [0.16,1,0.3,1] as const } },
  });

  return (
    <div style={{ position:"fixed", inset:0, zIndex:8000, overflow:"hidden" }}>

      {/* ── SOLID DARK BACKGROUND ── */}
      <div style={{ position:"absolute", inset:0, background:"#030810" }}/>

      {/* ── AMBIENT CORNER GLOWS ── */}
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none",
        background:[
          "radial-gradient(ellipse 38% 32% at 5% 8%,  rgba(0,180,140,0.11) 0%, transparent 70%)",
          "radial-gradient(ellipse 38% 32% at 95% 8%,  rgba(34,100,180,0.10) 0%, transparent 70%)",
          "radial-gradient(ellipse 34% 28% at 5% 92%, rgba(60,20,120,0.10) 0%, transparent 70%)",
          "radial-gradient(ellipse 34% 28% at 95% 92%, rgba(20,80,60,0.09) 0%, transparent 70%)",
        ].join(","),
      }}/>

      {/* ── STAR FIELD — scattered sparkles in the dark corners ── */}
      <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none", zIndex:0 }}
           viewBox="0 0 1280 720" preserveAspectRatio="xMidYMid slice">
        {([
          [52,32,1.2,1],[138,58,0.8,0.7],[215,90,1.5,1],[75,142,1.0,0.8],[168,38,0.9,0.6],
          [295,78,1.3,1],[356,146,0.7,0.5],[246,168,1.0,0.75],[92,190,1.4,1],[324,52,0.9,0.65],
          [28,270,1.1,0.8],[48,354,0.8,0.6],[175,310,0.7,0.5],[62,460,1.2,0.9],[88,532,0.8,0.6],
          [52,618,1.0,0.75],[128,688,1.3,1],[198,650,0.9,0.7],[320,706,0.8,0.55],
          [958,42,1.2,1],[1035,70,0.9,0.7],[1110,36,1.5,1],[1184,94,0.8,0.6],[970,150,1.3,0.9],
          [1058,126,0.9,0.65],[1148,56,1.1,0.8],[1222,140,0.7,0.5],[1078,170,1.4,1],
          [1228,44,0.9,0.7],[1248,255,1.0,0.8],[1238,336,0.8,0.6],[1188,450,1.1,0.8],
          [1225,534,0.8,0.6],[1144,614,1.4,1],[1200,684,1.0,0.75],[958,690,1.1,0.8],
          [420,24,0.8,0.55],[860,18,0.9,0.6],[540,708,0.7,0.5],[740,712,0.8,0.55],
        ] as [number,number,number,number][]).map(([x,y,r,o],i)=>(
          <g key={i} opacity={o}>
            <circle cx={x} cy={y} r={r*2.5} fill="white" opacity={0.12}/>
            <circle cx={x} cy={y} r={r}     fill="white" opacity={0.95}/>
            {r>1.1 && <>
              <line x1={x-r*2.5} y1={y} x2={x+r*2.5} y2={y} stroke="white" strokeWidth="0.5" opacity={0.6}/>
              <line x1={x} y1={y-r*2.5} x2={x} y2={y+r*2.5} stroke="white" strokeWidth="0.5" opacity={0.6}/>
            </>}
          </g>
        ))}
      </svg>

      {/* placeholder closer so next element parses */}
      <div style={{ display:"none" }}/>

      {/* ── CIRCULAR PHOTO WINDOW — bird centred inside inner ring ── */}
      <div style={{
        position:"absolute",
        left:"50%", top:"50%",
        transform:"translate(-50%, -50%)",
        width:`${(R-40)*2}px`, height:`${(R-40)*2}px`,
        borderRadius:"50%",
        overflow:"hidden",
        zIndex:1,
        boxShadow:"0 0 0 2px rgba(0,238,212,0.55), 0 0 50px rgba(0,238,212,0.25), 0 0 100px rgba(0,200,180,0.12)",
      }}>
        <img src={bgPhoto} alt="" style={{
          width:"100%", height:"100%",
          objectFit:"cover", objectPosition:"50% 42%",
          filter:"brightness(0.92) contrast(1.08) saturate(1.12)",
        }}/>
      </div>

      {/* Subtle edge vignette so side-panel text stays readable */}
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none",
        background:"radial-gradient(ellipse 78% 85% at 50% 50%, transparent 45%, rgba(3,8,16,0.75) 80%, rgba(2,6,14,0.95) 100%)",
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

        {/* ── INNER cyan glow ring — traces the circular photo window edge ── */}
        {/* Outer glow halo */}
        <circle r={R-40} fill="none" stroke="rgba(0,230,205,0.16)" strokeWidth="26"/>
        {/* Main bright line */}
        <circle r={R-40} fill="none" stroke="rgba(0,238,212,0.85)" strokeWidth="2.6"/>
        {/* Inner bright specular */}
        <circle r={R-40} fill="none" stroke="rgba(200,255,248,0.40)" strokeWidth="1.0"/>

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
        {/* SAVE OUR WILDLIFE — cursive */}
        <div style={{ position:"relative" }}>
          {/* decorative accent */}
          <div style={{
            display:"flex", alignItems:"center", gap:"8px", marginBottom:"8px",
          }}>
            <div style={{ width:"18px", height:"1px", background:"rgba(34,197,94,0.6)" }}/>
            <span style={{
              fontFamily:"'Josefin Sans',sans-serif", fontSize:"8px", fontWeight:700,
              letterSpacing:"0.32em", color:"rgba(34,197,94,0.75)", textTransform:"uppercase",
            }}>Conservation</span>
          </div>
          <div style={{
            fontFamily:"'Playfair Display',serif",
            fontStyle:"italic", fontWeight:700,
            fontSize:"clamp(26px,3.1vw,46px)",
            color:"#fff", lineHeight:1.05,
            textShadow:"0 2px 30px rgba(0,0,0,0.8), 0 0 50px rgba(34,197,94,0.18)",
          }}>
            Save Our<br/>Wildlife
          </div>
          <div style={{
            display:"flex", alignItems:"center", gap:"7px", marginTop:"9px",
          }}>
            <span style={{ fontSize:"15px", filter:"drop-shadow(0 0 5px rgba(34,197,94,0.8))" }}>🌿</span>
            <div style={{
              fontFamily:"'Josefin Sans',sans-serif", fontSize:"clamp(8px,0.82vw,11px)",
              fontWeight:700, letterSpacing:"0.36em", color:"rgba(34,197,94,0.88)",
              textTransform:"uppercase",
            }}>Every Species Matters</div>
          </div>
          <div style={{
            width:"100%", height:"1px", marginTop:"10px",
            background:"linear-gradient(to right, rgba(34,197,94,0.50), rgba(0,218,195,0.25), transparent)",
          }}/>
        </div>

        {/* Quote — styled block */}
        <div style={{
          background:"rgba(34,197,94,0.06)",
          border:"1px solid rgba(34,197,94,0.18)",
          borderLeft:"3px solid rgba(34,197,94,0.60)",
          borderRadius:"0 8px 8px 0",
          padding:"12px 14px",
        }}>
          <div style={{
            fontFamily:"'Playfair Display',serif", fontSize:"clamp(18px,1.8vw,26px)",
            color:"rgba(34,197,94,0.55)", lineHeight:1, marginBottom:"7px",
          }}>❝</div>
          <div style={{
            fontFamily:"'Playfair Display',serif",
            fontSize:"clamp(10px,0.94vw,13.5px)", fontStyle:"italic",
            color:"rgba(255,255,255,0.82)", lineHeight:1.75,
          }}>
            We don't inherit the Earth from our ancestors. We borrow it from our children.
          </div>
          <div style={{
            fontFamily:"'Josefin Sans',sans-serif", fontSize:"8.5px",
            color:"rgba(34,197,94,0.50)", letterSpacing:"0.20em",
            textTransform:"uppercase", marginTop:"9px",
          }}>— Antoine de Saint-Exupéry</div>
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
          background:"rgba(2,5,18,0.88)", backdropFilter:"blur(18px)",
          border:"1px solid rgba(212,175,55,0.20)", borderRadius:"12px",
          padding:"14px 15px", position:"relative", overflow:"hidden",
        }}>
          {/* gold top bar */}
          <div style={{
            position:"absolute", top:0, left:0, right:0, height:"2px",
            background:"linear-gradient(to right, rgba(212,175,55,0.8), rgba(249,115,22,0.5), transparent)",
          }}/>
          <div style={{
            fontFamily:"'Josefin Sans',sans-serif", fontSize:"9px", fontWeight:700,
            letterSpacing:"0.30em", color:"rgba(212,175,55,0.90)",
            textTransform:"uppercase", marginBottom:"12px",
            display:"flex", alignItems:"center", gap:"7px",
          }}>
            <span style={{ fontSize:"11px" }}>⚡</span> Quick Facts
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:"7px" }}>

            {/* Status */}
            <div style={{
              background:"linear-gradient(135deg,rgba(249,115,22,0.14),rgba(249,115,22,0.04))",
              border:"1px solid rgba(249,115,22,0.28)", borderRadius:"9px",
              padding:"9px 11px", display:"flex", alignItems:"center", gap:"9px",
            }}>
              <div style={{
                width:32, height:32, borderRadius:"50%", flexShrink:0,
                background:"rgba(249,115,22,0.16)", border:"1px solid rgba(249,115,22,0.45)",
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:"15px",
                filter:"drop-shadow(0 0 6px rgba(249,115,22,0.65))",
              }}>🛡</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:"7px", fontWeight:700,
                  letterSpacing:"0.22em", color:"rgba(249,115,22,0.65)", textTransform:"uppercase", marginBottom:"2px" }}>Status</div>
                <div style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:"12px", fontWeight:700,
                  color:"#f97316", letterSpacing:"0.03em" }}>Endangered</div>
              </div>
              <svg width="38" height="18" viewBox="0 0 38 18" style={{ flexShrink:0 }}>
                <polyline points="0,9 5,9 8,3 11,15 14,9 19,9 22,5 25,13 28,9 33,9 36,5 38,7"
                  fill="none" stroke="#f97316" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.85"/>
              </svg>
            </div>

            {/* Population */}
            <div style={{
              background:"linear-gradient(135deg,rgba(124,58,237,0.14),rgba(124,58,237,0.04))",
              border:"1px solid rgba(124,58,237,0.28)", borderRadius:"9px",
              padding:"9px 11px", display:"flex", alignItems:"center", gap:"9px",
            }}>
              <div style={{
                width:32, height:32, borderRadius:"50%", flexShrink:0,
                background:"rgba(124,58,237,0.16)", border:"1px solid rgba(124,58,237,0.45)",
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:"15px",
                filter:"drop-shadow(0 0 6px rgba(124,58,237,0.65))",
              }}>👥</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:"7px", fontWeight:700,
                  letterSpacing:"0.22em", color:"rgba(124,58,237,0.65)", textTransform:"uppercase", marginBottom:"2px" }}>Population</div>
                <div style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:"12px", fontWeight:700,
                  color:"#a78bfa", letterSpacing:"0.02em" }}>2,500–3,500</div>
              </div>
              <svg width="28" height="18" viewBox="0 0 28 18" style={{ flexShrink:0 }}>
                {[3,6,4,9,7,11,10].map((h,i)=>(
                  <rect key={i} x={i*4} y={18-h} width="3" height={h}
                    fill="#7c3aed" opacity={0.35+i*0.09} rx="1"/>
                ))}
              </svg>
            </div>

            {/* Habitat */}
            <div style={{
              background:"linear-gradient(135deg,rgba(34,197,94,0.14),rgba(34,197,94,0.04))",
              border:"1px solid rgba(34,197,94,0.28)", borderRadius:"9px",
              padding:"9px 11px", display:"flex", alignItems:"center", gap:"9px",
            }}>
              <div style={{
                width:32, height:32, borderRadius:"50%", flexShrink:0,
                background:"rgba(34,197,94,0.16)", border:"1px solid rgba(34,197,94,0.45)",
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:"15px",
                filter:"drop-shadow(0 0 6px rgba(34,197,94,0.65))",
              }}>🏝</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:"7px", fontWeight:700,
                  letterSpacing:"0.22em", color:"rgba(34,197,94,0.65)", textTransform:"uppercase", marginBottom:"2px" }}>Habitat</div>
                <div style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:"11px", fontWeight:700,
                  color:"#22c55e", letterSpacing:"0.02em", lineHeight:1.2 }}>Hawaiian Wetlands</div>
              </div>
              <svg width="28" height="18" viewBox="0 0 28 18" style={{ flexShrink:0 }}>
                {[1,5,9,13,17,21,25].map((x,i)=>(
                  <line key={i} x1={x} y1={18} x2={x} y2={18-(4+[5,8,6,9,7,10,6][i])}
                    stroke="#22c55e" strokeWidth="2" strokeLinecap="round" opacity="0.75"/>
                ))}
              </svg>
            </div>

            {/* Lifespan */}
            <div style={{
              background:"linear-gradient(135deg,rgba(212,175,55,0.14),rgba(212,175,55,0.04))",
              border:"1px solid rgba(212,175,55,0.28)", borderRadius:"9px",
              padding:"9px 11px", display:"flex", alignItems:"center", gap:"9px",
            }}>
              <div style={{
                width:32, height:32, borderRadius:"50%", flexShrink:0,
                background:"rgba(212,175,55,0.16)", border:"1px solid rgba(212,175,55,0.45)",
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:"15px",
                filter:"drop-shadow(0 0 6px rgba(212,175,55,0.65))",
              }}>⌛</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:"7px", fontWeight:700,
                  letterSpacing:"0.22em", color:"rgba(212,175,55,0.65)", textTransform:"uppercase", marginBottom:"2px" }}>Lifespan</div>
                <div style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:"12px", fontWeight:700,
                  color:"#d4af37", letterSpacing:"0.03em" }}>10–15 years</div>
              </div>
              <div style={{ display:"flex", gap:"3px", flexShrink:0, alignItems:"center" }}>
                {Array.from({length:5}).map((_,i)=>(
                  <div key={i} style={{
                    width:6, height:6, borderRadius:"50%",
                    background: i < 3 ? "#d4af37" : "rgba(212,175,55,0.22)",
                    boxShadow: i < 3 ? "0 0 5px rgba(212,175,55,0.6)" : "none",
                  }}/>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Where It Lives */}
        <div style={{
          background:"linear-gradient(135deg, rgba(0,22,38,0.94) 0%, rgba(0,14,28,0.92) 100%)",
          backdropFilter:"blur(20px)",
          border:"1px solid rgba(0,218,195,0.30)",
          borderRadius:"12px",
          padding:"14px 15px",
          position:"relative", overflow:"hidden",
        }}>
          {/* top accent line */}
          <div style={{
            position:"absolute", top:0, left:0, right:0, height:"2px",
            background:"linear-gradient(to right, transparent, rgba(0,218,195,0.80), transparent)",
          }}/>
          {/* header */}
          <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"9px" }}>
            <span style={{ fontSize:"12px", filter:"drop-shadow(0 0 5px rgba(0,218,195,0.7))" }}>📍</span>
            <div style={{
              fontFamily:"'Josefin Sans',sans-serif", fontSize:"9px", fontWeight:700,
              letterSpacing:"0.28em", color:"rgba(0,218,195,0.92)", textTransform:"uppercase",
            }}>Where It Lives</div>
          </div>
          {/* title */}
          <div style={{ marginBottom:"9px" }}>
            <div style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:"13px", fontWeight:700,
              color:"#fff", letterSpacing:"0.06em" }}>Hawaiian Islands</div>
            <div style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:"8px",
              color:"rgba(0,218,195,0.60)", letterSpacing:"0.10em", marginTop:"2px" }}>
              Pacific Ocean · USA
            </div>
          </div>

          {/* ── SVG Hawaii Archipelago Map ── */}
          <div style={{
            background:"rgba(0,25,45,0.75)", backdropFilter:"blur(6px)",
            border:"1px solid rgba(0,218,195,0.18)", borderRadius:"9px",
            padding:"9px 7px 6px", marginBottom:"10px", position:"relative", overflow:"hidden",
          }}>
            <svg viewBox="0 0 260 92" style={{ width:"100%", display:"block" }}>
              <defs>
                <pattern id="hgrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0,218,195,0.06)" strokeWidth="0.5"/>
                </pattern>
                <radialGradient id="isleGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(0,218,195,0.55)"/>
                  <stop offset="100%" stopColor="rgba(0,218,195,0.18)"/>
                </radialGradient>
              </defs>
              <rect width="260" height="92" fill="url(#hgrid)"/>
              {/* Ocean atmosphere */}
              <ellipse cx="130" cy="55" rx="125" ry="40" fill="rgba(0,80,130,0.07)"/>
              {/* Island chain connector */}
              <line x1="18" y1="34" x2="228" y2="68" stroke="rgba(0,218,195,0.10)" strokeWidth="1" strokeDasharray="4,3"/>

              {/* Ni'ihau */}
              <ellipse cx="12" cy="30" rx="5" ry="6.5" fill="rgba(0,218,195,0.28)" stroke="rgba(0,218,195,0.55)" strokeWidth="0.7"/>

              {/* Kaua'i */}
              <ellipse cx="30" cy="34" rx="13" ry="11.5" fill="url(#isleGlow)" stroke="rgba(0,238,212,0.80)" strokeWidth="1"/>
              <circle cx="30" cy="34" r="2.5" fill="rgba(0,255,220,0.95)" filter="url(#dot-glow)"/>
              <circle cx="30" cy="34" r="6" fill="none" stroke="rgba(0,218,195,0.35)" strokeWidth="0.7"/>

              {/* O'ahu */}
              <ellipse cx="80" cy="45" rx="18" ry="11.5" fill="url(#isleGlow)" stroke="rgba(0,238,212,0.80)" strokeWidth="1"/>
              <circle cx="80" cy="45" r="2.8" fill="rgba(0,255,220,0.95)"/>
              <circle cx="80" cy="45" r="7" fill="none" stroke="rgba(0,218,195,0.30)" strokeWidth="0.7"/>

              {/* Moloka'i */}
              <ellipse cx="115" cy="46" rx="14" ry="6.5" fill="url(#isleGlow)" stroke="rgba(0,218,195,0.65)" strokeWidth="0.8"/>

              {/* Maui */}
              <ellipse cx="146" cy="53" rx="18" ry="12" fill="url(#isleGlow)" stroke="rgba(0,238,212,0.80)" strokeWidth="1"/>
              <circle cx="146" cy="53" r="2.5" fill="rgba(0,255,220,0.95)"/>

              {/* Hawai'i (Big Island) */}
              <ellipse cx="213" cy="67" rx="31" ry="23" fill="url(#isleGlow)" stroke="rgba(0,238,212,0.85)" strokeWidth="1.2"/>
              <circle cx="213" cy="67" r="3.2" fill="rgba(0,255,220,1)" filter="url(#dot-glow)"/>
              <circle cx="213" cy="67" r="9" fill="none" stroke="rgba(0,218,195,0.28)" strokeWidth="0.7"/>

              {/* Island labels */}
              <text x="30" y="50" textAnchor="middle" fontFamily="sans-serif" fontSize="5.5" fontWeight="700"
                fill="rgba(0,218,195,0.80)" letterSpacing="0.5">KAUA'I</text>
              <text x="80" y="61" textAnchor="middle" fontFamily="sans-serif" fontSize="5.5" fontWeight="700"
                fill="rgba(0,218,195,0.80)" letterSpacing="0.5">O'AHU</text>
              <text x="146" y="69" textAnchor="middle" fontFamily="sans-serif" fontSize="5.5" fontWeight="700"
                fill="rgba(0,218,195,0.80)" letterSpacing="0.5">MAUI</text>
              <text x="213" y="82" textAnchor="middle" fontFamily="sans-serif" fontSize="5.5" fontWeight="700"
                fill="rgba(0,218,195,0.80)" letterSpacing="0.5">HAWAI'I</text>

              {/* Pacific label */}
              <text x="130" y="89" textAnchor="middle" fontFamily="sans-serif" fontSize="5" fontWeight="400"
                fill="rgba(255,255,255,0.22)" letterSpacing="2">PACIFIC OCEAN</text>
            </svg>
          </div>

          {/* description */}
          <div style={{
            fontFamily:"'Playfair Display',serif", fontStyle:"italic",
            fontSize:"10.5px", color:"rgba(255,255,255,0.72)", lineHeight:1.70,
            marginBottom:"10px",
          }}>
            Found only in Hawai{"\u02BB"}i — native to freshwater wetlands, taro fields &amp; coastal ponds.
          </div>
          {/* island tags */}
          <div style={{ display:"flex", gap:"5px", flexWrap:"wrap" }}>
            {["\u02BBOahu","Maui","\u02BBKauai","Moloka\u02BBi","Hawai\u02BBi"].map(island=>(
              <span key={island} style={{
                fontFamily:"'Josefin Sans',sans-serif", fontSize:"7.5px", fontWeight:700,
                letterSpacing:"0.06em", color:"rgba(0,218,195,0.85)",
                background:"rgba(0,218,195,0.10)", border:"1px solid rgba(0,218,195,0.28)",
                borderRadius:"99px", padding:"2px 8px",
              }}>{island}</span>
            ))}
          </div>
        </div>

        {/* Explore / Learn / Protect CTA */}
        <div style={{
          background:"linear-gradient(135deg, rgba(0,12,26,0.90) 0%, rgba(5,15,32,0.88) 100%)",
          backdropFilter:"blur(18px)",
          border:"1px solid rgba(255,255,255,0.08)",
          borderRadius:"12px",
          padding:"17px 18px",
          position:"relative", overflow:"hidden",
        }}>
          {/* rainbow top accent */}
          <div style={{
            position:"absolute", top:0, left:0, right:0, height:"2px",
            background:"linear-gradient(to right, rgba(34,197,94,0.75), rgba(20,184,166,0.75), rgba(249,115,22,0.75))",
          }}/>
          {/* three rows */}
          <div style={{ display:"flex", flexDirection:"column", gap:"6px", marginBottom:"13px" }}>
            {([
              { word:"Explore.", color:"#22c55e", glow:"rgba(34,197,94,0.65)", icon:"🔭" },
              { word:"Learn.",   color:"#14b8a6", glow:"rgba(20,184,166,0.55)",  icon:"📖" },
              { word:"Protect.", color:"#f97316", glow:"rgba(249,115,22,0.60)",  icon:"🛡️" },
            ] as { word:string; color:string; glow:string; icon:string }[]).map(({ word, color, glow, icon })=>(
              <div key={word} style={{
                display:"flex", alignItems:"center", gap:"10px",
                padding:"5px 8px", borderRadius:"7px",
                background:`rgba(${color==='#22c55e'?'34,197,94':color==='#14b8a6'?'20,184,166':'249,115,22'},0.07)`,
              }}>
                <span style={{ fontSize:"15px", flexShrink:0, filter:`drop-shadow(0 0 5px ${glow})` }}>{icon}</span>
                <span style={{
                  fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontWeight:700,
                  fontSize:"clamp(15px,1.55vw,22px)",
                  color, textShadow:`0 0 22px ${glow}`,
                  lineHeight:1.2,
                }}>{word}</span>
              </div>
            ))}
          </div>
          {/* tagline */}
          <div style={{
            fontFamily:"'Josefin Sans',sans-serif", fontSize:"9.5px",
            color:"rgba(255,255,255,0.45)", letterSpacing:"0.05em", lineHeight:1.65,
          }}>
            Click any circle to explore<br/>the world of the {"\u02BBalae ke\u02BBoke\u02BBo"}.
          </div>
          {/* footer rule + arrow */}
          <div style={{
            display:"flex", alignItems:"center", gap:"8px", marginTop:"11px",
          }}>
            <div style={{
              flex:1, height:"1px",
              background:"linear-gradient(to right, rgba(249,115,22,0.45), transparent)",
            }}/>
            <span style={{ color:"rgba(249,115,22,0.80)", fontSize:"15px", lineHeight:1 }}>→</span>
          </div>
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
