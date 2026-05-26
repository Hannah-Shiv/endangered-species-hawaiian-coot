import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import portraitImg from "@/assets/species-portrait.png";
import sciClassImg from "@assets/image_1779762468352.png";

export function MeetSpecies() {
  const facts = [
    "The Hawaiian Coot is endemic to Hawaii — found nowhere else on Earth naturally",
    "Their distinctive bright white frontal shield varies in size and can be bright red in some individuals — scientists believe it signals social status",
    "Population crashed to fewer than 1,000 birds by the 1970s — recovery efforts brought them back to ~4,000 today",
    "Unlike most waterbirds, Hawaiian Coots are highly territorial and will fiercely defend nesting territory even from much larger birds",
    "Chicks have bright orange-red heads — bold coloring may stimulate parental feeding instincts"
  ];

  return (
    <div className="w-full min-h-screen pt-24 pb-12 px-6 md:px-12 bg-background overflow-y-auto">
      <div className="max-w-7xl mx-auto">

        {/* ── Two-column top section ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-10">

          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl uppercase mb-6" style={{ fontFamily: "'Josefin Sans', sans-serif", letterSpacing: "0.1em", color: "rgba(212,175,55,1)" }}>
              Meet the Species
            </h1>
            <h2 className="text-2xl mb-8 italic" style={{ fontFamily: "'Playfair Display', serif", color: "rgba(212,175,55,0.75)" }}>
              Fulica alai
            </h2>

            <div className="space-y-4">
              {facts.map((fact, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 + 0.5 }}
                >
                  <Card
                    className="transition-colors border-0"
                    style={{ background: "rgba(3,5,14,0.95)", borderLeft: "4px solid rgba(193,18,31,0.8)" }}
                  >
                    <CardContent className="p-4 flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold" style={{ background: "rgba(212,175,55,0.2)", color: "rgba(212,175,55,1)", fontFamily: "'Josefin Sans', sans-serif" }}>
                        {idx + 1}
                      </div>
                      <p className="text-foreground/90 text-lg leading-relaxed" style={{ fontFamily: "'Playfair Display', serif" }}>{fact}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative mt-16 lg:mt-0"
          >
            <div className="aspect-square rounded-2xl overflow-hidden border-2 shadow-2xl relative" style={{ borderColor: "rgba(193,18,31,0.5)" }}>
              <img src={portraitImg} alt="Hawaiian Coot Portrait" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/95 to-transparent flex flex-col justify-end p-8">
                <div className="grid grid-cols-2 gap-4 text-center" style={{ gridAutoRows: "1fr" }}>
                  {[
                    { value: "~3,500", label: "Wild Population", color: "rgba(193,18,31,1)" },
                    { value: "1",       label: "Endemic Chain",    color: "rgba(212,175,55,1)" },
                    { value: "0-1.2k m",label: "Elevation Range", color: "rgba(193,18,31,1)" },
                    { value: "390-650", label: "g Weight",         color: "rgba(212,175,55,1)" },
                  ].map(({ value, label, color }) => (
                    <div key={label} className="p-4 rounded-lg border flex flex-col items-center justify-center" style={{ background: "rgba(3,5,14,0.85)", borderColor: "rgba(212,175,55,0.2)" }}>
                      <div className="text-3xl font-bold" style={{ color }}>{value}</div>
                      <div className="text-xs uppercase tracking-wider mt-1" style={{ color: "rgba(212,175,55,0.8)", fontFamily: "'Josefin Sans', sans-serif" }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Full-width classification image spanning both columns ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <img src={sciClassImg} alt="Scientific Classification" className="w-full rounded-xl" />
        </motion.div>

      </div>
    </div>
  );
}
