import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export function Conservation() {
  return (
    <div className="w-full min-h-screen pt-24 pb-12 px-6 md:px-12 bg-background overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-serif text-primary mb-6">Conservation & Solutions</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mb-12">
            A global effort is underway to save the ghost of the mountains, bridging borders, science, and local communities.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <Card className="bg-card/50 border-border hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&q=80" alt="Nature" className="w-full h-40 object-cover rounded-md mb-4 opacity-50 grayscale" />
                <h3 className="text-xl font-bold text-foreground mb-2">Snow Leopard Trust</h3>
                <p className="text-sm text-muted-foreground mb-4">The largest and oldest organization dedicated solely to protecting the endangered snow leopard and its habitat in 5 range countries.</p>
                <Button variant="outline" className="w-full" data-testid="link-slt">Visit Website</Button>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80" alt="Mountains" className="w-full h-40 object-cover rounded-md mb-4 opacity-50 grayscale" />
                <h3 className="text-xl font-bold text-foreground mb-2">WWF Snow Leopard</h3>
                <p className="text-sm text-muted-foreground mb-4">Focuses on reducing human-leopard conflict, monitoring populations, and combating illegal wildlife trade across the Himalayas.</p>
                <Button variant="outline" className="w-full" data-testid="link-wwf">Visit Website</Button>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="w-full h-40 bg-secondary/20 flex items-center justify-center rounded-md mb-4 border border-secondary/30">
                  <span className="text-2xl font-serif text-secondary">GSLEP</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Global Program</h3>
                <p className="text-sm text-muted-foreground mb-4">An unprecedented alliance of all 12 range countries, NGOs, and scientists working to secure 20 healthy snow leopard landscapes.</p>
                <Button variant="outline" className="w-full" data-testid="link-gslep">View Program</Button>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-3xl font-serif text-foreground mb-8">Success Metrics</h2>
          
          <div className="space-y-8 bg-card/30 p-8 rounded-xl border border-border">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-foreground font-medium">Predator-proof Corrals Built (Mongolia)</span>
                <span className="text-primary font-bold">150 / 200 Goal</span>
              </div>
              <Progress value={75} className="h-3 bg-secondary/30" />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-foreground font-medium">GPS Collars Deployed (Research)</span>
                <span className="text-primary font-bold">78 Active</span>
              </div>
              <Progress value={100} className="h-3 bg-secondary/30" />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-foreground font-medium">Habitat Protected under GSLEP</span>
                <span className="text-primary font-bold">25% of Range</span>
              </div>
              <Progress value={25} className="h-3 bg-secondary/30" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
