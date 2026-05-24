/**
 * CinematicIntro — Hawaiian Coot · Cooper Middle School Science Project
 *
 * 60-second YouTube aerial drone footage opening.
 * Bird call audio (XC342210 MP3) fades in at ~10 s.
 * Timed caption cards: nature documentary → project attribution → team reveal.
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import birdCallSrc from "@assets/XC342210_-_Hawaiian_Coot_-_Fulica_alai_1779638749861.mp3";

// ─── Config ───────────────────────────────────────────────────────────────────
const VIDEO_ID  = "AWpvNtoG5nU";
const START_SEC = 2244;
const TOTAL_SEC = 62;

const BIRD_CALL_START = 10;
const BIRD_CALL_VOL   = 0.40;

// ─── CSS ─────────────────────────────────────────────────────────────────────
const STYLES = `
  @keyframes ci-grain {
    0%{transform:translate(0,0)} 10%{transform:translate(-2%,-3%)}
    20%{transform:translate(2%,2%)} 30%{transform:translate(-3%,1%)}
    40%{transform:translate(3%,-2%)} 50%{transform:translate(-1%,3%)}
    60%{transform:translate(1%,-3%)} 70%{transform:translate(-3%,-1%)}
    80%{transform:translate(3%,2%)} 90%{transform:translate(-2%,-3%)}
    100%{transform:translate(0,0)}
  }
  @keyframes ci-orb {
    0%,100%{transform:translateY(0) scale(1); opacity:.55}
    50%{transform:translateY(-18px) scale(1.15); opacity:.85}
  }
  @keyframes ci-shimmer {
    0%,100%{opacity:.4} 50%{opacity:1}
  }
`;

// ─── Shared helpers ───────────────────────────────────────────────────────────
const ease = [0.16, 1, 0.3, 1] as const;

function Grain() {
  return (
    <div style={{
      position:"absolute", inset:"-10%", width:"120%", height:"120%",
      opacity:0.05, pointerEvents:"none", zIndex:18,
      backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      backgroundSize:"180px 180px",
      animation:"ci-grain 0.3s steps(1) infinite",
    }}/>
  );
}

function Letterbox() {
  return (
    <>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:"10.5%", background:"#000", zIndex:20, pointerEvents:"none" }}/>
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"10.5%", background:"#000", zIndex:20, pointerEvents:"none" }}/>
    </>
  );
}

// ─── Decorative rule with optional diamond ────────────────────────────────────
function Rule({ color="rgba(0,218,195,0.65)", width="60px", diamond=false }:
               { color?:string; width?:string; diamond?:boolean }) {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"8px", margin:"12px auto" }}>
      <div style={{ height:"1px", width:width, background:color }}/>
      {diamond && <div style={{ width:"5px", height:"5px", background:color, transform:"rotate(45deg)" }}/>}
      {diamond && <div style={{ height:"1px", width:width, background:color }}/>}
    </div>
  );
}

// ─── 1. Lower-third NatGeo caption ───────────────────────────────────────────
function LowerThird({ top, sub }: { top:string; sub:string }) {
  return (
    <motion.div
      initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }}
      exit={{ opacity:0, x:-10 }}
      transition={{ duration:0.75, ease }}
      style={{ position:"absolute", left:"5%", bottom:"14%", zIndex:15, pointerEvents:"none" }}
    >
      <div style={{ display:"flex", alignItems:"stretch" }}>
        <motion.div
          initial={{ scaleY:0 }} animate={{ scaleY:1 }}
          transition={{ duration:0.4, ease }}
          style={{ width:"3px", background:"rgba(0,218,195,0.88)", marginRight:"12px", borderRadius:"1px", transformOrigin:"top" }}
        />
        <div>
          <div style={{
            fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontWeight:700,
            fontSize:"clamp(18px,2.4vw,34px)", color:"#fff", lineHeight:1.15,
            textShadow:"0 2px 28px rgba(0,0,0,0.98), 0 0 60px rgba(0,0,0,0.92)",
          }}>{top}</div>
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }}
            transition={{ delay:0.3, duration:0.6 }}
            style={{
              fontFamily:"'Josefin Sans',sans-serif", fontSize:"clamp(8px,0.88vw,12px)",
              fontWeight:700, letterSpacing:"0.32em", color:"rgba(0,218,195,0.90)",
              textTransform:"uppercase", marginTop:"6px",
              textShadow:"0 1px 14px rgba(0,0,0,0.95)",
            }}
          >{sub}</motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── 2. Cinematic center quote ────────────────────────────────────────────────
function CenterQuote({ quote }: { quote:string }) {
  const lines = quote.split("\n");
  return (
    <motion.div
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      transition={{ duration:0.9, ease:"easeInOut" }}
      style={{
        position:"absolute", inset:0, zIndex:15, pointerEvents:"none",
        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      }}
    >
      {/* Ambient glow */}
      <div style={{
        position:"absolute", width:"500px", height:"200px",
        background:"radial-gradient(ellipse, rgba(0,218,195,0.10) 0%, transparent 70%)",
        pointerEvents:"none",
      }}/>

      {lines.map((line,i)=>(
        <motion.div key={i}
          initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:0.15*i+0.2, duration:0.85, ease }}
          style={{
            fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontWeight:700,
            fontSize:"clamp(24px,3.8vw,54px)", lineHeight:1.18,
            textShadow:"0 2px 50px rgba(0,0,0,0.98), 0 0 100px rgba(0,0,0,0.9)",
            background:"linear-gradient(135deg, #fff 0%, rgba(200,255,248,0.92) 55%, #fff 100%)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
            backgroundClip:"text",
          }}
        >{line}</motion.div>
      ))}

      <motion.div
        initial={{ scaleX:0 }} animate={{ scaleX:1 }}
        transition={{ delay:0.7, duration:0.8 }}
        style={{
          width:"70px", height:"1.5px", marginTop:"16px",
          background:"linear-gradient(90deg, transparent, rgba(0,218,195,0.80), transparent)",
          transformOrigin:"center",
        }}
      />
    </motion.div>
  );
}

