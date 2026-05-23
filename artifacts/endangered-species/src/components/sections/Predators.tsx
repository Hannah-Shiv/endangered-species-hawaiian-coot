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
          <h1 className="text-5xl font-serif text-destructive mb-4">Predators & Competition</h1>
          <p className="text-xl text-muted-foreground">
            As apex predators, adult snow leopards have no natural predators in the animal kingdom. Their threats come from competition—and from us.
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
                    <h3 className="text-2xl font-bold text-destructive">Humans</h3>
                    <span className="px-2 py-1 bg-destructive text-destructive-foreground text-xs font-bold rounded uppercase">Lethal Threat</span>
                  </div>
                  <p className="text-foreground/80">The only significant predator of snow leopards. Poaching for fur and bones, and retaliatory killings by herders, are the leading causes of unnatural death.</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <Card className="bg-card/50 border-border">
              <CardContent className="p-8 flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0 border border-orange-500/50">
                  <span className="text-orange-500 font-bold text-xl">2</span>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold text-foreground">Mountain Wolves</h3>
                    <span className="px-2 py-1 bg-orange-500/20 text-orange-500 border border-orange-500/50 text-xs font-bold rounded uppercase">Competitor</span>
                  </div>
                  <p className="text-muted-foreground">They share the same habitat and prey on the same ungulates. While they rarely fight directly, they compete fiercely for limited food resources.</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
            <Card className="bg-card/50 border-border">
              <CardContent className="p-8 flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0 border border-yellow-500/50">
                  <span className="text-yellow-500 font-bold text-xl">3</span>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold text-foreground">Brown Bears</h3>
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 text-xs font-bold rounded uppercase">Occasional Threat</span>
                  </div>
                  <p className="text-muted-foreground">Himalayan brown bears may occasionally steal kills from snow leopards, and pose a severe threat to unprotected snow leopard cubs left in dens.</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
