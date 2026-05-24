import { useState, useCallback } from "react";
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

// ─── Splash screen — captures the user gesture so audio can autoplay ──────────
function CinematicSplash({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      key="splash"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2 }}
      onClick={onStart}
      style={{
        position: "fixed", inset: 0, zIndex: 9990,
        background: "#000", cursor: "pointer",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}
    >
      {/* Species name */}
      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.8, delay: 0.4, ease: EASE_IN }}
        style={{
          fontFamily: "'Playfair Display', serif",
          fontStyle: "italic", fontWeight: 300,
          fontSize: "clamp(48px, 7.5vw, 108px)",
          color: G2, letterSpacing: "0.09em",
          textShadow: SHADOW,
        }}
      >Hawaiian Coot</motion.div>

      {/* Gold rule */}
      <motion.div
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        transition={{ duration: 1.0, delay: 1.0, ease: EASE_IN }}
        style={{
          height: "1px", width: "80px",
          background: G2, margin: "28px auto",
          transformOrigin: "center",
        }}
      />

      {/* Pulsing "tap to begin" */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.55, 0.28, 0.55] }}
        transition={{ duration: 2.4, delay: 1.6, repeat: Infinity, repeatType: "reverse" }}
        style={{
          fontFamily: "'Playfair Display', serif",
          fontStyle: "italic", fontWeight: 300,
          fontSize: "clamp(13px, 1.3vw, 17px)",
          color: G2, letterSpacing: "0.22em",
          textShadow: SHADOW,
        }}
      >tap anywhere to begin</motion.div>
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
        {mode === "landing" && (
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
