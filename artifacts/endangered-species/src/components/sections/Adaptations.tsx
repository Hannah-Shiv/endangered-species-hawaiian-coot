import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export function Adaptations() {
  const adaptations = [
    {
      title: "Thick Fur",
      type: "Physical",
      desc: "7cm thick in winter. Keeps them warm in temperatures that plummet to -40°C.",
      icon: "❄️"
    },
    {
      title: "Enlarged Nasal Cavities",
      type: "Physical",
      desc: "Warms the thin, freezing mountain air before it reaches their lungs.",
      icon: "🫁"
    },
    {
      title: "Wide Paws",
      type: "Physical",
      desc: "Act as natural snowshoes to distribute weight on snow and provide grip on rocky cliffs.",
      icon: "🐾"
    },
    {
      title: "Long Thick Tail",
      type: "Physical",
      desc: "80–105cm long. Crucial for balance on precipices and acts as a built-in scarf for their face when resting.",
      icon: "🐈"
    },
    {
      title: "Crepuscular Hunting",
      type: "Behavioral",
      desc: "Most active at dawn and dusk, using the fading light and their camouflage to ambush prey.",
      icon: "🌅"
    }
  ];

  return (
    <div className="w-full min-h-screen pt-24 pb-12 px-6 md:px-12 bg-background overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-serif text-foreground mb-4">Evolutionary Perfection</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Millions of years of adaptation have created the ultimate high-altitude predator.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adaptations.map((adapt, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.15 }}
            >
              <Card className="h-full bg-card/30 border-border hover:border-primary/50 transition-colors group cursor-default">
                <CardContent className="p-8">
                  <div className="text-4xl mb-4 grayscale group-hover:grayscale-0 transition-all">{adapt.icon}</div>
                  <div className="text-xs font-bold uppercase tracking-wider text-accent mb-2">{adapt.type}</div>
                  <h3 className="text-2xl font-serif text-foreground mb-4">{adapt.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{adapt.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
