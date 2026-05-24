import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import bgPhoto from "@/assets/bg-photo.png";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Props { onComplete: () => void }

// ─── Durations per scene (ms) ─────────────────────────────────────────────────
const SCENE_MS = [2200, 2200, 2200, 2200, 900] as const;

// ─── Scene fade transition ────────────────────────────────────────────────────
const FD = { initial:{opacity:0}, animate:{opacity:1}, exit:{opacity:0},
             transition:{ duration:0.75, ease:"easeInOut" as const } };

// ─── CSS keyframes injected once ─────────────────────────────────────────────
const STYLES = `
  @keyframes ci-float  { 0%{opacity:0;transform:translateY(0)   scale(1)}   40%{opacity:1} 100%{opacity:0;transform:translateY(-80px) scale(0.6)} }
  @keyframes ci-drift  { 0%{transform:translateY(0)} 100%{transform:translateY(-14px)} }
  @keyframes ci-shimmer{ 0%,100%{opacity:0.25} 50%{opacity:0.80} }
  @keyframes ci-ray    { 0%,100%{opacity:0}    50%{opacity:0.30} }
  @keyframes ci-twinkle{ 0%,100%{opacity:0.2}  50%{opacity:0.95} }
`;

// ─── Ambient particles used across scenes ────────────────────────────────────
function Particles({ colors, count=14 }: { colors:string[]; count?:number }) {
  return (
    <>
      {Array.from({ length:count }, (_,i) => {
        const left   = `${8 + (i * 73 % 84)}%`;
        const top    = `${10 + (i * 47 % 75)}%`;
        const size   = 2 + (i % 3);
        const dur    = 2.4 + (i % 5) * 0.4;
        const delay  = (i * 0.3) % 2.5;
        const color  = colors[i % colors.length];
        return (
          <div key={i} style={{
            position:"absolute", left, top,
            width:`${size}px`, height:`${size}px`, borderRadius:"50%",
            background:color,
            animation:`ci-float ${dur}s ${delay}s ease-in-out infinite`,
            pointerEvents:"none",
          }}/>
        );
      })}
    </>
  );
}

// ─── Light rays ──────────────────────────────────────────────────────────────
function LightRays({ opacity=0.22 }: { opacity?:number }) {
  return (
    <>
      {[[-12,80],[5,75],[20,72],[38,68],[55,65]].map(([deg,left],i)=>(
        <div key={i} style={{
          position:"absolute", left:`${left}%`, top:"-20%",
          width:"180px", height:"200%",
          background:`linear-gradient(to bottom, rgba(245,220,80,${opacity}), transparent)`,
          transform:`rotate(${deg}deg) translateX(-50%)`,
          transformOrigin:"top center",
          animation:`ci-ray ${2.5+i*0.3}s ${i*0.4}s ease-in-out infinite`,
          pointerEvents:"none",
        }}/>
      ))}
    </>
  );
}