// ─── 3. School & Project card ─────────────────────────────────────────────────
function SchoolCard() {
  return (
    <motion.div
      initial={{ opacity:0, scale:0.94 }} animate={{ opacity:1, scale:1 }}
      exit={{ opacity:0, scale:0.97 }}
      transition={{ duration:1.0, ease }}
      style={{
        position:"absolute", inset:0, zIndex:15, pointerEvents:"none",
        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      }}
    >
      {/* Glassy backdrop panel */}
      <motion.div
        initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
        transition={{ delay:0.2, duration:0.9, ease }}
        style={{
          background:"linear-gradient(145deg, rgba(2,14,32,0.82) 0%, rgba(4,22,48,0.78) 100%)",
          border:"1px solid rgba(0,218,195,0.22)",
          borderRadius:"4px",
          backdropFilter:"blur(12px)",
          padding:"clamp(22px,3.5vw,44px) clamp(32px,5vw,70px)",
          textAlign:"center",
          boxShadow:"0 4px 80px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.06)",
          maxWidth:"580px", width:"88%",
        }}
      >
        {/* Small label */}
        <motion.div
          initial={{ opacity:0 }} animate={{ opacity:1 }}
          transition={{ delay:0.5, duration:0.6 }}
          style={{
            fontFamily:"'Josefin Sans',sans-serif", fontSize:"clamp(7px,0.80vw,10px)",
            fontWeight:700, letterSpacing:"0.40em", color:"rgba(0,218,195,0.75)",
            textTransform:"uppercase", marginBottom:"14px",
          }}
        >A Science Project</motion.div>

        {/* Gradient title */}
        <motion.div
          initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:0.65, duration:0.85, ease }}
          style={{
            fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontWeight:700,
            fontSize:"clamp(28px,4.2vw,60px)", lineHeight:1.10,
            background:"linear-gradient(135deg, #fff 0%, rgba(0,218,195,0.95) 50%, #fff 100%)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
            textShadow:"none",
          }}
        >Endangered Species</motion.div>

        {/* Ornamental divider */}
        <motion.div
          initial={{ opacity:0 }} animate={{ opacity:1 }}
          transition={{ delay:0.95, duration:0.5 }}
        >
          <Rule diamond width="48px"/>
        </motion.div>

        {/* School name */}
        <motion.div
          initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:1.05, duration:0.7, ease }}
          style={{
            fontFamily:"'Josefin Sans',sans-serif", fontWeight:700,
            fontSize:"clamp(12px,1.4vw,19px)", letterSpacing:"0.18em",
            textTransform:"uppercase", color:"rgba(255,255,255,0.88)",
          }}
        >Cooper Middle School</motion.div>

        {/* Subject tag */}
        <motion.div
          initial={{ opacity:0 }} animate={{ opacity:1 }}
          transition={{ delay:1.25, duration:0.6 }}
          style={{
            fontFamily:"'Josefin Sans',sans-serif",
            fontSize:"clamp(7px,0.78vw,10px)", fontWeight:700,
            letterSpacing:"0.28em", color:"rgba(0,218,195,0.60)",
            textTransform:"uppercase", marginTop:"8px",
          }}
        >Science · 2026</motion.div>

        {/* Decorative corner accents */}
        {[["top","left"],["top","right"],["bottom","left"],["bottom","right"]].map(([v,h],i)=>(
          <div key={i} style={{
            position:"absolute", [v]:"8px", [h]:"8px",
            width:"12px", height:"12px",
            borderTop: v==="top" ? "1.5px solid rgba(0,218,195,0.45)" : "none",
            borderBottom: v==="bottom" ? "1.5px solid rgba(0,218,195,0.45)" : "none",
            borderLeft:  h==="left"  ? "1.5px solid rgba(0,218,195,0.45)" : "none",
            borderRight: h==="right" ? "1.5px solid rgba(0,218,195,0.45)" : "none",
          }}/>
        ))}
      </motion.div>

      {/* Floating teal orbs */}
      {[{x:-220,y:-60,s:6,d:2.8},{x:210,y:-40,s:4,d:3.4},{x:-180,y:80,s:5,d:2.2},{x:200,y:70,s:3,d:3.1}].map((o,i)=>(
        <div key={i} style={{
          position:"absolute",
          left:"50%", top:"50%",
          width:`${o.s}px`, height:`${o.s}px`,
          borderRadius:"50%",
          background:"rgba(0,218,195,0.65)",
          transform:`translate(calc(-50% + ${o.x}px), calc(-50% + ${o.y}px))`,
          animation:`ci-orb ${o.d}s ${i*0.3}s ease-in-out infinite`,
          boxShadow:"0 0 8px rgba(0,218,195,0.5)",
        }}/>
      ))}
    </motion.div>
  );
}

