/**
 * CinematicIntro — Hawaiian Coot · Cooper Middle School Science Project
 *
 * 60-second YouTube aerial intro.
 * No boxes — elegant floating text on the center-right (water side).
 * All Playfair Display. Gold / white palette.
 * Names appear one at a time.
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

// ─── Gold palette ─────────────────────────────────────────────────────────────
const GOLD       = "#D4AF37";
const GOLD_LIGHT = "#F5E070";
const GOLD_DIM   = "rgba(212,175,55,0.65)";
const WHITE      = "#ffffff";
const WHITE_DIM  = "rgba(255,255,255,0.72)";

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
`;

const ease = [0.16, 1, 0.3, 1] as const;

// ─── Shared text shadow for legibility over video ─────────────────────────────
const shadow = "0 2px 40px rgba(0,0,0,0.98), 0 0 80px rgba(0,0,0,0.95), 0 4px 16px rgba(0,0,0,0.90)";

// ─── Layout anchor — center-right, vertically centred ─────────────────────────
const blockStyle: React.CSSProperties = {
  position:"absolute",
  right:"7%",
  top:"50%",
  transform:"translateY(-50%)",
  textAlign:"right",
  zIndex:15,
  pointerEvents:"none",
  maxWidth:"clamp(280px, 46%, 640px)",
};

// ─── Thin gold rule ───────────────────────────────────────────────────────────
function GoldRule({ align="right" }: { align?:"right"|"center" }) {
  return (
    <motion.div
      initial={{ scaleX:0 }} animate={{ scaleX:1 }}
      transition={{ duration:0.8, ease }}
      style={{
        height:"1px", width:"80px",
        background:`linear-gradient(to ${align==="right"?"left":"right"}, transparent, ${GOLD}, ${GOLD})`,
        marginLeft:"auto", marginTop:"14px", marginBottom:"14px",
        transformOrigin: align==="right" ? "right" : "center",
      }}
    />
  );
}

// ─── 1. Floating lower-right nature caption ───────────────────────────────────
function NatureCaption({ top, sub }: { top:string; sub:string }) {
  return (
    <motion.div
      initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
      exit={{ opacity:0, y:-8 }}
      transition={{ duration:0.85, ease }}
      style={blockStyle}
    >
      <div style={{
        fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontWeight:700,
        fontSize:"clamp(30px,4.2vw,60px)", color:WHITE, lineHeight:1.12,
        textShadow:shadow,
      }}>{top}</div>
      <GoldRule/>
      <div style={{
        fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontWeight:400,
        fontSize:"clamp(12px,1.3vw,17px)", color:GOLD,
        letterSpacing:"0.06em", textShadow:shadow,
      }}>{sub}</div>
    </motion.div>
  );
}

// ─── 2. Center quote ──────────────────────────────────────────────────────────
function CenterQuote({ quote }: { quote:string }) {
  const lines = quote.split("\n");
  return (
    <motion.div
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      transition={{ duration:1.0, ease:"easeInOut" }}
      style={{
        position:"absolute", inset:0, zIndex:15, pointerEvents:"none",
        display:"flex", flexDirection:"column",
        alignItems:"flex-end", justifyContent:"center",
        paddingRight:"7%",
      }}
    >
      {lines.map((line,i)=>(
        <motion.div key={i}
          initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}
          transition={{ delay:0.2+i*0.22, duration:0.9, ease }}
          style={{
            fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontWeight:700,
            fontSize:"clamp(32px,4.8vw,70px)", lineHeight:1.15,
            background:`linear-gradient(135deg, ${WHITE} 0%, ${GOLD_LIGHT} 55%, ${WHITE} 100%)`,
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
            backgroundClip:"text",
            textShadow:"none",
            filter:"drop-shadow(0 2px 30px rgba(0,0,0,0.98))",
          }}
        >{line}</motion.div>
      ))}
      <motion.div
        initial={{ scaleX:0 }} animate={{ scaleX:1 }}
        transition={{ delay:0.7, duration:0.8 }}
        style={{
          height:"1px", width:"90px",
          background:`linear-gradient(to left, transparent, ${GOLD})`,
          marginLeft:"auto", marginTop:"16px",
          transformOrigin:"right",
        }}
      />
    </motion.div>
  );
}

// ─── 3. Project / school text (no box) ───────────────────────────────────────
function SchoolText() {
  return (
    <motion.div
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      transition={{ duration:0.9, ease:"easeInOut" }}
      style={blockStyle}
    >
      {/* Project label */}
      <motion.div
        initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
        transition={{ delay:0.3, duration:0.8, ease }}
        style={{
          fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontWeight:400,
          fontSize:"clamp(12px,1.2vw,16px)", color:GOLD_DIM,
          letterSpacing:"0.08em", marginBottom:"8px", textShadow:shadow,
        }}
      >A Science Project</motion.div>

      {/* Main title */}
      <motion.div
        initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
        transition={{ delay:0.5, duration:0.9, ease }}
        style={{
          fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontWeight:700,
          fontSize:"clamp(38px,5.5vw,80px)", lineHeight:1.06,
          background:`linear-gradient(135deg, ${WHITE} 0%, ${GOLD_LIGHT} 45%, ${GOLD} 80%, ${GOLD_LIGHT} 100%)`,
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
          backgroundClip:"text",
          filter:"drop-shadow(0 2px 40px rgba(0,0,0,0.98))",
        }}
      >Endangered<br/>Species</motion.div>

      <GoldRule/>

      {/* School */}
      <motion.div
        initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
        transition={{ delay:1.1, duration:0.8, ease }}
        style={{
          fontFamily:"'Playfair Display',serif", fontWeight:600,
          fontSize:"clamp(16px,1.8vw,24px)", color:WHITE,
          letterSpacing:"0.03em", textShadow:shadow,
        }}
      >Cooper Middle School</motion.div>

      <motion.div
        initial={{ opacity:0 }} animate={{ opacity:1 }}
        transition={{ delay:1.5, duration:0.7 }}
        style={{
          fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontWeight:400,
          fontSize:"clamp(11px,1.1vw,15px)", color:GOLD_DIM,
          marginTop:"6px", textShadow:shadow,
        }}
      >Science · 2026</motion.div>
    </motion.div>
  );
}