// ─── SCENE 1 — Pacific Ocean Fly-In ──────────────────────────────────────────
function Scene1() {
  const stars: [number,number,number][] = [
    [5,4,1],[15,8,0.7],[28,3,1.1],[42,10,0.8],[58,5,1],[72,2,0.9],[85,7,1.2],[92,11,0.7],
    [10,16,0.8],[24,20,1],[38,15,0.7],[52,18,1.1],[66,14,0.9],[80,19,1],[94,13,0.8],
    [3,25,0.9],[18,28,1],[35,24,0.7],[49,30,1.1],[63,22,0.8],[77,27,1],[90,23,0.9],
  ];
  return (
    <motion.div {...FD} style={{ position:"absolute", inset:0 }}>
      {/* Ocean gradient — sky → horizon glow → ocean */}
      <div style={{
        position:"absolute", inset:0,
        background:[
          "linear-gradient(to bottom,",
          "#010407 0%, #020b18 20%, #031828 38%, #042840 52%,",
          "#064060 62%, #0a5a82 68%, rgba(212,140,10,0.9) 73%,",
          "#f59e0b 75%, #ea6a0c 77%, #c2560a 79%,",
          "#0a5a82 84%, #064060 90%, #042840 100%)",
        ].join(" "),
      }}/>

      {/* Horizon lens glow */}
      <div style={{
        position:"absolute", left:"50%", top:"74%", transform:"translate(-50%,-50%)",
        width:"90%", height:"120px",
        background:"radial-gradient(ellipse 100% 100% at 50% 50%, rgba(245,158,11,0.45) 0%, transparent 70%)",
        pointerEvents:"none",
      }}/>

      {/* Stars */}
      {stars.map(([l,t,r],i)=>(
        <div key={i} style={{
          position:"absolute", left:`${l}%`, top:`${t}%`,
          width:`${r*2}px`, height:`${r*2}px`, borderRadius:"50%",
          background:"white",
          animation:`ci-twinkle ${1.8+i*0.15}s ${i*0.1}s ease-in-out infinite`,
          pointerEvents:"none",
        }}/>
      ))}

      {/* Speed-lines — subtle streaks suggesting flight */}
      {[30,42,54,62,70,36,47,58].map((left,i)=>(
        <div key={i} style={{
          position:"absolute", left:`${left}%`, top:"74%",
          width:"1px", height:`${18+i*4}px`,
          background:`linear-gradient(to bottom, transparent, rgba(245,220,100,${0.2+i*0.03}))`,
          transform:"translateX(-50%)",
          pointerEvents:"none",
        }}/>
      ))}

      {/* Slow zoom — simulates flying forward */}
      <motion.div
        initial={{ scale:1.06 }} animate={{ scale:1.0 }}
        transition={{ duration:2.2, ease:[0.0,0,0.3,1] }}
        style={{ position:"absolute", inset:0, pointerEvents:"none" }}
      />

      {/* Caption */}
      <motion.div
        initial={{ opacity:0, y:8 }} animate={{ opacity:0.75, y:0 }}
        transition={{ delay:0.7, duration:0.8 }}
        style={{
          position:"absolute", bottom:"22%", width:"100%", textAlign:"center",
          fontFamily:"'Josefin Sans',sans-serif", fontSize:"10px", fontWeight:700,
          letterSpacing:"0.42em", color:"rgba(245,200,60,0.85)", textTransform:"uppercase",
          pointerEvents:"none",
        }}
      >Pacific Ocean · Approaching Hawai{"\u02BB"}i</motion.div>
    </motion.div>
  );
}