// ─── 4. Team / teacher card ───────────────────────────────────────────────────
const STUDENTS = ["Hannah Shiv", "Chloe Pan", "Baram Oustad"];

function TeamCard() {
  return (
    <motion.div
      initial={{ opacity:0, scale:0.94 }} animate={{ opacity:1, scale:1 }}
      exit={{ opacity:0 }} transition={{ duration:0.9, ease }}
      style={{
        position:"absolute", inset:0, zIndex:15, pointerEvents:"none",
        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      }}
    >
      <motion.div
        initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }}
        transition={{ delay:0.15, duration:0.9, ease }}
        style={{
          background:"linear-gradient(145deg, rgba(2,14,32,0.82) 0%, rgba(4,22,48,0.78) 100%)",
          border:"1px solid rgba(0,218,195,0.20)",
          borderRadius:"4px", backdropFilter:"blur(12px)",
          padding:"clamp(22px,3.5vw,44px) clamp(36px,5.5vw,76px)",
          textAlign:"center",
          boxShadow:"0 4px 80px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.05)",
          maxWidth:"560px", width:"88%",
        }}
      >
        {/* "Presented by" label */}
        <motion.div
          initial={{ opacity:0 }} animate={{ opacity:1 }}
          transition={{ delay:0.4, duration:0.6 }}
          style={{
            fontFamily:"'Josefin Sans',sans-serif", fontSize:"clamp(7px,0.80vw,10px)",
            fontWeight:700, letterSpacing:"0.40em", color:"rgba(0,218,195,0.70)",
            textTransform:"uppercase", marginBottom:"16px",
          }}
        >Presented by</motion.div>

        {/* Student names — staggered */}
        {STUDENTS.map((name, i) => (
          <motion.div key={name}
            initial={{ opacity:0, x:-14 }} animate={{ opacity:1, x:0 }}
            transition={{ delay:0.55 + i*0.20, duration:0.75, ease }}
            style={{
              fontFamily:"'Playfair Display',serif", fontStyle:"italic",
              fontSize:"clamp(17px,2.2vw,30px)", fontWeight:700,
              lineHeight:1.35,
              background:"linear-gradient(100deg, #fff 10%, rgba(200,255,248,0.90) 55%, #fff 90%)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
              backgroundClip:"text",
            }}
          >{name}</motion.div>
        ))}

        {/* Divider */}
        <motion.div
          initial={{ opacity:0 }} animate={{ opacity:1 }}
          transition={{ delay:1.2, duration:0.5 }}
        >
          <Rule diamond width="40px"/>
        </motion.div>

        {/* "Under the guidance of" */}
        <motion.div
          initial={{ opacity:0 }} animate={{ opacity:1 }}
          transition={{ delay:1.35, duration:0.6 }}
          style={{
            fontFamily:"'Josefin Sans',sans-serif", fontSize:"clamp(7px,0.78vw,10px)",
            fontWeight:700, letterSpacing:"0.32em", color:"rgba(0,218,195,0.65)",
            textTransform:"uppercase", marginBottom:"8px",
          }}
        >Under the guidance of</motion.div>

        {/* Teacher name */}
        <motion.div
          initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:1.5, duration:0.75, ease }}
          style={{
            fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontWeight:700,
            fontSize:"clamp(16px,2.0vw,26px)",
            background:"linear-gradient(100deg, #fff 10%, rgba(0,218,195,0.95) 55%, #fff 90%)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
            backgroundClip:"text",
          }}
        >Calliandra Harris</motion.div>

        {/* Teacher title */}
        <motion.div
          initial={{ opacity:0 }} animate={{ opacity:1 }}
          transition={{ delay:1.75, duration:0.6 }}
          style={{
            fontFamily:"'Josefin Sans',sans-serif",
            fontSize:"clamp(7px,0.75vw,10px)", fontWeight:700,
            letterSpacing:"0.26em", color:"rgba(0,218,195,0.55)",
            textTransform:"uppercase", marginTop:"6px",
          }}
        >Science Teacher · Cooper Middle School</motion.div>

        {/* Corner accents */}
        {[["top","left"],["top","right"],["bottom","left"],["bottom","right"]].map(([v,h],i)=>(
          <div key={i} style={{
            position:"absolute", [v]:"8px", [h]:"8px",
            width:"12px", height:"12px",
            borderTop: v==="top"    ? "1.5px solid rgba(0,218,195,0.40)" : "none",
            borderBottom: v==="bottom" ? "1.5px solid rgba(0,218,195,0.40)" : "none",
            borderLeft:  h==="left"   ? "1.5px solid rgba(0,218,195,0.40)" : "none",
            borderRight: h==="right"  ? "1.5px solid rgba(0,218,195,0.40)" : "none",
          }}/>
        ))}
      </motion.div>

      {/* Floating orbs */}
      {[{x:-230,y:-50,s:5,d:3.0},{x:220,y:-60,s:4,d:2.6},{x:-190,y:70,s:6,d:3.5},{x:210,y:80,s:3,d:2.9}].map((o,i)=>(
        <div key={i} style={{
          position:"absolute", left:"50%", top:"50%",
          width:`${o.s}px`, height:`${o.s}px`, borderRadius:"50%",
          background:"rgba(0,218,195,0.60)",
          transform:`translate(calc(-50% + ${o.x}px), calc(-50% + ${o.y}px))`,
          animation:`ci-orb ${o.d}s ${i*0.35}s ease-in-out infinite`,
          boxShadow:"0 0 8px rgba(0,218,195,0.45)",
        }}/>
      ))}
    </motion.div>
  );
}