// ─── 4. Single name reveal ────────────────────────────────────────────────────
function NameReveal({ name, role }: { name:string; role?:string }) {
  return (
    <motion.div
      key={name}
      initial={{ opacity:0, x:24 }} animate={{ opacity:1, x:0 }}
      exit={{ opacity:0, x:-16 }}
      transition={{ duration:0.85, ease }}
      style={blockStyle}
    >
      {role && (
        <motion.div
          initial={{ opacity:0 }} animate={{ opacity:1 }}
          transition={{ delay:0.3, duration:0.6 }}
          style={{
            fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontWeight:400,
            fontSize:"clamp(12px,1.2vw,16px)", color:GOLD_DIM,
            marginBottom:"6px", textShadow:shadow,
          }}
        >{role}</motion.div>
      )}
      <div style={{
        fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontWeight:700,
        fontSize:"clamp(34px,4.8vw,68px)", color:WHITE, lineHeight:1.10,
        textShadow:shadow,
      }}>{name}</div>
      <GoldRule/>
    </motion.div>
  );
}

// ─── Team sequence data ───────────────────────────────────────────────────────
const TEAM_BEATS: { name:string; role?:string; hold:number }[] = [
  { name:"Hannah Shiv",     role:"Student Researcher",    hold:2500 },
  { name:"Chloe Pan",       role:"Student Researcher",    hold:2500 },
  { name:"Baram Oustad",    role:"Student Researcher",    hold:2500 },
  { name:"Calliandra Harris", role:"Science Teacher",     hold:2500 },
];

function TeamSequence() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setIdx(i => Math.min(i+1, TEAM_BEATS.length-1)), TEAM_BEATS[idx]?.hold ?? 2500);
    return () => clearTimeout(timer);
  }, [idx]);

  const beat = TEAM_BEATS[idx];
  return (
    <AnimatePresence mode="wait">
      <NameReveal key={beat.name} name={beat.name} role={beat.role}/>
    </AnimatePresence>
  );
}

