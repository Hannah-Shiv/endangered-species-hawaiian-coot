/**
 * CinematicIntro — Hawaiian Coot website opening sequence
 *
 * Full-screen YouTube aerial drone video (Hawaii footage) for ~30 s.
 * Bird call audio (XC342210 MP3) fades in at ~10 s.
 * Timed caption overlays + letterbox bars + subtle vignette.
 * Fades to dark and reveals the homepage after 30 s (skippable).
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import birdCallSrc from "@assets/XC342210_-_Hawaiian_Coot_-_Fulica_alai_1779638749861.mp3";

// ─── Config ───────────────────────────────────────────────────────────────────
const VIDEO_ID  = "AWpvNtoG5nU";
const START_SEC = 2244;           // timestamp the user linked
const TOTAL_SEC = 32;             // how long before homepage reveals

// Timed caption cards (elapsed seconds)
type CaptionCard =
  | { in:number; out:number; kind:"lower"; top:string; sub:string }
  | { in:number; out:number; kind:"center"; quote:string; rule?:boolean };

const CAPTIONS: CaptionCard[] = [
  { in:0,  out:6,  kind:"lower",  top:"Hawaiian Islands", sub:"Pacific Ocean · Aerial View" },
  { in:8,  out:15, kind:"center", quote:"Every Wetland\nTells a Story", rule:true },
  { in:17, out:23, kind:"lower",  top:"Freshwater Wetland", sub:"Hawaiʻi · Protected Ecosystem" },
  { in:25, out:32, kind:"lower",  top:"Hawaiian Coot",     sub:"\u02BBalae ke\u02BBoke\u02BBo  \u00B7  Fulica alai" },
];

// Bird call starts at this elapsed second, volume target
const BIRD_CALL_START = 10;
const BIRD_CALL_VOL   = 0.40;

// ─── CSS ─────────────────────────────────────────────────────────────────────
const STYLES = `
  @keyframes ci-grain {
    0%   {transform:translate(0,0)}     10%{transform:translate(-2%,-3%)}
    20%  {transform:translate(2%,2%)}   30%{transform:translate(-3%,1%)}
    40%  {transform:translate(3%,-2%)}  50%{transform:translate(-1%,3%)}
    60%  {transform:translate(1%,-3%)}  70%{transform:translate(-3%,-1%)}
    80%  {transform:translate(3%,2%)}   90%{transform:translate(-2%,-3%)}
    100% {transform:translate(0,0)}
  }
  @keyframes ci-pulse { 0%,100%{opacity:.6} 50%{opacity:1} }
`;

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

// ─── Letterbox ────────────────────────────────────────────────────────────────
function Letterbox() {
  return (
    <>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:"11%", background:"#000", zIndex:20, pointerEvents:"none" }}/>
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"11%", background:"#000", zIndex:20, pointerEvents:"none" }}/>
    </>
  );
}

// ─── Lower-third caption (NatGeo style) ──────────────────────────────────────
function LowerThird({ top, sub }: { top:string; sub:string }) {
  return (
    <motion.div
      initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }}
      exit={{ opacity:0, x:-6 }}
      transition={{ duration:0.7, ease:[0.16,1,0.3,1] }}
      style={{ position:"absolute", left:"5%", bottom:"14%", zIndex:15, pointerEvents:"none" }}
    >
      <div style={{ display:"flex", alignItems:"stretch", gap:0 }}>
        <div style={{ width:"3px", background:"rgba(0,218,195,0.88)", marginRight:"11px", borderRadius:"1px" }}/>
        <div>
          <div style={{
            fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontWeight:700,
            fontSize:"clamp(16px,2.2vw,30px)", color:"#fff", lineHeight:1.15,
            textShadow:"0 2px 24px rgba(0,0,0,0.98), 0 0 50px rgba(0,0,0,0.9)",
          }}>{top}</div>
          <div style={{
            fontFamily:"'Josefin Sans',sans-serif", fontSize:"clamp(8px,0.85vw,11px)",
            fontWeight:700, letterSpacing:"0.30em", color:"rgba(0,218,195,0.90)",
            textTransform:"uppercase", marginTop:"5px",
            textShadow:"0 1px 12px rgba(0,0,0,0.95)",
          }}>{sub}</div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Center quote ─────────────────────────────────────────────────────────────
function CenterQuote({ quote, rule }: { quote:string; rule?:boolean }) {
  return (
    <motion.div
      initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
      exit={{ opacity:0, y:-8 }}
      transition={{ duration:0.9, ease:[0.16,1,0.3,1] }}
      style={{
        position:"absolute", left:"50%", top:"50%",
        transform:"translate(-50%,-50%)",
        textAlign:"center", zIndex:15, pointerEvents:"none",
        width:"80%",
      }}
    >
      <div style={{
        fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontWeight:700,
        fontSize:"clamp(20px,3.2vw,46px)", color:"#fff", lineHeight:1.22,
        textShadow:"0 2px 40px rgba(0,0,0,0.98), 0 0 80px rgba(0,0,0,0.85)",
      }}>
        {quote.split("\n").map((l,i)=><span key={i}>{l}{i<quote.split("\n").length-1&&<br/>}</span>)}
      </div>
      {rule && (
        <motion.div
          initial={{ scaleX:0 }} animate={{ scaleX:1 }}
          transition={{ delay:0.5, duration:0.7 }}
          style={{ width:"60px", height:"1.5px", margin:"14px auto 0", background:"rgba(0,218,195,0.75)", transformOrigin:"center" }}
        />
      )}
    </motion.div>
  );
}

// ─── Waveform — shown when bird call is audible ───────────────────────────────
function BirdCallBadge() {
  return (
    <motion.div
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      transition={{ duration:0.6 }}
      style={{
        position:"absolute", right:"5%", bottom:"14%", zIndex:15,
        display:"flex", alignItems:"center", gap:"6px", pointerEvents:"none",
      }}
    >
      {[0, 0.15, 0.30, 0.15, 0].map((h, i) => (
        <motion.div key={i}
          animate={{ scaleY:[1, 1+h*5, 1] }}
          transition={{ duration:0.65, delay:i*0.10, repeat:Infinity, repeatType:"mirror" }}
          style={{
            width:"3px", height:"14px", borderRadius:"2px",
            background:"rgba(0,218,195,0.75)", transformOrigin:"bottom",
          }}
        />
      ))}
      <span style={{
        fontFamily:"'Josefin Sans',sans-serif", fontSize:"8px", fontWeight:700,
        letterSpacing:"0.22em", color:"rgba(0,218,195,0.60)", textTransform:"uppercase",
      }}>Hawaiian Coot call</span>
    </motion.div>
  );
}

// ─── Hook: elapsed clock ──────────────────────────────────────────────────────
function useElapsed() {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(Date.now());
  useEffect(() => {
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - startRef.current) / 1000)), 500);
    return () => clearInterval(id);
  }, []);
  return elapsed;
}

// ─── Hook: bird call audio ────────────────────────────────────────────────────
function useBirdCall(elapsed: number) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (elapsed < BIRD_CALL_START || audioRef.current) return;

    const audio = new Audio(birdCallSrc as string);
    audio.volume = 0;
    audioRef.current = audio;

    audio.play()
      .then(() => {
        setPlaying(true);
        const start = Date.now();
        const ramp = () => {
          const t = (Date.now() - start) / 2000;
          audio.volume = Math.min(BIRD_CALL_VOL * t, BIRD_CALL_VOL);
          if (t < 1) requestAnimationFrame(ramp);
        };
        requestAnimationFrame(ramp);
      })
      .catch(() => {/* autoplay blocked */});

    return () => { audio.pause(); };
  }, [elapsed >= BIRD_CALL_START]);

  return playing;
}

