import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const sections = [
  "Meet the Species",
  "Habitat & Location",
  "Food Web",
  "Adaptations",
  "Predators",
  "Climate Stressors",
  "Patterns of Change",
  "Human Impact",
  "Conservation & Solutions",
  "Evolution",
  "Extinction Risk",
  "Sources & Citations"
];

interface RadialNavProps {
  activeSection: string | null;
  onSelect: (section: string | null) => void;
}

export function RadialNav({ activeSection, onSelect }: RadialNavProps) {
  const [isMini, setIsMini] = useState(false);

  useEffect(() => {
    setIsMini(activeSection !== null);
  }, [activeSection]);

  if (isMini) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full w-14 h-14 bg-card/80 backdrop-blur border-primary/50 hover:bg-primary/20 hover:scale-110 transition-all shadow-lg"
          onClick={() => onSelect(null)}
          data-testid="button-back-to-nav"
        >
          <X className="w-6 h-6 text-foreground" />
        </Button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-40 flex items-center justify-center bg-background/95 backdrop-blur-md"
    >
      <div className="relative w-full max-w-4xl aspect-square max-h-[90vh] flex items-center justify-center">
        {/* Center Image */}
        <div className="absolute z-10 w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-primary/30 shadow-[0_0_50px_rgba(var(--primary),0.2)]">
          <img src="/src/assets/silhouette.png" alt="Hawaiian Coot" className="w-full h-full object-cover opacity-80" />
        </div>
        
        {/* Radial Buttons */}
        {sections.map((section, i) => {
          const angle = (i * (360 / sections.length)) * (Math.PI / 180);
          // Calculate responsive radius based on viewport might be needed, using fixed percentages here
          const radius = "35%";
          const x = `calc(${Math.cos(angle - Math.PI/2)} * ${radius})`;
          const y = `calc(${Math.sin(angle - Math.PI/2)} * ${radius})`;

          return (
            <motion.button
              key={section}
              className="absolute w-32 h-32 md:w-40 md:h-40 flex items-center justify-center text-center p-4 rounded-full border border-border/50 bg-card/50 backdrop-blur hover:bg-primary/20 hover:border-primary hover:text-primary-foreground transition-colors group"
              style={{ left: "50%", top: "50%", x: "-50%", y: "-50%", transform: `translate(${x}, ${y})` }}
              whileHover={{ scale: 1.1 }}
              onClick={() => onSelect(section)}
              data-testid={`button-nav-${section.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
            >
              <span className="text-xs md:text-sm font-medium leading-tight group-hover:text-primary drop-shadow-md">
                {section}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