// ─── SCENE 2 — Hawaiian Islands Reveal ───────────────────────────────────────
function Scene2() {
  return (
    <motion.div {...FD} style={{ position:"absolute", inset:0, overflow:"hidden" }}>
      {/* bg-photo showing sky/mountains — high altitude */}
      <motion.img
        src={bgPhoto}
        initial={{ scale:1.65, y:0 }}
        animate={{ scale:1.40, y:0 }}
        transition={{ duration:2.2, ease:[0.16,1,0.3,1] }}
        style={{ position:"absolute", inset:0, width:"100%", height:"100%",
                 objectFit:"cover", objectPosition:"50% 12%" }}
      />
      {/* Heavy cloud/mist overlay fading away */}
      <motion.div
        initial={{ opacity:0.92 }} animate={{ opacity:0.30 }}
        transition={{ duration:1.8, delay:0.3 }}
        style={{
          position:"absolute", inset:0,
          background:"linear-gradient(to bottom, rgba(200,220,240,0.8) 0%, rgba(255,255,255,0.6) 30%, rgba(180,200,220,0.4) 55%, transparent 80%)",
          pointerEvents:"none",
        }}
      />
      {/* Bottom dark fade */}
      <div style={{
        position:"absolute", inset:0,
        background:"linear-gradient(to top, rgba(2,8,16,0.80) 0%, transparent 40%)",
        pointerEvents:"none",
      }}/>

      <LightRays opacity={0.18}/>
      <Particles colors={["rgba(245,220,80,0.7)","rgba(200,230,255,0.6)","rgba(255,255,255,0.5)"]} count={10}/>

      {/* "Birds" — simple moving lines */}
      {[38,52,60].map((left,i)=>(
        <motion.div key={i}
          initial={{ x:"-80px", opacity:0 }} animate={{ x:"120px", opacity:[0,0.7,0] }}
          transition={{ delay:0.5+i*0.25, duration:1.4, ease:"easeInOut" }}
          style={{
            position:"absolute", left:`${left}%`, top:`${14+i*4}%`,
            width:"18px", height:"4px", pointerEvents:"none",
          }}
        >
          <svg viewBox="0 0 18 4" style={{ width:"100%", height:"100%" }}>
            <path d="M0 2 Q4.5 0 9 2 Q13.5 4 18 2" fill="none" stroke="rgba(0,0,0,0.55)" strokeWidth="1"/>
          </svg>
        </motion.div>
      ))}

      {/* Quote text */}
      <motion.div
        initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }}
        transition={{ delay:0.9, duration:0.9, ease:[0.16,1,0.3,1] }}
        style={{
          position:"absolute", bottom:"26%", width:"100%", textAlign:"center",
          pointerEvents:"none",
        }}
      >
        <div style={{
          fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontWeight:700,
          fontSize:"clamp(18px,2.8vw,38px)", color:"#fff",
          textShadow:"0 2px 40px rgba(0,0,0,0.9), 0 0 80px rgba(0,0,0,0.7)",
          lineHeight:1.2,
        }}>Every Wetland Tells a Story</div>
        <div style={{
          width:"60px", height:"1px", margin:"10px auto 0",
          background:"rgba(245,200,60,0.6)",
        }}/>
      </motion.div>
    </motion.div>
  );
}

// ─── SCENE 3 — Wetland Descent ───────────────────────────────────────────────
function Scene3() {
  return (
    <motion.div {...FD} style={{ position:"absolute", inset:0, overflow:"hidden" }}>
      {/* bg-photo descending — mid level, wetland coming into view */}
      <motion.img
        src={bgPhoto}
        initial={{ scale:1.28, y:0 }}
        animate={{ scale:1.08, y:0 }}
        transition={{ duration:2.2, ease:[0.16,1,0.3,1] }}
        style={{ position:"absolute", inset:0, width:"100%", height:"100%",
                 objectFit:"cover", objectPosition:"50% 35%" }}
      />
      {/* Green eco-glow from below */}
      <div style={{
        position:"absolute", inset:0,
        background:[
          "linear-gradient(to top, rgba(20,80,30,0.55) 0%, rgba(10,50,20,0.25) 25%, transparent 55%)",
          "radial-gradient(ellipse 70% 40% at 50% 85%, rgba(34,197,94,0.20) 0%, transparent 70%)",
        ].join(","),
        pointerEvents:"none",
      }}/>
      {/* Top dark */}
      <div style={{
        position:"absolute", inset:0,
        background:"linear-gradient(to bottom, rgba(2,8,16,0.55) 0%, transparent 30%)",
        pointerEvents:"none",
      }}/>

      <LightRays opacity={0.14}/>

      {/* Water shimmer dots at bottom */}
      {Array.from({length:12},(_,i)=>(
        <div key={i} style={{
          position:"absolute",
          left:`${15+(i*65%72)}%`,
          bottom:`${4+(i*31%18)}%`,
          width:`${3+(i%3)}px`, height:"1px",
          borderRadius:"99px",
          background:`rgba(${i%2?'0,218,195':'245,200,80'},0.7)`,
          animation:`ci-shimmer ${1.2+i*0.2}s ${i*0.15}s ease-in-out infinite`,
          pointerEvents:"none",
        }}/>
      ))}

      <Particles colors={["rgba(34,197,94,0.65)","rgba(0,218,195,0.5)","rgba(245,220,80,0.5)"]} count={12}/>

      {/* Caption */}
      <motion.div
        initial={{ opacity:0 }} animate={{ opacity:0.65 }}
        transition={{ delay:0.6, duration:0.8 }}
        style={{
          position:"absolute", bottom:"16%", width:"100%", textAlign:"center",
          fontFamily:"'Josefin Sans',sans-serif", fontSize:"9px", fontWeight:700,
          letterSpacing:"0.38em", color:"rgba(34,197,94,0.85)", textTransform:"uppercase",
          pointerEvents:"none",
        }}
      >Freshwater Wetland · O{"\u02BB"}ahu, Hawai{"\u02BB"}i</motion.div>
    </motion.div>
  );
}

