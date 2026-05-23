import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import habitatImg from "@/assets/habitat.png";

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
            The Hawaiian Coot's domain spans the fragile freshwater and brackish wetlands across the Hawaiian Islands.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-card/30 p-8 rounded-2xl border border-border"
          >
            <h2 className="text-2xl font-serif text-accent mb-6">Location & Biome</h2>
            <div className="flex flex-wrap gap-3 mb-6">
              {['Oahu', 'Maui', 'Kauai', 'Hawaii Island'].map(island => (
                <span key={island} className="px-4 py-2 bg-primary/10 text-primary-foreground border border-primary/20 rounded-full text-sm font-medium">
                  {island}
                </span>
              ))}
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              <strong>Biome:</strong> Freshwater wetlands, brackish coastal ponds, fishponds, taro (loi) fields, sewage treatment wetland ponds.
            </p>
            <p className="text-muted-foreground text-sm mb-4">
              <strong>Key Sites:</strong> Kanaha Pond (Maui), Kealia Pond (Maui), Hanalei NWR (Kauai), James Campbell NWR (Oahu), Pearl Harbor NWR (Oahu).
            </p>
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg mt-6">
              <p className="text-destructive font-bold">70% of original Hawaiian wetlands have been lost to development.</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="aspect-video rounded-2xl overflow-hidden border border-border relative">
              <img src={habitatImg} alt="Hawaiian Wetland Habitat" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent flex flex-col justify-end p-6">
                <h3 className="text-xl font-bold text-foreground">Hawaiian Wetlands</h3>
                <p className="text-muted-foreground">Freshwater ponds, taro fields, and lush tropical vegetation.</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="bg-card/50 border-border">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">21-32°C</div>
                <p className="text-muted-foreground uppercase text-xs tracking-wider">Year-round Temperature</p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-accent mb-2">500-2000mm</div>
                <p className="text-muted-foreground uppercase text-xs tracking-wider">Annual Rainfall</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}