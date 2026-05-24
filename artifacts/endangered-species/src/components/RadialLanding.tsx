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
import whereItLivesImg from "@assets/image_1779661049779.png";
import centerImg       from "@assets/image_1779664835983.png";
import explorePanelImg from "@assets/image_1779661407544.png";
import quickFactsImg   from "@assets/image_1779661714544.png";
import topLeftImg      from "@assets/image_1779662050427.png";
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
const CZ = 212;   // circle diameter px
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

      {/* ── CENTER IMAGE — bird poster with baked-in text ── */}
      <div style={{
        position:"absolute",
        left:"50%", top:"50%",
        transform:"translate(-50%, -50%)",
        width:`${(R-85)*2}px`, height:`${(R-85)*2}px`,
        borderRadius:"50%",
        overflow:"hidden",
        zIndex:1,
      }}>
        <img src={centerImg} alt="'Alae Ke'oke'o — Hawaiian Coot" style={{
          width:"100%", height:"100%",
          objectFit:"cover", objectPosition:"50% 50%",
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

      {/* ── TOP-LEFT: Save Our Wildlife ───────────────────────────────────────── */}
      <motion.div {...panelAnim(-1, 0.1)} style={{
        position:"absolute", left:"14px", top:"3%",
        zIndex:6, width:`calc(50% - ${R + CZ/2 + 26}px)`,
      }}>
        <img
          src={topLeftImg}
          alt="Save Our Wildlife — Conservation Project"
          style={{ width:"100%", display:"block", borderRadius:"10px" }}
        />
      </motion.div>

      {/* ── BOTTOM-LEFT: Explore / Learn / Protect — image panel ────────────── */}
      <motion.div {...panelAnim(-1, 0.18)} style={{
        position:"absolute", left:"14px", bottom:"3%",
        zIndex:6, width:`calc(50% - ${R + CZ/2 + 26}px)`,
      }}>
        <img
          src={explorePanelImg}
          alt="Explore, Learn, Protect"
          style={{ width:"100%", display:"block", borderRadius:"10px" }}
        />
      </motion.div>

      {/* ── TOP-RIGHT: Quick Facts ───────────────────────────────────────────── */}
      <motion.div {...panelAnim(1, 0.14)} style={{
        position:"absolute",
        right:"14px", top:"3%", zIndex:6,
        width:`calc(50% - ${R + CZ/2 + 26}px)`,
      }}>
        <img
          src={quickFactsImg}
          alt="Quick Facts"
          style={{ width:"100%", display:"block", borderRadius:"10px" }}
        />
      </motion.div>

      {/* ── BOTTOM-RIGHT: Where It Lives ─────────────────────────────────────── */}
      <motion.div {...panelAnim(1, 0.20)} style={{
        position:"absolute",
        right:"14px", bottom:"3%", zIndex:6,
        width:`calc(50% - ${R + CZ/2 + 26}px)`,
      }}>

        {/* Where It Lives — full image panel (image already has its own border) */}
        <img
          src={whereItLivesImg}
          alt="Where the Hawaiian Coot Lives"
          style={{ width:"100%", display:"block", borderRadius:"10px" }}
        />

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


    </div>
  );
}
