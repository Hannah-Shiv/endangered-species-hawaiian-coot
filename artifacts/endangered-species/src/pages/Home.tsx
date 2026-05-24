import { useState, useCallback } from "react";
import cootPhoto from "@assets/image_1779576726784.png";
import { LandingHero } from "@/components/LandingHero";
import { DomeNav } from "@/components/DomeNav";
import { RadialLanding } from "@/components/RadialLanding";
import { CinematicIntro } from "@/components/CinematicIntro";
import { MeetSpecies } from "@/components/sections/MeetSpecies";
import { Habitat } from "@/components/sections/Habitat";
import { FoodWeb } from "@/components/sections/FoodWeb";
import { Adaptations } from "@/components/sections/Adaptations";
import { Predators } from "@/components/sections/Predators";
import { ClimateStressors } from "@/components/sections/ClimateStressors";
import { PatternsOfChange } from "@/components/sections/PatternsOfChange";
import { HumanImpact } from "@/components/sections/HumanImpact";
import { Conservation } from "@/components/sections/Conservation";
import { Evolution } from "@/components/sections/Evolution";
import { ExtinctionRisk } from "@/components/sections/ExtinctionRisk";
import { Sources } from "@/components/sections/Sources";
import { motion, AnimatePresence } from "framer-motion";

// ─── Gold palette (mirrored from CinematicIntro for consistency) ──────────────
const G2 = "#FFE060";
const SHADOW = "0 2px 48px rgba(0,0,0,0.99), 0 0 90px rgba(0,0,0,0.97)";
const EASE_IN = [0.16, 1, 0.3, 1] as const;