// ─── Bird call badge ──────────────────────────────────────────────────────────
function BirdCallBadge() {
  return (
    <motion.div
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      transition={{ duration:0.7 }}
      style={{
        position:"absolute", right:"5%", bottom:"14%", zIndex:15,
        display:"flex", alignItems:"center", gap:"5px", pointerEvents:"none",
      }}
    >
      {[0,0.15,0.32,0.15,0].map((h,i)=>(
        <motion.div key={i}
          animate={{ scaleY:[1, 1+h*5, 1] }}
          transition={{ duration:0.65, delay:i*0.09, repeat:Infinity, repeatType:"mirror" }}
          style={{
            width:"3px", height:"13px", borderRadius:"2px",
            background:"rgba(0,218,195,0.72)", transformOrigin:"bottom",
          }}
        />
      ))}
      <span style={{
        fontFamily:"'Josefin Sans',sans-serif", fontSize:"8px", fontWeight:700,
        letterSpacing:"0.22em", color:"rgba(0,218,195,0.55)", textTransform:"uppercase", marginLeft:"4px",
      }}>Hawaiian Coot call</span>
    </motion.div>
  );
}

// ─── Caption data ─────────────────────────────────────────────────────────────
type Card =
  | { kind:"lower";  in:number; out:number; top:string; sub:string }
  | { kind:"quote";  in:number; out:number; quote:string }
  | { kind:"school"; in:number; out:number }
  | { kind:"team";   in:number; out:number };

