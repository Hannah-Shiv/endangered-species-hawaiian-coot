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
            Our footprint has drastically reduced their habitat, but human intervention is now the only thing keeping them alive.
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
                <h3 className="text-xl font-bold text-destructive mb-2">Wetland Drainage</h3>
                <p className="text-foreground/80">Historical draining of wetlands for agriculture and modern coastal development has eliminated roughly 70% of Hawaii's natural wetlands.</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-2">Introduced Predators</h3>
                <p className="text-muted-foreground">Mongoose, rats, and feral cats brought by human settlement decimate ground-nesting birds.</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-2">Pollution & Disturbance</h3>
                <p className="text-muted-foreground">Pesticide runoff contaminates food sources, while recreational activities and off-leash dogs disturb critical nesting sites.</p>
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
                <h3 className="text-xl font-bold text-primary mb-2">Refuge Creation</h3>
                <p className="text-foreground/80">National Wildlife Refuges protect key remaining habitats, managing water levels actively to maximize breeding success.</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-2">Taro Farmer Partnerships</h3>
                <p className="text-muted-foreground">Collaborations with traditional taro (loi) farmers help maintain agricultural wetlands that serve as crucial secondary habitat.</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-2">Predator Control</h3>
                <p className="text-muted-foreground">Active trapping and fencing programs around major refuges provide safe havens for chicks to reach adulthood.</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8 text-left">
            <div>
              <h4 className="font-bold text-foreground mb-2">1. Support Wildlife Refuges</h4>
              <p className="text-sm text-muted-foreground">Donate or volunteer at local Hawaii wildlife refuges.</p>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-2">2. Manage Pets</h4>
              <p className="text-sm text-muted-foreground">Keep cats indoors and always keep dogs on leash near wetland areas.</p>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-2">3. Wetland Restoration</h4>
              <p className="text-sm text-muted-foreground">Participate in community wetland workday events.</p>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-2">4. Support TNR</h4>
              <p className="text-sm text-muted-foreground">Support trap-neuter-return programs for feral cat management.</p>
            </div>
            <div className="lg:col-span-2">
              <h4 className="font-bold text-foreground mb-2">5. Report Wildlife</h4>
              <p className="text-sm text-muted-foreground">Contact the Hawaii Wildlife Center if you spot injured or distressed waterbirds.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}