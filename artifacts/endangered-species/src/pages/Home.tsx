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

      {/* ── Only a gentle left panel + bottom strip — no corner darkening ── */}
      {/* Left translucent panel for text legibility without blocking the bird */}
      <div style={{
        position: "absolute", top: 0, left: 0, bottom: 0,
        width: "46%", pointerEvents: "none",
        background: "linear-gradient(to right, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.38) 60%, transparent 100%)",
      }}/>
      {/* Thin bottom strip for the CTA line */}
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 0,
        height: "18%", pointerEvents: "none",
        background: "linear-gradient(to top, rgba(0,0,0,0.68) 0%, transparent 100%)",
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
      ══════════════════════════════════════════════════ */}
      <div style={{
        position: "absolute",
        top: "50%", left: "5%",
        transform: "translateY(-50%)",
        display: "flex", flexDirection: "column",
        alignItems: "flex-start",
        gap: "clamp(8px, 1.4vh, 18px)",
        maxWidth: "38%",
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

        {/* an endangered species */}
        <motion.p
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.6, delay: 1.55, ease: EASE_IN }}
          style={{
            fontFamily: GV, fontSize: "clamp(20px, 2.6vw, 38px)",
            color: "rgba(255,205,90,0.82)", textShadow: DS,
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
            marginTop: "4px",
          }}
        />

        {/* Want to fly with me and explore? — all Great Vibes, "fly" underlined */}
        <motion.p
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.8, delay: 2.4, ease: EASE_IN }}
          style={{
            fontFamily: GV,
            fontSize: "clamp(26px, 3.4vw, 52px)",
            color: "rgba(255,235,160,0.92)", textShadow: DS,
            margin: 0, lineHeight: 1.3,
          }}
        >
          Want to{" "}
          <span style={{
            color: G2,
            textDecoration: "underline",
            textDecorationColor: G2,
            textUnderlineOffset: "5px",
            textDecorationThickness: "1.5px",
            textShadow: "0 0 32px rgba(255,224,96,0.65), " + DS,
          }}>fly</span>
          {" "}with me and explore?
        </motion.p>

      </div>

      {/* ══════════════════════════════════════════════════
          BOTTOM CTA — centred, over the thin dark strip
      ══════════════════════════════════════════════════ */}
      <div style={{
        position: "absolute",
        bottom: "clamp(22px, 4vh, 48px)",
        left: 0, right: 0,
        display: "flex", alignItems: "baseline",
        justifyContent: "center",
        gap: "0.3em", flexWrap: "wrap",
        padding: "0 5%",
      }}>
        {/* "Come on ..." — static */}
        <motion.span
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 3.2, ease: EASE_IN }}
          style={{
            fontFamily: GV, fontSize: "clamp(22px, 2.8vw, 42px)",
            color: "rgba(255,228,120,0.85)", textShadow: DS,
          }}
        >Come on …</motion.span>

        {/* "click anywhere" — pulses */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.3, 1] }}
          transition={{ duration: 2.0, delay: 3.9, repeat: Infinity, repeatType: "loop" }}
          style={{
            fontFamily: GV, fontSize: "clamp(26px, 3.4vw, 52px)",
            color: G2,
            textShadow: "0 0 36px rgba(255,224,96,0.70), " + DS,
          }}
        >click anywhere</motion.span>

        {/* "… let's fly together" — static */}
        <motion.span
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 3.2, ease: EASE_IN }}
          style={{
            fontFamily: GV, fontSize: "clamp(22px, 2.8vw, 42px)",
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
