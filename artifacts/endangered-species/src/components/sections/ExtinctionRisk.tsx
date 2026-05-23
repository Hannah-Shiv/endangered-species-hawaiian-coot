import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function ExtinctionRisk() {
  return (
    <div className="w-full min-h-screen pt-24 pb-12 px-6 md:px-12 bg-background overflow-y-auto">
      <div className="max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-1 mb-6 rounded-full bg-secondary text-secondary-foreground font-bold tracking-widest text-sm border border-secondary/50">
            IUCN RED LIST STATUS
          </div>
          <h1 className="text-6xl md:text-8xl font-serif text-destructive mb-4 tracking-tighter">VULNERABLE</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Downlisted from "Endangered" in 2017—but the threat remains severe. The population is still declining.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <Card className="bg-card/50 border-border">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold mb-6 text-foreground">Threat Matrix</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Habitat Loss (Climate Change)</span>
                    <span className="text-destructive font-bold">CRITICAL</span>
                  </div>
                  <Progress value={90} className="h-2 [&>div]:bg-destructive" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Poaching & Retaliation</span>
                    <span className="text-destructive font-bold">HIGH</span>
                  </div>
                  <Progress value={75} className="h-2 [&>div]:bg-destructive" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Prey Decline</span>
                    <span className="text-accent font-bold">MEDIUM</span>
                  </div>
                  <Progress value={60} className="h-2 [&>div]:bg-accent" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Infrastructure (Roads/Mining)</span>
                    <span className="text-accent font-bold">MEDIUM</span>
                  </div>
                  <Progress value={50} className="h-2 [&>div]:bg-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-destructive/10 border-destructive/30 flex flex-col justify-center items-center text-center p-8">
            <h3 className="text-2xl font-serif text-destructive mb-4">What ~4,500 Looks Like</h3>
            <p className="text-muted-foreground mb-8">If every living wild snow leopard was put in one stadium, it would only fill about 10% of the seats.</p>
            
            {/* Visual representation of 4500 - using a condensed dot grid */}
            <div className="w-full max-w-xs grid grid-cols-20 gap-1 opacity-50">
              {Array.from({ length: 400 }).map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary" />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4">Each dot represents ~11 leopards</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
