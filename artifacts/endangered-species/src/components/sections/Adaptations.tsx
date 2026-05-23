import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export function Adaptations() {
  const adaptations = [
    {
      title: "Lobed Feet",
      type: "Physical",
      desc: "Unique lobed toes act as paddles for swimming AND spread weight for walking on floating vegetation.",
      icon: "🦆"
    },
    {
      title: "White Frontal Shield",
      type: "Physical",
      desc: "Highly visible white plate used for communication, mate selection, and territorial signaling; unique among Hawaiian birds.",
      icon: "🛡️"
    },
    {
      title: "Dense Waterproof Plumage",
      type: "Physical",
      desc: "Oil gland preening keeps feathers water-repellent; can dive briefly to escape threats.",
      icon: "🪶"
    },
    {
      title: "Aggressive Nest Defense",
      type: "Behavioral",
      desc: "Attacks intruders far larger than itself; has been documented confronting dogs and humans near nests.",
      icon: "⚔️"
    },
    {
      title: "Floating Nest Building",
      type: "Behavioral",
      desc: "Builds nests anchored to reeds on water surface to protect eggs from ground predators like mongoose.",
      icon: "🪹"
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
          <h1 className="text-5xl font-serif text-foreground mb-4">Endemic Adaptations</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Unique traits developed to survive and thrive in Hawaii's diverse wetland ecosystems.
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