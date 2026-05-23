import { useState } from "react";
import { LandingHero } from "@/components/LandingHero";
import { RadialNav } from "@/components/RadialNav";
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

export default function Home() {
  const [entered, setEntered] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const renderSection = () => {
    switch (activeSection) {
      case "Meet the Species": return <MeetSpecies />;
      case "Habitat & Location": return <Habitat />;
      case "Food Web": return <FoodWeb />;
      case "Adaptations": return <Adaptations />;
      case "Predators": return <Predators />;
      case "Climate Stressors": return <ClimateStressors />;
      case "Patterns of Change": return <PatternsOfChange />;
      case "Human Impact": return <HumanImpact />;
      case "Conservation & Solutions": return <Conservation />;
      case "Evolution": return <Evolution />;
      case "Extinction Risk": return <ExtinctionRisk />;
      case "Sources & Citations": return <Sources />;
      default: return null;
    }
  };

  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <AnimatePresence>
        {!entered ? (
          <motion.div 
            key="hero"
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-50"
          >
            <LandingHero onEnter={() => setEntered(true)} />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="w-full h-full"
          >
            <AnimatePresence>
              {activeSection === null && (
                <RadialNav activeSection={activeSection} onSelect={setActiveSection} />
              )}
            </AnimatePresence>
            
            <AnimatePresence mode="wait">
              {activeSection && (
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 z-30"
                >
                  {renderSection()}
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Always mount RadialNav for the close button if a section is active */}
            {activeSection !== null && (
              <RadialNav activeSection={activeSection} onSelect={setActiveSection} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
