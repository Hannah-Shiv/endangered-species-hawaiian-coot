/**
 * CinematicIntro — Hawaiian Coot nature-documentary opening sequence
 *
 * 5 scenes, ~14 s total (skippable).
 * Visual approach: Ken Burns effect on bg-photo simulates aerial drone footage.
 * Audio: Web Audio white-noise wind ambience + authentic Hawaiian Coot bird call (MP3).
 * Style language: 2.35:1 letterbox bars, NatGeo lower-third captions, slow organic pacing.
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import bgPhoto from "@/assets/bg-photo.png";
import birdCallSrc from "@assets/XC342210_-_Hawaiian_Coot_-_Fulica_alai_1779638749861.mp3";

// ─── Scene durations (ms) ────────────────────────────────────────────────────
const SCENE_MS = [3200, 3200, 3200, 3200, 1400] as const;

// ─── Shared scene crossfade ──────────────────────────────────────────────────
const FADE: React.ComponentProps<typeof motion.div> = {
  initial:    { opacity: 0 },
  animate:    { opacity: 1 },
  exit:       { opacity: 0 },
  transition: { duration: 0.85, ease: "easeInOut" },
};

// ─── CSS keyframes ────────────────────────────────────────────────────────────
const STYLES = `
  @keyframes ci-twinkle { 0%,100%{opacity:.15} 50%{opacity:.95} }
  @keyframes ci-float   { 0%{opacity:0;transform:translateY(0) scale(1)} 40%{opacity:.9} 100%{opacity:0;transform:translateY(-70px) scale(.5)} }
  @keyframes ci-shimmer { 0%,100%{opacity:.2} 50%{opacity:.85} }
  @keyframes ci-grain   {
    0%   {transform:translate(0,0)}   10% {transform:translate(-2%,-3%)}
    20%  {transform:translate(2%,2%)} 30% {transform:translate(-3%,1%)}
    40%  {transform:translate(3%,-2%)} 50% {transform:translate(-1%,3%)}
    60%  {transform:translate(1%,-3%)} 70% {transform:translate(-3%,-1%)}
    80%  {transform:translate(3%,2%)} 90% {transform:translate(-2%,-3%)}
    100% {transform:translate(0,0)}
  }
`;

// ─── Film grain overlay (very subtle) ────────────────────────────────────────
function Grain() {
  return (
    <div style={{
      position:"absolute", inset:"-10%",
      width:"120%", height:"120%",
      opacity:0.045, pointerEvents:"none", zIndex:18,
      backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
      backgroundSize:"200px 200px",
      animation:"ci-grain 0.35s steps(1) infinite",
    }}/>
  );
}

// ─── Cinematic letterbox bars ─────────────────────────────────────────────────
function Letterbox() {
  const h = "11.5%";
  return (
    <>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:h, background:"#000", zIndex:20, pointerEvents:"none" }}/>
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:h, background:"#000", zIndex:20, pointerEvents:"none" }}/>
    </>
  );
}

// ─── Lower-third NatGeo caption ───────────────────────────────────────────────
function Caption({ top, sub, delay=0.9 }: { top:string; sub?:string; delay?:number }) {
  return (
    <motion.div
      initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }}
      exit={{ opacity:0 }}
      transition={{ delay, duration:0.8, ease:[0.16,1,0.3,1] }}
      style={{
        position:"absolute", left:"5%", bottom:"14%", zIndex:15,
        pointerEvents:"none",
      }}
    >
      <div style={{
        display:"inline-flex", alignItems:"stretch",
        gap:0, marginBottom:"4px",
      }}>
        <div style={{ width:"3px", background:"rgba(0,218,195,0.9)", marginRight:"10px", borderRadius:"1px" }}/>
        <div>
          <div style={{
            fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontWeight:700,
            fontSize:"clamp(15px,2.0vw,26px)", color:"#fff",
            textShadow:"0 2px 20px rgba(0,0,0,0.95), 0 0 40px rgba(0,0,0,0.8)",
            lineHeight:1.15,
          }}>{top}</div>
          {sub && (
            <div style={{
              fontFamily:"'Josefin Sans',sans-serif", fontSize:"clamp(8px,0.85vw,11px)",
              fontWeight:700, letterSpacing:"0.32em", color:"rgba(0,218,195,0.90)",
              textTransform:"uppercase", marginTop:"5px",
              textShadow:"0 1px 12px rgba(0,0,0,0.9)",
            }}>{sub}</div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Ambient eco particles ────────────────────────────────────────────────────
function EcoParticles({ colors }: { colors:string[] }) {
  return (
    <>
      {Array.from({length:10},(_,i)=>{
        const left   = `${12+(i*71%76)}%`;
        const top    = `${20+(i*53%55)}%`;
        const size   = 2+(i%2);
        const dur    = 2.6+(i%4)*0.5;
        const delay  = (i*0.35)%2.8;
        const color  = colors[i%colors.length];
        return (
          <div key={i} style={{
            position:"absolute", left, top,
            width:`${size}px`, height:`${size}px`, borderRadius:"50%",
            background:color,
            animation:`ci-float ${dur}s ${delay}s ease-in-out infinite`,
            pointerEvents:"none", zIndex:8,
          }}/>
        );
      })}
    </>
  );
}

// ─── SCENE 1 — Pacific Ocean Fly-In ──────────────────────────────────────────
function Scene1() {
  const stars: [number,number,number,number][] = [
    [5,6,1.1,3.2],[13,3,0.8,2.6],[25,9,1.3,3.8],[38,5,0.7,2.2],[52,3,1.0,3.5],
    [65,8,1.2,2.8],[78,4,0.9,3.1],[90,7,1.4,2.5],[6,17,0.8,3.6],[20,15,1.1,2.9],
    [34,19,0.7,3.3],[48,13,1.3,2.4],[62,18,0.9,3.0],[76,11,1.0,2.7],[88,20,1.2,3.4],
    [10,26,0.8,2.5],[28,24,1.0,3.7],[44,28,0.7,2.8],[58,22,1.1,3.2],[74,25,0.9,2.6],
    [92,15,1.3,3.0],[3,32,0.8,2.3],[19,30,1.1,3.8],[36,35,0.7,2.6],[54,31,1.2,3.1],
    [71,33,0.9,2.9],[87,28,1.0,3.4],[96,10,0.8,2.7],
  ];
  return (
    <motion.div {...FADE} style={{ position:"absolute", inset:0 }}>
      {/* Ocean panorama gradient */}
      <div style={{
        position:"absolute", inset:0,
        background:[
          "linear-gradient(to bottom,",
          "#010306 0%,",
          "#020b1a 18%,",
          "#031525 32%,",
          "#042038 44%,",
          "#052d50 54%,",
          "#084570 62%,",
          "#c07808 70%,",
          "#f59e0b 73%,",
          "#fb923c 75.5%,",
          "#ea580c 77%,",
          "#c2440a 79%,",
          "#084570 84%,",
          "#052d50 90%,",
          "#031525 100%)",
        ].join(" "),
      }}/>

      {/* Horizon bloom */}
      <div style={{
        position:"absolute", left:"50%", top:"73.5%",
        transform:"translate(-50%,-50%)",
        width:"100%", height:"100px",
        background:"radial-gradient(ellipse 90% 100% at 50% 50%, rgba(245,180,30,0.50) 0%, rgba(251,146,60,0.25) 40%, transparent 70%)",
        pointerEvents:"none",
      }}/>

      {/* Ocean surface shimmer */}
      <div style={{
        position:"absolute", left:0, right:0, bottom:0, height:"24%",
        background:"linear-gradient(to top, rgba(5,45,80,0.9) 0%, rgba(8,70,112,0.4) 40%, transparent 100%)",
        pointerEvents:"none",
      }}/>

      {/* Stars */}
      {stars.map(([l,t,r,dur],i)=>(
        <div key={i} style={{
          position:"absolute", left:`${l}%`, top:`${t}%`,
          width:`${r*1.8}px`, height:`${r*1.8}px`, borderRadius:"50%",
          background:"rgba(255,255,255,0.95)",
          animation:`ci-twinkle ${dur}s ${i*0.12}s ease-in-out infinite`,
          pointerEvents:"none",
        }}/>
      ))}

      {/* Speed streaks at horizon — subtle altitude cues */}
      {[28,38,50,58,66,44,55].map((left,i)=>(
        <div key={i} style={{
          position:"absolute", left:`${left}%`, top:"72%",
          width:"1px", height:`${14+i*3}px`, opacity:0.35,
          background:`linear-gradient(to bottom, transparent, rgba(250,210,80,${0.5+i*0.04}))`,
          transform:"translateX(-50%)",
          pointerEvents:"none",
        }}/>
      ))}

      {/* Slow zoom — flying forward */}
      <motion.div
        initial={{ scale:1.08 }} animate={{ scale:1.0 }}
        transition={{ duration:3.2, ease:[0.0,0,0.25,1] }}
        style={{ position:"absolute", inset:0, pointerEvents:"none" }}
      />

      <Caption top="Pacific Ocean" sub="Approaching Hawaiʻi · 3,000 ft" delay={1.2}/>
      <Grain/>
    </motion.div>
  );
}