// ─── Caption schedule ─────────────────────────────────────────────────────────
type Card =
  | { kind:"nature"; in:number; out:number; top:string; sub:string }
  | { kind:"quote";  in:number; out:number; quote:string }
  | { kind:"school"; in:number; out:number }
  | { kind:"team";   in:number; out:number };

const CARDS: Card[] = [
  { kind:"nature", in:0,  out:7,  top:"Hawaiian Islands",   sub:"Pacific Ocean · Aerial View" },
  { kind:"quote",  in:9,  out:17, quote:"Every Wetland\nTells a Story" },
  { kind:"nature", in:19, out:26, top:"Freshwater Wetland", sub:"Hawai\u02BBi · Protected Ecosystem" },
  { kind:"nature", in:28, out:36, top:"Hawaiian Coot",      sub:"\u02BBalae ke\u02BBoke\u02BBo  ·  Fulica alai" },
  { kind:"school", in:38, out:50 },
  { kind:"team",   in:52, out:62 },
];

// ─── Film grain ───────────────────────────────────────────────────────────────
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

// ─── Letterbox — tall enough to bury YouTube overlays ────────────────────────
function Letterbox() {
  return (
    <>
      {/* Top bar — deliberately deep to cover YouTube's ad/info overlay */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:"16%", background:"#000", zIndex:20, pointerEvents:"none" }}/>
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"10%", background:"#000", zIndex:20, pointerEvents:"none" }}/>
    </>
  );
}