// ─── SCENE 4 — Hawaiian Coot Reveal ──────────────────────────────────────────
function Scene4() {
  const innerR = 268; // must match RadialLanding inner ring
  return (
    <motion.div {...FD} style={{ position:"absolute", inset:0, overflow:"hidden" }}>
      {/* bg-photo at final bird-centred position */}
      <motion.img
        src={bgPhoto}
        initial={{ scale:1.07 }} animate={{ scale:1.0 }}
        transition={{ duration:2.2, ease:[0.16,1,0.3,1] }}
        style={{ position:"absolute", inset:0, width:"100%", height:"100%",
                 objectFit:"cover", objectPosition:"50% 42%",
                 filter:"brightness(0.92) contrast(1.08) saturate(1.12)" }}
      />
      {/* Radial vignette */}
      <div style={{
        position:"absolute", inset:0,
        background:"radial-gradient(ellipse 70% 75% at 50% 50%, transparent 40%, rgba(3,8,16,0.75) 80%, rgba(2,6,14,0.95) 100%)",
        pointerEvents:"none",
      }}/>

      {/* Orbital ring drawing in */}
      <motion.svg
        initial={{ opacity:0 }} animate={{ opacity:1 }}
        transition={{ duration:0.4, delay:0.5 }}
        style={{
          position:"absolute", left:"50%", top:"50%",
          transform:"translate(-50%,-50%)", overflow:"visible",
          pointerEvents:"none", width:2, height:2,
        }}
        viewBox="-1 -1 2 2"
      >
        {/* Outer glow halo */}
        <motion.circle r={innerR} fill="none"
          stroke="rgba(0,220,195,0.18)" strokeWidth="28"
          initial={{ pathLength:0, rotate:-90 }} animate={{ pathLength:1 }}
          transition={{ duration:1.6, delay:0.6, ease:[0.4,0,0.2,1] }}
          style={{ transformOrigin:"0px 0px" }}
        />
        {/* Main ring */}
        <motion.circle r={innerR} fill="none"
          stroke="rgba(0,238,212,0.90)" strokeWidth="2.5"
          initial={{ pathLength:0, rotate:-90 }} animate={{ pathLength:1 }}
          transition={{ duration:1.6, delay:0.6, ease:[0.4,0,0.2,1] }}
          style={{ transformOrigin:"0px 0px" }}
        />
        {/* Specular highlight */}
        <motion.circle r={innerR} fill="none"
          stroke="rgba(200,255,248,0.45)" strokeWidth="0.9"
          initial={{ pathLength:0, rotate:-90 }} animate={{ pathLength:1 }}
          transition={{ duration:1.4, delay:0.8, ease:[0.4,0,0.2,1] }}
          style={{ transformOrigin:"0px 0px" }}
        />
        {/* Leading dot glow */}
        <motion.circle r="10" fill="rgba(0,238,212,0.85)"
          initial={{ opacity:0, pathOffset:0 }}
          animate={{ opacity:[0,1,1,0] }}
          transition={{ duration:1.6, delay:0.6, times:[0,0.05,0.9,1] }}
        />
      </motion.svg>

      {/* Glow particles */}
      <Particles colors={["rgba(0,218,195,0.7)","rgba(34,197,94,0.6)","rgba(245,220,80,0.5)"]} count={10}/>

      {/* Species name fades in late */}
      <motion.div
        initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
        transition={{ delay:1.4, duration:0.8 }}
        style={{
          position:"absolute", bottom:"24%", width:"100%", textAlign:"center",
          pointerEvents:"none",
        }}
      >
        <div style={{
          fontFamily:"'Josefin Sans',sans-serif", fontSize:"clamp(11px,1.2vw,16px)",
          fontWeight:700, letterSpacing:"0.38em", color:"rgba(0,218,195,0.90)",
          textTransform:"uppercase",
          textShadow:"0 0 20px rgba(0,218,195,0.70), 0 1px 8px rgba(0,0,0,0.9)",
        }}>
          Hawaiian Coot · {"\u02BBalae ke\u02BBoke\u02BBo"}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── SCENE 5 — Homepage Activation flash ─────────────────────────────────────
function Scene5() {
  return (
    <motion.div
      initial={{ opacity:1 }} animate={{ opacity:0 }}
      transition={{ duration:0.85, ease:"easeInOut" }}
      style={{ position:"absolute", inset:0, background:"#030810", pointerEvents:"none" }}
    >
      {/* Teal flash */}
      <motion.div
        initial={{ opacity:0 }} animate={{ opacity:[0, 0.22, 0] }}
        transition={{ duration:0.7, times:[0,0.3,1] }}
        style={{ position:"absolute", inset:0, background:"rgba(0,238,212,0.25)" }}
      />
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function CinematicIntro({ onComplete }: Props) {
  const [scene,   setScene]   = useState(1);
  const [closing, setClosing] = useState(false);

  const finish = useCallback(() => {
    setClosing(true);
    setTimeout(onComplete, 650);
  }, [onComplete]);

  const skip = useCallback(() => finish(), [finish]);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    let elapsed = 0;
    SCENE_MS.forEach((dur, i) => {
      elapsed += dur;
      if (i < 4) timers.push(setTimeout(() => setScene(i + 2), elapsed));
      else        timers.push(setTimeout(finish, elapsed));
    });
    return () => timers.forEach(clearTimeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <style>{STYLES}</style>
      <motion.div
        animate={closing ? { opacity:0 } : { opacity:1 }}
        transition={{ duration:0.65, ease:"easeInOut" }}
        style={{ position:"fixed", inset:0, zIndex:9990, background:"#010507", overflow:"hidden" }}
      >
        <AnimatePresence mode="sync">
          {scene === 1 && <Scene1 key="s1"/>}
          {scene === 2 && <Scene2 key="s2"/>}
          {scene === 3 && <Scene3 key="s3"/>}
          {scene === 4 && <Scene4 key="s4"/>}
          {scene === 5 && <Scene5 key="s5"/>}
        </AnimatePresence>

        {/* Skip button */}
        <motion.button
          initial={{ opacity:0 }}
          animate={{ opacity:0.55 }}
          whileHover={{ opacity:1 }}
          transition={{ delay:0.8, duration:0.5 }}
          onClick={skip}
          style={{
            position:"absolute", top:"18px", right:"22px", zIndex:10,
            background:"rgba(0,238,212,0.08)",
            border:"1px solid rgba(0,238,212,0.30)",
            borderRadius:"6px", padding:"6px 14px",
            fontFamily:"'Josefin Sans',sans-serif", fontSize:"9px", fontWeight:700,
            letterSpacing:"0.3em", color:"rgba(0,238,212,0.90)", textTransform:"uppercase",
            cursor:"pointer",
          }}
        >Skip Intro ›</motion.button>
      </motion.div>
    </>
  );
}