// ─── SCENE 2 — Hawaiian Islands Reveal ───────────────────────────────────────
function Scene2() {
  return (
    <motion.div {...FADE} style={{ position:"absolute", inset:0, overflow:"hidden" }}>

      {/* Ken Burns: high altitude → descending, zoom from sky region */}
      <motion.div
        initial={{ scale:2.4 }} animate={{ scale:1.85 }}
        transition={{ duration:3.5, ease:[0.16,1,0.3,1] }}
        style={{ position:"absolute", inset:0, transformOrigin:"50% 18%" }}
      >
        <img src={bgPhoto} style={{
          width:"100%", height:"100%", objectFit:"cover", objectPosition:"50% 12%",
          filter:"brightness(0.82) contrast(1.06) saturate(1.05)",
        }}/>
      </motion.div>

      {/* Cloud / altitude mist layer — burns off as we descend */}
      <motion.div
        initial={{ opacity:0.96 }} animate={{ opacity:0.18 }}
        transition={{ duration:2.6, delay:0.4, ease:"easeInOut" }}
        style={{
          position:"absolute", inset:0,
          background:"linear-gradient(to bottom, rgba(210,230,250,0.92) 0%, rgba(240,248,255,0.75) 25%, rgba(200,225,245,0.45) 55%, transparent 80%)",
          pointerEvents:"none",
        }}
      />

      {/* Light rays breaking through clouds */}
      {[18,32,50,66,78].map((left,i)=>(
        <div key={i} style={{
          position:"absolute", left:`${left}%`, top:"-5%",
          width:`${120+i*15}px`, height:"75%",
          background:`linear-gradient(to bottom, rgba(255,245,200,0.18), transparent)`,
          transform:`rotate(${-8+i*4}deg) translateX(-50%)`,
          transformOrigin:"top center",
          animation:`ci-shimmer ${2.8+i*0.3}s ${i*0.45}s ease-in-out infinite`,
          pointerEvents:"none", zIndex:5,
        }}/>
      ))}

      {/* Bottom dark */}
      <div style={{
        position:"absolute", inset:0,
        background:"linear-gradient(to top, rgba(2,8,18,0.88) 0%, transparent 38%)",
        pointerEvents:"none",
      }}/>

      {/* Birds crossing frame */}
      {[34,48,60].map((top,i)=>(
        <motion.div key={i}
          initial={{ x:"-120px", opacity:0 }}
          animate={{ x:"calc(100vw + 80px)", opacity:[0, 0.65, 0.65, 0] }}
          transition={{ delay:0.6+i*0.28, duration:2.2, ease:"easeInOut" }}
          style={{ position:"absolute", left:0, top:`${top}%`, zIndex:12, pointerEvents:"none" }}
        >
          <svg viewBox="0 0 22 8" width="22" height="8">
            <path d="M0 4 Q5.5 1 11 4 Q16.5 7 22 4" fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="1.2"/>
          </svg>
        </motion.div>
      ))}

      <EcoParticles colors={["rgba(245,225,80,0.6)","rgba(210,240,255,0.5)"]}/>

      {/* Central quote — appears mid-scene */}
      <motion.div
        initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
        transition={{ delay:1.1, duration:1.0, ease:[0.16,1,0.3,1] }}
        style={{
          position:"absolute", left:"50%", top:"50%",
          transform:"translate(-50%,-50%)",
          textAlign:"center", pointerEvents:"none", zIndex:14,
        }}
      >
        <div style={{
          fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontWeight:700,
          fontSize:"clamp(20px,3.2vw,44px)", color:"#fff",
          textShadow:"0 2px 40px rgba(0,0,0,0.95), 0 0 80px rgba(0,0,0,0.8)",
          lineHeight:1.18,
        }}>Every Wetland<br/>Tells a Story</div>
        <motion.div
          initial={{ scaleX:0 }} animate={{ scaleX:1 }}
          transition={{ delay:1.8, duration:0.7 }}
          style={{
            width:"56px", height:"1.5px", margin:"12px auto 0",
            background:"rgba(0,218,195,0.75)", transformOrigin:"left",
          }}
        />
      </motion.div>

      <Caption top="Hawaiʻi · Garden of the Pacific" sub="Hawaiian Islands · 800 ft" delay={2.4}/>
      <Grain/>
    </motion.div>
  );
}

