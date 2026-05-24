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

      {/* ── TOP-LEFT: Save Our Wildlife ───────────────────────────────────────── */}
      <motion.div {...panelAnim(-1, 0.1)} style={{
        position:"absolute", left:"14px", top:"5%",
        zIndex:6, width:`calc(50% - ${R + CZ/2 + 26}px)`,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"9px" }}>
          <div style={{ width:"18px", height:"1px", background:"rgba(34,197,94,0.6)" }}/>
          <span style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:"12px", fontWeight:700,
            letterSpacing:"0.28em", color:"rgba(34,197,94,0.90)", textTransform:"uppercase" }}>
            Conservation Project
          </span>
        </div>
        <div style={{ position:"relative", display:"inline-block" }}>
          <div style={{
            fontFamily:"'Great Vibes', cursive",
            fontSize:"clamp(42px,5vw,72px)", color:"#fff", lineHeight:1.05,
            textShadow:"0 2px 30px rgba(0,0,0,0.9), 0 0 60px rgba(34,197,94,0.28)",
          }}>Save Our Wildlife</div>
          <span style={{
            position:"absolute", top:-4, right:-22, fontSize:"22px", opacity:0.85,
            filter:"drop-shadow(0 0 10px rgba(255,100,150,0.60))", pointerEvents:"none",
          }}>🌺</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"8px", marginTop:"8px" }}>
          <span style={{ fontSize:"16px", filter:"drop-shadow(0 0 5px rgba(34,197,94,0.85))" }}>🌿</span>
          <div style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:"clamp(12px,1.15vw,16px)",
            fontWeight:700, letterSpacing:"0.28em", color:"rgba(34,197,94,0.95)", textTransform:"uppercase" }}>
            Every Species Matters
          </div>
          <span style={{ fontSize:"14px", filter:"drop-shadow(0 0 4px rgba(34,197,94,0.7))", opacity:0.80 }}>🌿</span>
        </div>
        <div style={{ width:"85%", height:"1px", marginTop:"10px",
          background:"linear-gradient(to right, rgba(34,197,94,0.60), rgba(0,218,195,0.30), transparent)" }}/>
        {/* Quote card — moved here, below the title */}
        <div style={{
          marginTop:"13px",
          background:"#030f08",
          border:"1px solid rgba(34,197,94,0.28)",
          borderLeft:"3px solid rgba(34,197,94,0.85)",
          borderRadius:"0 10px 10px 0",
          padding:"13px 15px 11px",
          position:"relative", overflow:"hidden",
        }}>
          <div style={{ position:"absolute", top:0, left:0, width:"80px", height:"80px",
            background:"radial-gradient(ellipse, rgba(34,197,94,0.15) 0%, transparent 70%)", pointerEvents:"none" }}/>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(22px,2.2vw,32px)",
            color:"rgba(34,197,94,0.65)", lineHeight:1, marginBottom:"6px" }}>❝</div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(11px,1.0vw,15px)",
            fontStyle:"italic", color:"rgba(255,255,255,0.92)", lineHeight:1.75 }}>
            We don&apos;t inherit the Earth from our ancestors. We borrow it from our children.
          </div>
          <div style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:"9px",
            color:"rgba(34,197,94,0.60)", letterSpacing:"0.20em",
            textTransform:"uppercase", marginTop:"9px" }}>— Antoine de Saint-Exupéry</div>
        </div>
      </motion.div>

      {/* ── BOTTOM-LEFT: Explore / Learn / Protect — hexagonal cards ─────────── */}
      <motion.div {...panelAnim(-1, 0.18)} style={{
        position:"absolute", left:"14px", bottom:"4%",
        zIndex:6, width:`calc(50% - ${R + CZ/2 + 14}px)`,
      }}>
        <div style={{ display:"flex", gap:"7px" }}>
          {([
            {
              word:"EXPLORE", icon:"🧭", deco:"🌿", color:"#4ade80", rgb:"74,222,128",
              desc:`Discover the world of \u02BBalae ke\u02BBoke\u02BBo`,
              scene:(
                <svg viewBox="0 0 80 52" style={{ width:"100%", display:"block" }}>
                  <defs>
                    <radialGradient id="eg" cx="50%" cy="100%" r="70%">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity="0.40"/>
                      <stop offset="100%" stopColor="#22c55e" stopOpacity="0"/>
                    </radialGradient>
                  </defs>
                  <rect width="80" height="52" fill="#030c07"/>
                  <rect y="34" width="80" height="18" fill="url(#eg)"/>
                  <path d="M8,50 Q5,36 3,28 Q9,36 12,50Z" fill="#14532d"/>
                  <path d="M8,50 Q12,34 16,28 Q13,37 10,50Z" fill="#22c55e" opacity="0.75"/>
                  <path d="M22,50 Q18,30 15,22 Q22,33 26,50Z" fill="#14532d"/>
                  <path d="M22,50 Q26,28 31,23 Q27,34 24,50Z" fill="#22c55e" opacity="0.70"/>
                  <path d="M40,50 Q36,26 33,19 Q40,30 44,50Z" fill="#14532d"/>
                  <path d="M40,50 Q44,24 50,20 Q46,32 42,50Z" fill="#22c55e" opacity="0.65"/>
                  <path d="M58,50 Q55,32 52,25 Q58,34 62,50Z" fill="#14532d"/>
                  <path d="M58,50 Q62,30 67,26 Q64,36 60,50Z" fill="#22c55e" opacity="0.60"/>
                  <path d="M72,50 Q70,36 68,30 Q73,37 75,50Z" fill="#14532d" opacity="0.85"/>
                  <line x1="0" y1="48" x2="80" y2="48" stroke="rgba(74,222,128,0.28)" strokeWidth="0.6"/>
                </svg>
              ),
            },
            {
              word:"LEARN", icon:"📖", deco:"🌊", color:"#67e8f9", rgb:"103,232,249",
              desc:"Understand, connect & be inspired",
              scene:(
                <svg viewBox="0 0 80 52" style={{ width:"100%", display:"block" }}>
                  <defs>
                    <radialGradient id="wg" cx="50%" cy="80%" r="60%">
                      <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.35"/>
                      <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0"/>
                    </radialGradient>
                  </defs>
                  <rect width="80" height="52" fill="#020a14"/>
                  <ellipse cx="40" cy="48" rx="40" ry="12" fill="url(#wg)"/>
                  <ellipse cx="40" cy="40" rx="34" ry="7" fill="none" stroke="rgba(103,232,249,0.18)" strokeWidth="0.9"/>
                  <ellipse cx="40" cy="40" rx="24" ry="5" fill="none" stroke="rgba(103,232,249,0.26)" strokeWidth="0.9"/>
                  <ellipse cx="40" cy="40" rx="14" ry="3" fill="none" stroke="rgba(103,232,249,0.36)" strokeWidth="0.9"/>
                  <ellipse cx="40" cy="40" rx="5"  ry="1.2" fill="none" stroke="rgba(103,232,249,0.50)" strokeWidth="0.9"/>
                  <path d="M40,33 Q37,28 40,24 Q43,28 40,33Z" fill="rgba(103,232,249,0.80)"/>
                  <path d="M40,33 Q34,30 33,25 Q38,28 40,33Z" fill="rgba(103,232,249,0.55)"/>
                  <path d="M40,33 Q46,30 47,25 Q42,28 40,33Z" fill="rgba(103,232,249,0.55)"/>
                  <path d="M40,33 Q36,37 35,41 Q39,36 40,33Z" fill="rgba(103,232,249,0.35)"/>
                  <path d="M40,33 Q44,37 45,41 Q41,36 40,33Z" fill="rgba(103,232,249,0.35)"/>
                  <circle cx="40" cy="33" r="2.2" fill="rgba(103,232,249,0.95)"/>
                  <line x1="0" y1="46" x2="80" y2="46" stroke="rgba(103,232,249,0.20)" strokeWidth="0.6"/>
                </svg>
              ),
            },
            {
              word:"PROTECT", icon:"🛡️", deco:"🌺", color:"#fb923c", rgb:"251,146,60",
              desc:"Take action & make a difference",
              scene:(
                <svg viewBox="0 0 80 52" style={{ width:"100%", display:"block" }}>
                  <defs>
                    <radialGradient id="sg" cx="50%" cy="100%" r="75%">
                      <stop offset="0%" stopColor="#f97316" stopOpacity="0.50"/>
                      <stop offset="100%" stopColor="#f97316" stopOpacity="0"/>
                    </radialGradient>
                  </defs>
                  <rect width="80" height="52" fill="#0d0400"/>
                  <rect width="80" height="36" fill="rgba(249,115,22,0.07)"/>
                  <ellipse cx="40" cy="52" rx="42" ry="16" fill="url(#sg)"/>
                  <path d="M26,38 Q40,30 54,38" fill="rgba(251,146,60,0.45)"/>
                  <line x1="0" y1="38" x2="80" y2="38" stroke="rgba(251,146,60,0.32)" strokeWidth="0.7"/>
                  <path d="M40,50 Q40.5,44 41,36 Q40,30 41,22" stroke="rgba(92,40,0,0.95)" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
                  <path d="M41,22 Q30,16 24,11" stroke="rgba(70,28,0,0.90)" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
                  <path d="M41,22 Q52,14 58,11" stroke="rgba(70,28,0,0.90)" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
                  <path d="M41,24 Q32,18 28,13" stroke="rgba(70,28,0,0.75)" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
                  <path d="M41,24 Q50,18 55,14" stroke="rgba(70,28,0,0.75)" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
                  <path d="M41,26 Q28,26 22,24" stroke="rgba(70,28,0,0.60)" strokeWidth="1.0" fill="none" strokeLinecap="round"/>
                  <circle cx="60" cy="20" r="6" fill="rgba(251,146,60,0.22)"/>
                  <circle cx="60" cy="20" r="3.5" fill="rgba(251,146,60,0.50)"/>
                </svg>
              ),
            },
          ] as { word:string; icon:string; deco:string; color:string; rgb:string; desc:string; scene:React.ReactNode }[])
          .map(({ word, icon, deco, color, rgb, desc, scene }) => {
            const CLIP = "polygon(14% 0%, 86% 0%, 100% 13%, 100% 100%, 0% 100%, 0% 13%)";
            return (
              <div key={word} style={{ flex:1, filter:`drop-shadow(0 0 10px rgba(${rgb},0.55))` }}>
                {/* Border layer */}
                <div style={{ clipPath:CLIP, background:`rgba(${rgb},0.55)`, padding:"1.5px" }}>
                  {/* Inner card */}
                  <div style={{
                    clipPath:CLIP,
                    background:`linear-gradient(180deg, rgba(6,14,28,0.98) 0%, rgba(6,14,28,0.95) 55%, rgba(${rgb},0.10) 100%)`,
                    display:"flex", flexDirection:"column", alignItems:"center",
                    height:"178px", overflow:"hidden",
                  }}>
                    {/* Icon circle */}
                    <div style={{
                      marginTop:"18px",
                      width:34, height:34, borderRadius:"50%",
                      background:`rgba(${rgb},0.14)`, border:`1.5px solid rgba(${rgb},0.60)`,
                      display:"flex", alignItems:"center", justifyContent:"center", fontSize:"15px",
                      filter:`drop-shadow(0 0 5px rgba(${rgb},0.55))`,
                    }}>{icon}</div>
                    {/* Title */}
                    <div style={{
                      fontFamily:"'Josefin Sans',sans-serif", fontSize:"9.5px", fontWeight:800,
                      letterSpacing:"0.18em", color, marginTop:"7px",
                      textShadow:`0 0 14px rgba(${rgb},0.75)`,
                    }}>{word}</div>
                    {/* Deco */}
                    <div style={{ fontSize:"9px", marginTop:"3px", opacity:0.65,
                      filter:`drop-shadow(0 0 4px rgba(${rgb},0.60))` }}>{deco}</div>
                    {/* Description */}
                    <div style={{
                      fontFamily:"'Josefin Sans',sans-serif", fontSize:"7.5px", fontWeight:500,
                      color:"rgba(255,255,255,0.62)", textAlign:"center", lineHeight:1.55,
                      marginTop:"5px", padding:"0 6px",
                    }}>{desc}</div>
                    {/* Nature scene — pushes to bottom */}
                    <div style={{ flex:1, width:"100%", display:"flex", alignItems:"flex-end" }}>
                      {scene}
                    </div>
                    {/* Bottom glow dot */}
                    <div style={{
                      width:7, height:7, borderRadius:"50%", marginBottom:"8px", marginTop:"3px",
                      background:color, boxShadow:`0 0 8px 2px rgba(${rgb},0.70)`,
                    }}/>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ── TOP-RIGHT: Quick Facts ───────────────────────────────────────────── */}
      <motion.div {...panelAnim(1, 0.14)} style={{
        position:"absolute",
        right:"14px", top:"3%", zIndex:6,
        width:`calc(50% - ${R + CZ/2 + 26}px)`,
        maxHeight:"46%", overflow:"hidden",
      }}>

        {/* Quick Facts — Option 2 style */}
        <div style={{
          background:"#020810",
          border:"1.5px solid rgba(0,218,195,0.55)",
          borderRadius:"14px",
          padding:"16px 16px 14px",
          position:"relative", overflow:"hidden",
          boxShadow:"0 0 28px rgba(0,218,195,0.14)",
        }}>
          {/* teal top glow bar */}
          <div style={{
            position:"absolute", top:0, left:0, right:0, height:"2px",
            background:"linear-gradient(to right, rgba(0,218,195,0.90), rgba(34,197,94,0.70), rgba(0,218,195,0.40), transparent)",
          }}/>
          {/* ambient corner glow */}
          <div style={{
            position:"absolute", top:-20, right:-20, width:"100px", height:"100px",
            background:"radial-gradient(ellipse, rgba(0,218,195,0.12) 0%, transparent 70%)", pointerEvents:"none",
          }}/>

          {/* Header */}
          <div style={{
            display:"flex", alignItems:"center", justifyContent:"space-between",
            marginBottom:"14px",
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
              <span style={{ fontSize:"12px", filter:"drop-shadow(0 0 6px rgba(0,218,195,0.9))" }}>🌿</span>
              <span style={{
                fontFamily:"'Josefin Sans',sans-serif", fontSize:"13px", fontWeight:700,
                letterSpacing:"0.26em", color:"rgba(0,218,195,1.0)", textTransform:"uppercase",
              }}>Quick Facts</span>
            </div>
            <span style={{ fontSize:"11px", opacity:0.60, filter:"drop-shadow(0 0 4px rgba(0,218,195,0.6))" }}>🌿</span>
          </div>

          {/* Rows */}
          {([
            {
              icon:"🛡️", label:"Status", value:"Endangered",
              rgb:"239,68,68", valueColor:"#ff5555",
              glow:"rgba(239,68,68,0.80)",
              viz: (
                <svg width="34" height="34" viewBox="0 0 34 34">
                  <polyline points="0,17 4,17 7,7 10,27 13,17 17,17 20,10 23,24 26,17 30,17 33,12"
                    fill="none" stroke="#ff5555" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="0,17 4,17 7,7 10,27 13,17 17,17 20,10 23,24 26,17 30,17 33,12"
                    fill="none" stroke="rgba(255,85,85,0.25)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ),
            },
            {
              icon:"👥", label:"Population", value:"2,500–3,500",
              rgb:"167,139,250", valueColor:"#c4b5fd",
              glow:"rgba(124,58,237,0.80)",
              viz: (
                <svg width="34" height="34" viewBox="0 0 34 34">
                  {[5,9,7,15,11,19,17].map((h,i)=>(
                    <g key={i}>
                      <rect x={i*4.7+1} y={34-h} width="3.8" height={h} fill="#7c3aed" opacity={0.22} rx="1"/>
                      <rect x={i*4.7+1} y={34-h} width="3.8" height={Math.max(h-2,1)} fill="#a78bfa" opacity={0.55+i*0.07} rx="1"/>
                    </g>
                  ))}
                </svg>
              ),
            },
            {
              icon:"🏝️", label:"Habitat", value:"Wetlands",
              rgb:"34,197,94", valueColor:"#4ade80",
              glow:"rgba(34,197,94,0.80)",
              viz: (
                <svg width="34" height="34" viewBox="0 0 34 34">
                  {[2,6,10,14,18,22,26,30].map((x,i)=>(
                    <line key={i} x1={x} y1={34} x2={x} y2={34-[8,14,10,17,12,19,11,15][i]}
                      stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round"
                      opacity={0.50+i*0.07}/>
                  ))}
                </svg>
              ),
            },
            {
              icon:"⌛", label:"Lifespan", value:"10–15 yrs",
              rgb:"212,175,55", valueColor:"#fbbf24",
              glow:"rgba(212,175,55,0.80)",
              viz: (
                <svg width="34" height="34" viewBox="0 0 34 34">
                  <circle cx="17" cy="17" r="13" fill="none" stroke="rgba(212,175,55,0.35)" strokeWidth="1.5"/>
                  {[0,60,120,180,240,300].map((deg,i)=>{
                    const r2=deg*Math.PI/180;
                    return <line key={i} x1={17+9*Math.sin(r2)} y1={17-9*Math.cos(r2)}
                      x2={17+12*Math.sin(r2)} y2={17-12*Math.cos(r2)}
                      stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" opacity={0.70}/>;
                  })}
                  <line x1="17" y1="17" x2="17" y2="7" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="17" y1="17" x2="24" y2="17" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" opacity="0.75"/>
                  <circle cx="17" cy="17" r="2" fill="#fbbf24"/>
                </svg>
              ),
            },
          ] as { icon:string; label:string; value:string; rgb:string; valueColor:string; glow:string; viz:React.ReactNode }[])
          .map(({ icon, label, value, rgb, valueColor, glow, viz }, idx, arr) => (
            <div key={label}>
              <div style={{
                display:"flex", alignItems:"center", gap:"0", padding:"11px 2px",
              }}>
                {/* left icon circle */}
                <div style={{
                  width:46, height:46, borderRadius:"50%", flexShrink:0,
                  background:`radial-gradient(ellipse at 35% 35%, rgba(${rgb},0.32) 0%, rgba(${rgb},0.10) 100%)`,
                  border:`2px solid rgba(${rgb},0.72)`,
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:"20px",
                  boxShadow:`0 0 16px rgba(${rgb},0.42), inset 0 0 10px rgba(${rgb},0.12)`,
                }}>{icon}</div>

                {/* label + value */}
                <div style={{ flex:1, minWidth:0, padding:"0 10px" }}>
                  <div style={{
                    fontFamily:"'Josefin Sans',sans-serif", fontSize:"13px", fontWeight:600,
                    letterSpacing:"0.08em", color:"rgba(255,255,255,0.72)",
                    marginBottom:"4px",
                  }}>{label}</div>
                  <div style={{
                    fontFamily:"'Josefin Sans',sans-serif", fontSize:"clamp(14px,1.55vw,19px)", fontWeight:700,
                    color:valueColor, letterSpacing:"0.01em", lineHeight:1.1,
                    textShadow:`0 0 20px ${glow}`,
                  }}>{value}</div>
                </div>

                {/* dotted connector */}
                <div style={{
                  width:"14px", flexShrink:0, height:"1px",
                  borderTop:`2px dashed rgba(${rgb},0.40)`,
                }}/>

                {/* right viz circle */}
                <div style={{
                  width:46, height:46, borderRadius:"50%", flexShrink:0,
                  background:`radial-gradient(ellipse at 60% 60%, rgba(${rgb},0.22) 0%, rgba(${rgb},0.06) 100%)`,
                  border:`2px solid rgba(${rgb},0.55)`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  boxShadow:`0 0 12px rgba(${rgb},0.30)`,
                  overflow:"hidden",
                }}>
                  {viz}
                </div>
              </div>

              {/* separator — skip after last */}
              {idx < arr.length - 1 && (
                <div style={{
                  height:"1px", margin:"0 6px",
                  background:`linear-gradient(to right, rgba(${rgb},0.35), rgba(0,218,195,0.18), transparent)`,
                }}/>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── BOTTOM-RIGHT: Where It Lives + Explore/Learn/Protect ─────────────── */}
      <motion.div {...panelAnim(1, 0.20)} style={{
        position:"absolute",
        right:"14px", top:"51%", zIndex:6,
        width:`calc(50% - ${R + CZ/2 + 26}px)`,
        display:"flex", flexDirection:"column", gap:"10px",
      }}>

        {/* Where It Lives — full image panel */}
        <div style={{
          border:"1px solid rgba(0,218,195,0.45)",
          borderRadius:"12px",
          overflow:"hidden",
          position:"relative",
        }}>
          <img
            src={whereItLivesImg}
            alt="Where the Hawaiian Coot Lives"
            style={{
              width:"100%", display:"block",
              borderRadius:"11px",
              objectFit:"cover",
            }}
          />
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


    </div>
  );
}
