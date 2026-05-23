import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export function Predators() {
  return (
    <div className="w-full min-h-screen pt-24 pb-12 px-6 md:px-12 bg-background overflow-y-auto">
      <div className="max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-serif text-destructive mb-4">Predators & Invasive Threats</h1>
          <p className="text-xl text-muted-foreground">
            The Hawaiian Coot evolved without terrestrial predators. The introduction of invasive species has had devastating effects on their population.
          </p>
        </motion.div>

        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-destructive/10 border-destructive/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-destructive/20 rounded-bl-full blur-2xl" />
              <CardContent className="p-8 flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center shrink-0 border border-destructive/50">
                  <span className="text-destructive font-bold text-xl">1</span>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold text-destructive">Mongoose</h3>
                    <span className="px-2 py-1 bg-destructive text-destructive-foreground text-xs font-bold rounded uppercase">High Threat</span>
                  </div>
                  <p className="text-foreground/80">Introduced in 1883, mongoose devastate ground and low nests, taking both eggs and chicks.</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-destructive/10 border-destructive/30 relative overflow-hidden">
              <CardContent className="p-8 flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center shrink-0 border border-destructive/50">
                  <span className="text-destructive font-bold text-xl">2</span>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold text-destructive">Rats & Feral Cats</h3>
                    <span className="px-2 py-1 bg-destructive text-destructive-foreground text-xs font-bold rounded uppercase">High Threat</span>
                  </div>
                  <p className="text-foreground/80">Nocturnal nest raiders and direct predators that are widespread throughout the Hawaiian Islands.</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <Card className="bg-card/50 border-border">
              <CardContent className="p-8 flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0 border border-orange-500/50">
                  <span className="text-orange-500 font-bold text-xl">3</span>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold text-foreground">Dogs</h3>
                    <span className="px-2 py-1 bg-orange-500/20 text-orange-500 border border-orange-500/50 text-xs font-bold rounded uppercase">Medium Threat</span>
                  </div>
                  <p className="text-muted-foreground">Domestic and feral dogs disturb and attack nesting birds in wetland areas.</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
            <Card className="bg-card/50 border-border">
              <CardContent className="p-8 flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0 border border-orange-500/50">
                  <span className="text-orange-500 font-bold text-xl">4</span>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold text-foreground">Bullfrogs</h3>
                    <span className="px-2 py-1 bg-orange-500/20 text-orange-500 border border-orange-500/50 text-xs font-bold rounded uppercase">Medium Threat</span>
                  </div>
                  <p className="text-muted-foreground">Invasive bullfrogs compete for food and may take small coot chicks.</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
            <Card className="bg-card/50 border-border">
              <CardContent className="p-8 flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0 border border-yellow-500/50">
                  <span className="text-yellow-500 font-bold text-xl">5</span>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold text-foreground">Night Heron</h3>
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 text-xs font-bold rounded uppercase">Low Threat</span>
                  </div>
                  <p className="text-muted-foreground">The Black-crowned Night Heron is a natural predator that occasionally preys on coot eggs and chicks.</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}