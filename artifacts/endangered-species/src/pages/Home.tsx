import { useState, useCallback } from "react";
import { LandingHero } from "@/components/LandingHero";
import { DomeNav } from "@/components/DomeNav";
import { RadialLanding } from "@/components/RadialLanding";
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

export default function Home() {
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
