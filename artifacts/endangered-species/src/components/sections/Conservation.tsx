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
            Protecting the Hawaiian Coot requires constant vigilance: managing water, eliminating predators, and protecting land.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <Card className="bg-card/50 border-border hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-2">U.S. Fish & Wildlife Service</h3>
                <p className="text-sm text-muted-foreground mb-4">Manages critical National Wildlife Refuges including James Campbell, Kealia Pond, and Hanalei — the strongholds of coot recovery.</p>
                <Button variant="outline" className="w-full" data-testid="link-usfws">Visit Website</Button>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-2">Hawaii DOFAW</h3>
                <p className="text-sm text-muted-foreground mb-4">The Division of Forestry and Wildlife conducts biannual statewide waterbird surveys to track population trends.</p>
                <Button variant="outline" className="w-full" data-testid="link-dofaw">Visit Website</Button>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-2">Hawaii Wildlife Fund</h3>
                <p className="text-sm text-muted-foreground mb-4">A non-profit organization dedicated to native wildlife protection through education, research, and community action.</p>
                <Button variant="outline" className="w-full" data-testid="link-hwf">Visit Website</Button>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-2">The Nature Conservancy Hawaii</h3>
                <p className="text-sm text-muted-foreground mb-4">Works on landscape-level conservation protecting watersheds that feed coastal wetland ecosystems.</p>
                <Button variant="outline" className="w-full" data-testid="link-tnc">Visit Website</Button>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-3xl font-serif text-foreground mb-8">Recovery Progress Metrics</h2>
          
          <div className="space-y-8 bg-card/30 p-8 rounded-xl border border-border">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-foreground font-medium">Population Goal (5,000 birds)</span>
                <span className="text-primary font-bold">64% Achieved</span>
              </div>
              <Progress value={64} className="h-3 bg-secondary/30" />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-foreground font-medium">Wetland Restoration Target</span>
                <span className="text-primary font-bold">45% Restored</span>
              </div>
              <Progress value={45} className="h-3 bg-secondary/30" />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-foreground font-medium">Predator Control Coverage</span>
                <span className="text-primary font-bold">60% of Key Sites</span>
              </div>
              <Progress value={60} className="h-3 bg-secondary/30" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}