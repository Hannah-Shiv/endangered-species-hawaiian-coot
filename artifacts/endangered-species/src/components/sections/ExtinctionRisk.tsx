// ─── Extinction Risk ──────────────────────────────────────────────────────────
// Displays the Hawaiian Coot's IUCN Red List status (Vulnerable).
// Shows: threat matrix with progress bars, population timeline, and risk factors.
// Previously listed as Endangered — downlisted after partial recovery.
// ─────────────────────────────────────────────────────────────────────────────
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
          className="text-center mb-12"
        >
          <h1
            className="text-6xl mb-3"
            style={{ fontFamily: "'Playfair Display', serif", color: "rgba(212,175,55,1)", letterSpacing: "0.04em" }}
          >
            Extinction Risk
          </h1>
          <p
            style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic",
              fontSize: 20,
              color: "rgba(212,175,55,0.88)",
              margin: "0 auto 24px",
            }}
          >
            Downlisted from Endangered after partial recovery, but still entirely dependent on conservation management.
          </p>
          <div className="inline-block px-4 py-1 rounded-full bg-secondary text-secondary-foreground font-bold tracking-widest text-sm border border-secondary/50">
            IUCN RED LIST STATUS
          </div>
          <div
            className="font-serif tracking-tighter mt-4"
            style={{ fontSize: "5rem", color: "rgba(220,50,30,1)", lineHeight: 1 }}
          >
            VULNERABLE
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <Card className="bg-card/50 border-border">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold mb-6 text-foreground">Threat Matrix</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Habitat Loss</span>
                    <span className="text-destructive font-bold">HIGH</span>
                  </div>
                  <Progress value={85} className="h-2 [&>div]:bg-destructive" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Invasive Predators</span>
                    <span className="text-destructive font-bold">HIGH</span>
                  </div>
                  <Progress value={80} className="h-2 [&>div]:bg-destructive" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Climate Change</span>
                    <span className="text-destructive font-bold">MED-HIGH</span>
                  </div>
                  <Progress value={70} className="h-2 [&>div]:bg-destructive" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Disease</span>
                    <span className="text-accent font-bold">MEDIUM</span>
                  </div>
                  <Progress value={50} className="h-2 [&>div]:bg-accent" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Human Disturbance</span>
                    <span className="text-accent font-bold">MEDIUM</span>
                  </div>
                  <Progress value={45} className="h-2 [&>div]:bg-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-destructive/10 border-destructive/30 flex flex-col justify-center items-center text-center p-8">
            <h3 className="text-2xl font-serif text-destructive mb-4">A Fragile Balance</h3>
            <p className="text-foreground font-bold mb-2">Only ~3,200 Hawaiian Coots remain.</p>
            <p className="text-muted-foreground mb-8">One major hurricane season or severe prolonged drought could reduce the population by 30%.</p>
            
            {/* Visual representation - approx 320 dots, 1 dot = 10 birds */}
            <div className="w-full max-w-xs grid grid-cols-20 gap-1 opacity-60">
              {Array.from({ length: 320 }).map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary" />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4">Each dot represents ~10 birds</p>
          </Card>
        </div>
      </div>
    </div>
  );
}