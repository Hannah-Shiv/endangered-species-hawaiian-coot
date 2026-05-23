import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export function MeetSpecies() {
  const facts = [
    "Can leap up to 9 meters (30 feet) in a single bound",
    "Thick tails aid balance and wrap around face for warmth",
    "Estimated 4,000–6,500 remaining in the wild",
    "Found across 12 countries in Central Asia",
    "Cannot roar — uses a 'chuffing' sound called a prusten"
  ];

  return (
    <div className="w-full min-h-screen pt-24 pb-12 px-6 md:px-12 bg-background overflow-y-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-serif text-primary mb-6">Meet the Species</h1>
          <h2 className="text-2xl font-serif text-muted-foreground mb-8 italic">Panthera uncia</h2>
          
          <div className="space-y-4 mb-12">
            {facts.map((fact, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 + 0.5 }}
              >
                <Card className="bg-card/50 border-primary/20 hover:border-primary/50 transition-colors">
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                      {idx + 1}
                    </div>
                    <p className="text-foreground/90">{fact}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="bg-card/30 p-6 rounded-lg border border-border">
            <h3 className="text-xl font-medium mb-4 text-accent">Scientific Classification</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Kingdom: Animalia<br/>
              Phylum: Chordata<br/>
              Class: Mammalia<br/>
              Order: Carnivora<br/>
              Family: Felidae<br/>
              Genus: Panthera<br/>
              Species: P. uncia
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative"
        >
          <div className="aspect-square rounded-2xl overflow-hidden border-2 border-primary/30 shadow-2xl relative">
            <img src="/src/assets/portrait.png" alt="Snow Leopard Portrait" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex flex-col justify-end p-8">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-black/50 backdrop-blur p-4 rounded-lg">
                  <div className="text-3xl font-bold text-primary">~4,500</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Wild Population</div>
                </div>
                <div className="bg-black/50 backdrop-blur p-4 rounded-lg">
                  <div className="text-3xl font-bold text-accent">12</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Countries</div>
                </div>
                <div className="bg-black/50 backdrop-blur p-4 rounded-lg">
                  <div className="text-2xl font-bold text-primary">3-4.5k m</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Elevation Range</div>
                </div>
                <div className="bg-black/50 backdrop-blur p-4 rounded-lg">
                  <div className="text-3xl font-bold text-accent">35-55</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">kg Weight</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