// ─── SCENE 3 — Wetland Descent ───────────────────────────────────────────────
function Scene3() {
  return (
    <motion.div {...FADE} style={{ position:"absolute", inset:0, overflow:"hidden" }}>

      {/* Ken Burns: mid-altitude zooming toward wetland */}
      <motion.div
        initial={{ scale:1.42 }} animate={{ scale:1.08 }}
        transition={{ duration:3.5, ease:[0.16,1,0.3,1] }}
        style={{ position:"absolute", inset:0, transformOrigin:"50% 42%" }}
      >
        <img src={bgPhoto} style={{
          width:"100%", height:"100%", objectFit:"cover", objectPosition:"50% 38%",
          filter:"brightness(0.88) contrast(1.09) saturate(1.15)",
        }}/>
      </motion.div>

      {/* Emerald eco-glow rising from the wetland */}
      <div style={{
        position:"absolute", inset:0,
        background:[
          "linear-gradient(to top, rgba(15,70,25,0.60) 0%, rgba(8,45,16,0.30) 28%, transparent 58%)",
          "radial-gradient(ellipse 75% 35% at 50% 88%, rgba(34,197,94,0.22) 0%, transparent 70%)",
        ].join(","),
        pointerEvents:"none",
      }}/>

      {/* Top atmosphere dark */}
      <div style={{
        position:"absolute", inset:0,
        background:"linear-gradient(to bottom, rgba(2,8,16,0.60) 0%, transparent 28%)",
        pointerEvents:"none",
      }}/>

      {/* Water shimmer reflections — bottom 30% */}
      {Array.from({length:14},(_,i)=>(
        <div key={i} style={{
          position:"absolute",
          left:`${12+(i*67%72)}%`,
          bottom:`${5+(i*29%20)}%`,
          width:`${4+(i%4)}px`, height:"1.5px",
          borderRadius:"99px",
          background:`rgba(${i%2?'0,218,195':'245,215,60'},0.75)`,
          animation:`ci-shimmer ${1.1+i*0.18}s ${i*0.14}s ease-in-out infinite`,
          pointerEvents:"none", zIndex:8,
        }}/>
      ))}

      {/* Light rays from sun filtering through reeds */}
      {[40,52,62].map((left,i)=>(
        <div key={i} style={{
          position:"absolute", left:`${left}%`, top:"-5%",
          width:"90px", height:"65%",
          background:`linear-gradient(to bottom, rgba(245,210,60,0.14), transparent)`,
          transform:`rotate(${-4+i*5}deg) translateX(-50%)`,
          transformOrigin:"top center",
          animation:`ci-shimmer ${3.0+i*0.4}s ${i*0.5}s ease-in-out infinite`,
          pointerEvents:"none", zIndex:5,
        }}/>
      ))}

      <EcoParticles colors={["rgba(34,197,94,0.70)","rgba(0,218,195,0.55)","rgba(245,215,60,0.50)"]}/>
      <Caption top="Freshwater Wetland" sub={`O\u02BBahu · Hawai\u02BBi · 40 ft`} delay={1.0}/>
      <Grain/>
    </motion.div>
  );
}

