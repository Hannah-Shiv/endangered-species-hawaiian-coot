/**
 * CinematicIntro — Hawaiian Coot · Cooper Middle School Science Project
 *
 * 60-second YouTube aerial intro.
 * All gold palette. Playfair Display throughout.
 * Every card fades in, holds, then fades out before the next appears.
 * Names cycle one at a time. No boxes.
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import birdCallSrc from "@assets/XC342210_-_Hawaiian_Coot_-_Fulica_alai_1779638749861.mp3";

// ─── Config ───────────────────────────────────────────────────────────────────
const VIDEO_ID        = "AWpvNtoG5nU";
const START_SEC       = 2244;
const TOTAL_SEC       = 62;
const BIRD_CALL_START = 10;
const BIRD_CALL_VOL   = 0.42;

// ─── Gold palette ─────────────────────────────────────────────────────────────
// Three tones for visual hierarchy — all unmistakably gold.
const G1 = "#FFF0A0";                    // brightest — large titles
const G2 = "#D4AF37";                    // classic gold — subtitles & rules
const G3 = "rgba(212,175,55,0.62)";      // soft gold — small labels

// Gradient applied to big title text
const TITLE_GRAD = `linear-gradient(140deg, ${G1} 0%, ${G2} 45%, #E8C84A 80%, ${G1} 100%)`;

// Heavy text-shadow keeps every size legible on bright video
const S = "0 2px 48px rgba(0,0,0,0.99), 0 0 90px rgba(0,0,0,0.97), 0 4px 18px rgba(0,0,0,0.94)";

// ─── Shared animation config ──────────────────────────────────────────────────
const FADE_DUR  = 0.90;   // seconds
const EASE_IN   = [0.16, 1, 0.3, 1] as const;
const EASE_OUT  = [0.4,  0, 1,   1] as const;

// Every card shares the same fade-in / fade-out motion props
const CARD_MOTION = {
  initial:    { opacity: 0 },
  animate:    { opacity: 1 },
  exit:       { opacity: 0 },
  transition: {
    opacity: { duration: FADE_DUR, ease: EASE_IN },
    exit:    { duration: 0.70,     ease: EASE_OUT },
  },
} as const;

// ─── Layout anchor — center-right, over the water ────────────────────────────
const BLOCK: React.CSSProperties = {
  position:      "absolute",
  right:         "7%",
  top:           "50%",
  transform:     "translateY(-50%)",
  textAlign:     "right",
  zIndex:        15,
  pointerEvents: "none",
  maxWidth:      "clamp(320px, 52%, 720px)",
};

// ─── CSS ─────────────────────────────────────────────────────────────────────
const STYLES = `
  @keyframes ci-grain {
    0%  {transform:translate(0,0)}    10%{transform:translate(-2%,-3%)}
    20% {transform:translate(2%,2%)}  30%{transform:translate(-3%,1%)}
    40% {transform:translate(3%,-2%)} 50%{transform:translate(-1%,3%)}
    60% {transform:translate(1%,-3%)} 70%{transform:translate(-3%,-1%)}
    80% {transform:translate(3%,2%)}  90%{transform:translate(-2%,-3%)}
    100%{transform:translate(0,0)}
  }
`;

// ─── Thin gold rule ───────────────────────────────────────────────────────────
function Rule() {
  return (
    <motion.div
      initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
      transition={{ duration: 0.75, delay: 0.55, ease: EASE_IN }}
      style={{
        height: "1.5px", width: "90px", marginLeft: "auto",
        marginTop: "16px", marginBottom: "16px",
        background: `linear-gradient(to left, transparent, ${G2} 40%, ${G1})`,
        transformOrigin: "right",
      }}
    />
  );
}

// ─── Shared text styles ───────────────────────────────────────────────────────
const BIG: React.CSSProperties = {
  fontFamily: "'Playfair Display', serif",
  fontStyle:  "italic",
  fontWeight: 700,
  fontSize:   "clamp(36px, 5.0vw, 72px)",
  lineHeight: 1.10,
  background: TITLE_GRAD,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor:  "transparent",
  backgroundClip:       "text",
  filter:     "drop-shadow(0 3px 40px rgba(0,0,0,0.99))",
};

const SUB: React.CSSProperties = {
  fontFamily: "'Playfair Display', serif",
  fontStyle:  "italic",
  fontWeight: 400,
  fontSize:   "clamp(22px, 2.8vw, 40px)",   // ← much bigger than before
  lineHeight: 1.25,
  color:      G2,
  textShadow: S,
};

const LABEL: React.CSSProperties = {
  fontFamily: "'Playfair Display', serif",
  fontStyle:  "italic",
  fontWeight: 400,
  fontSize:   "clamp(16px, 1.6vw, 22px)",
  color:      G3,
  textShadow: S,
};

// ─── 1. Nature caption (lower-right) ─────────────────────────────────────────
function NatureCaption({ top, sub }: { top: string; sub: string }) {
  return (
    <motion.div {...CARD_MOTION} style={BLOCK}>
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: FADE_DUR, ease: EASE_IN }}
        style={BIG}
      >{top}</motion.div>

      <Rule/>

      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: FADE_DUR, delay: 0.35, ease: EASE_IN }}
        style={SUB}
      >{sub}</motion.div>
    </motion.div>
  );
}

// ─── 2. Center quote ──────────────────────────────────────────────────────────
function CenterQuote({ quote }: { quote: string }) {
  const lines = quote.split("\n");
  return (
    <motion.div
      {...CARD_MOTION}
      style={{
        position: "absolute", inset: 0, zIndex: 15, pointerEvents: "none",
        display: "flex", flexDirection: "column",
        alignItems: "flex-end", justifyContent: "center",
        paddingRight: "7%",
      }}
    >
      {lines.map((line, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: FADE_DUR, delay: 0.18 * i, ease: EASE_IN }}
          style={{ ...BIG, fontSize: "clamp(38px, 5.5vw, 78px)" }}
        >{line}</motion.div>
      ))}
      <motion.div
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.80, delay: 0.60, ease: EASE_IN }}
        style={{
          height: "1.5px", width: "100px", marginLeft: "auto", marginTop: "18px",
          background: `linear-gradient(to left, transparent, ${G2} 35%, ${G1})`,
          transformOrigin: "right",
        }}
      />
    </motion.div>
  );
}

// ─── 3. Project / school text ─────────────────────────────────────────────────
function SchoolText() {
  return (
    <motion.div {...CARD_MOTION} style={BLOCK}>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: FADE_DUR, delay: 0.20 }}
        style={LABEL}
      >A Science Project</motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: FADE_DUR, delay: 0.38, ease: EASE_IN }}
        style={{ ...BIG, fontSize: "clamp(42px, 6.0vw, 86px)", lineHeight: 1.06 }}
      >Endangered<br/>Species</motion.div>

      <Rule/>

      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: FADE_DUR, delay: 0.80, ease: EASE_IN }}
        style={SUB}
      >Cooper Middle School</motion.div>

      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: FADE_DUR, delay: 1.05 }}
        style={{ ...LABEL, marginTop: "8px" }}
      >Science · 2026</motion.div>
    </motion.div>
  );
}

// ─── 4. Individual name reveal ────────────────────────────────────────────────
function NameReveal({ name, role }: { name: string; role: string }) {
  return (
    <motion.div
      key={name}
      initial={{ opacity: 0, x: 22 }} animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -18 }}
      transition={{ duration: FADE_DUR, ease: EASE_IN }}
      style={BLOCK}
    >
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.65, delay: 0.25 }}
        style={LABEL}
      >{role}</motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: FADE_DUR, delay: 0.18, ease: EASE_IN }}
        style={BIG}
      >{name}</motion.div>

      <Rule/>
    </motion.div>
  );
}

// ─── Team sequence — one person at a time ────────────────────────────────────
const TEAM = [
  { name: "Hannah Shiv",      role: "Student Researcher" },
  { name: "Chloe Pan",        role: "Student Researcher" },
  { name: "Baram Oustad",     role: "Student Researcher" },
  { name: "Calliandra Harris", role: "Science Teacher"   },
];
const PER_PERSON = 2500; // ms each person is visible

function TeamSequence() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (idx >= TEAM.length - 1) return;
    const t = setTimeout(() => setIdx(i => i + 1), PER_PERSON);
    return () => clearTimeout(t);
  }, [idx]);

  return (
    <AnimatePresence mode="wait">
      <NameReveal key={TEAM[idx].name} name={TEAM[idx].name} role={TEAM[idx].role}/>
    </AnimatePresence>
  );
}

// ─── Caption schedule ─────────────────────────────────────────────────────────
type Card =
  | { kind: "nature"; in: number; out: number; top: string; sub: string }
  | { kind: "quote";  in: number; out: number; quote: string }
  | { kind: "school"; in: number; out: number }
  | { kind: "team";   in: number; out: number };

const CARDS: Card[] = [
  { kind:"nature", in:0,  out:7,  top:"Hawaiian Islands",    sub:"Pacific Ocean · Aerial View"          },
  { kind:"quote",  in:9,  out:17, quote:"Every Wetland\nTells a Story"                                  },
  { kind:"nature", in:19, out:26, top:"Freshwater Wetland",  sub:"Hawai\u02BBi · Protected Ecosystem"  },
  { kind:"nature", in:28, out:36, top:"Hawaiian Coot",       sub:"\u02BBalae ke\u02BBoke\u02BBo  ·  Fulica alai" },
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

// ─── Letterbox bars ───────────────────────────────────────────────────────────
function Letterbox() {
  return (
    <>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:"16%", background:"#000", zIndex:20, pointerEvents:"none" }}/>
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"10%", background:"#000", zIndex:20, pointerEvents:"none" }}/>
    </>
  );
}

// ─── Bird call waveform badge ─────────────────────────────────────────────────
function BirdCallBadge() {
  return (
    <motion.div
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      transition={{ duration: 0.8 }}
      style={{
        position:"absolute", right:"7%", bottom:"13%", zIndex:15,
        display:"flex", alignItems:"center", gap:"5px", pointerEvents:"none",
      }}
    >
      {[0, 0.14, 0.32, 0.14, 0].map((h, i) => (
        <motion.div key={i}
          animate={{ scaleY: [1, 1 + h * 5, 1] }}
          transition={{ duration:0.65, delay:i*0.09, repeat:Infinity, repeatType:"mirror" }}
          style={{ width:"2.5px", height:"11px", borderRadius:"2px", background:G3, transformOrigin:"bottom" }}
        />
      ))}
      <span style={{ ...LABEL, fontSize:"clamp(10px,0.9vw,13px)", marginLeft:"5px" }}>Hawaiian Coot call</span>
    </motion.div>
  );
}

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useElapsed() {
  const [elapsed, setElapsed] = useState(0);
  const t0 = useRef(Date.now());
  useEffect(() => {
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - t0.current) / 1000)), 400);
    return () => clearInterval(id);
  }, []);
  return elapsed;
}

function useBirdCall(elapsed: number) {
  const [playing, setPlaying] = useState(false);
  const audioRef  = useRef<HTMLAudioElement | null>(null);
  const triggered = useRef(false);

  useEffect(() => {
    if (elapsed < BIRD_CALL_START || triggered.current) return;
    triggered.current = true;
    const audio = new Audio(birdCallSrc as string);
    audio.loop = true;
    audio.volume = 0;
    audioRef.current = audio;
    audio.play().then(() => {
      setPlaying(true);
      const start = Date.now();
      const ramp = () => {
        const t = (Date.now() - start) / 2000;
        audio.volume = Math.min(BIRD_CALL_VOL * t, BIRD_CALL_VOL);
        if (t < 1) requestAnimationFrame(ramp);
      };
      requestAnimationFrame(ramp);
    }).catch(() => {});
    return () => { audio.pause(); };
  }, [elapsed >= BIRD_CALL_START]); // eslint-disable-line

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
    setTimeout(onComplete, 1000);
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
        animate={closing ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 1.0, ease: "easeInOut" }}
        style={{ position:"fixed", inset:0, zIndex:9990, background:"#000", overflow:"hidden" }}
      >
        {/* YouTube — top-cropped to bury YouTube ad overlays */}
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

        {/* Gradient vignette — right side darker so gold text pops */}
        <div style={{
          position:"absolute", inset:0, pointerEvents:"none", zIndex:5,
          background:[
            "linear-gradient(to right, rgba(0,0,0,0.18) 0%, transparent 35%, rgba(0,0,0,0.55) 72%, rgba(0,0,0,0.78) 100%)",
            "linear-gradient(to bottom, rgba(0,0,0,0.50) 0%, transparent 20%, transparent 76%, rgba(0,0,0,0.60) 100%)",
          ].join(","),
        }}/>

        {/* Fade-to-dark + final species reveal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: fadingOut ? 1 : 0 }}
          transition={{ duration: 2.8, ease: "easeInOut" }}
          style={{ position:"absolute", inset:0, background:"#030810", zIndex:16, pointerEvents:"none" }}
        >
          {fadingOut && (
            <motion.div
              initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}
              transition={{ duration:1.0, delay:0.5, ease:EASE_IN }}
              style={{
                position:"absolute", right:"7%", top:"50%", transform:"translateY(-50%)",
                textAlign:"right",
              }}
            >
              <div style={{ ...BIG, fontSize:"clamp(36px,5.0vw,70px)" }}>Hawaiian Coot</div>
              <div style={{ ...SUB, marginTop:"14px" }}>{"\u02BBalae ke\u02BBoke\u02BBo"} · Fulica alai</div>
              <div style={{
                height:"1.5px", width:"90px", marginLeft:"auto", marginTop:"16px",
                background:`linear-gradient(to left, transparent, ${G2} 35%, ${G1})`,
              }}/>
            </motion.div>
          )}
        </motion.div>

        {/* Caption cards */}
        <AnimatePresence mode="wait">
          {activeCard && !fadingOut && (() => {
            switch (activeCard.kind) {
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

        {/* Gold progress bar inside bottom letterbox */}
        <div style={{
          position:"absolute", bottom:"10%", left:0, right:0, height:"2px",
          background:"rgba(212,175,55,0.15)", zIndex:21, pointerEvents:"none",
        }}>
          <motion.div
            animate={{ width:`${Math.min((elapsed / TOTAL_SEC) * 100, 100)}%` }}
            transition={{ duration:0.4, ease:"linear" }}
            style={{
              height:"100%",
              background:`linear-gradient(to right, ${G2}, ${G1})`,
              transformOrigin:"left",
            }}
          />
        </div>

        <Grain/>
        <Letterbox/>

        {/* Skip — gold italic, inside top letterbox */}
        <motion.button
          initial={{ opacity:0 }} animate={{ opacity:0.40 }}
          whileHover={{ opacity:1 }}
          transition={{ delay:2.5, duration:0.7 }}
          onClick={finish}
          style={{
            position:"absolute", top:"4.5%", right:"20px", zIndex:25,
            background:"transparent",
            border:`1px solid ${G3}`,
            borderRadius:"2px", padding:"4px 16px",
            fontFamily:"'Playfair Display',serif", fontStyle:"italic",
            fontSize:"13px", color:G2,
            cursor:"pointer",
          }}
        >Skip ›</motion.button>

        {/* Timecode — dim gold */}
        <div style={{
          position:"absolute", top:"5.5%", left:"22px", zIndex:25,
          ...LABEL, fontSize:"11px", color:"rgba(212,175,55,0.28)",
          fontVariantNumeric:"tabular-nums",
        }}>
          {String(Math.floor(elapsed / 60)).padStart(2,"0")}:{String(elapsed % 60).padStart(2,"0")}
        </div>
      </motion.div>
    </>
  );
}
