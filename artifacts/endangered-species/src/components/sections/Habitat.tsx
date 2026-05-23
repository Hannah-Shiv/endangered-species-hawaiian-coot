import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export function Habitat() {
  return (
    <div className="w-full min-h-screen pt-24 pb-12 px-6 md:px-12 bg-background overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-serif text-primary mb-4">Habitat & Location</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            The snow leopard's domain is the high mountains of Central and South Asia. It is a world of extremes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-card/30 p-8 rounded-2xl border border-border"
          >
            <h2 className="text-2xl font-serif text-accent mb-6">The 12 Range Countries</h2>
            <div className="flex flex-wrap gap-3">
              {['Afghanistan', 'Bhutan', 'China', 'India', 'Kazakhstan', 'Kyrgyzstan', 'Mongolia', 'Nepal', 'Pakistan', 'Russia', 'Tajikistan', 'Uzbekistan'].map(country => (
                <span key={country} className="px-4 py-2 bg-primary/10 text-primary-foreground border border-primary/20 rounded-full text-sm font-medium">
                  {country}
                </span>
              ))}
            </div>
            <p className="mt-6 text-muted-foreground text-sm">
              China contains as much as 60% of all snow leopard habitat areas.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="aspect-video rounded-2xl overflow-hidden border border-border relative">
              <img src="/src/assets/habitat.png" alt="Habitat" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent flex flex-col justify-end p-6">
                <h3 className="text-xl font-bold text-foreground">Alpine & Subalpine Zones</h3>
                <p className="text-muted-foreground">Steep, rocky, broken terrain with cliffs, ridges, and gullies.</p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h2 className="text-3xl font-serif text-center mb-8">Climate Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-card/50 border-border">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">-40°C to 20°C</div>
                <p className="text-muted-foreground uppercase text-xs tracking-wider">Temperature Range</p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-accent mb-2">3,000–4,500m</div>
                <p className="text-muted-foreground uppercase text-xs tracking-wider">Elevation Range</p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-secondary-foreground mb-2">200-400mm</div>
                <p className="text-muted-foreground uppercase text-xs tracking-wider">Annual Snowfall</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