// ─── SCENE 4 — Hawaiian Coot Reveal ──────────────────────────────────────────
const INNER_R = 268; // must match RadialLanding inner ring radius

function Scene4({ birdReady }: { birdReady: boolean }) {
  return (
    <motion.div {...FADE} style={{ position:"absolute", inset:0, overflow:"hidden" }}>

      {/* Ken Burns: final landing on the bird */}
      <motion.div
        initial={{ scale:1.10 }} animate={{ scale:1.0 }}
        transition={{ duration:3.5, ease:[0.16,1,0.3,1] }}
        style={{ position:"absolute", inset:0, transformOrigin:"50% 44%" }}
      >
        <img src={bgPhoto} style={{
          width:"100%", height:"100%", objectFit:"cover", objectPosition:"50% 42%",
          filter:"brightness(0.90) contrast(1.10) saturate(1.14)",
        }}/>
      </motion.div>

      {/* Deep circular vignette — spotlight on the bird */}
      <div style={{
        position:"absolute", inset:0,
        background:"radial-gradient(ellipse 68% 72% at 50% 50%, transparent 35%, rgba(3,8,18,0.72) 72%, rgba(2,6,14,0.92) 100%)",
        pointerEvents:"none",
      }}/>

      {/* Orbital ring drawing in — matches the homepage ring exactly */}
      <motion.svg
        initial={{ opacity:0 }} animate={{ opacity:1 }}
        transition={{ delay:0.55, duration:0.5 }}
        style={{
          position:"absolute", left:"50%", top:"50%",
          transform:"translate(-50%,-50%)", overflow:"visible",
          pointerEvents:"none", width:2, height:2, zIndex:10,
        }}
        viewBox="-1 -1 2 2"
      >
        {/* Outer glow */}
        <motion.circle r={INNER_R} fill="none"
          stroke="rgba(0,210,185,0.16)" strokeWidth="32"
          initial={{ pathLength:0 }} animate={{ pathLength:1 }}
          transition={{ duration:2.2, delay:0.7, ease:[0.4,0,0.2,1] }}
          style={{ transformOrigin:"0px 0px", rotate:"-90deg" }}
        />
        {/* Main line */}
        <motion.circle r={INNER_R} fill="none"
          stroke="rgba(0,238,212,0.92)" strokeWidth="2.6"
          initial={{ pathLength:0 }} animate={{ pathLength:1 }}
          transition={{ duration:2.2, delay:0.7, ease:[0.4,0,0.2,1] }}
          style={{ transformOrigin:"0px 0px", rotate:"-90deg" }}
        />
        {/* Specular */}
        <motion.circle r={INNER_R} fill="none"
          stroke="rgba(200,255,248,0.50)" strokeWidth="1.0"
          initial={{ pathLength:0 }} animate={{ pathLength:1 }}
          transition={{ duration:2.0, delay:0.9, ease:[0.4,0,0.2,1] }}
          style={{ transformOrigin:"0px 0px", rotate:"-90deg" }}
        />
      </motion.svg>

      <EcoParticles colors={["rgba(0,218,195,0.75)","rgba(34,197,94,0.65)","rgba(245,215,60,0.55)"]}/>

      {/* Species reveal — appears late so the ring draws first */}
      <motion.div
        initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
        transition={{ delay:2.0, duration:0.9 }}
        style={{ position:"absolute", bottom:"14%", width:"100%", textAlign:"center", pointerEvents:"none", zIndex:14 }}
      >
        {/* Teal top rule */}
        <motion.div
          initial={{ scaleX:0 }} animate={{ scaleX:1 }}
          transition={{ delay:2.0, duration:0.6 }}
          style={{ width:"50px", height:"1.5px", margin:"0 auto 10px", background:"rgba(0,218,195,0.75)", transformOrigin:"center" }}
        />
        <div style={{
          fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontWeight:700,
          fontSize:"clamp(16px,2.0vw,26px)", color:"#fff",
          textShadow:"0 2px 30px rgba(0,0,0,0.95), 0 0 50px rgba(0,0,0,0.8)",
        }}>Hawaiian Coot</div>
        <div style={{
          fontFamily:"'Josefin Sans',sans-serif", fontSize:"clamp(8px,0.85vw,11px)",
          fontWeight:700, letterSpacing:"0.34em", color:"rgba(0,218,195,0.90)",
          textTransform:"uppercase", marginTop:"5px",
          textShadow:"0 1px 10px rgba(0,0,0,0.9)",
        }}>{"\u02BBalae ke\u02BBoke\u02BBo"} · Fulica alai</div>

        {/* Bird call indicator — only when audio started */}
        {birdReady && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.6 }}
            style={{
              display:"flex", alignItems:"center", justifyContent:"center", gap:"5px", marginTop:"10px",
            }}
          >
            {[0,0.12,0.24,0.36,0.24,0.12,0].map((h,i)=>(
              <motion.div key={i}
                animate={{ scaleY:[1, 1+h*6, 1] }}
                transition={{ duration:0.7, delay:i*0.08, repeat:Infinity, repeatType:"mirror" }}
                style={{
                  width:"3px", height:"12px", borderRadius:"2px",
                  background:"rgba(0,218,195,0.75)", transformOrigin:"bottom",
                }}
              />
            ))}
            <span style={{
              fontFamily:"'Josefin Sans',sans-serif", fontSize:"8px", fontWeight:700,
              letterSpacing:"0.22em", color:"rgba(0,218,195,0.65)", marginLeft:"6px",
              textTransform:"uppercase",
            }}>Authentic bird call</span>
          </motion.div>
        )}
      </motion.div>

      <Grain/>
    </motion.div>
  );
}

