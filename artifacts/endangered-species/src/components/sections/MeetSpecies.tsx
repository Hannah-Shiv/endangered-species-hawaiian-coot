import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import portraitImg from "@/assets/species-portrait.png";

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
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-serif text-primary mb-6">Meet the Species</h1>
          <h2 className="text-2xl font-serif text-muted-foreground mb-8 italic">Fulica alai</h2>
          
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
              Class: Aves<br/>
              Order: Gruiformes<br/>
              Family: Rallidae<br/>
              Genus: Fulica<br/>
              Species: F. alai
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
            <img src={portraitImg} alt="Hawaiian Coot Portrait" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex flex-col justify-end p-8">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-black/50 backdrop-blur p-4 rounded-lg">
                  <div className="text-3xl font-bold text-primary">~3,500</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Wild Population</div>
                </div>
                <div className="bg-black/50 backdrop-blur p-4 rounded-lg">
                  <div className="text-3xl font-bold text-accent">1</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Endemic Chain</div>
                </div>
                <div className="bg-black/50 backdrop-blur p-4 rounded-lg">
                  <div className="text-2xl font-bold text-primary">0-1.2k m</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Elevation Range</div>
                </div>
                <div className="bg-black/50 backdrop-blur p-4 rounded-lg">
                  <div className="text-3xl font-bold text-accent">390-650</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">g Weight</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}