// ─── Main component ───────────────────────────────────────────────────────────
interface Props { onComplete: () => void }

export function CinematicIntro({ onComplete }: Props) {
  const elapsed   = useElapsed();
  const birdAudio = useBirdCall(elapsed);
  const [closing, setClosing] = useState(false);

  const finish = useCallback(() => {
    if (closing) return;
    setClosing(true);
    setTimeout(onComplete, 900);
  }, [closing, onComplete]);

  // Auto-exit after TOTAL_SEC
  useEffect(() => {
    if (elapsed >= TOTAL_SEC) finish();
  }, [elapsed, finish]);

  // Determine active caption
  const activeCaption = CAPTIONS.find(c => elapsed >= c.in && elapsed < c.out) ?? null;

  // Fade-out overlay starts 3 s before end
  const fadingOut = elapsed >= TOTAL_SEC - 3;

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
        transition={{ duration:0.85, ease:"easeInOut" }}
        style={{ position:"fixed", inset:0, zIndex:9990, background:"#000", overflow:"hidden" }}
      >
        {/* ── YouTube video (muted — browser autoplay requires this) ── */}
        <iframe
          src={embedSrc}
          allow="autoplay; fullscreen"
          allowFullScreen
          style={{
            position:"absolute",
            /* Scale up to crop out the YouTube title bar & controls */
            top:"-10%", left:"-2%",
            width:"104%", height:"120%",
            border:"none", pointerEvents:"none",
          }}
          title="Hawaiian Islands aerial footage"
        />

        {/* Gradient vignette — sides + top for readability */}
        <div style={{
          position:"absolute", inset:0, pointerEvents:"none", zIndex:5,
          background:[
            "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 42%, rgba(0,0,0,0.45) 80%, rgba(0,0,0,0.70) 100%)",
            "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 18%, transparent 75%, rgba(0,0,0,0.65) 100%)",
          ].join(","),
        }}/>

        {/* Fade-to-black before homepage reveal */}
        <motion.div
          initial={{ opacity:0 }}
          animate={{ opacity: fadingOut ? 1 : 0 }}
          transition={{ duration:2.5, ease:"easeInOut" }}
          style={{ position:"absolute", inset:0, background:"#030810", zIndex:16, pointerEvents:"none" }}
        >
          {/* Species name flash during fade */}
          {fadingOut && (
            <motion.div
              initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:0.8, delay:0.4 }}
              style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}
            >
              <div style={{
                fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontWeight:700,
                fontSize:"clamp(20px,2.8vw,40px)", color:"#fff",
                textShadow:"0 0 60px rgba(0,218,195,0.40)",
                textAlign:"center", lineHeight:1.2,
              }}>Hawaiian Coot</div>
              <div style={{
                fontFamily:"'Josefin Sans',sans-serif", fontSize:"clamp(8px,0.9vw,12px)",
                fontWeight:700, letterSpacing:"0.34em", color:"rgba(0,218,195,0.85)",
                textTransform:"uppercase", marginTop:"10px",
              }}>{"\u02BBalae ke\u02BBoke\u02BBo"} · Fulica alai</div>
              <div style={{
                width:"50px", height:"1.5px", background:"rgba(0,218,195,0.60)",
                margin:"14px auto 0",
              }}/>
            </motion.div>
          )}
        </motion.div>

        {/* ── Timed caption overlay ── */}
        <AnimatePresence mode="wait">
          {activeCaption && !fadingOut && (
            activeCaption.kind === "lower"
              ? <LowerThird key={activeCaption.in} top={activeCaption.top} sub={activeCaption.sub}/>
              : <CenterQuote key={activeCaption.in} quote={activeCaption.quote} rule={activeCaption.rule}/>
          )}
        </AnimatePresence>

        {/* Bird call waveform badge */}
        <AnimatePresence>
          {birdAudio && !fadingOut && <BirdCallBadge key="bird"/>}
        </AnimatePresence>

        {/* Progress bar */}
        <div style={{
          position:"absolute", bottom:"11%", left:0, right:0, height:"2px",
          background:"rgba(255,255,255,0.08)", zIndex:21, pointerEvents:"none",
        }}>
          <motion.div
            animate={{ width:`${Math.min((elapsed/TOTAL_SEC)*100, 100)}%` }}
            transition={{ duration:0.5, ease:"linear" }}
            style={{ height:"100%", background:"rgba(0,218,195,0.55)", transformOrigin:"left" }}
          />
        </div>

        <Grain/>
        <Letterbox/>

        {/* Skip button — in top letterbox bar */}
        <motion.button
          initial={{ opacity:0 }} animate={{ opacity:0.50 }}
          whileHover={{ opacity:1 }}
          transition={{ delay:1.5, duration:0.6 }}
          onClick={finish}
          style={{
            position:"absolute", top:"3.2%", right:"20px", zIndex:25,
            background:"transparent",
            border:"1px solid rgba(255,255,255,0.30)",
            borderRadius:"4px", padding:"4px 14px",
            fontFamily:"'Josefin Sans',sans-serif", fontSize:"8.5px", fontWeight:700,
            letterSpacing:"0.28em", color:"rgba(255,255,255,0.85)", textTransform:"uppercase",
            cursor:"pointer",
          }}
        >Skip ›</motion.button>

        {/* Elapsed counter (subtle, top-left in letterbox) */}
        <div style={{
          position:"absolute", top:"3.0%", left:"20px", zIndex:25,
          fontFamily:"'Josefin Sans',sans-serif", fontSize:"8px", fontWeight:700,
          letterSpacing:"0.20em", color:"rgba(255,255,255,0.28)",
          fontVariantNumeric:"tabular-nums",
        }}>
          {String(Math.floor(elapsed/60)).padStart(2,"0")}:{String(elapsed%60).padStart(2,"0")}
        </div>

      </motion.div>
    </>
  );
}