// ─── SCENE 5 — Homepage Activation (flash to dark) ───────────────────────────
function Scene5() {
  return (
    <motion.div
      initial={{ opacity:1 }} animate={{ opacity:0 }}
      transition={{ duration:1.0, ease:"easeInOut" }}
      style={{ position:"absolute", inset:0, background:"#030810", pointerEvents:"none", zIndex:16 }}
    >
      <motion.div
        initial={{ opacity:0 }} animate={{ opacity:[0, 0.18, 0] }}
        transition={{ duration:0.9, times:[0,0.25,1] }}
        style={{ position:"absolute", inset:0, background:"rgba(0,238,212,0.2)" }}
      />
    </motion.div>
  );
}

// ─── Audio manager ────────────────────────────────────────────────────────────
function useAudio(scene: number) {
  const windRef  = useRef<{ ctx:AudioContext; gain:GainNode } | null>(null);
  const birdRef  = useRef<HTMLAudioElement | null>(null);
  const [birdReady, setBirdReady] = useState(false);

  // Wind ambience via Web Audio (white noise → low-pass)
  useEffect(() => {
    try {
      const AC = window.AudioContext ?? (window as unknown as Record<string,typeof AudioContext>).webkitAudioContext;
      if (!AC) return;
      const ctx = new AC();
      const sampleRate = ctx.sampleRate;
      const buf = ctx.createBuffer(1, sampleRate * 4, sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.loop = true;

      const lpf = ctx.createBiquadFilter();
      lpf.type = "lowpass";
      lpf.frequency.value = 320;

      const gain = ctx.createGain();
      gain.gain.value = 0;

      src.connect(lpf); lpf.connect(gain); gain.connect(ctx.destination);
      src.start();

      // Gentle fade in
      gain.gain.linearRampToValueAtTime(0.055, ctx.currentTime + 2.0);

      windRef.current = { ctx, gain };
    } catch { /* autoplay blocked — silent fallback */ }

    return () => {
      try { windRef.current?.ctx.close(); } catch { /* noop */ }
      windRef.current = null;
    };
  }, []);

  // Bird call on scene 4
  useEffect(() => {
    if (scene !== 4) return;
    const audio = new Audio(birdCallSrc as string);
    audio.volume = 0;
    birdRef.current = audio;

    audio.play()
      .then(() => {
        setBirdReady(true);
        // Fade in bird call over 1.5 s
        const start = Date.now();
        const target = 0.38;
        const tick = () => {
          const elapsed = (Date.now() - start) / 1500;
          audio.volume = Math.min(target * elapsed, target);
          if (elapsed < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        // Lower wind ambience while bird plays
        if (windRef.current) windRef.current.gain.gain.linearRampToValueAtTime(0.018, windRef.current.ctx.currentTime + 1.5);
      })
      .catch(() => { /* autoplay blocked */ });

    return () => {
      audio.pause();
      birdRef.current = null;
    };
  }, [scene]);

  return { birdReady };
}

// ─── Main component ───────────────────────────────────────────────────────────
interface Props { onComplete: () => void }

export function CinematicIntro({ onComplete }: Props) {
  const [scene,   setScene]   = useState(1);
  const [closing, setClosing] = useState(false);
  const { birdReady } = useAudio(scene);

  const finish = useCallback(() => {
    setClosing(true);
    setTimeout(onComplete, 700);
  }, [onComplete]);

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
        transition={{ duration:0.7, ease:"easeInOut" }}
        style={{ position:"fixed", inset:0, zIndex:9990, background:"#010407", overflow:"hidden" }}
      >
        <AnimatePresence mode="sync">
          {scene === 1 && <Scene1 key="s1"/>}
          {scene === 2 && <Scene2 key="s2"/>}
          {scene === 3 && <Scene3 key="s3"/>}
          {scene === 4 && <Scene4 key="s4" birdReady={birdReady}/>}
          {scene === 5 && <Scene5 key="s5"/>}
        </AnimatePresence>

        <Letterbox/>

        {/* Skip button — inside letterbox area */}
        <motion.button
          initial={{ opacity:0 }} animate={{ opacity:0.50 }}
          whileHover={{ opacity:1 }}
          transition={{ delay:1.0, duration:0.6 }}
          onClick={() => { setClosing(true); setTimeout(onComplete, 700); }}
          style={{
            position:"absolute", top:"3.5%", right:"22px", zIndex:25,
            background:"transparent",
            border:"1px solid rgba(255,255,255,0.28)",
            borderRadius:"4px", padding:"4px 13px",
            fontFamily:"'Josefin Sans',sans-serif", fontSize:"8.5px", fontWeight:700,
            letterSpacing:"0.28em", color:"rgba(255,255,255,0.85)", textTransform:"uppercase",
            cursor:"pointer",
          }}
        >Skip ›</motion.button>
      </motion.div>
    </>
  );
}
