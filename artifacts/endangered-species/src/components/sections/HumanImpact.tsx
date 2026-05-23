import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function HumanImpact() {
  return (
    <div className="w-full min-h-screen pt-24 pb-12 px-6 md:px-12 bg-background overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-serif text-foreground mb-4">Human Impact</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The story of the snow leopard is intimately tied to the people who share its mountains. It is a story of conflict, but also of coexistence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* HARM */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <h2 className="text-4xl font-serif text-destructive border-b border-destructive/30 pb-4">Harm</h2>
            
            <Card className="bg-destructive/10 border-destructive/20">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-destructive mb-2">Retaliatory Killing</h3>
                <p className="text-foreground/80">As wild prey declines, leopards hunt domestic livestock. For a herder, losing a single yak can mean losing months of income. In retaliation, leopards are often poisoned, trapped, or shot. This accounts for over 50% of unnatural deaths.</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-2">Poaching & Illegal Trade</h3>
                <p className="text-muted-foreground">Hunted for their magnificent pelts and for bones used in traditional medicines as a substitute for tiger bones.</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-2">Habitat Fragmentation</h3>
                <p className="text-muted-foreground">New roads, mining operations, and border fences physically divide populations, reducing genetic diversity and access to prey.</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* HOPE */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            <h2 className="text-4xl font-serif text-primary border-b border-primary/30 pb-4">Hope</h2>
            
            <Card className="bg-primary/10 border-primary/20">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-primary mb-2">Community Insurance</h3>
                <p className="text-foreground/80">Conservationists partner with local villages to create livestock insurance programs. Herders pay a small premium; if a leopard kills their animal, they are compensated. Retaliatory killings drop to near zero in these areas.</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-2">Predator-Proof Corrals</h3>
                <p className="text-muted-foreground">Upgrading night pens with wire mesh roofs prevents "surplus killing" events where a leopard enters a pen and panics, killing dozens of animals.</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-2">Handicraft Enterprises</h3>
                <p className="text-muted-foreground">Programs like Snow Leopard Enterprises train local women to make and sell wool crafts, tying community income directly to the presence of living snow leopards.</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-card/30 border border-border p-8 md:p-12 rounded-2xl text-center"
        >
          <h2 className="text-3xl font-serif text-accent mb-6">How You Can Help</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-left">
            <div>
              <h4 className="font-bold text-foreground mb-2">1. Support Community Programs</h4>
              <p className="text-sm text-muted-foreground">Donate to organizations funding predator-proof corrals and insurance schemes.</p>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-2">2. Buy Predator-Friendly</h4>
              <p className="text-sm text-muted-foreground">Purchase cashmere and wool products certified as snow-leopard friendly.</p>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-2">3. Reduce Carbon Footprint</h4>
              <p className="text-sm text-muted-foreground">Climate change is the ultimate threat to high-altitude habitats.</p>
            </div>
          </div>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90" size="lg" data-testid="button-donate">
            Take Action Today
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
