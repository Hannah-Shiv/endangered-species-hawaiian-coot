import { useState } from "react";
import { LandingHero } from "@/components/LandingHero";
import { DomeNav } from "@/components/DomeNav";
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

export default function Home() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-hidden">
      {/* Hero is always the backdrop */}
      <LandingHero />

      {/* Dome nav is always fixed at top */}
      <DomeNav
        activeSection={activeSection}
        onSelect={setActiveSection}
        onCloseSection={() => setActiveSection(null)}
      />

      {/* Section panels as overlay */}
      <AnimatePresence mode="wait">
        {activeSection && (
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[9000]"
          >
            {renderSection(activeSection)}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