const CARDS: Card[] = [
  { kind:"lower",  in:0,  out:7,  top:"Hawaiian Islands",   sub:"Pacific Ocean · Aerial View" },
  { kind:"quote",  in:9,  out:17, quote:"Every Wetland\nTells a Story" },
  { kind:"lower",  in:19, out:26, top:"Freshwater Wetland", sub:"Hawai\u02BBi · Protected Ecosystem" },
  { kind:"lower",  in:28, out:36, top:"Hawaiian Coot",      sub:"\u02BBalae ke\u02BBoke\u02BBo  \u00B7  Fulica alai" },
  { kind:"school", in:38, out:50 },
  { kind:"team",   in:52, out:62 },
];

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useElapsed() {
  const [elapsed, setElapsed] = useState(0);
  const t0 = useRef(Date.now());
  useEffect(() => {
    const id = setInterval(() => setElapsed(Math.floor((Date.now()-t0.current)/1000)), 500);
    return () => clearInterval(id);
  }, []);
  return elapsed;
}

function useBirdCall(elapsed: number) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const triggered = useRef(false);

  useEffect(() => {
    if (elapsed < BIRD_CALL_START || triggered.current) return;
    triggered.current = true;

    const audio = new Audio(birdCallSrc as string);
    audio.loop = true;
    audio.volume = 0;
    audioRef.current = audio;

    audio.play()
      .then(() => {
        setPlaying(true);
        const start = Date.now();
        const ramp = () => {
          const t = (Date.now()-start)/2000;
          audio.volume = Math.min(BIRD_CALL_VOL*t, BIRD_CALL_VOL);
          if (t < 1) requestAnimationFrame(ramp);
        };
        requestAnimationFrame(ramp);
      })
      .catch(() => {});

    return () => { audio.pause(); };
  }, [elapsed >= BIRD_CALL_START]);  // eslint-disable-line react-hooks/exhaustive-deps

  return playing;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
interface Props { onComplete: () => void }