// ─── Bird call badge ──────────────────────────────────────────────────────────
function BirdCallBadge() {
  return (
    <motion.div
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      transition={{ duration:0.7 }}
      style={{
        position:"absolute", right:"7%", bottom:"13%", zIndex:15,
        display:"flex", alignItems:"center", gap:"5px", pointerEvents:"none",
        justifyContent:"flex-end",
      }}
    >
      {[0, 0.14, 0.30, 0.14, 0].map((h,i)=>(
        <motion.div key={i}
          animate={{ scaleY:[1, 1+h*5, 1] }}
          transition={{ duration:0.65, delay:i*0.09, repeat:Infinity, repeatType:"mirror" }}
          style={{
            width:"2.5px", height:"11px", borderRadius:"2px",
            background:GOLD_DIM, transformOrigin:"bottom",
          }}
        />
      ))}
      <span style={{
        fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontWeight:400,
        fontSize:"clamp(10px,0.9vw,13px)", color:GOLD_DIM, marginLeft:"5px",
      }}>Hawaiian Coot call</span>
    </motion.div>
  );
}

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useElapsed() {
  const [elapsed, setElapsed] = useState(0);
  const t0 = useRef(Date.now());
  useEffect(() => {
    const id = setInterval(() => setElapsed(Math.floor((Date.now()-t0.current)/1000)), 400);
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
    audio.loop = true; audio.volume = 0;
    audioRef.current = audio;
    audio.play().then(() => {
      setPlaying(true);
      const start = Date.now();
      const ramp = () => {
        const t = (Date.now()-start)/2000;
        audio.volume = Math.min(BIRD_CALL_VOL*t, BIRD_CALL_VOL);
        if (t < 1) requestAnimationFrame(ramp);
      };
      requestAnimationFrame(ramp);
    }).catch(()=>{});
    return () => { audio.pause(); };
  }, [elapsed >= BIRD_CALL_START]); // eslint-disable-line
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
        transition={{ duration:0.95, ease:"easeInOut" }}
        style={{ position:"fixed", inset:0, zIndex:9990, background:"#000", overflow:"hidden" }}
      >
        {/* YouTube iframe — cropped aggressively at top to hide ad overlays */}
        <iframe
          src={embedSrc}
          allow="autoplay; fullscreen"
          allowFullScreen
          style={{
            position:"absolute",
            top:"-22%", left:"-2%",
            width:"104%", height:"144%",
            border:"none", pointerEvents:"none",
          }}
          title="Hawaiian Islands aerial footage"
        />

        {/* Gradient vignette — right side lighter so text pops */}
        <div style={{
          position:"absolute", inset:0, pointerEvents:"none", zIndex:5,
          background:[
            "linear-gradient(to right, rgba(0,0,0,0.28) 0%, transparent 38%, rgba(0,0,0,0.42) 80%, rgba(0,0,0,0.62) 100%)",
            "linear-gradient(to bottom, rgba(0,0,0,0.52) 0%, transparent 20%, transparent 76%, rgba(0,0,0,0.60) 100%)",
          ].join(","),
        }}/>

        {/* Fade-to-dark */}
        <motion.div
          initial={{ opacity:0 }}
          animate={{ opacity: fadingOut ? 1 : 0 }}
          transition={{ duration:2.6, ease:"easeInOut" }}
          style={{ position:"absolute", inset:0, background:"#030810", zIndex:16, pointerEvents:"none" }}
        >
          {fadingOut && (
            <motion.div
              initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}
              transition={{ duration:1.0, delay:0.4, ease }}
              style={{
                position:"absolute", right:"7%", top:"50%", transform:"translateY(-50%)",
                textAlign:"right",
              }}
            >
              <div style={{
                fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontWeight:700,
                fontSize:"clamp(30px,4.2vw,60px)", lineHeight:1.1,
                background:`linear-gradient(135deg, ${WHITE} 0%, ${GOLD_LIGHT} 50%, ${WHITE} 100%)`,
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
                backgroundClip:"text",
              }}>Hawaiian Coot</div>
              <div style={{
                fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontWeight:400,
                fontSize:"clamp(13px,1.3vw,18px)", color:GOLD, marginTop:"10px",
              }}>{"\u02BBalae ke\u02BBoke\u02BBo"} · Fulica alai</div>
              <div style={{
                height:"1px", width:"80px", marginLeft:"auto", marginTop:"14px",
                background:`linear-gradient(to left, transparent, ${GOLD})`,
              }}/>
            </motion.div>
          )}
        </motion.div>

        {/* Caption overlay */}
        <AnimatePresence mode="wait">
          {activeCard && !fadingOut && (() => {
            switch(activeCard.kind) {
              case "nature": return <NatureCaption key={activeCard.in} top={activeCard.top} sub={activeCard.sub}/>;
              case "quote":  return <CenterQuote   key={activeCard.in} quote={activeCard.quote}/>;
              case "school": return <SchoolText    key="school"/>;
              case "team":   return <TeamSequence  key="team"/>;
            }
          })()}
        </AnimatePresence>

        {/* Bird call badge */}
        <AnimatePresence>
          {birdAudio && !fadingOut && <BirdCallBadge key="bird"/>}
        </AnimatePresence>

        {/* Progress bar (inside bottom letterbox) */}
        <div style={{
          position:"absolute", bottom:"10%", left:0, right:0, height:"2px",
          background:"rgba(255,255,255,0.07)", zIndex:21, pointerEvents:"none",
        }}>
          <motion.div
            animate={{ width:`${Math.min((elapsed/TOTAL_SEC)*100,100)}%` }}
            transition={{ duration:0.4, ease:"linear" }}
            style={{ height:"100%", background:GOLD_DIM, transformOrigin:"left" }}
          />
        </div>

        <Grain/>
        <Letterbox/>

        {/* Skip — top-right, inside letterbox */}
        <motion.button
          initial={{ opacity:0 }} animate={{ opacity:0.40 }}
          whileHover={{ opacity:1 }}
          transition={{ delay:2.5, duration:0.7 }}
          onClick={finish}
          style={{
            position:"absolute", top:"4.5%", right:"20px", zIndex:25,
            background:"transparent",
            border:`1px solid ${GOLD_DIM}`,
            borderRadius:"2px", padding:"4px 14px",
            fontFamily:"'Playfair Display',serif", fontStyle:"italic",
            fontSize:"12px", color:WHITE_DIM,
            cursor:"pointer",
          }}
        >Skip ›</motion.button>

        {/* Timecode */}
        <div style={{
          position:"absolute", top:"5.5%", left:"22px", zIndex:25,
          fontFamily:"'Playfair Display',serif", fontStyle:"italic",
          fontSize:"11px", color:"rgba(255,255,255,0.22)",
          fontVariantNumeric:"tabular-nums",
        }}>
          {String(Math.floor(elapsed/60)).padStart(2,"0")}:{String(elapsed%60).padStart(2,"0")}
        </div>

      </motion.div>
    </>
  );
}