// ─── Splash screen — full-screen bird, captures gesture so audio can autoplay ──
function CinematicSplash({ onStart }: { onStart: () => void }) {
  const GV = "'Great Vibes', cursive";
  // Deep text-shadow so gold reads over bright water
  const DS = "0 2px 18px rgba(0,0,0,0.97), 0 0 48px rgba(0,0,0,0.92), 0 1px 6px rgba(0,0,0,0.88)";

  return (
    <motion.div
      key="splash"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8 } }}
      transition={{ duration: 1.8 }}
      onClick={onStart}
      style={{ position: "fixed", inset: 0, zIndex: 9990, cursor: "pointer", overflow: "hidden" }}
    >
      {/* ── Full-screen bird photo — no zoom so the entire bird stays visible ── */}
      <img
        src={cootPhoto as string}
        alt="Hawaiian Coot"
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          objectFit: "cover",
          // push right so the bird (right half of photo) is centred; water fills left
          objectPosition: "70% 58%",
        }}
      />

      {/* ── Left panel for identity text legibility ── */}
      <div style={{
        position: "absolute", top: 0, left: 0, bottom: 0,
        width: "48%", pointerEvents: "none",
        background: "linear-gradient(to right, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0.32) 65%, transparent 100%)",
      }}/>
      {/* Right panel for CTA text legibility */}
      <div style={{
        position: "absolute", top: 0, right: 0, bottom: 0,
        width: "36%", pointerEvents: "none",
        background: "linear-gradient(to left, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.30) 65%, transparent 100%)",
      }}/>

      {/* ── Subtle gold shimmer on the water ── */}
      <motion.div
        animate={{ opacity: [0, 0.07, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 55% 25% at 45% 62%, rgba(255,218,60,0.22) 0%, transparent 70%)",
        }}
      />

      {/* ══════════════════════════════════════════════════
          LEFT COLUMN — identity text (clear water zone)
          Nudged up: top 43% instead of 50%
      ══════════════════════════════════════════════════ */}
      <div style={{
        position: "absolute",
        top: "43%", left: "5%",
        transform: "translateY(-50%)",
        display: "flex", flexDirection: "column",
        alignItems: "flex-start",
        gap: "clamp(6px, 1.2vh, 16px)",
        maxWidth: "40%",
      }}>

        {/* Hi, I am */}
        <motion.p
          initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.6, delay: 0.5, ease: EASE_IN }}
          style={{
            fontFamily: GV, fontSize: "clamp(28px, 3.6vw, 52px)",
            color: "rgba(255,235,160,0.90)", textShadow: DS,
            margin: 0, lineHeight: 1.1,
          }}
        >Hi, I am</motion.p>

        {/* Hawaiian Coot — large gold */}
        <motion.p
          initial={{ opacity: 0, x: -28 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.8, delay: 1.0, ease: EASE_IN }}
          style={{
            fontFamily: GV,
            fontSize: "clamp(46px, 7vw, 108px)",
            color: G2, lineHeight: 1.0,
            textShadow: "0 0 55px rgba(255,224,96,0.50), " + DS,
            margin: 0,
          }}
        >Hawaiian Coot</motion.p>

        {/* an endangered species — larger, vivid red */}
        <motion.p
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.6, delay: 1.55, ease: EASE_IN }}
          style={{
            fontFamily: GV, fontSize: "clamp(26px, 3.4vw, 50px)",
            color: "#FF3B3B",
            textShadow: "0 0 28px rgba(255,60,60,0.55), " + DS,
            margin: 0, lineHeight: 1.1,
          }}
        >an endangered species</motion.p>

        {/* Gold rule */}
        <motion.div
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: 1.0, delay: 2.1, ease: EASE_IN }}
          style={{
            height: "1px", width: "clamp(70px, 10vw, 140px)",
            background: `linear-gradient(to right, ${G2} 0%, rgba(255,224,96,0.3) 100%)`,
            transformOrigin: "left",
            marginTop: "2px",
          }}
        />

        {/* Want to fly with me and explore?
            – entire line in Great Vibes, bigger, glowing
            – "fly" has an animated SVG brush-stroke underline */}
        <motion.p
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.8, delay: 2.4, ease: EASE_IN }}
          style={{
            fontFamily: GV,
            fontSize: "clamp(30px, 4vw, 62px)",
            color: "rgba(255,240,170,0.96)", textShadow: DS,
            margin: 0, lineHeight: 1.4,
          }}
        >
          Want to{" "}
          {/* "fly" with animated pen-stroke underline */}
          <motion.span
            animate={{ textShadow: [
              "0 0 18px rgba(255,224,96,0.4), " + DS,
              "0 0 52px rgba(255,224,96,0.95), " + DS,
              "0 0 18px rgba(255,224,96,0.4), " + DS,
            ]}}
            transition={{ duration: 2.6, delay: 3.0, repeat: Infinity, ease: "easeInOut" }}
            style={{
              color: G2,
              position: "relative",
              display: "inline-block",
            }}
          >
            fly
            {/* SVG pen-stroke underline */}
            <svg
              style={{
                position: "absolute",
                bottom: "-0.12em",
                left: "-8%",
                width: "116%",
                height: "0.32em",
                overflow: "visible",
                pointerEvents: "none",
              }}
              viewBox="0 0 120 14"
              preserveAspectRatio="none"
            >
              <motion.path
                d="M 3 10 C 12 5, 28 13, 46 8 C 62 3, 80 12, 98 7 C 108 4, 115 9, 118 7"
                stroke="#FFE060"
                strokeWidth="2.8"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.1, delay: 2.9, ease: "easeOut" }}
              />
              {/* Second thinner, offset stroke for "ink" feel */}
              <motion.path
                d="M 5 11.5 C 20 8, 42 14, 65 9.5 C 85 5, 100 11, 116 8.5"
                stroke="rgba(255,200,60,0.45)"
                strokeWidth="1.2"
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.4, delay: 3.1, ease: "easeOut" }}
              />
            </svg>
          </motion.span>
          {" "}with me and explore?
        </motion.p>

      </div>

      {/* ══════════════════════════════════════════════════
          RIGHT-SIDE CTA — stacked, right panel zone
      ══════════════════════════════════════════════════ */}
      <div style={{
        position: "absolute",
        bottom: "clamp(40px, 10vh, 110px)",
        right: "4%",
        display: "flex", flexDirection: "column",
        alignItems: "flex-end",
        gap: "0.2em",
      }}>
        {/* "Come on …" — static */}
        <motion.span
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.4, delay: 3.2, ease: EASE_IN }}
          style={{
            fontFamily: GV, fontSize: "clamp(20px, 2.6vw, 38px)",
            color: "rgba(255,228,120,0.85)", textShadow: DS,
          }}
        >Come on …</motion.span>

        {/* "click anywhere" — pulses */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.25, 1] }}
          transition={{ duration: 2.0, delay: 3.9, repeat: Infinity, repeatType: "loop" }}
          style={{
            fontFamily: GV, fontSize: "clamp(24px, 3.2vw, 50px)",
            color: G2,
            textShadow: "0 0 40px rgba(255,224,96,0.80), " + DS,
          }}
        >click anywhere</motion.span>

        {/* "… let's fly together" — static */}
        <motion.span
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.4, delay: 3.2, ease: EASE_IN }}
          style={{
            fontFamily: GV, fontSize: "clamp(20px, 2.6vw, 38px)",
            color: "rgba(255,228,120,0.85)", textShadow: DS,
          }}
        >… let's fly together</motion.span>
      </div>

    </motion.div>
  );
}

