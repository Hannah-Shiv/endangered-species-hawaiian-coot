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

// ─── Splash screen — captures the user gesture so audio can autoplay ──────────
function CinematicSplash({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      key="splash"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.7 } }}
      transition={{ duration: 1.4 }}
      onClick={onStart}
      style={{
        position: "fixed", inset: 0, zIndex: 9990,
        background: "#020608", cursor: "pointer",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Atmospheric radial glow behind the bird */}
      <div style={{
        position: "absolute",
        top: "50%", left: "50%",
        transform: "translate(-50%, -52%)",
        width: "clamp(440px, 62vw, 820px)",
        height: "clamp(440px, 62vw, 820px)",
        borderRadius: "50%",
        background: "radial-gradient(ellipse at center, rgba(255,224,96,0.09) 0%, rgba(255,200,64,0.04) 40%, transparent 72%)",
        pointerEvents: "none",
      }}/>

      {/* ── Hawaiian Coot title ── */}
      <motion.div
        initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2.0, delay: 0.3, ease: EASE_IN }}
        style={{
          fontFamily: "'Playfair Display', serif",
          fontStyle: "italic", fontWeight: 300,
          fontSize: "clamp(28px, 3.8vw, 54px)",
          color: G2, letterSpacing: "0.18em",
          textShadow: SHADOW,
          marginBottom: "clamp(14px, 2.2vh, 28px)",
        }}
      >Hawaiian Coot</motion.div>

      {/* ── Bird image — gently floating ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.93 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.2, delay: 0.5, ease: EASE_IN }}
        style={{ position: "relative" }}
      >
        {/* Soft gold reflection under the bird */}
        <div style={{
          position: "absolute", bottom: "-18px", left: "50%",
          transform: "translateX(-50%)",
          width: "70%", height: "28px",
          background: "radial-gradient(ellipse, rgba(255,224,96,0.18) 0%, transparent 70%)",
          filter: "blur(6px)",
          pointerEvents: "none",
        }}/>

        <motion.img
          src={cootPhoto as string}
          alt="Hawaiian Coot"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 5.0, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: "clamp(180px, 24vw, 360px)",
            height: "clamp(180px, 24vw, 360px)",
            borderRadius: "50%",
            objectFit: "cover",
            objectPosition: "center 30%",
            boxShadow: [
              "0 0 0 1.5px rgba(255,224,96,0.25)",
              "0 0 56px 16px rgba(255,200,64,0.10)",
              "0 8px 80px rgba(0,0,0,0.88)",
            ].join(", "),
            display: "block",
          }}
        />
      </motion.div>

      {/* ── Gold rule ── */}
      <motion.div
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        transition={{ duration: 1.1, delay: 1.2, ease: EASE_IN }}
        style={{
          height: "1px", width: "clamp(60px, 8vw, 100px)",
          background: `linear-gradient(to right, transparent, ${G2}, transparent)`,
          margin: "clamp(18px, 2.8vh, 32px) auto",
          transformOrigin: "center",
        }}
      />

      {/* ── "tap anywhere to fly with me over Hawaii" ── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.8, delay: 1.5, ease: EASE_IN }}
        style={{
          display: "flex", alignItems: "baseline",
          gap: "0.22em", flexWrap: "wrap", justifyContent: "center",
          textShadow: SHADOW,
        }}
      >
        {/* "tap anywhere to " */}
        <span style={{
          fontFamily: "'Playfair Display', serif",
          fontStyle: "italic", fontWeight: 300,
          fontSize: "clamp(14px, 1.6vw, 22px)",
          color: "rgba(255,224,96,0.72)",
          letterSpacing: "0.06em",
        }}>tap anywhere to</span>

        {/* "fly" — Great Vibes calligraphic script */}
        <span style={{
          fontFamily: "'Great Vibes', cursive",
          fontSize: "clamp(38px, 5.2vw, 74px)",
          color: G2,
          letterSpacing: "0.02em",
          lineHeight: 1,
          textShadow: [
            "0 0 32px rgba(255,224,96,0.55)",
            "0 2px 60px rgba(0,0,0,0.95)",
          ].join(", "),
        }}>fly</span>

        {/* "with me over Hawaii" */}
        <span style={{
          fontFamily: "'Playfair Display', serif",
          fontStyle: "italic", fontWeight: 300,
          fontSize: "clamp(14px, 1.6vw, 22px)",
          color: "rgba(255,224,96,0.72)",
          letterSpacing: "0.06em",
        }}>with me over Hawaii</span>
      </motion.div>

      {/* Pulsing arrow hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.35, 0, 0.35] }}
        transition={{ duration: 2.8, delay: 2.6, repeat: Infinity }}
        style={{
          marginTop: "clamp(18px, 2.8vh, 32px)",
          fontFamily: "'Playfair Display', serif",
          fontStyle: "italic",
          fontSize: "clamp(11px, 1.1vw, 14px)",
          color: "rgba(255,224,96,0.40)",
          letterSpacing: "0.28em",
        }}
      >· · ·</motion.div>
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
