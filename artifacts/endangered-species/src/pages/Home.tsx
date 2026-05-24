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
  const PF = "'Playfair Display', serif";
  const GV = "'Great Vibes', cursive";
  const DS = "0 2px 24px rgba(0,0,0,0.98), 0 0 60px rgba(0,0,0,0.95), 0 1px 8px rgba(0,0,0,0.90)";
  const DS2 = "0 0 40px rgba(255,224,96,0.6), 0 2px 24px rgba(0,0,0,0.98)";

  return (
    <motion.div
      key="splash"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8 } }}
      transition={{ duration: 1.8 }}
      onClick={onStart}
      style={{
        position: "fixed", inset: 0, zIndex: 9990,
        cursor: "pointer", overflow: "hidden",
      }}
    >
      {/* ── Full-screen bird photo ── */}
      <motion.img
        src={cootPhoto as string}
        alt="Hawaiian Coot"
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          objectFit: "cover", objectPosition: "center 45%",
          transformOrigin: "center",
        }}
      />

      {/* ── Dark cinematic overlays for depth + text readability ── */}
      {/* Top vignette */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.08) 30%, rgba(0,0,0,0.10) 55%, rgba(0,0,0,0.82) 78%, rgba(0,0,0,0.97) 100%)",
      }}/>
      {/* Side vignettes */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "linear-gradient(to right, rgba(0,0,0,0.40) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.40) 100%)",
      }}/>

      {/* ── Subtle gold shimmer ripple over the water ── */}
      <motion.div
        animate={{ opacity: [0.0, 0.06, 0.0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 60% 30% at 52% 58%, rgba(255,218,60,0.18) 0%, transparent 70%)",
        }}
      />

      {/* ── Text block — lower center ── */}
      <div style={{
        position: "absolute",
        bottom: "clamp(40px, 8vh, 90px)",
        left: 0, right: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center",
        gap: "clamp(10px, 1.8vh, 20px)",
        padding: "0 6%",
      }}>

        {/* Greeting line */}
        <motion.p
          initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, delay: 0.6, ease: EASE_IN }}
          style={{
            fontFamily: PF, fontStyle: "italic", fontWeight: 300,
            fontSize: "clamp(18px, 2.2vw, 32px)",
            color: "rgba(255,235,160,0.88)",
            letterSpacing: "0.04em", lineHeight: 1.3,
            textShadow: DS, margin: 0, textAlign: "center",
          }}
        >Hi, I am</motion.p>

        {/* "Hawaiian Coot" — large, proud */}
        <motion.p
          initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8, delay: 1.0, ease: EASE_IN }}
          style={{
            fontFamily: PF, fontStyle: "italic", fontWeight: 400,
            fontSize: "clamp(38px, 6.5vw, 96px)",
            color: G2, letterSpacing: "0.08em", lineHeight: 1.0,
            textShadow: "0 0 60px rgba(255,224,96,0.45), " + DS,
            margin: 0, textAlign: "center",
          }}
        >Hawaiian Coot</motion.p>

        {/* Species badge */}
        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, delay: 1.5, ease: EASE_IN }}
          style={{
            fontFamily: PF, fontStyle: "italic", fontWeight: 300,
            fontSize: "clamp(14px, 1.6vw, 22px)",
            color: "rgba(255,200,80,0.75)", letterSpacing: "0.14em",
            textShadow: DS, margin: 0, textAlign: "center",
          }}
        >an endangered species</motion.p>

        {/* Thin gold rule */}
        <motion.div
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: 1.0, delay: 2.0, ease: EASE_IN }}
          style={{
            height: "1px",
            width: "clamp(80px, 12vw, 160px)",
            background: `linear-gradient(to right, transparent, ${G2} 30%, ${G2} 70%, transparent)`,
            transformOrigin: "center",
          }}
        />

        {/* "Want to fly with me and explore?" */}
        <motion.div
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8, delay: 2.3, ease: EASE_IN }}
          style={{
            display: "flex", alignItems: "baseline",
            flexWrap: "wrap", justifyContent: "center",
            gap: "0 0.25em",
          }}
        >
          <span style={{ fontFamily: PF, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(15px, 1.8vw, 26px)", color: "rgba(255,235,160,0.85)", textShadow: DS }}>
            Want to
          </span>
          <span style={{ fontFamily: GV, fontSize: "clamp(44px, 6vw, 84px)", color: G2, lineHeight: 1, textShadow: DS2 }}>
            fly
          </span>
          <span style={{ fontFamily: PF, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(15px, 1.8vw, 26px)", color: "rgba(255,235,160,0.85)", textShadow: DS }}>
            with me and explore?
          </span>
        </motion.div>

        {/* "Come on...let's go..." */}
        <motion.p
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, delay: 3.0, ease: EASE_IN }}
          style={{
            fontFamily: PF, fontStyle: "italic", fontWeight: 300,
            fontSize: "clamp(16px, 1.9vw, 28px)",
            color: "rgba(255,218,100,0.80)", letterSpacing: "0.05em",
            textShadow: DS, margin: 0, textAlign: "center",
          }}
        >Come on… let's go…</motion.p>

        {/* Pulsing CTA */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.6, 0.22, 0.6] }}
          transition={{ duration: 2.2, delay: 3.8, repeat: Infinity, repeatType: "loop" }}
          style={{
            fontFamily: PF, fontStyle: "italic", fontWeight: 300,
            fontSize: "clamp(11px, 1.2vw, 16px)",
            color: "rgba(255,224,96,0.55)",
            letterSpacing: "0.30em",
            textShadow: DS, margin: 0, textAlign: "center",
          }}
        >· · · click anywhere · · ·</motion.p>

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