function renderSection(section: string | null) {
  switch (section) {
    case "Meet the Species":         return <MeetSpecies />;
    case "Habitat & Location":       return <Habitat />;
    case "Food Web":                 return <FoodWeb />;
    case "Adaptations":              return <Adaptations />;
    case "Predators":                return <Predators />;
    case "Climate Stressors":        return <ClimateStressors />;
    case "Patterns of Change":       return <PatternsOfChange />;
    case "Human Impact":             return <HumanImpact />;
    case "Conservation & Solutions": return <Conservation />;
    case "Evolution":                return <Evolution />;
    case "Extinction Risk":          return <ExtinctionRisk />;
    case "Sources & Citations":      return <Sources />;
    default:                         return null;
  }
}

type Mode = "landing" | "nav";

type Phase = "splash" | "intro" | "home";

export default function Home() {
  const [phase,         setPhase]         = useState<Phase>("splash");
  const [mode,          setMode]          = useState<Mode>("landing");
  const [exiting,       setExiting]       = useState(false);
  const [autoGroup,     setAutoGroup]     = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Called when user clicks a radial landing circle.
  // 1. Trigger exit animation on the landing (700 ms).
  // 2. Switch to nav mode — DomeNav mounts and auto-opens the chosen group.
  const handleLandingSelect = useCallback((
    _sectionKey: string,
    groupKey: string,
  ) => {
    setExiting(true);
    setTimeout(() => {
      setAutoGroup(groupKey);
      setMode("nav");
    }, 850);
  }, []);

  return (
    <main style={{ position:"relative", minHeight:"100vh", overflow:"hidden" }}>

      {/* Splash → intro → home flow */}
      <AnimatePresence mode="wait">
        {phase === "splash" && (
          <CinematicSplash key="splash" onStart={() => setPhase("intro")} />
        )}
        {phase === "intro" && (
          <CinematicIntro key="intro" onComplete={() => setPhase("home")} />
        )}
      </AnimatePresence>

      {/* Hero background — only shown in nav mode (RadialLanding has its own bg) */}
      {mode === "nav" && <LandingHero />}

      {/* DomeNav — only present after the landing collapse */}
      {mode === "nav" && (
        <DomeNav
          activeSection={activeSection}
          onSelect={setActiveSection}
          onCloseSection={() => setActiveSection(null)}
          autoOpenGroup={autoGroup}
        />
      )}

      {/* RadialLanding — shown on first visit, collapses into DomeNav */}
      <AnimatePresence>
        {phase === "home" && mode === "landing" && (
          <RadialLanding
            key="radial-landing"
            onSelect={handleLandingSelect}
            exiting={exiting}
          />
        )}
      </AnimatePresence>

      {/* Section detail panels — full-screen overlay */}
      <AnimatePresence mode="wait">
        {activeSection && (
          <motion.div
            key={activeSection}
            initial={{ opacity:0, y:24 }}
            animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:-16 }}
            transition={{ duration:0.45, ease:[0.16,1,0.3,1] }}
            style={{ position:"fixed", inset:0, zIndex:9000 }}
          >
            {renderSection(activeSection)}
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