export function CinematicIntro({ onComplete }: Props) {
  const elapsed   = useElapsed();
  const birdAudio = useBirdCall(elapsed);
  const [closing, setClosing] = useState(false);

  const finish = useCallback(() => {
    if (closing) return;
    setClosing(true);
    setTimeout(onComplete, 950);
  }, [closing, onComplete]);

  useEffect(() => { if (elapsed >= TOTAL_SEC) finish(); }, [elapsed, finish]);

  const activeCard = CARDS.find(c => elapsed >= c.in && elapsed < c.out) ?? null;
  const fadingOut  = elapsed >= TOTAL_SEC - 3;

  const embedSrc =
    `https://www.youtube.com/embed/${VIDEO_ID}` +
    `?autoplay=1&mute=1&controls=0&showinfo=0&rel=0` +
    `&modestbranding=1&iv_load_policy=3&disablekb=1` +
    `&start=${START_SEC}&enablejsapi=0`;

  return (
    <>
      <style>{STYLES}</style>

      <motion.div
        animate={closing ? { opacity:0 } : { opacity:1 }}
        transition={{ duration:0.9, ease:"easeInOut" }}
        style={{ position:"fixed", inset:0, zIndex:9990, background:"#000", overflow:"hidden" }}
      >
        {/* YouTube iframe — scaled to crop UI chrome */}
        <iframe
          src={embedSrc}
          allow="autoplay; fullscreen"
          allowFullScreen
          style={{
            position:"absolute",
            top:"-10%", left:"-2%", width:"104%", height:"120%",
            border:"none", pointerEvents:"none",
          }}
          title="Hawaiian Islands aerial footage"
        />

        {/* Vignette */}
        <div style={{
          position:"absolute", inset:0, pointerEvents:"none", zIndex:5,
          background:[
            "radial-gradient(ellipse 82% 82% at 50% 50%, transparent 40%, rgba(0,0,0,0.42) 78%, rgba(0,0,0,0.68) 100%)",
            "linear-gradient(to bottom, rgba(0,0,0,0.52) 0%, transparent 18%, transparent 76%, rgba(0,0,0,0.62) 100%)",
          ].join(","),
        }}/>

        {/* Fade-to-dark + species reveal */}
        <motion.div
          initial={{ opacity:0 }}
          animate={{ opacity: fadingOut ? 1 : 0 }}
          transition={{ duration:2.8, ease:"easeInOut" }}
          style={{ position:"absolute", inset:0, background:"#030810", zIndex:16, pointerEvents:"none" }}
        >
          {fadingOut && (
            <motion.div
              initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:0.9, delay:0.4 }}
              style={{
                position:"absolute", inset:0,
                display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
              }}
            >
              <div style={{
                fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontWeight:700,
                fontSize:"clamp(22px,3vw,44px)", lineHeight:1.2,
                background:"linear-gradient(135deg, #fff 0%, rgba(0,218,195,0.90) 55%, #fff 100%)",
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
                textAlign:"center",
              }}>Hawaiian Coot</div>
              <div style={{
                fontFamily:"'Josefin Sans',sans-serif", fontSize:"clamp(8px,0.9vw,12px)",
                fontWeight:700, letterSpacing:"0.34em", color:"rgba(0,218,195,0.80)",
                textTransform:"uppercase", marginTop:"10px",
              }}>{"\u02BBalae ke\u02BBoke\u02BBo"} · Fulica alai</div>
              <div style={{ width:"54px", height:"1.5px", margin:"14px auto 0", background:"rgba(0,218,195,0.55)" }}/>
            </motion.div>
          )}
        </motion.div>

        {/* Caption overlay */}
        <AnimatePresence mode="wait">
          {activeCard && !fadingOut && (() => {
            switch(activeCard.kind) {
              case "lower":  return <LowerThird key={activeCard.in} top={activeCard.top} sub={activeCard.sub}/>;
              case "quote":  return <CenterQuote key={activeCard.in} quote={activeCard.quote}/>;
              case "school": return <SchoolCard key="school"/>;
              case "team":   return <TeamCard key="team"/>;
            }
          })()}
        </AnimatePresence>

        {/* Bird call badge */}
        <AnimatePresence>
          {birdAudio && !fadingOut && <BirdCallBadge key="bird"/>}
        </AnimatePresence>

        {/* Progress bar (inside bottom letterbox) */}
        <div style={{
          position:"absolute", bottom:"10.5%", left:0, right:0, height:"2px",
          background:"rgba(255,255,255,0.08)", zIndex:21, pointerEvents:"none",
        }}>
          <motion.div
            animate={{ width:`${Math.min((elapsed/TOTAL_SEC)*100,100)}%` }}
            transition={{ duration:0.5, ease:"linear" }}
            style={{ height:"100%", background:"rgba(0,218,195,0.55)", transformOrigin:"left" }}
          />
        </div>

        <Grain/>
        <Letterbox/>

        {/* Skip — inside top letterbox */}
        <motion.button
          initial={{ opacity:0 }} animate={{ opacity:0.45 }}
          whileHover={{ opacity:1 }}
          transition={{ delay:2.0, duration:0.7 }}
          onClick={finish}
          style={{
            position:"absolute", top:"3.0%", right:"20px", zIndex:25,
            background:"transparent",
            border:"1px solid rgba(255,255,255,0.28)",
            borderRadius:"4px", padding:"4px 14px",
            fontFamily:"'Josefin Sans',sans-serif", fontSize:"8.5px", fontWeight:700,
            letterSpacing:"0.28em", color:"rgba(255,255,255,0.82)", textTransform:"uppercase",
            cursor:"pointer",
          }}
        >Skip ›</motion.button>

        {/* Timecode (top-left letterbox) */}
        <div style={{
          position:"absolute", top:"2.9%", left:"20px", zIndex:25,
          fontFamily:"'Josefin Sans',sans-serif", fontSize:"8px", fontWeight:700,
          letterSpacing:"0.20em", color:"rgba(255,255,255,0.26)",
          fontVariantNumeric:"tabular-nums",
        }}>
          {String(Math.floor(elapsed/60)).padStart(2,"0")}:{String(elapsed%60).padStart(2,"0")}
        </div>
      </motion.div>
    </>
  );
}
